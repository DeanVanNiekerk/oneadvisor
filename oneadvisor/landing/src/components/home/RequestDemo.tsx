import React from "react";
import { ScrollArea } from "react-scroll-to";

const RequestDemo: React.FC = () => {
    return (
        <div className="container section">
            <div className="row">
                <div className="col text-center pb-5">
                    {/* <ScrollArea id="foo"> */}
                    <h2 className="border-bottom border-secondary d-inline border-width-2">DEMO</h2>
                    {/* </ScrollArea> */}
                </div>
            </div>
            <div className="row">
                <div className="col text-center pb-5">
                    <p>
                        If you are interested in <span className="text-secondary">One Advisor</span> please let us know
                        and we will contact you to set up a demo at a convenient time for you
                    </p>
                </div>
            </div>

            <div className="row justify-content-md-center">
                <div className="col-md-7 pb-5">
                    <div className="input-group input-group-lg">
                        <input type="text" className="form-control" placeholder="Enter your email" />
                        <div className="input-group-append">
                            <button className="btn btn-secondary" type="button" id="button-addon2">
                                REQUEST DEMO
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestDemo;
