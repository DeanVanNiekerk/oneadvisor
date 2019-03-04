import { Icon } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { areEqual } from '@/app/utils';
import { ValidationResult } from '@/app/validation';
import {
    CommissionError, fetchNextMappingError, mappingErrorSelector, receiveMappingError, resolveMappingError
} from '@/state/app/commission/errors';
import { Statement } from '@/state/app/commission/statements';
import { RootState } from '@/state/rootReducer';
import { Button, ContentLoader, Drawer, DrawerFooter } from '@/ui/controls';
import { showConfirm } from '@/ui/feedback/modal/confirm';

import MappingErrorForm from './MappingErrorForm';

type Props = {
    statement: Statement;
    remainingErrors: number;
    onUpdate: () => void;
    error: CommissionError | null;
    fetching: boolean;
    updating: boolean;
    validationResults: ValidationResult[];
} & DispatchProp;

type State = {
    errorEdited: CommissionError | null;
};
class EditMappingError extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            errorEdited: props.error,
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.error != prevProps.error) {
            this.setState({
                errorEdited: this.props.error,
            });
        }
    }

    close = () => {
        this.props.dispatch(receiveMappingError(null));
    };

    confirmCancel = () => {
        if (!areEqual(this.props.error, this.state.errorEdited))
            return showConfirm({ onOk: this.cancel });

        this.cancel();
    };

    cancel = () => {
        this.close();
    };

    save = (resolveNext: boolean) => {
        if (this.state.errorEdited === null) return;

        this.props.dispatch(
            resolveMappingError(
                this.props.statement.id,
                this.state.errorEdited,
                //on success
                () => {
                    this.props.onUpdate();

                    if (resolveNext) {
                        this.props.dispatch(
                            fetchNextMappingError(this.props.statement.id)
                        );
                    } else {
                        this.close();
                    }
                }
            )
        );
    };

    onChange = (error: CommissionError) => {
        this.setState({
            errorEdited: error,
        });
    };

    isLoading = () => {
        return this.props.fetching || this.props.updating;
    };

    getTitle = () => {
        if (this.props.fetching) return "Loading Mapping Error";

        return `Resolve Mapping Error - ${
            this.props.remainingErrors
        } remaining`;
    };

    canSave = () => {
        if (this.state.errorEdited === null || this.isLoading()) return false;

        return (
            !!this.state.errorEdited.policyId &&
            !!this.state.errorEdited.memberId
        );
    };

    render() {
        const { error, fetching, validationResults, statement } = this.props;

        return (
            <>
                <Drawer
                    title={this.getTitle()}
                    visible={!!error || fetching}
                    onClose={this.confirmCancel}
                    noTopPadding={true}
                    icon="file-exclamation"
                >
                    <ContentLoader isLoading={this.isLoading()}>
                        {error && (
                            <MappingErrorForm
                                statement={statement}
                                error={error}
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
                            onClick={() => this.save(false)}
                            type="primary"
                            disabled={!this.canSave()}
                            requiredUseCase="com_edit_commission_statements"
                        >
                            Save
                        </Button>
                        {this.props.remainingErrors > 1 && (
                            <Button
                                onClick={() => this.save(true)}
                                type="primary"
                                disabled={!this.canSave()}
                                requiredUseCase="com_edit_commission_statements"
                            >
                                <span>
                                    {"Save & Resolve Next "}
                                    <Icon type="right" />
                                </span>
                            </Button>
                        )}
                    </DrawerFooter>
                </Drawer>
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const mappingErrorState = mappingErrorSelector(state);

    return {
        error: mappingErrorState.commissionError,
        fetching: mappingErrorState.fetching,
        updating: mappingErrorState.updating,
        validationResults: mappingErrorState.validationResults,
    };
};

export default connect(mapStateToProps)(EditMappingError);
