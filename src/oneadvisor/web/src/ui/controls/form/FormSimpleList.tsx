import { List, Popconfirm } from "antd";
import updateImmutable from "immutability-helper";
import React, { useState } from "react";
import { connect } from "react-redux";

import { hasUseCase } from "@/app/identity";
import { getErrorMessage, ValidationResult } from "@/app/validation";
import { RootState } from "@/state";
import { useCaseSelector } from "@/state/auth";

import { Button, FormInput } from "../";
import { Form } from "./Form";
import { FormField } from "./FormField";

type Props = {
    values: string[];
    fieldName: string;
    displayName: string;
    onChange: (values: string[]) => void;
    validationResults?: ValidationResult[];
    editUseCase?: string;
} & PropsFromState;

type Mode = "add" | "edit";

const FormSimpleListComponent: React.FC<Props> = (props: Props) => {
    const [mode, setMode] = useState("add");
    const [values, setValues] = useState(props.values);
    const [editing, setEditing] = useState(false);
    const [editValue, setEditValue] = useState("");
    const [editIndex, setEditIndex] = useState<number | null>(null);

    const add = () => {
        setEditing(true);
        setEditValue("");
        setEditIndex(null);
        setMode("add");
    };

    const edit = (value: string, index: number) => {
        setEditing(true);
        setEditValue(value);
        setEditIndex(index);
        setMode("edit");
    };

    const remove = (index: number) => {
        const vals = updateImmutable(values, { $splice: [[index, 1]] });
        setValues(vals);
        props.onChange(vals);
    };

    const cancel = () => {
        setEditing(false);
        setEditValue("");
        setEditIndex(null);
    };

    const update = (value: string) => {
        setEditValue(value);
    };

    const save = () => {
        let vals: string[] = [];
        if (editIndex === null) {
            vals = updateImmutable(values, {
                $push: [editValue],
            });
        } else {
            vals = updateImmutable(values, {
                [editIndex]: {
                    $set: editValue,
                },
            });
        }

        setValues(vals);
        setEditing(false);
        setEditValue("");
        setEditIndex(null);

        props.onChange(vals);
    };

    const getActions = (value: string, index: number) => {
        if (props.editUseCase && !hasUseCase(props.editUseCase, props.useCases)) return [];

        return [
            <a key={"1"} onClick={() => edit(value, index)}>
                edit
            </a>,
            <Popconfirm
                key={"2"}
                title="Are you sure remove this record?"
                onConfirm={() => remove(index)}
                okText="Yes"
                cancelText="No"
            >
                <a href="#">remove</a>
            </Popconfirm>,
        ];
    };

    return (
        <>
            {!editing && (
                <Form layout="inline">
                    <FormField>
                        <Button
                            iconName="plus"
                            type="dashed"
                            onClick={add}
                            noLeftMargin={true}
                            requiredUseCase={props.editUseCase}
                        >
                            {`Add ${props.displayName}`}
                        </Button>
                    </FormField>
                </Form>
            )}

            {editing && (
                <Form layout="inline">
                    <FormInput
                        fieldName={props.fieldName}
                        label={props.displayName}
                        value={editValue}
                        onChange={(fieldName: string, value: string) => update(value)}
                        autoFocus={true}
                    />
                    <FormField className="mr-0">
                        <Button onClick={() => cancel()}>Cancel</Button>
                    </FormField>
                    <FormField>
                        <Button onClick={save} type="primary" disabled={!editValue}>
                            {mode === "edit"
                                ? `Update ${props.displayName}`
                                : `Add ${props.displayName}`}
                        </Button>
                    </FormField>
                </Form>
            )}

            <List
                bordered
                className="mt-1"
                dataSource={values}
                renderItem={(value: string, index: number) => (
                    <List.Item actions={getActions(value, index)}>
                        <List.Item.Meta
                            title={<span className="font-weight-normal">{value}</span>}
                            description={
                                <span className="text-error">
                                    {getErrorMessage(
                                        props.fieldName,
                                        value,
                                        index,
                                        props.validationResults
                                    )}
                                </span>
                            }
                        />
                    </List.Item>
                )}
            />
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        useCases: useCaseSelector(state),
    };
};

const FormSimpleList = connect(mapStateToProps)(FormSimpleListComponent);

export { FormSimpleList };
