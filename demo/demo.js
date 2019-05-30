import { SvgRenderer } from '../build/module/svg-renderer.js';
import { Fonts } from '../build/module/fonts.js';
import { Package } from '../build/module/package.js';

"use strict";

var renderer;

function writeAllText(svg) {
    var fontFamilyElement = document.getElementById("font-family");
    var fontFamily = fontFamilyElement.options[fontFamilyElement.selectedIndex].value;
    var fontSize = document.getElementById("font-size").value;
    var text = document.getElementById("text").textContent;
    var x = 20;
    var posY = renderer.flowText(svg, text, fontFamily, fontSize, x, x);
    posY = renderer.flowText(svg, text, fontFamily, fontSize, x, posY);
    posY = renderer.flowText(svg, " ", fontFamily, fontSize, x, posY);
    posY = renderer.flowText(svg, text, fontFamily, fontSize, x, posY);
}

export function init() {
    var content = document.getElementById("content");
    renderer = new SvgRenderer(content);
    fillFontFamilyList();
    Package.loadFromUrl('./demo.docx').then((pack) => {
        writeAllText(svg);
    });
}

function clearSvg(svg) {
    while (svg.lastChild) {
        svg.removeChild(svg.lastChild);
    }
}

export function onFontChanged() {
    var svg = document.getElementById("svg");
    clearSvg(svg);
    writeAllText(svg);
}

function fillFontFamilyList() {
    var families = Fonts.availableFonts();
    var select = document.getElementById("font-family");
    families.forEach((family) => {
        var option = document.createElement("option");
        option.text = family;
        option.value = family;
        select.add(option);
    });
}