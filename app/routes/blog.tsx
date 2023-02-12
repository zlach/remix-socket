import { json } from "@remix-run/node";

import { Link, Outlet, useLoaderData } from "@remix-run/react";

import { getPosts } from "~/models/post.server";

export const loader = async () => {
  return json({ posts: await getPosts() });
};

export default function Posts() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <main>
      <Link to="/">
        {'<'} back to home
      </Link>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link to={post.id}>
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
      <Outlet />
    </main>
  );
}
