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
import publishNewPostQuery from "@/graphql/publishNewPost";

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
      loggedInUser.hashnodePublicationId === null
    )
  ) {
    const notion = new Client({
      auth: loggedInUser.notionToken,
    });
    const n2m = new NotionToMarkdown({ notionClient: notion });

    const { results: notionResult } = await notion.search({
      page_size: 1,
      filter: {
        property: "object",
        value: "database",
      },
    });

    const databaseId = notionResult[0].id;

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

    const notionString = n2m.toMarkdownString(
      await n2m.pageToMarkdown(savingItem.id)
    );

    const title = savingItem.properties.Title.title
      .map((item: any) => item.plain_text)
      .join(" ");

    const notionSlug = slugify(
      savingItem.properties.Slug.rich_text
        .map((item: any) => item.plain_text)
        .join(" "),
      {
        lower: true,
      }
    ).replace(/[^a-zA-Z0-9-]/g, "");

    const slug =
      notionSlug ||
      slugify(title, {
        lower: true,
      }).replace(/[^a-zA-Z0-9-]/g, "");

    const subtitle = savingItem.properties.Subtitle.rich_text
      .map((item: any) => item.plain_text)
      .join(" ");

    const tags = savingItem.properties.Tags.rich_text[0].plain_text
      .split(",")
      .map((item: any) => ({
        slug: slugify(item, {
          lower: true,
        }).replace(/[^a-zA-Z0-9-]/g, ""),
        name: item,
      }));

    const coverImageURL =
      savingItem.properties["Cover Image"].files[0]?.file.url;

    const gqlClient = new GraphQLClient("https://gql.hashnode.com/", {
      headers: {
        Authorization: loggedInUser.hashnodeAccessToken,
      },
    });
    const data = await gqlClient.request(publishNewPostQuery, {
      input: {
        title,
        subtitle,
        publicationId: loggedInUser.hashnodePublicationId,
        contentMarkdown: notionString.parent,
        slug,
        tags,
        coverImageOptions: {
          coverImageURL,
        },
      },
    });

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
