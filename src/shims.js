import CodeMirror from "../modules/codemirror/lib/codemirror.js";
import BE from "../modules/break_eternity.js";
import Vue from "../modules/vue.js";

import "../modules/codemirror/addon/mode/simple.js";
import "../modules/codemirror/addon/hint/show-hint.js";
import "../modules/codemirror/addon/lint/lint.js";
import "../modules/codemirror/addon/selection/active-line.js";
import "../modules/codemirror/addon/edit/closebrackets.js";

window.CodeMirror = CodeMirror;
window.BE = BE;
window.Vue = Vue;
