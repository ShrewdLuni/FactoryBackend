export const FULL_SELECT = `
    SELECT
      bt.id,
      bt.occurred_at,
      bt.batch_id,
      bt.batch_size,
      bt.actor_id,
      actor.full_name              AS actor_name,
      bt.device_id,
      device.name                  AS device_name,
      bt.from_status_id,
      from_status.label            AS from_status_label,
      from_status.sort_order       AS from_status_sort_order,
      from_status.is_terminal      AS from_status_is_terminal,
      from_status.allows_defect_reporting AS from_status_allows_defect_reporting,
      from_status.is_active        AS from_status_is_active,
      from_status.is_in_progress   AS from_status_is_in_progress,
      from_status.is_finished      AS from_status_is_finished,
      from_status.requires_size_input AS from_status_requires_size_input,
      from_status.is_packaging     AS from_status_is_packaging,
      from_status.subtract_defects AS from_status_subtract_defects,
      from_status.is_milestone     AS from_status_is_milestone,
      from_dept.id                 AS from_status_department_id,
      from_dept.label              AS from_status_department_label,
      bt.to_status_id,
      to_status.label               AS to_status_label,
      to_status.sort_order          AS to_status_sort_order,
      to_status.is_terminal         AS to_status_is_terminal,
      to_status.allows_defect_reporting AS to_status_allows_defect_reporting,
      to_status.is_active           AS to_status_is_active,
      to_status.is_in_progress      AS to_status_is_in_progress,
      to_status.is_finished         AS to_status_is_finished,
      to_status.requires_size_input AS to_status_requires_size_input,
      to_status.is_packaging        AS to_status_is_packaging,
      to_status.subtract_defects    AS to_status_subtract_defects,
      to_status.is_milestone        AS to_status_is_milestone,
      to_dept.id                    AS to_status_department_id,
      to_dept.label                 AS to_status_department_label,
      COALESCE(cw.coworkers, '[]'::json)  AS coworkers,
      COALESCE(df.defects, '[]'::json)    AS defects
    FROM batch_transitions bt
    LEFT JOIN users actor            ON actor.id = bt.actor_id
    LEFT JOIN devices device         ON device.id = bt.device_id
    LEFT JOIN batch_statuses from_status ON from_status.id = bt.from_status_id
    LEFT JOIN departments from_dept  ON from_dept.id = from_status.department_id
    LEFT JOIN batch_statuses to_status   ON to_status.id = bt.to_status_id
    LEFT JOIN departments to_dept    ON to_dept.id = to_status.department_id
    LEFT JOIN LATERAL (
      SELECT json_agg(json_build_object('id', u.id, 'full_name', u.full_name)) AS coworkers
      FROM batch_transition_coworkers btc
      JOIN users u ON u.id = btc.worker_id
      WHERE btc.transition_id = bt.id
    ) cw ON true
    LEFT JOIN LATERAL (
      SELECT json_agg(json_build_object(
        'id', d.id,
        'defect_type_id', d.defect_type_id,
        'quantity', d.quantity,
        'transition_id', d.transition_id
      )) AS defects
      FROM defects d
      WHERE d.transition_id = bt.id
    ) df ON true
  `;
