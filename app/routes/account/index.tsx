import { Auth } from "aws-amplify";
import type { SyntheticEvent} from "react";
import { useState } from "react";
import { Hub } from 'aws-amplify'
import { useNavigate } from "@remix-run/react";

Hub.listen('auth', ({ payload }) => {
  const { event } = payload
  if (event === 'autoSignIn') {
    console.log('autosignin worked')
    // navigate('/chat')
  } else if (event === 'autoSignIn_failure') {
    console.log('autosignin failed')
    // redirect to sign in page\
    // navigate('/')
  }
})

export default function Login() {
  const [loginType, setLoginType] = useState<string>('login')
  const [password, setPassword] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [code, setCode] = useState<string>('')


  const [showCode, setShowCode] = useState<boolean>();
  // const navigate = useNavigate();

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()

    console.log(loginType)
  
    switch (loginType) {
      case "login": {
        const user = await Auth.signIn(email, password)
        if (!user) {
          return;
        }
        return navigate('/chat');
      }
      case "register": {
        if (code && typeof code !== "string") {
          return;
        } else if (code) {
          await Auth.confirmSignUp(email, code)
  
          return navigate('/chat')
        }
        
        await Auth.signUp({
          username: email,
          password,
          attributes: {
            email,
          },
          autoSignIn: {
            enabled: true,
          },
        })
  
        return setShowCode(true);
      }
      default: {
        return;
      }
    }
  };

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