"use server";

import { ID } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { handleError } from "./user.action";
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
    return parseStrinGify(newFile)
  } catch (error) {
    handleError(error, "failed to upload file");
  }
};
