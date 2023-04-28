import type { NextApiRequest, NextApiResponse } from "next";
import { Utils } from "../services/Utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      try {
        const authHeader = req.headers.authorization as string;
        const token = authHeader.split(" ")[1];
        Utils.validateJWT(token);
        res.status(200).send({ message: "autenticação válida" });
      } catch (error: any) {
        res.send({ error: error.message });
      }
      break;
    default:
      res.status(405).end(); // método não permitido
      break;
  }
}
