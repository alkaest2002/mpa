export default generateReport = ({ testee, session, answers, scores, normsBiblio, template }) => {
  
  const converToPlaceholders = (obj, rootKey = null) => {
    let placeHolders = [];
    if (typeof obj !== "object") return [rootKey, obj];
    for (const [key, val] of Object.entries(obj)) {
      const newKey = (rootKey && `${rootKey}#${key}`) || key;
      if (typeof val === "object" && !Array.isArray(val)) {
        placeHolders = [
          ...placeHolders,
          ...converToPlaceholders(val, newKey),
        ];
      } else if (Array.isArray(val)) {
        listOfValues = val.length == 0 ? [" "] : val;
        placeHolders = [
          ...placeHolders,
          ...listOfValues.map((el) => converToPlaceholders(el, `${newKey}#${el}`))
        ]
      }  else {
        placeHolders.push([newKey, val]);
      }
    }
    return [...placeHolders];
  };

  let placeHolders = [...[], ...converToPlaceholders(testee, "testee")];
  placeHolders = [...placeHolders, ...converToPlaceholders(session, "testee")];
  placeHolders = [...placeHolders, ...converToPlaceholders(answers, null)];
  placeHolders = [...placeHolders, ...converToPlaceholders(scores, null)];
  placeHolders = [...placeHolders, ...converToPlaceholders(normsBiblio, "biblio")];
  placeHolders.forEach(([key, val]) => template = template.replaceAll(key, val));
  return template;
};
