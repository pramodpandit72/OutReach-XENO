// Replaces template variables like {{name}}, {{city}}, {{totalSpend}} with customer data
export const personalizeMessage = (template, customer) => {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const val = customer[key];
    return val !== undefined ? val : match;
  });
};
