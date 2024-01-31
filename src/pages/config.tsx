import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ConfigPage = () => {
  const [config, setConfig] = useState<{
    hashnodeAccessToken?: string;
    hashnodePublicationId?: string;
    notionToken?: boolean;
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
          </div>
          <p className="mt-1">
            Connect Notion with the option &quot;Use a template provided by the
            developer&quot;. For more info, click{" "}
            <a
              href="https://support.hashnode.com/en/articles/6423579-developer-access-token"
              target="_blank"
              className="text-blue-500"
            >
              here.
            </a>
          </p>

          {config.notionToken ? (
            <p className="italic mt-3">Notion is already connected</p>
          ) : (
            <a href="https://api.notion.com/v1/oauth/authorize?client_id=198a806e-39a1-483c-bb1c-69f95c11d6c3&response_type=code&owner=user&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fnotion">
              <button className="bg-black text-white py-2 px-4 rounded-sm mt-3">
                Connect Notion
              </button>
            </a>
          )}
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
