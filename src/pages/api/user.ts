import type { NextApiRequest, NextApiResponse } from "next";
import { uri } from "../../../credentials";
import { Validation } from "../services/Validation";
import { UserDAOMongoDB } from "../repositories/UserDAOMongoDB";
import { User } from "../models/User";

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
      const db = new UserDAOMongoDB(uri)
      const userStocks = await db.getUserStocks(userEmail);
      res.status(200).send(userStocks);
      break;

    case "POST":
      const { username, email, password, stocks } = req.body;
      try {        
        Validation.validateName(username);
        Validation.validateEmail(email);
        Validation.validatePassword(password);
        const db = new UserDAOMongoDB(uri)
        const validateUser = await db.getUser(email);
        if (validateUser) throw new Error("email já em uso");
        const user = new User(username, email, password, stocks);       
        await db.createUser(user);
        res.send("user successfully created");
      } catch (error: any) {
        res.status(400).send({ error: error.message });
      }
      break;
    default: // método não alocado
      res.status(405).end();
      break;
  }
}
