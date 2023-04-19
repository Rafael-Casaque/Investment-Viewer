import { IConnectionFactory } from "@/pages/repositories/interfaces/IConnectionFactory";
import { MongoClient, ServerApiVersion } from "mongodb";

export class MongoDBConnectionFactory implements IConnectionFactory{
    uri: string;
    client: MongoClient;
    constructor(uri: string){
        this.uri = uri;
        this.client = new MongoClient(this.uri, {
            serverApi: {
              version: ServerApiVersion.v1,
              strict: true,
              deprecationErrors: true,
            },
          });
    }
    async connect(){
        try {
            await this.client.connect();
        } catch (error:any) {
            throw new Error(error.message);
        }
    }    
    collection(collectionName:string){
        return this.client.db("InvestmentViewer");
    }
    async disconnect(){
        try {
            await this.client.close();
        } catch (error:any) {
            throw new Error(error.message);
        }
    }
}