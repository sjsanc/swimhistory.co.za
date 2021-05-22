import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

// POST /api/post
// Required fields in body: title, authorEmail
// Optional fields in body: content

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = JSON.parse(req.body);
  const { table } = body;
  delete body.table;

  Object.entries(body).forEach(([key, val]) => {
    let str = val.toString();
    if (str.length == 0) {
      delete body[key];
    }
  });

  const result = await prisma[table].create({
    data: body,
  });
  res.json(result);
}
