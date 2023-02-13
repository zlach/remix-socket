import { prisma } from "~/db.server";

import type { User } from "@prisma/client"

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