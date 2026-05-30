import { z } from "zod";
import type { ZodOpenApiPathsObject, ZodOpenApiOperationObject } from "zod-openapi";
import { bulkOperationSchema } from "schemas/utils";

export type CrudOperation =
  | "get"
  | "getAll"
  | "create"
  | "createMany"
  | "update"
  | "updateMany"
  | "patch"
  | "patchMany"
  | "delete"
  | "deleteMany";

const ALL_OPERATIONS: CrudOperation[] = [
  "get",
  "getAll",
  "create",
  "createMany",
  "update",
  "updateMany",
  "patch",
  "patchMany",
  "delete",
  "deleteMany",
];

export function buildCrudPaths(opts: {
  resource: string;
  tag: string;
  pluralTag?: string;
  entitySchema: z.ZodType;
  insertSchema: z.ZodObject<any>;
  updateSchema?: z.ZodObject<any>;
  patchSchema?: z.ZodObject<any>;
  include?: CrudOperation[];
  exclude?: CrudOperation[];
  extra?: ZodOpenApiPathsObject;
}): ZodOpenApiPathsObject {
  const {
    resource,
    tag,
    pluralTag = `${tag}s`,
    entitySchema,
    insertSchema,
    updateSchema = insertSchema,
    patchSchema = insertSchema.partial(),
    include,
    exclude = [],
    extra = {},
  } = opts;

  const active = new Set(include ?? ALL_OPERATIONS.filter((op) => !exclude.includes(op)));

  const idParam = z.object({ id: z.string() });
  const ok = (schema: z.ZodType) => ({
    "200": { description: "OK", content: { "application/json": { schema } } },
  });

  const entries: [CrudOperation, string, string, ZodOpenApiOperationObject][] = [
    [
      "getAll",
      `/${resource}`,
      "get",
      {
        tags: [tag],
        operationId: `getAll${pluralTag}`,
        responses: ok(entitySchema.array()),
      },
    ],
    [
      "create",
      `/${resource}`,
      "post",
      {
        tags: [tag],
        operationId: `create${tag}`,
        requestBody: { content: { "application/json": { schema: insertSchema } } },
        responses: ok(entitySchema),
      },
    ],
    [
      "createMany",
      `/${resource}/bulk`,
      "post",
      {
        tags: [tag],
        operationId: `create${pluralTag}`,
        requestBody: { content: { "application/json": { schema: insertSchema.array().min(1) } } },
        responses: ok(entitySchema.array()),
      },
    ],
    [
      "updateMany",
      `/${resource}/bulk/update`,
      "put",
      {
        tags: [tag],
        operationId: `update${pluralTag}`,
        requestBody: { content: { "application/json": { schema: bulkOperationSchema.merge(updateSchema) } } },
        responses: ok(entitySchema.array()),
      },
    ],
    [
      "patchMany",
      `/${resource}/bulk/patch`,
      "post",
      {
        tags: [tag],
        operationId: `patch${pluralTag}`,
        requestBody: { content: { "application/json": { schema: bulkOperationSchema.merge(patchSchema) } } },
        responses: ok(entitySchema.array()),
      },
    ],
    [
      "deleteMany",
      `/${resource}/bulk/delete`,
      "post",
      {
        tags: [tag],
        operationId: `delete${pluralTag}`,
        requestBody: { content: { "application/json": { schema: bulkOperationSchema } } },
        responses: ok(entitySchema.array()),
      },
    ],
    [
      "get",
      `/${resource}/{id}`,
      "get",
      {
        tags: [tag],
        operationId: `get${tag}`,
        requestParams: { path: idParam },
        responses: ok(entitySchema),
      },
    ],
    [
      "update",
      `/${resource}/{id}`,
      "put",
      {
        tags: [tag],
        operationId: `update${tag}`,
        requestParams: { path: idParam },
        requestBody: { content: { "application/json": { schema: updateSchema } } },
        responses: ok(entitySchema),
      },
    ],
    [
      "patch",
      `/${resource}/{id}`,
      "patch",
      {
        tags: [tag],
        operationId: `patch${tag}`,
        requestParams: { path: idParam },
        requestBody: { content: { "application/json": { schema: patchSchema } } },
        responses: ok(entitySchema),
      },
    ],
    [
      "delete",
      `/${resource}/{id}`,
      "delete",
      {
        tags: [tag],
        operationId: `delete${tag}`,
        requestParams: { path: idParam },
        responses: ok(entitySchema),
      },
    ],
  ];

  const result: ZodOpenApiPathsObject = {};
  for (const [op, path, method, def] of entries) {
    if (!active.has(op)) continue;
    result[path] = { ...(result[path] ?? {}), [method]: def };
  }

  for (const [path, methods] of Object.entries(extra)) {
    result[path] = { ...(result[path] ?? {}), ...methods };
  }

  return result;
}
