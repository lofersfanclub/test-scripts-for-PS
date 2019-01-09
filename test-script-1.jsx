
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
  scaleImage();
}

// New UI window
var cal = new Window ("dialog", "Blah!");
var cal_char = cal.add("edittext", [25,40,135,60], "asdf");
var slider0 = cal.add('slider', undefined, 50,0,200);
var dropdown = cal.add("dropdownlist", undefined, ["A", "B", "C"]);

// buttons
var btnGroup = cal.add ("group");
btnGroup.orientation = "row";
btnGroup.alignment = "center";
btnGroup.add ("button", undefined, "OK");
btnGroup.add ("button", undefined, "Cancel", {name:'close'});
cal.center();

var myReturn = cal.show();
alert(myReturn);

if (myReturn == 1)
{
    // set checkboxes and input here
    var chars = cal_char.text;
    var slider = slider0.value;
    alert("You wrote: '" + chars + "' with the value: " + slider);
}
else {
    alert(myReturn);
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
            layer.name.replace('-@1', '');
            css = css + ' #' + layer.name + '{ background: url("images/' + layer.name + '.png");' + cover + ' }';
            html = html + '<div id="' + layer.name + '" class="pos size"></div>';
        }
        if (str.indexOf(doubleVal) != -1) {
            var newName = layer.name.replace(/\@2/, '');
            alert('Save size x2: ' + newName);
            css = css + ' #' + newName + '{ background: url("images/' + newName + '.png");' + cover + ' }';
            html = html + '<div id="' + newName + '" class="pos size"></div>';
        }
        if (str.indexOf(trimVal) != -1) {
            layer.name.replace('-@trim', '');
            var layerWidth = layer.bounds[2].value - layer.bounds[0].value;
            var layerHeight = layer.bounds[3].value - layer.bounds[1].value;
            css = css + ' #' + layer.name + '{' + cover + ' left: ' + layer.bounds[0].value + 'px;' + ' top: ' + layer.bounds[1].value + 'px;' + ' width: ' + layerWidth + 'px;' + ' height: ' + layerHeight + 'px; }';
            html = html + '<div id="' + layer.name + '" class="pos"></div>';
            alert('CSS: ' + css);
            saveImage(layer.name);
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


var LetterCase = {
    KEEP: 1,
    LOWERCASE: 2,
    UPPERCASE: 3,

    values: function () {
        return [this.KEEP, this.LOWERCASE, this.UPPERCASE];
    },

    forIndex: function (index) {
        return this.values()[index];
    },

    getIndex: function (value) {
        return indexOf(this.values(), value);
    },

    toExtensionType: function (value) {
        switch (value) {

            case this.KEEP:
                return Extension.NONE;

            case this.LOWERCASE:
                return Extension.LOWERCASE;

            case this.UPPERCASE:
                return Extension.UPPERCASE;

            default:
                return Extension.NONE;
        }
    }
};

function exportPng24AM(fileName, options) {
    var desc = new ActionDescriptor(),
        desc2 = new ActionDescriptor();
    desc2.putEnumerated(app.charIDToTypeID("Op  "), app.charIDToTypeID("SWOp"), app.charIDToTypeID("OpSa"));
    desc2.putEnumerated(app.charIDToTypeID("Fmt "), app.charIDToTypeID("IRFm"), app.charIDToTypeID("PN24"));
    // desc2.putBoolean(app.charIDToTypeID("Intr"), options.interlaced);
    // desc2.putBoolean(app.charIDToTypeID("Trns"), options.transparency);
    // desc2.putBoolean(app.charIDToTypeID("Mtt "), true);
    // desc2.putInteger(app.charIDToTypeID("MttR"), options.matteColor.red);
    // desc2.putInteger(app.charIDToTypeID("MttG"), options.matteColor.green);
    // desc2.putInteger(app.charIDToTypeID("MttB"), options.matteColor.blue);
    desc2.putBoolean(app.charIDToTypeID("SHTM"), false);
    desc2.putBoolean(app.charIDToTypeID("SImg"), true);
    desc2.putBoolean(app.charIDToTypeID("SSSO"), false);
    desc2.putList(app.charIDToTypeID("SSLt"), new ActionList());
    desc2.putBoolean(app.charIDToTypeID("DIDr"), false);
    desc2.putPath(app.charIDToTypeID("In  "), new File("savedImage"));
    desc.putObject(app.charIDToTypeID("Usng"), app.stringIDToTypeID("SaveForWeb"), desc2);
    app.executeAction(app.charIDToTypeID("Expr"), desc, DialogModes.NO);
}


// Settings

var USER_SETTINGS_ID = "exportLayersToFilesCustomDefaultSettings";
var DEFAULT_SETTINGS = {
    // common
    topGroupAsLayer: app.stringIDToTypeID("topGroupAsLayer"),
    topGroupAsFolder: app.stringIDToTypeID("topGroupAsFolder"),
    destination: app.stringIDToTypeID("destFolder"),
    overwrite: app.stringIDToTypeID("overwrite"),
    exportLayerTarget: app.stringIDToTypeID("exportLayerTarget"),
    nameFiles: app.stringIDToTypeID("nameFiles"),
    allowSpaces: app.stringIDToTypeID("allowSpaces"),
    letterCase: app.stringIDToTypeID("letterCase"),
    outputPrefix: app.stringIDToTypeID("outputPrefix"),
    outputSuffix: app.stringIDToTypeID("outputSuffix"),
    trim: app.stringIDToTypeID("trim"),
    scale: app.stringIDToTypeID("scale"),
    scaleValue: app.stringIDToTypeID("scaleValue"),
    exportBackground: app.stringIDToTypeID("exportBackground"),
    exportForeground: app.stringIDToTypeID("exportForeground"),
    fileType: app.stringIDToTypeID("fileType"),
    forceTrimMethod: app.stringIDToTypeID("forceTrimMethod"),
    groupsAsFolders: app.stringIDToTypeID("groupsAsFolders"),
    ignoreLayersString: app.stringIDToTypeID('ignoreLayersString'),
    ignoreLayers: app.stringIDToTypeID('ignoreLayers'),
    padding: app.stringIDToTypeID("padding"),
    paddingValue: app.stringIDToTypeID("paddingValue")
};


// user preferences
prefs = new Object();
prefs.format = "PNG-24";
prefs.fileExtension = "";
try {
    prefs.filePath = app.activeDocument.path;
} catch (e) {
    prefs.filePath = Folder.myDocuments;
}
prefs.formatArgs = new ExportOptionsSaveForWeb();
prefs.exportLayerTarget = "";
prefs.outputPrefix = "";
prefs.outputSuffix = "";
prefs.naming = "";
prefs.namingLetterCase = LetterCase.KEEP;
prefs.replaceSpaces = true;
prefs.delimiter = '_';
prefs.bgLayer = false;
prefs.fgLayer = false;
prefs.trim = "";
prefs.scale = false;
prefs.scaleValue = 200;
prefs.forceTrimMethod = false;
prefs.groupsAsFolders = true;
prefs.overwrite = false;
prefs.padding = false;
prefs.paddingValue = 1;
prefs.ignoreLayersString = "!";
prefs.ignoreLayers = false;



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

function saveImage(fileName) {
    if (prefs.formatArgs instanceof ExportOptionsSaveForWeb) {
        // Document.exportDocument() is unreliable -- it ignores some of the export options.
        // Avoid it if possible.
        switch (prefs.format) {

            case "PNG-24":
                exportPng24AM(fileName, prefs.formatArgs);
                break;

            case "PNG-8":
                exportPng8AM(fileName, prefs.formatArgs);
                break;

            default:
                app.activeDocument.exportDocument(fileName, ExportType.SAVEFORWEB, prefs.formatArgs);
                break;
        }
    } else {
        app.activeDocument.saveAs(fileName, prefs.formatArgs, true, LetterCase.toExtensionType(prefs.namingLetterCase));
    }

    return true;
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