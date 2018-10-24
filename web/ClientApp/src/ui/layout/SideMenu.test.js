import React from 'react';
import SideMenu from './SideMenu';
import renderer from 'react-test-renderer';

describe('SideMenu', () => {

    it('renders correctly', () => {

        const tree = renderer
            .create(<SideMenu />)
            .toJSON();

        expect(tree).toMatchSnapshot();
    });

});