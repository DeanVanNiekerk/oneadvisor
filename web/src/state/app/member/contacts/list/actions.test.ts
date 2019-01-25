import { contactsApi } from '@/config/api/member';

import * as actions from './actions';

describe('directory: contacts: list actions', () => {
    it('should dispatch API when fetchContacts is called', () => {
        const expectedAction = {
            type: 'API',
            endpoint: `${contactsApi}?filters=memberId%3D132456`,
            dispatchPrefix: 'CONTACTS_LIST'
        };

        expect(actions.fetchContacts({ memberId: ['132456'] })).toEqual(
            expectedAction
        );
    });
});
