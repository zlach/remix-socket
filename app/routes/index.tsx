import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome Charles and Scott</h1>
      <p>I created this app to show you that I am learning Remix. Feel free to check out as much or as little as you want!</p>
      <p>You can check out the <Link to="blog">blog</Link> to get some of my thoughts on Remix or <Link to="account">login/Register</Link> to chat with other users.</p>
      <p>Thank you for considering me!</p>
    </div>
  );
}
