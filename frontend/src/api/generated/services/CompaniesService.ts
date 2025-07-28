/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Company } from '../models/Company';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CompaniesService {
    /**
     * @returns Company Created company
     * @throws ApiError
     */
    public static companyControllerCreate(): CancelablePromise<Company> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/companies',
        });
    }
    /**
     * @returns Company List all companies
     * @throws ApiError
     */
    public static companyControllerFindAll(): CancelablePromise<Array<Company>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/companies',
        });
    }
    /**
     * @param id
     * @returns Company Get company by id
     * @throws ApiError
     */
    public static companyControllerFindOne(
        id: string,
    ): CancelablePromise<Company> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/companies/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Company not found`,
            },
        });
    }
    /**
     * @param id
     * @returns Company Update company by id
     * @throws ApiError
     */
    public static companyControllerUpdate(
        id: string,
    ): CancelablePromise<Company> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/companies/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Company not found`,
            },
        });
    }
    /**
     * @param id
     * @returns any Delete company by id
     * @throws ApiError
     */
    public static companyControllerRemove(
        id: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/companies/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Company not found`,
            },
        });
    }
}
