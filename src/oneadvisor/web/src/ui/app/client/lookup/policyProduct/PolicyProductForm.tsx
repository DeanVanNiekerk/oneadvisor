import update from "immutability-helper";
import React, { Component } from "react";
import { connect } from "react-redux";

import { ValidationResult } from "@/app/validation";
import {
    PolicyProductEdit,
    PolicyProductType,
    policyProductTypesSelector,
} from "@/state/app/client/lookups";
import { companiesSelector, Company } from "@/state/directory/lookups";
import { RootState } from "@/state/rootReducer";
import { Form, FormInput, FormSelect } from "@/ui/controls";

type Props = {
    policyProduct: PolicyProductEdit;
    validationResults: ValidationResult[];
    onChange: (policyProduct: PolicyProductEdit) => void;
    companies: Company[];
    policyProductTypes: PolicyProductType[];
};

type State = {
    policyProduct: PolicyProductEdit;
};

class PolicyProductForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            policyProduct: props.policyProduct,
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.policyProduct != prevProps.policyProduct)
            this.setState({
                policyProduct: this.props.policyProduct,
            });
    }

    handleChange = (fieldName: keyof PolicyProductEdit, value: string) => {
        const policyProduct = update(this.state.policyProduct, { [fieldName]: { $set: value } });
        this.setState({
            policyProduct: policyProduct,
        });
        this.props.onChange(policyProduct);
    };

    render() {
        const { validationResults } = this.props;
        const { policyProduct } = this.state;

        return (
            <Form>
                <FormInput
                    fieldName="name"
                    label="Name"
                    value={policyProduct.name}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    autoFocus={true}
                />
                <FormInput
                    fieldName="code"
                    label="Code"
                    value={policyProduct.code}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    disabled={!!policyProduct.id}
                />
                <FormSelect
                    fieldName="policyProductTypeId"
                    label="Product Type"
                    value={policyProduct.policyProductTypeId}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    options={this.props.policyProductTypes}
                    optionsValue="id"
                    optionsText="name"
                />
                <FormSelect
                    fieldName="companyId"
                    label="Company"
                    value={policyProduct.companyId}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    options={this.props.companies}
                    optionsValue="id"
                    optionsText="name"
                />
            </Form>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const companiesState = companiesSelector(state);
    const policyProductTypeState = policyProductTypesSelector(state);

    return {
        companies: companiesState.items,
        policyProductTypes: policyProductTypeState.items,
    };
};

export default connect(mapStateToProps)(PolicyProductForm);
