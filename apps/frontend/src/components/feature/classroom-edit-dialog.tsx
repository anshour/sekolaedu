import { Box, Button, Dialog, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import FormProvider from "../ui/form/form-provider";
import { InputField } from "../ui/form/input-field";
import { SelectField } from "../ui/form/select-field";
import { AsyncSelectField } from "../ui/form/async-select-field";
import { fetchTeacherOptions } from "@/services";
import { OptionsParam } from "@/utils/var-transform";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { classroomLevelOptions } from "@/constants/classroom-level-options";

interface Props {
  classroom: null | Record<string, any>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ClassroomEditDialog: React.FC<Props> = ({
  classroom,
  open,
  onOpenChange,
}: Props) => {
  const queryClient = useQueryClient();

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
            <Dialog.Title>Ubah Kelas</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <FormProvider
              defaultValues={{
                level: classroom?.level || "",
                name: classroom?.name || "",
                guardian_teacher: {
                  label: classroom?.guardian_teacher_name || "",
                  value: classroom?.guardian_teacher_id || null,
                } as null | OptionsParam,
              }}
              api={`/classrooms/${classroom?.id}`}
              method="put"
              transform={(data) => ({
                ...data,
                level: parseInt(data.level, 10),
                academic_year_id: classroom?.academic_year_id,
                guardian_teacher_id: data.guardian_teacher
                  ? data.guardian_teacher.value
                  : null,
              })}
              successMessage="Kelas berhasil diperbarui"
              onSuccess={() => {
                queryClient.invalidateQueries({
                  queryKey: queryKeys.classroom.detail(classroom!.id),
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
                      options={classroomLevelOptions}
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

export default ClassroomEditDialog;
