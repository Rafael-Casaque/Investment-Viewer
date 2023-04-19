import { WithId, Document } from "mongodb";
import { MongoDBConnectionFactory } from "../services/dependencies/MongoDBConnectionFactory";
import { IUserDAO } from "./interfaces/IUserDAO";

type Stock = {
    stockName: string,
    amount: number,
}

type User = {
  username: string;
  email: string;
  password: string;
  stocks: Stock[];
};

export class UserDAOMongoDB implements IUserDAO<WithId<Document> | void> {
  client: MongoDBConnectionFactory;
  constructor(uri: string) {
    this.client = new MongoDBConnectionFactory(uri);
  }

  async createUser(user: User): Promise<WithId<Document> | void> {
    try {
      await this.client.connect();
      const db = this.client.collection("InvestmentViewer");
      const users = db.collection("users");

      await users.insertOne({
        username: user.username,
        email: user.email,
        password: user.password,
        stocks: user.stocks,
      });
    } catch (err) {
      console.error(err);
    } finally {
      await this.client.disconnect();
    }
  }
  async getUser(email: string): Promise<WithId<Document> | null> {
    try {
      await this.client.connect();
      const db = this.client.collection("InvestmentViewer");
      const users = db.collection("users");

      const user = await users.findOne({ email });
      return user;
    } catch (err) {
      console.error(err);
      throw new Error("Erro ao validar email");
    } finally {
      await this.client.disconnect();
    }
  }
  async getUserStocks(email: string): Promise<void[]> {
    try {
        await this.client.connect();
        const db = this.client.collection("InvestmentViewer");
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
        await this.client.disconnect();
      }
  }
}
