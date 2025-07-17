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
import { Box, Card, SimpleGrid, Table } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Page() {
  const user = useUser((state) => state.user);
  const router = useRouter();
  const classroomId = router.query.classroomId as string;

  const { classroom, students, isFetching } =
    useFetchClassroomDetail(classroomId);

  return (
    <Box mx="auto" w="full" maxW="breakpoint-lg">
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
              <DataProperty isLoading={isFetching} label="Opsi" value={""} />
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
