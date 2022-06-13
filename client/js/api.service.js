const SETS = ["7", "6.5", "6"];

const ATTRIBUTES = {
  "all": ["Unique", "Elusive"],
  "6": ["Artifact"],
  "6.5": ["Radiant", "Artifact"]
}

/**
 * Creates the query string to filter information to use in the API
 * @param queries: the Array of queries to form the query string from
 * @return: the query string to use in the API call
 **/
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

/**
 * Creates the API url to use to get TFT API information
 * @param set: the TFT set to call
 * @param api: the specific API to call (champions, traits, etc.)
 * @param queries: the queries to use in the API call to "filter" out information
 * @return: the API string to use/call
 **/
function GetDataApiUrl(set, api, queries={}) {
  let queryString = CreateQueryString(queries);
  return `/set${set}/${api}${queryString}`;
}

/**
 * Makes a fetch call to a URL
 * @param url: the URL to make a fetch call to
 * @return: the result data (JSON if possible, otherwise just the raw data)
 **/
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

/**
 * Gets the URL for the image API in order to get the image to display
 * @param set: the TFT set to call
 * @param champion: the champion name 
 * @param item: the item name or id
 * @param trait: the trait name
 * @return: the image URL
 **/
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
