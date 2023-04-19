export interface IConnectionFactory {
  connect(): void;
  disconnect(): void;
}
