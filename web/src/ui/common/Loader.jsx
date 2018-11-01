// @flow

import React from 'react'

type Props = {
  text?: string
};

const Loader = ({ text = "loading..." }: Props) => {

    return (
        <div className="mt-5 mb-5">
            <div className="row justify-content-center">
                {text}
            </div>
        </div>
    )

}

export default Loader