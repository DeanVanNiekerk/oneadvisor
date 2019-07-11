import { Card, List, Popconfirm } from "antd";
import update from "immutability-helper";
import React, { Component } from "react";
import { connect } from "react-redux";

import { hasUseCase } from "@/app/identity";
import { getValidationSubSet, ValidationResult } from "@/app/validation";
import {
    CommissionStatementTemplateGroupFieldName, commissionStatementTemplateGroupFieldNamesSelector
} from "@/state/app/commission/lookups";
import { Group, Identifier } from "@/state/app/commission/templates";
import { useCaseSelector } from "@/state/auth";
import { RootState } from "@/state/rootReducer";
import { Button, Form, FormErrors, FormInput, FormSelect } from "@/ui/controls";

import GroupIdentifiersForm from "./GroupIdentifiersForm";

type Props = {
	groups: Group[];
	validationResults: ValidationResult[];
	onChange: (groups: Group[]) => void;
	useCases: string[];
	fieldNames: CommissionStatementTemplateGroupFieldName[];
};

type State = {
	groups: Group[];
	hasUseCase: boolean;
};

class Groups extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			groups: props.groups,
			hasUseCase: hasUseCase("com_edit_commission_statement_templates", props.useCases),
		};
	}

	componentDidUpdate(prevProps: Props) {
		if (this.props.groups != prevProps.groups)
			this.setState({
				groups: this.props.groups,
			});
	}

	remove = (index: number) => {
		const groups = update(this.state.groups, { $splice: [[index, 1]] });
		this.setGroupsState(groups);
	};

	add = () => {
		const group: Group = {
			fieldName: "",
			identifiers: [] as Identifier[],
		};
		const groups = update(this.state.groups, {
			$push: [group],
		});
		this.setGroupsState(groups);
	};

	update = (index: number, group: Group) => {
		const groups = update(this.state.groups, {
			[index]: {
				$set: group,
			},
		});
		this.setGroupsState(groups);
	};

	onChange = (fieldName: string, value: any, index: number) => {
		const group = {
			...this.state.groups[index],
			[fieldName]: value,
		};
		this.update(index, group);
	};

	setGroupsState = (groups: Group[]) => {
		this.setState({
			groups: groups,
		});
		this.props.onChange(groups);
	};

	getActions = (group: Group, index: number) => {
		if (!this.state.hasUseCase) return [];

		return [
			<Popconfirm
				title="Are you sure remove this group?"
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
		const { groups } = this.state;

		console.log(JSON.stringify(validationResults, null, 4));

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
					{`Add Group`}
				</Button>

				{groups.map((group, index) => {
					return (
						<Card
							title={`Group ${index + 1}`}
							size="small"
							extra={this.getActions(group, index)}
							style={{ width: "100%" }}
							className="mt-1"
						>
							<Form
								key={index}
								editUseCase="com_edit_commission_statement_templates"
								layout="inline"
								className="mb-1"
							>
								<FormSelect
									fieldName="fieldName"
									validationFieldName={`[${index}].fieldName`}
									label="Field"
									value={group.fieldName}
									onChange={(fieldName: string, value: string) => {
										this.onChange(fieldName, value, index);
									}}
									validationResults={validationResults}
									options={this.props.fieldNames}
									optionsValue="id"
									optionsText="name"
									width="300px"
								/>
							</Form>

							<GroupIdentifiersForm
								identifiers={group.identifiers}
								validationResults={getValidationSubSet(
									`[${index}].identifiers`,
									validationResults,
									true
								)}
								onChange={(identifiers: Identifier[]) => {
									this.onChange("identifiers", identifiers, index);
								}}
							/>
						</Card>
					);
				})}
			</>
		);
	}
}

const mapStateToProps = (state: RootState) => {
	const fieldNamesState = commissionStatementTemplateGroupFieldNamesSelector(state);

	return {
		fieldNames: fieldNamesState.items,
		useCases: useCaseSelector(state),
	};
};

export default connect(mapStateToProps)(Groups);
