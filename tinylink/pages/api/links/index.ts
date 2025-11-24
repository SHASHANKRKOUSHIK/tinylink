// pages/api/links/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

/**
 * NOTE
 * - We fetch DB rows which contain Date objects (createdAt, lastClicked).
 * - For the API response we convert dates to ISO strings, and expose `clicks`.
 * - This keeps TypeScript happy (no Date vs string mismatch) and returns stable JSON.
 */

type LinkResponse = {
  code: string;
  longUrl: string;
  clicks: number;
  lastClicked: string | null;
  createdAt: string;
};

function isValidCode(code: string) {
  return /^[A-Za-z0-9]{6,8}$/.test(code);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
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

      // convert DB dates to ISO strings for JSON response
      const result: LinkResponse = {
        code: created.code,
        longUrl: created.longUrl,
        clicks: (created as any).clickCount ?? 0,
        lastClicked: (created as any).lastClicked ? (created as any).lastClicked.toISOString() : null,
        createdAt: (created as any).createdAt ? (created as any).createdAt.toISOString() : new Date().toISOString(),
      };

      return res.status(201).json(result);
    } catch (err) {
      console.error("POST /api/links error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  } else if (req.method === "GET") {
    try {
      // fetch raw DB rows (these contain Date objects)
      const dbLinks = await prisma.link.findMany({
        orderBy: { createdAt: "desc" },
      });

      // normalize for API: convert Dates -> ISO strings, expose `clicks`
      const normalized: LinkResponse[] = dbLinks.map((l) => ({
        code: l.code,
        longUrl: l.longUrl,
        clicks: typeof (l as any).clickCount === "number" ? (l as any).clickCount : 0,
        lastClicked: l.lastClicked ? l.lastClicked.toISOString() : null,
        createdAt: l.createdAt ? l.createdAt.toISOString() : new Date().toISOString(),
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