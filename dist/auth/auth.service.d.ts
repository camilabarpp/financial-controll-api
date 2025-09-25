import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CredentialsDto } from './dto/credentials-dto';
import { MailerService } from '@nestjs-modules/mailer';
export declare class AuthService {
    private readonly registerService;
    private jwtService;
    private mailerService;
    constructor(registerService: UserService, jwtService: JwtService, mailerService: MailerService);
    signIn(credentialsDto: CredentialsDto): Promise<{
        token: string;
    }>;
    changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<void>;
    resetPassword(recoverToken: string, changePasswordDto: ChangePasswordDto): Promise<void>;
}
