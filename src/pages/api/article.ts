import { NextApiResponse } from "next";

import { createRouter } from "next-connect";

import {
  NextApiRequestWithUser,
  auth,
  onError,
  onNoMatch,
} from "@/utils/apiUtils";
import prisma from "@/utils/prisma";

const router = createRouter<NextApiRequestWithUser, NextApiResponse>();
router.use(auth);

router.get(async (req, res) => {
  const loggedInUser = await prisma.user.findUnique({
    where: {
      id: req.userId,
    },
  });

  // res.redirect("/notion");
});

export default router.handler({
  onError,
  onNoMatch,
});
