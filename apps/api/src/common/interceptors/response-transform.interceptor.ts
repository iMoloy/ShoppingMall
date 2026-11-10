import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: unknown;
}

function isPaginatedPayload(
  value: unknown,
): value is { items: unknown; meta: unknown } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'items' in value &&
    'meta' in value &&
    Array.isArray((value as Record<string, unknown>).items)
  );
}

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, SuccessResponse<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<SuccessResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        if (isPaginatedPayload(data)) {
          return {
            success: true as const,
            data: data.items as T,
            meta: data.meta,
          };
        }
        return { success: true as const, data };
      }),
    );
  }
}
