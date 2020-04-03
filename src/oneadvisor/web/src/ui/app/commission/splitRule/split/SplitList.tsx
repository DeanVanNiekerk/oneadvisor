import { Popconfirm } from "antd";
import update from "immutability-helper";
import React, { Component } from "react";
import { connect } from "react-redux";

import { hasUseCase } from "@/app/identity";
import { getColumnDefinition } from "@/app/table";
import { ValidationResult } from "@/app/validation";
import { useCaseSelector } from "@/state/auth";
import { Split } from "@/state/commission/splitRules";
import { RootState } from "@/state/rootReducer";
import { FormErrors, getTable, StopPropagation, UserName } from "@/ui/controls";

import EditSplit from "./EditSplit";

const Table = getTable<Split>();

type Props = {
    splits: Split[];
    onChange: (splits: Split[]) => void;
    validationResults: ValidationResult[];
    useCases: string[];
};

type State = {
    split: Split | null;
    splitIndex: number | null;
};

class SplitList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            split: null,
            splitIndex: null,
        };
    }

    addSplit = (split: Split) => {
        let splits: Split[] = [];

        if (this.state.splitIndex !== null) {
            splits = update(this.props.splits, {
                [this.state.splitIndex]: {
                    $set: split,
                },
            });
        } else {
            splits = update(this.props.splits, {
                $push: [split],
            });
        }

        this.props.onChange(splits);
        this.cancelEditSplit();
    };

    newSplit = () => {
        const sum = this.props.splits.reduce((p, c) => c.percentage + p, 0);

        const split: Split = {
            userId: "",
            percentage: 100 - Math.min(sum, 100),
        };

        this.setState({
            split: split,
            splitIndex: null,
        });
    };

    editSplit = (index: number) => {
        this.setState({
            split: { ...this.props.splits[index] },
            splitIndex: index,
        });
    };

    cancelEditSplit = () => {
        this.setState({
            split: null,
            splitIndex: null,
        });
    };

    deleteSplit = (index: number) => {
        const splits = update(this.props.splits, { $splice: [[index, 1]] });
        this.props.onChange(splits);
    };

    getColumns = () => {
        const getColumn = getColumnDefinition<Split>();
        const columns = [
            getColumn(
                "userId",
                "User",
                {},
                {
                    render: (userId: string) => {
                        return <UserName userId={userId} />;
                    },
                }
            ),
            getColumn(
                "percentage",
                "Percentage",
                {},
                {
                    render: (percentage: number) => {
                        return `${percentage}%`;
                    },
                }
            ),
        ];

        if (hasUseCase("com_edit_commission_split_rules", this.props.useCases)) {
            columns.push(
                getColumn(
                    "userId",
                    "Actions",
                    {},
                    {
                        render: (position: number, record: Split, index: number) => {
                            return (
                                <StopPropagation>
                                    <a
                                        href="#"
                                        className="mr-1"
                                        onClick={() => this.editSplit(index)}
                                    >
                                        Edit
                                    </a>
                                    {this.props.splits.length > 1 && (
                                        <Popconfirm
                                            title="Are you sure remove this split?"
                                            onConfirm={() => this.deleteSplit(index)}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <a href="#">Remove</a>
                                        </Popconfirm>
                                    )}
                                </StopPropagation>
                            );
                        },
                    }
                )
            );
        }

        return columns;
    };

    render() {
        return (
            <>
                <FormErrors validationResults={this.props.validationResults} />

                <EditSplit
                    split={this.state.split}
                    cancel={this.cancelEditSplit}
                    newSplit={this.newSplit}
                    onSave={this.addSplit}
                />

                <Table
                    rowKey="userId"
                    className="mt-1"
                    columns={this.getColumns()}
                    dataSource={this.props.splits}
                    onRowClick={(split, index) => this.editSplit(index)}
                />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        useCases: useCaseSelector(state),
    };
};

export default connect(mapStateToProps)(SplitList);
