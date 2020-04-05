import React, { useEffect } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { getColumnDefinition } from "@/app/table";
import { RootState } from "@/state";
import {
    AdviceScope,
    adviceScopesSelector,
    adviceScopeVisible,
    fetchAdviceScopes,
    newAdviceScope,
    receiveAdviceScope,
} from "@/state/directory/lookups";
import { Button, getColumnSearchProps, getTable, Header } from "@/ui/controls";

import EditAdviceScope from "./EditAdviceScope";

const Table = getTable<AdviceScope>();

type Props = PropsFromState & PropsFromDispatch;

const AdviceScopeList: React.FC<Props> = (props) => {
    useEffect(() => {
        props.fetchAdviceScopes();
    }, []);

    const editAdviceScope = (id: string) => {
        const adviceScope = props.adviceScopes.find((u) => u.id === id);
        if (adviceScope) props.editAdviceScope(adviceScope);
    };

    return (
        <>
            <Header
                iconName="database"
                actions={
                    <Button
                        type="default"
                        iconName="plus"
                        onClick={props.newAdviceScope}
                        disabled={props.fetching}
                    >
                        New Advice Scope
                    </Button>
                }
            >
                Advice Scopes
            </Header>
            <Table
                rowKey="id"
                columns={getColumns()}
                dataSource={props.adviceScopes}
                loading={props.fetching}
                onRowClick={(adviceScope) => editAdviceScope(adviceScope.id)}
            />
            <EditAdviceScope onSaved={props.fetchAdviceScopes} />
        </>
    );
};

const getColumns = () => {
    const getColumn = getColumnDefinition<AdviceScope>();
    return [getColumn("name", "Name", {}, getColumnSearchProps("Name"))];
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const adviceScopesState = adviceScopesSelector(state);
    return {
        adviceScopes: adviceScopesState.items,
        fetching: adviceScopesState.fetching,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        ...bindActionCreators({ fetchAdviceScopes }, dispatch),
        newAdviceScope: () => {
            dispatch(newAdviceScope());
            dispatch(adviceScopeVisible(true));
        },
        editAdviceScope: (adviceScope: AdviceScope) => {
            dispatch(receiveAdviceScope(adviceScope));
            dispatch(adviceScopeVisible(true));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdviceScopeList);
