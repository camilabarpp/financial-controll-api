import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log('token:', request.headers['authorization']);
    console.log('Request user:', request.user);
    return request.user; 
  },
);