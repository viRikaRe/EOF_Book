//Global variables
/* global data:false, w2ui:false, img_dir:true */

const grid_data = [];
const charas = [];

let img_dir = "img";
const img_name_style = { path: "x_card_data", style: "img_file_name_no_ext" }; //or you can change to {path:"card_data",style:"name"}

let pref_show_case = true;      //boolean - whether "Show pic" button is selected
let case_shown = false;         //boolean - whether pic is shown
let saved_sel = -1;             //integer - remembers selected row before searching, so as to keep it selected after searching
let saved_search_data = {};     //object - remembers search settings before customized searching, so as to keep restore it afterwards
let saved_search_logic = "";    //string - remembers search logic  before customized searching, so as to keep restore it afterwards
let mask_custom_search = false; //boolean - a flag indicating whether a search is initiated from default search or customized search


//Page load
initGrid();
w2ui["grid"].lock("Loading... (~10MB)", true);

//Page init
document.addEventListener("DOMContentLoaded", function () {
  initData();
  w2ui["grid"].add(grid_data);
  w2ui["grid"].sortData.push({ field: "card_no", direction: "asc" });
  w2ui["grid"].localSort();
  w2ui["grid"].getSearch("chara").options.items = charas;
  w2ui["grid"].refresh();
  addListeners();
  w2ui["grid"].unlock();
});


function initData() {
  //init data for grid
  for (let i = 0; i < data.length; i++) {
    const record = {};
    record.recid = i;
    record.card_no = data[i]["x_card_data"]["raw_order_int"];
    record.name = data[i]["card_data"]["name"];
    record.element_name = data[i]["card_data"]["element_name"];
    record.rarity_name_short = data[i]["card_data"]["rarity_name_short"];
    record.attack = data[i]["card_data"]["attack"];
    record.attack_max = data[i]["card_data"]["attack_max"];
    record.defence = data[i]["card_data"]["defence"];
    record.defence_max = data[i]["card_data"]["defence_max"];
    record.cost = data[i]["card_data"]["cost"];
    record.skill_name = data[i]["card_data"]["skill_name"];
    record.skill_desc = data[i]["card_data"]["skill_desc"];
    record.real_order = data[i]["x_card_data"]["real_order"]; //hidden
    record.chara = data[i]["x_card_data"]["chara"]; //hidden
    grid_data.push(record);
  }

  //init data for charas search
  $.each(data, function (i, v) {
    if ($.inArray(v["x_card_data"]["chara"], charas) === -1) charas.push(v["x_card_data"]["chara"]);
  });
  charas.sort(function (a, b) { return a.localeCompare(b); });
}

function initGrid() {
  $("#grid").w2grid({
    name: "grid",
    header: "List of Names",
    show: {
      toolbar: true,
      footer: true
    },
    toolbar: {
      items: [
        { type: "break" },
        { type: "check", id: "chk_show_case", caption: "Show pic", icon: "fa fa-toggle-on", checked: true },
        {
          type: "html",
          html: "<div class=\"w2ui-toolbar-custom-imgdir\">" +
          "<span class=\"textbox-icon fa fa-folder-open-o fa-fw\"></span>" +
          "<input id=\"txt_img_dir\" type=\"text\" title=\"Set image directory\" size=\"3\" placeholder=\"" + img_dir + "\"/>" +
          "<span class=\"textbox-suffix\">/</span></div>"
        },
        { type: "button", id: "btn_img_dir", caption: "Set" },
        { type: "break" },
        { type: "check", id: "chk_show_promo", caption: "Show promotion", icon: "fa fa-toggle-off", checked: false, disabled: true },
        { type: "spacer" }
      ],
      onClick: function (event) {
        event.onComplete = function () {
          switch (event.target) {
            case "chk_show_case":   //"Show pic" button is clicked
              if (this.get("chk_show_case").checked) {
                this.set("chk_show_case", { icon: "fa fa-toggle-on" });
                pref_show_case = true;
                if (w2ui["grid"].getSelection().length > 0) showCase(w2ui["grid"].getSelection()[0]);
              } else {
                this.set("chk_show_case", { icon: "fa fa-toggle-off" });
                pref_show_case = false;
                hideCase();
              }
              break;

            case "btn_img_dir":     //"Set" button is clicked
              img_dir = $.trim($("#txt_img_dir").val()).length > 0 ? $("#txt_img_dir").val() : "img";
              $("#txt_img_dir").attr("placeholder", img_dir);
              $("#txt_img_dir").attr("size", Math.min(30, img_dir.length));
              $("#txt_img_dir").val("");
              break;

            case "chk_show_promo":  //"Show promotion" button is clicked
              if (this.get("chk_show_promo").checked) {
                //Change button icon
                this.set("chk_show_promo", { icon: "fa fa-toggle-on" });
                //Save status
                saved_sel = w2ui["grid"].getSelection()[0];
                saved_search_data = w2ui["grid"].searchData;
                saved_search_logic = w2ui["grid"].last.logic;
                //Search real order
                mask_custom_search = true;
                const sel_ro = w2ui["grid"].get(saved_sel).real_order;
                w2ui["grid"].search([{ field: "real_order", value: sel_ro, operator: "is" }]);
                mask_custom_search = false;
                //Recover status
                if (saved_sel >= 0) {
                  w2ui["grid"].select(saved_sel);
                  w2ui["grid"].scrollIntoView();
                }
              } else {
                //Change button icon
                this.set("chk_show_promo", { icon: "fa fa-toggle-off" });
                //Reset search
                mask_custom_search = true;
                if (saved_search_data.length !== 0) { w2ui["grid"].search(saved_search_data, saved_search_logic); } else { w2ui["grid"].searchReset(); }
                mask_custom_search = false;
                //Recover status
                if (saved_sel >= 0) {
                  w2ui["grid"].select(saved_sel);
                  w2ui["grid"].scrollIntoView();
                }
              }
              break;
          }
        };
      }
    },
    columns: [
      { field: "card_no", caption: "番号", size: "4%", min: 40, sortable: true },
      { field: "name", caption: "名前", size: "23%", min: 230, sortable: true, resizable: true },
      { field: "element_name", caption: "属性", size: "3%", min: 30, sortable: true, resizable: true },
      { field: "rarity_name_short", caption: "稀有", size: "3%", min: 30, sortable: true, resizable: true },
      { field: "attack", caption: "攻初", size: "4%", min: 40, sortable: true, resizable: true },
      { field: "attack_max", caption: "攻最", size: "4%", min: 40, sortable: true, resizable: true },
      { field: "defence", caption: "防初", size: "4%", min: 40, sortable: true, resizable: true },
      { field: "defence_max", caption: "防最", size: "4%", min: 40, sortable: true, resizable: true },
      { field: "cost", caption: "戦力", size: "3%", min: 30, sortable: true, resizable: true },
      { field: "skill_name", caption: "技能", size: "21%", min: 210, sortable: true, resizable: true },
      { field: "skill_desc", caption: "効果", size: "27%", min: 270, sortable: true, resizable: true },
    ],
    searches: [
      { field: "card_no", caption: "番号", type: "int" },
      { field: "name", caption: "名前", type: "text" },
      {
        field: "element_name", caption: "属性", type: "list",
        options: { items: ["人", "神", "魔"] }
      },
      {
        field: "rarity_name_short", caption: "稀有", type: "list",
        options: { items: ["N", "HN", "R", "HR", "SR", "SSR", "LG", "SLG", "SSLG", "AR"] }
      },
      { field: "attack", caption: "攻初", type: "int" },
      { field: "attack_max", caption: "攻最", type: "int" },
      { field: "defence", caption: "防初", type: "int" },
      { field: "defence_max", caption: "防最", type: "int" },
      { field: "cost", caption: "戦力", type: "int" },
      { field: "skill_name", caption: "技能", type: "text" },
      { field: "skill_desc", caption: "効果", type: "text" },
      { field: "chara", caption: "角色", type: "list", options: { items: [/* to fill */] } }
    ],
    sortData: [/* to fill */],
    records: [/* to fill */],
    onSelect: function (event) {
      if (pref_show_case) showCase(event.recid);
      event.onComplete = function () {
        saved_sel = w2ui["grid"].getSelection()[0];
        if (!w2ui["grid"].toolbar.get("chk_show_promo").checked) w2ui["grid"].toolbar.enable("chk_show_promo");
      };
    },
    onUnselect: function (event) {
      hideCase();
      event.onComplete = function () {
        saved_sel = -1;
        if (!w2ui["grid"].toolbar.get("chk_show_promo").checked) w2ui["grid"].toolbar.disable("chk_show_promo");
      };
    },
    onSearch: function (event) {
      event.onComplete = function () {
        if (!mask_custom_search) {
          w2ui["grid"].toolbar.disable("chk_show_promo");
          w2ui["grid"].toolbar.uncheck("chk_show_promo");
          w2ui["grid"].toolbar.set("chk_show_promo", { icon: "fa fa-toggle-off" });
          w2ui["grid"].selectNone();
        }
      };
    }
  });
}

function addListeners() {
  $("#txt_img_dir").keypress(function (event) {
    if (event.which === 13) { w2ui["grid"].toolbar.click("btn_img_dir"); }
  });
}

function showCase(recid) {
  $("#card_img").attr("src", img_dir + "/" + data[recid][img_name_style.path][img_name_style.style] + ".jpg");
  $("#card_desc").text(data[recid]["card_data"]["desc"]);
  $("#showcase").addClass(data[recid]["card_data"]["element_name"]);
  $("#showcase").css("display", "block");
  case_shown = true;
}

function hideCase() {
  $("#showcase").css("display", "none");
  $("#showcase").removeClass("人"); $("#showcase").removeClass("神"); $("#showcase").removeClass("魔");
  $("#card_img").attr("src", null);
  $("#card_desc").text("");
  case_shown = false;
}
