"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const transaction_controller_1 = require("./transaction.controller");
describe('TransactionController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [transaction_controller_1.TransactionController],
        }).compile();
        controller = module.get(transaction_controller_1.TransactionController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=transaction.controller.spec.js.map