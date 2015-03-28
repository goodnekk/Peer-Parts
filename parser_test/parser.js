//this parses an HSFL(hyper shape finding language) file and translates it into an openSCAD file


var xml = require("node-xml");
var fs = require('fs');


var ir = {elem: "root", children:[]}; //intemediate representation
var currentElem = ir;

var output = ""; //final output file

var parser = new xml.SaxParser(function(cb){
    cb.onStartElementNS(function(elem, attrs, prefix, uri, namespaces) {
        console.log("=> Started: " + elem + " uri="+uri +" (Attributes: " + JSON.stringify(attrs) + " )");

        //parse attributes into object
        var attributes = {};
        for(var i in attrs){
            attributes[attrs[i][0]]=attrs[i][1];
        }

        var obj = {elem: elem, attrs: attributes, children:[], parent: currentElem};
        currentElem.children.push(obj);
        currentElem = obj;

    });
    cb.onEndElementNS(function(elem, prefix, uri) {
        console.log("<= End: " + elem + " uri="+uri + "\n");
        currentElem = currentElem.parent;

    });

    cb.onEndDocument(function() {
        generate_openSCAD(ir);
        fs.writeFile("output.scad",output);
    });
});

function generate_openSCAD(elem){

    if(elem.elem=="cube"){
        output += "cube(["+elem.attrs.x+","+elem.attrs.y+","+elem.attrs.z+"]);"
    }

    if(elem.elem=="translate"){
        output += "translate(["+elem.attrs.x+","+elem.attrs.y+","+elem.attrs.z+"]){"
    }

    for(var i in elem.children){
        generate_openSCAD(elem.children[i]);
    }

    if(elem.elem=="translate"){
        output += "}"
    }


}

parser.parseFile("input_test.hsfl");
