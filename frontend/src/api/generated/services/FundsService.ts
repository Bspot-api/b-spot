/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Company } from '../models/Company';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FundsService {
    /**
     * @returns any
     * @throws ApiError
     */
    public static fundControllerCreate(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/funds',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static fundControllerFindAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/funds',
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static fundControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/funds/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static fundControllerUpdate(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/funds/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static fundControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/funds/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns Company List all companies for this fund
     * @throws ApiError
     */
    public static fundControllerGetCompanies(
        id: string,
    ): CancelablePromise<Array<Company>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/funds/{id}/companies',
            path: {
                'id': id,
            },
        });
    }
}
