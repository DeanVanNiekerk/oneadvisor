// @flow

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
    text?: string
};

const Loader = ({ text = 'loading...' }: Props) => {
    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-auto text-primary">
                    <h2>
                        <FontAwesomeIcon icon="sync" spin />
                    </h2>
                </div>
            </div>
            <div className="row justify-content-center mt-1">
                <div className="col-auto">{text}</div>
            </div>
        </div>
    );
};

export { Loader };
