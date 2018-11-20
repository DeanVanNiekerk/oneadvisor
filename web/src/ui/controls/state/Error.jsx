// @flow

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
    text?: string
};

const Error = ({ text = 'An error has occured, please reload the application' }: Props) => {
    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-auto text-danger">
                    <h2>
                        <FontAwesomeIcon icon="exclamation" />
                    </h2>
                </div>
            </div>
            <div className="row justify-content-center mt-1">
                <div className="col-auto text-danger">{text}</div>
            </div>
        </div>
    );
};

export { Error };

