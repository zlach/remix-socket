import { prisma } from "~/db.server";

import type { Message } from "@prisma/client"

export async function createMessage(
  message: Pick<Message, "threadId" | "senderId" | "recipientId" | "body">
) {
  return prisma.message.create({ data: message });
}
