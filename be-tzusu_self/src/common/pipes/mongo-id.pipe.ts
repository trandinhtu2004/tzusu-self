import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class MongoIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: [`${value} is not a valid MongoDB ObjectId`],
      });
    }

    return value;
  }
}
