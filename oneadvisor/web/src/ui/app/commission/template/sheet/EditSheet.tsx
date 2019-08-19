import React, { Component } from "react";

import { Sheet } from "@/state/app/commission/templates";
import { Button, Form, FormField } from "@/ui/controls";

import SheetForm from "./SheetForm";

type Props = {
    onSave: (sheet: Sheet) => void;
    newSheet: () => void;
    cancel: () => void;
    sheet: Sheet | null;
};

class EditSheet extends Component<Props> {
    save = (sheet: Sheet) => {
        this.props.onSave(sheet);
    };

    render() {
        const { sheet } = this.props;

        return (
            <>
                {sheet && <SheetForm sheet={sheet} onSave={this.save} onCancel={this.props.cancel} />}
                {!sheet && (
                    <Form layout="inline">
                        <FormField>
                            <Button icon="plus" type="dashed" onClick={this.props.newSheet} noLeftMargin={true}>
                                Add Sheet
                            </Button>
                        </FormField>
                    </Form>
                )}
            </>
        );
    }
}

export default EditSheet;
