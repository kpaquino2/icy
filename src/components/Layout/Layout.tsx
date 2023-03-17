import Head from "next/head";
import Header from "./Header";
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
      <div className="flex h-screen flex-col">
        <Header />
        <div className="flex h-full overflow-hidden">
          <Sidebar />
          <main className="flex w-full flex-1 flex-col overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;
