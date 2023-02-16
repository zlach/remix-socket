import { prisma } from "~/db.server";

export async function seed() {
  const posts = [
    {
      title: "Start Here!",
      markdown: `
  Thank you Charles and Scott for checking out my blog.

  In my interview with Scott he mentioned I should check out Remix, so I went ahead and looked into it.

  I was immediately excited to see that Remix is built by the React Router folks, whom I like a lot.
  Ryan Florence is hilarious. He and the React Router crew also run a company called React
  Training through which I completed [a few courses](https://courses.reacttraining.com/) a couple
  years ago.

  I started learning Remix on Friday (2/10) and spent Friday and Saturday completing both the short and the
  long tutorials from the Remix documentation. My two completed tutorials are on my GitHub
  [here](https://github.com/zlach/remix-practice) and [here](https://github.com/zlach/remix-jokes).

  Then on Sunday (2/12) I built this app, which you can find in my GitHub [here](https://github.com/zlach/remix-socket).
  This is not meant to be a "good" application. I coded it with the goal of learning about Remix, not with the goal
  of creating an awesome final product. This blog is my opportunity to show you that I learned a lot in
  the process of building it.

  I called this application react-socket because I intended to hook the chat feature up to sockets. However, I
  never got the chance to set up sockets because my refactored authentication solution ended up taking up most
  of my time on Sunday. In was a great learning experience that I discuss in the next blog. Hopefully I'll have
  a chance to do the sockets later this week, but I wanted to get the app out to you sooner rather than later.

  ## Thank you for reading!
      `.trim(),
    },
    {
      title: "Authentication in Remix",
      markdown: `  
  Security and DevOps are hard concepts to learn, and I am still learning.
  
  The authentication solution that I normally use is AWS Cognito, which I handle with the AWS Amplify library on
  the front end. I don't send passwords to the backend of my application so that I don't have to worry about transmitting.
  them. The identity token, which is stored in localStorage, gets sent with my Axios calls and then I validate the token
  on the backend with a new aws-jwt-verify package that the AWS team created.

  This has disadvangages though, among which is the fact that the information for writing to my user pool is publically
  available and so fake accounts could easily be created that would crowd my user pool. There are ways around this, but
  I definitely liked looking at a platform that encourages sending hashed passwords to the backend and handling sessions
  from there.

  As I started to refactor some of the tutorial concepts into my usual authentication solution, I began to realize why it wouldn't
  work with Remix. The loader functions can't access the identity tokens stored in localStorage. Perhaps there are ways to send the
  tokens on page load as headers, but that would seem to be an anti-pattern in Remix. I ended up not being able to access information
  about the user making the call.

  Ultimately I saw why the cookie solution in the tutorials was designed the way it was. I implemented a combination authentication
  that uses both cookes/backend sessions as well as aws-amplify on the frontend. My solution is problematic for a couple reasons,
  one of which is that you have to sync the expiry/refreshes of the AWS JWT and the Remix cookie.

  Remix seems to heavily encourage cookies and backend sessions.
      `.trim(),
    },
    {
      title: "Prisma - Quick Thoughts",
      markdown: `  
- Cool that it works for SQL and MongoDB
- Pretty nice documentation - One thing I learned while using Sequelize ORM is
that understanding a SQL ORM is a lot easier if you know what you want to achieve in SQL,
because you can ask better questions
- I did end up having some referencing issues when creating my schemas, so I had to create
fewer references between the tables. I'm still learning how to achieve the proper level of
relation between SQL tables and when to use lookup tables. For example, I wasn't sure how
to have the Message table reference the multi-field id on the Thread table, so I had to create
a separate lookupId on the Thread table
- The seeding tool did not work when deploying to Fly. I spent a long time trying to make it work,
but couldn't figure it out. Ultimately I had to seed the db manually in the Root of my project,
which is obviously a hack
- Prisma doesn't seem to enable or at least encourage locking, so is versioning necesary with prisma?
      `.trim(),
    },
    {
      title: "Styles - (Or lack thereof)",
      markdown: `  
- Obviously not a lot going on with my styles
- I agree with the Remix documentation that lots of React styling solutions seem a bit over-engineered
- Tailwind, which seems to be a popular pairing with Remix seems chill. I didn't have a chance to work
with it, but I like the idea of sticking with classes. I normally achieve much of my styling with bootstrap classes.
- I noticed that cloudstore.co uses MUI. MUI styling has always seemed a little difficult to me, and
I typically avoid using it for that reason. With that said, it's a major technology, and I have used it...
I'm definitely interested in learning more about it and using it some more.
      `.trim(),
    },
    {
      title: "Remix - Final Thoughts",
      markdown: `  
- It seems like it is a good choice for an online marketplace, because of the speed.
- It seems to encourage use of cookies for authentication.
- I believe the docs when they say that coding in Remix makes you a better developer.
The way that it encourages you to work with lower-level browser functionality, http, html, etc.
really makes you have to think about you're doing, which I like. It does make a few things
verbose and does make some things more challenging, but I like the challenge becuase it is
so educative.
- Seems like the required index files in the route folders can sometimes be unnecessary and
redundant, but maybe I just don't understand
- I am curious about validation, especially on the backend. Usually I run the data that hits
my API through joi schemas before I do any work with it. Perhaps that's less necessary with
TypeScript.
- It was cool to see a React platform that offers so much right out of the box; like a database,
authentication, and help with deployment
- It was encouraging that the React Router team is in charge of the platform, because they create
wonderful educational content. The two tutorials, one of which was very long, worked flawlessly
(except that darn prisma seeding on deployment)

## Overall I'm very excited about what I've learned, and thank you for introducing me to Remix
### - Zach
      `.trim(),
    },
  ];

  const res = await prisma.post.findFirst();

  if (!res) {
    for (const post of posts) {
      await prisma.post.create({ data: post });
    }
  }

  const user = await prisma.user.findUnique({
    where: {
      id: process.env.ZACH_SUB
    }
  })

  if (!user && typeof process.env.ZACH_SUB === "string") {
    await prisma.user.create({
      data: {
        id: process.env.ZACH_SUB,
        email: "zacharysp@gmail.com"
      }
    })
  }

  console.log(`Database has been seeded. 🌱`);
}