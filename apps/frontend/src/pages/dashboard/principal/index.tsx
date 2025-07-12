import PrincipalLayout from "@/components/layout/principal-layout";
import StudentLayout from "@/components/layout/student-layout";
import useUser from "@/context/use-user";
import { Card } from "@chakra-ui/react";

export default function Page() {
  const user = useUser((state) => state.user);

  return (
    <>
      <Card.Root>
        <Card.Body>Hello {user?.name}!</Card.Body>
      </Card.Root>
    </>
  );
}

Page.layout = function (page: any) {
  return <PrincipalLayout>{page}</PrincipalLayout>;
};
