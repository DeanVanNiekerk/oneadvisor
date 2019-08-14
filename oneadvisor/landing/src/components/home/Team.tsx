import React from "react";

import deanVanNiekerk from "../../media/team/dean_van_niekerk.png";
import marcBormann from "../../media/team/marc_bormann.png";

const Team: React.FC = () => {
    return (
        <div className="bg-primary text-light pt-4">
            <div className="container section">
                <div className="row">
                    <div className="col text-center">
                        <h2>TEAM</h2>
                    </div>
                </div>
                <div className="row justify-content-md-center">
                    <div className="col-md-6 text-center pt-1">
                        <p>
                            A <span className="text-secondary">world-class</span> team across many disciplines including
                            financial advise, data analysis and application development.
                        </p>
                    </div>
                </div>

                <div className="row mt-1 justify-content-md-center">
                    <div className="col-md-4 py-md-3 px-md-5">
                        <div className="row">
                            <div className="col">
                                <img alt="Marc Bormann" src={marcBormann} width="100%" className="rounded-lg" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col text-center">
                                <p className="text-secondary font-weight-bold pt-3 mb-0">Marc Bormann</p>
                                <p className="pt-2 small">Design and Marketing</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 py-md-3 px-md-5">
                        <div className="row">
                            <div className="col">
                                <img alt="Dean van Niekerk" src={deanVanNiekerk} width="100%" className="rounded-lg" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col text-center">
                                <p className="text-secondary font-weight-bold pt-3 mb-0">Dean van Niekerk</p>
                                <p className="pt-2 small">Technical Lead</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Team;
