import { IPasswordEncryptor } from '@/pages/repositories/interfaces/IPasswordEncryptor';
import bcrypt from 'bcrypt';

export class BcryptPasswordEncryptor implements IPasswordEncryptor {
  async encrypt(password: string, saltRounds: number): Promise<string> {    
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  }
}