import React from 'react';
import Loader from './Loader';
import renderer from 'react-test-renderer';

describe('Loader', () => {

    it('renders correctly - with no text', () => {

        const tree = renderer
            .create(<Loader />)
            .toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('renders correctly - with text', () => {

        const tree = renderer
            .create(<Loader text="Custom loader message" />)
            .toJSON();

        expect(tree).toMatchSnapshot();
    });

});