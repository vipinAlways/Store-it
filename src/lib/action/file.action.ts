"use server";

import { ID, Models, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { getCurrentUser, handleError } from "./user.action";
import { InputFile } from "node-appwrite/file";
import { constructFileUrl, getFileType, parseStrinGify } from "../utils";
import { revalidatePath } from "next/cache";
export const uploadFile = async ({
  file,
  ownerId,
  accountId,
  path,
}: UploadFileProps) => {
  const { storage, dataBase } = await createAdminClient();

  try {
    const inputFile = InputFile.fromBuffer(file, file.name);

    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      inputFile
    );

    const fileDocument = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      bucketFileId: bucketFile.$id,
    };

    const newFile = await dataBase
      .createDocument(
        appwriteConfig.dataBaseId,
        appwriteConfig.fileCollectionId,
        ID.unique(),
        fileDocument
      )
      .catch(async (error: unknown) => {
        await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
        handleError(error, "file to create file document");
      });

    revalidatePath(path);
    return parseStrinGify(newFile);
  } catch (error) {
    handleError(error, "failed to upload file");
  }
};

const createQueries = (currentUser: Models.Document) => {
  const queries = [
    Query.or([
      Query.equal("owner", currentUser.$id),
      Query.contains("users", currentUser.email),
    ]),
  ];

  return queries;
};

export const getFiles = async () => {
  const { dataBase } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) throw new Error("user not find");

    const queries = createQueries(currentUser);

    const files = await dataBase.listDocuments(
      appwriteConfig.dataBaseId,
      appwriteConfig.fileCollectionId,
      queries
    );

    return parseStrinGify(files);
  } catch (error) {
    handleError(error, "failed to fetch file");
  }
};


export const updateFileUsers = async({fileId,emails,path}:UpdateFileUsersProps)=>{
  const {dataBase} = await createAdminClient()
 

  try {
  
    const updateFile = await dataBase.updateDocument(
      appwriteConfig.dataBaseId,
      appwriteConfig.fileCollectionId,
      fileId,
      {
        users:emails
      }
    )

    revalidatePath(path)

    return parseStrinGify(updateFile)
  } catch (error) {
    handleError(error,'file to rename the file')
  }
}
export const renameFile = async({fileId,name,extension,path}:RenameFileProps)=>{
  const {dataBase} = await createAdminClient()
 

  try {
    const newName = `${name}.${extension}`
    const updateFile = await dataBase.updateDocument(
      appwriteConfig.dataBaseId,
      appwriteConfig.fileCollectionId,
      fileId,
      {
        name:newName
      }
    )

    revalidatePath(path)

    return parseStrinGify(updateFile)
  } catch (error) {
    handleError(error,'file to rename the file')
  }
}


