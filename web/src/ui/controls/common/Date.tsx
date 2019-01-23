import moment from 'moment';
import React from 'react';

import { DATE_FORMAT, DATE_TIME_FORMAT } from '@/app/parsers';

type Props = {
    date: string | number | null;
    includeTime?: boolean;
    isUnixSeconds?: boolean;
};

const Date = (props: Props) => {
    if (!props.date) return <span />;

    let format = DATE_FORMAT;
    if (props.includeTime) format = DATE_TIME_FORMAT;

    let inputDate = props.date;
    if (props.isUnixSeconds) inputDate = (inputDate as number) * 1000;

    const date = moment(inputDate);

    return <span>{date.format(format)}</span>;
};

export { Date };
