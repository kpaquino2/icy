import Head from "next/head";
import Sidebar from "./Sidebar";

interface LayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const Layout = ({ title, description, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title} | icy</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />

        <link rel="icon" href="/logo.svg" />
      </Head>
      <div className="ml-64 min-h-screen">
        <Sidebar />

        {children}
      </div>
    </>
  );
};

export default Layout;
