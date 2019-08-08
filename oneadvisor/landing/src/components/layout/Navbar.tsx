import React, { useEffect, useState } from "react";

import logoDark from "../../logo-dark.svg";
import logoLight from "../../logo-light.svg";

const Navbar: React.FC = () => {
    const [scroll, setScroll] = useState(true);

    useEffect(() => {
        document.addEventListener("scroll", () => {
            const scrollCheck = window.scrollY < 100;
            if (scrollCheck !== scroll) {
                setScroll(scrollCheck);
            }
        });
    });

    const classNames = `navbar sticky-top navbar-light ${scroll ? "bg-dark" : "bg-light"}`;
    const logo = scroll ? logoLight : logoDark;

    return (
        <nav className={classNames}>
            <div className="container">
                <a className="navbar-brand" href="#">
                    <img src={logo} height="50px" />
                </a>
            </div>
        </nav>
    );
};

export default Navbar;
