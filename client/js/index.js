// Sets
function GetCurrentSet() {
  return $("#api-sets").val();
}

function UpdateApiDemoString(apiType, url) {
}

// -- Champions Demo --
function FilterChampionsWithApi() {
  let costs = $("#api-champions-cost").chosen().val();
  let traits = $("#api-champions-traits").chosen().val();
  let filters ={ cost: costs.join(' '), traits: traits.join(' ') };
  CallDataApis(GetCurrentSet(), "champions", filters).then((res) => {
    $("#api-champions-output").text(JSON.stringify(res, undefined, 2));
  });
}

// -- Traits Demo --
function FillWithTraits() {
  $("#api-champions-traits").empty();
  CallDataApis(GetCurrentSet(), "traits").then((res) => {
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
  $("#api-img-submit").click(() => {
    GetImageSrc();
  });
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
    CallDataApis(GetCurrentSet(), "champions", {"name": championName}).then((res) => {
      $("#api-champions-output").text(JSON.stringify(res, undefined, 2));
    });
  });

  $("#api-champions-name").keypress((event) => {
    if (event.key === "Enter") {
      let championName = $("#api-champions-name").val();
      CallDataApis(GetCurrentSet(), "champions", {"name": championName}).then((res) => {
        $("#api-champions-output").text(JSON.stringify(res, undefined, 2));
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
    CallDataApis(GetCurrentSet(), "traits", filter).then((res) => {
      $("#api-traits-output").text(JSON.stringify(res, undefined, 2));
    });
  });

  $("#api-traits-submit").click(() => {
    let traitName = $("#api-traits-name").val();
    CallDataApis(GetCurrentSet(), "traits", {"name": traitName}).then((res) => {
      $("#api-traits-output").text(JSON.stringify(res, undefined, 2));
    });
  });

  $("#api-traits-name").keypress((event) => {
    if (event.key === "Enter") {
      let traitName = $("#api-traits-name").val();
      CallDataApis(GetCurrentSet(), "traits", {"name": traitName}).then((res) => {
        $("#api-traits-output").text(JSON.stringify(res, undefined, 2));
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
