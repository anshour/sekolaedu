import { Box, Button, Card, Input, SimpleGrid } from "@chakra-ui/react";
import FormProvider from "@/components/ui/form/form-provider";
import { Field } from "@/components/ui/field";
import useUser from "@/context/use-user";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Page() {
  const isAuthenticated = useUser((state) => state.isAuthenticated());
  const router = useRouter();
  const redirectUrl = (router.query.redirect as string) || "/home";

  const handleLoginSuccess = (res: any) => {
    localStorage.setItem("token", res.data.token);
    useUser.setState({ user: res.data.user });
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (redirectUrl) {
        // TODO: VALIDATE REDIRECT URL, ROLE MUST BE ALLOWED TO ACCESS
        router.push(redirectUrl);
      } else {
        router.push("/home");
      }
    }
  }, [isAuthenticated, router, redirectUrl]);

  return (
    <>
      <div>
        <main>
          <Box minH="100vh" bgColor="gray.100">
            <br />
            <Card.Root maxW="480px" mx="auto">
              <Card.Body>
                <FormProvider
                  defaultValues={{
                    email: "",
                    password: "",
                  }}
                  api="/auth/login"
                  nextPage={redirectUrl}
                  successMessage="Login success"
                  onSuccess={handleLoginSuccess}
                  // onError={handleLoginError}
                >
                  {({ isLoading, formRegister, formErrors }) => (
                    <SimpleGrid gap="3" columns={1}>
                      <Field
                        label="Email"
                        invalid={!!formErrors.email}
                        errorText={formErrors.email?.message}
                      >
                        <Input
                          type="email"
                          placeholder="user@example.com"
                          {...formRegister("email", {
                            required: "Email is required",
                          })}
                        />
                      </Field>
                      <Field
                        label="Password"
                        invalid={!!formErrors.password}
                        errorText={formErrors.password?.message}
                      >
                        <Input
                          type="password"
                          placeholder="Password"
                          {...formRegister("password", {
                            required: "Password is required",
                          })}
                        />
                      </Field>

                      <Button type="submit" loading={isLoading}>
                        Login
                      </Button>
                    </SimpleGrid>
                  )}
                </FormProvider>
              </Card.Body>
            </Card.Root>
          </Box>
        </main>
      </div>
    </>
  );
}
