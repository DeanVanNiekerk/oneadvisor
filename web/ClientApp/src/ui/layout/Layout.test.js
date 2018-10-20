import React from 'react';
import Layout from './Layout';
import renderer from 'react-test-renderer';
import { MemoryRouter as Router } from 'react-router-dom' 

describe('Layout', () => {

    it('renders correctly', () => {

        const tree = renderer
            .create(<Router><Layout><div>some content here..</div></Layout></Router>)
            .toJSON();

        expect(tree).toMatchSnapshot();
    });

});