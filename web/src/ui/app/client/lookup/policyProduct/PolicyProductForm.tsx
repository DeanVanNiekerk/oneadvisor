import React, { Component } from 'react';
import { connect } from 'react-redux';

import { ValidationResult } from '@/app/validation';
import {
    PolicyProduct, PolicyProductType, policyProductTypesSelector, policyTypesSelector
} from '@/state/app/client/lookups';
import { companiesSelector, Company } from '@/state/app/directory/lookups';
import { RootState } from '@/state/rootReducer';
import { Form, FormInput, FormSelect } from '@/ui/controls';

type Props = {
    policyProduct: PolicyProduct;
    validationResults: ValidationResult[];
    onChange: (policyProduct: PolicyProduct) => void;
    companies: Company[];
    policyProductTypes: PolicyProductType[];
};

type State = {
    policyProduct: PolicyProduct;
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

    handleChange = (fieldName: string, value: any) => {
        const policyProduct = {
            ...this.state.policyProduct,
            [fieldName]: value,
        };
        this.setState({
            policyProduct: policyProduct,
        });
        this.props.onChange(policyProduct);
    };

    render() {
        const { validationResults } = this.props;
        const { policyProduct } = this.state;

        return (
            <Form editUseCase="dir_edit_lookups">
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
                    disabled={true}
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
