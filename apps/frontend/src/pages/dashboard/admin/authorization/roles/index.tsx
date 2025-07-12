import AdminLayout from "@/components/layout/admin-layout";
import {
  TableBody,
  TableColumnHeader,
  TableContainer,
  TableRowData,
  tableSequence,
} from "@/components/ui/table";
import useUser from "@/context/use-user";
import { useFetchRoles } from "@/query/use-fetch-authorizations";
import useSmartRouter from "@/query/use-smart-router";
import { Card, Heading, IconButton, Table } from "@chakra-ui/react";
import { CircleArrowRight } from "lucide-react";

export default function Page() {
  const user = useUser((state) => state.user);
  const router = useSmartRouter();
  const page = parseInt(router.page || "1") || 1;

  const { roles, isEmpty, isFetching } = useFetchRoles();

  return (
    <>
      <Card.Root mx="auto" w="full" maxW="breakpoint-md">
        <Card.Body>
          <Card.Title>Role Setting</Card.Title>
          <br />
          <TableContainer>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <TableColumnHeader label="No" textAlign="center" w="60px" />
                  <TableColumnHeader label="Name" name="name" />
                  <TableColumnHeader textAlign="center">Opsi</TableColumnHeader>
                </Table.Row>
              </Table.Header>
              <TableBody isEmpty={isEmpty} isFetching={isFetching} cols={3}>
                <TableRowData
                  data={roles?.data}
                  columns={[
                    {
                      accessor: "id",
                      key: "no",
                      textAlign: "center",
                      children: (_, index) =>
                        tableSequence(index, page, roles?.limit),
                    },
                    {
                      accessor: "readable_name",
                      key: "readable_name",
                    },
                    {
                      accessor: "id",
                      key: "option",
                      textAlign: "center",
                      children: (item) => (
                        <IconButton
                          variant="ghost"
                          size="md"
                          onClick={() =>
                            router.push(
                              `/dashboard/admin/authorization/roles/${item.id}`
                            )
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
        </Card.Body>
      </Card.Root>
    </>
  );
}

Page.layout = function (page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};
