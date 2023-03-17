import { signIn } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

const SignInPage = () => {
  const handleSignIn = async (provider: string) => {
    await signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className="flex flex-1">
      <Head>
        <title>icy</title>
        <meta name="title" content="sign up" />
        <meta name="description" content="create an account" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <main className="flex min-h-screen flex-1 flex-shrink-0 flex-col items-center justify-center border-r-2 border-zinc-200 px-5 dark:border-zinc-800">
        <div className="grid w-96 grid-cols-1 gap-2">
          <div className="flex items-center gap-2">
            <svg
              width="30"
              height="30"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-teal-600 dark:fill-teal-400"
            >
              <g clipPath="url(#clip0_0_1)">
                <path d="M73.9142 77.9142L56.4142 60.4142C55.1543 59.1543 53 60.0466 53 61.8284V77.6716C53 78.202 53.2107 78.7107 53.5858 79.0858L71.0858 96.5858C72.3457 97.8457 74.5 96.9534 74.5 95.1716V79.3284C74.5 78.798 74.2893 78.2893 73.9142 77.9142Z" />
                <path d="M22.0858 26.0858L39.5858 43.5858C40.8457 44.8457 39.9534 47 38.1716 47H22.3284C21.798 47 21.2893 46.7893 20.9142 46.4142L3.41422 28.9142C2.15429 27.6543 3.04662 25.5 4.82843 25.5L20.6716 25.5C21.202 25.5 21.7107 25.7107 22.0858 26.0858Z" />
                <path d="M79.0858 53.5858L96.5858 71.0858C97.8457 72.3457 96.9534 74.5 95.1716 74.5H79.3284C78.798 74.5 78.2893 74.2893 77.9142 73.9142L60.4142 56.4142C59.1543 55.1543 60.0466 53 61.8284 53H77.6716C78.202 53 78.7107 53.2107 79.0858 53.5858Z" />
                <path d="M79.0858 46.4142L96.5858 28.9142C97.8457 27.6543 96.9534 25.5 95.1716 25.5H79.3284C78.798 25.5 78.2893 25.7107 77.9142 26.0858L60.4142 43.5858C59.1543 44.8457 60.0466 47 61.8284 47H77.6716C78.202 47 78.7107 46.7893 79.0858 46.4142Z" />
                <path d="M22.0858 73.9142L39.5858 56.4142C40.8457 55.1543 39.9534 53 38.1716 53H22.3284C21.798 53 21.2893 53.2107 20.9142 53.5858L3.41422 71.0858C2.15429 72.3457 3.04662 74.5 4.82843 74.5H20.6716C21.202 74.5 21.7107 74.2893 22.0858 73.9142Z" />
                <path d="M26.0858 77.9142L43.5858 60.4142C44.8457 59.1543 47 60.0466 47 61.8284V77.6716C47 78.202 46.7893 78.7107 46.4142 79.0858L28.9142 96.5858C27.6543 97.8457 25.5 96.9534 25.5 95.1716V79.3284C25.5 78.798 25.7107 78.2893 26.0858 77.9142Z" />
                <path d="M53.5858 20.9142L71.0858 3.41421C72.3457 2.15428 74.5 3.04662 74.5 4.82843V20.6716C74.5 21.202 74.2893 21.7107 73.9142 22.0858L56.4142 39.5858C55.1543 40.8457 53 39.9534 53 38.1716V22.3284C53 21.798 53.2107 21.2893 53.5858 20.9142Z" />
                <path d="M46.4142 20.9142L28.9142 3.41421C27.6543 2.15428 25.5 3.04662 25.5 4.82843V20.6716C25.5 21.202 25.7107 21.7107 26.0858 22.0858L43.5858 39.5858C44.8457 40.8457 47 39.9534 47 38.1716V22.3284C47 21.798 46.7893 21.2893 46.4142 20.9142Z" />
              </g>
              <defs>
                <clipPath id="clip0_0_1">
                  <rect width="100" height="100" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <span className="text-xl font-thin">icy manager</span>
          </div>
          <div>
            <div className="text-3xl font-light">welcome back</div>
            <div className="text-sm">sign in to your account</div>
          </div>
          <button
            type="button"
            className="my-2 flex items-center justify-center gap-2 rounded bg-[#5865F2] py-2 text-white"
            onClick={() => void handleSignIn("discord")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 127.14 96.36"
              height={18}
              className="fill-white"
            >
              <g id="图层_2" data-name="图层 2">
                <g id="Discord_Logos" data-name="Discord Logos">
                  <g
                    id="Discord_Logo_-_Large_-_White"
                    data-name="Discord Logo - Large - White"
                  >
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                  </g>
                </g>
              </g>
            </svg>
            Continue with Discord
          </button>
          <div className="place-self-center text-sm">
            <span className="text-zinc-500">{"don't have an account? "}</span>
            <Link href="/sign-up" className="underline">
              sign up now
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignInPage;
