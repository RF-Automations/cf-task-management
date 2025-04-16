"use server";

import { BASE_BACKEND_URL } from "@/lib/constant";
import { auth, clerkClient } from "@clerk/nextjs/server";
import axios from "axios";

export const createUserInDB = async () => {
  const { userId } = await auth();
  const client = await clerkClient();

  if (!userId) {
    return { message: "No logged in User" };
  }

  const currentUser = await client.users.getUser(userId);
  console.log(currentUser)
  try {
    const res = await axios.post(BASE_BACKEND_URL + "/user/create", {
      clerkuuid: currentUser.id,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.emailAddresses
    });

    console.log("user created: ", res.data);
    const previousPublicMetaData = currentUser.publicMetadata;
    const udpatedPublicMetatData = {
      ...previousPublicMetaData,
      dbUserId: res?.data.data.userId,
      role: "member",
    };

    await client.users.updateUser(userId, {
      publicMetadata: udpatedPublicMetatData,
    });
    if (res.data.error) {
      return { message: null, error: "User not created" };
    }
    if (res.status === 209) {
      return {
        message: "user already exists",
        error: null,
        data: { userId: res.data.data?.userId },
      };
    }
    return { data: { userId: res.data.data?.userId }, message: "user created" };
  } catch (error: any) {
    console.log(error);
    return { error: error?.message, data: null, message: "user not created" };
  }
};

export const completeOnboarding = async () => {
  const { userId } = await auth();
  const client = await clerkClient();

  if (!userId) {
    return { message: "No Logged In User" };
  }

  try {
    const currentUser = await client.users.getUser(userId);
    const previousPublicMetaData = currentUser.publicMetadata;
    const udpatedPublicMetatData = {
      ...previousPublicMetaData,
      onboardingComplete: true,
      role: "member",
    };

    const res = await client.users.updateUser(userId, {
      publicMetadata: udpatedPublicMetatData,
    });

    return { message: res.publicMetadata };
  } catch (err) {
    console.log(err);
    return { error: "There was an error updating the user metadata." };
  }
};
