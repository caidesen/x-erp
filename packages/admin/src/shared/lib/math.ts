import { Big } from "big.js";

export function toBig(val: any): Big.Big | undefined;
export function toBig(val: any, defaultVal: string): Big.Big;
export function toBig(val: any, defaultVal?: string): Big.Big | undefined {
  try {
    return Big(val);
  } catch (e) {
    return defaultVal ? Big(defaultVal) : undefined;
  }
}
