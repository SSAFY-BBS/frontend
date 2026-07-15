import { apiClient } from "@/shared/api/client"

export interface Category {
  id: string
  name: string
}

export const fetchCategories = async (): Promise<Category[]> => {
    const { data } = await apiClient.get<Category[]>('/api/category')
    return data
}