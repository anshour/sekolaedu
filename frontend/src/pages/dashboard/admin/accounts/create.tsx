import AccountCreatedDialog from "@/components/feature/account-created-dialog";
import AdminLayout from "@/components/layout/admin-layout";
import FormProvider from "@/components/ui/form/form-provider";
import { SelectField } from "@/components/ui/form/select-field";
import { TableContainer } from "@/components/ui/table";
import { useFetchRoles } from "@/hooks/use-fetch-authorizations";
import { handlePasteNewLine } from "@/utils/handle-paste-newline";
import {
  Box,
  Button,
  Card,
  Heading,
  IconButton,
  Input,
  Table,
} from "@chakra-ui/react";
import { SaveIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const router = useRouter();
  const { roles } = useFetchRoles();
  const [open, setOpen] = useState(false);
  const [createdUsers, setCreatedUsers] = useState<any[]>([]);

  const roleOptions = roles?.data.map((role) => ({
    label: role.name,
    value: role.id,
  }));

  const handleSuccess = (res: any) => {
    toast.success(res.data.message);
    setCreatedUsers(res.data.users);
    setOpen(true);
  };

  return (
    <Card.Root mx="auto" w="full" maxW="breakpoint-lg">
      <AccountCreatedDialog open={open} onOpenChange={setOpen} users={createdUsers} />
      <Card.Body>
        <Heading>Create New Account</Heading>
        <br />
        <FormProvider
          defaultValues={{
            users: [
              {
                name: "",
                email: "",
                role_id: "",
              },
            ],
          }}
          api="/users/bulk"
          onSuccess={handleSuccess}
        >
          {({ formRegister, form, fieldArrays, isLoading }) => {
            const { fields, append, remove } = fieldArrays?.users || {};

            const addEmptyItem = () =>
              append!({ name: "", email: "", role_id: "" });

            return (
              <TableContainer>
                <Table.Root>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader textAlign="center">
                        Name
                      </Table.ColumnHeader>
                      <Table.ColumnHeader textAlign="center">
                        Email
                      </Table.ColumnHeader>
                      <Table.ColumnHeader textAlign="center">
                        Role
                      </Table.ColumnHeader>
                      <Table.ColumnHeader />
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {fields?.map((item, index) => (
                      <Table.Row key={item.id}>
                        <Table.Cell>
                          <Input
                            onPaste={(e) =>
                              handlePasteNewLine({
                                event: e,
                                index,
                                fieldName: "name",
                                arrayName: "users",
                                fields: fields!,
                                setValue: form.setValue,
                                addEmptyItem,
                              })
                            }
                            placeholder="Name"
                            {...formRegister(`users.${index}.name`, {
                              required: "Name is required",
                            })}
                          />
                        </Table.Cell>
                        <Table.Cell>
                          <Input
                            onPaste={(e) =>
                              handlePasteNewLine({
                                event: e,
                                index,
                                fieldName: "email",
                                arrayName: "users",
                                fields: fields!,
                                setValue: form.setValue,
                                addEmptyItem,
                              })
                            }
                            placeholder="Email"
                            {...formRegister(`users.${index}.email`, {
                              required: "Email is required",
                            })}
                          />
                        </Table.Cell>
                        <Table.Cell>
                          <SelectField
                            control={form.control}
                            name={`users.${index}.role_id`}
                            options={roleOptions}
                            required
                            minW="150px"
                          />
                        </Table.Cell>
                        <Table.Cell>
                          <IconButton
                            size="sm"
                            variant="plain"
                            colorPalette="red"
                            onClick={() => remove?.(index)}
                          >
                            <TrashIcon />
                          </IconButton>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                    <Table.Row>
                      <Table.Cell colSpan={4}>
                        <Box textAlign="center">
                          <Button
                            size="sm"
                            variant="plain"
                            onClick={addEmptyItem}
                          >
                            + Tambah
                          </Button>
                        </Box>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table.Root>

                <Box textAlign="right" mt="1">
                  <Button
                    mt={4}
                    colorScheme="blue"
                    type="submit"
                    loading={isLoading}
                  >
                    Simpan
                  </Button>
                </Box>
              </TableContainer>
            );
          }}
        </FormProvider>
      </Card.Body>
    </Card.Root>
  );
}

Page.layout = function (page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};
