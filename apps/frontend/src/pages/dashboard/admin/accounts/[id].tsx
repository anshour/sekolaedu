import AdminLayout from "@/components/layout/admin-layout";
import BorderedBox from "@/components/ui/bordered-box";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import DataProperty from "@/components/ui/data-property";
import useUser from "@/context/use-user";
import { useFetchUserById } from "@/query/use-fetch-users";
import http, { HttpError } from "@/utils/http";
import { handleMutationError } from "@/utils/new-error-handler";
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
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export default function Page() {
  const router = useRouter();
  const userId = router.query.id as string;

  const { user, isFetching } = useFetchUserById(userId);

  const loginMutation = useMutation({
    mutationFn: () => http.post(`/users/${userId}/token`),
    onSuccess: async (res) => {
      toast.success("Login successful, please wait...");
      localStorage.setItem("token", res.data.token);
      router.push("/home");
    },
    onError: (err) => {
      handleMutationError(err as HttpError);
    },
  });

  const handleClickLogin = () => {
    loginMutation.mutate();
  };

  return (
    <Box mx="auto" w="full" maxW="breakpoint-lg">
      <Box mb="3">
        <Breadcrumb
          items={[
            { title: "Dashboard", url: "/" },
            { title: "Accounts", url: "/dashboard/admin/accounts" },
            { title: "Detail" },
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
                    <Box gap="2">
                      <Button m="1" size="2xs" variant="outline">
                        Reset Password
                      </Button>
                      <Button
                        m="1"
                        size="2xs"
                        variant="outline"
                        onClick={handleClickLogin}
                        loading={loginMutation.isPending}
                      >
                        Login
                      </Button>
                      <Button m="1" size="2xs" variant="outline">
                        Update
                      </Button>
                      <Button
                        m="1"
                        size="2xs"
                        variant="outline"
                        colorPalette="red"
                      >
                        Hapus
                      </Button>
                    </Box>
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
