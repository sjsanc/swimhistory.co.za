import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const table = req.body;
  const posts = await prisma[table].findMany();
  res.json(posts);
}
