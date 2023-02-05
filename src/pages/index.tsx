import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Layout from "../components/Layout/Layout";

const Home: NextPage = () => {
  return (
    <>
      <Layout title="Home" description="Home of icy application">
        hello world
      </Layout>
    </>
  );
};

export default Home;
