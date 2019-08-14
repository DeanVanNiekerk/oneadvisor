import React from "react";

import Navbar from "@/components/layout/Navbar";

import Footer from "../layout/Footer";

const ContactUs: React.FC = () => {
    return (
        <>
            <Navbar static={true} />
            <div className="container main">
                <div className="row">
                    <div className="col text-center pb-5">
                        <h2 className="border-bottom border-secondary d-inline border-width-2">CONTACT US</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col text-center">
                        <p>
                            <span className="font-weight-bold text-secondary">Email:</span> support@oneadvisor.net
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ContactUs;
