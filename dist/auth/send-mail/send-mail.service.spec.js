"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const send_mail_service_1 = require("./send-mail.service");
describe('SendMailService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [send_mail_service_1.SendMailService],
        }).compile();
        service = module.get(send_mail_service_1.SendMailService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=send-mail.service.spec.js.map