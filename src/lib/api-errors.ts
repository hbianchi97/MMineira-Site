import { NextResponse } from 'next/server';
import { z } from 'zod';

export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode: number = 500
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export function handleApiError(error: unknown) {
    if (error instanceof ApiError) {
        return NextResponse.json(
            { error: error.message, success: false },
            { status: error.statusCode }
        );
    }

    if (error instanceof z.ZodError) {
        return NextResponse.json(
            {
                error: 'Validation failed',
                issues: error.issues,
                success: false
            },
            { status: 400 }
        );
    }

    console.error('Unexpected API error:', error);
    return NextResponse.json(
        { error: 'Internal server error', success: false },
        { status: 500 }
    );
}
