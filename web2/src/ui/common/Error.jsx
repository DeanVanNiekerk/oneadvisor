import React from 'react'
import PropTypes from 'prop-types';

const Error = ({ text = "An error has occured, please reload the application" }) => {

    return (
        <div className="mt-5 mb-5">
            <div className="row justify-content-center text-danger">
                <h5>{text}</h5>
            </div>
        </div>
    )

}

Error.propTypes = {
    text: PropTypes.string
};

export default Error