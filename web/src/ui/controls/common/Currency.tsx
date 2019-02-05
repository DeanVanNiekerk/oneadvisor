import React from 'react';

import { formatCurrency } from '@/app/utils';

type Props = {
    amount: number | null;
};

const Currency = (props: Props) => {
    if (props.amount === null || props.amount === undefined) return <span />;

    return <span>{formatCurrency(props.amount)}</span>;
};

export { Currency };
