import React from "react";

import logoLight from "../../media/logo-light.svg";
import macbook from "../../media/macbook.png";

const Jumbotron: React.FC = () => {
    return (
        <div style={{ marginTop: "100px" }}>
            <div className="row">
                <div className="col-md-6">
                    <img src={logoLight} width="100%" style={{ marginLeft: "-15px" }} />
                    <p className="mt-5 text-light lead">
                        Management tools designed for financial advisors, enabling educated business decisions.
                    </p>
                </div>
                <div className="col-md-6">
                    <img src={macbook} width="100%" className="mt-2" />
                </div>
            </div>
        </div>
    );
};

export default Jumbotron;
