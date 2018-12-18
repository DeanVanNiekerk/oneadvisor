import * as actions from './actions';
import { UserInfo } from './types';

describe('auth actions', () => {
    it('should dispatch AUTH_RECIEVE_AUTHENTICATION when recieveAuthentication is called', () => {
        const userInfo: UserInfo = {
            given_name: 'Dean',
            family_name: 'Jonny',
            email: '',
            name: '',
            sub: '1'
        };
        const idToken = '1234134';
        const accessToken = '321312';

        const expectedAction = {
            type: 'AUTH_RECIEVE_AUTHENTICATION',
            payload: {
                userInfo: { ...userInfo },
                idToken: idToken,
                accessToken: accessToken
            }
        };

        expect(
            actions.recieveAuthentication(userInfo, idToken, accessToken)
        ).toEqual(expectedAction);
    });

    it('should dispatch AUTH_RECIEVE_AUTHENTICATION_CLEAR when clearAuthentication is called', () => {
        const expectedAction = {
            type: 'AUTH_RECIEVE_AUTHENTICATION_CLEAR'
        };

        expect(actions.clearAuthentication()).toEqual(expectedAction);
    });
});
