"use server";

import { ID, Models, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { getCurrentUser, handleError } from "./user.action";
import { InputFile } from "node-appwrite/file";
import { constructFileUrl, getFileType, parseStringify } from "../utils";
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
    return parseStringify(newFile);
  } catch (error) {
    handleError(error, "failed to upload file");
  }
};

const createQueries = (
  currentUser: Models.Document,
  types: string[],
  searchText: string,
  limit: number,
  sort: string
) => {
  const queries = [
    Query.or([
      Query.equal("owner", currentUser.$id),
      Query.contains("users", currentUser.email),
    ]),
  ];
  if (types.length > 0) queries.push(Query.equal("type", types));
  if (searchText) queries.push(Query.contains("name", searchText));
  if (limit) queries.push(Query.limit(limit));
  if (sort) {
    const [sortBy, orderBy] = sort.split("-");

    queries.push(
      orderBy === "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy)
    );
  }
  return queries;
};

export const getFiles = async ({
  types = [],
  searchText,
  sort,
  limit,
}: GetFilesProps) => {
  const { dataBase } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) throw new Error("user not find");

    const queries = createQueries(
      currentUser,
      types,
      searchText!,
      limit!,
      sort!
    );

    const files = await dataBase.listDocuments(
      appwriteConfig.dataBaseId,
      appwriteConfig.fileCollectionId,
      queries
    );

    return parseStringify(files);
  } catch (error) {
    handleError(error, "failed to fetch file");
  }
};

export const updateFileUsers = async ({
  fileId,
  emails,
  path,
}: UpdateFileUsersProps) => {
  const { dataBase } = await createAdminClient();

  try {
    const updateFile = await dataBase.updateDocument(
      appwriteConfig.dataBaseId,
      appwriteConfig.fileCollectionId,
      fileId,
      {
        users: emails,
      }
    );

    revalidatePath(path);

    return parseStringify(updateFile);
  } catch (error) {
    handleError(error, "file to rename the file");
  }
};
export const renameFile = async ({
  fileId,
  name,
  extension,
  path,
}: RenameFileProps) => {
  const { dataBase } = await createAdminClient();

  try {
    const newName = `${name}.${extension}`;
    const updateFile = await dataBase.updateDocument(
      appwriteConfig.dataBaseId,
      appwriteConfig.fileCollectionId,
      fileId,
      {
        name: newName,
      }
    );

    revalidatePath(path);

    return parseStringify(updateFile);
  } catch (error) {
    handleError(error, "file to rename the file");
  }
};
export const deleteFile = async ({
  fileId,
  bucketFileId,
  path,
}: DeleteFileProps) => {
  const { dataBase, storage } = await createAdminClient();

  try {
    const deleteFile = await dataBase.deleteDocument(
      appwriteConfig.dataBaseId,
      appwriteConfig.fileCollectionId,
      fileId
    );

    if (deleteFile) {
      await storage.deleteFile(appwriteConfig.bucketId, bucketFileId);
    }

    revalidatePath(path);

    return parseStringify({ status: "success" });
  } catch (error) {
    handleError(error, "file to rename the file");
  }
};
export async function getTotalSpaceUsed() {
  try {
    const { dataBase } = await createSessionClient();
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User is not authenticated.");

    const files = await dataBase.listDocuments(
      appwriteConfig.dataBaseId,
      appwriteConfig.fileCollectionId,
      [Query.equal("owner", [currentUser.$id])],
    );

    const totalSpace = {
      image: { size: 0, latestDate: "" },
      document: { size: 0, latestDate: "" },
      video: { size: 0, latestDate: "" },
      audio: { size: 0, latestDate: "" },
      other: { size: 0, latestDate: "" },
      used: 0,
      all: 2 * 1024 * 1024 * 1024 
    };

    files.documents.forEach((file) => {
      const fileType = file.type as FileType;
      totalSpace[fileType].size += file.size;
      totalSpace.used += file.size;

      if (
        !totalSpace[fileType].latestDate ||
        new Date(file.$updatedAt) > new Date(totalSpace[fileType].latestDate)
      ) {
        totalSpace[fileType].latestDate = file.$updatedAt;
      }
    });

    return parseStringify(totalSpace);
  } catch (error) {
    handleError(error, "Error calculating total space used:, ");
  }
}