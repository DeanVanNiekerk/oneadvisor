import React from 'react';
import Error from './Error';
import renderer from 'react-test-renderer';

describe('Error', () => {

    it('renders correctly - with no text', () => {

        const tree = renderer
            .create(<Error />)
            .toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('renders correctly - with text', () => {

        const tree = renderer
            .create(<Error text="Custom error message" />)
            .toJSON();

        expect(tree).toMatchSnapshot();
    });

});