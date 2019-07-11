import { Icon, List, Popconfirm, Tooltip } from "antd";
import update from "immutability-helper";
import React, { Component } from "react";
import { connect } from "react-redux";

import { hasUseCase } from "@/app/identity";
import { ValidationResult } from "@/app/validation";
import { Identifier } from "@/state/app/commission/templates";
import { useCaseSelector } from "@/state/auth";
import { RootState } from "@/state/rootReducer";
import { Button, Form, FormErrors, FormInput } from "@/ui/controls";

type Props = {
	identifiers: Identifier[];
	validationResults: ValidationResult[];
	onChange: (identifiers: Identifier[]) => void;
	useCases: string[];
};

type State = {
	identifiers: Identifier[];
	hasUseCase: boolean;
};

class GroupIdentifiersForm extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			identifiers: props.identifiers,
			hasUseCase: hasUseCase("com_edit_commission_statement_templates", props.useCases),
		};
	}

	componentDidUpdate(prevProps: Props) {
		if (this.props.identifiers != prevProps.identifiers)
			this.setState({
				identifiers: this.props.identifiers,
			});
	}

	remove = (index: number) => {
		const identifiers = update(this.state.identifiers, { $splice: [[index, 1]] });
		this.setIdentifiersState(identifiers);
	};

	add = () => {
		const identifiers = update(this.state.identifiers, {
			$push: [
				{
					column: "",
					value: "",
				},
			],
		});
		this.setIdentifiersState(identifiers);
	};

	update = (index: number, identifier: Identifier) => {
		const identifiers = update(this.state.identifiers, {
			[index]: {
				$set: identifier,
			},
		});
		this.setIdentifiersState(identifiers);
	};

	onChange = (fieldName: string, value: string, index: number) => {
		const field = {
			...this.state.identifiers[index],
			[fieldName]: value,
		};
		this.update(index, field);
	};

	setIdentifiersState = (identifiers: Identifier[]) => {
		this.setState({
			identifiers: identifiers,
		});
		this.props.onChange(identifiers);
	};

	getActions = (identifier: Identifier, index: number) => {
		if (!this.state.hasUseCase) return [];

		return [
			<Popconfirm
				title="Are you sure remove this identifier?"
				onConfirm={() => this.remove(index)}
				okText="Yes"
				cancelText="No"
			>
				<a href="#">remove</a>
			</Popconfirm>,
		];
	};

	render() {
		const { validationResults } = this.props;
		const { identifiers } = this.state;

		return (
			<>
				<FormErrors validationResults={validationResults} />

				<Button
					icon="plus"
					type="dashed"
					onClick={this.add}
					noLeftMargin={true}
					visible={this.state.hasUseCase}
				>
					{`Add Identifier`}
				</Button>

				<List
					bordered
					className="mt-1"
					dataSource={identifiers}
					renderItem={(identifier: Identifier, index: any) => (
						<List.Item actions={[this.getActions(identifier, index)]}>
							<Form key={index} editUseCase="com_edit_commission_statement_templates" layout="inline">
								<FormInput
									fieldName="column"
									validationFieldName={`[${index}].column`}
									label="Column"
									value={identifier.column}
									onChange={(fieldName: string, value: string) => {
										this.onChange(fieldName, value, index);
									}}
									validationResults={validationResults}
									width="100px"
								/>
								<FormInput
									fieldName="value"
									validationFieldName={`[${index}].value`}
									label="Value"
									value={identifier.value}
									onChange={(fieldName: string, value: string) => {
										this.onChange(fieldName, value, index);
									}}
									validationResults={validationResults}
									width="200px"
									addonAfter={
										<Tooltip title="This is a regular expression used to evaluate the match condition">
											<Icon type="info-circle" />
										</Tooltip>
									}
								/>
							</Form>
						</List.Item>
					)}
				/>
			</>
		);
	}
}

const mapStateToProps = (state: RootState) => {
	return {
		useCases: useCaseSelector(state),
	};
};

export default connect(mapStateToProps)(GroupIdentifiersForm);
