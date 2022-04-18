const SETS = ["6.5", "6"];

const ATTRIBUTES = {
  "all": ["Unique", "Elusive"],
  "6": ["Artifact"],
  "6.5": ["Radiant", "Artifact"]
}

function CreateQueryString(queries) {
  let queryString = "";
  let queryParts = Object.entries(queries);
  let numOfQueries = queryParts.length;
  if (numOfQueries > 0) { queryString += '?'; }
  for (var i = 0; i < numOfQueries; i++) {
    let [query, param] = queryParts[i];
    if (param != "") {
      if (i > 0) {
        queryString += '&';
      }
      queryString += `${query}=${param}`;
    }
  }
  return queryString;
}

function CallDataApis(set, api, queries = {}) {
  let queryString = CreateQueryString(queries);
  let url = `/set${set}/${api}${queryString}`;
  return fetch(url).then((res) => {
    try {
      return res.json();
    }
    catch {
      return res;
    }
  })
}

function GetImageSrc(set, {champion = "", item = "", trait = ""}) {
  var url = `../set${set}/imgs`;
  if (champion !== "") {
    url += `?champion=${champion}`;
  }
  else if (item !== "") {
    url += `?item=${item}`;
  }
  else if (trait !== "") {
    url += `?trait=${trait}`;
  }
  return url;
}
