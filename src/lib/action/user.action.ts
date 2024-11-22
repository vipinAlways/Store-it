"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStrinGify } from "../utils";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const getUserByEmail = async (email: string) => {
  const { dataBase } = await createAdminClient();
  const result = await dataBase.listDocuments(
    appwriteConfig.dataBaseId,
    appwriteConfig.userCollectionId,
    [Query.equal("email", [email])]
  );
  return result.total > 0 ? result.documents[0] : null;
};
export const handleError =async (error: unknown, Message: string) => {

  throw error;
};

export const sendEmailOtp = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);

    return session.userId;
  } catch (error) {
    handleError(error, "failed to send email otp");
  }
};
export const createAccount = async ({
  fullname,
  email,
}: {
  fullname: string;
  email: string;
}) => {
  const existingUser = await getUserByEmail(email);

  const accountId = await sendEmailOtp({ email });
  if (!accountId) throw new Error("Failed to send otp");

  if (!existingUser) {
    const { dataBase } = await createAdminClient();

    await dataBase.createDocument(
      appwriteConfig.dataBaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        fullname,
        email,
        avatar:
          "https://imgs.search.brave.com/szCK7Kss3cXz4SKgich26tccJGXM6GcDheIvueNLlFE/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAwLzY1Lzc3LzI3/LzM2MF9GXzY1Nzcy/NzE5X0ExVVY1a0xp/NW5DRVdJMEJOTExp/RmFCUEVrVWJ2NUZ2/LmpwZw",
        accountId,
      }
    );
  }

  return parseStrinGify({ accountId });
};
export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();
    if (!account) {
      throw new Error("their is no user");
    }

    const session = await account.createSession(accountId, password);
    console.log(session.$id);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return JSON.stringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "failed to verify");
  }
};

export const getCurrentUser = async () => {
  const { dataBase, account } = await createSessionClient();

  const result = await account.get();
  console.log(result, "result hain");
  const user = await dataBase.listDocuments(
    appwriteConfig.dataBaseId,
    appwriteConfig.userCollectionId,
    [Query.equal("accountId", result.$id)]
  );

  if (user.total <= 0) {
    return null;
  }
  console.log(parseStrinGify(user.documents[0]));
  return parseStrinGify(user.documents[0]);
};

export const signOutUser = async () => {
  const { account } = await createSessionClient();
  try {
    account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    console.log(error);
  } finally {
    redirect("/sign-in");
  }
};

export const signIn = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      await sendEmailOtp({ email });
      return parseStrinGify({ accountId: existingUser.accountId });
    }

    return parseStrinGify({ accountId: null, error: "user NOt Found" });
  } catch (error) {
    handleError(error, "failed to sign in user");
  }
};
