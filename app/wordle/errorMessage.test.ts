import { AxiosError, AxiosHeaders } from "axios";
import { describe, expect, test } from "vitest";
import { FALLBACK_ERROR_MESSAGE, toErrorMessage } from "./errorMessage";

function axiosErrorWithBody(data: unknown, status = 400): AxiosError {
    const headers = new AxiosHeaders();
    return new AxiosError("Request failed", "ERR_BAD_REQUEST", { headers }, null, {
        data,
        status,
        statusText: "",
        headers,
        config: { headers },
    });
}

describe("toErrorMessage", () => {
    test("uses a plain string body as the message", () => {
        const error = axiosErrorWithBody("Guess must be the same length as the word");

        expect(toErrorMessage(error)).toBe("Guess must be the same length as the word");
    });

    test("extracts the message from a validation error body instead of rendering the object", () => {
        const error = axiosErrorWithBody(
            {
                detail: [
                    { loc: ["query", "size"], msg: "value is not a valid integer", type: "type_error.integer" },
                ],
            },
            422,
        );

        expect(toErrorMessage(error)).toBe("value is not a valid integer");
    });

    test("falls back when the request never reached the server", () => {
        const error = new AxiosError("Network Error", "ERR_NETWORK");

        expect(toErrorMessage(error)).toBe(FALLBACK_ERROR_MESSAGE);
    });

    test("falls back for a body that is neither a string nor a validation error", () => {
        const error = axiosErrorWithBody({ unexpected: true });

        expect(toErrorMessage(error)).toBe(FALLBACK_ERROR_MESSAGE);
    });

    test("falls back for errors that did not come from axios", () => {
        expect(toErrorMessage(new Error("boom"))).toBe(FALLBACK_ERROR_MESSAGE);
    });

    test("always returns a string so it can be rendered directly", () => {
        const error = axiosErrorWithBody({ detail: [] }, 422);

        expect(typeof toErrorMessage(error)).toBe("string");
    });
});
