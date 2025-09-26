import { Injectable, NotFoundException, InternalServerErrorException, UnprocessableEntityException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './type/user.schema';
import { UserRole } from './type/user-role.enum';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './type/user.create.request.type';
import { UserResponseDTO } from './type/user.response.type';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async register(createUserDto: CreateUserDto): Promise<UserResponseDTO> {
        const existingUser = await this.userModel.findOne({ email: createUserDto.email });

        if (existingUser) {
            throw new UnprocessableEntityException('Já existe um usuário com este email');
        }

        try {
            const user = await this.createAndEncryptPassword(
                createUserDto,
                UserRole.USER
            );
            return {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                avatar: user.avatar || null,
                role: user.role
            };
        } catch (error) {
            throw new InternalServerErrorException(`Erro ao salvar usuário: ${error.message}`);
        }
    }

    async findByToken(token: string): Promise<User | null> {
        return this.userModel.findOne({ token }).exec();
    }

    async findUserByEmail(email: string): Promise<User> {
        const user = await this.userModel.findOne({ email });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async findUsers(query: any): Promise<{ users: User[]; total: number }> {
        const { email, name, status = true, role, page = 1, limit = 100, sort } = query;
        const filter: any = { status };
        if (email) filter.email = new RegExp(`^${email}`, 'i');
        if (name) filter.name = new RegExp(`^${name}`, 'i');
        if (role) filter.role = role;

        const skip = (page - 1) * limit;
        const users = await this.userModel.find(filter)
            .skip(skip)
            .limit(Number(limit))
            .sort(sort ? JSON.parse(sort) : {})
            .select('name email role status')
            .exec();
        const total = await this.userModel.countDocuments(filter);
        return { users, total };
    }

    async findUserById(id: string): Promise<User> {
        const user = await this.userModel.findById(id).select('email name role id');
        if (!user) throw new NotFoundException('No user was found with the given ID: ' + id);
        return user;
    }

    async updateUser(updateUserDto: any, id: string): Promise<User> {
        await this.userModel.updateOne({ _id: id }, updateUserDto);
        try {
            return await this.findUserById(id);
        } catch (error) {
            throw new InternalServerErrorException('Error saving data to database');
        }
    }

    async deleteUser(id: string) {
        await this.findUserById(id);
        await this.userModel.deleteOne({ _id: id });
    }

    async changePassword(id: string, password: string) {
        const user = await this.userModel.findById(id);
        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(password, user.salt);
        user.recoverToken = null;
        await user.save();
    }

    private async generateHash(password: string): Promise<{ salt: string; hash: string }> {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);
        return { salt, hash };
    }

    async createAndEncryptPassword(createUserDto: CreateUserDto, role: UserRole): Promise<User> {
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

    async checkCredentials(credentialsDto: any): Promise<User | null> {
        const { email, password } = credentialsDto;
        const user = await this.userModel.findOne({ email, status: true });
        if (user && (await this.checkPassword(user, password))) {
            return user;
        } else {
            return null;
        }
    }

    async checkPassword(user: User, password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, user.salt);
        return hash === user.password;
    }
}
