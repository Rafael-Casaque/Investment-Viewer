import { IPassword } from "@/pages/repositories/interfaces/IPassword";
import bcrypt from "bcrypt";

export class BcryptPassword implements IPassword {
  async encrypt(password: string, saltRounds: number): Promise<string> {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  }
  async decrypt(password: string, hash: string): Promise<boolean> {    
    try {
      const result = await bcrypt.compare(password, hash);
      return result;
    } catch (error: any) {
      throw new Error(error.message);
    }    
  }
}
