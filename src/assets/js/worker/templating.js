export default generateReport = ({ testee, session, answers, scores, normsBiblio, template }) => {
  
  const converObjectToPlaceholders = (obj, rootKey = null) => {
    let placeHolders = [];
    for (const [key, val] of Object.entries(obj)) {
      if (typeof val === "object" && !Array.isArray(val)) {
        const newKey = (rootKey && `${rootKey}#${key}`) || key;
        placeHolders = [
          ...placeHolders,
          ...converObjectToPlaceholders(val, newKey),
        ];
      } else if (Array.isArray(val)) {
        listOfValues = val.length == 0 ? [" "] : val;
        placeHolders = [
          ...placeHolders,
          ...listOfValues.map((el) => [`${rootKey}#${key}#${el}`, el])
        ]

      }  else {
        placeHolders.push([`${rootKey}#${key}`, val]);
      }
    }
    return [...placeHolders];
  };

  let placeHolders = [...[], ...converObjectToPlaceholders(testee, "testee")];
  placeHolders = [...placeHolders, ...converObjectToPlaceholders(session, "testee")];
  placeHolders = [...placeHolders, ...converObjectToPlaceholders(answers, null)];
  placeHolders = [...placeHolders, ...converObjectToPlaceholders(scores, null)];
  placeHolders = [...placeHolders, ...converObjectToPlaceholders(normsBiblio, "biblio")];
  console.log(placeHolders)
  placeHolders.forEach(([key, val]) => template = template.replaceAll(key, val));
  return template;
};
