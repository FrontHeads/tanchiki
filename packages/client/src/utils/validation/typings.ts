export type ValidationErrorList = Record<string, string[]>;
export type ValidationResponse = { hasErrors: boolean; errors: ValidationErrorList };

export type Validators = Record<string, (value: string) => string[]>;
