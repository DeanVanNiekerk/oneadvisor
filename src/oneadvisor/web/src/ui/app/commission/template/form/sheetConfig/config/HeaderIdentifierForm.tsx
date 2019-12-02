import update from "immutability-helper";
import React, { Component } from "react";

import { ValidationResult } from "@/app/validation";
import { Identifier } from "@/state/app/commission/templates";
import { Form, FormInput } from "@/ui/controls";

type Props = {
    headerIdentifier: Identifier;
    validationResults: ValidationResult[];
    onChange: (headerIdentifier: Identifier) => void;
};

class HeaderIdentifierForm extends Component<Props> {
    componentDidUpdate(prevProps: Props) {
        if (this.props.headerIdentifier != prevProps.headerIdentifier)
            this.setState({
                headerIdentifier: this.props.headerIdentifier,
            });
    }

    handleChange = (fieldName: keyof Identifier, value: string) => {
        const headerIdentifier = update(this.props.headerIdentifier, {
            [fieldName]: { $set: value },
        });
        this.setState({
            headerIdentifier: headerIdentifier,
        });
        this.props.onChange(headerIdentifier);
    };

    render() {
        const { headerIdentifier, validationResults } = this.props;

        return (
            <Form>
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
