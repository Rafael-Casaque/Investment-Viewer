import type { NextApiRequest, NextApiResponse } from "next";
import { UserDAOMongoDB } from "../repositories/UserDAOMongoDB";
import { uri } from "../../../credentials";
import { Utils } from "../services/Utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      const { email, password } = req.body;
      try {
        const db = new UserDAOMongoDB(uri);
        const user = await db.getUser(email);
        if (!user) throw new Error("usuario não encontrado!");
        const status = await Utils.decriptedPassword(password, user.password)        
        if (!status)
          throw new Error("credenciais incorretas!");
        res.status(200).send({ token: Utils.createJWT(email, password, new Date(new Date().getTime() + 30 * 86400000).getTime()) });
      } catch (error: any) {
        res.status(403).send({ error: error.message });
      }
      break;
    default: // método não alocado
      res.status(405).end();
      break;
  }
}
