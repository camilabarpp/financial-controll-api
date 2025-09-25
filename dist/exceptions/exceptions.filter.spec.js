"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionsFilter = void 0;
const exceptions_filter_1 = require("./exceptions.filter");
Object.defineProperty(exports, "ExceptionsFilter", { enumerable: true, get: function () { return exceptions_filter_1.QueryFailedExceptionFilter; } });
describe('ExceptionsFilter', () => {
    it('should be defined', () => {
        expect(new exceptions_filter_1.QueryFailedExceptionFilter()).toBeDefined();
    });
});
//# sourceMappingURL=exceptions.filter.spec.js.map