import { NextApiResponse } from "next";

import { createRouter } from "next-connect";
import { v2 as cloudinary } from "cloudinary";

import {
  NextApiRequestWithUser,
  auth,
  onError,
  onNoMatch,
} from "@/utils/apiUtils";
import prisma from "@/utils/prisma";

import { Client } from "@notionhq/client";
import { GraphQLClient } from "graphql-request";
import { NotionToMarkdown } from "notion-to-md";
import slugify from "slugify";
import publishNewPostQuery from "@/graphql/publishNewPost";
import updatePostQuery from "@/graphql/updatePost";
import env from "@/config";

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

    // Step 1 - Get the database ID

    const { results: notionResult } = await notion.search({
      page_size: 1,
      filter: {
        property: "object",
        value: "database",
      },
    });

    const databaseId = notionResult[0].id;

    // Step 2 - Get the database entries with ready checkbox checked

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

    // Step 3 - Process all the properties to be consumed by the Hashnode API

    const hashnodeId = savingItem.properties["Hashnode Post ID"].rich_text
      ?.map((item: any) => item.plain_text)
      .join(" ");

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
      ?.map((item: any) => item.plain_text)
      .join(" ");

    const tags =
      savingItem.properties.Tags.rich_text[0]?.plain_text
        .split(",")
        .map((item: any) => ({
          slug: slugify(item, {
            lower: true,
          }).replace(/[^a-zA-Z0-9-]/g, ""),
          name: item,
        })) || [];

    const notionCoverImageURL =
      savingItem.properties["Cover Image"].files[0]?.file.url;
    let coverImageURL;

    if (notionCoverImageURL) {
      cloudinary.config({
        cloud_name: env.cloudinaryCloudName,
        api_key: env.cloudinaryAPIKey,
        api_secret: env.cloudinaryAPISecret,
      });

      const { secure_url } = await cloudinary.uploader.upload(
        notionCoverImageURL
      );

      coverImageURL = secure_url;
    }

    // Step 4 - Call Hashnode API and publish the post

    const gqlClient = new GraphQLClient("https://gql.hashnode.com/", {
      headers: {
        Authorization: loggedInUser.hashnodeAccessToken,
      },
    });

    let data: any;

    if (hashnodeId) {
      data = await gqlClient.request(updatePostQuery, {
        input: {
          id: hashnodeId,
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
    } else {
      data = await gqlClient.request(publishNewPostQuery, {
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
    }

    // Step 5 - Uncheck the ready checkbox

    databaseItems.forEach(async (item) => {
      await notion.pages.update({
        page_id: item.id,
        properties: {
          Ready: {
            checkbox: false,
          },
        },
      });
    });

    // Step 6 - Save hashnode ID

    if (!hashnodeId) {
      await notion.pages.update({
        page_id: savingItem.id,
        properties: {
          "Hashnode Post ID": {
            rich_text: [
              {
                text: { content: data.publishPost.post.id.toString() },
              },
            ],
          },
        },
      });
    }

    return res.redirect(
      `/notion?title=${title}&url=${
        data?.publishPost?.post.url || data?.updatePost?.post.url
      }`
    );
  } else {
    return res.redirect("/notion?error=notConfigured");
  }
});

export default router.handler({
  onError,
  onNoMatch,
});
