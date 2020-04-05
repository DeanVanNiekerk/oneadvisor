import React from "react";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { licenseCategorySelector } from "@/state/directory/lookups";

type Props = PropsFromState;

const EditLicenseCategoryTitle: React.FC<Props> = ({ licenseCategory }) => {
    return (
        <>
            {licenseCategory && licenseCategory.id
                ? `License Category: ${licenseCategory.name}`
                : "New License Category"}
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: RootState) => ({
    licenseCategory: licenseCategorySelector(state).licenseCategory,
});

export default connect(mapStateToProps)(EditLicenseCategoryTitle);
