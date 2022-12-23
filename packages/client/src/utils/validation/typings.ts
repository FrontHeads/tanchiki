import { ValidationRulesConfig } from './config';

export type ValidationResponse = Record<string, string[] | boolean>;

export type ValidationRules = Record<string, (value: string) => string[]>;
export type ValidationRulesName = keyof typeof ValidationRulesConfig;
