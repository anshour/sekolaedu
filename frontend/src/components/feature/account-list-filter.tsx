import { Box, Button, Input } from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";

interface Props {
  onFilter: (data: Record<string, any>) => void;
}

const AccountListFilter = ({ onFilter }: Props) => {
  const form = useForm({
    defaultValues: {
      search: "",
      role_id: "",
      is_active: "",
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
          placeholder="Search by name or email..."
        />
        <Button size="sm" type="submit">
          Filter
        </Button>
      </Box>
    </Box>
  );
};

export default AccountListFilter;
