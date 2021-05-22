import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const table = req.query.table;

  if (req.method === "GET") {
    handleGET(table, res);
  } else if (req.method === "DELETE") {
    handleDELETE(table, res);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}

// GET /api/post/:id
async function handleGET(table, res) {
  const data = await prisma[table].findMany();
  res.json(data);
}

// DELETE /api/post/:id
async function handleDELETE(tableName, res) {
  // const data = await prisma.post.delete({
  //   where: { id: Number(postId) },
  // });
  // res.json(post);
}
