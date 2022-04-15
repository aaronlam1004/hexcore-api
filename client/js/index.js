function GetCurrentSet() {
  return $("#api-sets").val();
}

function UpdateApiDemoString(apiType, url) {
}

function FillWithTraits() {
  let set = GetCurrentSet();
  $("#api-champions-traits").empty();
  CallDataApis(`/set${set}/traits`).then((res) => {
    for (let trait of res) {
      $("#api-champions-traits").append(`<option value="${trait["name"]}">${trait["name"]}</option>`);
    }
    $("#api-champions-traits").trigger("chosen:updated");
  });
}

function UpdateApiImageCall() {
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
  $("#api-champions-traits").chosen({ allow_single_deselect: true });
  FillWithTraits();

  // Costs 
  $("#api-champions-cost").chosen({ allow_single_deselect: true });
  for (let cost = 1; cost <= 5; cost++) {
    $("#api-champions-cost").append(`<option value="${cost}">${cost}</option>`)
    $("#api-champions-cost").trigger("chosen:updated");
  }
  
  // -- Trait API --
  $("#api-traits-types").chosen({ allow_single_deselect: true });

  // -- Item API --

  // -- Image API --
  $("#api-img-submit").click(function() {
    UpdateApiImageCall();
  });
}

function SetupEventHandlers() {
  $("#api-img-submit").click(function() {
    UpdateApiImageCall();
  });

  $("#api-img-text").keypress(function(event) {
    if (event.key === "Enter") {
      UpdateApiImageCall();
    }
  });

  $("#api-sets").change(function() {
    FillWithTraits();
  });
}

$(document).ready(function() {
  InitializeDemos();
  SetupEventHandlers();
  // $("#api-champions-traits").chosen().change(() => {
  //   FilterTraits($("#api-champion-traits").chosen().val());
  // });
  // 
  // 
  // $("#api-cost").change(() => {
  //   let set = $("#api-version").val().replace('.','-');
  //   let cost = $("#api-cost").val();
  //   if (cost === "all") {
  //     GetApiCall(`/set${set}/champions`).then((res) => {
  //       $("#api-output").text(JSON.stringify(res, null, 4));
  //     });
  //   }
  //   else {
  //     GetApiCall(`/set${set}/champions?cost=${cost}`).then((res) => {
  //       $("#api-output").text(JSON.stringify(res, null, 4));
  //     });
  //   }
  // });
  // 
  // $("#submit").click(function () {
  //   let set = $("#api-version").val().replace('.','-');
  //   let champion = $("#value").val();
  //   GetApiCall(`/set${set}/champions?name=${champion}`).then((res) => {
  //     $("#api-output").text(JSON.stringify(res, null, 4));
  //   });
  // });
});
