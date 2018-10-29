import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { currentMenuLinkSelector, currentApplicationSelector } from "state/context/selectors";

const Row = styled.div`
    color: #ffffff;
    background-color: ${props => props.application.color};
    height: 2.8rem;
`

const TitleColumn = styled.div`
    
`


class PageHeader extends React.Component {

    render() {

        return (
           <Row application={this.props.application} className="row align-items-center">
                <TitleColumn className="col-auto font-weight-light">
                    <span className="ml-3">{this.props.link.name}</span>
                </TitleColumn>
           </Row>
        );
    }
}

PageHeader.propTypes = {
    link: PropTypes.object.isRequired,
    application: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    link: currentMenuLinkSelector(state),
    application: currentApplicationSelector(state)
})

export default connect(mapStateToProps)(PageHeader)