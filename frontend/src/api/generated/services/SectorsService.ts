/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Company } from '../models/Company';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SectorsService {
    /**
     * @returns any
     * @throws ApiError
     */
    public static sectorControllerCreate(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/sectors',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static sectorControllerFindAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sectors',
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static sectorControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sectors/{id}',
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
    public static sectorControllerUpdate(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/sectors/{id}',
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
    public static sectorControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/sectors/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns Company List all companies for this sector
     * @throws ApiError
     */
    public static sectorControllerGetCompanies(
        id: string,
    ): CancelablePromise<Array<Company>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sectors/{id}/companies',
            path: {
                'id': id,
            },
        });
    }
}
