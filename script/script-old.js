//Global variables
/* global data:false, img_dir:false */
var img_dir = "img/";

var id_hover = 0;
var row_id = "row_0";
var sub_list = [];
var i = 0;
var tr;
var filtered = false;

//Page init

document.addEventListener("DOMContentLoaded", function () {
  $("#btn_load").prop("disabled", false);
  $("#btn_load").html("Render");
});

$("#btn_load").click(function () {
  $("#load").css("display", "none");
  $("#container").css("display", "block");
  init_list();
  init_filters();
});


//Initialize card list
function init_list() {
  //Add table head
  tr = $("<tr/>").addClass("head_row");
  tr.append(
    $("<th/>").text("番号").addClass("raw_order_str"),
    $("<th/>").text("名前").addClass("name"),
    $("<th/>").text("属性").addClass("element_name"),
    $("<th/>").text("稀有").addClass("rarity_name_short"),
    $("<th/>").text("攻初").addClass("attack"),
    $("<th/>").text("攻最").addClass("attack_max"),
    $("<th/>").text("防初").addClass("defence"),
    $("<th/>").text("防最").addClass("defence_max"),
    $("<th/>").text("戦力").addClass("cost"),
    $("<th/>").text("技能").addClass("skill_name"),
    $("<th/>").text("効果").addClass("skill_desc")
  );
  $("#head_area").append(tr);

  //Add table body
  for (i = 0; i < data.length; i++) {
    row_id = "row_" + i;
    tr = $("<tr/>").addClass("card_row").attr("id", row_id);

    var td01 = $("<td/>").addClass("card_attr").addClass("raw_order_str").text(data[i]["x_card_data"]["raw_order_str"]);
    var td02 = $("<td/>").addClass("card_attr").addClass("name").text(data[i]["card_data"]["name"]);
    var td03 = $("<td/>").addClass("card_attr").addClass("element_name").addClass(data[i]["element_name"]).text(data[i]["card_data"]["element_name"]);
    var td04 = $("<td/>").addClass("card_attr").addClass("rarity_name_short").text(data[i]["card_data"]["rarity_name_short"]);
    var td05 = $("<td/>").addClass("card_attr").addClass("attack").text(data[i]["card_data"]["attack"]);
    var td06 = $("<td/>").addClass("card_attr").addClass("attack_max").text(data[i]["card_data"]["attack_max"]);
    var td07 = $("<td/>").addClass("card_attr").addClass("defence").text(data[i]["card_data"]["defence"]);
    var td08 = $("<td/>").addClass("card_attr").addClass("defence_max").text(data[i]["card_data"]["defence_max"]);
    var td09 = $("<td/>").addClass("card_attr").addClass("cost").text(data[i]["card_data"]["cost"]);
    var td10 = $("<td/>").addClass("card_attr").addClass("skill_name").text(data[i]["card_data"]["skill_name"]);
    var td11 = $("<td/>").addClass("card_attr").addClass("skill_desc").text(data[i]["card_data"]["skill_desc"]);
    tr.append(td01, td02, td03, td04, td05, td06, td07, td08, td09, td10, td11);

    $("#body_area").append(tr);
  }

  //When a card row hovered, display image and description
  $("tr.card_row").hover(
    function () {
      id_hover = $(this).attr("id").substr(4);
      $("#card_img").attr("src", img_dir + data[id_hover]["x_card_data"]["img_file_name_no_ext"] + ".jpg");
      $("#card_desc").text(data[id_hover]["card_data"]["desc"]);
      $("#showcase").addClass(data[id_hover]["card_data"]["element_name"]);
      $("#showcase").css("display", "block");
    },
    function () {
      $("#showcase").css("display", "none");
      $("#showcase").removeClass(data[id_hover]["card_data"]["element_name"]);
    }
  );

  //When a card row clicked, show only related cards
  $(".card_row").click(function () {
    var selected_id = $(this).attr("id").substr(4);
    var selected_real_order = data[selected_id]["x_card_data"]["real_order"];

    sub_list = Array(data.length).fill(false);
    for (i = 0; i < data.length; i++) {
      if (data[i]["x_card_data"]["real_order"] === selected_real_order) sub_list[i] = true;
    }

    for (i = 0; i < data.length; i++) {
      row_id = "row_" + i;
      if (sub_list[i]) {
        $("#" + row_id).removeClass("filtered_out");
      } else {
        $("#" + row_id).addClass("filtered_out");
      }
    }

    filtered = true;
  });
}

//Initialize filters
function init_filters() {
  //charas
  var charas = [];
  $.each(data, function (i, v) {
    if ($.inArray(v["x_card_data"]["chara"], charas) === -1) charas.push(v["x_card_data"]["chara"]);
  });
  charas.sort(function (a, b) { return a.localeCompare(b); });
  $("#f_chara").append($("<option/>").attr("value", "").text("角色"));
  for (i = 0; i < charas.length; i++) {
    $("#f_chara").append($("<option/>").attr("value", charas[i]).text(charas[i]));
  }

  //elements
  var elems = ["人", "神", "魔"];
  $("#f_element").append($("<option/>").attr("value", "").text("属性"));
  for (i = 0; i < elems.length; i++) {
    $("#f_element").append($("<option/>").attr("value", elems[i]).text(elems[i]));
  }

  //rarities
  var rarities = ["N", "HN", "R", "HR", "SR", "SSR", "LG", "SLG", "AR"];
  $("#f_rarity").append($("<option/>").attr("value", "").text("稀有"));
  for (i = 0; i < rarities.length; i++) {
    $("#f_rarity").append($("<option/>").attr("value", rarities[i]).text(rarities[i]));
  }

  //costs
  var costs = [];
  $.each(data, function (i, v) {
    if ($.inArray(v["card_data"]["cost"], costs) === -1) costs.push(v["card_data"]["cost"]);
  });
  costs.sort(function (a, b) { return a - b; });
  $("#f_cost").append($("<option/>").attr("value", "").text("戦力"));
  for (i = 0; i < costs.length; i++) {
    $("#f_cost").append($("<option/>").attr("value", costs[i]).text(costs[i]));
  }
}

//Apply filters
$("#btn_filter").click(function () {
  sub_list = Array(data.length).fill(true);

  function filter(filterName = "", arrayName = "", arrayGroup = "", arrayIsNumber = "false") {
    if ($("#f_" + filterName).val() !== "") {
      for (i = 0; i < data.length; i++) {
        sub_list[i] = sub_list[i] &&
          (arrayIsNumber ?
            data[i][arrayGroup][arrayName] == $("#f_" + filterName).val() :
            data[i][arrayGroup][arrayName] === $("#f_" + filterName).val()
          );
      }
    }
  }

  filter("chara", "chara", "x_card_data");
  filter("element", "element_name", "card_data");
  filter("rarity", "rarity_name_short", "card_data");
  filter("cost", "cost", "card_data");

  for (i = 0; i < data.length; i++) {
    row_id = "row_" + i;
    if (sub_list[i]) {
      $("#" + row_id).removeClass("filtered_out");
    } else {
      $("#" + row_id).addClass("filtered_out");
    }
  }

  filtered = true;
});

//Clear filters
$("#btn_clear").click(function () {
  if (filtered) {
    for (i = 0; i < data.length; i++) {
      row_id = "row_" + i;
      $("#" + row_id).removeClass("filtered_out");
    }
  }

  filtered = false;
});

