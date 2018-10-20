import React from 'react';
import Navigator from './Navigator';
import renderer from 'react-test-renderer';
import { MemoryRouter as Router } from 'react-router-dom' 
import { mount, shallow } from 'enzyme';

describe('Navigator', () => {

    it('renders correctly', () => {

        const tree = renderer
            .create(<Router><Navigator /></Router>)
            .toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('navvar toggles on click', () => {

        const wrapper = mount(<Router><Navigator /></Router>).find(Navigator);
        const instance = wrapper.instance();

        const navbarTogger = wrapper.find(".navbar-toggler");

        //nav is initially closed
        expect(instance.state.isOpen).toBe(false);

        navbarTogger.simulate('click');

        //nav should now be open
        expect(instance.state.isOpen).toBe(true);
    });

});