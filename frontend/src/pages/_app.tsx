import "@fontsource-variable/inter";
import type { AppProps } from "next/app";
import { Provider } from "@/components/ui/provider";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  // @ts-expect-error
  const getLayout = Component.layout || ((page: any) => page);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="An app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Provider dehydratedState={pageProps.dehydratedState}>
        {getLayout(<Component {...pageProps} />)}
      </Provider>
    </>
  );
}
