import { contactsApi } from '@/config/api/client';

import * as actions from './actions';

describe('contact actions', () => {
    it('should dispatch API when fetchContact is called', () => {
        const expectedAction = {
            type: 'API',
            endpoint: `${contactsApi}/99`,
            dispatchPrefix: 'CONTACTS_CONTACT'
        };

        expect(actions.fetchContact('99')).toEqual(expectedAction);
    });

    it('should dispatch API when updateContact is called', () => {
        const contact = {
            id: '10',
            clientId: '12',
            contactTypeId: '14',
            value: '0825728997'
        };

        const onSuccess = () => {};

        const expectedAction = {
            type: 'API',
            endpoint: `${contactsApi}/10`,
            method: 'POST',
            payload: contact,
            onSuccess: onSuccess,
            dispatchPrefix: 'CONTACTS_CONTACT_EDIT'
        };

        expect(actions.updateContact(contact, onSuccess)).toEqual(
            expectedAction
        );
    });

    it('should dispatch API when deleteContact is called', () => {
        const onSuccess = () => {};

        const expectedAction = {
            type: 'API',
            endpoint: `${contactsApi}/10`,
            method: 'DELETE',
            onSuccess: onSuccess
        };

        expect(actions.deleteContact('10', onSuccess)).toEqual(expectedAction);
    });
});
