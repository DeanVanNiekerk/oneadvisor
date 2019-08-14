import React from "react";

import clientModel from "../../media/modules/client_module.png";
import commissionModel from "../../media/modules/commission_module.png";
import directoryModel from "../../media/modules/directory_module.png";

const Modules: React.FC = () => {
    return (
        <div className="section">
            <div className="row">
                <div className="col text-center pb-5">
                    <h2 className="border-bottom border-secondary d-inline border-width-2">ONE ADVISOR MODULES</h2>
                </div>
            </div>

            <div className="row justify-content-md-center">
                <div className="col-md-6 text-center">
                    <p>
                        The <span className="text-secondary">One Advisor</span> application currently consists of 3
                        modules, Directory, Client and Commission.
                    </p>
                    <p className="small">As we continue to grow we plan to have modules for each financial sector.</p>
                </div>
            </div>

            <div className="row mt-1 justify-content-md-center">
                <div className="col-md-4 py-md-3 px-md-4">
                    <div className="row">
                        <div className="col">
                            <img alt="Directory" src={directoryModel} width="100%" className="rounded-lg" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col text-center">
                            <p className="text-directory font-weight-bold pt-4 mb-0">DIRECTORY</p>
                            <p className="pt-2 px-5 small">
                                Manager system Users, Organisational Stucture, Roles as well as view Audit Trails.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 py-md-3 px-md-4">
                    <div className="row">
                        <div className="col">
                            <img alt="Client" src={clientModel} width="100%" className="rounded-lg" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col text-center">
                            <p className="text-client font-weight-bold pt-4 mb-0">CLIENT</p>
                            <p className="pt-2 px-5 small">Manage Clients and Policies, Import and Export Data.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 py-md-3 px-md-4">
                    <div className="row">
                        <div className="col">
                            <img alt="Commission" src={commissionModel} width="100%" className="rounded-lg" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col text-center">
                            <p className="text-commission font-weight-bold pt-4 mb-0">COMMISSION</p>
                            <p className="pt-2 px-5 small">
                                Import Commission Statements, set up Commission Split Rules, view Dynamic Informative
                                Reports.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modules;
