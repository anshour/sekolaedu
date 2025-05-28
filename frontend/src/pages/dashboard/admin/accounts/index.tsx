import AdminLayout from "@/components/layout/admin-layout";
import { StandardPagination } from "@/components/ui/pagination";
import {
  TableBody,
  TableColumnHeader,
  TableContainer,
} from "@/components/ui/table";
import { useFetchUser } from "@/hooks/use-fetch-users";
import useSmartRouter from "@/hooks/use-smart-router";
import { Button, Card, Heading, Table } from "@chakra-ui/react";
import { useState } from "react";

export default function Page() {
  const router = useSmartRouter();
  const page = parseInt(router.page || "1") || 1;

  const [sortState, setSortState] = useState<
    Record<string, "asc" | "desc" | null>
  >({
    name: null,
    email: null,
    role_name: null,
  });

  const { users, isFetching, isEmpty } = useFetchUser({
    page,
    sort: {
      name: sortState.name,
      email: sortState.email,
      role_name: sortState.role_name,
    },
  });

  const handleSort = (column: string, direction: "asc" | "desc" | null) => {
    setSortState((prev) => ({
      ...prev,
      [column]: direction,
    }));
    // Implement sorting logic here
    console.log(`Sorting by ${column} in ${direction} order`);
  };

  return (
    <>
      <Card.Root>
        <Card.Body>
          <Heading>Account List</Heading>
          <br />
          <TableContainer>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <TableColumnHeader label="No" textAlign="center" w="60px" />
                  <TableColumnHeader
                    label="Nama"
                    enableSort
                    sortState={sortState["name"]}
                    name="name"
                    onSort={handleSort}
                  />
                  <TableColumnHeader
                    label="Email"
                    enableSort
                    sortState={sortState["email"]}
                    name="email"
                    onSort={handleSort}
                  />
                  <TableColumnHeader
                    label="Role"
                    enableSort
                    sortState={sortState["role_name"]}
                    name="role_name"
                    onSort={handleSort}
                  />

                  <TableColumnHeader textAlign="center">
                    Detail
                  </TableColumnHeader>
                </Table.Row>
              </Table.Header>
              <TableBody isEmpty={isEmpty} isFetching={isFetching} cols={5}>
                {users?.data?.map((user, index) => (
                  <Table.Row key={user.id}>
                    <Table.Cell textAlign="center">{index + 1}</Table.Cell>
                    <Table.Cell>{user.name}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>{user.role_name}</Table.Cell>
                    <Table.Cell textAlign="center">
                      <Button variant="outline">View</Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </TableBody>
            </Table.Root>
          </TableContainer>
          <StandardPagination mt="3" {...users} />
        </Card.Body>
      </Card.Root>
    </>
  );
}

Page.layout = function (page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};
