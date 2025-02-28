import { MongoClient } from 'mongodb';

// Singleton pour la connexion MongoDB
let client: MongoClient | null = null;

async function getMongoClient() {
  if (!client) {
    const uri = process.env.MDB_URI;
    if (!uri) {
      throw new Error('MongoDB URI not configured');
    }
    client = new MongoClient(uri);
    await client.connect();
  }
  return client;
}

export async function getEnvironmentVariables(): Promise<Record<string, string>> {
  try {
    const client = await getMongoClient();
    const db = client.db(process.env.MDB_NAME);
    const collection = db.collection('environment_variables');
    
    const variables = await collection.find().toArray();
    
    // Convert to key-value object
    const envVars: Record<string, string> = {};
    variables.forEach(variable => {
      envVars[variable.key] = variable.value;
    });
    
    return envVars;
  } catch (error) {
    console.error('Error getting environment variables from MongoDB:', error);
    throw error;
  }
}

export async function updateEnvironmentVariable(key: string, value: string): Promise<void> {
  try {
    const client = await getMongoClient();
    const db = client.db(process.env.MDB_NAME);
    const collection = db.collection('environment_variables');
    
    // Upsert the variable
    await collection.updateOne(
      { key },
      { $set: { key, value, updatedAt: new Date() } },
      { upsert: true }
    );
  } catch (error) {
    console.error('Error updating environment variable in MongoDB:', error);
    throw error;
  }
}

export async function getEnvironmentVariable(key: string): Promise<string | null> {
  try {
    const client = await getMongoClient();
    const db = client.db(process.env.MDB_NAME);
    const collection = db.collection('environment_variables');
    
    const variable = await collection.findOne({ key });
    return variable?.value || null;
  } catch (error) {
    console.error('Error getting environment variable from MongoDB:', error);
    throw error;
  }
}

// Function to initialize environment variables from MongoDB
export async function initializeEnvironmentVariables(): Promise<void> {
  try {
    const envVars = await getEnvironmentVariables();
    
    // Override process.env with MongoDB values
    for (const [key, value] of Object.entries(envVars)) {
      if (value) {
        process.env[key] = value;
      }
    }
  } catch (error) {
    console.error('Error initializing environment variables:', error);
    throw error;
  }
} 