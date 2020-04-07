import { List, Switch } from "antd";
import React from "react";
import { connect } from "react-redux";

import { hasUseCase } from "@/app/identity";
import { RootState } from "@/state";
import { useCaseSelector } from "@/state/auth";

type Props<T, K> = {
    header?: string;
    dataSource: T[];
    selectedIds: K[];
    titleKey: keyof T;
    idKey: keyof T;
    editUseCase?: string;
    onChange: (ids: K[]) => void;
} & PropsFromState;

function FormSwitchList<T, K>(props: Props<T, K>) {
    const isItemSelected = (item: T) => {
        return props.selectedIds.some((id) => id === (item[props.idKey] as unknown));
    };

    const toggle = (item: T) => {
        let itemsModified = [...props.selectedIds];

        if (isItemSelected(item)) {
            itemsModified = props.selectedIds.filter((id) => id !== (item[props.idKey] as unknown));
        } else {
            //@ts-ignore
            itemsModified.push(item[props.idKey]);
        }

        props.onChange(itemsModified);
    };

    return (
        <List
            header={props.header ? <h4 className="mb-0">{props.header}</h4> : undefined}
            bordered={true}
            size="small"
            dataSource={props.dataSource}
            renderItem={(item: T) => (
                <List.Item
                    actions={[
                        <Switch
                            key={"1"}
                            disabled={
                                !!props.editUseCase &&
                                !hasUseCase(props.editUseCase, props.useCases)
                            }
                            checked={isItemSelected(item)}
                            onChange={() => toggle(item)}
                            size="small"
                        />,
                    ]}
                >
                    {item[props.titleKey]}
                </List.Item>
            )}
            className="mb-2"
        />
    );
}

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        useCases: useCaseSelector(state),
    };
};

function getFormSwitchList<T, K>() {
    return connect(mapStateToProps)(
        FormSwitchList as (props: Props<T, K>) => React.ReactElement<Props<T, K>>
    );
}

export { getFormSwitchList };
