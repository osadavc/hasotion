import { GetServerSideProps, NextPage } from "next";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

interface HomeProps {
  isLoggedIn: boolean;
}

const Home: NextPage<HomeProps> = ({ isLoggedIn }) => {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto text-center flex flex-col min-h-screen justify-center items-center px-5">
      <img
        src="/logo.png"
        alt="Hasotion Logo"
        className="w-44 md:w-56 lg:w-64"
      />
      <h1 className="font-inter font-black text-5xl md:text-6xl lg:text-[5.5rem] capitalize mt-8 !leading-[1.15]">
        Write your <span className="text-[#2962FF]">hashnode</span> blog without
        leaving notion
      </h1>
      {isLoggedIn ? (
        <div>
          <button
            className="text-3xl border-2 border-black px-8 py-3 mt-10 rounded-sm font-bold"
            onClick={() => {
              router.push("/config");
            }}
          >
            Edit your Configuration
          </button>
          <p className="text-xs mt-3">
            * Make sure you&apos;re logged in here before publishing articles on
            Notion
          </p>
        </div>
      ) : (
        <button
          className="text-3xl border-2 border-black px-8 py-3 mt-10 rounded-sm font-bold"
          onClick={() => {
            signIn("google", {
              redirect: true,
              callbackUrl: "/config",
            });
          }}
        >
          Get Started
        </button>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  return {
    props: {
      isLoggedIn: !!session?.id,
    },
  };
};

export default Home;
