import { initState, exportState, importState, wipeState } from "./useAlpine";

const stateFn = () => [
  [ "bio", {
    surname: "Doe",
    name: "John",
    placeOfBirth: "New York",
    yearOfBirth: 1971,
    gender: "m"
  }]
];

export default (Alpine) => ({
  
  ...initState(stateFn, Alpine),

  get testeeDataIsSet() {
    return Object.values({ ... this.bio }).every(Boolean);
  },

  get testeeGender() {
    return this.bio.gender;
  },

  get isMale() {
    return this.bio.gender == "m";
  },

  get isFemale() {
    return this.bio.gender == "f";
  },

  get exportState() {
    return exportState.call(this, stateFn, "testee");
  },

  importState(dataJSON) {
    importState.call(this, dataJSON?.testee);
  },

  wipeState(omit = []) {
    wipeState.call(this, stateFn, omit) ;
  }
});
