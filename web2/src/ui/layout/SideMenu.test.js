// @flow

import React from 'react';
import SideMenu from './SideMenu';
import renderer from 'react-test-renderer';
import { MemoryRouter as Router } from 'react-router-dom' 
import configureMockStore from 'redux-mock-store'
import { defaultState as defaultConextState} from 'state/context/reducer'

const mockStore = configureMockStore()

describe('SideMenu', () => {

    it('renders correctly', () => {

        const store = mockStore({
            context: {
                ...defaultConextState
            },
            router: {
                location: {
                    pathname: ""
                }
            }
        })

        const tree = renderer
            .create(<Router><SideMenu store={store} /></Router>)
            .toJSON();

        expect(tree).toMatchSnapshot();
    });

});