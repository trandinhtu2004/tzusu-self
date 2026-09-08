import type { Request } from 'express';
import type { PopulatedUserDocument } from '../../users/entities/user.schema';

export interface AuthenticatedRequest extends Request {
  user: PopulatedUserDocument;
}
