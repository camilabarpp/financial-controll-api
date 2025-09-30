import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { CreateUserDto } from 'src/user/type/user.create.request';
import { UserCredentialsDto } from 'src/user/type/user.credential.request';
import { UserResponseDTO } from 'src/user/type/user.response';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService
    ) {}

    async register(userData: CreateUserDto): Promise<UserResponseDTO> {
        const user = await this.userService.register(userData);
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar || null,
            role: user.role
        };
    }

    async login(credentialsDto: UserCredentialsDto): Promise<{ token: string }> {
        const user = await this.userService.checkCredentials(credentialsDto);

        const jwtPayload = {
        id: user.id,
        };
       const token = this.jwtService.sign(jwtPayload);

       return { token };
    }

    async getMe(userId: string): Promise<UserResponseDTO> {
        const user = await this.userService.findUserById(userId);
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar || null,
            role: user.role
        };
    }

    async resetPassword(email: string): Promise<void> {
        const user = await this.userService.findUserByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
        const resetToken = this.jwtService.sign({ id: user.id });
        //await this.mailerService.sendMail({
        //    to: user.email,
        //    subject: 'Esqueci minha senha',
        //    template: './forgot-password',
        //    context: {
        //        name: user.name,
        //        url: `http://localhost:3000/auth/forgot-password?token=${resetToken}`,
        //    },
        //});
    }
}
