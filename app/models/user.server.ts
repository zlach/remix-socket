import { prisma } from "~/db.server";

import type { User } from "@prisma/client"

export async function getUsers() {
  return prisma.user.findMany();
}

export async function getUser(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

// export async function createPost(
//   post: Pick<Post, "id" | "title" | "markdown">
// ) {
//   return prisma.post.create({ data: post });
// }

// export async function updatePost(
//   id: Post["id"],
//   post: Pick<Post, "id" | "title" | "markdown">
// ) {
//   return prisma.post.update({ where: { id }, data: post });
// }

// export function deletePost(id : string) {
//   return prisma.post.delete({ where: { id } })
// }