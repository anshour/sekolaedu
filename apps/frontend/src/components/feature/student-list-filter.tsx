import { Box, Button, Input } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import React from "react";

interface Props {
  onFilter: (data: Record<string, any>) => void;
}

const StudentListFilter = ({ onFilter }: Props) => {
  const form = useForm({
    defaultValues: {
      search: "",
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    onFilter(data);
  });
  return (
    <Box borderColor="gray.200" borderWidth="1px" p="3" mb="3" rounded="md">
      <Box
        as="form"
        onSubmit={handleSubmit}
        display="flex"
        gap="2"
        alignItems="center"
      >
        <Input
          {...form.register("search")}
          placeholder="Cari berdasarkan nama atau nomor induk siswa..."
        />
        <Button size="sm" type="submit">
          Filter
        </Button>
      </Box>
    </Box>
  );
};

export default StudentListFilter;
