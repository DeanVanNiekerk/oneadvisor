import update from "immutability-helper";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { RootState } from "@/state";
import {
    AdviceServiceEdit,
    adviceServiceSelector,
    modifyAdviceService,
} from "@/state/directory/lookups";
import { Form, FormInput, FormInputNumber } from "@/ui/controls";

type Props = PropsFromState & PropsFromDispatch;

const AdviceServiceForm: React.FC<Props> = ({ adviceService, validationResults, handleChange }) => {
    if (!adviceService) return <React.Fragment />;

    const onChange = (fieldName: keyof AdviceServiceEdit, value: string | number) => {
        handleChange(adviceService, fieldName, value);
    };

    return (
        <Form>
            <FormInputNumber
                fieldName="displayOrder"
                label="Order"
                value={adviceService.displayOrder}
                onChange={(key: "displayOrder", value) =>
                    onChange(key, value === undefined ? 0 : value)
                }
                min={0}
                validationResults={validationResults}
                autoFocus={true}
            />
            <FormInput
                fieldName="name"
                label="Name"
                value={adviceService.name}
                onChange={onChange}
                validationResults={validationResults}
                autoFocus={true}
            />
        </Form>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const adviceServiceState = adviceServiceSelector(state);
    return {
        adviceService: adviceServiceState.adviceService,
        validationResults: adviceServiceState.validationResults,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        handleChange: (
            adviceService: AdviceServiceEdit,
            fieldName: keyof AdviceServiceEdit,
            value: string | number
        ) => {
            const adviceServiceModified = update(adviceService, {
                [fieldName]: { $set: value },
            });
            dispatch(modifyAdviceService(adviceServiceModified));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdviceServiceForm);
