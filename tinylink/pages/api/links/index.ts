// pages/api/links/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

type Link = {
  code: string;
  longUrl: string;
  clickCount: number;
  lastClicked: Date | null;
  createdAt: Date;
};

function isValidCode(code: string) {
  return /^[A-Za-z0-9]{6,8}$/.test(code);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // accept both `code` and `customCode` from clients
    const { longUrl, code, customCode } = req.body ?? {};

    if (!longUrl || typeof longUrl !== "string") {
      return res.status(400).json({ error: "longUrl required" });
    }

    try {
      const parsed = new URL(longUrl);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        return res.status(400).json({ error: "Invalid URL" });
      }
    } catch {
      return res.status(400).json({ error: "Invalid URL" });
    }

    try {
      // prefer code, fallback to customCode (both allowed)
      let finalCode = (code ?? customCode)?.toString();

      if (finalCode) {
        if (!isValidCode(finalCode)) {
          return res.status(400).json({ error: "Invalid code format (6-8 chars A-Za-z0-9)" });
        }
        const existing = await prisma.link.findUnique({ where: { code: finalCode } });
        if (existing) {
          return res.status(409).json({ error: "Code already exists" });
        }
      } else {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const gen = (len = 6) => {
          let s = "";
          for (let i = 0; i < len; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
          return s;
        };

        let attempts = 0;
        do {
          finalCode = gen(6);
          const existing = await prisma.link.findUnique({ where: { code: finalCode } });
          if (!existing) break;
          attempts++;
        } while (attempts < 10);

        if (!finalCode) {
          return res.status(500).json({ error: "Failed to generate unique code" });
        }
      }

      const created = await prisma.link.create({
        data: {
          code: finalCode!,
          longUrl,
        },
      });

      return res.status(201).json(created);
    } catch (err) {
      console.error("POST /api/links error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  } else if (req.method === "GET") {
    try {
      const links: Link[] = await prisma.link.findMany({
        orderBy: { createdAt: "desc" },
      });

      // normalized response for frontend (frontend expects clicks)
      const normalized = links.map((l) => ({
        code: l.code,
        longUrl: l.longUrl,
        clicks: typeof l.clickCount === "number" ? l.clickCount : 0,
        lastClicked: l.lastClicked ?? null,
        createdAt: l.createdAt,
      }));

      return res.status(200).json(normalized);
    } catch (err) {
      console.error("GET /api/links error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
