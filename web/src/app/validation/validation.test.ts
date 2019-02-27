import { ValidationResult } from '@/app/validation';

import { getValidationError, getValidationSubSet, removeValidationError } from './validation';

describe('validation', () => {
    describe('getValidationError', () => {
        it('no errors', () => {
            const fieldName = 'prop1';
            const errors: ValidationResult[] = [];

            expect(getValidationError(fieldName, errors)).toEqual(null);
        });

        it('errors - no fieldname, no result', () => {
            const errors: ValidationResult[] = [
                {
                    propertyName: 'prop2',
                    errorMessage: 'Error 2',
                    severity: 0,
                    errorCode: '',
                    attemptedValue: ''
                }
            ];

            expect(getValidationError('', errors)).toEqual(null);
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

        it('errors - has result', () => {
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

            const actual = getValidationError(fieldName, errors);

            expect(actual).not.toBeNull();

            const message = actual ? actual.errorMessage : '';

            expect(message).toEqual('Error 2');
        });
    });

    describe('removeValidationError', () => {
        it('no errors', () => {
            const fieldName = 'prop1';
            const errors: ValidationResult[] = [];

            expect(removeValidationError(fieldName, errors)).toEqual([]);
        });

        it('errors - no fieldname, all results returned', () => {
            const errors: ValidationResult[] = [
                {
                    propertyName: 'prop2',
                    errorMessage: 'Error 2',
                    severity: 0,
                    errorCode: '',
                    attemptedValue: ''
                }
            ];

            expect(removeValidationError('', errors)).toEqual(errors);
        });

        it('errors - no match, all results returned', () => {
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

            expect(removeValidationError(fieldName, errors)).toEqual(errors);
        });

        it('errors - has matching result, is removed', () => {
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

            const expected = [errors[0], errors[2]];

            expect(removeValidationError(fieldName, errors)).toEqual(expected);
        });
    });

    describe('getValidationSubSet', () => {
        it('no prefix', () => {
            const prefix = '';
            const errors: ValidationResult[] = [
                {
                    propertyName: 'prop2',
                    errorMessage: 'Error 2',
                    severity: 0,
                    errorCode: '',
                    attemptedValue: ''
                }
            ];

            expect(getValidationSubSet(prefix, errors)).toEqual(errors);
        });

        it('has prefix, 2 results returned', () => {
            const prefix = 'obj1.obj2';
            const errors: ValidationResult[] = [
                {
                    propertyName: 'obj1.obj2.prop2',
                    errorMessage: 'Error 1',
                    severity: 0,
                    errorCode: '',
                    attemptedValue: ''
                },
                {
                    propertyName: 'obj2.obj2.prop2',
                    errorMessage: 'Error 2',
                    severity: 0,
                    errorCode: '',
                    attemptedValue: ''
                },
                {
                    propertyName: 'OBJ1.obj2.prop3',
                    errorMessage: 'Error 3',
                    severity: 0,
                    errorCode: '',
                    attemptedValue: ''
                }
            ];

            expect(getValidationSubSet(prefix, errors)).toEqual([
                {
                    propertyName: 'prop2',
                    errorMessage: 'Error 1',
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
            ]);
        });
    });
});
