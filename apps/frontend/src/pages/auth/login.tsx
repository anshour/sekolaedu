import { Box, Button, Card, Input, SimpleGrid } from "@chakra-ui/react";
import FormProvider from "@/components/ui/form/form-provider";
import { Field } from "@/components/ui/field";
import useUser from "@/context/use-user";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { DASHBOARD_ROUTES } from "@/constants/roles";

export default function Page() {
  const isAuthenticated = useUser((state) => state.isAuthenticated());
  const user = useUser((state) => state.user);
  const router = useRouter();
  const redirectUrl = (router.query.redirect as string) || "/home";

  const handleLoginSuccess = (res: any) => {
    localStorage.setItem("token", res.data.token);
    useUser.setState({ user: res.data.user });
  };

  const validateRedirectUrl = (url: string, userRole: string): boolean => {
    // Allow home page for all users
    if (url === "/home") return true;

    // Check if the redirect URL matches the user's role pattern
    const dashboardRoute = DASHBOARD_ROUTES[userRole];
    if (!dashboardRoute) return false;

    // Check if the URL starts with the role's allowed pattern
    return url.startsWith(dashboardRoute);
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      if (redirectUrl) {
        // Validate if user role is allowed to access the redirect URL
        if (validateRedirectUrl(redirectUrl, user.role?.name)) {
          router.push(redirectUrl);
        } else {
          // If not allowed, redirect to user's default dashboard
          router.push("/home");
        }
      } else {
        // No specific redirect, go to role-based dashboard
        router.push("/home");
      }
    }
  }, [isAuthenticated, user, router, redirectUrl]);

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
                      {/* TODO: ADD ICON TO SHOW AND HIDE PASSWORD */}
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
