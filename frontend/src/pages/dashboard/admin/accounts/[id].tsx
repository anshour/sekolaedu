import AdminLayout from "@/components/layout/admin-layout";
// import useUser from "@/context/use-user";
import { Card } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  console.log("Router query:", router.query);
  //   const user = useUser((state) => state.user);

  return (
    <>
      <Card.Root>
        <Card.Body>
          <br />
          Hello from detail accounts
          <br />
        </Card.Body>
      </Card.Root>
    </>
  );
}

Page.layout = function (page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};
