import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG, STORAGE_KEYS, ERROR_MESSAGES } from '../constants';
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '../utils';

class ApiService {
    private axiosInstance: AxiosInstance;
    private isRefreshing = false;
    private failedQueue: Array<{
        resolve: (value?: any) => void;
        reject: (reason?: any) => void;
    }> = [];

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: API_CONFIG.baseUrl,
            timeout: API_CONFIG.timeout,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Request interceptor
        this.axiosInstance.interceptors.request.use(
            async (config) => {
                const token = getLocalStorage<string | null>(STORAGE_KEYS.authToken, null);

                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

                // Handle 401 errors (unauthorized)
                if (error.response?.status === 401 && !originalRequest._retry) {
                    if (this.isRefreshing) {
                        // If already refreshing, queue this request
                        return new Promise((resolve, reject) => {
                            this.failedQueue.push({ resolve, reject });
                        })
                            .then((token) => {
                                if (originalRequest.headers) {
                                    originalRequest.headers.Authorization = `Bearer ${token}`;
                                }
                                return this.axiosInstance(originalRequest);
                            })
                            .catch((err) => {
                                return Promise.reject(err);
                            });
                    }

                    originalRequest._retry = true;
                    this.isRefreshing = true;

                    const refreshToken = getLocalStorage<string | null>(STORAGE_KEYS.refreshToken, null);

                    if (!refreshToken) {
                        this.handleLogout();
                        return Promise.reject(error);
                    }

                    try {
                        const response = await axios.post(`${API_CONFIG.baseUrl}/api/auth/refresh/`, {
                            refresh: refreshToken,
                        });

                        const { token } = response.data.data;
                        setLocalStorage(STORAGE_KEYS.authToken, token);

                        // Process failed queue
                        this.failedQueue.forEach((prom) => {
                            prom.resolve(token);
                        });
                        this.failedQueue = [];

                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }

                        return this.axiosInstance(originalRequest);
                    } catch (refreshError) {
                        this.failedQueue.forEach((prom) => {
                            prom.reject(refreshError);
                        });
                        this.failedQueue = [];
                        this.handleLogout();
                        return Promise.reject(refreshError);
                    } finally {
                        this.isRefreshing = false;
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    private handleLogout() {
        removeLocalStorage(STORAGE_KEYS.authToken);
        removeLocalStorage(STORAGE_KEYS.refreshToken);
        removeLocalStorage(STORAGE_KEYS.user);

        // Redirect to login
        if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
        }
    }

    private handleError(error: any): never {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<any>;

            if (axiosError.response) {
                // Server responded with error
                const data = axiosError.response.data;

                // Extract error message from Django REST framework format
                let errorMessage = ERROR_MESSAGES.serverError;

                if (data) {
                    if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
                        errorMessage = data.non_field_errors[0];
                    } else if (data.message) {
                        errorMessage = data.message;
                    } else if (data.detail) {
                        errorMessage = data.detail;
                    } else {
                        // Handle field-specific errors
                        const errorFields = Object.keys(data).filter(
                            (key) => key !== 'success' && key !== 'message'
                        );
                        if (errorFields.length > 0) {
                            const firstField = errorFields[0];
                            const firstError = data[firstField];
                            if (Array.isArray(firstError) && firstError.length > 0) {
                                errorMessage = firstError[0];
                            } else if (typeof firstError === 'string') {
                                errorMessage = firstError;
                            }
                        }
                    }
                }

                throw new Error(errorMessage);
            } else if (axiosError.request) {
                // Request made but no response
                throw new Error(ERROR_MESSAGES.network);
            }
        }

        throw new Error(ERROR_MESSAGES.unknown);
    }

    // GET request
    async get<T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.axiosInstance.get(endpoint, config);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    // POST request
    async post<T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.axiosInstance.post(endpoint, data, config);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    // PUT request
    async put<T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.axiosInstance.put(endpoint, data, config);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    // PATCH request
    async patch<T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.axiosInstance.patch(endpoint, data, config);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    // DELETE request
    async delete<T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.axiosInstance.delete(endpoint, config);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    // Unauthenticated GET request
    async getUnauthenticated<T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await axios.get(
                `${API_CONFIG.baseUrl}${endpoint}`,
                config
            );
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    // Unauthenticated POST request
    async postUnauthenticated<T = any>(
        endpoint: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<T> {
        try {
            const response: AxiosResponse<T> = await axios.post(
                `${API_CONFIG.baseUrl}${endpoint}`,
                data,
                config
            );
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    // File upload
    async upload<T = any>(endpoint: string, formData: FormData): Promise<T> {
        try {
            const token = getLocalStorage<string | null>(STORAGE_KEYS.authToken, null);
            const headers: Record<string, string> = {};

            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const response: AxiosResponse<T> = await axios.post(
                `${API_CONFIG.baseUrl}${endpoint}`,
                formData,
                {
                    headers,
                }
            );
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    // File download
    async download(endpoint: string): Promise<Blob> {
        try {
            const response: AxiosResponse<Blob> = await this.axiosInstance.get(endpoint, {
                responseType: 'blob',
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }
}

export const apiService = new ApiService();
