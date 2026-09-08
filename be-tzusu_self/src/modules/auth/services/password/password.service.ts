import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class PasswordService {
  async hash(password: string): Promise<string> {
    const salt = crypto.randomBytes(16).toString('hex');
    const derivedKey = await this.deriveKey(password, salt);
    return `scrypt$${salt}$${derivedKey.toString('hex')}`;
  }

  async verify(password: string, storedHash: string): Promise<boolean> {
    const parts = storedHash.split('$');
    if (parts.length !== 3) {
      return false;
    }
    const [algorithm, salt, hash] = parts;
    if (algorithm !== 'scrypt') {
      return false;
    }
    if (!/^[0-9a-f]{32}$/.test(salt)) {
      return false;
    }
    if (!/^[0-9a-f]{128}$/.test(hash)) {
      return false;
    }
    const derivedKey = await this.deriveKey(password, salt);
    return crypto.timingSafeEqual(derivedKey, Buffer.from(hash, 'hex'));
  }

  private deriveKey(password: string, salt: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      crypto.scrypt(password, salt, 64, (error, derivedKey) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(derivedKey);
      });
    });
  }
}
