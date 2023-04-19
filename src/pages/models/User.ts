import { Stock } from "@/types/stock";

export class User {
  username: string;
  email: string;
  password: string;
  stocks: Stock;

  constructor(
    username: string,
    email: string,
    password: string,
    stocks: Stock
  ) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.stocks = stocks;
  }
}
