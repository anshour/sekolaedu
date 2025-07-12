import ClassroomAddDialog from "@/components/feature/classroom-add-dialog";
import AdminLayout from "@/components/layout/admin-layout";
import {
  TableBody,
  TableColumnHeader,
  TableContainer,
  TableRowData,
} from "@/components/ui/table";
import { useFetchClassrooms } from "@/query/use-fetch-classrooms";
import useSmartRouter from "@/query/use-smart-router";
import {
  Box,
  Button,
  Card,
  Flex,
  IconButton,
  Table,
  Text,
} from "@chakra-ui/react";
import { CircleArrowRight } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const router = useSmartRouter();
  const [open, setOpen] = useState(false);

  const { classrooms, isEmpty, isFetching } = useFetchClassrooms();

  return (
    <>
      <ClassroomAddDialog onOpenChange={setOpen} open={open} />
      <Card.Root mx="auto" w="full" maxW="breakpoint-md">
        <Card.Body>
          <Flex justifyContent="space-between" alignItems="center">
            <Card.Title>Classroom List</Card.Title>
            <Box textAlign="right">
              <Button size="sm" onClick={() => setOpen(true)}>
                + Add
              </Button>
            </Box>
          </Flex>
          <br />
          <TableContainer>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <TableColumnHeader label="No" textAlign="center" w="60px" />
                  <TableColumnHeader label="Tingkat" />
                  <TableColumnHeader label="Nama Kelas" />
                  <TableColumnHeader label="Wali Kelas" />
                  <TableColumnHeader label="Jumlah Siswa" />
                  <TableColumnHeader />
                </Table.Row>
              </Table.Header>
              <TableBody isEmpty={isEmpty} isFetching={isFetching} cols={6}>
                <TableRowData
                  data={classrooms}
                  columns={[
                    {
                      accessor: "id",
                      key: "no",
                      textAlign: "center",
                      children: (_, index) => index + 1,
                    },
                    {
                      accessor: "level",
                      key: "level",
                    },
                    {
                      accessor: "name",
                      key: "name",
                    },
                    {
                      accessor: "guardian_teacher_name",
                      key: "guardian_teacher_name",
                    },
                    {
                      accessor: "count_students",
                      key: "count_students",
                      children: (item) => (
                        <Text>{item.count_students || 0} Siswa</Text>
                      ),
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
                              `/dashboard/admin/classrooms/${item.id}`
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
