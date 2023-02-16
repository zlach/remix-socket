import { prisma } from "~/db.server";

import type { Post } from "@prisma/client"

export async function getPosts() {
  return prisma.post.findMany();
}

export async function getPost(id: Post["id"]) {
  return prisma.post.findUnique({ where: { id } });
}
