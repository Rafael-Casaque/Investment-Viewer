import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, ServerApiVersion } from "mongodb";
import bcrypt from "bcrypt";
import { auth, uri } from "../../../credentials";
import nodemailer from "nodemailer";
import cron from "node-cron";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: auth,
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
      const code = await getCode(userEmail);
      if (code && code.expires.getTime() > new Date().getTime())
        return res.status(200).send({ message: "o código já foi enviado" });
      try {
        deleteExpiredCodes("codes");
        const code = generateRandomString(6);
        const validateUser = await getUser(userEmail);
        if (!validateUser) throw new Error("usuário não encontrado");
        await sendEmailCode(userEmail, code);
        createCodeCollection(code, userEmail);
        res
          .status(200)
          .send({ message: "o código de recuperação foi enviado" });
      } catch (error: any) {
        res.status(400).send({ error: error.message });
      }
      break;
    case "POST":
      const { email, confirmCode } = req.body;
      break;
    default: // método não alocado
      res.status(405).end();
      break;
  }
}

const encryptedPassword = async (password: string) => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
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

const validatePassword = (password: string) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (passwordRegex.test(password)) return true;
  else throw new Error("invalid password");
};

const generateRandomString = (length: number) => {
  const charset = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset[randomIndex];
  }
  return result.toUpperCase();
};

const createCodeCollection = async (code: string, userEmail: string) => {
  try {
    await client.connect();
    const db = client.db("InvestmentViewer");
    const codes = db.collection("codes");

    const result = await codes.insertOne({
      value: code,
      user: userEmail,
      expires: new Date(new Date().getTime() + 10 * 60000), //10 minutos a partir da momento de criação do código
    });

    console.log(`Inserted ${result.insertedId} document(s)`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
};

const sendEmailCode = async (to: string, code: string) => {
  const mailOptions = {
    from: auth.user,
    to,
    subject: "e-mail de recuperação de senha",
    html: `${code}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email enviado para ${to}: ${info.messageId}`);
  } catch (error) {
    console.error(`Erro ao enviar email: ${error}`);
  }
};

const validateRecoveryCode = (email: string, recoveryCode: string) => {
  getUser(email);
};

const getCode = async (user: string) => {
  try {
    await client.connect();
    const db = client.db("InvestmentViewer");
    const codes = db.collection("codes");

    const code = await codes.findOne({ user });
    return code;
  } catch (err) {
    console.error(err);
    throw new Error("Erro ao validar email");
  } finally {
    await client.close();
  }
};

const deleteExpiredCodes = async (collectionName: string) => {
  try {
    await client.connect();
    const db = client.db("InvestmentViewer");
    const collection = db.collection(collectionName);

    collection.deleteMany({ expires: { $lt: new Date() } });
    return true;
  } catch (err) {
    console.error(err);
    throw new Error("Erro ao fazer o delete");
  }
};
