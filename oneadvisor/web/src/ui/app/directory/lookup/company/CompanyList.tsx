import React, { useEffect } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { getColumnDefinition } from "@/app/table";
import {
    companiesSelector,
    Company,
    companyVisible,
    fetchCompanies,
    newCompany,
    receiveCompany,
} from "@/state/app/directory/lookups/companies";
import { RootState } from "@/state/rootReducer";
import { Button, getTable, Header, getColumnSearchProps } from "@/ui/controls";

import EditCompany from "./EditCompany";

const Table = getTable<Company>();

const getColumns = () => {
    const getColumn = getColumnDefinition<Company>();
    return [getColumn("name", "Name", {}, getColumnSearchProps("Name"))];
};

type Props = PropsFromState & PropsFromDispatch;

const CompanyList: React.FC<Props> = props => {
    useEffect(() => {
        if (props.companies.length === 0) props.fetchCompanies();
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
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const companiesState = companiesSelector(state);
    return {
        companies: companiesState.items,
        fetching: companiesState.fetching,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        ...bindActionCreators({ fetchCompanies }, dispatch),
        newCompany: () => {
            dispatch(newCompany());
            dispatch(companyVisible(true));
        },
        editCompany: (company: Company) => {
            dispatch(receiveCompany(company));
            dispatch(companyVisible(true));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CompanyList);
