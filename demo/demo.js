import { Yord } from '../build/module/yord.js';
import { Fonts } from '../build/module/fonts.js';

"use strict";

var yord;

export function init() {
    var content = document.getElementById("content");
    yord = new Yord(content);
    fillFontFamilyList();
    yord.loadDocxFromUrl('./demo.docx');
}

export function onFontChanged() {
    var fontFamilyElement = document.getElementById("font-family");
    var fontFamily = fontFamilyElement.options[fontFamilyElement.selectedIndex].value;
    var fontSize = document.getElementById("font-size").value;
    // TODO: Re-implement yord.updateFont(fontFamily, fontSize);
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