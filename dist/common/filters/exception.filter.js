"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const mongodb_1 = require("mongodb");
let AllExceptionsFilter = class AllExceptionsFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Erro interno do servidor';
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            message = typeof exceptionResponse === 'string'
                ? exceptionResponse
                : exceptionResponse.message || message;
        }
        else if (exception instanceof mongodb_1.MongoError) {
            if (exception.code === 11000) {
                status = common_1.HttpStatus.CONFLICT;
                const keyValue = exception.keyValue;
                const field = Object.keys(keyValue || {})[0];
                if (field === 'name' || exception.keyPattern?.name) {
                    message = `Já existe uma economia com o nome "${keyValue.name}". Por favor, escolha outro nome.`;
                }
                else {
                    message = `Registro duplicado. O valor já existe no sistema.`;
                }
            }
            else {
                message = 'Erro ao processar operação no banco de dados';
            }
        }
        else if (exception instanceof Error) {
            message = exception.message;
        }
        console.error('Exception caught:', {
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            error: exception,
        });
        response.status(status).json({
            statusCode: status,
            message: message,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
//# sourceMappingURL=exception.filter.js.map