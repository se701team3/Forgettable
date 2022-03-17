import Mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMock;
const connectDatabase = async () => {
  mongoMock = await MongoMemoryServer.create();
  const uri = mongoMock.getUri();
  await Mongoose.connect(uri);
};

const closeDatabase = async () => {
  if (mongoMock) {
    await mongoMock.stop();
  }
};

const clearDatabase = async () => {
  const { collections } = Mongoose.connection;
  const toDelete: Promise<any>[] = [];
  Object.keys(collections)
    .forEach((key) => toDelete.push(collections[key].deleteMany(() => true)));

  return Promise.all(toDelete);
};

const databaseOperations = {
  connectDatabase,
  closeDatabase,
  clearDatabase,
};

export default databaseOperations;
