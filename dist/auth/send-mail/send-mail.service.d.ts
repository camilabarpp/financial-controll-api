import { User } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
export declare class SendMailService {
    private readonly userRepository;
    private readonly registerService;
    private jwtService;
    private mailerService;
    constructor(userRepository: Repository<User>, registerService: UserService, jwtService: JwtService, mailerService: MailerService);
    sendRecoverPasswordEmail(email: string): Promise<void>;
    private findUserByEmail;
    private generateRecoverToken;
    private saveUserWithRecoverToken;
    sendEmailConfirmAccount(confirmationToken: string): Promise<void>;
    private isTokenExpired;
}
