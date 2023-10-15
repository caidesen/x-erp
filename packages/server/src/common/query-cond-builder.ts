import { QBFilterQuery } from "@mikro-orm/core";
import _ from "lodash";
import { AutoPath } from "@mikro-orm/core/typings";

class QueryCondBuilder<T extends object> {
  private _cond: QBFilterQuery<T> = {};

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

  eq<P extends string>(key: AutoPath<T, P>, val: any) {
    this.if(!_.isEmpty(val), _.set({}, key, val));
    return this;
  }

  like<P extends string>(key: AutoPath<T, P>, val: any) {
    this.if(!_.isEmpty(val), _.set({}, key, { $like: `%${val}%` }));
    return this;
  }
}

export function queryCondBuilder<T extends object>() {
  return new QueryCondBuilder<T>();
}
