import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Container,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { useColorModeValue } from "@/components/ui/color-mode";

export default function Page() {
  const router = useRouter();
  const previousPath = router.query.previous_path as string;
  const message = router.query.message as string;

  const bgGradient = useColorModeValue(
    "linear(to-br, red.50, orange.50, yellow.50)",
    "linear(to-br, red.900, orange.900, yellow.900)"
  );

  const cardBg = useColorModeValue("white", "gray.800");
  const iconColor = useColorModeValue("red.500", "red.300");

  const handleGoHome = () => {
    router.push("/");
  };

  const handleRefresh = () => {
    if (previousPath) {
      router.push(previousPath);
    } else {
      router.reload();
    }
  };

  return (
    <Box
      minH="100vh"
      bgGradient={bgGradient}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={{ base: 3, sm: 4, md: 6 }}
    >
      <Container maxW={{ base: "sm", md: "md" }}>
        <VStack
          bg={cardBg}
          borderRadius={{ base: "xl", md: "2xl" }}
          p={{ base: 6, sm: 8 }}
          shadow="2xl"
          gap={{ base: 5, md: 6 }}
          textAlign="center"
          border="1px"
          borderColor={useColorModeValue("gray.200", "gray.700")}
          w="full"
        >
          <Box
            p={{ base: 4, md: 6 }}
            borderRadius="full"
            bg={useColorModeValue("red.100", "red.900")}
            animation="pulse 2s infinite"
          >
            <AlertTriangle size={40} style={{ color: iconColor }} />
          </Box>

          <VStack gap={{ base: 2, md: 3 }}>
            <Heading
              size={{ base: "lg", md: "xl" }}
              color={useColorModeValue("gray.800", "white")}
              fontWeight="bold"
            >
              Oops! Something went wrong
            </Heading>

            <Text
              color={useColorModeValue("gray.600", "gray.300")}
              fontSize={{ base: "md", md: "lg" }}
              maxW={{ base: "xs", sm: "sm" }}
              lineHeight="tall"
              px={{ base: 2, sm: 0 }}
            >
              {message ||
                "We encountered an unexpected error. Don't worry, it's not your fault!"}
            </Text>
          </VStack>

          <VStack gap={{ base: 2, md: 3 }} w="full">
            <Button
              colorScheme="blue"
              size={{ base: "md", md: "lg" }}
              onClick={handleGoHome}
              w="full"
              borderRadius={{ base: "lg", md: "xl" }}
              fontSize={{ base: "sm", md: "md" }}
              h={{ base: "12", md: "14" }}
            >
              <Home size={20} /> Go to Homepage
            </Button>

            {!!previousPath && (
              <Button
                variant="outline"
                size={{ base: "md", md: "lg" }}
                onClick={handleRefresh}
                w="full"
                borderRadius={{ base: "lg", md: "xl" }}
                fontSize={{ base: "sm", md: "md" }}
                h={{ base: "12", md: "14" }}
              >
                <RefreshCw size={20} /> Try Again
              </Button>
            )}
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}
