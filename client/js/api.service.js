const SETS = ["7", "6.5", "6"];

const ATTRIBUTES = {
  "all": ["Unique", "Elusive"],
  "6": ["Artifact"],
  "6.5": ["Radiant", "Artifact"]
}

function CreateQueryString(queries) {
  let queryString = "";
  let queryParts = Object.entries(queries);
  let numOfQueries = queryParts.length;
  for (var i = 0; i < numOfQueries; i++) {
    let [query, param] = queryParts[i];
    if (param != "") {
      if (i > 0) {
        queryString += '&';
      }
      queryString += `${query}=${param}`;
    }
  }
  if (queryString !== "") { queryString = '?' + queryString; }
  return queryString;
}

function GetDataApiUrl(set, api, queries={}) {
  let queryString = CreateQueryString(queries);
  return `/set${set}/${api}${queryString}`;
}

function Fetch(url) {
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
