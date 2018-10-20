import React from 'react'

const Loader = ({ text = "loading..." }) => {

    return <div className="mt-5 mb-5">
        <div className="row justify-content-center">
            {text}
        </div>
    </div>

}

export default Loader