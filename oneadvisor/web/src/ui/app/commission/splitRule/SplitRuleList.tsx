import { Popconfirm } from "antd";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { getColumnDefinition } from "@/app/table";
import {
    deleteSplitRule,
    fetchSplitRule,
    fetchSplitRules,
    receiveSplitRule,
    Split,
    SplitRule,
    splitRulesSelector,
} from "@/state/app/commission/splitRules";
import { RootState } from "@/state/rootReducer";
import { Button, getTable, Header, StopPropagation, getColumnSearchProps } from "@/ui/controls";

import EditSplitRule from "./EditSplitRule";

const Table = getTable<SplitRule>();

type Props = {
    userId: string;
    splitRules: SplitRule[];
    fetching: boolean;
    onSave?: () => void;
} & DispatchProp;

class SplitRuleList extends Component<Props> {
    componentDidMount() {
        this.loadSplitRules();
    }

    loadSplitRules = () => {
        this.props.dispatch(receiveSplitRule(null));
        const filters = {
            userId: [this.props.userId],
        };

        this.props.dispatch(fetchSplitRules(filters));
    };

    onClose = (cancelled: boolean = false) => {
        if (!cancelled) {
            this.loadSplitRules();
            if (this.props.onSave) this.props.onSave();
        }
    };

    newSplitRule = () => {
        this.props.dispatch(
            receiveSplitRule({
                id: "",
                userId: this.props.userId,
                name: "",
                isDefault: false,
                split: [
                    {
                        userId: this.props.userId,
                        percentage: 100,
                    },
                ],
            })
        );
    };

    editSplitRule = (id: string) => {
        this.props.dispatch(fetchSplitRule(id));
    };

    deleteSplitRule = (id: string) => {
        this.props.dispatch(deleteSplitRule(id, this.loadSplitRules));
    };

    getColumns = () => {
        var getColumn = getColumnDefinition<SplitRule>();
        return [
            getColumn("name", "Rule Name", { }, getColumnSearchProps("Rule Name")),
            getColumn(
                "split",
                "Split Count",
                {},
                {
                    render: (split: Split[]) => {
                        return split.length;
                    },
                }
            ),
            getColumn("isDefault", "Default", {
                type: "boolean",
            }),
            getColumn(
                "id",
                "Actions",
                {},
                {
                    render: (id: string) => {
                        return (
                            <StopPropagation>
                                <a href="#" className="mr-1" onClick={() => this.editSplitRule(id)}>
                                    Edit
                                </a>
                                <Popconfirm
                                    title="Are you sure remove this commission split rule?"
                                    onConfirm={() => this.deleteSplitRule(id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <a href="#">Remove</a>
                                </Popconfirm>
                            </StopPropagation>
                        );
                    },
                }
            ),
        ];
    };

    render() {
        return (
            <>
                <Header
                    actions={
                        <>
                            <Button
                                type="default"
                                icon="plus"
                                onClick={this.newSplitRule}
                                disabled={this.props.fetching}
                                requiredUseCase="com_edit_commission_split_rules"
                            >
                                New Commission Split Rule
                            </Button>
                        </>
                    }
                />
                <EditSplitRule onClose={this.onClose} />
                <Table
                    header="Commission Split Rules"
                    rowKey="id"
                    columns={this.getColumns()}
                    dataSource={this.props.splitRules}
                    loading={this.props.fetching}
                    onRowClick={splitRule => this.editSplitRule(splitRule.id)}
                />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const splitRulesState = splitRulesSelector(state);

    return {
        splitRules: splitRulesState.items,
        fetching: splitRulesState.fetching,
    };
};

export default connect(mapStateToProps)(SplitRuleList);
