import Link from "next/link";
import { useRouter } from "next/router";

const NotionDisplay = () => {
  const router = useRouter();

  console.log(router.query);

  return (
    <div className="text-center py-10 min-h-screen flex justify-center items-center flex-col">
      <img src="/logo.png" alt="Hasotion Logo" className="h-40 mb-5" />

      {router.query.error ? (
        <>
          <h1 className="text-3xl text-gray-600">Error Occurred</h1>
          <p className="text-sm mt-5">
            {router.query.error === "notReady" ? (
              "None of the articles are marked as ready. At least mark one article as ready in the Notion database"
            ) : (
              <p>
                Configuration is unsuccessful. Go to{" "}
                <Link href="/config" className="text-blue-500">
                  config page
                </Link>{" "}
                to reconfigure or contact support.
              </p>
            )}
          </p>
        </>
      ) : (
        <>
          <h1 className="text-3xl text-gray-600">
            Successfully Updated The Article
          </h1>
          <p className="text-xl italic mt-2">
            &quot;{router.query["title"]}&quot;
          </p>
          <p className="text-xs mt-8">
            * If this isn&apos;t the article you want to update, try again after
            ticking the <span className="font-bold">Ready</span> check box in
            the Notion database
          </p>
        </>
      )}
    </div>
  );
};

export default NotionDisplay;
