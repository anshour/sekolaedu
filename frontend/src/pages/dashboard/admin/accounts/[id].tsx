import AdminLayout from "@/components/layout/admin-layout";
import BorderedBox from "@/components/ui/bordered-box";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import DataProperty from "@/components/ui/data-property";
import { useFetchUserById } from "@/hooks/use-fetch-users";
// import useUser from "@/context/use-user";
import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Image,
  SimpleGrid,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  const userId = router.query.id as string;

  const { user, isFetching } = useFetchUserById(userId);

  console.log("User Data:", user);
  //   const user = useUser((state) => state.user);

  return (
    <Box mx="auto" w="full" maxW="breakpoint-lg">
      <Box mb="3">
        <Breadcrumb
          items={[
            { title: "Dashboard", url: "/" },
            { title: "Accounts", url: "/dashboard/admin/accounts" },
            { title: "Account Detail" },
          ]}
        />
      </Box>
      <Card.Root>
        <Card.Body>
          <Flex justifyContent="space-between" alignItems="center" mb="4">
            <Card.Title>Account Detail</Card.Title>
          </Flex>
          <BorderedBox mb="3">
            <Flex
              alignItems="center"
              flexDirection={{ base: "column", sm: "row" }}
              gap={5}
            >
              <Box py="3" flexShrink={0}>
                {!!user?.photo_url ? (
                  <Image
                    src={user?.photo_url || ""}
                    w="20"
                    h="20"
                    objectPosition="center"
                    mx="auto"
                    objectFit="cover"
                    alt="user avatar"
                    rounded="full"
                  />
                ) : (
                  <Box
                    w="20"
                    h="20"
                    mx="auto"
                    rounded="full"
                    flexShrink={0}
                    bgColor="gray.200"
                  ></Box>
                )}
              </Box>
              <SimpleGrid w="full" columns={{ base: 1, sm: 3 }} gap="3">
                <DataProperty
                  isLoading={isFetching}
                  label="Nama"
                  value={user?.name}
                />
                <DataProperty
                  isLoading={isFetching}
                  label="Email"
                  value={user?.email}
                />
                <DataProperty
                  isLoading={isFetching}
                  label="Role"
                  value={user?.role_name}
                />
                <DataProperty
                  isLoading={isFetching}
                  label="Active"
                  element={
                    <Badge colorPalette={user?.is_active ? "green" : "red"}>
                      {user?.is_active ? "Active" : "Inactive"}
                    </Badge>
                  }
                />
                <DataProperty
                  isLoading={isFetching}
                  label="Opsi"
                  element={
                    <Flex gap="2">
                      <Button size="2xs" variant="outline">
                        Ubah
                      </Button>
                      <Button size="2xs" variant="outline" colorPalette="red">
                        Hapus
                      </Button>
                    </Flex>
                  }
                />
              </SimpleGrid>
            </Flex>
          </BorderedBox>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}

Page.layout = function (page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};
