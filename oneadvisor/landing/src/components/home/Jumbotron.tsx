import React from "react";

import backgroundImage from "../../media/background.svg";
import logoLight from "../../media/logo-light.svg";
import macbook from "../../media/macbook_2.png";

const Jumbotron: React.FC = () => {
    return (
        <div
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className="container main">
                <div style={{ marginTop: "100px" }}>
                    <div className="row">
                        <div className="col-md-6">
                            <img alt="One Advisor" src={logoLight} width="100%" style={{ marginLeft: "-15px" }} />
                            <p className="mt-5 text-light lead">
                                Management tools designed for financial advisors, enabling educated business decisions.
                            </p>
                            <p className="mt-5">
                                <a role="button" href="https://app.oneadvisor.net" className="btn btn-secondary mr-3">
                                    Sign In
                                </a>
                                <button type="button" className="btn btn-secondary">
                                    Request Demo
                                </button>
                            </p>
                        </div>
                        <div className="col-md-6">
                            <img src={macbook} width="100%" className="mt-2" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Jumbotron;
