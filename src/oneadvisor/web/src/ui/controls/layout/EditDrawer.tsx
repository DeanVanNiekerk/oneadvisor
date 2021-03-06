import React, { ReactNode } from "react";

import { IconName } from "@/app/types";
import { Button, ContentLoader, Drawer } from "@/ui/controls";

type Props = {
    title: string | ReactNode;
    iconName?: IconName;
    icon?: ReactNode;
    noTopPadding?: boolean;
    saveRequiredUseCase?: string;
    visible: boolean;
    updating: boolean;
    onSave: () => void;
    onClose: () => void;
};

const EditDrawer: React.FC<Props> = ({
    title,
    iconName,
    icon,
    visible,
    updating,
    onSave,
    noTopPadding,
    saveRequiredUseCase,
    onClose,
    children,
}) => {
    return (
        <Drawer
            title={title}
            iconName={iconName}
            icon={icon}
            visible={visible}
            onClose={onClose}
            noTopPadding={noTopPadding}
            footer={
                <React.Fragment>
                    <Button onClick={onClose} disabled={updating}>
                        Cancel
                    </Button>
                    <Button
                        onClick={onSave}
                        type="primary"
                        disabled={updating}
                        requiredUseCase={saveRequiredUseCase}
                    >
                        Save
                    </Button>
                </React.Fragment>
            }
        >
            <ContentLoader isLoading={updating}>{children}</ContentLoader>
        </Drawer>
    );
};

export { EditDrawer };
