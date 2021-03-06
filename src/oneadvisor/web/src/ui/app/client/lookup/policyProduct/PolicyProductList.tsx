import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { getColumnDefinition } from "@/app/table";
import { RootState } from "@/state";
import {
    fetchPolicyProducts,
    policyProductsSelector,
    policyProductTypesSelector,
    receivePolicyProduct,
} from "@/state/lookups/client";
import { PolicyProduct, PolicyProductEdit } from "@/state/lookups/client/policyProducts/types";
import { PolicyProductType } from "@/state/lookups/client/policyProductTypes/types";
import { Company, organisationCompaniesSelector } from "@/state/lookups/directory";
import {
    Button,
    CompanyName,
    getColumnSearchProps,
    getTable,
    Header,
    PolicyProductTypeName,
} from "@/ui/controls";

import EditPolicyProduct from "./EditPolicyProduct";

const Table = getTable<PolicyProduct>();

type Props = {
    policyProducts: PolicyProduct[];
    fetching: boolean;
    policyProductTypes: PolicyProductType[];
    companies: Company[];
} & DispatchProp;

type State = {
    editVisible: boolean;
};

class PolicyProductList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            editVisible: false,
        };
    }

    componentDidMount() {
        if (this.props.policyProducts.length === 0) this.loadPolicyProducts();
    }

    loadPolicyProducts = () => {
        this.props.dispatch(fetchPolicyProducts());
    };

    newPolicyProduct = () => {
        const policyProduct: PolicyProductEdit = {
            id: null,
            policyProductTypeId: "",
            companyId: "",
            name: "",
            code: "",
        };
        this.showEditPolicyProduct(policyProduct);
    };

    editPolicyProduct = (id: string) => {
        const policyProduct = this.props.policyProducts.find((u) => u.id === id);
        if (policyProduct) this.showEditPolicyProduct(policyProduct);
    };

    showEditPolicyProduct = (policyProduct: PolicyProductEdit) => {
        this.props.dispatch(receivePolicyProduct(policyProduct));
        this.setState({
            editVisible: true,
        });
    };

    closeEditPolicyProduct = (cancelled: boolean) => {
        this.setState({
            editVisible: false,
        });
        if (!cancelled) this.loadPolicyProducts();
    };

    getColumns = () => {
        const getColumn = getColumnDefinition<PolicyProduct>();

        return [
            getColumn("name", "Name", {}, getColumnSearchProps("Name")),
            getColumn("code", "Code", {}, getColumnSearchProps("Code")),
            getColumn(
                "policyProductTypeId",
                "Product Type",
                {},
                {
                    render: (policyProductTypeId: string) => {
                        return <PolicyProductTypeName policyProductTypeId={policyProductTypeId} />;
                    },
                    filters: this.props.policyProductTypes.map((p) => ({
                        text: p.name,
                        value: p.id,
                    })),
                }
            ),
            getColumn(
                "companyId",
                "Company",
                {},
                {
                    render: (companyId: string) => {
                        return <CompanyName companyId={companyId} />;
                    },
                    filters: this.props.companies.map((c) => ({
                        text: c.name,
                        value: c.id,
                    })),
                }
            ),
        ];
    };

    render() {
        return (
            <>
                <Header
                    iconName="database"
                    actions={
                        <Button
                            type="default"
                            iconName="plus"
                            onClick={this.newPolicyProduct}
                            disabled={this.props.fetching}
                        >
                            New Policy Product
                        </Button>
                    }
                >
                    Policy Products
                </Header>
                <Table
                    rowKey="id"
                    columns={this.getColumns()}
                    dataSource={this.props.policyProducts}
                    loading={this.props.fetching}
                    onRowClick={(p) => this.editPolicyProduct(p.id)}
                />
                <EditPolicyProduct
                    visible={this.state.editVisible}
                    onClose={this.closeEditPolicyProduct}
                />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const policyProductsState = policyProductsSelector(state);
    const policyProductTypesState = policyProductTypesSelector(state);
    const companiesState = organisationCompaniesSelector(state);

    return {
        policyProducts: policyProductsState.items,
        companies: companiesState,
        policyProductTypes: policyProductTypesState.items,
        fetching: policyProductsState.fetching,
    };
};

export default connect(mapStateToProps)(PolicyProductList);
