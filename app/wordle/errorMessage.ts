import { isAxiosError } from "axios";

export const FALLBACK_ERROR_MESSAGE = "Something went wrong!";

type ValidationErrorBody = {
    detail: Array<{ msg: string }>;
};

function isValidationErrorBody(body: unknown): body is ValidationErrorBody {
    if (typeof body !== 'object' || body === null || !('detail' in body)) {
        return false;
    }
    const { detail } = body as { detail: unknown };
    return Array.isArray(detail) && detail.every((entry) => typeof entry?.msg === 'string');
}

/**
 * The API answers with a plain string for its own 4xx checks but with a FastAPI
 * validation object for 422, so the raw body cannot be handed to React directly.
 */
export function toErrorMessage(error: unknown): string {
    if (!isAxiosError(error)) {
        return FALLBACK_ERROR_MESSAGE;
    }

    const body = error.response?.data;
    if (typeof body === 'string' && body.trim() !== '') {
        return body;
    }
    if (isValidationErrorBody(body) && body.detail.length > 0) {
        return body.detail[0].msg;
    }
    return FALLBACK_ERROR_MESSAGE;
}
