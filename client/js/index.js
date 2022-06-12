/**
 * Updates API demo call String at bottom
 * of the web app.
 **/
function UpdateApiDemoOutput(url) {
  let apiOutput = $("#api-string-output code")[0];
  $(apiOutput).text(url);
}

// -- Sets --
/**
 * Gets the current set from the set selector
 * @return: the TFT set we are looking at
 **/
function GetCurrentSet() {
  return $("#api-sets").val();
}

// -- Champions --
/**
 * Fills champion selector with champion names for getting champion information
 **/
function FillChampSelectorWithNames() {
  $("#api-champions-name").empty();
  $("#api-champions-name").append(`<option value="" disabled selected>Name</option>`);
  let url = GetDataApiUrl(GetCurrentSet(), "champions");
  Fetch(url).then((res) => {
    for (let champion of res) {
      $("#api-champions-name").append(`<option value="${champion["name"]}">${champion["name"]}</option>`);
    }
  });
}

/**
 * Fills the cost filter for getting champion information
 **/
function FillChampFilterWithCosts() {
  $("#api-champions-cost").empty();

  for (let cost = 1; cost <= 5; cost++) {
    $("#api-champions-cost").append(`<option value="${cost}">${cost}</option>`);
    $("#api-champions-cost").trigger("chosen:updated");
  }

  if (GetCurrentSet() == "7") {
    $("#api-champions-cost").append(`<option value="8">8</option>`);
    $("#api-champions-cost").append(`<option value="10">10</option>`);
    $("#api-champions-cost").trigger("chosen:updated");
  }
}

/**
 * Fills the trait filter for getting champion information
 **/
function FillChampFilterWithTraits() {
  $("#api-champions-traits").empty();
  let url = GetDataApiUrl(GetCurrentSet(), "traits");
  Fetch(url).then((res) => {
    for (let trait of res) {
      $("#api-champions-traits").append(`<option value="${trait["name"]}">${trait["name"]}</option>`);
    }
    $("#api-champions-traits").trigger("chosen:updated");
  });
}

/**
 * Fills the cost filter for getting champion information
 **/
function FilterChampionsUsingApi() {
  let costs = $("#api-champions-cost").chosen().val();
  let traits = $("#api-champions-traits").chosen().val();
  let filters = { cost: costs.join(' '), traits: traits.join(' ') };
  let url = GetDataApiUrl(GetCurrentSet(), "champions", filters);
  Fetch(url).then((res) => {
    $("#api-champions-output").text(JSON.stringify(res, undefined, 2));
    UpdateApiDemoOutput(GetDataApiUrl(GetCurrentSet(), "champions", filters));
  });
}

// -- Traits --
/**
 * Fills trait selector with trait names for getting trait information
 **/
function FillTraitSelectorWithNames() {
  $("#api-traits-name").empty();
  $("#api-traits-name").append(`<option value="" disabled selected>Name</option>`);
  let url = GetDataApiUrl(GetCurrentSet(), "traits");
  Fetch(url).then((res) => {
    for (let trait of res) {
      $("#api-traits-name").append(`<option value="${trait["name"]}">${trait["name"]}</option>`);
    }
  });
}

// -- Item --
/**
 * Fills trait selector with trait names for getting trait information
 * @param fillNames: whether or not to fill with item names or not
 **/
function FillItemSelector(fillNames = true) {
  $("#api-items-select").empty();
  $("#api-items-select").append(`<option value="" disabled selected>Name/ID</option>`);
  let url = GetDataApiUrl(GetCurrentSet(), "items");
  Fetch(url).then((res) => {
    for (let item of res) {
      if (fillNames) {
        $("#api-items-select").append(`<option value="${item["name"]}">${item["name"]}</option>`);
      }
      else {
        $("#api-items-select").append(`<option value="${item["id"]}">${item["id"]}</option>`);
      }
    }
  });
}

/**
 * Updates item selector based on the item query selector
 **/
function UpdateItemSelectorValues() {
  if ($("#api-items-query").val() == "ID") {
    FillItemSelector(fillNames = false); // IDs
  }
  else {
    FillItemSelector(); // Names
  }
}

/**
 * Fills the attribute filter for getting item information
 **/
function FillItemFilterWithAttributes() {
  $("#api-items-attributes").empty();
  let attributes = ATTRIBUTES["all"].concat(ATTRIBUTES[GetCurrentSet()]);
  for (let attribute of attributes) {
    $("#api-items-attributes").append(`<option value="${attribute}">${attribute}</option>`);
  }
  $("#api-items-attributes").trigger("chosen:updated");
}

// -- Image --
//TODO: image selector updater

/**
 * Updates the result so that it is the image we selected
 **/
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

/**
 * Initialize the demo webapp
 **/
function InitializeDemos() {
  // Sets
  for (let set of SETS) {
    $("#api-sets").append(`<option value=${set}>${set}</option>`);
  }

  // -- Champion API --
  FillChampSelectorWithNames(); // Names
  $("#api-champions-traits").chosen({allow_single_deselect: true}); // Trait filter
  FillChampFilterWithTraits();
  $("#api-champions-cost").chosen({allow_single_deselect: true}); // Cost filter
  FillChampFilterWithCosts();
  
  // -- Traits API --
  FillTraitSelectorWithNames(); // Names
  $("#api-traits-types").chosen({allow_single_deselect: true}); // Trait types filter

  // -- Items API --
  FillItemSelector(); // Names/ID
  $("#api-items-attributes").chosen({allow_single_deselect: true}); // Item attributes filter
  FillItemFilterWithAttributes();

  // -- Image API --
}

function SetupEventHandlers() {
  // Sets
  $("#api-sets").change(() => {
    // Champions
    FillChampSelectorWithNames(); // Names
    FillChampFilterWithCosts(); // Trait filter
    FillChampFilterWithTraits(); // Cost filter

    // Traits
    FillTraitSelectorWithNames();

    // Items
    UpdateItemSelectorValues(); // Names/IDs
    FillItemFilterWithAttributes(); // Item attributes filter
  });
  
  // -- Champion API --
  // When champion is selected
  $("#api-champions-name").change((event) => {
    let championName = $("#api-champions-name").val();
    let url = GetDataApiUrl(GetCurrentSet(), "champions", {"name": championName});
    Fetch(url).then((res) => {
      $("#api-champions-output").text(JSON.stringify(res, undefined, 2));
      UpdateApiDemoOutput(url);
    });
  });

  // When "All" button is clicked
  $("#api-champions-all").click(() => {
    let url = GetDataApiUrl(GetCurrentSet(), "champions");
    Fetch(url).then((res) => {
      $("#api-champions-output").text(JSON.stringify(res, undefined, 2));
      UpdateApiDemoOutput(url);
    $("#api-champions-name").prop("selectedIndex", 0);
    });
  });

  // When trait is chosen to be filtered
  $("#api-champions-traits").chosen().change(() => {
    FilterChampionsUsingApi();
    $("#api-champions-name").prop("selectedIndex", 0);
  });

  // When cost is chosen to be filtered 
  $("#api-champions-cost").chosen().change(() => {
    FilterChampionsUsingApi();
    $("#api-champions-name").prop("selectedIndex", 0);
  });

  // -- Traits API --
  // When trait is selected
  $("#api-traits-name").change((event) => {
    let traitName = $("#api-traits-name").val();
    let url = GetDataApiUrl(GetCurrentSet(), "traits", {"name": traitName});
    Fetch(url).then((res) => {
      $("#api-traits-output").text(JSON.stringify(res, undefined, 2));
      UpdateApiDemoOutput(url);
    });
  });

  // When "All" button is clicked
  $("#api-traits-all").click(() => {
    let url = GetDataApiUrl(GetCurrentSet(), "traits");
    Fetch(url).then((res) => {
      $("#api-traits-output").text(JSON.stringify(res, undefined, 2));
      UpdateApiDemoOutput(url);
      $("#api-traits-name").prop("selectedIndex", 0);
    });
  });

  // When trait type is chosen to be filtered 
  $("#api-traits-types").chosen().change(() => {
    let typesString = $("#api-traits-types").chosen().val();
    let filter = {type: typesString.join(' ').toLowerCase()};
    let url = GetDataApiUrl(GetCurrentSet(), "traits", filter);
    Fetch(url).then((res) => {
      $("#api-traits-output").text(JSON.stringify(res, undefined, 2));
      UpdateApiDemoOutput(url);
      $("#api-traits-name").prop("selectedIndex", 0);

    });
  });
 
  // -- Item API --
  // When item query selector is changed
  $("#api-items-query").change((event) => {
    UpdateItemSelectorValues(); // Names/IDs
  });

  //TODO: item selector change event
  $("#api-items-select").keypress((event) => {
    if (event.key === "Enter") {
      let itemQuery = $("#api-items-query").val()
      let itemText = $("#api-items-select").val();
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

  // When item attribute is chosen to be filtered
  $("#api-items-attributes").chosen().change(() => {
    let itemString = $("#api-items-attributes").chosen().val();
    let filter = {attr: itemString.join(' ').toLowerCase()};
    let url = GetDataApiUrl(GetCurrentSet(), "items", filter);
    Fetch(url).then((res) => {
      $("#api-items-output").text(JSON.stringify(res, undefined, 2));
      UpdateApiDemoOutput(url);
      //TODO item selector to index 0
    });
  });

  //TODO: "All" item button
  $("#api-items-submit").click(() => {
    let itemQuery = $("#api-items-query").val()
    let itemText = $("#api-items-select").val();
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
      //TODO item selector to index 0
    });
  });

  // -- Image API --
  //TODO: remove this
  $("#api-img-submit").click(() => {
    UpdateApiImage();
  });

  //TODO: image selector
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
