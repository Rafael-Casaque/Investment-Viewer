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

export interface IUserDAO<T> {
  createUser(user: User): Promise<T>;
  getUser(email: string): Promise<T | null>;
  getUserStocks(email: string): Promise<T[]>;
}
