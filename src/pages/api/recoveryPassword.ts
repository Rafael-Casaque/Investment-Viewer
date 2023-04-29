import type { NextApiRequest, NextApiResponse } from "next";
import { uri } from "../../../credentials";
import { Utils } from "../services/Utils";
import { UserDAOMongoDB } from "../repositories/UserDAOMongoDB";
import { CodeDAOMongoDB } from "../repositories/CodeDAOMongoDB";
import authentication from "./authentication";
import { Validation } from "../services/Validation";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      const userEmail =
        typeof req.query.userEmail === "string"
          ? req.query.userEmail
          : undefined;
      if (!userEmail) {
        res.status(400).send({ error: "Email não fornecido" });
        return;
      }
      const CodeDB = new CodeDAOMongoDB(uri);
      const code = await CodeDB.getCode(userEmail);
      if (code && code.expires.getTime() > new Date().getTime())
        return res.status(200).send({ message: "o código já foi enviado" });
      try {
        const CodeDB = new CodeDAOMongoDB(uri);
        await CodeDB.deleteExpiredCodes();
        const code = Utils.generateRandomString(6);
        const UserDB = new UserDAOMongoDB(uri);
        const validateUser = await UserDB.getUser(userEmail);
        if (!validateUser) throw new Error("usuário não encontrado");
        await Utils.sendEmail(userEmail, code);
        const expires = new Date(new Date().getTime() + 15 * 60000);
        CodeDB.createCode(code, userEmail, expires);
        res
          .status(200)
          .send({ message: "o código de recuperação foi enviado" });
      } catch (error: any) {
        res.status(400).send({ error: error.message });
      }
      break;
    case "POST":
      const { email, confirmCode } = req.body;
      try {
        const db = new CodeDAOMongoDB(uri);
        await db.deleteExpiredCodes();
        const code = await db.getCode(email);
        if (!code) throw new Error("código não encontrado ou expirado!");
        if (code && code.value !== confirmCode.toUpperCase()) throw new Error("os códigos não coincidem!");
        const jwt = Utils.createJWT(email, confirmCode, new Date(new Date().getTime() + 15 * 60000).getTime());
        res.status(200).json({ token: jwt });
      } catch (error: any) {
        res.status(403).send({ error: error.message });
      }
      break;
    case "PUT":
      try {
        if (!await authentication(req, res)) throw new Error('token invalido')
        const { email, newPassword , confirmNewPassword } = req.body;
        Validation.validatePassword(newPassword);
        if (!newPassword || !confirmNewPassword || !email) throw new Error('parametros ausentes')
        if (newPassword !== confirmNewPassword) throw new Error('as senhas não coincidem')
        const db = new UserDAOMongoDB(uri)
        const user = await db.getUser(email);
        if (!user) throw new Error('email não cadastrado!')        
        await db.setUserPassword(email, newPassword)        
        res.status(200).send({ message: 'senha atualizada com sucesso' })
      } catch (error: any) {
        res.status(403).send({ error: error.message })
      }
      break;
    default: // método não alocado
      res.status(405).end();
      break;
  }
}
