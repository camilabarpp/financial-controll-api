"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavingTransactionSchema = exports.SavingTransaction = exports.SavingTransactionResponse = void 0;
class SavingTransactionResponse {
    id;
    type;
    value;
    date;
    description;
}
exports.SavingTransactionResponse = SavingTransactionResponse;
var saving_transaction_schema_1 = require("./saving.transaction.schema");
Object.defineProperty(exports, "SavingTransaction", { enumerable: true, get: function () { return saving_transaction_schema_1.SavingTransaction; } });
var saving_transaction_schema_2 = require("./saving.transaction.schema");
Object.defineProperty(exports, "SavingTransactionSchema", { enumerable: true, get: function () { return saving_transaction_schema_2.SavingTransactionSchema; } });
//# sourceMappingURL=saving.transaction.js.map