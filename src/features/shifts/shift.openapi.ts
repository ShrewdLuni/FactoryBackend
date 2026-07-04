import { z } from "zod";
import type { ZodOpenApiPathsObject } from "zod-openapi";
import { ShiftSchema, ShiftStartSchema, ShiftEndSchema } from "./shift.schema";
import { paramsSchema } from "schemas/utils";

const ok = (schema: z.ZodType) => ({
  "200": { description: "OK", content: { "application/json": { schema } } },
});

export const shiftPaths: ZodOpenApiPathsObject = {
  "/shifts": {
    get: {
      tags: ["Shift"],
      operationId: "getAllShifts",
      responses: ok(ShiftSchema.array()),
    },
  },
  "/shifts/{id}": {
    get: {
      tags: ["Shift"],
      operationId: "getShift",
      requestParams: { path: paramsSchema },
      responses: ok(ShiftSchema),
    },
  },
  "/shifts/start": {
    post: {
      tags: ["Shift"],
      operationId: "startShift",
      requestBody: { content: { "application/json": { schema: ShiftStartSchema } } },
      responses: {
        "201": { description: "Created", content: { "application/json": { schema: ShiftSchema } } },
        "409": { description: "Worker already has an open shift" },
      },
    },
  },
  "/shifts/end": {
    post: {
      tags: ["Shift"],
      operationId: "endShift",
      requestBody: { content: { "application/json": { schema: ShiftEndSchema } } },
      responses: {
        "200": { description: "OK", content: { "application/json": { schema: ShiftSchema } } },
        "404": { description: "Worker has no open shift" },
      },
    },
  },
  "/shifts/current/{workerId}": {
    get: {
      tags: ["Shift"],
      operationId: "getCurrentShift",
      requestParams: { path: z.object({ workerId: z.coerce.number() }) },
      responses: {
        "200": { description: "OK", content: { "application/json": { schema: ShiftSchema } } },
        "404": { description: "Worker has no active shift" },
      },
    },
  },
};
