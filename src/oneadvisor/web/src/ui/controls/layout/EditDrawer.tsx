import React, { ReactNode } from "react";

import { Button, ContentLoader, Drawer, DrawerFooter } from "@/ui/controls";

type Props = {
    title: string | ReactNode;
    icon?: string | ReactNode;
    noTopPadding?: boolean;
    saveRequiredUseCase?: string;
    visible: boolean;
    updating: boolean;
    onSave: () => void;
    onClose: () => void;
};

const EditDrawer: React.FC<Props> = ({
    title,
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
            icon={icon}
            visible={visible}
            onClose={onClose}
            noTopPadding={noTopPadding}
        >
            <ContentLoader isLoading={updating}>{children}</ContentLoader>
            <DrawerFooter>
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
            </DrawerFooter>
        </Drawer>
    );
};

export { EditDrawer };