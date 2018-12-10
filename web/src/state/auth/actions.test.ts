import * as actions from './actions';



describe('auth actions', () => {
  
  it('should dispatch AUTH_RECIEVE_AUTHENTICATION when recieveAuthentication is called', () => {

    const userInfo = { firstName: 'Dean', lastName: 'Jonny' };
    const idToken = '1234134';
    const accessToken = '321312'

    const expectedAction = {
        type: "AUTH_RECIEVE_AUTHENTICATION",
        payload: {
            userInfo: {...userInfo},
            idToken: idToken,
            accessToken: accessToken,
        }
    }

    expect(actions.recieveAuthentication(userInfo, idToken, accessToken)).toEqual(expectedAction)

  })

  it('should dispatch AUTH_RECIEVE_AUTHENTICATION_CLEAR when clearAuthentication is called', () => {

    const expectedAction = {
        type: "AUTH_RECIEVE_AUTHENTICATION_CLEAR"
    }

    expect(actions.clearAuthentication()).toEqual(expectedAction)

  })
})