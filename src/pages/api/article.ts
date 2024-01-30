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
import { GraphQLClient, gql } from "graphql-request";
import { NotionToMarkdown } from "notion-to-md";
import slugify from "slugify";

const router = createRouter<NextApiRequestWithUser, NextApiResponse>();
router.use(auth);

router.get(async (req, res) => {
  const loggedInUser = (await prisma.user.findUnique({
    where: {
      id: req.userId,
    },
  }))!;

  if (
    !(
      loggedInUser.hashnodeAccessToken === null ||
      loggedInUser.notionToken === null ||
      loggedInUser.hashnodePublicationId === null ||
      loggedInUser.notionPage === null
    )
  ) {
    const notion = new Client({
      auth: loggedInUser.notionToken,
    });
    const n2m = new NotionToMarkdown({ notionClient: notion });

    const databaseId = new URL(loggedInUser.notionPage).pathname.split("/")[2];

    const { results: databaseItems } = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          timestamp: "last_edited_time",
          direction: "descending",
        },
      ],
      filter: {
        property: "Ready",
        checkbox: {
          equals: true,
        },
      },
    });

    if (databaseItems.length === 0) {
      return res.redirect("/notion?error=notReady");
    }

    const savingItem: any = databaseItems[0];

    const notionBlocks = await n2m.pageToMarkdown(savingItem.id);
    const notionString = n2m.toMarkdownString(notionBlocks);

    const title = savingItem.properties.Title.title
      .map((item: any) => item.plain_text)
      .join(" ");

    const subtitle = savingItem.properties.Subtitle.rich_text
      .map((item: any) => item.plain_text)
      .join(" ");

    const tags = savingItem.properties.Subtitle.rich_text[0].plain_text
      .split(",")
      .map((item: any) => ({
        slug: item,
      }));

    console.log(JSON.stringify(tags));

    const query = gql`
        mutation {
          publishPost(
            input: {
              title: "${title}"
              subtitle: "${subtitle}"
              publicationId: "${loggedInUser.hashnodePublicationId}"
              contentMarkdown: 
              slug: 
              tags: 
            }
          ) {
            __typename
          }
        }
    `;

    const gqlClient = new GraphQLClient("https://gql.hashnode.com/");
    const data = await gqlClient.request(query);

    res.send(data);
  } else {
    return res.redirect("/notion?error=notConfigured");
  }

  // res.redirect("/notion");
});

export default router.handler({
  onError,
  onNoMatch,
});
