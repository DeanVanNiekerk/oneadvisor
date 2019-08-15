import React, { useEffect, useState } from "react";

import { changeLogsApi } from "@/app/api";
import Navbar from "@/components/layout/Navbar";

import Footer from "../layout/Footer";
import ChangeLog from "./ChangeLog";

const ChangeLogList: React.FC = () => {
    const [changeLogs, setChangeLogs] = useState([]);

    async function fetchChangeLogs() {
        const response = await fetch(changeLogsApi);
        const logs = await response.json();
        setChangeLogs(logs.items);
    }

    useEffect(() => {
        fetchChangeLogs();
    }, []);

    return (
        <>
            <Navbar static={true} />
            <div className="container main">
                <div className="row">
                    <div className="col text-center pb-5">
                        <h2 className="border-bottom border-secondary d-inline border-width-2">CHANGE LOGS</h2>
                    </div>
                </div>

                {changeLogs.map(c => (
                    <ChangeLog changeLog={c} />
                ))}
            </div>
            <Footer />
        </>
    );
};

export default ChangeLogList;
