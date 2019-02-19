import { Icon } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { areEqual } from '@/app/utils';
import { ValidationResult } from '@/app/validation';
import {
    CommissionError, fetchNextMappingError, mappingErrorSelector, receiveMappingError, resolveMappingError
} from '@/state/app/commission/errors';
import { RootState } from '@/state/rootReducer';
import { Button, ContentLoader, Drawer, DrawerFooter } from '@/ui/controls';
import { showConfirm } from '@/ui/feedback/modal/confirm';

import MappingErrorForm from './MappingErrorForm';

type Props = {
    statementId: string;
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
            errorEdited: props.error
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.error != prevProps.error) {
            this.setState({
                errorEdited: this.props.error
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

    save = () => {
        if (this.state.errorEdited === null) return;

        this.props.dispatch(
            resolveMappingError(
                this.props.statementId,
                this.state.errorEdited,
                //on success
                () => {
                    this.props.onUpdate();
                    this.props.dispatch(
                        fetchNextMappingError(this.props.statementId)
                    );
                }
            )
        );
    };

    onChange = (error: CommissionError) => {
        this.setState({
            errorEdited: error
        });
    };

    isLoading = () => {
        return this.props.fetching || this.props.updating;
    };

    getTitle = () => {
        if (this.props.fetching) return 'Loading Mapping Error';

        return `Resolve Mapping Error - ${
            this.props.remainingErrors
        } remaining`;
    };

    render() {
        const { error, fetching, validationResults } = this.props;

        return (
            <>
                <Drawer
                    title={this.getTitle()}
                    visible={!!error || fetching}
                    onClose={this.confirmCancel}
                >
                    <ContentLoader isLoading={this.isLoading()}>
                        {error && (
                            <MappingErrorForm
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
        validationResults: mappingErrorState.validationResults
    };
};

export default connect(mapStateToProps)(EditMappingError);
