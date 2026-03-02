import { apiService } from './api.service';

export interface ListResponse<T = unknown> {
  results?: T[];
}

export const communityService = {
  getForums: (_params?: Record<string, unknown>) =>
    apiService.get<ListResponse>('/community/forums/'),
  getForum: (id: string) => apiService.get<unknown>(`/community/forums/${id}/`),
  getForumDetails: (id: string) => apiService.get<unknown>(`/community/forums/${id}/`),
  getForumDiscussions: (forumId: string) =>
    apiService.get<unknown>(`/community/forums/${forumId}/discussions/`),
  getDiscussions: (forumId: string) =>
    apiService.get<ListResponse>(`/community/forums/${forumId}/discussions/`),
  getDiscussion: (id: string) => apiService.get<unknown>(`/community/discussions/${id}/`),
  getDiscussionDetails: (id: string) => apiService.get<unknown>(`/community/discussions/${id}/`),
  getReplies: (discussionId: string) =>
    apiService.get<ListResponse>(`/community/discussions/${discussionId}/replies/`),
  likeDiscussion: (discussionId: string) =>
    apiService.post<{ like_count: number; liked?: boolean }>(
      `/community/discussions/${discussionId}/like/`,
      {}
    ),
  createReply: (body: { discussion: string; content: string }) =>
    apiService.post<unknown>('/community/replies/', body),
  createDiscussion: (body: { forum: string; title: string; content: string }) =>
    apiService.post<{ id: string }>('/community/discussions/', body),
  getGroups: () => apiService.get<unknown>('/community/groups/'),
  getGroup: (id: string) => apiService.get<unknown>(`/community/groups/${id}/`),
  getStudyGroupDetails: (id: string) => apiService.get<unknown>(`/community/groups/${id}/`),
  joinStudyGroup: (groupId: string) =>
    apiService.post<unknown>(`/community/groups/${groupId}/join/`, {}),
  getStudyGroups: (_params?: Record<string, unknown>) =>
    apiService.get<ListResponse>('/community/groups/'),
  getMyStudyGroups: () => apiService.get<unknown>('/community/groups/my/'),
  getFeed: () => apiService.get<unknown>('/community/feed/'),
  getDiscussionsFeed: (_params?: Record<string, unknown>) =>
    apiService.get<ListResponse>('/community/feed/'),
  getCommunityStats: () => apiService.get<unknown>('/community/stats/'),
  getNotifications: (_params?: Record<string, unknown>) =>
    apiService.get<ListResponse>('/community/notifications/'),
  markAllNotificationsAsRead: () =>
    apiService.post<unknown>('/community/notifications/read-all/', {}),
  search: (query: string, _type?: string, _limit?: number) =>
    apiService.get<{
      results?: { forums?: unknown[]; discussions?: unknown[]; groups?: unknown[]; users?: unknown[] };
      forums?: unknown[];
      discussions?: unknown[];
      groups?: unknown[];
      users?: unknown[];
    }>(`/community/search/?q=${encodeURIComponent(query)}`),
};
