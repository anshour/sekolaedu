import ClassroomAddDialog from "@/components/feature/classroom-add-dialog";
import ClassroomAddStudentsDialog from "@/components/feature/classroom-add-students-dialog";
import ClassroomEditDialog from "@/components/feature/classroom-edit-dialog";
import AdminLayout from "@/components/layout/admin-layout";
import BorderedBox from "@/components/ui/bordered-box";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import DataProperty from "@/components/ui/data-property";
import {
  TableBody,
  TableColumnHeader,
  TableContainer,
  TableRowData,
} from "@/components/ui/table";
import useUser from "@/context/use-user";
import { useFetchClassroomDetail } from "@/query/use-fetch-classrooms";
import {
  Box,
  Button,
  Card,
  SimpleGrid,
  Table,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Page() {
  const user = useUser((state) => state.user);
  const router = useRouter();
  const classroomId = router.query.classroomId as string;
  const editDisclosure = useDisclosure();
  const addStudentDisclosure = useDisclosure();

  const { classroom, students, isFetching } =
    useFetchClassroomDetail(classroomId);

  return (
    <Box mx="auto" w="full" maxW="breakpoint-lg">
      <ClassroomEditDialog
        classroom={classroom}
        open={editDisclosure.open}
        onOpenChange={editDisclosure.setOpen}
      />
      <ClassroomAddStudentsDialog
        open={addStudentDisclosure.open}
        onOpenChange={addStudentDisclosure.setOpen}
      />
      <Box mb="3">
        <Breadcrumb
          items={[
            { title: "Dashboard", url: "/" },
            { title: "Classrooms", url: "/dashboard/admin/classrooms" },
            {
              title: classroom?.name || "Detail Kelas",
              url: `/dashboard/admin/classrooms/${classroomId}`,
            },
          ]}
        />
      </Box>
      <Card.Root>
        <Card.Body>
          <BorderedBox mb="2">
            <SimpleGrid w="full" columns={{ base: 1, sm: 2, md: 4 }} gap="3">
              <DataProperty
                isLoading={isFetching}
                label="Nama Kelas"
                value={classroom?.name}
              />
              <DataProperty
                isLoading={isFetching}
                label="Tingkat"
                value={classroom?.level}
              />
              <DataProperty
                isLoading={isFetching}
                label="Wali Kelas"
                value={classroom?.guardian_teacher_name}
              />
              <DataProperty
                isLoading={isFetching}
                label="Opsi"
                element={
                  <>
                    <Button
                      m="1"
                      size="2xs"
                      variant="outline"
                      onClick={editDisclosure.onOpen}
                    >
                      Ubah
                    </Button>
                    <Button
                      m="1"
                      colorPalette="red"
                      size="2xs"
                      variant="outline"
                    >
                      Hapus
                    </Button>
                  </>
                }
              />
            </SimpleGrid>
          </BorderedBox>
          <TableContainer>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <TableColumnHeader label="No" textAlign="center" w="60px" />
                  <TableColumnHeader label="Nama Siswa" />
                  <TableColumnHeader label="No. Induk Siswa" />
                  <TableColumnHeader />
                </Table.Row>
              </Table.Header>
              <TableBody isEmpty={false} isFetching={isFetching} cols={6}>
                <TableRowData
                  data={students}
                  columns={[
                    {
                      accessor: "id",
                      key: "no",
                      textAlign: "center",
                      children: (_, index) => index + 1,
                    },
                    {
                      accessor: "student_name",
                      key: "student_name",
                    },
                    {
                      accessor: "identification_number",
                      key: "identification_number",
                    },
                  ]}
                />
                <Table.Row>
                  <Table.Cell colSpan={4}>
                    <Box textAlign="center">
                      <Button
                        size="sm"
                        variant="subtle"
                        onClick={addStudentDisclosure.onOpen}
                      >
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
    </Box>
  );
}

Page.layout = function (page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};
