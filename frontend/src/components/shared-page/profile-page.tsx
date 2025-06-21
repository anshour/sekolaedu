import useUser from "@/context/use-user";
import { Box, Button, Card, Flex } from "@chakra-ui/react";
import FormProvider from "../ui/form/form-provider";
import { InputField } from "../ui/form/input-field";
import AvatarInputField from "../ui/form/avatar-input-field";

export default function ProfilePage() {
  const user = useUser((state) => state.user);

  const handleSuccess = () => {
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
                photo_url: (user?.photo_url || "") as File | string,
                name: user?.name || "",
                email: user?.email || "",
              }}
              transformToFormData
              method="patch"
              api="/users/profile"
              successMessage="Profile updated successfully"
              onSuccess={handleSuccess}
            >
              {({ isLoading, control }) => (
                <>
                  <Flex alignItems="center" gap="4" py="4">
                    <AvatarInputField
                      control={control}
                      name="photo_url"
                      initialUrl={user?.photo_url || ""}
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
