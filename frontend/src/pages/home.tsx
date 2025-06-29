import useUser from "@/context/use-user";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { DASHBOARD_ROUTES } from "@/constants/roles";

export default function Home() {
  const router = useRouter();
  const user = useUser((state) => state.user);

  const redirectToDashboard = async () => {
    // await useUser.getState().refetchUser();

    const roleRoute = DASHBOARD_ROUTES[user!.role_name];
    if (roleRoute) {
      router.push(roleRoute);
    } else {
      router.push(
        `/error?message=Unauthorized access for role ${
          user!.role_name
        }.code_r1&previous_path=/home`
      );
    }
  };

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    redirectToDashboard();
  }, [user]);

  return <>Please wait...</>;
}
