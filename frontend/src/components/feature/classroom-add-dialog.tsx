import { Box, Button, Dialog, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import FormProvider from "../ui/form/form-provider";
import { InputField } from "../ui/form/input-field";
import { SelectField } from "../ui/form/select-field";
import { AsyncSelectField } from "../ui/form/async-select-field";
import { fetchTeacherOptions } from "@/services";
import { OptionsParam } from "@/utils/var-transform";
import useAcademicYear from "@/context/use-academic-year";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ClassroomAddDialog: React.FC<Props> = ({ open, onOpenChange }) => {
  const queryClient = useQueryClient();
  const academicYear = useAcademicYear((state) => state.academicYear);
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
      size="md"
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.CloseTrigger />
          <Dialog.Header>
            <Dialog.Title>Tambah Kelas</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <FormProvider
              defaultValues={{
                level: "",
                name: "",
                guardian_teacher: null as null | OptionsParam,
              }}
              api="/classrooms"
              transform={(data) => ({
                ...data,
                level: parseInt(data.level, 10),
                academic_year_id: academicYear?.id,
                guardian_teacher_id: data.guardian_teacher
                  ? data.guardian_teacher.value
                  : null,
              })}
              successMessage="Kelas berhasil ditambahkan"
              onSuccess={() => {
                queryClient.invalidateQueries({
                  queryKey: queryKeys.classroom.list,
                });
                onOpenChange(false);
              }}
            >
              {({ isLoading, formRegister, control }) => (
                <>
                  <SimpleGrid gap="4" columns={{ base: 1 }}>
                    <SelectField
                      control={control}
                      label="Tingkat Kelas"
                      name="level"
                      options={[
                        { label: "Kelas 1", value: "1" },
                        { label: "Kelas 2", value: "2" },
                        { label: "Kelas 3", value: "3" },
                        { label: "Kelas 4", value: "4" },
                        { label: "Kelas 5", value: "5" },
                        { label: "Kelas 6", value: "6" },
                        { label: "Kelas 7", value: "7" },
                        { label: "Kelas 8", value: "8" },
                        { label: "Kelas 9", value: "9" },
                        { label: "Kelas 10", value: "10" },
                        { label: "Kelas 11", value: "11" },
                        { label: "Kelas 12", value: "12" },
                      ]}
                      required
                      minW="150px"
                    />
                    <InputField
                      control={control}
                      name="name"
                      placeholder="Nama Kelas"
                      label="Nama Kelas"
                      rules={{ required: "Harus diisi" }}
                      w="full"
                    />
                    <AsyncSelectField
                      control={control}
                      name="guardian_teacher"
                      label="Wali Kelas"
                      placeholder="Pilih Wali Kelas"
                      loadOptions={fetchTeacherOptions}
                    />
                  </SimpleGrid>
                  <br />
                  <Box textAlign="center">
                    <Button type="submit" loading={isLoading}>
                      Simpan
                    </Button>
                  </Box>
                </>
              )}
            </FormProvider>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default ClassroomAddDialog;
