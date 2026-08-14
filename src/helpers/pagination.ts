export function getPagination(page = 1, limit = 10) {
  const currentPage = Math.max(1, page);
  const currentLimit = Math.max(1, limit);

  return {
    page: currentPage,
    limit: currentLimit,
    offset: (currentPage - 1) * currentLimit,
  };
}