import { List, Switch } from "antd";
import React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { getValidationSubSet } from "@/app/validation";
import { RootState } from "@/state";
import { companiesSelector, Company } from "@/state/directory/lookups";
import {
    modifyOrganisationConfigCompanyIds,
    organisationConfigSelector,
    organisationSelector,
} from "@/state/directory/organisations";
import { FormErrors } from "@/ui/controls";

type Props = PropsFromState & PropsFromDispatch;

const CompaniesForm: React.FC<Props> = ({
    companyIds,
    companies,
    handleChange,
    validationResults,
}) => {
    const isCompanySelected = (companyId: string) => {
        return companyIds.some((r) => r === companyId);
    };

    const toggleCompanyChange = (companyId: string) => {
        let companyIdsModified = [...companyIds];

        if (isCompanySelected(companyId))
            companyIdsModified = companyIds.filter((c) => c !== companyId);
        else companyIdsModified.push(companyId);

        handleChange(companyIdsModified);
    };

    return (
        <>
            <FormErrors validationResults={validationResults} />
            <List
                bordered={true}
                size="small"
                dataSource={companies}
                renderItem={(company: Company) => (
                    <List.Item
                        actions={[
                            <Switch
                                key={"1"}
                                checked={isCompanySelected(company.id)}
                                size="small"
                                onChange={() => toggleCompanyChange(company.id)}
                            />,
                        ]}
                    >
                        {company.name}
                    </List.Item>
                )}
                className="mb-2"
            />
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const organisationState = organisationSelector(state);
    return {
        companyIds: organisationConfigSelector(state).companyIds,
        companies: companiesSelector(state).items,
        validationResults: getValidationSubSet(
            "Config.CompanyIds",
            organisationState.validationResults,
            true,
            true
        ),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        handleChange: (companyIds: string[]) => {
            dispatch(modifyOrganisationConfigCompanyIds(companyIds));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CompaniesForm);
