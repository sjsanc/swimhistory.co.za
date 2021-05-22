import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = await prisma.$queryRaw(`
    SELECT Table_Name, Column_Name, Data_Type FROM information_schema.columns
    WHERE Table_Schema = 'swimhistory_db'
  `);
  res.json(result);
}
