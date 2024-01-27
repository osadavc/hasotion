import { NextApiRequest, NextApiResponse } from "next";

import { createRouter } from "next-connect";

import { auth, onError, onNoMatch } from "@/utils/apiUtils";

const router = createRouter<NextApiRequest, NextApiResponse>();
router.use(auth);

router.all(async (req, res) => {
  res.redirect("/notion");
});

export default router.handler({
  onError,
  onNoMatch,
});
