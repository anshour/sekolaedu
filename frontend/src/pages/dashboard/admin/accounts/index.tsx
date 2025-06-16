import AccountListFilter from "@/components/feature/account-list-filter";
import AdminLayout from "@/components/layout/admin-layout";
import { StandardPagination } from "@/components/ui/pagination";
import {
  TableBody,
  TableColumnHeader,
  TableContainer,
  TableRowData,
  tableSequence,
} from "@/components/ui/table";
import { useFetchUser } from "@/hooks/use-fetch-users";
import useSmartRouter from "@/hooks/use-smart-router";
import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  IconButton,
  Table,
} from "@chakra-ui/react";
import { CircleArrowRight } from "lucide-react";
import Link from "next/link";
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
    is_active: null,
  });

  const { users, isFetching, isEmpty } = useFetchUser({
    page,
    sort: sortState,
    filter: {
      search: (router.query.search as string) || "",
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

  const handleFilter = (data: Record<string, any>) => {
    router.updateQuery(data);
  };
  return (
    <>
      <Card.Root mx="auto" w="full" maxW="breakpoint-lg">
        <Card.Body>
          <Flex justifyContent="space-between" alignItems="center" mb="4">
            <Card.Title>Account List</Card.Title>
            <Box textAlign="right">
              <Link href="/dashboard/admin/accounts/create">
                <Button size="sm">+ Add</Button>
              </Link>
            </Box>
          </Flex>

          <AccountListFilter onFilter={handleFilter} />
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
                  <TableColumnHeader
                    label="Active"
                    enableSort
                    sortState={sortState["is_active"]}
                    name="is_active"
                    onSort={handleSort}
                  />
                  <TableColumnHeader textAlign="center">
                    Detail
                  </TableColumnHeader>
                </Table.Row>
              </Table.Header>
              <TableBody isEmpty={isEmpty} isFetching={isFetching} cols={6}>
                <TableRowData
                  data={users?.data}
                  columns={[
                    {
                      accessor: "id",
                      key: "no",
                      textAlign: "center",
                      children: (_, index) =>
                        tableSequence(index, page, users?.limit),
                    },
                    {
                      accessor: "name",
                      key: "name",
                    },
                    {
                      accessor: "email",
                      key: "email",
                    },
                    {
                      accessor: "role_name",
                      key: "role_name",
                    },
                    {
                      accessor: "is_active",
                      key: "is_active",
                      children: (item) => (
                        <Badge colorPalette={item.is_active ? "green" : "red"}>
                          {item.is_active ? "Active" : "Inactive"}
                        </Badge>
                      ),
                    },
                    {
                      accessor: "id",
                      key: "action",
                      textAlign: "center",
                      children: (item) => (
                        <IconButton
                          variant="ghost"
                          size="md"
                          onClick={() =>
                            router.push(`/dashboard/admin/accounts/${item.id}`)
                          }
                        >
                          <CircleArrowRight />
                        </IconButton>
                      ),
                    },
                  ]}
                />
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
