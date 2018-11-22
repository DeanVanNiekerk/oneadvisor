// @flow

import * as React from 'react';
import PaginationBase from 'react-js-pagination';

type Props = {
    pageNumber: number,
    pageSize: number,
    totalItems: number,
    onChange: (pageNumber: number) => void
};

const Pagination = (props: Props) => (
    <PaginationBase
        hideNavigation
        activePage={props.pageNumber}
        itemsCountPerPage={props.pageSize}
        totalItemsCount={props.totalItems}
        pageRangeDisplayed={5}
        onChange={props.onChange}
        innerClass="pagination pagination-sm mb-0"
        itemClass="page-item"
        linkClass="page-link"
     />
);

export { Pagination };