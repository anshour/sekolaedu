"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";
import { system } from "@/theme/system";
import { useState } from "react";
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import queryConfig from "@/constants/query-config";
import { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ZustandHydrationGuard from "./hydration-guard";

interface Props extends ColorModeProviderProps {
  dehydratedState: AppProps["pageProps"]["dehydratedState"];
}

export function Provider(props: Props) {
  const [queryClient] = useState(() => new QueryClient(queryConfig));

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={props.dehydratedState}>
        <ZustandHydrationGuard>
          <ChakraProvider value={system}>
            <ColorModeProvider {...props} />
            <Toaster
              toastOptions={{
                duration: 4000,
                style:{
                  maxWidth: "500px",

                }
              }}
            />
            <ReactQueryDevtools initialIsOpen={false} />
          </ChakraProvider>
        </ZustandHydrationGuard>
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
