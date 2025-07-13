"use strict";
exports.__esModule = true;
exports.varNameToLabel = void 0;
var effect_1 = require("effect");
var _ = require("lodash");
var startCase = _.startCase, toLower = _.toLower;
var varNameToLabel = function (varName) {
    // _.startCase(_.toLower(str));
    var x = effect_1.pipe(varName, toLower, startCase);
    return x;
};
exports.varNameToLabel = varNameToLabel;
var example = exports.varNameToLabel('myVarName');
console.log(example); // My Var Name
