import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Container,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ShieldX, Home, ArrowLeft } from "lucide-react";
import { useColorModeValue } from "@/components/ui/color-mode";

export default function Page() {
  const router = useRouter();

  const bgGradient = useColorModeValue(
    "linear(to-br, red.50, pink.50, purple.50)",
    "linear(to-br, red.900, pink.900, purple.900)"
  );

  const cardBg = useColorModeValue("white", "gray.800");
  const iconColor = useColorModeValue("red.500", "red.300");

  const handleGoHome = () => {
    router.push("/home");
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <Box
      minH="100vh"
      bgGradient={bgGradient}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={{ base: 0, sm: 4, md: 6 }}
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
            <ShieldX size={40} style={{ color: iconColor }} />
          </Box>

          <VStack gap={{ base: 2, md: 3 }}>
            <Heading
              size={{ base: "xl", md: "2xl" }}
              color={useColorModeValue("gray.800", "white")}
              fontWeight="bold"
            >
              403
            </Heading>

            <Heading
              size={{ base: "lg", md: "xl" }}
              color={useColorModeValue("gray.800", "white")}
              fontWeight="semibold"
            >
              Access Forbidden
            </Heading>

            <Text
              color={useColorModeValue("gray.600", "gray.300")}
              fontSize={{ base: "md", md: "lg" }}
              maxW={{ base: "xs", sm: "sm" }}
              lineHeight="tall"
              px={{ base: 2, sm: 0 }}
            >
              You don&apos;t have permission to access this resource. Please
              contact your administrator if you believe this is an error.
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

            <Button
              variant="outline"
              size={{ base: "md", md: "lg" }}
              onClick={handleGoBack}
              w="full"
              borderRadius={{ base: "lg", md: "xl" }}
              fontSize={{ base: "sm", md: "md" }}
              h={{ base: "12", md: "14" }}
            >
              <ArrowLeft size={20} /> Go Back
            </Button>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}
