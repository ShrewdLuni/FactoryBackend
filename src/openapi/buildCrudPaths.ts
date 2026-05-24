// openapi/buildCrudPaths.ts
import { z } from "zod";
import type { ZodOpenApiPathsObject } from "zod-openapi";

export function buildCrudPaths(opts: {
  resource: string;
  tag: string;
  entitySchema: z.ZodType;
  insertSchema: z.ZodObject<any>;
}): ZodOpenApiPathsObject {
  const { resource, tag, entitySchema, insertSchema } = opts;
  const idParam = z.object({ id: z.string() });
  const ok = (schema: z.ZodType) => ({
    "200": { description: "OK", content: { "application/json": { schema } } },
  });

  return {
    [`/${resource}`]: {
      get: { tags: [tag], operationId: `list${tag}`, responses: ok(entitySchema.array()) },
      post: {
        tags: [tag], operationId: `create${tag}`,
        requestBody: { content: { "application/json": { schema: insertSchema } } },
        responses: ok(entitySchema),
      },
    },
    [`/${resource}/{id}`]: {
      get: { tags: [tag], operationId: `get${tag}`, requestParams: { path: idParam }, responses: ok(entitySchema) },
      put: {
        tags: [tag], operationId: `update${tag}`, requestParams: { path: idParam },
        requestBody: { content: { "application/json": { schema: insertSchema } } },
        responses: ok(entitySchema),
      },
      patch: {
        tags: [tag], operationId: `patch${tag}`, requestParams: { path: idParam },
        requestBody: { content: { "application/json": { schema: insertSchema.partial() } } },
        responses: ok(entitySchema),
      },
      delete: { tags: [tag], operationId: `delete${tag}`, requestParams: { path: idParam }, responses: ok(entitySchema) },
    },
  };
}
