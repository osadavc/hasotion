import axios from "axios";
import { NextApiResponse } from "next";
import { createRouter } from "next-connect";

import {
  NextApiRequestWithUser,
  auth,
  onError,
  onNoMatch,
} from "@/utils/apiUtils";
import prisma from "@/utils/prisma";
import env from "@/config";

const router = createRouter<NextApiRequestWithUser, NextApiResponse>();

router.use(auth).get(async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "code is required" });
  }

  const { data: notionResponse } = await axios.post(
    "https://api.notion.com/v1/oauth/token",
    {
      grant_type: "authorization_code",
      code,
      redirect_uri: `${env.nextAuthURL}/api/auth/notion`,
    },
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${env.notionClientId}:${env.notionClientSecret}`
        ).toString("base64")}`,
      },
    }
  );

  if (!notionResponse.access_token) {
    return res.status(400).json({ error: "access_token is required" });
  }

  await prisma.user.update({
    where: {
      id: req.userId,
    },
    data: {
      notionToken: notionResponse.access_token,
    },
  });

  return res.status(200).redirect("/config");
});

export default router.handler({
  onError,
  onNoMatch,
});
