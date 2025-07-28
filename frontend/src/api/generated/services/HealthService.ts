/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HealthService {
    /**
     * Get application status
     * @returns any Application is running
     * @throws ApiError
     */
    public static appControllerGetHello(): CancelablePromise<{
        message?: string;
        timestamp?: string;
        version?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/',
        });
    }
    /**
     * Health check endpoint
     * @returns any Service is healthy
     * @throws ApiError
     */
    public static appControllerGetHealth(): CancelablePromise<{
        status?: string;
        uptime?: number;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health',
        });
    }
}
