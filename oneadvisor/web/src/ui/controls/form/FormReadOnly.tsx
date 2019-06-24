import { FormLayout } from 'antd/lib/form/Form';
import React, { Component } from 'react';

import { splitCamelCase } from '@/app/utils';
import { Form, FormText } from '@/ui/controls';

type Props = {
    data: object;
    layout?: FormLayout;
};

class FormReadOnly extends Component<Props> {
    render() {
        const { data } = this.props;

        return (
            <Form layout={this.props.layout}>
                {Object.keys(data)
                    .filter(key => {
                        const value = data[key];
                        return value !== "" && value !== null;
                    })
                    .map(key => {
                        return (
                            <FormText
                                key={key}
                                fieldName={key}
                                label={splitCamelCase(key)}
                                value={data[key]}
                            />
                        );
                    })}
            </Form>
        );
    }
}

export { FormReadOnly };
