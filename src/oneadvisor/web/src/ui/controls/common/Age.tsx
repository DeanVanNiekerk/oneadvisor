import React from "react";

import { getAge } from "@/app/utils";

type Props = {
    dateOfBirth: string | null;
};

const Age: React.FC<Props> = (props: Props) => {
    const age = getAge(props.dateOfBirth);

    return <span>{age ? age : ""}</span>;
};

export { Age };
