import React, { useEffect } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { getColumnDefinition } from "@/app/table";
import { RootState } from "@/state";
import {
    AdviceService,
    adviceServicesSelector,
    adviceServiceVisible,
    fetchAdviceServices,
    newAdviceService,
    receiveAdviceService,
} from "@/state/directory/lookups";
import { Button, getColumnSearchProps, getTable, Header } from "@/ui/controls";

import EditAdviceService from "./EditAdviceService";

const Table = getTable<AdviceService>();

type Props = PropsFromState & PropsFromDispatch;

const AdviceServiceList: React.FC<Props> = (props) => {
    useEffect(() => {
        props.fetchAdviceServices();
    }, []);

    const editAdviceService = (id: string) => {
        const adviceService = props.adviceServices.find((u) => u.id === id);
        if (adviceService) props.editAdviceService(adviceService);
    };

    return (
        <>
            <Header
                iconName="database"
                actions={
                    <Button
                        type="default"
                        iconName="plus"
                        onClick={props.newAdviceService}
                        disabled={props.fetching}
                    >
                        New Advice Service
                    </Button>
                }
            >
                Advice Services
            </Header>
            <Table
                rowKey="id"
                columns={getColumns()}
                dataSource={props.adviceServices}
                loading={props.fetching}
                onRowClick={(adviceService) => editAdviceService(adviceService.id)}
            />
            <EditAdviceService onSaved={props.fetchAdviceServices} />
        </>
    );
};

const getColumns = () => {
    const getColumn = getColumnDefinition<AdviceService>();
    return [
        getColumn("displayOrder", "Order"),
        getColumn("name", "Name", {}, getColumnSearchProps("Name")),
    ];
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const adviceServicesState = adviceServicesSelector(state);
    return {
        adviceServices: adviceServicesState.items,
        fetching: adviceServicesState.fetching,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        ...bindActionCreators({ fetchAdviceServices }, dispatch),
        newAdviceService: () => {
            dispatch(newAdviceService());
            dispatch(adviceServiceVisible(true));
        },
        editAdviceService: (adviceService: AdviceService) => {
            dispatch(receiveAdviceService(adviceService));
            dispatch(adviceServiceVisible(true));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdviceServiceList);
