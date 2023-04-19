import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, ServerApiVersion } from "mongodb";
import { User } from "../../types/user";
import { uri } from "../../../credentials";
import { Validation } from "../services/Validation";
import { Utils } from "../services/Utils";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

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
      const userStocks = await getUserStocks(userEmail);
      res.status(200).send(userStocks);
      break;

    case "POST":
      const { username, email, password, stocks } = req.body;
      try {        
        Validation.validateName(username);
        Validation.validateEmail(email);
        Validation.validatePassword(password);
        const validateUser = await getUser(email);
        if (validateUser) throw new Error("email já em uso");
        const user = await createUser(username, email, password, stocks);
        createUserCollection(user);
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

const createUser = async (
  username: string,
  email: string,
  password: string,
  stocks: string
) => {
  const user = {
    username: username,
    email: email,
    password: await Utils.encryptedPassword(password,10),
    stocks: stocks,
  };
  return user;
};

const createUserCollection = async (user: User) => {
  try {
    await client.connect();
    const db = client.db("InvestmentViewer");
    const users = db.collection("users");

    const result = await users.insertOne({
      username: user.username,
      email: user.email,
      password: user.password,
      stocks: user.stocks,
    });
    console.log(`Inserted ${result.insertedId} document(s)`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
};

const getUserStocks = async (email: string) => {
  try {
    await client.connect();
    const db = client.db("InvestmentViewer");
    const users = db.collection("users");

    const user = await users.findOne({ email });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return user.stocks;
  } catch (err) {
    console.error(err);
    throw new Error("Erro ao recuperar os stocks do usuário");
  } finally {
    await client.close();
  }
};

const getUser = async (email: string) => {
  try {
    await client.connect();
    const db = client.db("InvestmentViewer");
    const users = db.collection("users");

    const user = await users.findOne({ email });
    return user;
  } catch (err) {
    console.error(err);
    throw new Error("Erro ao validar email");
  } finally {
    await client.close();
  }
};
