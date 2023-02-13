import type { ActionArgs } from "@remix-run/node";
import { Auth } from "aws-amplify";
import { SyntheticEvent, useEffect} from "react";
import { useState } from "react";
import { Hub } from 'aws-amplify'
import { useFetcher, useNavigate } from "@remix-run/react";
import { createUser } from "~/models/user.server";
import { redirect } from "@remix-run/node";
import { commitSession, getSession } from "~/utils/session.server";

export const action = async ({ request }: ActionArgs) => {
  const data = await request.formData();
  const id = data.get("id");
  const email = data.get("email")
  const actionType = data.get("actionType")

  if (typeof id !== "string" || typeof email !== "string" || typeof actionType !== "string") {
    throw new Error("data was formatted incorrectly")
  }

  if (actionType === "createUser") {
    await createUser({ id, email });
  }

  if (actionType === "commitSession") {
    const session = await getSession(
      request.headers.get("Cookie")
    );

    session.set("userId", id);
  
    return redirect("/chat", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  return null;
}

export default function Login() {
  const [loginType, setLoginType] = useState<string>('login')
  const [password, setPassword] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [code, setCode] = useState<string>('')

  const fetcher = useFetcher();

  const [showCode, setShowCode] = useState<boolean>();
  const navigate = useNavigate();

  const listenToAutoSignInEvent = () => {
    Hub.listen('auth', ({ payload }) => {
      const { event } = payload
      if (event === 'autoSignIn') {
        console.log('autoSignIn success')
        fetcher.submit({ id: payload.data.attributes.sub, email: payload.data.attributes.email, actionType: "commitSession" }, { method: "post" });
      } else if (event === 'autoSignIn_failure') {
        console.log('autoSignIn fail')
        navigate('/')
      }
    })
  }

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()
  
    switch (loginType) {
      case "login": {
        const { attributes: { sub } } = await Auth.signIn(email, password)
        if (!sub) {
          return;
        }

        return fetcher.submit({ id: sub, email, actionType: "commitSession" }, { method: "post" });
      }
      case "register": {
        if (code && typeof code !== "string") {
          return;
        } else if (code) {
          listenToAutoSignInEvent()

          await Auth.confirmSignUp(email, code)

          return;
        }
        
        const { userSub } = await Auth.signUp({
          username: email,
          password,
          attributes: {
            email,
          },
          autoSignIn: {
            enabled: true,
          },
        })

        fetcher.submit({ id: userSub, email, actionType: "createUser" }, { method: "post" });
  
        return setShowCode(true);
      }
      default: {
        return;
      }
    }
  };

  // Note: The solution below is problematic b/c we also need to make sure the session has the id
  useEffect(() => {
    async function retrieveAuthUser() {
      try {
        const res = await Auth.currentAuthenticatedUser()
        if (res) {
          navigate('/chat')
        }
      } catch (error) {
        // do nothing...
      }
    }
    retrieveAuthUser()
  }, [navigate])

  return (
    <div className="container">
      <div className="content" data-light="">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend className="sr-only">
              Login or Register?
            </legend>
            <label>
              <input
                type="radio"
                name="loginType"
                value="login"
                defaultChecked={
                  loginType ===
                  "login"
                }
                onChange={() => setLoginType(type => type === "login" ? "register" : "login")}
              />{" "}
              Login
            </label>
            <label>
              <input
                type="radio"
                name="loginType"
                value="register"
                defaultChecked={
                  loginType ===
                  "register"
                }
                onChange={() => setLoginType(type => type === "login" ? "register" : "login")}
              />{" "}
              Register
            </label>
            {loginType === "register" && <div><i>A code will be sent to your email. Email and password must be submitted with code.</i></div>}
          </fieldset>
          <div>
            <label htmlFor="email-input">Email</label>
            <input
              type="text"
              id="email-input"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password-input">Password</label>
            <input
              id="password-input"
              name="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          {showCode ? <div>
            <label htmlFor="code-input">Code</label>
            <input
              type="text"
              id="code-input"
              name="code"
              value={code}
              onChange={e => setCode(e.target.value)}
            />
          </div> : <div style={{ cursor: 'pointer', color: 'blue' }} onClick={() => setShowCode(true)}>Show Confirmation Code Input</div>}
          <button type="submit" className="button">
            Submit
          </button>
        </form>
      </div>
      <div>
        <br/>
        Note: There is no error handling in the UI<br/><br/>
        Please ensure valid email address (confirmation code will be sent for new accounts)<br/><br/>
        Please ensure password:<br/>
        Contains at least 1 number<br/>
        Contains at least 1 special character<br/>
        Contains at least 1 uppercase letter<br/>
        Contains at least 1 lowercase letter
      </div>
    </div>
  );
}