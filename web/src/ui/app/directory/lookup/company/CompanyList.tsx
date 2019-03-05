import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { getColumn } from '@/app/table';
import { companiesSelector, Company, fetchCompanies, receiveCompany } from '@/state/app/directory/lookups/companies';
import { RootState } from '@/state/rootReducer';
import { Button, Header, Table } from '@/ui/controls';

import EditCompany from './EditCompany';

type Props = {
    companies: Company[];
    fetching: boolean;
} & DispatchProp;

type State = {
    editVisible: boolean;
};

class CompanyList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            editVisible: false,
        };
    }

    componentDidMount() {
        if (this.props.companies.length === 0) this.loadCompanies();
    }

    loadCompanies = () => {
        this.props.dispatch(fetchCompanies());
    };

    newCompany = () => {
        const company = {
            id: "",
            name: "",
        };
        this.showEditCompany(company);
    };

    editCompany = (id: string) => {
        const company = this.props.companies.find(u => u.id === id);
        if (company) this.showEditCompany(company);
    };

    showEditCompany = (company: Company) => {
        this.props.dispatch(receiveCompany(company));
        this.setState({
            editVisible: true,
        });
    };

    closeEditCompany = (cancelled: boolean) => {
        this.setState({
            editVisible: false,
        });
        if (!cancelled) this.loadCompanies();
    };

    getColumns = () => {
        return [getColumn("name", "Name", { showSearchFilter: true })];
    };

    render() {
        return (
            <>
                <Header
                    icon="copyright"
                    actions={
                        <Button
                            type="default"
                            icon="plus"
                            onClick={this.newCompany}
                            disabled={this.props.fetching}
                            requiredUseCase="dir_edit_lookups"
                        >
                            New Company
                        </Button>
                    }
                >
                    Companies
                </Header>
                <Table
                    rowKey="id"
                    columns={this.getColumns()}
                    dataSource={this.props.companies}
                    loading={this.props.fetching}
                    onRowClick={org => this.editCompany(org.id)}
                />
                <EditCompany
                    visible={this.state.editVisible}
                    onClose={this.closeEditCompany}
                />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const companiesState = companiesSelector(state);

    return {
        companies: companiesState.items,
        fetching: companiesState.fetching,
    };
};

export default connect(mapStateToProps)(CompanyList);
