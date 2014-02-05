var fs = require("fs")
var path = require("path")
var compile = require("./compiler")

var burn = require("./burn")
var compatible = require("./compatible")
var darken = require("./darken")
var difference = require("./difference")
var dodge = require("./dodge")
var exclusion = require("./exclusion")
var hardlight = require("./hardlight")
var lighten = require("./lighten")
var multiply = require("./multiply")
var normal = require("./normal")
var overlay = require("./overlay")
var screen = require("./screen")
var softlight = require("./softlight")

var fileExport = {
    burn: burn,
    compatible: compatible,
    darken: darken,
    difference: difference,
    dodge: dodge,
    exclusion: exclusion,
    hardlight: hardlight,
    lighten: lighten,
    multiply: multiply,
    normal: normal,
    overlay: overlay,
    screen: screen,
    softlight: softlight
}

var exp = "module.exports = "

// Compile each shader and write it to the result directory
for (var shader in fileExport) {
    var shaderString = exp + compile(fileExport[shader]).toString() + "\n"
    fs.writeFile(path.join(__dirname, "result/", shader + ".js"), shaderString)
}
