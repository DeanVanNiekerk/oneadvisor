import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { ValidationResult } from "@/app/validation/types";
import { RootState } from "@/state";
import { getOrganisations, Organisation } from "@/state/directory/organisations";
import { FormSelect } from "@/ui/controls";

type Props = {
    organisationId: string | null;
    validationResults: ValidationResult[];
    onChange: (organisationId: string) => void;
    readonly?: boolean;
} & PropsFromDispatch;

const OrganisationSelect: React.FC<Props> = (props) => {
    const [organisations, setOrganisations] = useState<Organisation[]>([]);

    useEffect(() => {
        props.getOrganisations({}, (result) => {
            setOrganisations(result.items);
        });
    }, []);

    return (
        <>
            <FormSelect
                layout="horizontal"
                fieldName="organisationId"
                label="Organisation"
                value={props.organisationId || ""}
                onChange={(_fieldName: string, value: string) => {
                    props.onChange(value);
                }}
                validationResults={props.validationResults}
                options={organisations}
                optionsValue="id"
                optionsText="name"
                readonly={props.readonly}
            />
        </>
    );
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        ...bindActionCreators({ getOrganisations }, dispatch),
    };
};

export default connect(null, mapDispatchToProps)(OrganisationSelect);
