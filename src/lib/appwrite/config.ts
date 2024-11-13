export const appwriteConfig = {
  endPointUrl: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT!,
  dataBaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
  userCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION!,
  fileCollectionId: process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION!,
  bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET!,
  secretKey: process.env.NEXT_APPWRITE_KEY!,
};
