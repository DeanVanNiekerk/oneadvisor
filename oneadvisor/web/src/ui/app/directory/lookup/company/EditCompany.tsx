import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import {
    companyIsModifyingSelector, companySelector, confirmCancel, saveCompany
} from "@/state/app/directory/lookups/companies";
import { RootState } from "@/state/rootReducer";
import { EditDrawer } from "@/ui/controls";
import { showConfirm } from "@/ui/feedback/modal/confirm";

import CompanyForm from "./CompanyForm";
import EditCompanyTitle from "./EditCompanyTitle";

type Props = PropsFromState & PropsFromDispatch;

const EditCompany: React.FC<Props> = ({ saveCompany, confirmCancel, visible, updating }) => {

    return (
        <EditDrawer
            title={<EditCompanyTitle />}
            icon="database"
            visible={visible}
            updating={updating}
            noTopPadding={true}
            onClose={confirmCancel}
            onSave={saveCompany}
        >
            <CompanyForm />
        </EditDrawer>
    );
}

type PropsFromState = ReturnType<typeof mapStateToProps>
const mapStateToProps = (state: RootState) => {
    return {
        visible: companyIsModifyingSelector(state),
        updating: companySelector(state).updating,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({
            saveCompany,
            confirmCancel: () => confirmCancel(showConfirm)
        }, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCompany);