import AdminLayout from "@/components/layout/admin-layout";
import {
  TableBody,
  TableColumnHeader,
  TableContainer,
} from "@/components/ui/table";
import useUser from "@/context/use-user";
import { Card, CardHeader, CardTitle, Table } from "@chakra-ui/react";

export default function Page() {
  const user = useUser((state) => state.user);

  return (
    <>
      <Card.Root mx="auto" w="full" maxW="breakpoint-lg">
        <Card.Body>
          <Card.Title>Application Log and Monitoring</Card.Title>
          <br />
          <TableContainer>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <TableColumnHeader label="Datetime" textAlign="center" />
                  <TableColumnHeader label="IP" />
                  <TableColumnHeader label="User" />
                  <TableColumnHeader label="Type" />
                  <TableColumnHeader label="Description" />
                </Table.Row>
              </Table.Header>
              <TableBody
                // isEmpty={isEmpty}
                // isFetching={isFetching}
                cols={5}
              ></TableBody>
            </Table.Root>
          </TableContainer>
        </Card.Body>
      </Card.Root>
    </>
  );
}

Page.layout = function (page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};
