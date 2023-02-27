
function renderFontHex(fontdict){
	let res = "";
	for(let glyph in fontdict){
		res += (+glyph | (1<<16)).toString(16).slice(-4) + ":";
		let cur = fontdict[glyph];
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

/*
for less bad font files impliment this cos

./hex2otf hex=fsf out=font.otf format=cff,gpos 0="i made this" 1=cosfont 2=Regular 3="cos's wacky retro font" 4="cos's 8x16 inspired font" 5="-1" 6="cos's 8x16 inspired font" 7="co
s:TM:" 8="cos" 9="cos" 10="cos's cool fun font" 11="cospplredman.github.io/bmfont" 12="cospplredman.github.io/bmfont" 13="font gang" 14="bro trust me" 18="cos's verry cool 8x16 font that you should deffinetly use"
 19="According to all known laws of aviation, bees should not be able to fly"
*/

let nameTable = [`0="i made this"`, `1=cosfont`, `2=Regular`, `3="cos's wacky retro font"`, `4="cos's 8x16 inspired font"`, `5="-1"`, `6="cos's 8x16 inspired font"`, `7="cos:TM:"`, `8="cos"`, `9="cos"`, `10="cos's cool fun font"`, `11="cospplredman.github.io/bmfont"`, `12="cospplredman.github.io/bmfont"`, `13="font gang"`, `14="bro trust me"`, `18="cos's verry cool 8x16 font that you should deffinetly use"`, 
 `19="According to all known laws of aviation, bees should not be able to fly"
`]

async function main(hex, format = ["format=cff2,gpos"], nametable = nameTable){
    const Module = await createModule()
    Module.FS.writeFile("font.hex", hex);
    Module.callMain(['hex=font.hex', 'out=font', ...format, ...nametable])
    let res = Module.FS.readFile("font");
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

function downloadFontWeb(){
	main(renderFontHex(fontDict)).then((v)=>{
		downloadBlob(v, "bmfont.otf", "application/octet-stream");
	});
}

function downloadFont(){
	main(renderFontHex(fontDict), ["format=cff,gpos"]).then((v)=>{
		downloadBlob(v, "bmfont.otf", "application/octet-stream");
	});
}

function downloadFontTTF(){
	main(renderFontHex(fontDict), ["format=truetype,gpos"]).then((v)=>{
		downloadBlob(v, "bmfont.otf", "application/octet-stream");
	});
}

function downloadHex(){
	downloadBlob(renderFontHex(fontDict), "bmfont.hex", "application/octet-stream");
}
