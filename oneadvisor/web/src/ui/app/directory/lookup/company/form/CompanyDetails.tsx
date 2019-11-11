import update from "immutability-helper";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { Company, companySelector, modifyCompany } from "@/state/app/directory/lookups";
import { RootState } from "@/state/rootReducer";
import { Form, FormInput } from "@/ui/controls";

type Props = PropsFromState & PropsFromDispatch;

const CompanyDetails: React.FC<Props> = ({ company, validationResults, handleChange }) => {
    if (!company) return <React.Fragment />;

    const onChange = (fieldName: keyof Company, value: string) => {
        handleChange(company, fieldName, value);
    };

    return (
        <Form>
            <FormInput
                fieldName="name"
                label="Name"
                value={company.name}
                onChange={onChange}
                validationResults={validationResults}
                autoFocus={true}
            />
        </Form>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const companyState = companySelector(state);
    return {
        company: companyState.company,
        validationResults: companyState.validationResults,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        handleChange: (company: Company, fieldName: keyof Company, value: string) => {
            const companyModified = update(company, { [fieldName]: { $set: value } });
            dispatch(modifyCompany(companyModified));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyDetails);
