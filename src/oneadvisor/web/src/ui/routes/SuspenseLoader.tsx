import React from "react";

import { Loader } from "../controls";
import Layout from "../layout/Layout";

const SuspenseLoader: React.FC = () => {
    return (
        <Layout>
            <Loader className="mt-5" />
        </Layout>
    );
};

export { SuspenseLoader };
