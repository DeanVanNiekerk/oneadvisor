import { FormLayout } from "antd/lib/form/Form";
import React from "react";

import { splitCamelCase } from "@/app/utils";
import { Form, FormText } from "@/ui/controls";

type Props = {
    data: object;
    layout?: FormLayout;
};

const FormReadOnly: React.FC<Props> = ({ data, layout }) => {
    return (
        <Form layout={layout}>
            {Object.keys(data)
                .filter(key => {
                    const value = data[key];
                    return value !== "" && value !== null;
                })
                .map(key => {
                    return <FormText key={key} fieldName={key} label={splitCamelCase(key)} value={data[key]} />;
                })}
        </Form>
    );
};

export { FormReadOnly };
