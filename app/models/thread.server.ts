import { prisma } from "~/db.server";

import type { Thread } from "@prisma/client"


export async function getThread(user1: string, user2: string) {
  let thread;

  thread = await prisma.thread.findUnique({ where: {
    initiatorId_responderId: {
      initiatorId: user1,
      responderId: user2
    }
   },
   include: {
    messages: true, // Return all fields
  }, });

  if (!thread){
    thread = await prisma.thread.findUnique({ where: {
      initiatorId_responderId: {
        initiatorId: user2,
        responderId: user1
      }
     },
     include: {
      messages: true, // Return all fields
    }, });
  }

  return thread;
}

export async function createThread(
  thread: Pick<Thread, "initiatorId" | "responderId">
) {
  return prisma.thread.create({ data: thread });
}
