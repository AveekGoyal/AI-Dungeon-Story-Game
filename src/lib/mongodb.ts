import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {
  ssl: true,
  tls: true,
  tlsAllowInvalidCertificates: true,
  retryWrites: true,
  maxPoolSize: 10,
};

// MongoDB Client for Next-Auth
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
    _mongooseConnection?: typeof mongoose;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;

  // Cache mongoose connection
  if (!globalWithMongo._mongooseConnection) {
    globalWithMongo._mongooseConnection = mongoose;
  }
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Handle initial connection errors
clientPromise.catch(error => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

// Mongoose connection function
export const connectToDatabase = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(uri);
      console.log('MongoDB connected successfully');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export default clientPromise;
