// Builds a Mongoose query object from segment rules
// Rule: { field, operator, value }
// Supported operators: gt, lt, gte, lte, eq, ne, contains, daysBefore
export const buildSegmentQuery = (rules, logic = 'AND') => {
  const conditions = rules.map((rule) => {
    const { field, operator, value } = rule;

    switch (operator) {
      case 'gt':
        return { [field]: { $gt: Number(value) } };
      case 'lt':
        return { [field]: { $lt: Number(value) } };
      case 'gte':
        return { [field]: { $gte: Number(value) } };
      case 'lte':
        return { [field]: { $lte: Number(value) } };
      case 'eq':
        return { [field]: value };
      case 'ne':
        return { [field]: { $ne: value } };
      case 'contains':
        return { [field]: { $regex: value, $options: 'i' } };
      case 'daysBefore': {
        // e.g. "last purchase was more than X days ago"
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - Number(value));
        return { [field]: { $lt: cutoff } };
      }
      case 'daysWithin': {
        // e.g. "last purchase was within X days"
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - Number(value));
        return { [field]: { $gte: cutoff } };
      }
      default:
        return {};
    }
  });

  if (conditions.length === 0) return {};
  return logic === 'OR' ? { $or: conditions } : { $and: conditions };
};
