import React from "react";

import Navbar from "@/components/layout/Navbar";

import Footer from "../layout/Footer";

const ChangeLog: React.FC = () => {
    return (
        <>
            <Navbar static={true} />
            <div className="container main">
                <div className="row">
                    <div className="col text-center pb-5">
                        <h2 className="border-bottom border-secondary d-inline border-width-2">CHANGE LOG</h2>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ChangeLog;
