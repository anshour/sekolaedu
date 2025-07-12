import TeacherLayout from "@/components/layout/teacher-layout";
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
  return <TeacherLayout>{page}</TeacherLayout>;
};
