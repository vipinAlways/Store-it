'use server'

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";

const getUserByEmail=async(email:string)=>{
  const {dataBase}= await createAdminClient()
  const result = await dataBase.listDocuments(
    appwriteConfig.dataBaseId,
    appwriteConfig.userCollectionId,
    [Query.equal('email',[email])]
  )
  return result.total >0 ?result.documents[0] :null
}
const handleError = (error:unknown,Message:string)=>{
  console.log(error,Message);
  throw error
}

const sendEmailOtp =async ({email}:{email:string})=>{
  const {account} = await createAdminClient()

  try {
    const session = await account.createEmailToken(ID.unique(),email)

    return session.userId
  } catch (error) {
    handleError(error ,"failed to send email otp")
  }
}
export const createAccount = async ({
  fullname,
  email,
}: {
  fullname: string;
  email: string;
}) => {

    const existingUser = await getUserByEmail(email)
    
    const accountId = await sendEmailOtp({email})
};
