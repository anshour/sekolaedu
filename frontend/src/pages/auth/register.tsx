import GuestLayout from "@/components/layout/guest-layout";
import FormProvider, {
  FormProviderProps,
} from "@/components/ui/form/form-provider";
import { InputField } from "@/components/ui/form/input-field";
import { InputPasswordField } from "@/components/ui/form/input-password-field";
import useUser from "@/context/use-user";
import { Button, Card, SimpleGrid, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function Page() {
  const formProps: FormProviderProps = {
    defaultValues: {
      email: "",
      name: "",
      password: "",
      password_confirmation: "",
    },
    api: "/auth/register",
    nextPage: "/home",
    successMessage: "Register success",
    onSuccess: (res: any) => {
      localStorage.setItem("token", res.data.token);
      useUser.setState({ user: res.data.user });
    },
  };

  return (
    <main>
      <Text>Register</Text>
      <Card.Root maxW="480px" mx="auto">
        <Card.Body>
          <FormProvider {...formProps}>
            {({ isLoading, control }) => (
              <>
                <SimpleGrid gap="3" columns={1}>
                  <InputField
                    control={control}
                    name="name"
                    placeholder="John Doe"
                    label="Name"
                    rules={{ required: "Harus diisi" }}
                    w="full"
                  />
                  <InputField
                    control={control}
                    name="email"
                    placeholder="johndoe@example.com"
                    label="Email"
                    type="email"
                    rules={{ required: "Harus diisi" }}
                    w="full"
                  />

                  <InputPasswordField
                    name="password"
                    control={control}
                    label="Password"
                    rules={{
                      required: "Harus diisi",
                    }}
                  />

                  <InputPasswordField
                    name="password_confirmation"
                    control={control}
                    label="Password Confirmation"
                    rules={{
                      required: "Harus diisi",
                    }}
                  />

                  <Button type="submit" loading={isLoading}>
                    Register
                  </Button>
                </SimpleGrid>
              </>
            )}
          </FormProvider>
        </Card.Body>
      </Card.Root>
    </main>
  );
}

Page.layout = function getLayout(page: ReactNode) {
  return <GuestLayout>{page}</GuestLayout>;
};
