"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegExHelper = void 0;
const password = '(?=^.{8,10}$)(?=.*\\d)(?=.*[AZ])(?=.*[ !@ #$%^ &*()_+}{":;\'?/>.<,])(?!.*\\s).*$';
exports.RegExHelper = {
    password,
};
//# sourceMappingURL=regex.helper.js.map