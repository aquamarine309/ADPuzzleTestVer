import CodeMirror from "../modules/codemirror/lib/codemirror.js";
import Decimal from "../modules/break_infinity.js";
import Vue from "../modules/vue.js";

import "../modules/codemirror/addon/mode/simple.js";
import "../modules/codemirror/addon/hint/show-hint.js";
import "../modules/codemirror/addon/lint/lint.js";
import "../modules/codemirror/addon/selection/active-line.js";
import "../modules/codemirror/addon/edit/closebrackets.js";

window.CodeMirror = CodeMirror;
window.Decimal = Decimal;
window.Vue = Vue;
