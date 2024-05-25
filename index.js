"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optimizers = exports.functions = exports.utils = exports.NArray = exports.errors = void 0;
const errors_1 = __importDefault(require("./errors"));
exports.errors = errors_1.default;
const narray_1 = __importDefault(require("./narray"));
exports.NArray = narray_1.default;
const utils_1 = __importDefault(require("./utils"));
exports.utils = utils_1.default;
const functions_1 = __importDefault(require("./functions"));
exports.functions = functions_1.default;
const optimizers_1 = __importDefault(require("./optimizers"));
exports.optimizers = optimizers_1.default;
const nn_1 = __importDefault(require("./nn"));
const dataset_1 = __importDefault(require("./dataset"));
__exportStar(require("./nn"), exports);
__exportStar(require("./dataset"), exports);
exports.default = Object.assign(Object.assign(Object.assign({ errors: errors_1.default,
    NArray: narray_1.default,
    utils: utils_1.default }, nn_1.default), dataset_1.default), { functions: functions_1.default,
    optimizers: optimizers_1.default });
