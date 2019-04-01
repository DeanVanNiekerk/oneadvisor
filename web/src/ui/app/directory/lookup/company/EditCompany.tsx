import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { areEqual } from '@/app/utils';
import { ValidationResult } from '@/app/validation';
import { Company, companySelector, insertCompany, updateCompany } from '@/state/app/directory/lookups/companies';
import { RootState } from '@/state/rootReducer';
import { Button, ContentLoader, Drawer, DrawerFooter } from '@/ui/controls';
import { showConfirm } from '@/ui/feedback/modal/confirm';

import CompanyForm from './CompanyForm';

type Props = {
    visible: boolean;
    onClose: (cancelled: boolean) => void;
    company: Company | null;
    updating: boolean;
    validationResults: ValidationResult[];
} & DispatchProp;

type State = {
    companyEdited: Company | null;
};

class EditCompany extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            companyEdited: props.company,
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.company != prevProps.company)
            this.setState({
                companyEdited: this.props.company,
            });
    }

    close = () => {
        this.props.onClose(false);
    };

    confirmCancel = () => {
        if (!areEqual(this.props.company, this.state.companyEdited))
            return showConfirm({ onOk: this.cancel });

        this.cancel();
    };

    cancel = () => {
        this.props.onClose(true);
    };

    save = () => {
        if (!this.state.companyEdited) {
            this.close();
            return;
        }

        if (this.state.companyEdited.id) {
            this.props.dispatch(
                updateCompany(this.state.companyEdited, this.close)
            );
        } else {
            this.props.dispatch(
                insertCompany(this.state.companyEdited, this.close)
            );
        }
    };

    onChange = (company: Company) => {
        this.setState({
            companyEdited: company,
        });
    };

    isLoading = () => {
        return this.props.updating;
    };

    getTitle = () => {
        const { company } = this.props;

        if (company && company.id) return `Company: ${company.name}`;

        return "New Company";
    };

    render() {
        const { company, validationResults, visible } = this.props;

        return (
            <Drawer
                title={this.getTitle()}
                icon="copyright"
                visible={visible}
                onClose={this.confirmCancel}
                noTopPadding={true}
            >
                <ContentLoader isLoading={this.isLoading()}>
                    {company && (
                        <CompanyForm
                            company={company}
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
                        requiredUseCase="dir_edit_lookups"
                    >
                        Save
                    </Button>
                </DrawerFooter>
            </Drawer>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const companyState = companySelector(state);

    return {
        company: companyState.company,
        updating: companyState.updating,
        validationResults: companyState.validationResults,
    };
};

export default connect(mapStateToProps)(EditCompany);
