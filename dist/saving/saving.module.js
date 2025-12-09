"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavingModule = void 0;
const common_1 = require("@nestjs/common");
const saving_controller_1 = require("./saving.controller");
const saving_service_1 = require("./saving.service");
const saving_schema_1 = require("./type/saving.schema");
const saving_transaction_schema_1 = require("./type/saving.transaction.schema");
const mongoose_1 = require("@nestjs/mongoose");
const passport_1 = require("@nestjs/passport");
const saving_repository_1 = require("./repositories/saving.repository");
const saving_transaction_repository_1 = require("./repositories/saving.transaction.repository");
let SavingModule = class SavingModule {
};
exports.SavingModule = SavingModule;
exports.SavingModule = SavingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: saving_schema_1.Saving.name, schema: saving_schema_1.SavingSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: saving_transaction_schema_1.SavingTransaction.name, schema: saving_transaction_schema_1.SavingTransactionSchema }]),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' })
        ],
        controllers: [saving_controller_1.SavingController],
        providers: [saving_service_1.SavingService, saving_repository_1.SavingRepository, saving_transaction_repository_1.SavingTransactionRepository],
    })
], SavingModule);
//# sourceMappingURL=saving.module.js.map