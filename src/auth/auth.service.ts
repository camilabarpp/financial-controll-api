import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { CreateUserDto } from 'src/user/type/user.create.request.type';
import { UserCredentialsDto } from 'src/user/type/user.credential.request.type';
import { UserResponseDTO } from 'src/user/type/user.response.type';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService
    ) {}

    async register(userData: CreateUserDto): Promise<UserResponseDTO> {
        return await this.userService.register(userData);
    }

    async login(credentialsDto: UserCredentialsDto): Promise<{ token: string }> {
        const user = await this.userService.checkCredentials(credentialsDto);

        if (user === null) {
        throw new UnauthorizedException('Credenciais inválidas');
        }

        const jwtPayload = {
        id: user.id,
        };
       const token = "Bearer " + this.jwtService.sign(jwtPayload);

       return { token };
    }

    async changePassword(userId: string, newPassword: string): Promise<void> {
        const user = await this.userService.changePassword(userId, newPassword);
    }

    async resetPassword(email: string): Promise<void> {
        const user = await this.userService.findUserByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
        const resetToken = this.jwtService.sign({ id: user.id });
        //await this.mailerService.sendMail({
        //    to: user.email,
        //    subject: 'Password Reset',
        //    template: './reset-password',
        //    context: {
        //        name: user.name,
        //        url: `http://localhost:3000/auth/reset-password?token=${resetToken}`,
        //    },
        //});
    }
}
