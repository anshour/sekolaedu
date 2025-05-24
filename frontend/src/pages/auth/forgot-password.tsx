import GuestLayout from "@/components/layout/guest-layout";
import { Field } from "@/components/ui/field";
import FormProvider, {
  FormProviderProps,
} from "@/components/ui/form/form-provider";
import { handleMutationError } from "@/utils/new-error-handler";
import { Alert, Button, Card, Input, Text } from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const [emailSent, setEmailSent] = useState(false);

  const formProps: FormProviderProps = {
    defaultValues: {
      email: "",
    },
    api: "/auth/forgot-password",
    onSuccess: (res: any) => {
      setEmailSent(true);
    },
    onError: (errors) => {
      if (errors.status === 404) {
        toast.error("User with the email is not found");
      } else {
        handleMutationError(errors);
      }
    },
  };
  return (
    <main>
      <Text mx="auto">Forgot password</Text>
      <Card.Root maxW="480px" mx="auto">
        <Card.Body>
          <Text>Please enter your email</Text>
          <br />
          {emailSent && (
            <Alert.Root status="success" mb="4">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Description>
                  We have sent you an email with a link to reset your password
                </Alert.Description>
              </Alert.Content>
            </Alert.Root>
          )}
          <FormProvider {...formProps}>
            {({ isLoading, formRegister, formErrors }) => (
              <>
                <Field
                  invalid={!!formErrors.email}
                  errorText={formErrors.email?.message}
                >
                  <Input
                    type="email"
                    placeholder="Email"
                    {...formRegister("email", {
                      required: "Email is required",
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
