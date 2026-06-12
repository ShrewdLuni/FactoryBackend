import { Repository } from "abstract/repository";
import {
  ProductFromRow,
  type Product,
  type ProductInsert,
  type ProductLookup,
  type ProductRow,
} from "./product.schema";
import { query } from "db";
import { QuantitiesByStatusFromRow, type QuantitiesByStatus } from "schemas/productQuantities";
import z from "zod";

export class ProductRepository extends Repository<Product, ProductRow, ProductLookup, ProductInsert> {
  constructor() {
    super("products", ProductFromRow, {
      name: "name",
      code: "code",
      measureUnit: {
        column: "measure_unit_id",
        extract: (d) => d.measureUnit.id,
      },
      isActive: "is_active",
    });
  }

  async findQuantities(): Promise<QuantitiesByStatus[]> {
    const findQuery = `WITH status_quantities AS (
      SELECT
        bs.id AS status_id,
        bs.label AS status_label,
        bs.sort_order AS status_sort_order,
        bs.is_terminal AS status_is_terminal,
        bs.allows_defect_reporting AS status_allows_defect_reporting,
        bs.is_in_progress AS status_is_in_progress,
        bs.is_finished AS status_is_finished,
        bs.requires_size_input AS status_requires_size_input,
        bs.is_packaging AS status_is_packaging,
        p.id AS product_id,
        p.name AS product_name,
        p.measure_unit_id AS measure_unit_id,
        COALESCE(SUM(b.size), 0) AS quantity,
        COUNT(b.id) AS batch_count
      FROM batch_statuses bs
      CROSS JOIN products p
      LEFT JOIN batches b ON b.product_id = p.id AND b.status_id = bs.id AND b.is_active = TRUE
      WHERE p.is_active = TRUE AND bs.is_active = TRUE
      GROUP BY bs.id, bs.label, bs.sort_order, bs.is_terminal, bs.allows_defect_reporting, bs.is_in_progress, bs.is_finished, bs.requires_size_input, bs.is_packaging, p.id, p.name, p.measure_unit_id
    )
    SELECT
      status_id,
      status_label,
      status_sort_order,
      status_is_terminal,
      status_allows_defect_reporting,
      status_is_in_progress,
      status_is_finished,
      status_requires_size_input,
      status_is_packaging,
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', product_id,
          'name', product_name,
          'measureUnit', JSON_BUILD_OBJECT('id', measure_unit_id),
          'quantity', quantity,
          'batchCount', batch_count
        ) ORDER BY product_name
      ) AS products
    FROM status_quantities
    WHERE quantity > 0
    GROUP BY status_id, status_label, status_sort_order, status_is_terminal, status_allows_defect_reporting, status_is_in_progress, status_is_finished, status_requires_size_input, status_is_packaging
    ORDER BY status_sort_order`;

    const result = await query(findQuery);
    return QuantitiesByStatusFromRow.array().parse(result.rows);
  }
}
