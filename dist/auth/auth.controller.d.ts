import { AuthService } from './auth.service';
import { CredentialsDto } from './dto/credentials-dto';
import { User } from '../user/entities/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signIn(credentialsDto: CredentialsDto): Promise<{
        token: string;
    }>;
    getMe(user: User): User;
    resetPassword(token: string, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    changePassword(id: string, changePasswordDto: ChangePasswordDto, user: User): Promise<{
        message: string;
    }>;
}
