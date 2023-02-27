
function renderFontHex(fontdict){
	let res = "";
	for(let glyph in fontdict){
		res += (+glyph | (1<<16)).toString(16).slice(-4) + ":";
		let cur = fontdict[glyph];
		console.log(cur);
		let i = 0;
		while(i < cur.length){
			let hex = 8*cur[i] + 4*cur[i+1] + 2*cur[i+2] + cur[i+3];
			res += hex.toString(16);
			i+=4;
		}
		res+="\n";
	}
	return res;
}

async function main(hex){
    const Module = await createModule()
    Module.FS.writeFile("font.hex", hex);
    Module.callMain(['hex=font.hex', 'out=font.otf', 'format=cff2'])
    let res = Module.FS.readFile("font.otf");
    return res;
}

function renderFont(){
	main(renderFontHex(fontDict)).then((v)=>{
	    let font = new FontFace("bmfont", v);
	    document.fonts.add(font);
	})
}

/* stack overflow code */
var downloadBlob, downloadURL;

downloadBlob = function(data, fileName, mimeType) {
  var blob, url;
  blob = new Blob([data], {
    type: mimeType
  });
  url = window.URL.createObjectURL(blob);
  downloadURL(url, fileName);
  setTimeout(function() {
    return window.URL.revokeObjectURL(url);
  }, 1000);
};

downloadURL = function(data, fileName) {
  var a;
  a = document.createElement('a');
  a.href = data;
  a.download = fileName;
  document.body.appendChild(a);
  a.style = 'display: none';
  a.click();
  a.remove();
};

function downloadFont(){
	main(renderFontHex(fontDict)).then((v)=>{
		downloadBlob(v, "bmfont.otf", "application/octet-stream");
	});
}

function downloadHex(){
	downloadBlob(renderFontHex(fontDict), "bmfont.hex", "application/octet-stream");
}
