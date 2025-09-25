"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("./entities/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_enum_1 = require("./entities/user-enum");
const bcrypt = __importStar(require("bcrypt"));
const mailer_1 = require("@nestjs-modules/mailer");
const jwt = __importStar(require("jsonwebtoken"));
const jwtSecret = 'super-secret';
let UserService = class UserService {
    userRepository;
    mailerService;
    constructor(userRepository, mailerService) {
        this.userRepository = userRepository;
        this.mailerService = mailerService;
    }
    async findUsers(queryDto) {
        return await this.findUser(queryDto);
    }
    async findUser(queryDto) {
        const { email, name, status = true, role, page = 1, limit = 100, sort, } = queryDto;
        const query = this.userRepository
            .createQueryBuilder('user')
            .where('user.status = :status', { status });
        if (email) {
            query.andWhere('user.email LIKE :email', { email: `${email}%` });
        }
        if (name) {
            query.andWhere('user.name LIKE :name', { name: `${name}%` });
        }
        if (role) {
            query.andWhere('user.role = :role', { role });
        }
        query
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy(sort ? JSON.parse(sort) : undefined)
            .select(['user.name', 'user.email', 'user.role', 'user.status']);
        const [users, total] = await query.getManyAndCount();
        return { users, total };
    }
    async findUserById(id) {
        const user = await this.userRepository.findOne({
            where: { id },
            select: ['email', 'name', 'role', 'id'],
        });
        if (!user)
            throw new common_1.NotFoundException('No user was found with the given ID: ' + id);
        return user;
    }
    async updateUser(updateUserDto, id) {
        await this.userRepository.update(id, updateUserDto);
        try {
            return await this.findUserById(id);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error saving data to database');
        }
    }
    async createUser(createUserDto) {
        if (createUserDto.password != createUserDto.passwordConfirmation) {
            throw new common_1.UnprocessableEntityException('Passwords do not match');
        }
        else {
            const user = await this.createAndEncryptPassword(createUserDto, user_enum_1.UserRole.USER);
            await this.sendConfirmationEmail(user.email, user.name);
            return user;
        }
    }
    async createAdmin(createUserDto) {
        if (createUserDto.password != createUserDto.passwordConfirmation) {
            throw new common_1.UnprocessableEntityException('Passwords do not match');
        }
        else {
            const admin = await this.createAndEncryptPassword(createUserDto, user_enum_1.UserRole.ADMIN);
            await this.sendConfirmationEmail(admin.email, admin.name);
            return admin;
        }
    }
    async sendConfirmationEmail(email, name) {
        const mail = {
            to: email,
            from: 'noreply@application.com',
            subject: 'Bem vindo(a) ao NQ',
            template: 'welcome-email',
            context: {
                name,
            },
        };
        await this.mailerService.sendMail(mail);
    }
    async deleteUser(id) {
        await this.findUserById(id);
        await this.userRepository.delete(id);
    }
    async changePassword(id, password) {
        const user = await this.userRepository.findOne({ where: { id } });
        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(password, user.salt);
        user.recoverToken = null;
        await this.userRepository.save(user);
    }
    async generateHash(password) {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);
        return { salt, hash };
    }
    async createAndEncryptPassword(createUserDto, role) {
        const { email, name, password } = createUserDto;
        const { salt, hash } = await this.generateHash(password);
        const newUser = this.userRepository.create({
            name,
            email,
            password: hash,
            role,
            status: true,
            salt,
        });
        try {
            await this.userRepository.save(newUser);
            delete newUser.password;
            delete newUser.salt;
            newUser.confirmationToken = jwt.sign({ userId: newUser.id, salt: newUser.salt }, jwtSecret, { expiresIn: '2 days' });
            await this.userRepository.save(newUser);
            return newUser;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Error to save on database! ${error.message}`);
        }
    }
    async checkCredentials(credentialsDto) {
        const { email, password } = credentialsDto;
        const user = await this.userRepository.findOne({
            where: { email, status: true },
        });
        if (user && (await user.checkPassword(password))) {
            return user;
        }
        else {
            return null;
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        mailer_1.MailerService])
], UserService);
//# sourceMappingURL=user.service.js.map