import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome Charles and Scott</h1>
      <p>I began learning Remix at 6pm CST on Friday, February 10th and created this Remix application on Sunday, February 12th.</p>
      <p>Please check out the <Link to="blog">blog</Link> to get my preliminary thoughts on Remix or <Link to="login">login</Link> to chat with other users.</p>
      <p>Thank you.</p>
    </div>
  );
}
