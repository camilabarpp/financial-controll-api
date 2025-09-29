import { Injectable, NotFoundException, InternalServerErrorException, UnprocessableEntityException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './type/user.schema';
import { UserRole } from './type/user-role.enum';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './type/user.create.request';
import { UserResponseDTO } from './type/user.response';
import { UpdateUserDto } from './type/user.update.request';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async register(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.userModel.findOne({ email: createUserDto.email });

        if (existingUser) {
            throw new UnprocessableEntityException('Já existe um usuário com este email');
        }

        try {
            const user = await this.createAndEncryptPassword(
                createUserDto,
                UserRole.USER
            );
            return user;
        } catch (error) {
            throw new InternalServerErrorException(`Erro ao salvar usuário: ${error.message}`);
        }
    }

    async findUserByEmail(email: string): Promise<User> {
        const user = await this.userModel.findOne({ email });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async updateUser(updateUserDto: UpdateUserDto, id: string): Promise<UserResponseDTO> {
        await this.findUserById(id);
        await this.userModel.updateOne({ _id: id }, updateUserDto);
        const userUpdated = await this.findUserById(id);
        return {
            id: userUpdated._id.toString(),
            email: userUpdated.email,
            name: userUpdated.name,
            avatar: userUpdated.avatar || null,
            role: userUpdated.role
        };
    }

    async deleteUser(id: string) {
        await this.findUserById(id);
        await this.userModel.deleteOne({ _id: id });
    }

    async changePassword(id: string, body: { currentPassword: string, newPassword: string }) {
        const user = await this.findUserLogged(id);

        const isPasswordMatch = await this.checkPassword(user, body.currentPassword);
        if (!isPasswordMatch) throw new ForbiddenException('Senha atual está incorreta');

        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(body.newPassword, user.salt);
        await user.save();
    }

    async checkCredentials(credentialsDto: any): Promise<User | null> {
        const { email, password } = credentialsDto;
        const user = await this.userModel.findOne({ email, status: true });
        if (user && (await this.checkPassword(user, password))) {
            return user;
        } else {
            throw new UnauthorizedException('Credenciais inválidas');
        }
    }

    async findUserLogged(id: string): Promise<User> {
        const user = await this.userModel.findById(id).select('email name role id salt password');
        if (!user) throw new UnauthorizedException('Usuário não encontrado');
        return user;
    }

    private async findUserById(id: string): Promise<User> {
        const user = await this.userModel.findById(id).select('email avatar name role id');
        if (!user) throw new NotFoundException('Usuário não encontrado');
        return user;
    }

    private async generateHash(password: string): Promise<{ salt: string; hash: string }> {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);
        return { salt, hash };
    }

    private async createAndEncryptPassword(createUserDto: CreateUserDto, role: UserRole): Promise<User> {
        const { email, name, password } = createUserDto;
        const { salt, hash } = await this.generateHash(password);
        const newUser = new this.userModel({
            name,
            email,
            password: hash,
            role,
            status: true,
            salt
        });
        try {
            await newUser.save();
            newUser.password = undefined;
            newUser.salt = undefined;
            return newUser;
        } catch (error) {
            throw new InternalServerErrorException(`Erro ao salvar usuário: ${error.message}`);
        }
    }

    private async checkPassword(user: User, password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, user.salt);
        return hash === user.password;
    }
}
