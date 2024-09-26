// responseFormat.ts

export const successResponse = (data: any, message: string) => {
    return {
        status: 'success',
        message,
        data,
    };
};

export const errorResponse = (message: string, error: any = null) => {
    return {
        status: 'error',
        message,
        error: error?.message || null, // Add error details if available
    };
};
