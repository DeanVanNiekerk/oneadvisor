import React from "react";
import { Link } from "react-router-dom";

import logoLight from "@/media/logo-light.svg";

const Footer: React.FC = () => {
    return (
        <div className="bg-primary text-light pt-4">
            <div className="container section">
                <div className="row">
                    <div className="col-md-4 px-5">
                        <img alt="One Advisor" src={logoLight} width="100%" />
                        <p className="pl-2 mt-3 font-weight-light">
                            Copyright © 2019 One Advisor
                            <br /> All rights reserved.
                        </p>
                    </div>
                    <div className="col-md-3 font-weight-light ">
                        <p className="text-secondary">ONE ADVISOR</p>
                        <p>
                            <Link to="/contact-us" className="text-white small">
                                Contact Us
                            </Link>
                        </p>
                        <p>
                            <Link to="/documentation" className="text-white small">
                                Documentation
                            </Link>
                        </p>
                        <p>
                            <Link to="/change-log" className="text-white small">
                                Change Log
                            </Link>
                        </p>
                    </div>
                    <div className="col-md-3 font-weight-light ">
                        <p className="text-secondary">TECH STACK</p>
                        <p>
                            <a href="https://ant.design/" target="_blank" className="text-white small">
                                Ant Design
                            </a>
                        </p>
                        <p>
                            <a href="https://reactjs.org/" target="_blank" className="text-white small">
                                React
                            </a>
                        </p>
                        <p>
                            <a href="https://www.typescriptlang.org/" target="_blank" className="text-white small">
                                Typescript
                            </a>
                        </p>
                        <p>
                            <a href="https://dotnet.microsoft.com/" target="_blank" className="text-white small">
                                Dotnet Core
                            </a>
                        </p>
                        <p>
                            <a href="https://webpack.js.org/" target="_blank" className="text-white small">
                                Webpack
                            </a>
                        </p>
                        <p>
                            <a href="https://babeljs.io/" target="_blank" className="text-white small">
                                Babel
                            </a>
                        </p>
                        <p>
                            <a href="https://azure.microsoft.com/en-us/" target="_blank" className="text-white small">
                                Azure Dev Ops
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
