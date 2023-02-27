// Canvas
let screen = document.getElementById("screen");
let screenctx = screen.getContext("2d", {alpha: false});

// info
let infoDiv = document.getElementById("info");
let exampleDiv = document.getElementById("example");

let chardispDivs = "";
for(let i = 0; i < 256; i++){
	chardispDivs += `<div class="chardisp" value="${i}">${String.fromCharCode(i)}</div>`;
}
exampleDiv.innerHTML = chardispDivs;

let px = 20,
    x = 0, y = 0;

screenctx.canvas.width = px*8;
screenctx.canvas.height = px*16;

let currentLetter = 0;
let fontDict = {};
let charBuf;
renderFont();
selectChar();

// Mouse
let mbutton=0;

// Mouse
screen.addEventListener("mousedown", function(e) {
	let xTmp = Math.floor(x/px), yTmp = Math.floor(y/px);
	switch (e.button) {
		case 0:
			mbutton |= 1;
			setCell(xTmp, yTmp, 1);
		break;
		case 2:
			mbutton |= 4;
			setCell(xTmp, yTmp, 0);
		break;
	}
});

screen.addEventListener("pointermove",function(e) {
	x = e.offsetX, y = e.offsetY;

	let events = e.getCoalescedEvents();
	if(mbutton == 1 || mbutton == 4){
		let state = 0;
		if(mbutton == 1)
			state = 1;

		for(let i = 0; i < events.length; i++){
			let x = events[i].offsetX, y = events[i].offsetY;
			let xTmp = Math.floor(x/px), yTmp = Math.floor(y/px);

			setCell(xTmp, yTmp, state);
		}
	}

});

window.addEventListener("mouseup", function(e) {
	switch (e.button) {
		case 0:
			mbutton &= ~1;
		break;
		case 2:
			mbutton &= ~4;
		break;
	}
});

function selectChar(e){
	if(e){
		currentLetter = +e.target.getAttribute("value");
	}else{
		currentLetter = 65;
	}

	charBuf = fontDict[currentLetter] ??= new Uint8Array(8*16);

	info.innerText = 
	`
	char code: ${currentLetter}
	current letter: ${String.fromCharCode(currentLetter)}
	characters: ${Object.keys(fontDict)}
	`
}

function setCell(x, y, v){
	if(x < 0) x = 0;
	if(x >= 8) x = 7;
	if(y < 0) y = 0;
	if(y >= 16) y = 15;
	charBuf[x + 8*y] = v;
}

function drawLine(x1, y1, x2, y2) {
	screenctx.moveTo(x1, y1);
	screenctx.lineTo(x2, y2);
}

function drawGrid(){
	screenctx.beginPath();
	let xa = 0, ya = 0;
	for(let dimPos = 0; dimPos < screenctx.canvas.width + px; dimPos+=px)
		drawLine(dimPos+xa,0,dimPos+xa,screenctx.canvas.height);
	
	for(let dimPos = 0;dimPos < screenctx.canvas.height + px; dimPos+=px)
		drawLine(0,dimPos+ya,screenctx.canvas.width,dimPos+ya);
	
	screenctx.stroke();
}

function draw(){
	{ //clear
		screenctx.clearRect(0, 0, screenctx.canvas.width, screenctx.canvas.height);
	}

	{ //cells
		screenctx.fillStyle = "#ffffff";
		for(let i = 0; i < 16; i++)
			for(let j = 0; j < 8; j++)
				if(charBuf[j + 8*i])
					screenctx.fillRect(j*px, i*px, px, px);
	}

	screenctx.fillStyle = "#999999";
	{ //highlighted cell
        	screenctx.fillRect(
			Math.floor(x/px)*px, 
			Math.floor(y/px)*px,
			px,px
		);
	}

	screenctx.fillStyle = "#ffffff";
	screenctx.strokeStyle = "#222222";
	screenctx.lineWidth = px/50;
	drawGrid();


	requestAnimationFrame(draw);
}

draw();
