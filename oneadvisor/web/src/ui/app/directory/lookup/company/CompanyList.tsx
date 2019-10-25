import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { getColumnDefinition } from "@/app/table";
import {
    companiesSelector, Company, fetchCompanies, newCompany, receiveCompany
} from "@/state/app/directory/lookups/companies";
import { RootState } from "@/state/rootReducer";
import { Button, getTable, Header } from "@/ui/controls";

import EditCompany from "./EditCompany";

const Table = getTable<Company>();

const getColumns = () => {
    var getColumn = getColumnDefinition<Company>();
    return [getColumn("name", "Name", { showSearchFilter: true })];
};

type Props = PropsFromState & PropsFromDispatch;

const CompanyList: React.FC<Props> = (props) => {

    useEffect(() => {
        if (props.companies.length === 0)
            props.fetchCompanies();
    }, []);

    const editCompany = (id: string) => {
        const company = props.companies.find(u => u.id === id);
        if (company) props.editCompany(company);
    };

    return (
        <>
            <Header
                icon="database"
                actions={
                    <Button type="default" icon="plus" onClick={props.newCompany} disabled={props.fetching}>
                        New Company
                    </Button>
                }
            >
                Companies
            </Header>
            <Table
                rowKey="id"
                columns={getColumns()}
                dataSource={props.companies}
                loading={props.fetching}
                onRowClick={company => editCompany(company.id)}
            />
            <EditCompany onSaved={props.fetchCompanies} />
        </>
    );
}

type PropsFromState = ReturnType<typeof mapStateToProps>
const mapStateToProps = (state: RootState) => {
    const companiesState = companiesSelector(state);
    return {
        companies: companiesState.items,
        fetching: companiesState.fetching,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ fetchCompanies, newCompany }, dispatch),
        editCompany: (company: Company) => {
            dispatch(receiveCompany(company));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyList);
