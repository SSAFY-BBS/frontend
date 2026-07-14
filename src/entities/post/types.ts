export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  // 익명 커뮤니티이므로 작성자 ID 없음. 수정/삭제 시 평문 비밀번호 검증
}