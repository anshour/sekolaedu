import GuestLayout from "@/components/layout/guest-layout";
import { Field } from "@/components/ui/field";
import FormProvider, {
  FormProviderProps,
} from "@/components/ui/form/form-provider";
import { Button, Card, Input, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ReactNode } from "react";

export default function Page() {
  const router = useRouter();

  const formProps: FormProviderProps = {
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
    api: "/auth/reset-password",
    transform: (data) => {
      return {
        ...data,
        token: router.query.token as string,
        email: router.query.email as string,
      };
    },
    successMessage: "Password reset success",
    onSuccess: (res) => {
      localStorage.setItem("token", res.data.token);
      router.push("/home");
    },
  };
  return (
    <main>
      <Text mx="auto">Set new password</Text>
      <Card.Root maxW="480px" mx="auto">
        <Card.Body>
          <Text>Please enter new password</Text>
          <br />

          <FormProvider {...formProps}>
            {({ isLoading, formRegister, formErrors }) => (
              <>
                <Field
                  invalid={!!formErrors.email}
                  errorText={formErrors.email?.message}
                >
                  <Input
                    type="password"
                    placeholder="Password"
                    {...formRegister("password", {
                      required: "Password is required",
                    })}
                  />
                </Field>
                <Field
                  invalid={!!formErrors.password_confirmation}
                  errorText={formErrors.password_confirmation?.message}
                >
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    {...formRegister("password_confirmation", {
                      required: "Password confirmation is required",
                    })}
                  />
                </Field>
                <Button type="submit" loading={isLoading} mt="4" w="full">
                  Submit
                </Button>
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
