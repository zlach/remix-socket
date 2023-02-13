import { Auth } from "aws-amplify";
// import { redirect } from "@remix-run/node";
import { Outlet, useNavigate } from "@remix-run/react";
import { useEffect } from "react";

export default function Account() {
  useEffect(() => {
    async function retrieveAuthUser() {
      try {
        await Auth.currentAuthenticatedUser()
        console.log('success?')
      } catch (error) {
        // do nothing
      }
    }
    retrieveAuthUser()
  }, [])

  // const navigate = useNavigate();
  // Hub.listen('auth', ({ payload }) => {
  //   const { event } = payload
  //   if (event === 'autoSignIn') {
  //     console.log('autosignin worked')
  //     navigate('/chat')
  //   } else if (event === 'autoSignIn_failure') {
  //     console.log('autosignin failed')
  //     // redirect to sign in page\
  //     navigate('/')
  //   }
  // })


  return (
    <main>
      <Outlet />
    </main>
  );
}
