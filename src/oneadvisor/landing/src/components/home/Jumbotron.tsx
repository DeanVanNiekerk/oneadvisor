import React from "react";
import { Link } from "react-scroll";

import backgroundImage from "../../media/background.svg";
import curve from "../../media/curve.svg";
import logoLight from "../../media/logo-light.svg";
import macbook from "../../media/macbook_2.png";

const Jumbotron: React.FC = () => {
    return (
        <>
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
                                    Management tools designed for financial advisors, enabling informed business
                                    decisions.
                                </p>
                                <p className="mt-5">
                                    <a
                                        role="button"
                                        href="https://app.oneadvisor.net"
                                        className="btn btn-secondary mr-3"
                                    >
                                        SIGN IN
                                    </a>
                                    <Link
                                        to="request-demo-section"
                                        smooth={true}
                                        duration={500}
                                        offset={-120}
                                        role="button"
                                        className="btn btn-secondary clickable text-white"
                                    >
                                        REQUEST DEMO
                                    </Link>
                                </p>
                            </div>
                            <div className="col-md-6">
                                <img src={macbook} width="100%" className="mt-2" />
                            </div>
                        </div>
                    </div>
                </div>
                <img src={curve} width="100%" height="150px" />
            </div>
        </>
    );
};

export default Jumbotron;
