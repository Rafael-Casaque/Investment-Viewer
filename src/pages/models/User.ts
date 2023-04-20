import { Utils } from "../services/Utils";

type Stock = {
  stockName: string,
  amount: number,
}

export class User {
  username: string;
  email: string;
  password: string;
  stocks: Stock[];

  constructor(
    username: string,
    email: string,
    password: string,
    stocks: string
  ) {
    this.username = username;
    this.email = email;
    this.password = password;    
    this.stocks = JSON.parse(stocks);    
  }
  async getUser() {
    return {
      username: this.username,
      email: this.email,
      password: await Utils.encryptedPassword(this.password, 10),
      stocks: this.stocks,
    };
  }
}
