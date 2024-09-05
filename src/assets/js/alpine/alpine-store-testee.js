
export default (Alpine) => ({
  
  bio: Alpine.$persist({
    surname: "Doe",
    name: "Joe",
    placeOfBirth: "New York",
    yearOfBirth: 1971,
    gender: "m",
  }).using(sessionStorage),

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
    this.bio = {
      gender: omit.includes("gender") ? "m" : "",
      name: omit.includes("name") ? "John" : "",
      surname: omit.includes("surname") ? "Doe" : "",
      yearOfBirth: omit.includes("yearOfBirth") ? 1971 : "",
      placeOfBirth: omit.includes("placeOfBirth") ? "New York" : "",
    };
  }
});
