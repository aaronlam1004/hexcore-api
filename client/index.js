var sets = ["6.5", "6"];

function GetApiCall(url) {
  return fetch(url).then((res) => {
    try {
      return res.json();
    }
    catch {
      return res;
    }
  })
}

function GetCost() {

}

function FilterTraits(queries) {
  let set = $("#api-version").val().replace('.','-');
  let traits = queries.join(' ');
  GetApiCall(`/set${set}/champions?traits=${traits}`).then((res) => {
    $("#api-output").text(JSON.stringify(res, null, 4));
  });
}

function FillWithTraits() {
  let set = $("#api-version").val().replace('.', '-');
  $("#api-trait").empty();
  GetApiCall(`/set${set}/traits`).then((res) => {
    for (let trait of res) {
      $("#api-trait").append(`<option value="${trait["name"]}">${trait["name"]}</option>`);
    }
    $("#api-trait").trigger("chosen:updated");
  });
}

$(document).ready(function () {
  for (let set of sets) {
    $("#api-version").append(`<option value=${set}>Set ${set}</option>`);
  }

  for (var i = 1; i <= 5; i++) {
    $("#api-cost").append(`<option value=${i}>${i}</option>`);
  }

  $("#api-trait").chosen({ allow_single_deselect: true });
  FillWithTraits();

  $("#api-trait").chosen().change(() => {
    FilterTraits($("#api-trait").chosen().val());
  });

  $("#api-version").change(() => {
    FillWithTraits();
  });

  $("#api-cost").change(() => {
    let set = $("#api-version").val().replace('.','-');
    let cost = $("#api-cost").val();
    if (cost === "all") {
      GetApiCall(`/set${set}/champions`).then((res) => {
        $("#api-output").text(JSON.stringify(res, null, 4));
      });
    }
    else {
      GetApiCall(`/set${set}/champions?cost=${cost}`).then((res) => {
        $("#api-output").text(JSON.stringify(res, null, 4));
      });
    }
  });

  $("#submit").click(function () {
    let set = $("#api-version").val().replace('.','-');
    let champion = $("#value").val();
    GetApiCall(`/set${set}/champions?name=${champion}`).then((res) => {
      $("#api-output").text(JSON.stringify(res, null, 4));
    });
    $("#api-img").attr("src", `/set${set}/imgs?champion=${champion}`);
  });
});
