import { Auth } from "aws-amplify";
import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useNavigate, useLoaderData, Link, Form } from "@remix-run/react";
import { useEffect } from "react";
import { getSession } from "~/utils/session.server";
import { getUsers } from "~/models/user.server";

export const loader = async ({ request }: ActionArgs) => {
  const session = await getSession(
    request.headers.get("Cookie")
    );

  const userId = session.get("userId")
    
  const users = await getUsers(userId);

  return json({ users });
};

export default function Chat() {
  const { users } = useLoaderData<typeof loader>();

  const navigate = useNavigate();

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
    <main>
      <Form action="/logout" method="post" onSubmit={() => Auth.signOut()}>
        <button type="submit" className="button">
          Logout
        </button>
        <span style={{ marginLeft: '20px', marginRight: '20px' }}>or</span>
        <Link to="/blog">Go To Blog</Link>
      </Form>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link to={user.id}>
              {user.email}
            </Link>
          </li>
        ))}
      </ul>
      <Outlet />
    </main>
  );
}
