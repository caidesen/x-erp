import { Loaded, SerializeOptions, serialize } from "@mikro-orm/core";

export function getVo<T extends object, Entity extends object = never>(
  entity: Loaded<Entity>,
  options?: SerializeOptions<Loaded<Entity, never>>
): T {
  return serialize(entity, options) as unknown as T;
}
