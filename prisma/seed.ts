import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  const posts = [
    {
      title: "My First Post",
      markdown: `
  # This is my first post
  
  Isn't it great?
      `.trim(),
    },
    {
      title: "A Mixtape I Made Just For You",
      markdown: `
  # 90s Mixtape
  
  - I wish (Skee-Lo)
  - This Is How We Do It (Montell Jordan)
  - Everlong (Foo Fighters)
  - Ms. Jackson (Outkast)
  - Interstate Love Song (Stone Temple Pilots)
  - Killing Me Softly With His Song (Fugees, Ms. Lauryn Hill)
  - Just a Friend (Biz Markie)
  - The Man Who Sold The World (Nirvana)
  - Semi-Charmed Life (Third Eye Blind)
  - ...Baby One More Time (Britney Spears)
  - Better Man (Pearl Jam)
  - It's All Coming Back to Me Now (Céline Dion)
  - This Kiss (Faith Hill)
  - Fly Away (Lenny Kravits)
  - Scar Tissue (Red Hot Chili Peppers)
  - Santa Monica (Everclear)
  - C'mon N' Ride it (Quad City DJ's)
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

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
