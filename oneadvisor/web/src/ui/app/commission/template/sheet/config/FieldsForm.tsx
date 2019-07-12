import { List, Popconfirm } from "antd";
import update from "immutability-helper";
import React, { Component } from "react";
import { connect } from "react-redux";

import { hasUseCase } from "@/app/identity";
import { ValidationResult } from "@/app/validation";
import {
    CommissionStatementTemplateFieldName, commissionStatementTemplateFieldNamesSelector
} from "@/state/app/commission/lookups";
import { Field } from "@/state/app/commission/templates";
import { useCaseSelector } from "@/state/auth";
import { RootState } from "@/state/rootReducer";
import { Button, Form, FormErrors, FormInput, FormItemIcon, FormSelect, FormSwitch } from "@/ui/controls";

type Props = {
	fields: Field[];
	validationResults: ValidationResult[];
	onChange: (fields: Field[]) => void;
	useCases: string[];
	fieldNames: CommissionStatementTemplateFieldName[];
};

type State = {
	fields: Field[];
	hasUseCase: boolean;
};

class FieldsForm extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			fields: props.fields,
			hasUseCase: hasUseCase("com_edit_commission_statement_templates", props.useCases),
		};
	}

	componentDidUpdate(prevProps: Props) {
		if (this.props.fields != prevProps.fields)
			this.setState({
				fields: this.props.fields,
			});
	}

	remove = (index: number) => {
		const fields = update(this.state.fields, { $splice: [[index, 1]] });
		this.setFieldsState(fields);
	};

	add = () => {
		const fields = update(this.state.fields, {
			$push: [
				{
					name: "",
					column: "",
					absoluteValue: false,
				},
			],
		});
		this.setFieldsState(fields);
	};

	update = (index: number, field: Field) => {
		const fields = update(this.state.fields, {
			[index]: {
				$set: field,
			},
		});
		this.setFieldsState(fields);
	};

	onChange = (fieldName: string, value: string, index: number) => {
		const field = {
			...this.state.fields[index],
			[fieldName]: value,
		};
		this.update(index, field);
	};

	setFieldsState = (fields: Field[]) => {
		this.setState({
			fields: fields,
		});
		this.props.onChange(fields);
	};

	getActions = (field: Field, index: number) => {
		if (!this.state.hasUseCase) return [];

		return [
			<Popconfirm
				title="Are you sure remove this mapping?"
				onConfirm={() => this.remove(index)}
				okText="Yes"
				cancelText="No"
				key="remove-field"
			>
				<a href="#">remove</a>
			</Popconfirm>,
		];
	};

	render() {
		const { validationResults } = this.props;
		const { fields } = this.state;

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
					{`Add Mapping`}
				</Button>

				<List
					bordered
					className="mt-1"
					dataSource={fields}
					renderItem={(field: Field, index: any) => (
						<List.Item actions={[this.getActions(field, index)]}>
							<Form key={index} editUseCase="com_edit_commission_statement_templates" layout="inline">
								<FormInput
									fieldName="column"
									validationFieldName={`[${index}].column`}
									label="Column"
									value={field.column}
									onChange={(fieldName: string, value: string) => {
										this.onChange(fieldName, value, index);
									}}
									validationResults={validationResults}
									width="100px"
								/>
								<FormItemIcon type="arrow-right" />
								<FormSelect
									fieldName="name"
									validationFieldName={`[${index}].name`}
									label="Field"
									value={field.name}
									onChange={(fieldName: string, value: string) => {
										this.onChange(fieldName, value, index);
									}}
									validationResults={validationResults}
									options={this.props.fieldNames}
									optionsValue="id"
									optionsText="name"
									width="300px"
								/>
								<FormSwitch
									fieldName="absoluteValue"
									label="Abs."
									value={field.absoluteValue}
									validationResults={validationResults}
									onChange={(fieldName: string, value: string) => {
										this.onChange(fieldName, value, index);
									}}
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
	const fieldNamesState = commissionStatementTemplateFieldNamesSelector(state);

	return {
		fieldNames: fieldNamesState.items,
		useCases: useCaseSelector(state),
	};
};

export default connect(mapStateToProps)(FieldsForm);
