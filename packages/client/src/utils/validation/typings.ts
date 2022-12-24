import { ValidationRulesConfig } from './config';

export type ValidationResponse = Record<string | 'hasErrors', string[] | boolean>;

export type ValidationRules = Record<string, (value: string) => string[]>;
export type ValidationRulesName = keyof typeof ValidationRulesConfig;
