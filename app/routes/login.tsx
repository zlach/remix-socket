import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome Charles and Scott</h1>
      <p>At 6pm CST on Friday, February 12th I had no Remix exprience and limited Socket and TypeScript experience</p>
      <p>By Sunday I had created this application, which I hope illustrates my dedication and ability.</p>
      <p>Please check out the <Link to="blog">blog</Link> or <Link to="login">login</Link> to chat with other users.</p>
      <p>Thank you.</p>
    </div>
  );
}
