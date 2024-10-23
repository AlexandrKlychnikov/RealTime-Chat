import { Client, Account, Databases } from 'appwrite';

export const appwriteConfig = {
  url: import.meta.env.APPWRITE_URL,
  projectId: import.meta.env.APPWRITE_PROJECT_ID,
  databaseId: import.meta.env.APPWRITE_DATABASE_ID,
  collectionIdMessages: import.meta.env.APPWRITE_COLLECTION_ID_MESSAGES,
};

const client = new Client()
  .setEndpoint(appwriteConfig.url)
  .setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);

export default client;
