"use server";

import { createAdminClient } from "../appwrite";
import { handleError } from "./user.action";
import {InputFile} from "node-appwrite/file"
export const uploadFile = async ({
  file,
  ownerId,
  accountId,
  path,
}: UploadFileProps) => {
    const {storage,dataBase}= await createAdminClient()

    try {
        const inputFile = InputFile.fromBuffer(file,file.name)
    } catch (error) {
        handleError(error,'failed to upload file')
    }
};
