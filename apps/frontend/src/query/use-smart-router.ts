import { useRouter } from "next/router";

const useSmartRouter = () => {
  const router = useRouter();
  const page = (router.query.page as string) || "1";

  const updateQuery = (params = {} as Record<string, any>) => {
    router.replace({
      pathname: router.pathname,
      query: { ...router.query, ...params },
    });
  };

  const updatePage = (page: number) => {
    router.replace({
      pathname: router.pathname,
      query: { ...router.query, page },
    });
  };

  return { ...router, page, updatePage, updateQuery };
};

export default useSmartRouter;
