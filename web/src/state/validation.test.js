// @flow

import type { ValidationResult } from './types';
import { getValidationError } from './validation';

describe('validation', () => {
    describe('getValidationError', () => {
        it('no errors', () => {
            const fieldName = 'prop1';
            const errors: ValidationResult[] = [];

            expect(getValidationError(fieldName, errors)).toEqual(null);
        });

        it('errors - no fieldname, no result', () => {
            const fieldName = 'prop1';
            const errors: ValidationResult[] = [
                {
                    propertyName: 'prop2',
                    errorMessage: 'Error 2',
                    severity: 0,
                    errorCode: '',
                    attemptedValue: ''
                }
            ];

            //$FlowFixMe
            expect(getValidationError(undefined, errors)).toEqual(null);
        });

        it('errors - no result', () => {
            const fieldName = 'prop1';
            const errors: ValidationResult[] = [
                {
                    propertyName: 'prop2',
                    errorMessage: 'Error 2',
                    severity: 0,
                    errorCode: '',
                    attemptedValue: ''
                },
                {
                    propertyName: 'prop3',
                    errorMessage: 'Error 3',
                    severity: 0,
                    errorCode: '',
                    attemptedValue: ''
                }
            ];

            expect(getValidationError(fieldName, errors)).toEqual(null);
        });

        it('errors - no result', () => {
            const fieldName = 'prop2';
            const errors: ValidationResult[] = [
                {
                    propertyName: 'prop1',
                    errorMessage: 'Error 1',
                    severity: 0,
                    errorCode: '',
                    attemptedValue: ''
                },
                {
                    propertyName: 'pROp2', //Must be case insensitive
                    errorMessage: 'Error 2',
                    severity: 0,
                    errorCode: '',
                    attemptedValue: ''
                },
                {
                    propertyName: 'prop3',
                    errorMessage: 'Error 3',
                    severity: 0,
                    errorCode: '',
                    attemptedValue: ''
                }
            ];

            expect(getValidationError(fieldName, errors)).toEqual('Error 2');
        });
    });
});
