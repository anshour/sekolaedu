import AdminLayout from "@/components/layout/admin-layout";
import {
  TableBody,
  TableColumnHeader,
  TableContainer,
  TableRowData,
  tableSequence,
} from "@/components/ui/table";
import useUser from "@/context/use-user";
import { useFetchPermissions } from "@/hooks/use-fetch-authorizations";
import useSmartRouter from "@/hooks/use-smart-router";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  IconButton,
  Table,
} from "@chakra-ui/react";
import { CircleArrowRight, Trash } from "lucide-react";

export default function Page() {
  const user = useUser((state) => state.user);
  const router = useSmartRouter();
  const page = parseInt(router.page || "1") || 1;

  const { permissions, isEmpty, isFetching } = useFetchPermissions();

  return (
    <>
      <Card.Root mx="auto" w="full" maxW="breakpoint-md">
        <Card.Body>
          <Flex justifyContent="space-between" alignItems="center">
            <Card.Title>Permission Setting</Card.Title>
            <Box textAlign="right">
              <Button size="sm">+ Add</Button>
            </Box>
          </Flex>
          <br />
          <TableContainer>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <TableColumnHeader label="No" textAlign="center" w="60px" />
                  <TableColumnHeader label="Name" name="name" />
                  <TableColumnHeader label="Description" name="name" />
                  <TableColumnHeader textAlign="center">Opsi</TableColumnHeader>
                </Table.Row>
              </Table.Header>
              <TableBody isEmpty={isEmpty} isFetching={isFetching} cols={4}>
                <TableRowData
                  data={permissions?.data}
                  columns={[
                    {
                      accessor: "id",
                      key: "no",
                      textAlign: "center",
                      children: (_, index) =>
                        tableSequence(index, page, permissions?.limit),
                    },
                    {
                      accessor: "name",
                      key: "name",
                    },
                    {
                      accessor: "description",
                      key: "description",
                    },
                    {
                      accessor: "id",
                      key: "option",
                      textAlign: "center",
                      children: () => (
                        <IconButton
                          variant="ghost"
                          colorPalette="red"
                          size="md"
                        >
                          <Trash />
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
