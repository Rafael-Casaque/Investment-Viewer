export interface ICodeDAO<T> {
  createCode(code: string, email: string, expires: Date): Promise<T>;
  getCode(email: string): Promise<T | null>;
  deleteExpiredCodes(collectionName: string): Promise<T>;
}
