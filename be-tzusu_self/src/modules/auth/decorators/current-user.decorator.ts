import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { PopulatedUserDocument } from '../../users/entities/user.schema';
import type { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): PopulatedUserDocument => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    return request.user;
  },
);
