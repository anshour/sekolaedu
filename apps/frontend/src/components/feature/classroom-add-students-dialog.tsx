import {
  Box,
  Button,
  Dialog,
  Flex,
  HStack,
  IconButton,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  TableBody,
  TableColumnHeader,
  TableContainer,
  TableRowData,
} from "../ui/table";
import StudentListFilter from "./student-list-filter";
import { useFetchStudents } from "@/query/use-fetch-students";
import { useState } from "react";
import { Check, CircleCheck, CircleMinus, CircleX, Plus } from "lucide-react";
import http from "@/utils/http";
import { queryKeys } from "@/constants/query-keys";

interface Props {
  classroomId: number;
  classroomStudents: any[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ClassroomAddDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  classroomId,
  classroomStudents,
}) => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<Record<string, any>>({});
  const [selectedStudent, setSelectedStudent] = useState<Record<string, any>>(
    {},
  );

  const { students, isEmpty, isFetching } = useFetchStudents({
    filter,
  });

  const mutation = useMutation({
    mutationFn: (studentId: number) =>
      http.post(`/classrooms/${classroomId}/students`, {
        student_id: studentId,
      }),
    onSuccess: () => {},
  });

  const isAdding = (studentId: number) => {
    return mutation.isPending && selectedStudent.id === studentId;
  };

  const isAlreadyAdded = (studentId: number) => {
    return classroomStudents.some((student) => student.id === studentId);
  };

  const handleClickAdd = (student: any) => {
    setSelectedStudent(student);
    mutation.mutate(student.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.classroom.detail(classroomId),
        });
      },
    });
  };

  const handleFilter = (data: Record<string, any>) => {
    setFilter(data);
  };
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
      size="lg"
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.CloseTrigger />
          <Dialog.Header>
            <Dialog.Title>Tambah Siswa</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <StudentListFilter onFilter={handleFilter} />
            <TableContainer>
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <TableColumnHeader label="No" textAlign="center" w="60px" />
                    <TableColumnHeader label="Nama Siswa" />
                    <TableColumnHeader label="No. Induk Siswa" />
                    <TableColumnHeader
                      textAlign="center"
                      label="Anggota Kelas"
                    />
                    <TableColumnHeader textAlign="center" label="Opsi" />
                  </Table.Row>
                </Table.Header>
                <TableBody isEmpty={isEmpty} isFetching={isFetching} cols={6}>
                  <TableRowData
                    data={students.data}
                    columns={[
                      {
                        accessor: "id",
                        key: "no",
                        textAlign: "center",
                        children: (_, index) => index + 1,
                      },
                      {
                        accessor: "user_name",
                        key: "user_name",
                      },
                      {
                        accessor: "identification_number",
                        key: "identification_number",
                      },
                      {
                        accessor: "id",
                        key: "id",
                        children: (student) => (
                          <Flex justifyContent="center">
                            {isAlreadyAdded(student.id) ? (
                              <>
                                <Text mr="2">Ya</Text>
                                <CircleCheck size={20} color="green" />
                              </>
                            ) : (
                              <>
                                <Text mr="2">Tidak</Text>
                                <CircleX size={20} color="gray" />
                              </>
                            )}
                          </Flex>
                        ),
                      },
                      {
                        accessor: "id",
                        key: "option",
                        textAlign: "center",
                        children: (student) => (
                          <IconButton
                            variant="ghost"
                            loading={isAdding(student.id)}
                            disabled={isAlreadyAdded(student.id)}
                            onClick={() => handleClickAdd(student)}
                            size="md"
                          >
                            <Plus />
                          </IconButton>
                        ),
                      },
                    ]}
                  />
                </TableBody>
              </Table.Root>
            </TableContainer>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default ClassroomAddDialog;
