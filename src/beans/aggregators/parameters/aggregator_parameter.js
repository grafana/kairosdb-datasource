"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AggregatorParameter = /** @class */ (function () {
    function AggregatorParameter(name, text, value) {
        if (text === void 0) { text = name; }
        if (value === void 0) { value = null; }
        this.name = name;
        this.text = text;
        this.value = value;
    }
    return AggregatorParameter;
}());
exports.AggregatorParameter = AggregatorParameter;
