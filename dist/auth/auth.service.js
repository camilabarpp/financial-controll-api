"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const jwt_1 = require("@nestjs/jwt");
const mailer_1 = require("@nestjs-modules/mailer");
const moment_1 = __importDefault(require("moment"));
let AuthService = class AuthService {
    registerService;
    jwtService;
    mailerService;
    constructor(registerService, jwtService, mailerService) {
        this.registerService = registerService;
        this.jwtService = jwtService;
        this.mailerService = mailerService;
    }
    async signIn(credentialsDto) {
        const user = await this.registerService.checkCredentials(credentialsDto);
        if (user === null) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const jwtPayload = {
            id: user.id,
        };
        const token = this.jwtService.sign(jwtPayload);
        return { token };
    }
    async changePassword(id, changePasswordDto) {
        const user = await this.registerService.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const { password, passwordConfirmation } = changePasswordDto;
        if (password !== passwordConfirmation) {
            throw new common_1.UnprocessableEntityException('The passwords do not match');
        }
        await this.registerService.changePassword(id, password);
        const formattedDate = (0, moment_1.default)(user.updatedAt).format('DD/MM/YYYY [às] HH:mm:ss');
        const mail = {
            to: user.email,
            subject: 'Senha alterada com sucesso',
            text: 'Sua senha foi alterada com sucesso.',
            template: 'confirmation-change-password',
            context: {
                name: user.name,
                updatedAt: formattedDate,
            },
        };
        await this.mailerService.sendMail(mail);
    }
    async resetPassword(recoverToken, changePasswordDto) {
        const user = await this.registerService.findByRecoverToken(recoverToken);
        if (!user)
            throw new common_1.NotFoundException('Invalid token');
        try {
            await this.changePassword(user.id.toString(), changePasswordDto);
        }
        catch (error) {
            throw error;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        mailer_1.MailerService])
], AuthService);
//# sourceMappingURL=auth.service.js.map