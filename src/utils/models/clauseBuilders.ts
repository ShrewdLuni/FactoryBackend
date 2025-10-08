export const buildWhereClause = <T extends Record<string, any>>(identity: Partial<T>, startIndex: number = 1) => {
  const entries = Object.entries(identity).filter(([_, value]) => value != null);
  
  if (entries.length === 0) {
    return { clause: '', values: [] };
  }
  
  const conditions = entries.map(([key], index) => `${key} = $${startIndex + index}`);
  const values = entries.map(([_, value]) => value);
  
  return { clause: `WHERE ${conditions.join(' AND ')}`, values };
};

export const buildSetClause = <T extends Record<string, any>>(update: Partial<T>, startIndex: number = 1) => {
  const entries = Object.entries(update).filter(([_, value]) => value != null);
  
  if (entries.length === 0) {
    return { clause: '', values: [] };
  }
  
  const assignments = entries.map(([key], index) => `${key} = $${startIndex + index}`);
  const values = entries.map(([_, value]) => value);
  
  return { clause: `SET ${assignments.join(', ')}`, values };
};

