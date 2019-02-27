import React, { Component } from 'react';

import { ValidationResult } from '@/app/validation';
import { DataStart } from '@/state/app/commission/templates';
import { Form, FormInput } from '@/ui/controls';

type Props = {
    dataStart: DataStart;
    validationResults: ValidationResult[];
    onChange: (template: DataStart) => void;
};

type State = {
    dataStart: DataStart;
};

class DataStartForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            dataStart: props.dataStart
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.dataStart != prevProps.dataStart)
            this.setState({
                dataStart: this.props.dataStart
            });
    }

    handleChange = (fieldName: string, value: any) => {
        const dataStart = {
            ...this.state.dataStart,
            [fieldName]: value
        };
        this.setState({
            dataStart: dataStart
        });
        this.props.onChange(dataStart);
    };

    render() {
        const { validationResults } = this.props;
        const { dataStart } = this.state;

        return (
            <Form editUseCase="com_edit_commission_statement_templates">
                <FormInput
                    fieldName="headerColumn"
                    label="Header Column"
                    value={dataStart.headerColumn}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
                <FormInput
                    fieldName="headerValue"
                    label="Header Value"
                    value={dataStart.headerValue}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
            </Form>
        );
    }
}

export default DataStartForm;
