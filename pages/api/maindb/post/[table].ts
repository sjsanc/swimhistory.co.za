// import type { NextApiRequest, NextApiResponse } from "next";
// import prisma from "../../../lib/prisma";

// // POST /api/post
// // Required fields in body: title, authorEmail
// // Optional fields in body: content

// export default async function handle(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { table } = req.body;
//   const data = req.body;
//   delete data.table;

//   const result = await prisma[table].create({
//     data: req.body,
//   });
//   res.json(result);
// }
