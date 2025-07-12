import useUser from "@/context/use-user";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";

export default function Home() {
  const isAuthenticated = useUser((state) => state.isAuthenticated());

  return (
    <main>
      <Box
        minH="100vh"
        bgColor="gray.100"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        gap={2}
      >
        <Text>Welcome</Text>
        {!isAuthenticated && (
          <Flex gap={2}>
            <Link href="/auth/register">
              <Button>Register</Button>
            </Link>
            <Link href="/auth/login">
              <Button>Login</Button>
            </Link>
          </Flex>
        )}

        {isAuthenticated && (
          <Flex gap={2}>
            <Link href="/home">
              <Button>Home</Button>
            </Link>
          </Flex>
        )}
      </Box>
    </main>
  );
}
