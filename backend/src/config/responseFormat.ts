export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: any;
}

export const successResponse = <T>(data: T, message: string = 'Operation successful'): ApiResponse<T> => {
    return {
        success: true,
        message,
        data,
    };
};

export const errorResponse = (message: string, error?: any): ApiResponse<null> => {
    return {
        success: false,
        message,
        error,
    };
};
