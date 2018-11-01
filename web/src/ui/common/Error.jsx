// @flow

import React from 'react'

type Props = {
  text?: string
};

const Error = ({ text = "An error has occured, please reload the application" }: Props) => {

    return (
        <div className="mt-5 mb-5">
            <div className="row justify-content-center text-danger">
                <h5>{text}</h5>
            </div>
        </div>
    )

}

export default Error