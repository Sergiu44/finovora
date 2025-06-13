export interface IDatabaseConnection {
  connectToDatabase: () => Promise<void>;
}
