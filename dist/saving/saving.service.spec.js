"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const saving_service_1 = require("./saving.service");
describe('SavingService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [saving_service_1.SavingService],
        }).compile();
        service = module.get(saving_service_1.SavingService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=saving.service.spec.js.map