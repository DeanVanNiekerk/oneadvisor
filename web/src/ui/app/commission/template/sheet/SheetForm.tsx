import React, { Component } from 'react';

import { Sheet } from '@/state/app/commission/templates';
import { Button, Form, FormField, FormInputNumber } from '@/ui/controls';

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
                <FormInputNumber
                    fieldName="position"
                    label="Position"
                    value={sheet.position}
                    onChange={this.handleChange}
                    autoFocus={true}
                    min={1}
                    max={50}
                    step={1}
                    precision={0}
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
