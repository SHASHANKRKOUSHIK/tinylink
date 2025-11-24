// pages/api/links/[code].ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Code required" });
  }

  if (req.method === "GET") {
    try {
      const link = await prisma.link.findUnique({
        where: { code },
      });

      if (!link) {
        return res.status(404).json({ error: "Not found" });
      }

      return res.status(200).json(link);
    } catch (err) {
      console.error("GET /api/links/:code error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const link = await prisma.link.findUnique({
        where: { code },
      });

      if (!link) {
        return res.status(404).json({ error: "Not found" });
      }

      await prisma.link.delete({
        where: { code },
      });

      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("DELETE /api/links/:code error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  res.setHeader("Allow", ["GET", "DELETE"]);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
