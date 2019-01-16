import { Filters, PageOptions, SortOptions } from '@/app/table';
import { policiesApi } from '@/config/api/member';

import * as actions from './actions';

describe('policy: policies: list actions', () => {
    it('should dispatch API when fetchPolicies is called', () => {
        const pageOptions: PageOptions = {
            number: 2,
            size: 10
        };

        const sortOptions: SortOptions = {
            column: 'number',
            direction: 'desc'
        };

        const filters: Filters = {
            number: ['123']
        };

        const api = `${policiesApi}?pageNumber=${pageOptions.number}&pageSize=${
            pageOptions.size
        }&sortColumn=number&sortDirection=desc&filters=number%3D123`;

        const expectedAction = {
            type: 'API',
            endpoint: api,
            dispatchPrefix: 'POLICIES_LIST'
        };

        expect(
            actions.fetchPolicies(pageOptions, sortOptions, filters)
        ).toEqual(expectedAction);
    });

    it('should dispatch POLICIES_LIST_PAGE_OPTIONS_RECEIVE when receivePageOptions is called', () => {
        const options = {
            number: 10,
            size: 20
        };

        const expectedAction = {
            type: 'POLICIES_LIST_PAGE_OPTIONS_RECEIVE',
            payload: options
        };

        expect(actions.receivePageOptions(options)).toEqual(expectedAction);
    });

    it('should dispatch POLICIES_LIST_PAGE_OPTIONS_RECEIVE when receivePageOptions is called', () => {
        const options: SortOptions = {
            direction: 'desc',
            column: 'firstName'
        };

        const expectedAction = {
            type: 'POLICIES_LIST_SORT_OPTIONS_RECEIVE',
            payload: options
        };

        expect(actions.receiveSortOptions(options)).toEqual(expectedAction);
    });

    it('should dispatch POLICIES_LIST_FILTERS_RECEIVE when receiveFilters is called', () => {
        const filters: Filters = {
            firstName: ['sup']
        };

        const expectedAction = {
            type: 'POLICIES_LIST_FILTERS_RECEIVE',
            payload: filters
        };

        expect(actions.receiveFilters(filters)).toEqual(expectedAction);
    });
});
