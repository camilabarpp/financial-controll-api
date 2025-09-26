"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const transaction_service_1 = require("./transaction.service");
describe('TransactionService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [transaction_service_1.TransactionService],
        }).compile();
        service = module.get(transaction_service_1.TransactionService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=transaction.service.spec.js.map