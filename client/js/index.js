// Sets
function GetCurrentSet() {
  return $("#api-sets").val();
}

function UpdateApiDemoOutput(url) {
  let apiOutput = $("#api-string-output code")[0];
  $(apiOutput).text(url);
}

// -- Champions Demo --
function FilterChampionsWithApi() {
  let costs = $("#api-champions-cost").chosen().val();
  let traits = $("#api-champions-traits").chosen().val();
  let filters = { cost: costs.join(' '), traits: traits.join(' ') };
  let url = GetDataApiUrl(GetCurrentSet(), "champions", filters);
  Fetch(url).then((res) => {
    $("#api-champions-output").text(JSON.stringify(res, undefined, 2));
    UpdateApiDemoOutput(GetDataApiUrl(GetCurrentSet(), "champions", filters));
  });
}

// -- Traits Demo --
function FillWithTraits() {
  $("#api-champions-traits").empty();
  let url = GetDataApiUrl(GetCurrentSet(), "traits");
  Fetch(url).then((res) => {
    for (let trait of res) {
      $("#api-champions-traits").append(`<option value="${trait["name"]}">${trait["name"]}</option>`);
    }
    $("#api-champions-traits").trigger("chosen:updated");
  });
}

// -- Items Demo --
function FillWithAttributes() {
  $("#api-items-attributes").empty();
  let attributes = ATTRIBUTES["all"].concat(ATTRIBUTES[GetCurrentSet()]);
  for (let attribute of attributes) {
    $("#api-items-attributes").append(`<option value="${attribute}">${attribute}</option>`);
  }
  $("#api-items-attributes").trigger("chosen:updated");
}

// -- Image Demo --
function UpdateApiImage() {
  let set = GetCurrentSet();
  var src;
  let imgQuery = $("#api-img-text").val();
  let imgType = $("#api-img-select").val();
  switch(imgType) {
    case "Champion":
      src = GetImageSrc(set, {champion: imgQuery});
      $("#api-img-result").attr("src", src);
      break;
    case "Trait":
      src = GetImageSrc(set, {trait: imgQuery});
      $("#api-img-result").attr("src", src);
      break;
    default:
      src = GetImageSrc(set, {item: imgQuery});
      $("#api-img-result").attr("src", src);
      break;
  }
  UpdateApiDemoOutput(src.substring(2));
}

function InitializeDemos() {
  // Sets
  for (let set of SETS) {
    $("#api-sets").append(`<option value=${set}>${set}</option>`);
  }

  // -- Champion API --
  // Traits
  $("#api-champions-traits").chosen({allow_single_deselect: true});
  FillWithTraits();

  // Costs 
  $("#api-champions-cost").chosen({allow_single_deselect: true});
  for (let cost = 1; cost <= 5; cost++) {
    $("#api-champions-cost").append(`<option value="${cost}">${cost}</option>`)
    $("#api-champions-cost").trigger("chosen:updated");
  }
  
  // -- Traits Demo --
  $("#api-traits-types").chosen({allow_single_deselect: true});

  // -- Items Demo --
  $("#api-items-attributes").chosen({allow_single_deselect: true});
  FillWithAttributes();

  // -- Image Demo --
}

function SetupEventHandlers() {
  // Sets
  $("#api-sets").change(() => {
    FillWithTraits();
    FillWithAttributes();
  });
  
  // -- Champion API --
  $("#api-champions-submit").click(() => {
    let championName = $("#api-champions-name").val();
    let url = GetDataApiUrl(GetCurrentSet(), "champions", {"name": championName});
    Fetch(url).then((res) => {
      $("#api-champions-output").text(JSON.stringify(res, undefined, 2));
      UpdateApiDemoOutput(url);
    });
  });

  $("#api-champions-name").keypress((event) => {
    if (event.key === "Enter") {
      let championName = $("#api-champions-name").val();
      let url = GetDataApiUrl(GetCurrentSet(), "champions", {"name": championName});
      Fetch(url).then((res) => {
        $("#api-champions-output").text(JSON.stringify(res, undefined, 2));
        UpdateApiDemoOutput(url);
      });
    }
  });

  $("#api-champions-traits").chosen().change(() => {
    FilterChampionsWithApi();
  });

  $("#api-champions-cost").chosen().change(() => {
    FilterChampionsWithApi();
  });

  // -- Traits Demo --
  $("#api-traits-types").chosen().change(() => {
    let typesString = $("#api-traits-types").chosen().val();
    let filter = {type: typesString.join(' ').toLowerCase()};
    let url = GetDataApiUrl(GetCurrentSet(), "traits", filter);
    Fetch(url).then((res) => {
      $("#api-traits-output").text(JSON.stringify(res, undefined, 2));
      UpdateApiDemoOutput(url);
    });
  });

  $("#api-traits-submit").click(() => {
    let traitName = $("#api-traits-name").val();
    let url = GetDataApiUrl(GetCurrentSet(), "traits", {"name": traitName});
    Fetch(url).then((res) => {
      $("#api-traits-output").text(JSON.stringify(res, undefined, 2));
      UpdateApiDemoOutput(url);
    });
  });

  $("#api-traits-name").keypress((event) => {
    if (event.key === "Enter") {
      let traitName = $("#api-traits-name").val();
      let url = GetDataApiUrl(GetCurrentSet(), "traits", {"name": traitName});
      Fetch(url).then((res) => {
        $("#api-traits-output").text(JSON.stringify(res, undefined, 2));
        UpdateApiDemoOutput(url);
      });
    }
  });
 
  // -- Item Demo --
  $("#api-items-attributes").chosen().change(() => {
    let itemString = $("#api-items-attributes").chosen().val();
    let filter = {attr: itemString.join(' ').toLowerCase()};
    let url = GetDataApiUrl(GetCurrentSet(), "items", filter);
    Fetch(url).then((res) => {
      $("#api-items-output").text(JSON.stringify(res, undefined, 2));
      UpdateApiDemoOutput(url);
    });
  });

  $("#api-items-submit").click(() => {
    let itemQuery = $("#api-items-query").val()
    let itemText = $("#api-items-name").val();
    let filter = {};
    if (itemQuery === "ID") {
      filter["id"] = itemText;
    }
    else if (itemQuery === "Name") {
      filter["name"] = itemText;
    }
    let url = GetDataApiUrl(GetCurrentSet(), "items", filter);
    Fetch(url).then((res) => {
      $("#api-items-output").text(JSON.stringify(res, undefined, 2));
      UpdateApiDemoOutput(url);
    });
  });

  $("#api-items-name").keypress((event) => {
    if (event.key === "Enter") {
      let itemQuery = $("#api-items-query").val()
      let itemText = $("#api-items-name").val();
      let filter = {};
      if (itemQuery === "ID") {
        filter["id"] = itemText;
      }
      else if (itemQuery === "Name") {
        filter["name"] = itemText;
      }
      let url = GetDataApiUrl(GetCurrentSet(), "items", filter);
      Fetch(url).then((res) => {
        $("#api-items-output").text(JSON.stringify(res, undefined, 2));
        UpdateApiDemoOutput(url);
      });
    }
  });

  // -- Image Demo --
  $("#api-img-submit").click(() => {
    UpdateApiImage();
  });

  $("#api-img-text").keypress((event) => {
    if (event.key === "Enter") {
      UpdateApiImage();
    }
  });
}

$(document).ready(() => {
  InitializeDemos();
  SetupEventHandlers();
});
