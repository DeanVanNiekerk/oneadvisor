import update from "immutability-helper";
import React, { useState } from "react";

import { Sheet } from "@/state/commission/templates";
import { Button, Form, FormField, FormInputNumber } from "@/ui/controls";

type Props = {
    sheet: Sheet;
    onSave: (sheet: Sheet) => void;
    onCancel: () => void;
};

const SheetForm: React.FC<Props> = (props: Props) => {
    const [position, setPosition] = useState<number>(props.sheet.position);

    const save = () => {
        const sheet = update(props.sheet, { position: { $set: position } });
        props.onSave(sheet);
    };

    return (
        <Form className="my-1" layout="inline">
            <FormInputNumber
                fieldName="position"
                label="Position"
                value={position}
                onChange={(_fieldName, value) => setPosition(value || 0)}
                autoFocus={true}
                min={1}
                max={50}
                step={1}
                precision={0}
            />
            <FormField className="mr-0">
                <Button onClick={() => props.onCancel()}>Cancel</Button>
            </FormField>
            <FormField>
                <Button onClick={save} type="primary">
                    Save
                </Button>
            </FormField>
        </Form>
    );
};

export default SheetForm;
