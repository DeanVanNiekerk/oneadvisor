import React from "react";

import { getAge } from "@/app/utils";

type Props = {
    dateOfBirth: string | null;
};

const Age: React.FC<Props> = (props: Props) => {
    return <span>{getAge(props.dateOfBirth)}</span>;
};

export { Age };
