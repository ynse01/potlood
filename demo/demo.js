import { SvgRenderer } from '../build/module/svg-renderer.js';
import { Fonts } from '../build/module/fonts.js';
import { Package } from '../build/module/package.js';
import { WordDocument } from '../build/module/word-document.js';

"use strict";

var renderer;
var texts = [];

function writeAllText() {
    var fontFamilyElement = document.getElementById("font-family");
    var fontFamily = fontFamilyElement.options[fontFamilyElement.selectedIndex].value;
    var fontSize = document.getElementById("font-size").value;
    var x = 20;
    var posY = 20;
    texts.forEach((text) => {
        posY = renderer.flowText(text, fontFamily, fontSize, x, posY);
    });
}

export function init() {
    var content = document.getElementById("content");
    renderer = new SvgRenderer(content);
    fillFontFamilyList();
    Package.loadFromUrl('./demo.docx').then((pack) => {
        pack.loadPart('word/document.xml').then(part => {
            const doc = new WordDocument(part);
            doc.parseContent();
            doc.paragraphs.forEach(par => {
                texts.push(...par.texts);
            });
            writeAllText(svg);
        });
    });
}

export function onFontChanged() {
    renderer.clear();
    writeAllText();
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