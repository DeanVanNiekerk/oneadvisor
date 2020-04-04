import update from "immutability-helper";
import React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { getValidationSubSet } from "@/app/validation";
import { RootState } from "@/state";
import {
    commissionStatementTemplateConfigValidationResultsSelector,
    commissionStatementTemplateExchangeRatesConfigSelector,
    ExchangeRates,
    Identifier,
    modifyCommissionStatementTemplateExchangeRates,
} from "@/state/commission/templates";
import { Form, FormInput } from "@/ui/controls";

type Props = PropsFromState & PropsFromDispatch;

const ExchangeRatesForm: React.FC<Props> = (props: Props) => {
    if (!props.exchangeRates) return <React.Fragment />;

    const { exchangeRates, validationResults } = props;

    const onChange = (fieldName: keyof ExchangeRates, value: string | Identifier) => {
        props.handleChange(exchangeRates, fieldName, value);
    };

    return (
        <Form>
            <FormInput
                fieldName="headerIdentifier.column"
                label="Header Identifier Column"
                value={exchangeRates.headerIdentifier.column}
                onChange={(_fieldName: string, value: string) => {
                    const headerIdentifier = {
                        ...exchangeRates.headerIdentifier,
                        column: value,
                    };
                    onChange("headerIdentifier", headerIdentifier);
                }}
                validationResults={validationResults}
            />
            <FormInput
                fieldName="headerIdentifier.value"
                label="Header Identifier Value"
                value={exchangeRates.headerIdentifier.value}
                onChange={(_fieldName: string, value: string) => {
                    const headerIdentifier = {
                        ...exchangeRates.headerIdentifier,
                        value: value,
                    };
                    onChange("headerIdentifier", headerIdentifier);
                }}
                validationResults={validationResults}
            />
            <FormInput
                fieldName="currencyColumn"
                label="Currency Column"
                value={exchangeRates.currencyColumn}
                onChange={onChange}
                validationResults={validationResults}
            />
            <FormInput
                fieldName="exchangeRateColumn"
                label="Exchange Rate Column"
                value={exchangeRates.exchangeRateColumn}
                onChange={onChange}
                validationResults={validationResults}
            />
        </Form>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        exchangeRates: commissionStatementTemplateExchangeRatesConfigSelector(state),
        validationResults: getValidationSubSet(
            `exchangeRates`,
            commissionStatementTemplateConfigValidationResultsSelector(state)
        ),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        handleChange: (
            exchangeRate: ExchangeRates,
            fieldName: keyof ExchangeRates,
            value: string | Identifier
        ) => {
            const exchangeRateModified = update(exchangeRate, { [fieldName]: { $set: value } });
            dispatch(modifyCommissionStatementTemplateExchangeRates(exchangeRateModified));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeRatesForm);
