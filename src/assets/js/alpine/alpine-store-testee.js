import { initState } from "./useUtilsAlpine";

const stateFn = () => [
  [ "surname", "Doe" ],
  [ "name", "John" ],
  [ "placeOfBirth", "New York" ],
  [ "yearOfBirth", 1971 ],
  [ "gender", "m"]
]

export default (Alpine) => ({
  
  bio: initState(Alpine, stateFn),

  get testeeDataIsSet() {
    return Object.values({ ... this.bio }).every(Boolean);
  },

  get exportState() {
    return { testee: { ...this.bio }};
  },

  importState(dataJSON) {
    this.wipeState();
    const { testee: bio } = dataJSON;
    this.bio = bio;
  },

  wipeState(omit = []) {
    stateFn().forEach(([key, defaultValue]) => {
      this.bio[key] = omit.includes(key) ? this.bio[key] : defaultValue;
    });
  },
});
