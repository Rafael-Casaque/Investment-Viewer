export interface ISendEmail {
    send(from: string, code: string): Promise<void>;
  }