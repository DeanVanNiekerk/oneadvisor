import update from "immutability-helper";
import React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { getValidationSubSet } from "@/app/validation";
import {
    commissionStatementTemplateConfigValidationResultsSelector,
    commissionStatementTemplateHeaderIdenifierConfigSelector,
    Identifier,
    modifyCommissionStatementTemplateHeaderIdentifier,
} from "@/state/commission/templates";
import { RootState } from "@/state/rootReducer";
import { Form, FormInput } from "@/ui/controls";

type Props = PropsFromState & PropsFromDispatch;

const HeaderIdentifierForm: React.FC<Props> = ({
    headerIdentifier,
    validationResults,
    handleChange,
}) => {
    if (!headerIdentifier) return <React.Fragment />;

    const onChange = (fieldName: keyof Identifier, value: string) => {
        handleChange(headerIdentifier, fieldName, value);
    };

    return (
        <Form>
            <FormInput
                fieldName="column"
                label="Column"
                value={headerIdentifier.column}
                onChange={onChange}
                validationResults={validationResults}
            />
            <FormInput
                fieldName="value"
                label="Value"
                value={headerIdentifier.value}
                onChange={onChange}
                validationResults={validationResults}
            />
        </Form>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        headerIdentifier: commissionStatementTemplateHeaderIdenifierConfigSelector(state),
        validationResults: getValidationSubSet(
            `headerIdentifier`,
            commissionStatementTemplateConfigValidationResultsSelector(state)
        ),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        handleChange: (identifier: Identifier, fieldName: keyof Identifier, value: string) => {
            const identifierModified = update(identifier, { [fieldName]: { $set: value } });
            dispatch(modifyCommissionStatementTemplateHeaderIdentifier(identifierModified));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderIdentifierForm);
