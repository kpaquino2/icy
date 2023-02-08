import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { X } from "phosphor-react";
import { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";

const Home: NextPage = () => {
  const { data: session } = useSession();
  const [showNotice, setShowNotice] = useState(true);

  useEffect(() => {
    if (session) setShowNotice(false);
  }, [session]);

  return (
    <>
      <Layout
        title="curricula"
        description="list of all curricula made by the user"
        crumbs="curricula"
      >
        {showNotice && (
          <div className="flex gap-2 bg-teal-600 p-1 text-sm text-zinc-100 dark:bg-teal-400 dark:text-zinc-900">
            <button
              type="button"
              onClick={() => setShowNotice(false)}
              className="place-self-end"
            >
              <X size={20} />
            </button>
            create an account to access your curricula from other devices.
            <Link href="sign-up" className="underline">
              click here to sign up
            </Link>
          </div>
        )}
        <div className="grid grid-cols-1 p-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <div className="col-span-full text-2xl font-light">curricula</div>
        </div>
      </Layout>
    </>
  );
};

export default Home;
