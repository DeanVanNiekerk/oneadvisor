import React, { Component } from 'react';
import { connect } from 'react-redux';

import { contactTypesSelector, ContactType } from '@/state/app/directory/lookups';
import { RootState } from '@/state/rootReducer';

type Props = {
    contactTypes: ContactType[];
    contactTypeId: string;
};

class ContactTypeNameComponent extends Component<Props> {
    render() {
        const { contactTypes, contactTypeId } = this.props;

        const contactType = contactTypes.find(u => u.id === contactTypeId);

        if (!contactType) return <span />;

        return <span>{contactType.name}</span>;
    }
}

const mapStateToProps = (state: RootState) => {
    const contactTypesState = contactTypesSelector(state);

    return {
        contactTypes: contactTypesState.items
    };
};

const ContactTypeName = connect(mapStateToProps)(ContactTypeNameComponent);

export { ContactTypeName };
