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
```
