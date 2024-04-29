interface Operation {
  hasScope: number;
  operationCode: string;
  operationName: string;
  scopeBy: number;
  scopeType: number;
  sourceIds: string[];
}
interface FunctionItem {
  functionCode: string;
  functionName: string;
  hasScope: number;
  operations: Operation[];
  scopeBy: number;
}

export interface RootState {
  version: string;
}
