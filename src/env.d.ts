/// <reference types="webpack/client" />

interface ImportMetaEnv {
  readonly APPWRITE_PROJECT_ID: string;
  readonly APPWRITE_URL: string;
  readonly APPWRITE_DATABASE_ID: string;
  readonly APPWRITE_COLLECTION_ID_MESSAGES: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
