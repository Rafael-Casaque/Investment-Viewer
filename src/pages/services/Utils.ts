import { auth } from "../../../credentials";
import { BcryptPassword } from "./dependencies/BcryptPassword";
import { NodeMailerTransporter } from "./dependencies/NodeMailerTransporter";
import { JsonWebToken } from "./dependencies/JsonWebToken";

type Payload = {
  iss: string;
  sub: string;
  exp: number;
  nbf: number;
  jti: string;
};

export class Utils {
  static encryptedPassword = async (password: string, saltRounds: number) => {
    const encrypt = new BcryptPassword();
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

  static createJWT = (email: string, privateKey: string) => {
    const payload = {
      iss: "https://investmentViewer.com",
      sub: email,
      exp: new Date(new Date().getTime() + 10 * 60000).getTime(),
      nbf: new Date().getTime(),
      jti: privateKey,
    };

    const JWT = new JsonWebToken(payload);

    return JWT.createJWT();
  };

  static validateJWT = (jwt: string, privateKey: string) => {
    try {
      JsonWebToken.validateJWT(jwt, privateKey);
      return true;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };
}
