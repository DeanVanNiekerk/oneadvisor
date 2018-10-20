import React from 'react';
import AppRoute from './AppRoute';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store'
import { MemoryRouter as Router } from 'react-router-dom' 


const mockStore = configureMockStore()

describe('AppRoute', () => {

    it('renders correctly', () => {

        const tree = renderer
            .create(<Router><AppRoute /></Router>)
            .toJSON();

        expect(tree).toMatchSnapshot();
    });

});