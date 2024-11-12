# This Is my Template for useHooks.
## First, these are the types.
```typescript
export type Result<T, E> = { success: true; value: T } | { success: false; error: E };

export enum FetchError {
    NETWORK_ERROR = 0,
    BAD_REQUEST_ERROR = 400,
    UNAUTHORIZED_ERROR = 401,
    NOT_FOUND_ERROR = 404,
    INTERNAL_SERVER_ERROR = 500,
}

export interface BaseError {
    is_error: boolean,
    message: string,
    code?: number,
}

export interface GET_baseRequestOptions {
    method: string;
    credentials: "include";
    headers: RequestHeaders
    signal: AbortSignal;
}

```
With those base types explained, here is the current 'template' I use, I copy this as the starting point for each new hook!
In this example, there is a another best pratice in play, with regards to /api/backend_api that isn't covered here, just
understand that the BASE_URL is the root of your target -> https://mybackend.com:42069/ and the PLACHOLDER_URL would be whatever other URL 
you are using from that file.
```typescript
import { useEffect, useRef, useState } from "react";
import { Result, FetchError, BaseError, GET_baseRequestOptions } from "../../types/basetypes";
import { BASE_URL, PLACEHOLDER_URL } from "../../api/backend_api";

type thisHookSuccessPayload = {
    value: string
}
const clean_error: BaseError = { is_error: false, message: "" };
export default function useTemplate() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<BaseError>(clean_error);
    const [data, setData] = useState<Result<thisHookSuccessPayload, BaseError>>({ success: true, value: { value: "Default" } });
    const controllerRef = useRef<AbortController | null>(null);


    useEffect(() => {
        // This will abort any calls that are inflight, if the thing using this hook un-mounts.
        return () => {
            if (controllerRef.current) {
                controllerRef.current.abort();
            }
        };
    }, []);


    const default_load_data = async (): Promise<void> => {
        // Abort any existing requests before starting a new one
        if (controllerRef.current) {
            controllerRef.current.abort();
        }
        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;
        let request_options: GET_baseRequestOptions = {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            signal
        };
        setLoading(true);
        setError(clean_error);

        try {
            const response = await fetch(`${BASE_URL}${PLACEHOLDER_URL}`, request_options);
            if (signal.aborted) return; // Fast Return if aborted

            if (response.status === 200) { //Fast return on success.
                let result: thisHookSuccessPayload = await response.json();
                setData({ success: true, value: result });
                return;
            }
            const message = await response.text();
            const errorType = response.status in FetchError ? response.status : FetchError.NETWORK_ERROR;
            setError({ is_error: true, message, code: errorType });
        } catch (e: any) {
            console.error(`[useTemplate] -> [default_load_data] -> Fetch Error: ${e}`);
            if (e instanceof DOMException && e.name === 'AbortError') {
                return; //Fast return in case of Abort mid-flight, without throwing app into Error state!
            }
            if (e instanceof Error) {
                setError({ is_error: true, message: e.message, code: FetchError.NETWORK_ERROR });
            } else {
                setError({ is_error: true, message: e.to_string(), code: FetchError.NETWORK_ERROR });
            }

        }
        finally {
            setLoading(false);
            // Only clear the controller ref if it wasn't already aborted
            if (controllerRef.current && !controllerRef.current.signal.aborted) {
                controllerRef.current = null;
            }
        }

    }

    return { loading, error, data, default_load_data };
}
```
This hook covers these pitfalls I'm trying to avoid!

1. UseEffect catches when a component using this hook un-mounts, it will remove and terminate the fetch, this will prevent memory leaks (possible).
2. UseRef will make sure that this hold the current Signal, regardless of invokation. It is cleared when there is a successful fetch.
3. This method also prevents race conditions for fetch calls, it immediately aborts when called. So single caller only.


