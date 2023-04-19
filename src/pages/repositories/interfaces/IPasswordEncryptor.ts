export interface IPasswordEncryptor {
  encrypt(password: string, saltRounds: number): void;
}