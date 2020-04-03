import React from "react";

import { Sheet } from "@/state/commission/templates";
import { Button, Form, FormField } from "@/ui/controls";

import SheetForm from "./SheetForm";

type Props = {
    onSave: (sheet: Sheet) => void;
    newSheet: () => void;
    cancel: () => void;
    sheet: Sheet | null;
};

const EditSheet: React.FC<Props> = (props: Props) => {
    const save = (sheet: Sheet) => {
        props.onSave(sheet);
    };

    return (
        <>
            {props.sheet && <SheetForm sheet={props.sheet} onSave={save} onCancel={props.cancel} />}
            {!props.sheet && (
                <Form layout="inline">
                    <FormField>
                        <Button
                            iconName="plus"
                            type="dashed"
                            onClick={props.newSheet}
                            noLeftMargin={true}
                        >
                            Add Sheet
                        </Button>
                    </FormField>
                </Form>
            )}
        </>
    );
};

export default EditSheet;
