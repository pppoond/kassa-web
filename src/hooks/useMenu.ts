import { useQuery } from '@tanstack/react-query';
import { fetchMenu } from '../api/menu';
import type { CategoryMenuDto } from '../types/menu';

export const useMenu = () => {
  return useQuery<CategoryMenuDto[], Error>({
    queryKey: ['menu'],
    queryFn: fetchMenu,
  });
};
