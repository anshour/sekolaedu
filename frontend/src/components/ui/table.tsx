import {
  Box,
  BoxProps,
  HStack,
  Table,
  TableBodyProps,
  Progress,
  TableColumnHeaderProps,
  VStack,
  Text,
  Skeleton,
  TableRowProps,
} from "@chakra-ui/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/router";
import { useMemo } from "react";

export const tableSequence = (index: number, page: number, limit: number) =>
  index + 1 + (page - 1) * limit;

export const TableContainer = (props: BoxProps) => {
  return (
    <Box
      overflowX="auto"
      maxW="full"
      overflowY="auto"
      whiteSpace="nowrap"
      {...props}
    />
  );
};

interface TableHeaderProps extends TableColumnHeaderProps {
  enableSort?: boolean;
  onSort?: (column: string, direction: "asc" | "desc" | null) => void;
  label?: string;
  name?: string;
  sortState?: "asc" | "desc" | null;
}

export const TableHeader = () => {
  return <></>;
};

export const TableColumnHeader = ({
  enableSort = false,
  onSort,
  label,
  name = "",
  children,
  sortState = null,
  ...props
}: TableHeaderProps) => {
  const getNextSortState = () => {
    if (sortState === "asc") return "desc";
    if (sortState === "desc") return null;
    return "asc";
  };
  return (
    <Table.ColumnHeader
      cursor={enableSort ? "pointer" : "default"}
      onClick={() => enableSort && onSort!(name!, getNextSortState())}
      {...props}
    >
      {children}

      {enableSort && (
        <HStack justifyContent="left">
          <span>{label}</span>
          <VStack
            gap={0}
            cursor="pointer"
            onClick={() => onSort!(name!, getNextSortState())}
          >
            <Box
              as={ChevronUp}
              // @ts-expect-error size is not a valid prop for Box
              size={12}
              strokeWidth={3}
              color={sortState === "asc" ? "gray.800" : "gray.400"}
              marginBottom={-0.5}
            />
            <Box
              as={ChevronDown}
              // @ts-expect-error size is not a valid prop for Box
              size={12}
              strokeWidth={3}
              color={sortState === "desc" ? "gray.800" : "gray.400"}
              marginTop={-0.5}
            />
          </VStack>
          {/* </IconButton> */}
        </HStack>
      )}

      {!enableSort && <span>{label}</span>}
    </Table.ColumnHeader>
  );
};

interface CustomTableBodyProps extends TableBodyProps {
  isFetching?: boolean;
  isEmpty?: boolean;
  cols: number;
}

export const TableBody = ({
  isFetching = false,
  isEmpty = false,
  children,
  ...props
}: CustomTableBodyProps) => {
  return (
    <Table.Body {...props}>
      <TableRowProgress isFetching={isFetching} cols={props.cols} />
      <TableRowEmpty isEmpty={isEmpty} cols={props.cols} />
      <TableRowSkeleton
        isEmpty={isEmpty}
        isFetching={isFetching}
        cols={props.cols}
      />
      {children}
    </Table.Body>
  );
};

interface TableRowDataProps extends Omit<TableRowProps, "columns"> {
  data: Record<string, any>[];
  detailPath?: string;
  columns: Array<{
    accessor: string;
    key?: string;
    children?: (item: any, index: number) => React.ReactNode;
    textAlign?: "left" | "center" | "right";
  }>;
}
export const TableRowData = ({
  data,
  detailPath,
  columns,
}: TableRowDataProps) => {
  const isClickable = !!detailPath;
  const router = useRouter();

  return (
    <>
      {data?.map((item, index) => (
        <Table.Row
          key={item.key || item.id || index}
          _hover={{
            cursor: isClickable ? "pointer" : "default",
            bgColor: isClickable ? "gray.100" : "none",
          }}
          onClick={() =>
            isClickable && detailPath
              ? router.push(detailPath.replace(":key", item.id || item.key))
              : null
          }
        >
          {columns.map((col) => (
            <Table.Cell
              key={col.key || col.accessor}
              textAlign={col.textAlign || "left"}
            >
              {!!col.children ? (
                col.children(item, index) // Custom rendering for the cell
              ) : (
                <span>{item[col.accessor]}</span>
              )}
            </Table.Cell>
          ))}
        </Table.Row>
      ))}
    </>
  );
};

const TableRowProgress = ({
  isFetching,
  cols = 1,
}: {
  isFetching: boolean;
  cols: number;
}) => {
  return (
    <Table.Row p="0">
      <Table.Cell colSpan={cols} p="0">
        {isFetching ? (
          <Progress.Root size="xs" w="full" value={null}>
            <Progress.Track bgColor="gray.300">
              <Progress.Range />
            </Progress.Track>
          </Progress.Root>
        ) : (
          <Box minH="6px" bgColor="gray.300" />
        )}
      </Table.Cell>
    </Table.Row>
  );
};

const TableRowEmpty = ({
  cols = 1,
  isEmpty,
}: {
  cols: number;
  isEmpty: boolean;
}) => {
  if (!isEmpty) return null;
  return (
    <Table.Row p="0">
      <Table.Cell colSpan={cols}>
        <Text textAlign="center" py={5} color="gray.500">
          Tidak ada data
        </Text>
      </Table.Cell>
    </Table.Row>
  );
};

const TableRowSkeleton = ({
  cols = 1,
  isEmpty,
  isFetching,
}: {
  cols: number;
  isEmpty: boolean;
  isFetching: boolean;
}) => {
  const columns = useMemo(() => Array.from(Array(cols).keys()), [cols]);

  if (isEmpty && isFetching) {
    return (
      <>
        <Table.Row>
          {columns.map((i) => (
            <Table.Cell colSpan={cols} key={i + "a"}>
              <Skeleton h="20px" w="full" />
            </Table.Cell>
          ))}
        </Table.Row>
        <Table.Row>
          {columns.map((i) => (
            <Table.Cell colSpan={cols} key={i + "b"}>
              <Skeleton h="20px" w="full" />
            </Table.Cell>
          ))}
        </Table.Row>
        <Table.Row>
          {columns.map((i) => (
            <Table.Cell colSpan={cols} key={i + "c"}>
              <Skeleton h="20px" w="full" />
            </Table.Cell>
          ))}
        </Table.Row>
      </>
    );
  }
};
