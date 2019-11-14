import React, { useEffect } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { getColumnDefinition } from "@/app/table";
import { ROLE_SUPER_ADMIN } from "@/config/role";
import {
    fetchOrganisation,
    fetchOrganisations,
    Organisation,
    organisationsSelector,
    organisationVisible,
    receiveOrganisation,
} from "@/state/app/directory/organisations";
import { RootState } from "@/state/rootReducer";
import { Button, getTable, Header } from "@/ui/controls";

import EditOrganisation from "./EditOrganisation";

const Table = getTable<Organisation>();

type Props = PropsFromState & PropsFromDispatch;

const OrganisationList: React.FC<Props> = props => {
    useEffect(() => {
        props.fetchOrganisations();
    }, []);

    return (
        <>
            <Header
                icon="bank"
                actions={
                    <Button
                        type="default"
                        icon="plus"
                        onClick={props.newOrganisation}
                        disabled={props.fetching}
                        requiredUseCase="dir_edit_organisations"
                        requiredRole={ROLE_SUPER_ADMIN}
                    >
                        New Organisation
                    </Button>
                }
            >
                Organisations
            </Header>
            <Table
                rowKey="id"
                columns={getColumns()}
                dataSource={props.organisations}
                loading={props.fetching}
                onRowClick={org => props.editOrganisation(org.id)}
            />
            <EditOrganisation onSaved={props.fetchOrganisations} />
        </>
    );
};

const getColumns = () => {
    const getColumn = getColumnDefinition<Organisation>();
    return [
        getColumn("name", "Name"),
        getColumn("vatRegistered", "VAT Registered", { type: "boolean" }),
        getColumn("vatRegistrationDate", "VAT Registration Date", { type: "date" }),
    ];
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const organisationsState = organisationsSelector(state);
    return {
        organisations: organisationsState.items,
        fetching: organisationsState.fetching,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        ...bindActionCreators({ fetchOrganisations }, dispatch),
        newOrganisation: () => {
            dispatch(
                receiveOrganisation({
                    id: "",
                    name: "",
                    vatRegistered: false,
                    vatRegistrationDate: null,
                    config: {
                        companyIds: [],
                    },
                })
            );
            dispatch(organisationVisible(true));
        },
        editOrganisation: (organisationId: string) => {
            dispatch(fetchOrganisation(organisationId));
            dispatch(organisationVisible(true));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrganisationList);
