import { Big } from "big.js";
Big.strict = true;
export function toBig(val: any): Big.Big | undefined;
export function toBig(val: any, defaultVal: string): Big.Big;
export function toBig(val: any, defaultVal?: string): Big.Big | undefined {
  try {
    const b = new Big(val);
    return b;
  } catch (e) {
    return defaultVal ? new Big(defaultVal) : undefined;
  }
}
