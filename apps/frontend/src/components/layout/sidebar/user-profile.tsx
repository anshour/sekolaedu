import { Box, Text, Flex, Image } from "@chakra-ui/react";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "../../ui/menu";
import useUser from "@/context/use-user";
import { useRouter } from "next/router";
import { useLogoutUser } from "@/query/use-fetch-users";

export const UserProfile = () => {
  const user = useUser((state) => state.user);
  const router = useRouter();
  const logoutMutation = useLogoutUser();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    localStorage.removeItem("token");
    router.push("/auth/login");
  };
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Flex
          rounded="sm"
          alignItems="center"
          px="3"
          m="3"
          py="2"
          gap="3"
          bgColor="gray.700"
          cursor="pointer"
          _hover={{
            bgColor: "gray.800",
          }}
        >
          {user?.photo_url ? (
            <Image
              src={user.photo_url}
              w="7"
              h="7"
              objectPosition="center"
              objectFit="cover"
              alt="user avatar"
              rounded="full"
              flexShrink={0}
            />
          ) : (
            <Box w="7" h="7" rounded="full" bgColor="gray.500" flexShrink={0} />
          )}
          <Flex justifyContent="space-between" w="full" alignItems="center">
            <Box>
              <Text fontWeight="semibold" fontSize="sm" color="white">
                {user?.name}
              </Text>
              <Text fontSize="xs" color="gray.300">
                {user?.role_name}
              </Text>
            </Box>
            <EllipsisVertical size="18" color="white" />
          </Flex>
        </Flex>
      </MenuTrigger>
      <MenuContent>
        <MenuItem
          as={Link}
          // @ts-expect-error
          href={`/dashboard/${user?.role_name}/profile`}
          width="200px"
          value="profile"
        >
          Profile
        </MenuItem>
        <MenuItem
          width="200px"
          value="logout"
          color="fg.error"
          onClick={handleLogout}
          _hover={{ bg: "bg.error", color: "fg.error" }}
        >
          Logout
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  );
};
