import { QBFilterQuery } from "@mikro-orm/core";
import _ from "lodash";

class QueryCondBuilder<T> {
  private _cond = {};

  get cond() {
    return this._cond;
  }

  add(options: QBFilterQuery<T>) {
    _.merge(this._cond, options);
    return this;
  }

  if(condition: any, options: QBFilterQuery<T>) {
    if (condition) {
      this.add(options);
    }
    return this;
  }

  eq(key: keyof T, val: any) {
    this.if(!_.isEmpty(val), { [key]: val });
    return this;
  }

  like(key: keyof T, val: any) {
    this.if(!_.isEmpty(val), { [key]: { $like: `%${val}%` } });
    return this;
  }
}

export function queryCondBuilder<T>() {
  return new QueryCondBuilder<T>();
}
