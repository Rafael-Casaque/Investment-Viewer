import jwt from "jsonwebtoken";
import { IJWT } from "@/pages/repositories/interfaces/IJWT";

type Payload = {
  iss: string;
  sub: string;
  exp: number;
  nbf: number;
  jti: string;
};

export class JsonWebToken implements IJWT {
//   iss identifica a entidade que emitiu o JWT
//   sub identifica o sujeito ao qual o JWT se refere
//   exp especifica o momento em que o token expira (timestamp)
//   nbf especifica o momento em que o token começa a ser válido (timestamp)
//   jti fornece um identificador exclusivo para o token
  payload: Payload;
  constructor(payload: Payload) {    
    this.payload = {
      iss: payload.iss,
      sub: payload.sub,
      exp: payload.exp,
      nbf: payload.nbf,
      jti: payload.jti,
    };
  }
  createJWT(): string {    
    const jwtHash = jwt.sign(this.payload, this.payload.jti, { algorithm: "HS256" });
    return jwtHash;
  }
  static validateJWT(jwtHash: string, privateKey: string): boolean {
    try {
      const payload = jwt.verify(jwtHash, privateKey) as Payload;
      // Verifica se o token ainda é válido
      if (payload.exp && payload.exp < new Date().getTime()) return false;

      // Verifica se o token ainda não é válido
      if (payload.nbf && payload.nbf > new Date().getTime()) return false;

      // Verifica se o confirmprivateKey === privateKey
      if (payload.jti && payload.jti === privateKey) return false;

      return true;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
