export const createPagination = (
  current_page: number,
  total_page: number,
  limit: number,
  total_items: number
) => {
  const data = {
    current_page,
    total_page,
    total_items,
    limit,
  };

  return data;
};
