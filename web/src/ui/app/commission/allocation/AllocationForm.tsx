import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { ValidationResult } from '@/app/validation';
import { AllocationEdit } from '@/state/app/commission/allocations';
import ClientSearch from '@/ui/app/client/client/ClientSearch';
import { Button, ClientName, Drawer, DrawerFooter, Form, FormText } from '@/ui/controls';

type Props = {
    allocation: AllocationEdit;
    validationResults: ValidationResult[];
    onChange: (allocation: AllocationEdit) => void;
} & DispatchProp;

type State = {
    allocation: AllocationEdit;
    searchClientVisible: boolean;
};

class AllocationForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            allocation: props.allocation,
            searchClientVisible: false,
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.allocation != prevProps.allocation) {
            this.setState({
                allocation: this.props.allocation,
            });
        }
    }

    handleChange = (fieldName: string, value: any) => {
        const allocation = {
            ...this.state.allocation,
            [fieldName]: value,
        };
        this.setState({
            allocation: allocation,
        });
        this.props.onChange(allocation);
    };

    selectClient = (clientId: string) => {
        this.handleChange("fromClientId", clientId);
    };

    toggleSearchClientVisible = () => {
        this.setState({
            searchClientVisible: !this.state.searchClientVisible,
        });
    };

    render() {
        const { validationResults } = this.props;
        const { allocation } = this.state;

        return (
            <>
                <Form
                    editUseCase="com_edit_commission_allocations"
                    className="mt-1"
                >
                    <FormText
                        fieldName="clientId"
                        label="From Client"
                        value={
                            allocation.fromClientId ? (
                                <ClientName
                                    clientId={allocation.fromClientId}
                                    className="text-success"
                                />
                            ) : null
                        }
                        emptyValueText={
                            <span className="text-error">Select Client</span>
                        }
                        validationResults={validationResults}
                        extra={
                            <>
                                <Button
                                    size="small"
                                    icon="search"
                                    type={
                                        this.state.allocation.fromClientId
                                            ? "dashed"
                                            : "primary"
                                    }
                                    onClick={this.toggleSearchClientVisible}
                                >
                                    Find Client
                                </Button>
                            </>
                        }
                    />
                </Form>

                <Drawer
                    title="Client Search"
                    visible={this.state.searchClientVisible}
                    onClose={this.toggleSearchClientVisible}
                >
                    <ClientSearch
                        onSelect={(clientId: string) => {
                            this.selectClient(clientId);
                            this.toggleSearchClientVisible();
                        }}
                    />
                    <DrawerFooter>
                        <Button onClick={this.toggleSearchClientVisible}>
                            Close
                        </Button>
                    </DrawerFooter>
                </Drawer>
            </>
        );
    }
}

export default connect()(AllocationForm);
