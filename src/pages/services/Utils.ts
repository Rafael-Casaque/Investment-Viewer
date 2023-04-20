import { auth } from "../../../credentials";
import { BcryptPasswordEncryptor } from "./dependencies/BcryptPasswordEncryptor";
import { NodeMailerTransporter } from "./dependencies/NodeMailerTransporter";

export class Utils {
  static encryptedPassword = async (password: string, saltRounds: number) => {
    const encrypt = new BcryptPasswordEncryptor();
    const encryptedPassword = await encrypt.encrypt(password, saltRounds);
    return encryptedPassword;
  };

  static sendEmail = async (to: string, code: string) => {
    const transporter = new NodeMailerTransporter("hotmail", auth);
    try {
      await transporter.send(to, code);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  static generateRandomString = (length: number) => {
    const charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset[randomIndex];
    }
    return result.toUpperCase();
  };
}
