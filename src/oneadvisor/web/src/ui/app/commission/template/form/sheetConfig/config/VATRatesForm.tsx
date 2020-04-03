import { List, Popconfirm } from "antd";
import update from "immutability-helper";
import React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { getValidationSubSet } from "@/app/validation";
import {
    commissionStatementTemplateConfigValidationResultsSelector,
    commissionStatementTemplateVATRatesConfigSelector,
    modifyCommissionStatementTemplateVATRates,
    VATRate,
} from "@/state/commission/templates";
import { RootState } from "@/state/rootReducer";
import { Button, Form, FormErrors, FormInput, FormInputNumber } from "@/ui/controls";

type Props = PropsFromState & PropsFromDispatch;

const VATRatesForm: React.FC<Props> = (props: Props) => {
    const { vatRates, validationResults } = props;

    const onChange = (
        vatRate: VATRate,
        fieldName: string,
        value: string | number,
        index: number
    ) => {
        props.update(vatRate, fieldName, value, index, vatRates);
    };

    const getActions = (index: number) => {
        return [
            <Popconfirm
                title="Are you sure remove this VAT Rate?"
                onConfirm={() => props.remove(index, vatRates)}
                okText="Yes"
                cancelText="No"
                key="remove-field"
            >
                <a href="#">remove</a>
            </Popconfirm>,
        ];
    };

    return (
        <>
            <FormErrors validationResults={validationResults} />

            <Button
                iconName="plus"
                type="dashed"
                onClick={() => props.add(vatRates)}
                noLeftMargin={true}
            >
                {`Add VAT Rate`}
            </Button>

            <List
                bordered
                className="mt-1"
                dataSource={vatRates}
                renderItem={(vatRate: VATRate, index: number) => (
                    <List.Item actions={[getActions(index)]}>
                        <Form key={index} layout="inline">
                            <FormInput
                                fieldName="column"
                                validationFieldName={`[${index}].column`}
                                label="Column"
                                value={vatRate.column}
                                onChange={(fieldName: string, value: string) => {
                                    onChange(vatRate, fieldName, value, index);
                                }}
                                validationResults={validationResults}
                                width="100px"
                            />
                            <FormInput
                                fieldName="value"
                                validationFieldName={`[${index}].value`}
                                label="Value"
                                value={vatRate.value}
                                onChange={(fieldName: string, value: string) => {
                                    onChange(vatRate, fieldName, value, index);
                                }}
                                validationResults={validationResults}
                                width="300px"
                            />
                            <FormInputNumber
                                fieldName="rate"
                                validationFieldName={`[${index}].rate`}
                                label="Rate"
                                value={vatRate.rate}
                                onChange={(fieldName: string, value: number) => {
                                    onChange(vatRate, fieldName, value, index);
                                }}
                                validationResults={validationResults}
                                width="100px"
                                precision={0}
                            />
                        </Form>
                    </List.Item>
                )}
            />
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        vatRates: commissionStatementTemplateVATRatesConfigSelector(state),
        validationResults: getValidationSubSet(
            `vatRates`,
            commissionStatementTemplateConfigValidationResultsSelector(state),
            true
        ),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        update: (
            vatRate: VATRate,
            fieldName: string,
            value: string | number,
            index: number,
            vatRates: VATRate[]
        ) => {
            const rateModified = update(vatRate, {
                [fieldName]: { $set: value },
            });
            const modifiedRates = update(vatRates, {
                [index]: {
                    $set: rateModified,
                },
            });
            dispatch(modifyCommissionStatementTemplateVATRates(modifiedRates));
        },
        add: (vatRates: VATRate[]) => {
            const modifiedRates = update(vatRates, {
                $push: [
                    {
                        column: "",
                        value: "",
                        rate: 0,
                    },
                ],
            });
            dispatch(modifyCommissionStatementTemplateVATRates(modifiedRates));
        },
        remove: (index: number, vatRates: VATRate[]) => {
            const modifiedRates = update(vatRates, {
                $splice: [[index, 1]],
            });
            dispatch(modifyCommissionStatementTemplateVATRates(modifiedRates));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VATRatesForm);
