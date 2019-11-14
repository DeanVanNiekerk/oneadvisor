import React from "react";

import { formatCurrency } from "@/app/utils";

type Props = {
    amount: number | null;
};

const Currency: React.FC<Props> = (props: Props) => {
    if (props.amount === null || props.amount === undefined) return <span />;

    return <span>{formatCurrency(props.amount)}</span>;
};

export { Currency };
