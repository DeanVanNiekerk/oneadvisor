import React from "react";
import { Link } from "react-router-dom";

const ChangeLog: React.FC = () => {
    return (
        <div className="container section">
            <div className="row">
                <div className="col text-center pb-5">
                    <h2 className="border-bottom border-secondary d-inline border-width-2">CHANGE LOG</h2>
                </div>
            </div>

            <div className="row">
                <div className="col text-center pb-3">
                    <Link to="/change-log" className="btn btn-small btn-secondary clickable text-white">
                        FULL CHANGE LOG
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ChangeLog;
