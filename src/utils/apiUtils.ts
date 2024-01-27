import { NextApiRequest, NextApiResponse } from "next";

export const auth = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: Function
) => {
  // const token = await getToken({
  //   req,
  //   secret: process.env.NEXTAUTH_SECRET,
  // });

  // if (!token?.id) {
  //   return res.status(401).json({
  //     status: 401,
  //     error: "Unauthorized",
  //   });
  // }

  // req.userId = token.id;
  return next();
};

export const onError = (err: any, _: NextApiRequest, res: NextApiResponse) => {
  console.log(err);
  return res.status(500).json({ statusCode: 500, message: err.message });
};

export const onNoMatch = (_: NextApiRequest, res: NextApiResponse) => {
  return res.status(404).json({ statusCode: 404, message: "Not Found" });
};
