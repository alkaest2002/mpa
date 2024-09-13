export const initState = (stateFn, Alpine) => {
  return stateFn().reduce(
    (acc, [key, defaultValue]) => ({
      ...acc,
      ...{ [key]: Alpine.$persist(defaultValue).using(sessionStorage) },
    }),
    {}
  );
};

export function exportState(stateFn, rootKey) {
  const data = stateFn()
    .map(([key, _]) => key)
    .reduce((acc, itr) => ({ ...acc, ...{ [itr]: this[itr] }}), {});
  return  { [rootKey]: data }
};

export function importState(dataJSON) {
  this.wipeState();
  for (const [key, value] of Object.entries(dataJSON)) {
    this[key] !== undefined && (this[key] = value);
  }
};

export function wipeState(stateFn, omit) {
  stateFn().forEach(([key, defaultValue]) => {
    this[key] = omit.includes(key) ? this[key] : defaultValue;
  });
};
