import update from "immutability-helper";
import React, { Component } from "react";

import { ValidationResult } from "@/app/validation";
import { OrganisationEdit } from "@/state/app/directory/organisations";
import { Form, FormDate, FormInput, FormSwitch } from "@/ui/controls";

type Props = {
    organisation: OrganisationEdit;
    validationResults: ValidationResult[];
    onChange: (organisation: OrganisationEdit) => void;
};

type State = {
    organisation: OrganisationEdit;
};

class OrganisationForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            organisation: props.organisation,
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.organisation != prevProps.organisation)
            this.setState({
                organisation: this.props.organisation,
            });
    }

    handleChange = (fieldName: keyof OrganisationEdit, value: string | boolean) => {
        const organisation = update(this.state.organisation, { [fieldName]: { $set: value } });
        this.setState({
            organisation: organisation,
        });
        this.props.onChange(organisation);
    };

    render() {
        const { validationResults } = this.props;
        const { organisation } = this.state;

        return (
            <Form editUseCase="dir_edit_organisations">
                <FormInput fieldName="id" label="Id" value={organisation.id} disabled={true} />
                <FormInput
                    fieldName="name"
                    label="Name"
                    value={organisation.name}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    autoFocus={true}
                />
                <FormSwitch
                    fieldName="vatRegistered"
                    label="VAT Registered"
                    value={organisation.vatRegistered}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
                <FormDate
                    fieldName="vatRegistrationDate"
                    label="VAT Registration Date"
                    value={organisation.vatRegistrationDate || undefined}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    allowClear={true}
                />
            </Form>
        );
    }
}

export default OrganisationForm;
