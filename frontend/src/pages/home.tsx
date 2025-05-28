import useUser from "@/context/use-user";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const user = useUser((state) => state.user);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (user && user.role_name === "admin") {
      router.push("/dashboard/admin");
      return;
    }

    if (user && user.role_name === "student") {
      router.push("/dashboard/student");
      return;
    }

    router.push(
      `/error?message=Unauthorized access for role ${user.role_name}.code_r1&previous_path=/home`
    );
  }, [user]);

  return <></>;
}
