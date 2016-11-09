//Global variables
/* global data:false, w2ui:false */

var img_dir = "img";
var img_name_style = { path: "x_card_data", style: "img_file_name_no_ext" }; //or you can change to style:"name"

var i;
var saved_sel = -1;
var saved_search_data = {};

var card = {
  recid: 0,
  name: "",
  element_name: "",
  rarity_name_short: "",
  attack: 0,
  attack_max: 0,
  defence: 0,
  defence_max: 0,
  cost: 0,
  skill_name: "",
  skill_desc: "",
};

var grid_data = new Array(data.length);
for (i = 0; i < grid_data.length; i++) {
  var record = Object.create(card);
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
  grid_data[i] = record;
}

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
      {
        type: "html",
        html: "<div>" +
        "img_dir: " +
        "<input id=\"img_dir\" size=\"5\" placeholder=\"" + img_dir + "\"/>" +
        "/</div>"
      },
      { type: "button", id: "btn_img_dir", caption: "Set", icon: "fa fa-folder-o" },
      { type: "break" },
      { type: "check", id: "chk_same_prom", caption: "Show same promotion", icon: "fa fa-heart-o", checked: false },
      { type: "spacer" }
    ],
    onClick: function (event) {
      event.onComplete = function () {
        switch (event.target) {
          case "btn_img_dir":
            img_dir = $.trim($("#img_dir").val()).length > 0 ? $("#img_dir").val() : "img";
            $("#img_dir").attr("placeholder", img_dir);
            $("#img_dir").val("");
            break;
          case "chk_same_prom":
            if (this.get("chk_same_prom").checked) {
              //Change button icon
              this.set("chk_same_prom", { icon: "fa fa-heart" });
              //Hide showcase
              hide_case();
              //Save status
              saved_sel = w2ui["grid"].getSelection()[0];
              saved_search_data = w2ui["grid"].searchData;
              //Search real order
              var sel_ro = w2ui["grid"].get(saved_sel).real_order;
              w2ui["grid"].search([{ field: "real_order", value: sel_ro, operator: "is" }]);
              //Recover status
              if (saved_sel >= 0) {
                w2ui["grid"].select(saved_sel);
                w2ui["grid"].scrollIntoView();
              }
            }
            else {
              //Change button icon
              this.set("chk_same_prom", { icon: "fa fa-heart-o" });
              //Hide showcase
              hide_case();
              //Reset search
              w2ui["grid"].search(saved_search_data);
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
    { field: "card_no", caption: "番号", size: "3%", min: 30, sortable: true },
    { field: "name", caption: "名前", size: "23%", min: 230, sortable: true, resizable: true },
    { field: "element_name", caption: "属性", size: "3%", min: 30, sortable: true, resizable: true },
    { field: "rarity_name_short", caption: "稀有", size: "3%", min: 30, sortable: true, resizable: true },
    { field: "attack", caption: "攻初", size: "4%", min: 40, sortable: true, resizable: true },
    { field: "attack_max", caption: "攻最", size: "4%", min: 40, sortable: true, resizable: true },
    { field: "defence", caption: "防初", size: "4%", min: 40, sortable: true, resizable: true },
    { field: "defence_max", caption: "防最", size: "4%", min: 40, sortable: true, resizable: true },
    { field: "cost", caption: "戦力", size: "3%", min: 30, sortable: true, resizable: true },
    { field: "skill_name", caption: "技能", size: "21%", min: 210, sortable: true, resizable: true },
    { field: "skill_desc", caption: "効果", size: "28%", min: 280, sortable: true, resizable: true },
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
      options: { items: ["N", "HN", "R", "HR", "SR", "SSR", "LG", "SLG", "AR"] }
    },
    { field: "attack", caption: "攻初", type: "int" },
    { field: "attack_max", caption: "攻最", type: "int" },
    { field: "defence", caption: "防初", type: "int" },
    { field: "defence_max", caption: "防最", type: "int" },
    { field: "cost", caption: "戦力", type: "int" },
    { field: "skill_name", caption: "技能", type: "text" },
    { field: "skill_desc", caption: "効果", type: "text" },
  ],
  sortData: [{ field: "card_no", direction: "ASC" }],
  records: grid_data,
  onSelect: function (event) {
    show_case(event.recid);
    event.onComplete = function () {
      saved_sel = w2ui["grid"].getSelection()[0];
    };
  },
  onUnselect: function (event) {
    hide_case();
    event.onComplete = function () {
      saved_sel = -1;
    };
  },
});
w2ui["grid"].refresh();


function show_case(recid) {
  $("#card_img").attr("src", img_dir + "/" + data[recid][img_name_style.path][img_name_style.style] + ".jpg");
  $("#card_desc").text(data[recid]["card_data"]["desc"]);
  $("#showcase").addClass(data[recid]["card_data"]["element_name"]);
  $("#showcase").css("display", "block");
}
function hide_case() {
  $("#showcase").css("display", "none");
  $("#showcase").removeClass("人"); $("#showcase").removeClass("神"); $("#showcase").removeClass("魔");
  $("#card_img").attr("src", null);
  $("#card_desc").text("");
}
