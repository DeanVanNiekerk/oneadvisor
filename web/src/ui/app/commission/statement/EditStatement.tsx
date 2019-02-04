import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { areEqual } from '@/app/utils';
import { ValidationResult } from '@/app/validation';
import {
    insertStatement, receiveStatement, StatementEdit, statementSelector, updateStatement
} from '@/state/app/commission/statements';
import { RootState } from '@/state/rootReducer';
import { Button, ContentLoader, Drawer, DrawerFooter } from '@/ui/controls';
import { showConfirm } from '@/ui/feedback/modal/confirm';

import StatementForm from './StatementForm';

type Props = {
    onClose: (cancelled: boolean) => void;
    statement: StatementEdit | null;
    fetching: boolean;
    updating: boolean;
    validationResults: ValidationResult[];
} & DispatchProp;

type State = {
    statementEdited: StatementEdit | null;
};
class EditStatement extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            statementEdited: props.statement
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.statement != prevProps.statement) {
            this.setState({
                statementEdited: this.props.statement
            });
        }
    }

    close = (cancelled: boolean = false) => {
        this.props.dispatch(receiveStatement(null));
        this.props.onClose(cancelled);
    };

    confirmCancel = () => {
        if (!areEqual(this.props.statement, this.state.statementEdited))
            return showConfirm({ onOk: this.cancel });

        this.cancel();
    };

    cancel = () => {
        this.close(true);
    };

    save = () => {
        if (!this.state.statementEdited) {
            this.close();
            return;
        }

        if (this.state.statementEdited.id) {
            this.props.dispatch(
                updateStatement(this.state.statementEdited, () => this.close())
            );
        } else {
            this.props.dispatch(
                insertStatement(this.state.statementEdited, () => this.close())
            );
        }
    };

    onChange = (statement: StatementEdit) => {
        this.setState({
            statementEdited: statement
        });
    };

    isLoading = () => {
        return this.props.fetching || this.props.updating;
    };

    getTitle = () => {
        if (this.props.fetching) return 'Loading Statement';

        const { statement } = this.props;

        if (statement && statement.id) return `Edit Statement`;

        return 'New Statement';
    };

    render() {
        const { statement, fetching, validationResults } = this.props;

        return (
            <Drawer
                title={this.getTitle()}
                visible={!!statement || fetching}
                onClose={this.confirmCancel}
            >
                <ContentLoader isLoading={this.isLoading()}>
                    {statement && (
                        <StatementForm
                            statement={statement}
                            validationResults={validationResults}
                            onChange={this.onChange}
                        />
                    )}
                </ContentLoader>
                <DrawerFooter>
                    <Button
                        onClick={this.confirmCancel}
                        disabled={this.isLoading()}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={this.save}
                        type="primary"
                        disabled={this.isLoading()}
                        requiredUseCase="com_edit_commission_statements"
                    >
                        Save
                    </Button>
                </DrawerFooter>
            </Drawer>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const statementState = statementSelector(state);

    return {
        statement: statementState.statement,
        fetching: statementState.fetching,
        updating: statementState.updating,
        validationResults: statementState.validationResults
    };
};

export default connect(mapStateToProps)(EditStatement);
