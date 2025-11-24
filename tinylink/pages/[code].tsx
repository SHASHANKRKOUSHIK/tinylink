// pages/[code].tsx
import { GetServerSideProps } from "next";
import prisma from "../lib/prisma";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const code = typeof params?.code === "string" ? params.code : null;
  if (!code) return { notFound: true };

  try {
    // find link by code
    const link = await prisma.link.findUnique({ where: { code } });

    if (!link) {
      return { notFound: true };
    }

    // increment clickCount atomically and set lastClicked
    await prisma.link.update({
      where: { code },
      data: {
        // Use the field your schema uses — here it is `clickCount`
        clickCount: { increment: 1 },
        lastClicked: new Date(),
      },
    });

    // redirect to target URL
    return {
      redirect: {
        destination: link.longUrl,
        permanent: false,
      },
    };
  } catch (err) {
    console.error("Redirect error for code", code, err);
    // If something fails, return notFound to avoid leaking errors
    return { notFound: true };
  }
};

export default function Redirect() {
  // This will never render because we redirect server-side
  return null;
}
