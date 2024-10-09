export default generateReport = ({ testee, session, answers, scores, normsBiblio, template }) => {
  
  const convertToPlaceholders = (obj, rootKey = null) => {
    let placeHolders = [];
    if (typeof obj !== "object") return [rootKey, obj];
    for (const [key, val] of Object.entries(obj)) {
      const newKey = (rootKey && `${rootKey}#${key}`) || key;
      if (typeof val === "object" && !Array.isArray(val)) {
        placeHolders = placeHolders.concat(convertToPlaceholders(val, newKey));
      } else if (Array.isArray(val)) {
        listOfValues = val.length == 0 ? [" "] : val;
        placeHolders = placeHolders
          .concat(listOfValues.map((el, index) => {
            // if el is a number (i.e., likert type items) use it keySuffix
            // otherwise (open answer items) use array index as keySuffix 
            const keySuffix = typeof el === 'number' && !Number.isNaN(el) 
              ? el
              : index;
            return convertToPlaceholders(el, `${newKey}#${keySuffix}`)
          }))
      }  else {
        placeHolders.push([newKey, val]);
      }
    }
    return placeHolders;
  };

  let placeHolders = [
    ...convertToPlaceholders(testee, "testee"),
    ...convertToPlaceholders(session, "session"),
    ...convertToPlaceholders(answers, null),
    ...convertToPlaceholders(scores, null),
    ...convertToPlaceholders(normsBiblio, "biblio")
  ];
  
  let filledTemplate = template;
  
  placeHolders.forEach(([key, val]) => {
    const safeVal = val !== undefined ? val : key;
    filledTemplate = filledTemplate.replaceAll(key, safeVal);
  });

  return filledTemplate;
};
