import { Amplify } from 'aws-amplify'
import { useEffect, useState } from "react";
import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { connect, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { wsContext } from "./ws-context";
import { json } from '@remix-run/node';

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader() {
  return json({
    ENV: {
      REACT_APP_IDENTITY_POOL: process.env.REACT_APP_IDENTITY_POOL,
      REACT_APP_REGION: process.env.REACT_APP_REGION,
      REACT_APP_USER_POOL: process.env.REACT_APP_USER_POOL,
      REACT_APP_CLIENT_ID: process.env.REACT_APP_CLIENT_ID,
    }
  });
}

export default function App() {
  const loaderData = useLoaderData<typeof loader>();
  

  if (loaderData && loaderData.ENV) {
    Amplify.configure({ Auth: {
      // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
      identityPoolId: loaderData?.ENV?.REACT_APP_IDENTITY_POOL,
  
      // REQUIRED - Amazon Cognito Region
      region: loaderData?.ENV?.REACT_APP_REGION,
  
      // OPTIONAL - Amazon Cognito User Pool ID
      userPoolId: loaderData?.ENV?.REACT_APP_USER_POOL,
  
      // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolWebClientId: loaderData?.ENV?.REACT_APP_CLIENT_ID,
  
      // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
      mandatorySignIn: true,
    } })
  }

  let [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap>>();

  useEffect(() => {
    let connection = connect();
    setSocket(connection);
    return () => {
      connection.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("event", (data) => {
      console.log(data);
    });
  }, [socket]);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <wsContext.Provider value={socket}>
          <Outlet />
        </wsContext.Provider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
