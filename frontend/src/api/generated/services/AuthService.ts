/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * @returns any
     * @throws ApiError
     */
    public static authControllerSignUp(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/signup',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static authControllerSignIn(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/signin',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static authControllerChangePassword(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/change-password',
        });
    }
}
