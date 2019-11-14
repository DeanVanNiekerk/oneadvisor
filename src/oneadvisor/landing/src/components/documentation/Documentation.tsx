import React from "react";

import Navbar from "@/components/layout/Navbar";

import Footer from "../layout/Footer";

const Documentation: React.FC = () => {
    return (
        <>
            <Navbar static={true} />
            <div className="container main">
                <div className="row">
                    <div className="col text-center pb-5">
                        <h2 className="border-bottom border-secondary d-inline border-width-2">DOCUMENTATION</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col text-center">
                        <p>
                            We are hard at work putting together documentation for the{" "}
                            <span className="text-secondary">One Advisor</span> application, watch this space!
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Documentation;
