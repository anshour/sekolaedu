import { Box } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export default function GuestLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Box minH="100vh" as="main" bgColor="gray.100">
        {children}
      </Box>
    </>
  );
}
