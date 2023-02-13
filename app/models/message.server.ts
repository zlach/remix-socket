import { prisma } from "~/db.server";

import type { Message } from "@prisma/client"

// export async function getPosts() {
//   return prisma.post.findMany();
// }

// export async function getPost(id: string) {
//   return prisma.post.findUnique({ where: { id } });
// }

export async function createMessage(
  message: Pick<Message, "threadId" | "senderId" | "recipientId" | "body">
) {
  return prisma.message.create({ data: message });
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