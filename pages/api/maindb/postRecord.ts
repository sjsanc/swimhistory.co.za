import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = JSON.parse(req.body);
  const { table, types } = body;

  // remove unneeded post data
  delete body.table;
  delete body.types;

  // Remove unused fields so SQL doesn't yell
  Object.entries(body).forEach(([key, val]) => {
    let str = val.toString();
    if (str.length == 0) {
      delete body[key];
    }

    const dataType = types.find((x) => x.Column_Name == key).Data_Type;

    switch (dataType) {
      case "date":
        body[key] = new Date(str);
        break;
      default:
        null;
    }
  });

  const result = await prisma[table].create({
    data: body,
  });
  res.json(result);
}
