import { Tooltip } from "antd";
import update from "immutability-helper";
import React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { getValidationSubSet } from "@/app/validation";
import {
    AmountIdentifier,
    commissionStatementTemplateAmountIdenifierConfigSelector,
    commissionStatementTemplateConfigValidationResultsSelector,
    modifyCommissionStatementTemplateAmountIdentifier,
} from "@/state/app/commission/templates";
import { RootState } from "@/state/rootReducer";
import { Form, FormInput, FormSelect } from "@/ui/controls";
import { InfoCircleOutlined } from "@ant-design/icons";

type Props = PropsFromState & PropsFromDispatch;

const AmountIdentifierForm: React.FC<Props> = ({
    amountIdentifier,
    validationResults,
    handleChange,
}) => {
    if (!amountIdentifier) return <React.Fragment />;

    const onChange = (fieldName: keyof AmountIdentifier, value: string) => {
        handleChange(amountIdentifier, fieldName, value);
    };

    return (
        <Form>
            <FormInput
                fieldName="column"
                label="Column"
                value={amountIdentifier.column}
                onChange={onChange}
                validationResults={validationResults}
            />
            <FormInput
                fieldName="value"
                label="Value"
                value={amountIdentifier.value}
                onChange={onChange}
                validationResults={validationResults}
                addonAfter={
                    <Tooltip title="This is a regular expression used to evaluate the match condition">
                        <InfoCircleOutlined />
                    </Tooltip>
                }
            />
            <FormSelect<string>
                fieldName="type"
                label="Type"
                value={amountIdentifier.type}
                onChange={onChange}
                validationResults={validationResults}
                options={[
                    {
                        type: "includingVat",
                        name: "Including Vat",
                    },
                    {
                        type: "excludingVat",
                        name: "Excluding Vat",
                    },
                ]}
                optionsValue="type"
                optionsText="name"
            />
        </Form>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        amountIdentifier: commissionStatementTemplateAmountIdenifierConfigSelector(state),
        validationResults: getValidationSubSet(
            `amountIdentifier`,
            commissionStatementTemplateConfigValidationResultsSelector(state)
        ),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        handleChange: (
            identifier: AmountIdentifier,
            fieldName: keyof AmountIdentifier,
            value: string
        ) => {
            const identifierModified = update(identifier, { [fieldName]: { $set: value } });
            dispatch(modifyCommissionStatementTemplateAmountIdentifier(identifierModified));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AmountIdentifierForm);
