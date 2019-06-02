import { Yord } from '../build/module/yord.js';

"use strict";

var yord;

export function init() {
    var content = document.getElementById("content");
    yord = new Yord(content);
    yord.loadDocxFromUrl('./demo.docx');
}
