import { Client, Account, Databases } from 'appwrite';

export const appwriteConfig = {
  url: process.env.APPWRITE_URL as string,
  projectId: process.env.APPWRITE_PROJECT_ID as string,
  databaseId: process.env.APPWRITE_DATABASE_ID as string,
  collectionIdMessages: process.env.APPWRITE_COLLECTION_ID_MESSAGES as string,
};

const client = new Client()
  .setEndpoint(appwriteConfig.url)
  .setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);

export default client;
