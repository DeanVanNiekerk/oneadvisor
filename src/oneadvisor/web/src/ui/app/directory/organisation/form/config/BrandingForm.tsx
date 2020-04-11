import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { organisationsApi } from "@/config/api/directory";
import { RootState } from "@/state";
import {
    fetchOrganisation,
    getOrganisationLogoFileInfo,
    organisationConfigSelector,
    organisationSelector,
} from "@/state/directory/organisations";
import { getFileAsDataUrl } from "@/state/file";
import { Upload } from "@/ui/controls";
import { showMessage } from "@/ui/feedback/notifcation";

type Props = PropsFromState & PropsFromDispatch;

const BrandingForm: React.FC<Props> = (props) => {
    const [logoDataUrl, setLogoDataUrl] = useState<string>("");

    useEffect(() => {
        getLogoFileInfo();
    }, [props.branding]);

    const getLogoFileInfo = () => {
        if (!props.branding.logoStorageName || !props.organisation || !props.organisation.id)
            return;

        props.getOrganisationLogoFileInfo(props.organisation.id, (fileInfo) => {
            props.getFileAsDataUrl(fileInfo.url, setLogoDataUrl);
        });
    };

    const onUploaded = () => {
        showMessage(
            "success",
            `Logo Successfull ${props.branding.logoStorageName ? "Replaced" : "Uploaded"}`,
            5
        );

        if (props.organisation && props.organisation.id) {
            props.fetchOrganisation(props.organisation.id);
        }
    };

    if (!props.organisation) return <React.Fragment />;

    return (
        <div>
            <div style={{ display: "flex" }}>
                <div style={{ width: 200 }}>
                    <h4>Logo</h4>
                    <Upload
                        listType="text"
                        editUseCase="dir_edit_organisations"
                        action={`${organisationsApi}/${props.organisation.id}/config/logo`}
                        onUploaded={onUploaded}
                        onError={() => showMessage("error", "Error uploading logo", 5)}
                        buttonText={
                            props.branding.logoStorageName ? "Replace Logo" : "Uploaded Logo"
                        }
                    />
                </div>
                <div style={{ flex: 1, alignSelf: "flexEnd", textAlign: "right" }}>
                    <div>{logoDataUrl && <img style={{ maxHeight: 50 }} src={logoDataUrl} />}</div>
                </div>
            </div>
        </div>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        organisation: organisationSelector(state).organisation,
        branding: organisationConfigSelector(state).branding,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        ...bindActionCreators(
            { fetchOrganisation, getOrganisationLogoFileInfo, getFileAsDataUrl },
            dispatch
        ),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BrandingForm);
