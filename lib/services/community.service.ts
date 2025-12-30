import { apiService } from './api.service';
import { Forum, Discussion, Reply, StudyGroup, Notification, PaginatedResponse } from '../types';

class CommunityService {
    // Forums
    async getForums(params?: {
        course?: string;
        is_public?: boolean;
        search?: string;
        ordering?: string;
        page?: number;
    }): Promise<PaginatedResponse<Forum>> {
        const queryParams = new URLSearchParams();
        if (params?.course) queryParams.append('course', params.course);
        if (params?.is_public !== undefined) queryParams.append('is_public', params.is_public.toString());
        if (params?.search) queryParams.append('search', params.search);
        if (params?.ordering) queryParams.append('ordering', params.ordering);
        if (params?.page) queryParams.append('page', params.page.toString());

        const queryString = queryParams.toString();
        return apiService.get<PaginatedResponse<Forum>>(
            `/api/community/forums/${queryString ? `?${queryString}` : ''}`
        );
    }

    async getForumDetails(forumId: string): Promise<Forum> {
        return apiService.get<Forum>(`/api/community/forums/${forumId}/`);
    }

    async createForum(data: {
        name: string;
        description?: string;
        course?: string;
        is_public?: boolean;
    }): Promise<Forum> {
        return apiService.post<Forum>('/api/community/forums/', data);
    }

    async getForumDiscussions(forumId: string): Promise<Discussion[]> {
        const response = await apiService.get<any>(`/api/community/forums/${forumId}/discussions/`);
        return response.results || response;
    }

    // Discussions
    async getDiscussions(params?: {
        forum?: string;
        author?: string;
        status?: string;
        search?: string;
        ordering?: string;
        page?: number;
    }): Promise<PaginatedResponse<Discussion>> {
        const queryParams = new URLSearchParams();
        if (params?.forum) queryParams.append('forum', params.forum);
        if (params?.author) queryParams.append('author', params.author);
        if (params?.status) queryParams.append('status', params.status);
        if (params?.search) queryParams.append('search', params.search);
        if (params?.ordering) queryParams.append('ordering', params.ordering);
        if (params?.page) queryParams.append('page', params.page.toString());

        const queryString = queryParams.toString();
        return apiService.get<PaginatedResponse<Discussion>>(
            `/api/community/discussions/${queryString ? `?${queryString}` : ''}`
        );
    }

    async getDiscussionDetails(discussionId: string): Promise<Discussion> {
        return apiService.get<Discussion>(`/api/community/discussions/${discussionId}/`);
    }

    async createDiscussion(data: {
        forum: string;
        title: string;
        content: string;
        attachments?: any[];
    }): Promise<Discussion> {
        return apiService.post<Discussion>('/api/community/discussions/', data);
    }

    async likeDiscussion(discussionId: string): Promise<{ liked: boolean; like_count: number }> {
        return apiService.post(`/api/community/discussions/${discussionId}/like/`);
    }

    async pinDiscussion(discussionId: string): Promise<Discussion> {
        return apiService.post(`/api/community/discussions/${discussionId}/pin/`);
    }

    async closeDiscussion(discussionId: string): Promise<Discussion> {
        return apiService.post(`/api/community/discussions/${discussionId}/close/`);
    }

    // Replies
    async getReplies(discussionId: string): Promise<Reply[]> {
        const response = await apiService.get<any>(
            `/api/community/replies/?discussion=${discussionId}`
        );
        return response.results || response;
    }

    async createReply(data: {
        discussion: string;
        content: string;
        parent_reply?: string;
        attachments?: any[];
    }): Promise<Reply> {
        return apiService.post<Reply>('/api/community/replies/', data);
    }

    async likeReply(replyId: string): Promise<{ liked: boolean; like_count: number }> {
        return apiService.post(`/api/community/replies/${replyId}/like/`);
    }

    async updateReply(replyId: string, data: { content: string }): Promise<Reply> {
        return apiService.patch<Reply>(`/api/community/replies/${replyId}/`, data);
    }

    async deleteReply(replyId: string): Promise<void> {
        return apiService.delete(`/api/community/replies/${replyId}/`);
    }

    // Study Groups
    async getStudyGroups(params?: {
        course?: string;
        creator?: string;
        is_public?: boolean;
        search?: string;
        ordering?: string;
        page?: number;
    }): Promise<PaginatedResponse<StudyGroup>> {
        const queryParams = new URLSearchParams();
        if (params?.course) queryParams.append('course', params.course);
        if (params?.creator) queryParams.append('creator', params.creator);
        if (params?.is_public !== undefined) queryParams.append('is_public', params.is_public.toString());
        if (params?.search) queryParams.append('search', params.search);
        if (params?.ordering) queryParams.append('ordering', params.ordering);
        if (params?.page) queryParams.append('page', params.page.toString());

        const queryString = queryParams.toString();
        return apiService.get<PaginatedResponse<StudyGroup>>(
            `/api/community/study-groups/${queryString ? `?${queryString}` : ''}`
        );
    }

    async getStudyGroupDetails(groupId: string): Promise<StudyGroup> {
        return apiService.get<StudyGroup>(`/api/community/study-groups/${groupId}/`);
    }

    async createStudyGroup(data: {
        name: string;
        description?: string;
        course?: string;
        is_public?: boolean;
        max_members?: number;
    }): Promise<StudyGroup> {
        return apiService.post<StudyGroup>('/api/community/study-groups/', data);
    }

    async joinStudyGroup(groupId: string): Promise<{ status: string; message: string }> {
        return apiService.post(`/api/community/study-groups/${groupId}/join/`);
    }

    async leaveStudyGroup(groupId: string): Promise<{ message: string }> {
        return apiService.post(`/api/community/study-groups/${groupId}/leave/`);
    }

    async getMyStudyGroups(): Promise<StudyGroup[]> {
        const response = await apiService.get<any>('/api/community/study-groups/my_groups/');
        return response.results || response;
    }

    // Notifications
    async getNotifications(params?: {
        notification_type?: string;
        is_read?: boolean;
        page?: number;
    }): Promise<PaginatedResponse<Notification>> {
        const queryParams = new URLSearchParams();
        if (params?.notification_type) queryParams.append('notification_type', params.notification_type);
        if (params?.is_read !== undefined) queryParams.append('is_read', params.is_read.toString());
        if (params?.page) queryParams.append('page', params.page.toString());

        const queryString = queryParams.toString();
        return apiService.get<PaginatedResponse<Notification>>(
            `/api/community/notifications/${queryString ? `?${queryString}` : ''}`
        );
    }

    async markNotificationAsRead(notificationId: string): Promise<void> {
        return apiService.post(`/api/community/notifications/${notificationId}/mark-read/`);
    }

    async markAllNotificationsAsRead(): Promise<void> {
        return apiService.post('/api/community/notifications/mark-all-read/');
    }

    // Search
    async search(query: string, type?: string, limit?: number): Promise<{
        query: string;
        total: number;
        results: {
            forums: Forum[];
            discussions: Discussion[];
            groups: StudyGroup[];
            users: any[];
        };
    }> {
        const params = new URLSearchParams({ q: query });
        if (type) params.append('type', type);
        if (limit) params.append('limit', limit.toString());

        return apiService.get(`/api/community/search/?${params.toString()}`);
    }

    // User profiles
    async getUserProfile(userId: string): Promise<any> {
        return apiService.get(`/api/community/users/${userId}/profile/`);
    }

    async getUserActivity(userId: string): Promise<any> {
        return apiService.get(`/api/community/users/${userId}/activity/`);
    }

    // Community stats
    async getCommunityStats(): Promise<any> {
        return apiService.get('/api/community/stats/');
    }
}

export const communityService = new CommunityService();
