"use server";

import { currentUser,auth} from "@clerk/nextjs/server";


import { db } from "@/lib/db";

export const initialProfile = async () => {
  const user = await currentUser();
  const { redirectToSignIn } = await auth();
  if (!user) return redirectToSignIn(); 

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id
    }
  });

  if (profile) return profile;

  const name = user.firstName
    ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}`
    : user.id;

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress
    }
  });

  return newProfile;
};
