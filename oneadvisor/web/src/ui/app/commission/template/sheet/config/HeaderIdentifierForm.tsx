import update from "immutability-helper";
import React, { Component } from "react";

import { ValidationResult } from "@/app/validation";
import { Identifier } from "@/state/app/commission/templates";
import { Form, FormInput } from "@/ui/controls";

type Props = {
	headerIdentifier: Identifier;
	validationResults: ValidationResult[];
	onChange: (headerIdentifier: Identifier) => void;
};

type State = {
	headerIdentifier: Identifier;
};

class HeaderIdentifierForm extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			headerIdentifier: props.headerIdentifier,
		};
	}

	componentDidUpdate(prevProps: Props) {
		if (this.props.headerIdentifier != prevProps.headerIdentifier)
			this.setState({
				headerIdentifier: this.props.headerIdentifier,
			});
	}

	handleChange = (fieldName: keyof Identifier, value: string) => {
		const headerIdentifier = update(this.state.headerIdentifier, { [fieldName]: { $set: value } });
		this.setState({
			headerIdentifier: headerIdentifier,
		});
		this.props.onChange(headerIdentifier);
	};

	render() {
		const { validationResults } = this.props;
		const { headerIdentifier } = this.state;

		return (
			<Form editUseCase="com_edit_commission_statement_templates">
				<FormInput
					fieldName="column"
					label="Column"
					value={headerIdentifier.column}
					onChange={this.handleChange}
					validationResults={validationResults}
				/>
				<FormInput
					fieldName="value"
					label="Value"
					value={headerIdentifier.value}
					onChange={this.handleChange}
					validationResults={validationResults}
				/>
			</Form>
		);
	}
}

export default HeaderIdentifierForm;
