import { WithId, Document } from "mongodb";
import { MongoDBConnectionFactory } from "../services/dependencies/MongoDBConnectionFactory";
import { ICodeDAO } from "./interfaces/ICodeDAO";

export class CodeDAOMongoDB
  implements ICodeDAO<WithId<Document> | null | void | true>
{
  client: MongoDBConnectionFactory;
  constructor(uri: string) {
    this.client = new MongoDBConnectionFactory(uri);
  }
  async createCode(code: string, email: string, expires: Date): Promise<void> {
    try {
      await this.client.connect();
      const db = this.client.collection("InvestmentViewer");
      const codes = db.collection("codes");

      await codes.insertOne({
        value: code,
        user: email,
        expires: expires,
      });
    } catch (err) {
      console.error(err);
    } finally {
      await this.client.disconnect();
    }
  }
  async getCode(email: string): Promise<WithId<Document> | null> {
    try {
      await this.client.connect();
      const db = this.client.collection("InvestmentViewer");
      const codes = db.collection("codes");
      const user = email;
      const code = await codes.findOne({ user });
      return code;
    } catch (err) {
      console.error(err);
      throw new Error("Erro ao validar email");
    } finally {
      await this.client.disconnect();
    }
  }
  async deleteExpiredCodes(): Promise<true | WithId<Document> | null> {
    try {
      await this.client.connect();
      const db = this.client.collection("InvestmentViewer");
      const collection = db.collection('codes');

      collection.deleteMany({ expires: { $lt: new Date() } });
      return true;
    } catch (err) {
      console.error(err);
      throw new Error("Erro ao fazer o delete");
    }
  }
}
