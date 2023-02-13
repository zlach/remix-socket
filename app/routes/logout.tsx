import type {
  ActionArgs,
  LoaderArgs,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { destroySession, getSession } from "~/utils/session.server";


export const action = async ({ request }: ActionArgs) => {
  const session = await getSession(
    request.headers.get("Cookie")
  );

  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};

export const loader = async () => {
  return redirect("/");
};