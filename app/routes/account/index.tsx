import { Auth } from "aws-amplify";
import { useState } from "react";
import {
  ActionArgs, redirect,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { badRequest, goodRequest } from "~/utils/request.server";

import { prisma } from "~/db.server";

import {
  Link,
  useActionData,
  Form,
} from "@remix-run/react";

function validateEmail(email: unknown) {
  if (typeof email !== "string" || !email.includes("@")) {
    return `Must be valid email`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string") {
    return `Must be valid password`;
  }
}

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const loginType = form.get("loginType");
  const email = form.get("email");
  const password = form.get("password");

  if (
    typeof loginType !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      successMessage: null,
      formError: `Form not submitted correctly.`,
    });
  }

  const fields = { loginType, email, password };
  const fieldErrors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      successMessage: null,
      formError: null,
    });
  }

  switch (loginType) {
    case "login": {
      const user = await Auth.signIn(email, password)
      if (!user) {
        return badRequest({
          fieldErrors: null,
          fields,
          successMessage: null,
          formError: `Email/Password combination is incorrect`,
        });
      }
      return redirect('/chat');
    }
    case "register": {
      const userExists = await prisma.user.findFirst({
        where: { email },
      });

      if (userExists) {
        return badRequest({
          fieldErrors: null,
          fields,
          successMessage: null,
          formError: `User with email ${email} already exists`,
        });
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

      return goodRequest({
        successMessage: `Show Confirm`,
        fields,
        fieldErrors: null,
        formError: null,
      });
    }
    default: {
      return badRequest({
        fieldErrors: null,
        fields,
        successMessage: null,
        formError: `Login type invalid`,
      });
    }
  }
};

export default function Login() {
  const actionData = useActionData<typeof action>();
  const [showCode, setShowCode] = useState<boolean>();

  return (
    <div className="container">
      <div className="content" data-light="">
        <h1>Login</h1>
        <Form method="post">
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
                  !actionData?.fields?.loginType ||
                  actionData?.fields?.loginType === "login"
                }
              />{" "}
              Login
            </label>
            <label>
              <input
                type="radio"
                name="loginType"
                value="register"
                defaultChecked={
                  actionData?.fields?.loginType ===
                  "register"
                }
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
              defaultValue={actionData?.fields?.email}
              aria-invalid={Boolean(
                actionData?.fieldErrors?.email
              )}
              aria-errormessage={
                actionData?.fieldErrors?.email
                  ? "email-error"
                  : undefined
              }
            />
            {actionData?.fieldErrors?.email ? (
              <p
                className="form-validation-error"
                role="alert"
                id="email-error"
              >
                {actionData.fieldErrors.email}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="password-input">Password</label>
            <input
              id="password-input"
              name="password"
              type="password"
              defaultValue={actionData?.fields?.password}
              aria-invalid={Boolean(
                actionData?.fieldErrors?.password
              )}
              aria-errormessage={
                actionData?.fieldErrors?.password
                  ? "password-error"
                  : undefined
              }
            />
            {actionData?.fieldErrors?.password ? (
              <p
                className="form-validation-error"
                role="alert"
                id="password-error"
              >
                {actionData.fieldErrors.password}
              </p>
            ) : null}
          </div>
          {showCode || actionData?.successMessage ? <div>
            <label htmlFor="code-input">Code</label>
            <input
              type="text"
              id="code-input"
              name="code"
            />
          </div> : <div style={{ cursor: 'pointer' }} onClick={() => setShowCode(true)}>Show Confirmation Code Input</div>}
          <div id="form-error-message">
            {actionData?.formError ? (
              <p
                className="form-validation-error"
                role="alert"
              >
                {actionData.formError}
              </p>
            ) : null}
          </div>
          <button type="submit" className="button">
            Submit
          </button>
        </Form>
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