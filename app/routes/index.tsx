import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome Charles and Scott</h1>
      <p>I created this app to show you that I am ready and able to be a contributor!</p>
      <p>Please check out the <Link to="blog">blog</Link> to get some of my spontaneous thoughts on Remix or <Link to="account">login</Link> to chat with other users.</p>
      <p>Thank you for considering me!</p>
    </div>
  );
}
