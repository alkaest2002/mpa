export const stateInit = (Alpine, stateFn) => {
  return stateFn().reduce(
    (acc, [key, defaultValue]) => ({
      ...acc,
      ...{ [key]: Alpine.$persist(defaultValue).using(sessionStorage) },
    }),
    {}
  );
};

export const dataToExport = (stateFn) => {
  return stateFn()
    .map(([key, _]) => key)
    .reduce((acc, itr) => ({ ...acc, ...{ [itr]: this[itr] }}), {});
};

export const importData = (dataJSON) => {
  this.wipeOut();
  for (const [key, value] of Object.entries(dataJSON)) {
    this[key] && (this[key] = value);
  }
};

export const wipeOut = (stateFn, omit = []) => {
  stateFn().forEach(([key, defaultValue]) => {
    this[key] = omit.includes(key) ? this[key] : defaultValue;
  });
};
