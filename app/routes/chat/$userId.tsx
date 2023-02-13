import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { Auth } from "aws-amplify";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { marked } from "marked";
import { useEffect } from "react";
import invariant from "tiny-invariant";

import { createThread, getThread } from "~/models/thread.server";

import { getSession, destroySession } from "~/utils/session.server";
import { createMessage } from "~/models/message.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  const session = await getSession(
    request.headers.get("Cookie")
  );

  const userIdSelf = session.get("userId");
  const userId = params.userId;

  invariant(typeof userId === "string", "params.userId must exist and be a string")
  invariant(typeof userIdSelf === "string", "need userId from session")

  const thread = await getThread(userIdSelf, userId)
console.log(thread);
  return json({ userIdSelf, thread })
};

export const action = async ({ request, params }: ActionArgs) => {
  const form = await request.formData();
  const session = await getSession(
    request.headers.get("Cookie")
  );

  const userIdSelf = session.get("userId");
  const userId = params.userId;
  const body = form.get("body");
  const lookupId = form.get("lookupId");

  invariant(typeof userId === "string", "params.userId must exist and be a string")
  invariant(typeof userIdSelf === "string", "need userId from session")
  invariant(typeof body === "string", "body must be a string")
  invariant(typeof lookupId === "string", "body must be a string")


  let message;
  if (lookupId === "") {
    const thread = await createThread({ initiatorId: userIdSelf, responderId: userId })
    message = await createMessage({ threadId: thread.lookupId, senderId: userIdSelf, recipientId: userId, body})
  } else {
    message = await createMessage({ threadId: lookupId, senderId: userIdSelf, recipientId: userId, body})
  }

  return json(message);
}

export default function UserId() {
  const { userIdSelf, thread } = useLoaderData<typeof loader>();
  const navigate = useNavigate()
  // note: again, this is problematic b/c of the syncing w/ the session
  useEffect(() => {
    async function retrieveAuthUser() {
      try {
        await Auth.currentAuthenticatedUser()
      } catch (error) {
        navigate('/')
      }
    }
    retrieveAuthUser()
  }, [navigate])
  return (
    <div>
      <div style={{ width: '500px', height: '500px', border: '1px solid black', overflowY: 'scroll', display: 'flex', flexDirection: 'column' }}>
      {thread && thread.messages.map((message) => {
        return (
          <div key={message.id} style={{ width: '225px', alignSelf: userIdSelf == message.senderId ? 'end' : 'start' }}>{message.body}</div>
        )
      })}
      </div>
      <form method="post">
        <input type="hidden" name="lookupId" value={thread ? thread.lookupId : ""} />
        <textarea name="body" style={{ width: '500px' }} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
