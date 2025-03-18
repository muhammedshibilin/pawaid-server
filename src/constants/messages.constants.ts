const MessageConstants = {
    SUCCESS: "Operation completed successfully.",
    CREATED: "Resource created successfully.",
    UPDATED: "Resource updated successfully.",
    DELETED: "Resource deleted successfully.",

    BAD_REQUEST: "Invalid request parameters.",
    UNAUTHORIZED: "You are not authorized to perform this action.",
    FORBIDDEN: "Access denied.",
    NOT_FOUND: "Resource not found.",
    METHOD_NOT_ALLOWED: "This HTTP method is not allowed.",
    CONFLICT: "Data conflict occurred.",
    UNPROCESSABLE_ENTITY: "Request could not be processed.",

    INTERNAL_SERVER_ERROR: "Something went wrong. Please try again later.",
    SERVICE_UNAVAILABLE: "Service is currently unavailable. Please try again later.",

    LOGIN_SUCCESS: "Login successful.",
    LOGIN_FAILED: "Invalid email or password.",
    LOGOUT_SUCCESS: "Logout successful.",
    TOKEN_EXPIRED: "Token has expired. Please log in again.",
    TOKEN_INVALID: "Invalid token.",

    PASSWORD_RESET_SENT: "Password reset instructions have been sent to your email.",
    PASSWORD_RESET_SUCCESS: "Password reset successful.",
    PASSWORD_RESET_FAILED: "Failed to reset password.",

    EMAIL_VERIFICATION_SENT: "Email verification link has been sent.",
    EMAIL_VERIFIED: "Email successfully verified.",
    EMAIL_VERIFICATION_FAILED: "Email verification failed.",
};

export default MessageConstants;
