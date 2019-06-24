import update from 'immutability-helper';
import React, { Component } from 'react';

import { ValidationResult } from '@/app/validation';
import { Company } from '@/state/app/directory/lookups/companies';
import { Form, FormInput, FormSimpleList, TabPane, Tabs } from '@/ui/controls';

type TabKey = "details_tab" | "commission_tab";

type Props = {
    company: Company;
    validationResults: ValidationResult[];
    onChange: (company: Company) => void;
};

type State = {
    company: Company;
    activeTab: TabKey;
};

class CompanyForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            company: props.company,
            activeTab: "details_tab",
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.company != prevProps.company)
            this.setState({
                company: this.props.company,
                activeTab: "details_tab", //Reset the tab
            });
    }

    handleChange = (fieldName: keyof Company, value: string | string[]) => {
        const company = update(this.state.company, { [fieldName]: { $set: value } });
        this.setState({
            company: company,
        });
        this.props.onChange(company);
    };

    onTabChange = (activeTab: TabKey) => {
        this.setState({ activeTab });
    };

    render() {
        const { validationResults } = this.props;
        const { company } = this.state;

        return (
            <Tabs onChange={this.onTabChange} activeKey={this.state.activeTab} sticky={true}>
                <TabPane tab="Details" key="details_tab">
                    <Form editUseCase="dir_edit_lookups">
                        <FormInput
                            fieldName="name"
                            label="Name"
                            value={company.name}
                            onChange={this.handleChange}
                            validationResults={validationResults}
                            autoFocus={true}
                        />
                    </Form>
                </TabPane>
                <TabPane tab="Commission" key="commission_tab">
                    <FormSimpleList
                        editUseCase="dir_edit_lookups"
                        fieldName="commissionPolicyNumberPrefixes"
                        displayName="Policy Number Prefix"
                        values={company.commissionPolicyNumberPrefixes}
                        onChange={(commissionPolicyNumberPrefixes: string[]) =>
                            this.handleChange("commissionPolicyNumberPrefixes", commissionPolicyNumberPrefixes)
                        }
                        validationResults={validationResults}
                    />
                </TabPane>
            </Tabs>
        );
    }
}

export default CompanyForm;
