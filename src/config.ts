let NEXTAUTH_URL;

let GOOGLE_CLIENT_ID;
let GOOGLE_CLIENT_SECRET;

let NOTION_CLIENT_ID;
let NOTION_CLIENT_SECRET;
let NOTION_AUTH_URL;

let CLOUDINARY_CLOUD_NAME;
let CLOUDINARY_API_KEY;
let CLOUDINARY_API_SECRET;

try {
  NEXTAUTH_URL = process.env.NEXTAUTH_URL;

  GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

  NOTION_CLIENT_ID = process.env.NOTION_CLIENT_ID;
  NOTION_CLIENT_SECRET = process.env.NOTION_CLIENT_SECRET;
  NOTION_AUTH_URL = process.env.NEXT_PUBLIC_NOTION_AUTH_URL;

  CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
  CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
  CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
} catch (error) {
  console.log(error);
}

const env = {
  nextAuthURL: NEXTAUTH_URL,
  googleClientId: GOOGLE_CLIENT_ID ?? "",
  googleClientSecret: GOOGLE_CLIENT_SECRET ?? "",
  notionClientId: NOTION_CLIENT_ID ?? "",
  notionClientSecret: NOTION_CLIENT_SECRET ?? "",
  notionAuthURL: NOTION_AUTH_URL ?? "",
  cloudinaryCloudName: CLOUDINARY_CLOUD_NAME ?? "",
  cloudinaryAPIKey: CLOUDINARY_API_KEY ?? "",
  cloudinaryAPISecret: CLOUDINARY_API_SECRET ?? "",
};

export default env;
