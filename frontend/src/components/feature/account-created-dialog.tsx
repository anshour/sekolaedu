import { Box, Button, Dialog, Table, Text } from "@chakra-ui/react";
import React from "react";
import { TableContainer } from "../ui/table";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  users: {
    id: number;
    name: string;
    email: string;
    is_success: string;
    message: string;
  }[];
}

const AccountCreatedDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  users,
}) => {
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
            <Dialog.Title>Account Details</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Box p="3" rounded="md" bgColor="blue.100">
              Email will be sent to the users with their account details along
              with the password and login link.
            </Box>
            <br />
            <TableContainer>
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader>Name</Table.ColumnHeader>
                    <Table.ColumnHeader>Email</Table.ColumnHeader>
                    <Table.ColumnHeader>Status</Table.ColumnHeader>
                    <Table.ColumnHeader>Message</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {users.map((user) => (
                    <Table.Row key={user.id}>
                      <Table.Cell>{user.name}</Table.Cell>
                      <Table.Cell>{user.email}</Table.Cell>
                      <Table.Cell>
                        {user.is_success ? (
                          <Text fontWeight="medium" color="green.600">
                            Success
                          </Text>
                        ) : (
                          <Text fontWeight="medium" color="red.600">
                            Failed
                          </Text>
                        )}
                      </Table.Cell>
                      <Table.Cell whiteSpace="normal">
                        {user.message}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </TableContainer>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default AccountCreatedDialog;
