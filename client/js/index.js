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
  $("#api-champion-names").empty();
  $("#api-champion-names").append(`<option value="" disabled selected>Name</option>`);
  let url = GetDataApiUrl(GetCurrentSet(), "champions");
  Fetch(url).then((res) => {
    for (let champion of res) {
      $("#api-champion-names").append(`<option value="${champion["name"]}">${champion["name"]}</option>`);
    }
  });
}

/**
 * Fills the cost filter for getting champion information
 **/
function FillChampFilterWithCosts() {
  $("#api-champion-cost").empty();

  for (let cost = 1; cost <= 5; cost++) {
    $("#api-champion-cost").append(`<option value="${cost}">${cost}</option>`);
    $("#api-champion-cost").trigger("chosen:updated");
  }

  if (GetCurrentSet() == "7") {
    $("#api-champion-cost").append(`<option value="8">8</option>`);
    $("#api-champion-cost").append(`<option value="10">10</option>`);
    $("#api-champion-cost").trigger("chosen:updated");
  }
}

/**
 * Fills the trait filter for getting champion information
 **/
function FillChampFilterWithTraits() {
  $("#api-champion-traits").empty();
  let url = GetDataApiUrl(GetCurrentSet(), "traits");
  Fetch(url).then((res) => {
    for (let trait of res) {
      $("#api-champion-traits").append(`<option value="${trait["name"]}">${trait["name"]}</option>`);
    }
    $("#api-champion-traits").trigger("chosen:updated");
  });
}

/**
 * Fills the cost filter for getting champion information
 **/
function FilterChampionsUsingApi() {
  let costs = $("#api-champion-cost").chosen().val();
  let traits = $("#api-champion-traits").chosen().val();
  let filters = { cost: costs.join(' '), traits: traits.join(' ') };
  let url = GetDataApiUrl(GetCurrentSet(), "champions", filters);
  Fetch(url).then((res) => {
    $("#api-champion-output").text(JSON.stringify(res, undefined, 2));
    UpdateApiDemoOutput(GetDataApiUrl(GetCurrentSet(), "champions", filters));
  });
}

// -- Traits --
/**
 * Fills trait selector with trait names for getting trait information
 **/
function FillTraitSelectorWithNames() {
  $("#api-trait-names").empty();
  $("#api-trait-names").append(`<option value="" disabled selected>Name</option>`);
  let url = GetDataApiUrl(GetCurrentSet(), "traits");
  Fetch(url).then((res) => {
    for (let trait of res) {
      $("#api-trait-names").append(`<option value="${trait["name"]}">${trait["name"]}</option>`);
    }
  });
}

// -- Item --
/**
 * Fills trait selector with trait names for getting trait information
 * @param fillNames: whether or not to fill with item names or not
 **/
function FillItemSelector(fillNames = true) {
  $("#api-item-select").empty();
  $("#api-item-select").append(`<option value="" disabled selected>Name/ID</option>`);
  let url = GetDataApiUrl(GetCurrentSet(), "items");
  Fetch(url).then((res) => {
    for (let item of res) {
      if (fillNames) {
        $("#api-item-select").append(`<option value="${item["name"]}">${item["name"]}</option>`);
      }
      else {
        $("#api-item-select").append(`<option value="${item["id"]}">${item["id"]}</option>`);
      }
    }
  });
}

/**
 * Updates item selector based on the item query selector
 **/
function UpdateItemSelectorValues() {
  if ($("#api-item-query").val() == "ID") {
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
  $("#api-item-attributes").empty();
  let attributes = ATTRIBUTES["all"].concat(ATTRIBUTES[GetCurrentSet()]);
  for (let attribute of attributes) {
    $("#api-item-attributes").append(`<option value="${attribute}">${attribute}</option>`);
  }
  $("#api-item-attributes").trigger("chosen:updated");
}

// -- Image --
/**
 * Fills trait selector with trait names for getting trait information
 * @param imgCategory: the category of images to fill
 **/
function FillImageSelector(imgCategory) {
  $("#api-img-select").empty();
  $("#api-img-select").append(`<option value="" disabled selected>Name</option>`);
  imgCategory += 's';
  let url = GetDataApiUrl(GetCurrentSet(), imgCategory.toLowerCase());
  Fetch(url).then((res) => {
    for (let data of res) {
      $("#api-img-select").append(`<option value="${data["name"]}">${data["name"]}</option>`);
    }
  });
}

/**
 * Updates item selector based on the champion query selector
 **/
function UpdateImageSelectorValues() {
  FillImageSelector($("#api-img-query").val());
}

/**
 * Updates the result so that it is the image we selected
 **/
function UpdateApiImage() {
  let set = GetCurrentSet();
  var src;
  let imgQuery = $("#api-img-select").val();
  let imgType = $("#api-img-query").val();
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
  $("#api-champion-traits").chosen({allow_single_deselect: true}); // Trait filter
  FillChampFilterWithTraits();
  $("#api-champion-cost").chosen({allow_single_deselect: true}); // Cost filter
  FillChampFilterWithCosts();
  
  // -- Traits API --
  FillTraitSelectorWithNames(); // Names
  $("#api-trait-types").chosen({allow_single_deselect: true}); // Trait types filter

  // -- Items API --
  FillItemSelector(); // Names/ID
  $("#api-item-attributes").chosen({allow_single_deselect: true}); // Item attributes filter
  FillItemFilterWithAttributes();

  // -- Image API --
  UpdateImageSelectorValues();
}

/**
 * Set up the event handlers
 **/
function SetupEventHandlers() {
  // Sets
  $("#api-sets").change(() => {
    // Champions
    FillChampSelectorWithNames(); // Names
    FillChampFilterWithCosts(); // Trait filter
    FillChampFilterWithTraits(); // Cost filter
    $("#api-champion-output").text(''); // Reset champion output

    // Traits
    FillTraitSelectorWithNames();
    $("#api-trait-output").text(''); // Reset trait output

    // Items
    UpdateItemSelectorValues(); // Names/IDs
    FillItemFilterWithAttributes(); // Item attributes filter
    $("#api-item-output").text(''); // Reset item output

    // Images
    UpdateImageSelectorValues(); // Names (champions, items, traits, etc.)
    $("#api-img-result").attr("src", ''); // Reset image output
  });
  
  // -- Champion API --
  // When champion is selected
  $("#api-champion-names").change((event) => {
    let championName = $("#api-champion-names").val();
    let url = GetDataApiUrl(GetCurrentSet(), "champions", {"name": championName});
    Fetch(url).then((res) => {
      $("#api-champion-output").text(JSON.stringify(res, undefined, 2));
      UpdateApiDemoOutput(url);
      $("#api-champion-cost").val('').trigger("chosen:updated"); // Clear filtered costs
      $("#api-champion-traits").val('').trigger("chosen:updated"); // Clear filtered traits
    });
  });

  // When "All" button is clicked
  $("#api-champion-all").click(() => {
    let url = GetDataApiUrl(GetCurrentSet(), "champions");
    Fetch(url).then((res) => {
      $("#api-champion-output").text(JSON.stringify(res, undefined, 2));
      UpdateApiDemoOutput(url);
      $("#api-champion-names").prop("selectedIndex", 0); // Reset champion selector
      $("#api-champion-cost").val('').trigger("chosen:updated"); // Clear filtered costs
      $("#api-champion-traits").val('').trigger("chosen:updated"); // Clear filtered traits
    });
  });

  // When trait is chosen to be filtered
  $("#api-champion-traits").chosen().change(() => {
    FilterChampionsUsingApi();
    $("#api-champion-names").prop("selectedIndex", 0); // Reset champion selector
  });

  // When cost is chosen to be filtered 
  $("#api-champion-cost").chosen().change(() => {
    FilterChampionsUsingApi();
    $("#api-champion-names").prop("selectedIndex", 0); // Reset champion selector
  });

  // -- Traits API --
  // When trait is selected
  $("#api-trait-names").change((event) => {
    let traitName = $("#api-trait-names").val();
    let url = GetDataApiUrl(GetCurrentSet(), "traits", {"name": traitName});
    Fetch(url).then((res) => {
      $("#api-trait-output").text(JSON.stringify(res, undefined, 2));
      UpdateApiDemoOutput(url);
      $("#api-trait-types").val('').trigger("chosen:updated"); // Clear filtered trait types
    });
  });

  // When "All" button is clicked
  $("#api-trait-all").click(() => {
    let url = GetDataApiUrl(GetCurrentSet(), "traits");
    Fetch(url).then((res) => {
      $("#api-trait-output").text(JSON.stringify(res, undefined, 2));
      UpdateApiDemoOutput(url);
      $("#api-trait-names").prop("selectedIndex", 0); // Reset trait selector
      $("#api-trait-types").val('').trigger("chosen:updated"); // Clear filtered trait types
    });
  });

  // When trait type is chosen to be filtered 
  $("#api-trait-types").chosen().change(() => {
    let typesString = $("#api-trait-types").chosen().val();
    let filter = {type: typesString.join(' ').toLowerCase()};
    let url = GetDataApiUrl(GetCurrentSet(), "traits", filter);
    Fetch(url).then((res) => {
      $("#api-trait-output").text(JSON.stringify(res, undefined, 2));
      UpdateApiDemoOutput(url);
      $("#api-trait-names").prop("selectedIndex", 0); // Reset trait selector
    });
  });
 
  // -- Item API --
  // When item query (name/ID) is selected
  $("#api-item-query").change((event) => {
    UpdateItemSelectorValues(); // Names/IDs
    $("#api-item-output").text(''); // Reset item output
  });

  // When item name/ID is selected
  $("#api-item-select").change((event) => {
    let filter = {};
    if ($("#api-item-query").val() == "ID") {
      filter["id"] = $("#api-item-select").val();
    }
    else {
      filter["name"] = $("#api-item-select").val();
    }
    let url = GetDataApiUrl(GetCurrentSet(), "items", filter);
    Fetch(url).then((res) => {
      $("#api-item-output").text(JSON.stringify(res, undefined, 2));
      UpdateApiDemoOutput(url);
      $("#api-item-attributes").val('').trigger("chosen:updated"); // Clear item attributes
    });
  });

  // When "All" button is clicked
  $("#api-item-all").click(() => {
    let url = GetDataApiUrl(GetCurrentSet(), "items");
    Fetch(url).then((res) => {
      $("#api-item-output").text(JSON.stringify(res, undefined, 2));
      UpdateApiDemoOutput(url);
      $("#api-item-select").prop("selectedIndex", 0); // Reset item selector
      $("#api-item-attributes").val('').trigger("chosen:updated"); // Clear item attributes
    });
  });

  // When item attribute is chosen to be filtered
  $("#api-item-attributes").chosen().change(() => {
    let itemString = $("#api-item-attributes").chosen().val();
    let filter = {attr: itemString.join(' ').toLowerCase()};
    let url = GetDataApiUrl(GetCurrentSet(), "items", filter);
    Fetch(url).then((res) => {
      $("#api-item-output").text(JSON.stringify(res, undefined, 2));
      UpdateApiDemoOutput(url);
      $("#api-item-select").prop("selectedIndex", 0); // Reset item selector
    });
  });

  // -- Image API --
  // When image query (champion/trait/item) is selected
  $("#api-img-query").change((event) => {
    UpdateImageSelectorValues();
    $("#api-img-result").attr("src", ''); // Reset image output
  });

  // When name of champion/trait/item is selected
  $("#api-img-select").change((event) => {
    UpdateApiImage();
  });
}

$(document).ready(() => {
  InitializeDemos();
  SetupEventHandlers();
});
