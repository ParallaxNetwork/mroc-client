import type { AccsRegularParams, AccsDefaultParams } from '@lit-protocol/types';

export declare type IAccessControlConditions = (
  | AccsRegularParams
  | AccsDefaultParams
  | { operator: 'or' }
)[];
