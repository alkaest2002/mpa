import { stateInit } from "./useUtilsAlpine";

const stateFn = () => [
  [ "surname", "Doe" ],
  [ "name", "John" ],
  [ "placeOfBirth", "New York" ],
  [ "yearOfBirth", 1971 ],
  [ "gender", "m"]
]

export default (Alpine) => ({
  
  bio: stateInit(Alpine, stateFn),

  get testeeDataIsSet() {
    return Object.values({ ... this.bio }).every(Boolean);
  },

  get dataToExport() {
    return { testee: this.bio };
  },

  importData(dataJSON) {
    this.wipeOut();
    const { testee: bio } = dataJSON;
    this.bio = bio;
  },

  wipeOut(omit = []) {
    stateFn().forEach(([key, defaultValue]) => {
      this.bio[key] = omit.includes(key) ? this.bio[key] : defaultValue;
    });
  },
});
