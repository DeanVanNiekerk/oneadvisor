import React, { ComponentType } from 'react';
import { connect } from 'react-redux';

import { hasUseCase } from '@/app/identity';
import { identitySelector } from '@/state/app/directory/identity';
import { RootState } from '@/state/rootReducer';

export const withUseCase = (
    useCase: string,
    WrappedComponent: ComponentType
) => {
    type Props = {
        useCases: string[];
    };

    class WithUseCase extends React.Component<Props> {
        render() {
            const visible = hasUseCase(useCase, this.props.useCases);
            return visible ? <WrappedComponent /> : <></>;
        }
    }

    const mapStateToProps = (state: RootState) => {
        const identityState = identitySelector(state);

        return {
            useCases: identityState.identity
                ? identityState.identity.useCaseIds
                : []
        };
    };

    return connect(mapStateToProps)(WithUseCase);
};
