import AdminLayout from "@/components/layout/admin-layout";
import BorderedBox from "@/components/ui/bordered-box";
import DataProperty from "@/components/ui/data-property";
import {
  TableBody,
  TableColumnHeader,
  TableContainer,
  TableRowData,
  tableSequence,
} from "@/components/ui/table";
import { useFetchRoleById } from "@/hooks/use-fetch-authorizations";
import useSmartRouter from "@/hooks/use-smart-router";
import {
  Box,
  Button,
  Card,
  Heading,
  IconButton,
  SimpleGrid,
  Table,
} from "@chakra-ui/react";
import { Trash } from "lucide-react";

export default function Page() {
  const router = useSmartRouter();
  const roleId = router.query.id as string;
  const { role, isFetching, isEmpty } = useFetchRoleById(roleId);

  return (
    <>
      <Card.Root mx="auto" w="full" maxW="breakpoint-md">
        <Card.Body>
          <Card.Title>Role Setting</Card.Title>
          <br />
          <BorderedBox mb="3">
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap="2">
              <DataProperty
                isLoading={isFetching}
                label="ID Role"
                value={role?.id}
              />
              <DataProperty
                isLoading={isFetching}
                label="Nama Role"
                value={role?.readable_name}
              />
            </SimpleGrid>
          </BorderedBox>
          <TableContainer>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <TableColumnHeader label="No" textAlign="center" w="60px" />
                  <TableColumnHeader label="Permission" />
                  <TableColumnHeader label="Deskripsi" />
                  <TableColumnHeader textAlign="center">
                    Hapus
                  </TableColumnHeader>
                </Table.Row>
              </Table.Header>
              <TableBody isEmpty={isEmpty} isFetching={isFetching} cols={4}>
                <TableRowData
                  data={role?.permissions}
                  columns={[
                    {
                      accessor: "id",
                      key: "no",
                      textAlign: "center",
                      children: (_, index) => tableSequence(index, 1, 1000),
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
                <Table.Row>
                  <Table.Cell colSpan={4}>
                    <Box textAlign="center">
                      <Button size="sm" variant="subtle">
                        + Tambah
                      </Button>
                    </Box>
                  </Table.Cell>
                </Table.Row>
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
