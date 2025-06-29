import useSmartRouter from "@/query/use-smart-router";
import { PaginationResult } from "@/types/pagination";
import {
  ButtonGroup,
  ButtonGroupProps,
  IconButton,
  Pagination,
  PaginationRootProps,
} from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props
  extends Omit<PaginationResult<any>, "data">,
    Omit<PaginationRootProps, "onPageChange"> {
  size?: ButtonGroupProps["size"];
  onPageChange?: (page: number) => void;
}

export const StandardPagination = ({
  size = "md",
  total,
  current_page,
  limit,
  last_page,
  onPageChange,
  ...props
}: Props) => {
  const router = useSmartRouter();
  const handlePageChange = (details: { page: number }) => {
    if (onPageChange) {
      onPageChange(details.page);
    } else {
      router.updatePage(details.page);
    }
  };
  return (
    <Pagination.Root
      count={total}
      pageSize={limit}
      page={current_page}
      defaultPage={1}
      onPageChange={handlePageChange}
      mx="auto"
      {...props}
    >
      <ButtonGroup variant="ghost" size={size}>
        <Pagination.PrevTrigger asChild>
          <IconButton>
            <ChevronLeft />
          </IconButton>
        </Pagination.PrevTrigger>

        <Pagination.Items
          render={(page) => (
            <IconButton variant={{ base: "ghost", _selected: "outline" }}>
              {page.value}
            </IconButton>
          )}
        />

        <Pagination.NextTrigger asChild>
          <IconButton>
            <ChevronRight />
          </IconButton>
        </Pagination.NextTrigger>
      </ButtonGroup>
    </Pagination.Root>
  );
};
