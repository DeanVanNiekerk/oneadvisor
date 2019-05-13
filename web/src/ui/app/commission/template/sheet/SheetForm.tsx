import React, { Component } from 'react';

import { Sheet } from '@/state/app/commission/templates';
import { Button, Form, FormField, FormInput } from '@/ui/controls';

type Props = {
    sheet: Sheet;
    onSave: (sheet: Sheet) => void;
    onCancel: () => void;
};

type State = {
    sheet: Sheet;
};

class SheetForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            sheet: props.sheet,
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.sheet != prevProps.sheet)
            this.setState({
                sheet: this.props.sheet,
            });
    }

    handleChange = (fieldName: keyof Sheet, value: number) => {
        const sheet = {
            ...this.state.sheet,
            [fieldName]: value,
        };
        this.setState({
            sheet: sheet,
        });
    };

    render() {

        const { sheet } = this.state;

        return (
            <Form className="my-1" layout="inline">
                <FormInput
                    fieldName="position"
                    label="Position"
                    value={sheet.position}
                    onChange={this.handleChange}
                    //validationResults={validationResults}
                    autoFocus={true}
                />
                <FormField className="mr-0">
                    <Button onClick={() => this.props.onCancel()}>
                        Cancel
                    </Button>
                </FormField>
                <FormField>
                    <Button
                        onClick={() => this.props.onSave(this.state.sheet)}
                        type="primary"
                    >
                        Save
                    </Button>
                </FormField>
            </Form>
        );
    }
}

export default SheetForm;
