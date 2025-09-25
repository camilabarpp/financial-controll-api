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
exports.SendMailService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_2 = require("typeorm");
const user_service_1 = require("../../user/user.service");
const jwt_1 = require("@nestjs/jwt");
const mailer_1 = require("@nestjs-modules/mailer");
const jwt = __importStar(require("jsonwebtoken"));
let SendMailService = class SendMailService {
    userRepository;
    registerService;
    jwtService;
    mailerService;
    constructor(userRepository, registerService, jwtService, mailerService) {
        this.userRepository = userRepository;
        this.registerService = registerService;
        this.jwtService = jwtService;
        this.mailerService = mailerService;
    }
    async sendRecoverPasswordEmail(email) {
        const user = await this.findUserByEmail(email);
        const recoverToken = this.generateRecoverToken(user);
        await this.saveUserWithRecoverToken(user, recoverToken);
        const mail = {
            to: user.email,
            from: 'noreply@application.com',
            subject: 'Redefinição de senha',
            template: 'recover-password',
            context: {
                token: user.recoverToken,
                username: user.name,
            },
        };
        await this.mailerService.sendMail(mail);
    }
    async findUserByEmail(email) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new common_1.NotFoundException('There is no user with this email');
        }
        return user;
    }
    generateRecoverToken(user) {
        return jwt.sign({ id: user.id, email: user.email }, 'super-secret', {
            expiresIn: '2m',
        });
    }
    async saveUserWithRecoverToken(user, recoverToken) {
        user.recoverToken = recoverToken;
        await this.userRepository.save(user);
    }
    async sendEmailConfirmAccount(confirmationToken) {
        try {
            const payload = jwt.verify(confirmationToken, 'super-secret');
            if (payload.type !== 'confirmation') {
                new Error('Invalid token type');
            }
            if (this.isTokenExpired(payload.exp, payload.type)) {
                new Error('Token expired');
            }
            const result = await this.userRepository.update({ confirmationToken }, { confirmationToken: null });
            if (result.affected === 0) {
                new Error('Token invalid');
            }
        }
        catch (err) {
            throw new common_1.NotFoundException(err.message);
        }
    }
    isTokenExpired(tokenExpiration, tokenType) {
        const now = Math.floor(Date.now() / 1000);
        if (tokenType === 'confirmation') {
            const confirmationExpirationInSeconds = 2;
            return now - tokenExpiration > confirmationExpirationInSeconds;
        }
        return false;
    }
};
exports.SendMailService = SendMailService;
exports.SendMailService = SendMailService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        user_service_1.UserService,
        jwt_1.JwtService,
        mailer_1.MailerService])
], SendMailService);
//# sourceMappingURL=send-mail.service.js.map