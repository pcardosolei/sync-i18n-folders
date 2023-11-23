"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypeName = exports.areSameTypes = exports.isObject = void 0;
function isObject(value) {
    return getTypeName(value) === "Object";
}
exports.isObject = isObject;
function areSameTypes(value, otherValue) {
    return getTypeName(value) === getTypeName(otherValue);
}
exports.areSameTypes = areSameTypes;
function getTypeName(object) {
    const fullName = Object.prototype.toString.call(object);
    return fullName.split(" ")[1].slice(0, -1);
}
exports.getTypeName = getTypeName;
