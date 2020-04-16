import React from "react";

import { Loader } from "../controls/state/Loader";
import Layout from "../layout/Layout";

const SuspenseLoader: React.FC = () => {
    return (
        <Layout>
            <Loader className="mt-5" />
        </Layout>
    );
};

export { SuspenseLoader };
