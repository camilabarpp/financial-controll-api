"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeRegex = escapeRegex;
exports.buildSort = buildSort;
function escapeRegex(text) {
    return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
function buildSort(sort) {
    if (sort === "ASC" || sort === "DESC") {
        return {
            amount: sort === "ASC" ? 1 : -1,
            date: -1,
            _id: -1,
        };
    }
    else {
        return {
            date: -1,
            _id: -1,
        };
    }
}
//# sourceMappingURL=utils.js.map