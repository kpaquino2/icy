import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { X } from "phosphor-react";
import { useState } from "react";
import Layout from "../components/Layout/Layout";

const Home: NextPage = () => {
  const { data: session } = useSession();
  const [showNotice, setShowNotice] = useState(true);

  return (
    <>
      <Layout
        title="curricula"
        description="list of all curricula made by the user"
        crumbs="curricula"
      >
        {!session && showNotice && (
          <div className="flex justify-between bg-teal-600 p-1 text-sm text-zinc-100 dark:bg-teal-400 dark:text-zinc-900">
            create an account to access your curricula from other devices
            <button type="button" onClick={() => setShowNotice(false)}>
              <X size={20} />
            </button>
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
