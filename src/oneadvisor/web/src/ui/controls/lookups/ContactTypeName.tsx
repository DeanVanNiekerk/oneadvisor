import React from "react";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { ContactType, contactTypesSelector } from "@/state/lookups/client";

type Props = {
    contactTypes: ContactType[];
    contactTypeId: string;
};

const ContactTypeNameComponent: React.FC<Props> = (props: Props) => {
    const { contactTypes, contactTypeId } = props;

    const contactType = contactTypes.find((u) => u.id === contactTypeId);

    if (!contactType) return <span />;

    return <span>{contactType.name}</span>;
};

const mapStateToProps = (state: RootState) => {
    const contactTypesState = contactTypesSelector(state);

    return {
        contactTypes: contactTypesState.items,
    };
};

const ContactTypeName = connect(mapStateToProps)(ContactTypeNameComponent);

export { ContactTypeName };
