import { List, Popconfirm } from "antd";
import update from "immutability-helper";
import React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { getValidationSubSet } from "@/app/validation";
import { commissionStatementTemplateFieldNamesSelector } from "@/state/app/commission/lookups";
import {
    commissionStatementTemplateConfigValidationResultsSelector,
    commissionStatementTemplateFieldsConfigSelector,
    Field,
    modifyCommissionStatementTemplateFields,
} from "@/state/app/commission/templates";
import { RootState } from "@/state/rootReducer";
import {
    Button,
    Form,
    FormErrors,
    FormInput,
    FormItemIcon,
    FormSelect,
    FormSwitch,
} from "@/ui/controls";
import { ArrowRightOutlined } from "@ant-design/icons";

type Props = PropsFromState & PropsFromDispatch;

const FieldsForm: React.FC<Props> = (props: Props) => {
    const { fields, validationResults, fieldNames } = props;

    const onChange = (field: Field, fieldName: string, value: string | boolean, index: number) => {
        props.update(field, fieldName, value, index, fields);
    };

    const getActions = (index: number) => {
        return [
            <Popconfirm
                title="Are you sure remove this mapping?"
                onConfirm={() => props.remove(index, fields)}
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

            <Button icon="plus" type="dashed" onClick={() => props.add(fields)} noLeftMargin={true}>
                {`Add Mapping`}
            </Button>

            <List
                bordered
                className="mt-1"
                dataSource={fields}
                renderItem={(field: Field, index: number) => (
                    <List.Item actions={[getActions(index)]}>
                        <Form key={index} layout="inline">
                            <FormInput
                                fieldName="column"
                                validationFieldName={`[${index}].column`}
                                label="Column"
                                value={field.column}
                                onChange={(fieldName: string, value: string) => {
                                    onChange(field, fieldName, value, index);
                                }}
                                validationResults={validationResults}
                                width="100px"
                            />
                            <FormItemIcon icon={ArrowRightOutlined} />
                            <FormSelect
                                fieldName="name"
                                validationFieldName={`[${index}].name`}
                                label="Field"
                                value={field.name}
                                onChange={(fieldName: string, value: string) => {
                                    onChange(field, fieldName, value, index);
                                }}
                                validationResults={validationResults}
                                options={fieldNames}
                                optionsValue="id"
                                optionsText="name"
                                width="300px"
                            />
                            <FormSwitch
                                fieldName="negateValue"
                                label="Neg."
                                value={field.negateValue}
                                validationResults={validationResults}
                                onChange={(fieldName: string, value: boolean) => {
                                    onChange(field, fieldName, value, index);
                                }}
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
        fields: commissionStatementTemplateFieldsConfigSelector(state),
        validationResults: getValidationSubSet(
            `fields`,
            commissionStatementTemplateConfigValidationResultsSelector(state),
            true
        ),
        fieldNames: commissionStatementTemplateFieldNamesSelector(state).items,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        update: (
            field: Field,
            fieldName: string,
            value: string | boolean,
            index: number,
            fields: Field[]
        ) => {
            const fieldModified = update(field, {
                [fieldName]: { $set: value },
            });
            const modifiedFields = update(fields, {
                [index]: {
                    $set: fieldModified,
                },
            });
            dispatch(modifyCommissionStatementTemplateFields(modifiedFields));
        },
        add: (fields: Field[]) => {
            const modifiedFields = update(fields, {
                $push: [
                    {
                        name: "",
                        column: "",
                        negateValue: false,
                    },
                ],
            });
            dispatch(modifyCommissionStatementTemplateFields(modifiedFields));
        },
        remove: (index: number, fields: Field[]) => {
            const modifiedFields = update(fields, {
                $splice: [[index, 1]],
            });
            dispatch(modifyCommissionStatementTemplateFields(modifiedFields));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FieldsForm);
