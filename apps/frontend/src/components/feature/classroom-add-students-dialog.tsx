import {
  Box,
  Button,
  Dialog,
  IconButton,
  SimpleGrid,
  Table,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import {
  TableBody,
  TableColumnHeader,
  TableContainer,
  TableRowData,
} from "../ui/table";
import StudentListFilter from "./student-list-filter";
import { useFetchStudents } from "@/query/use-fetch-students";
import { useState } from "react";
import { Plus } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ClassroomAddDialog: React.FC<Props> = ({ open, onOpenChange }) => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<Record<string, any>>({});

  const { students, isEmpty, isFetching } = useFetchStudents({
    filter,
  });

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
                        key: "option",
                        textAlign: "center",
                        children: () => (
                          <IconButton
                            variant="ghost"
                            // colorPalette=""
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
