import { TypedRoute } from "@nestia/core";

type Input = Parameters<typeof TypedRoute.Post>;
export const API = (...args: Input) => TypedRoute.Post(...args);
