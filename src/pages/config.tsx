import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ConfigPage = () => {
  const [config, setConfig] = useState<{
    notionPage?: string;
    hashnodeAccessToken?: string;
    hashnodePublicationId?: string;
  }>({});

  useEffect(() => {
    (async () => {
      const { data } = await axios.get("/api/config");
      setConfig(data.data);
    })();
  }, []);

  const saveInfo = async () => {
    const saveInfoAPI = axios.post("/api/config", config);

    await toast.promise(saveInfoAPI, {
      error: "Error Ocurred",
      loading: "Saving",
      success: "Successfully Saved",
    });
  };

  const syncBlogs = async () => {
    const syncBlogsAPI = axios.post("/api/sync");

    await toast.promise(syncBlogsAPI, {
      error: "Error Ocurred",
      loading: "Syncing",
      success: "Synced Saved",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-3">
      <div className="flex items-center flex-col pt-10">
        <div className="flex flex-col items-center">
          <img
            src="/logo.png"
            alt="Hasotion Logo"
            className="w-32 md:w-36 lg:w-44"
          />
          <h1 className="font-inter font-black text-4xl capitalize mt-5 !leading-[1.15] text-center">
            Edit Hasotion Configuration
          </h1>
        </div>
        <div className="border w-full mt-14 border-black min-h-5 rounded-sm px-5 py-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl">Notion Page</h3>
            <a
              href="https://osadavc.notion.site/25f38ed4737648368bb425d10b4d32ea?v=0d41c98629204b0ba8504155315d4287&pvs=4"
              target="_blank"
            >
              <button className="bg-black text-white py-2 px-4 rounded-sm">
                Notion Page
              </button>
            </a>
          </div>
          <p className="mt-1">
            Clone the Notion template and share with full access and paste the
            link here. Details can be found{" "}
            <a
              href="https://support.hashnode.com/en/articles/6423579-developer-access-token"
              target="_blank"
              className="text-blue-500"
            >
              here.
            </a>
          </p>
          <input
            type="text"
            placeholder="Notion Page URL"
            className="border px-3 py-2 w-full border-black mt-5 rounded-sm focus:outline-none"
            value={config.notionPage}
            onChange={(e) => {
              setConfig((prev) => ({
                ...prev,
                notionPage: e.target.value,
              }));
            }}
          />
        </div>
        <div className="border w-full mt-10 border-black min-h-5 rounded-sm px-5 py-6">
          <h3 className="text-2xl">Hashnode Personal Access Token</h3>
          <p className="mt-1">
            Obtain your Hashnode access token from the Hashnode account. Details
            can be found{" "}
            <a
              href="https://support.hashnode.com/en/articles/6423579-developer-access-token"
              target="_blank"
              className="text-blue-500"
            >
              here.
            </a>
          </p>
          <input
            type="text"
            placeholder="Hashnode Personal Access Token"
            className="border px-3 py-2 w-full border-black mt-5 rounded-sm focus:outline-none"
            value={config.hashnodeAccessToken}
            onChange={(e) => {
              setConfig((prev) => ({
                ...prev,
                hashnodeAccessToken: e.target.value,
              }));
            }}
          />
        </div>
        <div className="border w-full mt-10 border-black min-h-5 rounded-sm px-5 py-6">
          <h3 className="text-2xl">Hashnode Publication ID</h3>
          <p className="mt-1">
            Go to your Hashnode blog dashboard and copy the publication ID from
            the URL. Details can be found{" "}
            <a
              href="https://support.hashnode.com/en/articles/6423579-developer-access-token"
              target="_blank"
              className="text-blue-500"
            >
              here.
            </a>
          </p>
          <input
            type="text"
            placeholder="Hashnode Personal Access Token"
            className="border px-3 py-2 w-full border-black mt-5 rounded-sm focus:outline-none"
            value={config.hashnodePublicationId}
            onChange={(e) => {
              setConfig((prev) => ({
                ...prev,
                hashnodePublicationId: e.target.value,
              }));
            }}
          />
        </div>
      </div>
      <div className="mt-10 mb-5 flex space-x-5">
        <button
          className="bg-black text-white py-2 px-5 rounded-sm"
          onClick={saveInfo}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ConfigPage;
