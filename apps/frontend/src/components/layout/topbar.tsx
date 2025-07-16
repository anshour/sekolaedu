import { Box, Flex, IconButton, useDisclosure } from "@chakra-ui/react";
import { Menu } from "lucide-react";

interface Props {
  isDesktop: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

const Topbar = ({ isDesktop, isOpen, onToggle }: Props) => {
  const disclosure = useDisclosure();

  return (
    <>
      <Box
        bgColor="#00a65a"
        position="fixed"
        zIndex={1}
        width="full"
        // shadow="base"
        borderBottom="solid 1px"
        borderBottomColor="gray.300"
        left={0}
        top={0}
        px={2}
        py={3}
      >
        <Flex
          pl={isOpen && isDesktop ? "var(--sidebar-width)" : "0"}
          justifyContent="space-between"
          transition="padding 0.4s"
        >
          <Flex alignItems="center" gap={2}>
            <IconButton
              colorScheme="primary"
              variant="plain"
              color="white"
              fontSize="24px"
              aria-label="toggle menu"
              height="auto"
              minW={0}
              px="1"
              onClick={onToggle}
            >
              <Menu />
            </IconButton>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default Topbar;
