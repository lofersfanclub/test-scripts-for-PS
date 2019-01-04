
// enable double-clicking from Mac Finder or Windows Explorer
// this command only works in Photoshop CS2 and higher
#target photoshop

// bring application forward for double-click events
app.bringToFront();

var doc = activeDocument;
var css = "";
var html = "";

var cover = "-webkit-background-size: cover; background-size: cover;";

///////////////////////////////////////////////////////////////////////////////
// main - main function
///////////////////////////////////////////////////////////////////////////////
function main() {
  loopLayers(doc);
}

function loopLayers(ref){
    var layers = ref.layers;
    var len = layers.length;
    for (var i = 0; i < len; i++) {
        var layer = layers[i];
		if (layer.typename == 'LayerSet') {
            loopLayers(layer);
        }
        var str = layer.name;
        var orgVal = "@1";
        var doubleVal = "@2";
        var trimVal = "@trim";
        if (str.indexOf(orgVal) != -1) {
            alert('Save size x1: ' + layer.name);
            var orgLayer = layer.name.replace(/\@1/, '');
            css = css + ' #' + orgLayer + '{ background: url("images/' + orgLayer + '.png");' + cover + ' }';
            html = html + '<div id="' + orgLayer + '" class="pos size"></div>';
        }
        if (str.indexOf(doubleVal) != -1) {
            var doubleLayer = layer.name.replace(/\@2/, '');
            alert('Save size x2: ' + doubleLayer);
            css = css + ' #' + doubleLayer + '{ background: url("images/' + doubleLayer + '.png");' + cover + ' }';
            html = html + '<div id="' + doubleLayer + '" class="pos size"></div>';
        }
        if (str.indexOf(trimVal) != -1) {
            var trimLayer = layer.name.replace(/\@trim/, '');
            var layerWidth = layer.bounds[2].value - layer.bounds[0].value;
            var layerHeight = layer.bounds[3].value - layer.bounds[1].value;
            css = css + ' #' + trimLayer + '{' + cover + ' left: ' + layer.bounds[0].value + 'px;' + ' top: ' + layer.bounds[1].value + 'px;' + ' width: ' + layerWidth + 'px;' + ' height: ' + layerHeight + 'px; }';
            html = html + '<div id="' + trimLayer + '" class="pos"></div>';
            alert('CSS: ' + css);
        }
    }
    saveTxt(css, "css");
    saveTxt(html, "html");
}

function saveTxt(txt, type) {
    var Name = app.activeDocument.name.replace(/\.[^\.]+$/, '');
    var Ext = decodeURI(app.activeDocument.name).replace(/^.*\./, '');
    if (Ext.toLowerCase() != 'psd')
        return;

    var Path = app.activeDocument.path;
    if (type == "css") {
        var saveFile = File(Path + "/" + Name + ".css");
    }
    if (type == "html") {
        var saveFile = File(Path + "/" + Name + ".html");
    }

    if (saveFile.exists)
        saveFile.remove();

    saveFile.encoding = "UTF8";
    saveFile.open("e", "TEXT", "????");
    saveFile.writeln(txt);
    saveFile.close();
    
}

function scaleImage() {
    var width = app.activeDocument.width.as("px") * (prefs.scaleValue / 100);
    app.activeDocument.resizeImage(UnitValue(width, "px"), null, null, ResampleMethod.BICUBICSHARPER);
}

function addPadding() {
    oldH = app.activeDocument.height.as("px");
    oldW = app.activeDocument.width.as("px");

    var width = (app.activeDocument.width.as("px")) + (prefs.paddingValue * 2);
    var height = (app.activeDocument.height.as("px")) + (prefs.paddingValue * 2);
    var widthUnit = new UnitValue(width + " pixels");
    var heightUnit = new UnitValue(height + " pixels");

    app.activeDocument.resizeCanvas(widthUnit, heightUnit, AnchorPosition.MIDDLECENTER);
}


///////////////////////////////////////////////////////////////////////////////
// isCorrectVersion - check for Adobe Photoshop CS2 (v9) or higher
///////////////////////////////////////////////////////////////////////////////
function isCorrectVersion() {
    if (parseInt(version, 10) >= 9) {
        return true;
    }
    else {
        alert('This script requires Adobe Photoshop CS2 or higher.', 'Wrong Version', false);
        return false;
    }
}

///////////////////////////////////////////////////////////////////////////////
// isOpenDocs - ensure at least one document is open
///////////////////////////////////////////////////////////////////////////////
function isOpenDocs() {
	if (documents.length) {
		return true;
	}
	else {
		alert('There are no documents open.', 'No Documents Open', false);
		return false;
	}
}

///////////////////////////////////////////////////////////////////////////////
// hasLayers - ensure that the active document contains at least one layer
///////////////////////////////////////////////////////////////////////////////
function hasLayers() {
	var doc = activeDocument;
	if (doc.layers.length == 1 && doc.activeLayer.isBackgroundLayer) {
		alert('The active document has no layers.', 'No Layers', false);
		return false;
	}
	else {
		return true;
	}
}

///////////////////////////////////////////////////////////////////////////////
// showError - display error message if something goes wrong
///////////////////////////////////////////////////////////////////////////////
function showError(err) {
	if (confirm('An unknown error has occurred.\n' +
		'Would you like to see more information?', true, 'Unknown Error')) {
			alert(err + ': on line ' + err.line, 'Script Error', true);
	}
}


// test initial conditions prior to running main function
if (isCorrectVersion() && isOpenDocs() && hasLayers()) {
	try {
		// suspend history for CS3 (v10) or higher
		if (parseInt(version, 10) >= 10) {
			activeDocument.suspendHistory('Find Layer', 'main()');
		}
		// just run main for CS2 (v9)
		else {
			main();
		}
	}
	catch(e) {
		// don't report error on user cancel
		if (e.number != 8007) {
			showError(e);
		}
	}
}