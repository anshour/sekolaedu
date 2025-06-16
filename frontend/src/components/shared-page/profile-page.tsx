import useUser from "@/context/use-user";
import { Box, Button, Card, Flex } from "@chakra-ui/react";
import FormProvider from "../ui/form/form-provider";
import { InputField } from "../ui/form/input-field";

export default function ProfilePage() {
  const user = useUser((state) => state.user);

  const handleSuccess = (res: any) => {
    useUser.getState().refetchUser();
  };
  return (
    <>
      <Card.Root mx="auto" w="full" maxW="breakpoint-md">
        <Card.Body>
          <Card.Title>Profile Setting</Card.Title>
          <br />
          <Box>
            <FormProvider
              defaultValues={{
                photo: "",
                name: user?.name || "",
                email: user?.email || "",
              }}
              method="patch"
              api="/users/profile"
              successMessage="Profile updated successfully"
              onSuccess={handleSuccess}
            >
              {({ isLoading, control }) => (
                <>
                  <Flex alignItems="center" gap="4" py="4">
                    <Box
                      w="16"
                      h="16"
                      rounded="full"
                      bgColor="gray.200"
                      flexShrink={0}
                    />
                    <InputField
                      control={control}
                      name="name"
                      placeholder="Your name"
                      label="Name"
                      rules={{ required: "Harus diisi" }}
                      w="full"
                    />
                    <InputField
                      control={control}
                      name="email"
                      placeholder="Your email address"
                      label="Email"
                      type="email"
                      rules={{ required: "Harus diisi" }}
                      w="full"
                    />
                  </Flex>
                  <Box textAlign="right">
                    <Button type="submit" loading={isLoading}>
                      Save
                    </Button>
                  </Box>
                </>
              )}
            </FormProvider>
          </Box>
        </Card.Body>
      </Card.Root>
    </>
  );
}
