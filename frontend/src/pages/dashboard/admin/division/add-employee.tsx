import { AsyncSelectField } from "@/components/ui/form/async-select-field";
import FormProvider, {
  FormProviderProps,
} from "@/components/ui/form/form-provider";
import http from "@/utils/http";
import { Box, Text } from "@chakra-ui/react";
import React from "react";

const Page = () => {
  const formProps: FormProviderProps = {
    defaultValues: {
      employee: null,
    },
    api: "/division",
    successMessage: "Add employee success",
    onSuccess: () => {},
  };
  return (
    <div>
      <Text>Add Employee to Division</Text>
      <FormProvider {...formProps}>
        {({ isLoading, control }) => (
          <Box w="full">
            <AsyncSelectField
              control={control}
              label="Nama Karyawan"
              name="employee"
              optionLabel="user_name"
              loadOptions={(val) =>
                http.get(`/employees?filter.name=${val}`).then((res) => res.data?.data)
              }
            />
          </Box>
        )}
      </FormProvider>
    </div>
  );
};

export default Page;
