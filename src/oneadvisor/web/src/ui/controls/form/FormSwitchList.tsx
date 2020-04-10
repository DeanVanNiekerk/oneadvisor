import { List, Switch } from "antd";
import React from "react";
import { connect } from "react-redux";

import { hasRole, hasUseCase } from "@/app/identity";
import { RootState } from "@/state";
import { roleSelector, useCaseSelector } from "@/state/auth";

type Props<T, K> = {
    header?: string;
    dataSource: T[];
    selectedIds: K[];
    itemName: (item: T) => React.ReactNode;
    idKey: keyof T;
    editUseCase?: string;
    editRole?: string;
    onChange: (ids: K[]) => void;
    disableToggleAll?: boolean;
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

    const toggleAll = (checked: boolean) => {
        if (!checked) props.onChange([]);
        else {
            //@ts-ignore
            props.onChange(props.dataSource.map((d) => d[props.idKey]));
        }
    };

    const editable = () => {
        if (props.editUseCase) return hasUseCase(props.editUseCase, props.useCases);

        if (props.editRole) return hasRole(props.editRole, props.roles);

        return true;
    };

    const getHeader = () => {
        if (!props.header && props.disableToggleAll) return undefined;

        return (
            <div style={{ display: "flex" }}>
                <div style={{ flex: 1 }}>
                    <h4 className="mb-0">{props.header}</h4>
                </div>
                {!props.disableToggleAll && editable() && (
                    <div style={{ paddingRight: 8 }}>
                        <span className="mr-1">Toggle All </span>
                        <Switch onChange={(checked) => toggleAll(checked)} size="small" />
                    </div>
                )}
            </div>
        );
    };

    return (
        <List
            header={getHeader()}
            bordered={true}
            size="small"
            dataSource={props.dataSource}
            renderItem={(item: T) => (
                <List.Item
                    actions={[
                        <Switch
                            key={"1"}
                            disabled={!editable()}
                            checked={isItemSelected(item)}
                            onChange={() => toggle(item)}
                            size="small"
                        />,
                    ]}
                >
                    {props.itemName(item)}
                </List.Item>
            )}
            className="mb-2"
        />
    );
}

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        roles: roleSelector(state),
        useCases: useCaseSelector(state),
    };
};

function getFormSwitchList<T, K>() {
    return connect(mapStateToProps)(
        FormSwitchList as (props: Props<T, K>) => React.ReactElement<Props<T, K>>
    );
}

export { getFormSwitchList };
