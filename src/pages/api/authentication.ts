import type { NextApiRequest, NextApiResponse } from "next";
import { Utils } from "../services/Utils";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      const authHeader = req.headers.authorization as string;
      const token = authHeader.split(' ')[1];
      try {
        Utils.validateJWT(token);
        res.status(200).send({ message: "autenticação válida" });
      } catch (error: any) {
        res.send({ error: error.message });
      }
      break;
    case "POST":
      const { email, confirmCode } = req.body;
      const jwt = Utils.createJWT(email, confirmCode);
      res.status(200).json({ token: jwt });
      break;
    default:
      res.status(405).end(); // método não permitido
      break;
  }
}
