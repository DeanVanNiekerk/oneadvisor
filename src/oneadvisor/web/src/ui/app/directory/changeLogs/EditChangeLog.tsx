import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { areEqual } from "@/app/utils";
import { ValidationResult } from "@/app/validation";
import {
    ChangeLogEdit,
    changeLogSelector,
    insertChangeLog,
    receiveChangeLog,
    updateChangeLog,
} from "@/state/directory/changeLogs";
import { RootState } from "@/state/rootReducer";
import { Button, ContentLoader, Drawer } from "@/ui/controls";
import { showConfirm } from "@/ui/feedback/modal/confirm";

import ChangeLogForm from "./ChangeLogForm";

type Props = {
    onClose?: (cancelled: boolean) => void;
    changeLog: ChangeLogEdit | null;
    updating: boolean;
    validationResults: ValidationResult[];
} & DispatchProp;

type State = {
    changeLogEdited: ChangeLogEdit | null;
};
class EditChangeLog extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            changeLogEdited: props.changeLog,
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.changeLog != prevProps.changeLog) {
            this.setState({
                changeLogEdited: this.props.changeLog,
            });
        }
    }

    close = (cancelled = false) => {
        this.props.dispatch(receiveChangeLog(null));
        if (this.props.onClose) this.props.onClose(cancelled);
    };

    confirmCancel = () => {
        if (!areEqual(this.props.changeLog, this.state.changeLogEdited))
            return showConfirm({ onOk: this.cancel });

        this.cancel();
    };

    cancel = () => {
        this.close(true);
    };

    save = () => {
        if (!this.state.changeLogEdited) {
            this.close();
            return;
        }

        if (this.state.changeLogEdited.id) {
            this.props.dispatch(updateChangeLog(this.state.changeLogEdited, () => this.close()));
        } else {
            this.props.dispatch(insertChangeLog(this.state.changeLogEdited, () => this.close()));
        }
    };

    onChange = (changeLog: ChangeLogEdit) => {
        this.setState({
            changeLogEdited: changeLog,
        });
    };

    isLoading = () => {
        return this.props.updating;
    };

    getTitle = () => {
        const { changeLog } = this.props;

        if (changeLog && changeLog.id) return `Change Log: ${changeLog.versionNumber}`;

        return "New Change Log";
    };

    render() {
        const { changeLog, validationResults } = this.props;

        return (
            <Drawer
                title={this.getTitle()}
                iconName="file-text"
                visible={!!changeLog}
                onClose={this.confirmCancel}
                footer={
                    <React.Fragment>
                        <Button onClick={this.confirmCancel} disabled={this.isLoading()}>
                            Cancel
                        </Button>
                        <Button onClick={this.save} type="primary" disabled={this.isLoading()}>
                            Save
                        </Button>
                    </React.Fragment>
                }
            >
                <ContentLoader isLoading={this.isLoading()}>
                    {changeLog && (
                        <ChangeLogForm
                            changeLog={changeLog}
                            validationResults={validationResults}
                            onChange={this.onChange}
                        />
                    )}
                </ContentLoader>
            </Drawer>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const changeLogState = changeLogSelector(state);

    return {
        changeLog: changeLogState.changeLog,
        updating: changeLogState.updating,
        validationResults: changeLogState.validationResults,
    };
};

export default connect(mapStateToProps)(EditChangeLog);
