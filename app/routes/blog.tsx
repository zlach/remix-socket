import { json } from "@remix-run/node";

import { Link, Outlet, useLoaderData, useCatch } from "@remix-run/react";

import { getPosts } from "~/models/post.server";

export const loader = async () => {
  const posts = await getPosts();

  if (!posts.length) {
    throw new Response("No posts found", {
      status: 404,
    });
  }

  return json({ posts });
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

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <div>
        <div>There are no posts to display.</div>
        <Link to="/">
          {'<'} back to home
        </Link>
      </div>
    );
  }
  throw new Error(
    `Unexpected caught response with status: ${caught.status}`
  );
}

export function ErrorBoundary() {
  return (
    <div>
        <div>Whoops, something went wrong.</div>
        <Link to="/">
          {'<'} back to home
        </Link>
    </div>
  );
}