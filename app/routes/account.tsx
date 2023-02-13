import { Auth } from "aws-amplify";
// import { redirect } from "@remix-run/node";
import { Outlet, useNavigate } from "@remix-run/react";
import { useEffect } from "react";

export default function Account() {
  const navigate = useNavigate();

  useEffect(() => {
    async function retrieveAuthUser() {
      try {
        await Auth.currentAuthenticatedUser()
      } catch (error) {
        // do nothing...
      }
    }
    retrieveAuthUser()
  }, [navigate])

  return (
    <main>
      <Outlet />
    </main>
  );
}
