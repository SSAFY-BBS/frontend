import { apiClient } from '@/shared/api/client';
import type { Post } from '@/entities/post/types';

export const fetchPosts = async (page: number, keyword?: string) => {
  const { data } = await apiClient.get<Post[]>('/board', { params: { page, keyword } });
  return data;
};

// 생성, 수정, 삭제 요청 (비밀번호 포함)
export const createPost = async (payload: any) => apiClient.post('/api/board', payload);
export const updatePost = async (id: number, payload: any) => apiClient.put(`/api/board/${id}`, payload);
export const deletePost = async (id: number, password: string) => apiClient.delete(`/api/board/${id}`, { data: { password } });