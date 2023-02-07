import Head from "next/head";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface LayoutProps {
  title: string;
  description: string;
  crumbs: string;
  children: React.ReactNode;
}

const Layout = ({ title, description, crumbs, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title} | icy</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />

        <link rel="icon" href="/logo.svg" />
      </Head>
      <div className="ml-52 min-h-screen">
        <Sidebar />
        <div className="flex flex-col">
          <Header crumbs={crumbs} />
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
