import { type NextPage } from "next";
import Layout from "../components/Layout/Layout";

const Home: NextPage = () => {
  return (
    <>
      <Layout
        title="curricula"
        description="list of all curricula made by the user"
        crumbs="curricula"
      >
        <div className="p-2">hello world</div>
      </Layout>
    </>
  );
};

export default Home;
