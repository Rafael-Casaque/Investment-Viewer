export interface IPassword {
  encrypt(password: string, saltRounds: number): void;
}