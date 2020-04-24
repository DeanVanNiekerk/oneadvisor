import update from "immutability-helper";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { RootState } from "@/state";
import {
    LicenseCategoryEdit,
    licenseCategorySelector,
    modifyLicenseCategory,
} from "@/state/lookups/directory";
import { Form, FormInput } from "@/ui/controls";

type Props = PropsFromState & PropsFromDispatch;

const LicenseCategoryForm: React.FC<Props> = ({
    licenseCategory,
    validationResults,
    handleChange,
}) => {
    if (!licenseCategory) return <React.Fragment />;

    const onChange = (fieldName: keyof LicenseCategoryEdit, value: string) => {
        handleChange(licenseCategory, fieldName, value);
    };

    return (
        <Form>
            <FormInput
                fieldName="name"
                label="Name"
                value={licenseCategory.name}
                onChange={onChange}
                validationResults={validationResults}
                autoFocus={true}
            />
            <FormInput
                fieldName="code"
                label="Code"
                value={licenseCategory.code}
                onChange={onChange}
                validationResults={validationResults}
                autoFocus={true}
            />
        </Form>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const licenseCategoryState = licenseCategorySelector(state);
    return {
        licenseCategory: licenseCategoryState.licenseCategory,
        validationResults: licenseCategoryState.validationResults,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        handleChange: (
            licenseCategory: LicenseCategoryEdit,
            fieldName: keyof LicenseCategoryEdit,
            value: string
        ) => {
            const licenseCategoryModified = update(licenseCategory, {
                [fieldName]: { $set: value },
            });
            dispatch(modifyLicenseCategory(licenseCategoryModified));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LicenseCategoryForm);
