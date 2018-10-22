import React from 'react'

const Error = ({ text = "An error has occured, please reload the application" }) => {

    return (
        <div className="mt-5 mb-5">
            <div className="row justify-content-center text-danger">
                <h5>{text}</h5>
            </div>
        </div>
    )

}

export default Error