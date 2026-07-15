import { apiClient } from '@/shared/api/client';
import type { Post } from '@/entities/post/types';

export const fetchPosts = async (page: number, keyword?: string) => {
  const { data } = await apiClient.get<Post[]>('/board', { params: { page, keyword } });
  return data;
};

// 생성, 수정, 삭제 요청 (비밀번호 포함)
export const createPost = async (payload: any) => apiClient.post('/board', payload);
export const updatePost = async (id: number, payload: any) => apiClient.put(`/board/${id}`, payload);
export const deletePost = async (id: number, password: string) => apiClient.delete(`/board/${id}`, { data: { password } });

export interface ViewCountResponse {
  message: string;
  board_id: number;
  view_count: number;
}

export interface LikeCountResponse {
  message: string;
  board_id: number;
  like_count: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const boardApi = {
  /**
   * 조회수 증가 API
   * @param boardId 게시글 ID
   */
  async incrementViewCount(boardId: number): Promise<ViewCountResponse> {
    const response = await fetch(`${API_BASE_URL}/api/board/${boardId}/view`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`조회수 증가 실패: ${response.status}`);
    }

    return response.json();
  },

  /**
   * 좋아요 증가 API
   * @param boardId 게시글 ID
   */
  async incrementLikeCount(boardId: number): Promise<LikeCountResponse> {
    const response = await fetch(`${API_BASE_URL}/api/board/${boardId}/like`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`좋아요 증가 실패: ${response.status}`);
    }

    return response.json();
  },
};