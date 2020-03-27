import React from "react";

import { splitCamelCase } from "@/app/utils";
import { CommissionImportData } from "@/state/app/commission/errors";

type Props = {
    data: CommissionImportData;
};

const ErrorData: React.FC<Props> = ({ data }) => {
    return (
        <div>
            {Object.keys(data)
                .filter((key) => {
                    const value = data[key];
                    return value !== "" && value !== null;
                })
                .map((key) => {
                    return (
                        <p key={key}>
                            <b>
                                {splitCamelCase(key)}
                                {": "}
                            </b>
                            {data[key]}
                        </p>
                    );
                })}
        </div>
    );
};

export default ErrorData;
