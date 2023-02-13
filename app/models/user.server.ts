import { prisma } from "~/db.server";

import type { User } from "@prisma/client"
import { createThread } from "./thread.server";
import { createMessage } from "./message.server";

export async function getUsers(id: string) {
  return prisma.user.findMany({
    where: {
      id: {
        not: id,
      }
    }
  });
}

export async function getUser(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(
  user: Pick<User, "id" | "email">
) {
  const initiatorId = process.env.ZACH_SUB;
  if (initiatorId) {

    const { lookupId } = await createThread({ initiatorId, responderId: user.id, })
    await createMessage({
      threadId: lookupId,
      senderId: initiatorId,
      recipientId: user.id,
      body: "Thank you for looking at my app. I wanted to get Sockets going, but didn't quite have the time before Monday. Feel free to leave me a message! Or, you can create another user to message."
    })
  }
  return prisma.user.create({ data: user });
}

// export async function updatePost(
//   id: Post["id"],
//   post: Pick<Post, "id" | "title" | "markdown">
// ) {
//   return prisma.post.update({ where: { id }, data: post });
// }

// export function deletePost(id : string) {
//   return prisma.post.delete({ where: { id } })
// }