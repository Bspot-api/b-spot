/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Company } from '../models/Company';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PersonalitiesService {
    /**
     * @returns any
     * @throws ApiError
     */
    public static personalityControllerCreate(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/personalities',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static personalityControllerFindAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/personalities',
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static personalityControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/personalities/{id}',
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
    public static personalityControllerUpdate(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/personalities/{id}',
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
    public static personalityControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/personalities/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns Company List all companies for this personality
     * @throws ApiError
     */
    public static personalityControllerGetCompanies(
        id: string,
    ): CancelablePromise<Array<Company>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/personalities/{id}/companies',
            path: {
                'id': id,
            },
        });
    }
}
