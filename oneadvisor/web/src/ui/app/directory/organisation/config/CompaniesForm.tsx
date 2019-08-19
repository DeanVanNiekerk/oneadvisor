import { List, Switch } from "antd";
import React, { Component } from "react";
import { connect } from "react-redux";

import { companiesSelector, Company } from "@/state/app/directory/lookups";
import { RootState } from "@/state/rootReducer";

type Props = {
    companyIds: string[];
    onChange: (companyIds: string[]) => void;
    companies: Company[];
};

class CompaniesForm extends Component<Props> {
    isCompanySelected = (companyId: string) => {
        return this.props.companyIds.some(r => r === companyId);
    };

    toggleCompanyChange = (companyId: string) => {
        let companyIds = [...this.props.companyIds];

        if (this.isCompanySelected(companyId)) companyIds = companyIds.filter(c => c !== companyId);
        else companyIds.push(companyId);

        this.props.onChange(companyIds);
    };

    render() {
        return (
            <List
                bordered={true}
                size="small"
                dataSource={this.props.companies}
                renderItem={(company: Company) => (
                    <List.Item
                        actions={[
                            <Switch
                                checked={this.isCompanySelected(company.id)}
                                size="small"
                                onChange={() => this.toggleCompanyChange(company.id)}
                            />,
                        ]}
                    >
                        {company.name}
                    </List.Item>
                )}
                className="mb-2"
            />
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const companiesState = companiesSelector(state);

    return {
        companies: companiesState.items,
    };
};

export default connect(mapStateToProps)(CompaniesForm);
