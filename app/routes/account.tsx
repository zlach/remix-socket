import { Auth } from "aws-amplify";
// import { redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
// import { useEffect } from "react";

export default function Account() {
  // useEffect(() => {
  //   async function retrieveAuthUser() {
  //     try {
  //       await Auth.currentAuthenticatedUser()
  //     } catch (error) {
  //       // do nothing
  //     }
  //   }
  //   retrieveAuthUser()
  // }, [])

  return (
    <main>
      <Outlet />
    </main>
  );
}
