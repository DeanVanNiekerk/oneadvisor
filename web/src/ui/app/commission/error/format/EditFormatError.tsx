import { Icon } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { areEqual } from '@/app/utils';
import { ValidationResult } from '@/app/validation';
import {
    CommissionErrorEdit, CommissionImportData, fetchNextFormatError, formatErrorSelector, receiveFormatError,
    resolveFormatError
} from '@/state/app/commission/errors';
import { RootState } from '@/state/rootReducer';
import { Button, ContentLoader, Drawer, DrawerFooter } from '@/ui/controls';
import { showConfirm } from '@/ui/feedback/modal/confirm';

import FormatErrorForm from './FormatErrorForm';

type Props = {
    statementId: string;
    remainingErrors: number;
    onUpdate: () => void;
    error: CommissionErrorEdit | null;
    errorData: CommissionImportData | null;
    fetching: boolean;
    updating: boolean;
    validationResults: ValidationResult[];
} & DispatchProp;

type State = {
    errorDataEdited: CommissionImportData | null;
};
class EditFormatError extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            errorDataEdited: props.errorData
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.errorData != prevProps.errorData) {
            this.setState({
                errorDataEdited: this.props.errorData
            });
        }
    }

    close = () => {
        this.props.dispatch(receiveFormatError(null));
    };

    confirmCancel = () => {
        if (!areEqual(this.props.errorData, this.state.errorDataEdited))
            return showConfirm({ onOk: this.cancel });

        this.cancel();
    };

    cancel = () => {
        this.close();
    };

    save = () => {
        if (this.props.error === null || this.state.errorDataEdited === null)
            return;

        let error = {
            ...this.props.error,
            data: this.state.errorDataEdited
        };

        this.props.dispatch(
            resolveFormatError(
                this.props.statementId,
                error,
                //on success
                () => {
                    this.props.onUpdate();
                    this.props.dispatch(
                        fetchNextFormatError(this.props.statementId)
                    );
                }
            )
        );
    };

    onChange = (errorData: CommissionImportData) => {
        this.setState({
            errorDataEdited: errorData
        });
    };

    isLoading = () => {
        return this.props.fetching || this.props.updating;
    };

    getTitle = () => {
        if (this.props.fetching) return 'Loading Format Error';

        return `Resolve Format Error - ${this.props.remainingErrors} remaining`;
    };

    render() {
        const { errorData, fetching, validationResults } = this.props;

        return (
            <Drawer
                title={this.getTitle()}
                visible={!!errorData || fetching}
                onClose={this.confirmCancel}
            >
                <ContentLoader isLoading={this.isLoading()}>
                    {errorData && (
                        <FormatErrorForm
                            error={errorData}
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
                        {this.props.remainingErrors > 1 && (
                            <span>
                                {'Save & Resolve Next '}
                                <Icon type="right" />
                            </span>
                        )}
                        {this.props.remainingErrors <= 1 && 'Save'}
                    </Button>
                </DrawerFooter>
            </Drawer>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const formatErrorState = formatErrorSelector(state);

    return {
        error: formatErrorState.commissionError,
        errorData: formatErrorState.commissionErrorData,
        fetching: formatErrorState.fetching,
        updating: formatErrorState.updating,
        validationResults: formatErrorState.validationResults
    };
};

export default connect(mapStateToProps)(EditFormatError);
