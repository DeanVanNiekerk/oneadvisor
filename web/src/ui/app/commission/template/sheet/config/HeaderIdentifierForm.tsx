import React, { Component } from 'react';

import { ValidationResult } from '@/app/validation';
import { HeaderIdentifier } from '@/state/app/commission/templates';
import { Form, FormInput } from '@/ui/controls';
import update from 'immutability-helper';

type Props = {
    headerIdentifier: HeaderIdentifier;
    validationResults: ValidationResult[];
    onChange: (headerIdentifier: HeaderIdentifier) => void;
};

type State = {
    headerIdentifier: HeaderIdentifier;
};

class HeaderIdentifierForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            headerIdentifier: props.headerIdentifier,
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.headerIdentifier != prevProps.headerIdentifier)
            this.setState({
                headerIdentifier: this.props.headerIdentifier,
            });
    }

    handleChange = (fieldName: keyof HeaderIdentifier, value: string) => {
        const headerIdentifier = update(this.state.headerIdentifier, { [fieldName]: { $set: value } });
        this.setState({
            headerIdentifier: headerIdentifier,
        });
        this.props.onChange(headerIdentifier);
    };

    render() {
        const { validationResults } = this.props;
        const { headerIdentifier } = this.state;

        return (
            <Form editUseCase="com_edit_commission_statement_templates">
                <FormInput
                    fieldName="column"
                    label="Column"
                    value={headerIdentifier.column}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
                <FormInput
                    fieldName="value"
                    label="Value"
                    value={headerIdentifier.value}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
            </Form>
        );
    }
}

export default HeaderIdentifierForm;
