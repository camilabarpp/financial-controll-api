import { SendMailService } from './send-mail.service';
export declare class SendMailController {
    private readonly sendMailService;
    constructor(sendMailService: SendMailService);
    sendRecoverPasswordEmail(email: string): Promise<{
        message: string;
    }>;
    confirmEmail(token: string): Promise<{
        message: string;
    }>;
}
