import React, { Component } from "react";

import { Split } from "@/state/app/commission/splitRules";
import { Button, Form, FormField } from "@/ui/controls";

import SplitForm from "./SplitForm";

type Props = {
    onSave: (split: Split) => void;
    newSplit: () => void;
    cancel: () => void;
    split: Split | null;
};

class EditSplit extends Component<Props> {
    save = (split: Split) => {
        this.props.onSave(split);
    };

    render() {
        const { split } = this.props;

        return (
            <>
                {split && (
                    <SplitForm split={split} onSave={this.save} onCancel={this.props.cancel} />
                )}
                {!split && (
                    <Form layout="inline">
                        <FormField>
                            <Button
                                iconName="plus"
                                type="dashed"
                                onClick={this.props.newSplit}
                                noLeftMargin={true}
                                requiredUseCase="com_edit_commission_split_rules"
                            >
                                Add Split
                            </Button>
                        </FormField>
                    </Form>
                )}
            </>
        );
    }
}

export default EditSplit;
