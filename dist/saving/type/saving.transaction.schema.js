"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavingTransactionSchema = exports.SavingTransaction = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let SavingTransaction = class SavingTransaction extends mongoose_2.Document {
    type;
    value;
    date;
    description;
    saving;
};
exports.SavingTransaction = SavingTransaction;
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['INCOME', 'EXPENSE'] }),
    __metadata("design:type", String)
], SavingTransaction.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], SavingTransaction.prototype, "value", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], SavingTransaction.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SavingTransaction.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Saving', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SavingTransaction.prototype, "saving", void 0);
exports.SavingTransaction = SavingTransaction = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], SavingTransaction);
exports.SavingTransactionSchema = mongoose_1.SchemaFactory.createForClass(SavingTransaction);
exports.SavingTransactionSchema.index({ saving: 1, date: -1 });
//# sourceMappingURL=saving.transaction.schema.js.map