const SETS = ["6.5", "6"];

const ATTRIBUTES = {
  "all": ["Unique", "Elusive"],
  "6": ["Artifact"],
  "6.5": ["Radiant", "Artifact"]
}

function CallDataApis(url) {
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
