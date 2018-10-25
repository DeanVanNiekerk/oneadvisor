import React from 'react';
import SideMenu from './SideMenu';
import renderer from 'react-test-renderer';
import { MemoryRouter as Router } from 'react-router-dom' 

describe('SideMenu', () => {

    it('renders correctly', () => {

        const tree = renderer
            .create(<Router><SideMenu /></Router>)
            .toJSON();

        expect(tree).toMatchSnapshot();
    });

});