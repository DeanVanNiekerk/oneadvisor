import React from "react";

const Team: React.FC = () => {
    return (
        <>
            <div className="row mt-3">
                <div className="col text-center">
                    <h1 className="display-4">Team</h1>
                </div>
            </div>

            <div className="row mt-3">
                <div className="col-md-6">
                    <div className="card" style={{ width: "18rem" }}>
                        <img className="card-img-top" />
                        <div className="card-body">
                            <p className="card-text">
                                Some quick example text to build on the card title and make up the bulk of the card's
                                content.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card" style={{ width: "18rem" }}>
                        <img className="card-img-top" />
                        <div className="card-body">
                            <p className="card-text">
                                Some quick example text to build on the card title and make up the bulk of the card's
                                content.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Team;
