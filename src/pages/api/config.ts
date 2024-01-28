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
  const user = await prisma.user.findUnique({
    where: {
      id: req.userId,
    },
  });

  res.json({
    data: {
      notionPage: user?.notionPage,
      hashnodeAccessToken: user?.hashnodeAccessToken,
    },
  });
});

router.post(async (req, res) => {
  const { notionPage, hashnodeAccessToken } = req.body;

  if (notionPage === null && hashnodeAccessToken === null) {
    return res.status(400).json({
      error: "Notion page or hashnode token is not provided",
    });
  }
});

export default router.handler({
  onError,
  onNoMatch,
});
