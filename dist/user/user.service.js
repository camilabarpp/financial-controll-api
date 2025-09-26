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
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./type/user.schema");
const user_role_enum_1 = require("./type/user-role.enum");
const bcrypt = __importStar(require("bcrypt"));
let UserService = class UserService {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async register(createUserDto) {
        const existingUser = await this.userModel.findOne({ email: createUserDto.email });
        if (existingUser) {
            throw new common_1.UnprocessableEntityException('Já existe um usuário com este email');
        }
        try {
            const user = await this.createAndEncryptPassword(createUserDto, user_role_enum_1.UserRole.USER);
            return {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                avatar: user.avatar || null,
                role: user.role
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Erro ao salvar usuário: ${error.message}`);
        }
    }
    async findByToken(token) {
        return this.userModel.findOne({ token }).exec();
    }
    async findUserByEmail(email) {
        const user = await this.userModel.findOne({ email });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async findUsers(query) {
        const { email, name, status = true, role, page = 1, limit = 100, sort } = query;
        const filter = { status };
        if (email)
            filter.email = new RegExp(`^${email}`, 'i');
        if (name)
            filter.name = new RegExp(`^${name}`, 'i');
        if (role)
            filter.role = role;
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
    async findUserById(id) {
        const user = await this.userModel.findById(id).select('email name role id');
        if (!user)
            throw new common_1.NotFoundException('No user was found with the given ID: ' + id);
        return user;
    }
    async updateUser(updateUserDto, id) {
        await this.userModel.updateOne({ _id: id }, updateUserDto);
        try {
            return await this.findUserById(id);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error saving data to database');
        }
    }
    async deleteUser(id) {
        await this.findUserById(id);
        await this.userModel.deleteOne({ _id: id });
    }
    async changePassword(id, password) {
        const user = await this.userModel.findById(id);
        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(password, user.salt);
        user.recoverToken = null;
        await user.save();
    }
    async generateHash(password) {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);
        return { salt, hash };
    }
    async createAndEncryptPassword(createUserDto, role) {
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
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Erro ao salvar usuário: ${error.message}`);
        }
    }
    async checkCredentials(credentialsDto) {
        const { email, password } = credentialsDto;
        const user = await this.userModel.findOne({ email, status: true });
        if (user && (await this.checkPassword(user, password))) {
            return user;
        }
        else {
            return null;
        }
    }
    async checkPassword(user, password) {
        const hash = await bcrypt.hash(password, user.salt);
        return hash === user.password;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserService);
//# sourceMappingURL=user.service.js.map