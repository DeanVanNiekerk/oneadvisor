import React, { Component } from "react";
import { Link } from "react-router-dom";

import logoDark from "@/media/logo-dark.svg";
import logoLight from "@/media/logo-light.svg";

type Props = {
    static?: boolean;
};

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
        if (this.props.static) return;

        document.addEventListener("scroll", () => {
            const atTop = window.scrollY === 0;
            this.setState({ atTop });
        });
    }

    render() {
        let navBarDarkClass = "main-navbar-transparent";
        if (this.props.static) navBarDarkClass = "main-navbar-dark";

        const classNames = `navbar fixed-top navbar-expand-lg ${
            this.state.atTop || this.props.static ? navBarDarkClass : "main-navbar-white bg-white"
        }`;
        const logo = this.state.atTop || this.props.static ? logoLight : logoDark;

        return (
            <nav className={classNames}>
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        <img src={logo} height="50px" />
                    </Link>
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
                                <Link className="nav-link" to="/contact-us">
                                    Contact
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="http://docs.oneadvisor.net">
                                    Docs
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/change-log">
                                    Change Log
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Navbar;
