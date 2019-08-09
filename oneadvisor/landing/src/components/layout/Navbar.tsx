import React, { Component } from "react";

import logoDark from "../../media/logo-dark.svg";
import logoLight from "../../media/logo-light.svg";

type Props = {};

type State = {
    atTop: boolean;
};

class Navbar extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            atTop: true,
        };
    }

    componentDidMount() {
        document.addEventListener("scroll", () => {
            const atTop = window.scrollY === 0;
            this.setState({ atTop });
        });
    }

    render() {
        const classNames = `navbar fixed-top navbar-expand-lg navbar-light ${
            this.state.atTop ? "bg-dark" : "bg-light"
        }`;
        const logo = this.state.atTop ? logoLight : logoDark;

        return (
            <nav className={classNames}>
                <div className="container">
                    <a className="navbar-brand" href="#">
                        <img src={logo} height="50px" />
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-toggle="collapse"
                        data-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <a className="nav-link" href="#">
                                    Documentation
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">
                                    Team
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">
                                    Change Log
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Navbar;
