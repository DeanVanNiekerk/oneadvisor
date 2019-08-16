import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { Filters, getColumnDefinition, PageOptions, SortOptions } from "@/app/table";
import {
    ChangeLog, changeLogsSelector, fetchChangeLogs, receiveChangeLog, receivePageOptions, receiveSortOptions
} from "@/state/app/directory/changeLogs";
import { RootState } from "@/state/rootReducer";
import { Button, getTable, Header } from "@/ui/controls";

import EditChangeLog from "./EditChangeLog";

const Table = getTable<ChangeLog>();

type Props = {
    changeLogs: ChangeLog[];
    fetching: boolean;
    pageOptions: PageOptions;
    sortOptions: SortOptions;
    totalItems: number;
} & DispatchProp;

class ChangeLogList extends Component<Props> {
    componentDidMount() {
        this.loadChangeLogs();
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.pageOptions != this.props.pageOptions || prevProps.sortOptions != this.props.sortOptions)
            this.loadChangeLogs();
    }

    loadChangeLogs = () => {
        this.props.dispatch(fetchChangeLogs(this.props.pageOptions, this.props.sortOptions));
    };

    editChangeLog = (id: string) => {
        const changeLog = this.props.changeLogs.find(c => c.id === id);
        if (changeLog) this.props.dispatch(receiveChangeLog(changeLog));
    };

    onFormClose = (cancelled: boolean) => {
        if (!cancelled) {
            this.loadChangeLogs();
        }
    };

    newChangeLog = () => {
        const changeLog: ChangeLog = {
            id: "",
            versionNumber: "0.x.0",
            releaseDate: "",
            log: `
#### General
- 🌟 
- 🔥
- 🐞
- 💄
- 📖

[here](http://oneadvisor.net)
            `,
        };
        this.props.dispatch(receiveChangeLog(changeLog));
    };

    getColumns = () => {
        var getColumn = getColumnDefinition<ChangeLog>(true);

        return [
            getColumn("versionNumber", "Version Number"),
            getColumn("releaseDate", "Release Date", { type: "date" }),
        ];
    };

    onTableChange = (pageOptions: PageOptions, sortOptions: SortOptions, filters: Filters) => {
        if (this.props.pageOptions != pageOptions) this.props.dispatch(receivePageOptions(pageOptions));
        if (this.props.sortOptions != sortOptions) this.props.dispatch(receiveSortOptions(sortOptions));
    };

    render() {
        return (
            <>
                <Header
                    className="mb-1"
                    actions={
                        <>
                            <Button
                                type="default"
                                icon="plus"
                                onClick={this.newChangeLog}
                                disabled={this.props.fetching}
                                requiredUseCase="dir_edit_change_logs"
                            >
                                New Change Log
                            </Button>
                        </>
                    }
                    icon={"profile"}
                >
                    Change Logs
                </Header>
                <Table
                    rowKey="id"
                    columns={this.getColumns()}
                    dataSource={this.props.changeLogs}
                    loading={this.props.fetching}
                    onRowClick={changeLog => this.editChangeLog(changeLog.id)}
                    externalDataSource={true}
                    pageOptions={this.props.pageOptions}
                    totalRows={this.props.totalItems}
                    onTableChange={this.onTableChange}
                />
                <EditChangeLog onClose={this.onFormClose} />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const changeLogsState = changeLogsSelector(state);

    return {
        changeLogs: changeLogsState.items,
        fetching: changeLogsState.fetching,
        pageOptions: changeLogsState.pageOptions,
        sortOptions: changeLogsState.sortOptions,
        totalItems: changeLogsState.totalItems,
    };
};

export default connect(mapStateToProps)(ChangeLogList);
