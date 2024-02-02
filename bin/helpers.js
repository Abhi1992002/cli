"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textOperation = exports.cancelOperation = void 0;
const prompts_1 = require("@clack/prompts");
const cancelOperation = (value, message) => {
    if ((0, prompts_1.isCancel)(value)) {
        (0, prompts_1.cancel)(message);
        process.exit(0);
    }
};
exports.cancelOperation = cancelOperation;
const textOperation = async (message, placeholder, initialValue) => {
    await (0, prompts_1.text)({
        message: "What is the meaning of life?",
        placeholder: "Not sure",
        initialValue: "42",
        validate(value) {
            if (value.length === 0)
                return `Value is required!`;
        },
    });
};
exports.textOperation = textOperation;
