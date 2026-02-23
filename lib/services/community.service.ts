import { apiService } from './api.service';

export interface ListResponse<T = unknown> {
  results?: T[];
}

export const communityService = {
  getForums: (_params?: Record<string, unknown>) =>
    apiService.get<ListResponse>('/api/community/forums/'),
  getForum: (id: string) => apiService.get<unknown>(`/api/community/forums/${id}/`),
  getForumDetails: (id: string) => apiService.get<unknown>(`/api/community/forums/${id}/`),
  getForumDiscussions: (forumId: string) =>
    apiService.get<unknown>(`/api/community/forums/${forumId}/discussions/`),
  getDiscussions: (forumId: string) =>
    apiService.get<ListResponse>(`/api/community/forums/${forumId}/discussions/`),
  getDiscussion: (id: string) => apiService.get<unknown>(`/api/community/discussions/${id}/`),
  getDiscussionDetails: (id: string) => apiService.get<unknown>(`/api/community/discussions/${id}/`),
  getReplies: (discussionId: string) =>
    apiService.get<ListResponse>(`/api/community/discussions/${discussionId}/replies/`),
  likeDiscussion: (discussionId: string) =>
    apiService.post<{ like_count: number; liked?: boolean }>(
      `/api/community/discussions/${discussionId}/like/`,
      {}
    ),
  createReply: (body: { discussion: string; content: string }) =>
    apiService.post<unknown>('/api/community/replies/', body),
  createDiscussion: (body: { forum: string; title: string; content: string }) =>
    apiService.post<{ id: string }>('/api/community/discussions/', body),
  getGroups: () => apiService.get<unknown>('/api/community/groups/'),
  getGroup: (id: string) => apiService.get<unknown>(`/api/community/groups/${id}/`),
  getStudyGroupDetails: (id: string) => apiService.get<unknown>(`/api/community/groups/${id}/`),
  joinStudyGroup: (groupId: string) =>
    apiService.post<unknown>(`/api/community/groups/${groupId}/join/`, {}),
  getStudyGroups: (_params?: Record<string, unknown>) =>
    apiService.get<ListResponse>('/api/community/groups/'),
  getMyStudyGroups: () => apiService.get<unknown>('/api/community/groups/my/'),
  getFeed: () => apiService.get<unknown>('/api/community/feed/'),
  getDiscussionsFeed: (_params?: Record<string, unknown>) =>
    apiService.get<ListResponse>('/api/community/feed/'),
  getCommunityStats: () => apiService.get<unknown>('/api/community/stats/'),
  getNotifications: (_params?: Record<string, unknown>) =>
    apiService.get<ListResponse>('/api/community/notifications/'),
  markAllNotificationsAsRead: () =>
    apiService.post<unknown>('/api/community/notifications/read-all/', {}),
  search: (query: string, _type?: string, _limit?: number) =>
    apiService.get<{
      results?: { forums?: unknown[]; discussions?: unknown[]; groups?: unknown[]; users?: unknown[] };
      forums?: unknown[];
      discussions?: unknown[];
      groups?: unknown[];
      users?: unknown[];
    }>(`/api/community/search/?q=${encodeURIComponent(query)}`),
};
