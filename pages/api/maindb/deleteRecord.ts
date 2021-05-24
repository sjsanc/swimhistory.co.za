import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = JSON.parse(req.body);
  const { table, types } = body;

  // remove unneeded post data
  delete body.table; // table needs to be present for prisma to run
  delete body.types;

  const result = await prisma[table].delete({
    where: { id: body.id },
  });
  res.json(result);
}
