export const getAttr = (attributes, name, fallback) =>
  attributes.find(attr => attr.name === name)?.value ?? fallback;
