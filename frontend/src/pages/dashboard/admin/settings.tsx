import AdminLayout from "@/components/layout/admin-layout";
import UserLayout from "@/components/layout/user-layout";
import useUser from "@/context/use-user";
import { Card } from "@chakra-ui/react";

export default function Page() {
  const user = useUser((state) => state.user);

  return (
    <>
      <Card.Root>
        <Card.Body>Settings Page</Card.Body>
      </Card.Root>
      <Card.Root>
        <Card.Body>
          <br />
          a
          <br />
        </Card.Body>
      </Card.Root>
      <Card.Root>
        <Card.Body>
          <br />
          a
          <br />
        </Card.Body>
      </Card.Root>
      <Card.Root>
        <Card.Body>
          <br />
          a
          <br />
        </Card.Body>
      </Card.Root>
      <Card.Root>
        <Card.Body>
          <br />
          a
          <br />
        </Card.Body>
      </Card.Root>
      <Card.Root>
        <Card.Body>
          <br />
          a
          <br />
        </Card.Body>
      </Card.Root>
      <Card.Root>
        <Card.Body>
          <br />
          a
          <br />
        </Card.Body>
      </Card.Root>
      <Card.Root>
        <Card.Body>
          <br />
          a
          <br />
        </Card.Body>
      </Card.Root>
      <Card.Root>
        <Card.Body>
          <br />
          a
          <br />
        </Card.Body>
      </Card.Root>
      <Card.Root>
        <Card.Body>
          <br />
          a
          <br />
        </Card.Body>
      </Card.Root>
      <Card.Root>
        <Card.Body>
          <br />
          a
          <br />
        </Card.Body>
      </Card.Root>
      <Card.Root>
        <Card.Body>
          <br />
          a
          <br />
        </Card.Body>
      </Card.Root>
    </>
  );
}

Page.layout = function (page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};
