import { NextApiResponse } from "next";

import { createRouter } from "next-connect";

import {
  NextApiRequestWithUser,
  auth,
  onError,
  onNoMatch,
} from "@/utils/apiUtils";
import prisma from "@/utils/prisma";
import { Client } from "@notionhq/client";

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
      hashnodeAccessToken: user?.hashnodeAccessToken,
      hashnodePublicationId: user?.hashnodePublicationId,
      notionToken: !!user?.notionToken,
    },
  });
});

router.post(async (req, res) => {
  const { hashnodeAccessToken, hashnodePublicationId } = req.body;

  if (hashnodeAccessToken === null && hashnodePublicationId === null) {
    return res.status(400).json({
      error: "Notion page or hashnode token is not provided",
    });
  }

  await prisma.user.update({
    where: {
      id: req.userId,
    },
    data: {
      hashnodeAccessToken: hashnodeAccessToken,
      hashnodePublicationId: hashnodePublicationId,
    },
  });

  const { notionToken } = (await prisma.user.findUnique({
    where: {
      id: req.userId,
    },
  }))!;

  const notion = new Client({
    auth: notionToken!,
  });

  const { results: notionResult } = await notion.search({
    page_size: 1,
    filter: {
      property: "object",
      value: "database",
    },
  });

  res.status(200).json({ notion: (notionResult[0] as any).url });
});

export default router.handler({
  onError,
  onNoMatch,
});
