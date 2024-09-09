export const initState = (Alpine, stateFn) => {
  return stateFn().reduce(
    (acc, [key, defaultValue]) => ({
      ...acc,
      ...{ [key]: Alpine.$persist(defaultValue).using(sessionStorage) },
    }),
    {}
  );
};

export function exportState(stateFn) {
  return stateFn()
    .map(([key, _]) => key)
    .reduce((acc, itr) => ({ ...acc, ...{ [itr]: this[itr] }}), {});
};

export function importState(dataJSON) {
  this.wipeState();
  for (const [key, value] of Object.entries(dataJSON)) {
    this[key] && (this[key] = value);
  }
};

export function wipeState(omit, stateFn) {
  stateFn().forEach(([key, defaultValue]) => {
    this[key] = omit.includes(key) ? this[key] : defaultValue;
  });
};
