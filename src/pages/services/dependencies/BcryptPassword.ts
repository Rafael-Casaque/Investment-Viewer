import { IPassword } from '@/pages/repositories/interfaces/IPassword';
import bcrypt from 'bcrypt';

export class BcryptPassword implements IPassword {
  async encrypt(password: string, saltRounds: number): Promise<string> {    
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  }
}