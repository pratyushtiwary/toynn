"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = __importDefault(require("./errors"));
const narray_1 = __importDefault(require("./narray"));
const utils_1 = __importDefault(require("./utils"));
const nn_1 = __importDefault(require("./nn"));
const functions_1 = __importDefault(require("./functions"));
const functions_2 = require("./functions");
exports.default = Object.assign(Object.assign({ errors: errors_1.default,
    NArray: narray_1.default,
    utils: utils_1.default }, nn_1.default), { functions: functions_1.default,
    ActivationFunction: functions_2.ActivationFunction });
//# sourceMappingURL=index.js.map