import React, { useEffect } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { getColumnDefinition } from "@/app/table";
import { RootState } from "@/state";
import {
    fetchLicenseCategories,
    licenseCategoriesSelector,
    LicenseCategory,
    licenseCategoryVisible,
    newLicenseCategory,
    receiveLicenseCategory,
} from "@/state/directory/lookups";
import { Button, getColumnSearchProps, getTable, Header } from "@/ui/controls";

import EditLicenseCategory from "./EditLicenseCategory";

const Table = getTable<LicenseCategory>();

type Props = PropsFromState & PropsFromDispatch;

const LicenseCategoryList: React.FC<Props> = (props) => {
    useEffect(() => {
        props.fetchLicenseCategories();
    }, []);

    const editLicenseCategory = (id: string) => {
        const licenseCategory = props.licenseCategories.find((u) => u.id === id);
        if (licenseCategory) props.editLicenseCategory(licenseCategory);
    };

    return (
        <>
            <Header
                iconName="database"
                actions={
                    <Button
                        type="default"
                        iconName="plus"
                        onClick={props.newLicenseCategory}
                        disabled={props.fetching}
                    >
                        New License Category
                    </Button>
                }
            >
                License Categories
            </Header>
            <Table
                rowKey="id"
                columns={getColumns()}
                dataSource={props.licenseCategories}
                loading={props.fetching}
                onRowClick={(licenseCategory) => editLicenseCategory(licenseCategory.id)}
            />
            <EditLicenseCategory onSaved={props.fetchLicenseCategories} />
        </>
    );
};

const getColumns = () => {
    const getColumn = getColumnDefinition<LicenseCategory>();
    return [
        getColumn("name", "Name", {}, getColumnSearchProps("Name")),
        getColumn("code", "Code", {}, getColumnSearchProps("Code")),
    ];
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const licenseCategoriesState = licenseCategoriesSelector(state);
    return {
        licenseCategories: licenseCategoriesState.items,
        fetching: licenseCategoriesState.fetching,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        ...bindActionCreators({ fetchLicenseCategories }, dispatch),
        newLicenseCategory: () => {
            dispatch(newLicenseCategory());
            dispatch(licenseCategoryVisible(true));
        },
        editLicenseCategory: (licenseCategory: LicenseCategory) => {
            dispatch(receiveLicenseCategory(licenseCategory));
            dispatch(licenseCategoryVisible(true));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LicenseCategoryList);
