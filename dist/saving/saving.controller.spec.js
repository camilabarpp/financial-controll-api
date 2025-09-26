"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const saving_controller_1 = require("./saving.controller");
describe('SavingController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [saving_controller_1.SavingController],
        }).compile();
        controller = module.get(saving_controller_1.SavingController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=saving.controller.spec.js.map