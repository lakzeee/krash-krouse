import { z } from "zod";

// error message: Invalidate route segment
export const OptionalRouteSegmenetSchema = z.union([
  z.undefined(),
  z.array(z.string()).length(1, {
    message: "Invalid route segment",
  }),
]);

export const RequiredRouteSegmenetSchema = z.array(z.string()).length(1, {
  message: "Invalid route segment",
});
