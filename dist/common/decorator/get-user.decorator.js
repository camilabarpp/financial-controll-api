"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const common_1 = require("@nestjs/common");
exports.User = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    console.log('token:', request.headers['authorization']);
    console.log('Request user:', request.user);
    return request.user;
});
//# sourceMappingURL=get-user.decorator.js.map