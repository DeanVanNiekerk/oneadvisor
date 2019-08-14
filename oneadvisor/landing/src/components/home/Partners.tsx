import React from "react";

import hvm from "../../media/partners/hvm.png";
import smithAndBormann from "../../media/partners/smith-bormann.png";

const Partners: React.FC = () => {
    return (
        <div className="bg-primary text-light pt-4">
            <div className="container section">
                <div className="row">
                    <div className="col text-center">
                        <h2>PARTNERS</h2>
                    </div>
                </div>
                <div className="row mt-5 justify-content-md-center">
                    <div className="col-auto">
                        <a href="https://hvm.co.za/" target="_blank">
                            <img alt="HVM" src={hvm} height="50px" />
                        </a>
                    </div>
                    <div className="col-auto">
                        <a href="https://smithbormann.co.za/" target="_blank">
                            <img alt="Smith and Bormann" src={smithAndBormann} height="50px" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Partners;
