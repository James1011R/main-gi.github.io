var CUSTOM = 0;
var mysvg;
var config = {};
/* Declare functions so they can be used without definition
// function updateSVG() {}

// function getSpell() {}

// function setSpellOnBoard() {}

// function loadMove() {}

function makeSVGTag(tagName, properties) {
  var keys = Object.keys(properties);
  var ret = "<" + tagName;
  for (var i = 0; i < keys.length; i++) {
    ret += " " + keys[i] + '="' + properties[keys[i]] + '"';
  }
  ret += "/>";
  return ret;
}

function makeSVGTagContent(tagName, properties, content) {
  var keys = Object.keys(properties);
  var ret = "<" + tagName;
  for (var i = 0; i < keys.length; i++) {
    ret += " " + keys[i] + '="' + properties[keys[i]] + '"';
  }
  ret += ">" + content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</" + tagName + ">";
  return ret;
}
*/

// $("#code").val(defs);

if (window.location.search && URLSearchParams) {
  var qS = new URLSearchParams(window.location.search);
  if (qS.has("q")) $("#code").val(qS.get("q"));
  if (qS.has("c")) {
    var i;
    for (i = 9; i <= +qS.get("c"); i++) {
      MOVES.push({
        "name": "custom" + i,
        "id": "c" + i,
        "cat": "custom",
        "text": "Custom ability " + i + " (Double Click Menu Icon to Edit)",
        "color": [97, 97, 97],
        "symbol1": "0"
      });
      if (i == 32 && i != +qS.get("c")) {
        alert("Requested number of custom squares too large.\nYou're probably StratShotPlayer\nCutting off at 32.");
        i++;
        break;
      }
    }
    CUSTOM = i - 1;
  }
}

initializeBoards();
makeLookup();

// Create stylesheet element
var style = document.createElement("style");
$("#style").append(style);

if (!(CSS && CSS.escape)) var CSS = {
  escape: a => a.replace(/"/g, "\\\"")
};

function createColors(m) {
  var tintColor = [];
  for (var n = 0; n < 3; n++) {
    tintColor[n] = Math.floor((255 - (m.color || [0, 0, 0])[n]) / 2 + (m.color || [0, 0, 0])[n]);
  }
  return ([
    m.color || [0, 0, 0],
    m.color2 || tintColor || [255, 255, 255],
    m.color3 || m.color || [0, 0, 0],
    m.color4 || m.color3 || m.color || [0, 0, 0]
  ]);
}

//makeRule function: i think it's useful
function makeRule(m) {
  var rule = ".",
    usedColors = createColors(m);
  var merge = (m.symbol1 || "") + (m.symbol2 || "");
  rule += m.name;
  rule += "::before{";
  rule += "border:2px solid rgb(" + usedColors[0] + ");";
  rule += "background:rgb(" + usedColors[1] + ");";
  rule += "color:rgb(" + usedColors[2] + ");";
  rule += "content:\"" + (merge ? CSS.escape(merge) : "") + "\";";
  rule += "}";
  return rule;
}

// Apply each move to style
//MOVES.forEach(function (m) { //tony2 you are really lazy
for (var i = 0; i < MOVES.length; i++) { //there
  style.sheet.insertRule(makeRule(MOVES[i]), i);
}
document.styleSheets[1] = style;

// Define <li> for each move
preloadSpells();

for (var i = 0; i < MOVES.length; i++) {
  var className = MOVES[i].name;
  if (MOVES[i].cat == "custom") className += " custom";
  if (MOVES[i].hide) className += " hide";
    $(".moves").append(makeSVGTagContent("svg", {
      class: className,
      "data-description": MOVES[i].text,
      width: 15,
      height: 15
    }, ""));
}
$(".moves svg").each(function() {
  var currentSpell = MOVES[SMOVE[this.classList[0]]];
  this.insertAdjacentHTML('beforeend', makeSVGTag("use", {
    x: 0,
    y: 0,
    class: "spell-gallery",
    "data-index": i,
    "data-id": currentSpell.id,
    href: "#spell-" + currentSpell.name,
    transform: "scale(1.25)"
  }));
});
//$("#moves").append("<li class=\""+className+"\">"+MOVES[i].text+"</li>\n");

//$(".moves .custom").prop("contenteditable", true); //let's not :v

$("#shactive").click(function() {
  if (this.innerHTML.match(/Show/ig)) {
    $("#action").addClass("show");
    $(this).text($(this).text().replace(/Show/ig, "Hide"));
  } else {
    $("#action").removeClass("show");
    $(this).text($(this).text().replace(/Hide/ig, "Show"));
  }
});

// Current tool
var ACTION;

function setAction(action) {
  $("#action ." + ACTION).removeClass("active");
  $("#action ." + action).addClass("active");
  ACTION = action;
  loadMove(MOVES[SMOVE[action]]);
}
$("#action svg").click(function() {
  if (ACTION == this.classList[0]) return;
  setAction(this.classList[0]); // ensure we get customN not custom
});
setAction("moveattack");

//Doubleclick custom to edit
$("#action svg.custom").on("dblclick taphold", function() {
  cusLoadEdit(this.classList[0]);
});

function cusLoadEdit(moves) {
  //declare every parameter because lolfunctions
  var elm, col, tex, sy1, sy2, box, c11, c12, c13, c21, c22, c23, c31, c32, c33, c41, c42, c43, cid = MOVES[SMOVE[moves]].id, nobox;
  //Load every parameters
  cusLoadCustom(moves);
  function cusLoadCustom(moves) {
    elm = MOVES[SMOVE[moves]];
    col = createColors(elm);
    tex = $("#text").val(elm.text);
    sy1 = $("#symbol1").val(elm.symbol1);
    sy2 = $("#symbol2").val(elm.symbol2);
    box = $("#nobox").prop("disabled", elm.nobox);
    c11 = $("#color11").val(col[0][0]);
    c12 = $("#color12").val(col[0][1]);
    c13 = $("#color13").val(col[0][2]);
    c21 = $("#color21").val(col[1][0]);
    c22 = $("#color22").val(col[1][1]);
    c23 = $("#color23").val(col[1][2]);
    c31 = $("#color31").val(col[2][0]);
    c32 = $("#color32").val(col[2][1]);
    c33 = $("#color33").val(col[2][2]);
    c41 = $("#color41").val(col[3][0]);
    c42 = $("#color42").val(col[3][1]);
    c43 = $("#color43").val(col[3][2]);
    //Update
    $("[type=checkbox]").prop("checked", false); //uncheck boxes
    $(".cusmodal input").prop("disabled", false); //undisable inputs
    nobox = $("#nobox").prop("checked", elm.nobox);

    $("[id^=color1],[id^=color2]").prop("disabled", elm.nobox);
    //$(".giant").text(sy1.val() + sy2.val()); //update content
    //$(".giant").css("border-color", "rgb(" + c11.val() + "," + c12.val() + "," + c13.val() + ")"); //update c1
    //$(".giant").css("background", "rgb(" + c21.val() + "," + c22.val() + "," + c23.val() + ")"); //update c2
    //$(".giant").css("color", "rgb(" + c31.val() + "," + c32.val() + "," + c33.val() + ")"); //update c3
    loadMove(elm);
    updateCustom();
  }

  function updateCustom(){
    let prevspellstyle = spellstyle
    spellstyle = [10, 1, 9]
    $(".giant").html(makeSpellSVG());
    spellstyle = prevspellstyle // main_gi: This "prevspellstyle" stuff is a bit of a hack but it prevents the stylesheet style from messing up the giant-spell-SVG look (if I didn't put it there, the giant spell SVG would also be scaled up to the point where you couldn't see the border)
  }
  //Load actual menu
  $(".modalwrapper").show();

  $(".cusmodal input").bind("mouseup keyup", function() {
    if (this.id == "nobox") {
      $("[id^=color1],[id^=color2]").prop("disabled", !this.checked);
      if ($("#colour2")[0].checked && this.checked) {
        $("[id^=color2]").prop("disabled", true);
      }
      if (!this.checked) {
        config.nobox = true;
      } else {
        config.nobox = false;
      }
      updateCustom();
    }
    if (this.id.startsWith("color") && $(this).val() === "") {
      $(this).val("0");
    }
    if (this.id.startsWith("color1")) {
      var cur = parseInt($(this).val(), 10);
      if ($("#colour2")[0].checked) {
        $("#color2" + this.id.slice(-1)).val(Math.floor((255 - cur) / 2 + cur));
      }
      if ($("#colour3")[0].checked) {
        $("#color3" + this.id.slice(-1)).val(cur);
      }
      if ($("#colour4")[0].checked) {
        $("#color4" + this.id.slice(-1)).val(cur);
      }
    }
    if (this.id.startsWith("color")) {
      config.color1 = "rgb(" + c11.val() + "," + c12.val() + "," + c13.val() + ")"; //update c1
      config.color2 = "rgb(" + c21.val() + "," + c22.val() + "," + c23.val() + ")"; //update c2
      config.color3 = "rgb(" + c31.val() + "," + c32.val() + "," + c33.val() + ")"; //update c3
      config.color4 = "rgb(" + c41.val() + "," + c42.val() + "," + c43.val() + ")"; //update c4
      updateCustom();
    }
    // todo: rewrite all of these into svg
    if (this.id.startsWith("colour")) {
      $("[id^=color" + this.id.slice(-1) + "]").prop("disabled", !this.checked);
      if (!this.checked) {
        this.checked = true;
        $("[id^=color1]").keyup();
        this.checked = false;
      } else if ($("#nobox")[0].checked && this.id == "colour2") {
        $("[id^=color2]").prop("disabled", true);
      }
    }
    if (this.id.startsWith("symbol")) {
      if (_.every($("[id^=symbol]"), elm => elm.checkValidity())) {
        config.symbol1 = sy1.val();
        config.symbol2 = sy2.val();
        updateCustom();
      }
    }
    if (this.id == "unicode") {
      if (this.checkValidity() && this.value) $("#uniprev").val(String.fromCodePoint(parseInt($(this).val(), 16)));
    }
  });
  $(".cusmodal .moves svg").click(function() {
    cusLoadCustom(this.classList[0]);
  });
  $(".cusmodal #menuclose").one("click", function() {
    var jsn = {
      name: moves,
      id: cid,
      text: tex.val(),
      color: [parseInt(c11.val(), 10), parseInt(c12.val(), 10), parseInt(c13.val(), 10)],
      color2: [parseInt(c21.val(), 10), parseInt(c22.val(), 10), parseInt(c23.val(), 10)],
      color3: [parseInt(c31.val(), 10), parseInt(c32.val(), 10), parseInt(c33.val(), 10)],
      color4: [parseInt(c41.val(), 10), parseInt(c42.val(), 10), parseInt(c43.val(), 10)],
      symbol1: sy1.val(),
      symbol2: sy2.val(),
      nobox: $("#nobox")[0].checked
    };
    $(".cusmodal input").off("click keyup");
    $(".cusmodal .moves li").off("click"); //prevent overloading
    $(".cusmodal #uniprev").off("click");
    //update everything
    DATA.custom = DATA.custom || {}; //create custom if it doesn't exist
    DATA.custom[cid] = jsn; //DATAbase for saving
    Object.assign(MOVES[SMOVE[moves]], jsn); //I dunno

    loadMove(MOVES[SMOVE[moves]]);
    document.getElementById("spell-"+moves).remove();
    document.getElementById("defs").insertAdjacentHTML("beforeend", makeSpellSVG());
    style.sheet.deleteRule(SMOVE[moves]);
    style.sheet.insertRule(makeRule(MOVES[SMOVE[moves]]), SMOVE[moves]); //Reapply css

    document.styleSheets[1] = style;
    $(".moves ." + moves).attr("data-description", MOVES[SMOVE[moves]].text);
    //Hide actual menu
    $(".modalwrapper").hide();
    setAction(moves); //to actually use it
    for (var l = 0; l < 4; l ++) {
      var curLev = LEVELS[l];
      var isDisplay = /inline/.test($("#" + curLev + " svg." + moves)[0].getAttribute("style"));
      if (isDisplay) {
        removeDisplay(curLev, moves);
        setDisplay(curLev, moves);
      }
    }
  });
}
$("#hidebutton").click(function(e) {
  $("#controls").toggleClass("slide");
  if ($("#controls").is(".slide")) {
    $("#controls").css("right", (10 - $("#controls").width()) + "px");
  } else {
    $("#controls").css("right", 0);
  }
});

/* not vanilla jq
$("#controls").swipeleft(function(){
   if($("controls").is(".slide"))return;
   $("#hidebutton").click();
});
$("#controls").swiperight(function(){
   if(!$("controls").is(".slide"))return;
   $("#hidebutton").click();
})
//*/

/*// Function by PaulIrish in https://www.broken-links.com/2009/01/20/very-quick-equal-height-columns-in-jquery/#comment-23624
$.fn.syncHeight = function() {
    return this.height(Math.max.apply(this, $.map(this, function(e) { return $(e).height(); })));
};

$(".WARN").remove();
$(window).resize(function() { $(".cusmodal").syncHeight; });
$(".cusmodal").syncHeight();
$(".modalwrapper").hide();
//unused now*/

// Define <li? for each passive
var $passives = $("#passives");
var curPASSIVE = "base";
_.forEach(PASSIVES, function(p) {
  $passives.append("<li>" + p + "</li>");
});
// set target for all passizves
$("section .passives").focus(function() {
  curPASSIVE = level(this);
});
$("#passives li:not([id])").click(function() {
  var text = this.innerText || "";
  appendPassive(text);
});
$("#ctrlclear").click(function() {
  $("div.passives").text("").attr("data-raw", "").attr("data-description", "").keyup();
});

function appendPassive(text) {
  var oldtext = $("#" + curPASSIVE + " .passives").attr("data-description") && $("#" + curPASSIVE + " .passives").attr("data-description").concat("\n") || "";
  $("#" + curPASSIVE + " .passives").text(oldtext + text);
  setPassive(oldtext + text, curPASSIVE);
}

function setPassive(text, level) {
  var old = $("#" + level + " .passives").attr("data-raw");
  var oldhtml = $("#" + level + " .passives").html();
  text = cleanseText(text);
  $("#" + level + " .passives").attr("data-description", parseText(text, level)).attr("data-raw", text);
  DATA[level].passives = text;
  //if (level != curPASSIVE)
  //    $("#" + level + " .passives").text(DATA[level].passives);
  if ((level = nextLevel(level)) && old == $("#" + level + " .passives").attr("data-raw")) {
    $("#" + level + " .passives").html(oldhtml);
    setPassive(text, level);
  }
}


$("div.passives").keyup(function() {
  if (cleanseText(this.innerHTML).replace("\n", "").length == 0) {this.innerHTML = ""}
  setPassive(this.innerHTML, curPASSIVE);
});
$("div.passives").keydown(function() {
  if (cleanseText(this.innerHTML).replace("\n", "").length == 0) {this.innerHTML = ""} // main_gi: attempt to clear passives if empty
  setPassive(this.innerHTML, curPASSIVE);
});
/*
main_gi: This has never updated instantly. This makes it look better.
*/

function parseText(text, i) {
  i = SLEVEL[i];
  text = text.replace(/\[\+\]/g, "+".repeat(i));
  text = text.replace(/(\-?\d+)\[(\+\d+|\-\d+)\]/g, function(a, b, c) {
    return Number(b) + Number(c) * i;
  });
  // main_gi: ABC's code for giving [+] and #[+#] special properties (# being a number).
  // main_gi: Editing it so fake markdown works too.
  // text = text.replace(/\*\*([^\*]*)\*\*/g, function(a) {return `<b>${a}</b>`})
  // text = text.replace(/\*([^\*]*)\*/g, function(a) {return `<i>${a}</i>`} )
  // removed this... it is not editing the html I think
  
  text = text.replace(/&gt;/g, ">").replace(/&lt;/g, "<");
  return text;
}

function cleanseText(text) {
  text = text.replace(/^(<div[>]*?>)+|(<br[>]*?>)?(<\/div>)+$/g, "");
  text = text.replace(/(?=(<br[>]*?>)|(<\/div>)+|(<div[>]*?>)+)(<br[>]*?>)?(<\/div>)*(<div[>]*?>)*/g, "\n");
  return text;
}

// Piece data to be saved/restored
var DATA = {
  name: "Name",
  labels: {
    rank: "Minion",
    faction: "Basic",
    rarity: "Common"
  },
  base: {
    cost: 1,
    moves: {},
  },
  plus: {
    cost: 2,
    moves: {},
  },
  plusplus: {
    cost: 3,
    moves: {},
  },
  plusplusplus: {
    cost: 4,
    moves: {},
  },
  custom: {}
};

// Clear background
var sketch = $("#c").sketch().sketch();

function pos(td) {
  var tr = td.parentNode,
    c = 0,
    r = 0;
  while (td = td.previousSibling) c++;
  while (tr = tr.previousSibling) r++;
  return [r, c];
}

function td(level, pos) {
  var tr = $("#" + level + " tr")[+pos[0]];
  return tr.childNodes[+pos[1]];
}

function count(level, cell) {
  if (cell.className === "") return;
  var cid = MOVES[SMOVE[cell.className]].id;
  if (DATA[level].moves[cid]) setDisplay(level, cell.className);
  else removeDisplay(level, cell.className);
}

function setMove(level, cell, cls) {
  var old = cell.className,
    oid = old === "" ? "" : MOVES[SMOVE[old]].id,
    cid = cls === "" ? "" : MOVES[SMOVE[cls]].id;
  var p = pos(cell);
  if (old !== "") DATA[level].moves[oid] = DATA[level].moves[oid].replace(new RegExp(p[0].toString(16) + p[1].toString(16) + "(?=(..)*$)", "g"), "");
  if (DATA[level].moves[oid] === "") delete DATA[level].moves[oid];
  count(level, cell);
  cell.className = cls;
  if (cls !== "") DATA[level].moves[cid] = DATA[level].moves[cid] ? DATA[level].moves[cid] + p[0].toString(16) + p[1].toString(16) : p[0].toString(16) + p[1].toString(16);
  count(level, cell);

  // Apply move to subsequent level
  if (level = nextLevel(level)) {
    cell = td(level, p);
    if (cell.className == old) {
      setMove(level, cell, cls);
    }
  }
}

function setDisplay(level, cls) {
  DATA[level].moves[MOVES[SMOVE[cls]].id] = DATA[level].moves[MOVES[SMOVE[cls]].id] || "";
  $("#" + level + " .moves svg." + cls).css("display", "inline");
  var svgMove = $("#" + level + " .moves svg." + cls)[0];
  if (!svgMove.nextSibling || svgMove.nextSibling.tagName.toLowerCase() == "svg") {
    svgMove.insertAdjacentHTML("afterend", "<p contenteditable='true' spellcheck='false'>" + svgMove.dataset.description + "</p>");

    $('.moves > p').on("keyup", function () { // main_gi: This sets all displayed text to the new description on contenteditable change
      if (this.previousSibling) {
        var movename = this.previousSibling.classList[0];
        MOVES[SMOVE[movename]].text = this.innerText;
        $(".moves ." + movename).attr("data-description", MOVES[SMOVE[movename]].text); // modifies tooltip on the sidebar, but not the infopanels
        svgMove = $(".moves svg." + movename)
        for (let m = 0; m < svgMove.length; m++) { 
          if (!(!svgMove[m].nextSibling || svgMove[m].nextSibling.tagName.toLowerCase() == "svg")) {
            $(svgMove[m].nextSibling).not(this).text(this.innerText)
          }
        }

        if (movename.startsWith("custom")) { // This is just so it works in exports hopefully
          DATA.custom[MOVES[SMOVE[movename]].id] = DATA.custom[MOVES[SMOVE[movename]].id] || Object.assign(MOVES[SMOVE[movename]], DATA.custom[MOVES[SMOVE[movename]].id]);
          DATA.custom[MOVES[SMOVE[movename]].id].text = this.innerText
        }



      }
    });


  }
}

function removeDisplay(level, cls) {
  $("#" + level + " .moves svg." + cls).css("display", "none");
  var nc = $("#" + level + " .moves svg." + cls)[0].nextSibling || {tagName: ""};
  if(nc.tagName.toLowerCase() == "p") {
    nc.remove();
  }
}

function nextLevel(level) {
  return LEVELS[SLEVEL[level] + 1];
}

function level(el) {
  return $(el).closest("section").attr("id");
}

function getPos(el, level) {
  var i = $("#" + level + " td").index(el);
  return {
    x: i % 15 - 7,
    y: ~~(i / 15) - 7
  };
}

function redPos(v) {
  var g = gcd(v.x, v.y);
  return {
    x: v.x / g,
    y: v.y / g
  };
}

function gcd(x, y) {
  return y ? gcd(y, x % y) : Math.abs(x);
}

function setPos(v, level) {
  return $("#" + level + " td")[(v.x + 7) + (v.y + 7) * 15];
}

function outBoard(v) {
  return Math.abs(v.x) > 7 || Math.abs(v.y) > 7;
}

function Mark(el) {
  $(el).addClass("mark");
}

var mouse = {
  down: -1,
  mode: "add"
};
var moose = {
  click: 0
};
var COLOR = ACTION;

// main_gi: All this code was for the non-svg version.
/*
$("td.piece").mousedown(function() {
  moose.click++;
  clearTimeout(moose.reset);
  moose.reset = setTimeout(function() {
    moose.click = 0;
  }, 300);
  if (moose.click == 2) return mouse.dbl = level(this);
  else if (moose.click == 1) return mouse.line = level(this);
});
$("td").mouseover(function() {
  if (this.className == "piece") return;
  //NOTE: If this somehow backfires and ends up causing heavy lag like sketch.js does, BLAME MAIN_GI.
  var s, v;
  $(".mark").removeClass("mark");
  if (mouse.dbl == level(this)) {
    s = getPos(this, level(this));
    v = s;
    do {
      Mark(setPos(v, level(this)));
    } while (!outBoard(v = {
        x: v.x + s.x,
        y: v.y + s.y
      }));
  } else if (mouse.line == level(this)) {
    v = getPos(this, level(this));
    s = redPos(v);
    do {
      Mark(setPos(v, level(this)));
    } while ((v.x -= s.x) | (v.y -= s.y));
  } else if (mouse.down == level(this))
    setMove(level(this), this, COLOR);
});

$("td").mouseup(function() {
  $(".mark").removeClass("mark"); //They were cancer and will remain_gi to be.
  var s, v;
  if (mouse.dbl == level(this)) {
    if (this.className == "piece") return setDisplay(level(this), ACTION);
    s = getPos(this, level(this));
    v = s;
    do {
      setMove(level(this), setPos(v, level(this)), ACTION);
    } while (!outBoard(v = {
        x: v.x + s.x,
        y: v.y + s.y
      }));
  } else if (mouse.line == level(this)) {
    if (this.className == "piece") return $(document).trigger("mouseup");
    v = getPos(this, level(this));
    s = redPos(v);
    do {
      setMove(level(this), setPos(v, level(this)), ACTION);
    } while ((v.x -= s.x) | (v.y -= s.y));
  }
});*/

$(document).mouseup(function() {
  //mouse = {};
  COLOR = ACTION;
});

$("td").contextmenu(function(e) {
  e.preventDefault();
  e.stopPropagation();
  return false;
}); //suggestion by main_gi

// Set up drawing on first canvas. When the drawing pauses, draw a copy to the upgraded canvases
// with their own shadows. Updated to cope with Un/Re/Clear options
function mirrorImage() {
  $(".mirror").each(function() {
    var mi = this.getContext("2d");
    mi.clearRect(0, 0, this.width, this.height);
    mi.shadowBlur = 10;
    mi.shadowColor = $(this).attr("data-shadow");
    mi.drawImage(c, 0, 0, this.width, this.height);
  });
}

$("#c").on("draw", function() {
  view.update();
  mirrorImage();
  saveImage();
});

// Show description on mouseover of functions
$("[mode=tools] a").mouseover(function() {
  $("#toolinfo").text(TOOLTIPS[this.id]);
});

// When the name changes, update the other names.
$("#name").keyup(function() {
  dirty().name = this.textContent;
  $("#plus .name").text(DATA.name + "+");
  $("#plusplus .name").text(DATA.name + "++");
  $("#plusplusplus .name").text(DATA.name + "+++");
});

function deltaCost(level, delta) {
  DATA[level].cost += delta;
  $("#" + level + " input").val(DATA[level].cost);
  // Apply move to subsequent level
  if (level = nextLevel(level)) deltaCost(level, delta);
}
$(".cost input").on("keyup mouseup", function() {
  var lv = level(this);
  deltaCost(lv, (+this.value) - DATA[lv].cost);
});
$("input[type=number]").on("wheel", function(e) {
  e.preventDefault();
}); //Lazy approach to support edge cases: Remove them :D

//Toggle labels
$(".info span").click(function() {
  var labels = LABELS[this.className],
    ix = labels.indexOf(this.innerText);
  ix += 1;
  ix %= labels.length;
  $(".info span." + this.className).text(labels[ix]);
  DATA.labels[this.className] = labels[ix];
});

// Tabs
$("#controls > nav > a").click(function() {
  document.body.setAttribute("mode", this.getAttribute("mode"));
});

// local preview -- hack for offline versions (forgive meh)
function screensave() {
  $("#saveimage").prop("disabled", true).text("Saving");

  var ugh = setTimeout(function() {
    $("#saveimage").text("Something's not quite right...");
  }, 20000); //For lulz

  var $b = $("#boards").clone();
  // Insert all available color codes
  _.forEach(Array.prototype.slice.call(style.sheet.cssRules), function(item) {
    $b.find("#style style")[0].innerHTML += item.cssText;
  });
  // remove controls
  $b.find("#controls").remove();

  // replace canvas with image; put correct number in for cost (using input not working)
  _.forEach(LEVELS, function(level) {
    var c = $("#" + level + " canvas")[0];
    
    // NOTE: Probably revert to using src when the bug is fixed
    $b.find("#" + level + " canvas").replaceWith("<img class=\"c\" width=\"" + $(c).width() + "\" height=\"" + $(c).height() + "\" style=\"background: url(" + c.toDataURL("image/png") + ")\"/>");
    // main_gi: Commented out the above line because it was causing problems with the height of the +0 version being displaced.
    // main_gi: Uncommented because apparently causes the whole thing not to work

    $b.find("#" + level + " .cost input").replaceWith("" + DATA[level].cost);
    //replace passives::after with passives. Used to circumvent whitespace bugs.
    $b.find(".passives").each(function(a, b) {
      b.innerText = $(b).attr("data-description") || "";
      $(b).addClass("screen");
    });
  });

  $b.css("width", "auto");
  $b.appendTo($("#bgproc"));
  if ($("#savenoimage")[0].checked) {
    $b.find("img, canvas").remove();
  }
  if ($("#savenoinfo")[0].checked) {
    $b.find(".info").remove();
  }
  if ($("#savefirst")[0].checked) {
    $b.find("section:not(#base)").remove();
    $b.find("#contents").css({
      "min-width": "auto"
    });
  }
  if ($("#savecompact")[0].checked) {
    $b.find("#contents").css("flex-direction", "column");
    $b.find("section").css({
      height: "280px",
      "flex-wrap": "wrap"
    });
    $b.find(".cost+div").css({
      height: "258px",
      "min-width": "258px",
      "width": "auto",
      "margin-bottom": "0px"
    });
    $b.find("img, canvas").css("margin", "90px 0");
    $b.find(".cost+div").each(function() {
      $(this).find(".passives").each(function() {
        if (this.innerHTML !== "") this.innerHTML += "\n";
      });
      $(this).css("width", (((this.scrollWidth / 260) * 274 - 12) >>> 0) + "px");
    });
    $b.find("#contents").css({
      "min-width": "auto"
    });
  }

  setTimeout(function() {
    var $cv = $("<canvas id=\"cv\" width=\"" + ($b[0].scrollWidth + 10) + "\" height=\"" + ($b[0].scrollHeight + 10) + "\"></canvas>");
    rasterizeHTML.drawHTML(
      $b.parent().html(),
      $cv[0]
    ).then(function() {
      $("head").append($("<a href=\"" + $cv[0].toDataURL("image/png") + "\" download=\"PieceMaker-" + DATA.name + ".png\"/>")[0]);
      $("head a")[0].click();
      $("head a")[0].remove();
      clearInterval(ugh); //For unlulzing
      $("#saveimage").prop("disabled", false).text("Save Image to Computer");
      $("#saveuri").prop("disabled", false);
      $b.remove();
    });
  }, 0);
}
/** Note: There used to be a "Copy to Clipboard" function here, but seemingly no browser supports it, so I'll just leave the unique part for reference.
 *
 *function(){$("head").append($("<img src=\""+$cv[0].toDataURL("image/png")+"\"/>")[0]);var $ra = document.createRange(); $ra.selectNode($("head img")[0]); window.getSelection().addRange($ra); document.execCommand("copy"); $("head img")[0].remove();}); //*/

$("#saveuri").click(function() {
  if ($("#saveuri")[0].checked) {
    $("#saveimage").text("Save Image as URI");
  } else {
    $("#saveimage").text("Save Image to Computer");
  }
});
$("#saveimage").click(function() {
  screensave();
});
$("#exj").click(function() {
  $("#code").val(toCSV(DATA));
});
$("#exjh").click(function() {
  var uri = {
    q: toCSV(DATA)
  };
  if (CUSTOM) uri.c = CUSTOM;
  history.replaceState("", "", "index.html?" + $.param(uri));
});
$("#imj").click(function() {
  var code = $("#code").val();
  validate(code);
});
$("input, button").prop("disabled", false);


$("#hsc").click(function() { // main_gi: Hide/show cost
  if ($(".cost").css("display") != "none") {
    $(".cost").css("display", "none");
    $("#hsc")[0].innerHTML = "Hide/Show Cost (hidden)";
  } else {
    $(".cost").css("display", "initial");
    $("#hsc")[0].innerHTML = "Hide/Show Cost (shown)";
  }
  
});
$("#hst").click(function() { // main_gi: Hide/show type
  if ($(".info").css("display") != "none") {
    $(".info").css("display", "none");
    $("#hst")[0].innerHTML = "Hide/Show Type (hidden)";
  } else {
    $(".info").css("display", "initial");
    $("#hst")[0].innerHTML = "Hide/Show Type (shown)";
  }
  
});


// All of these shit is created thanks to main_gi, the ultimate destroyer of the whole script of PM.
// main_gi: You're welcome!

function toCSV() {
  function ep(a) { //The EverythingParser: I'M SO FUCKING TIRED OF THINKING SOLUTIONS
    switch (typeof a) {
      case "boolean":
        return a.toString();
      case "number":
        return a + "";
      case "string":
        return a.replace(/\\/g, "\\b").replace(/\n/g, "\\n").replace(/,/g, "\\a").replace(/:/g, "\\o");
      case "object":
        if (a.constructor == Array)
          return a.map((t) => ep(t)) + "";
        else
          return Object.keys(a).map((t) => ep(t) + ":" + ep(a[t])) + "";
      case "undefined":
        return "";
    }
  }
  var csv = "";
  csv += [ep(DATA.name), ep(DATA.labels.rank), ep(DATA.labels.faction), ep(DATA.labels.rarity)] + "\n";
  csv += ep(DATA.sketch) + "\n";
  _.forEach(LEVELS, function(level) {
    var SDATA = DATA[level];
    csv += [ep(SDATA.cost), ep(SDATA.passives), ep(SDATA.moves)] + "\n";
  });
  _.forEach(Object.keys(DATA.custom), function(id) {
    var SDATA = DATA.custom[id];
    // var colorString = [].concat(SDATA.color, SDATA.color2, SDATA.color3, SDATA.color4).map(x => (256+x).toString(16).slice(1)).join("");
    csv += [ep(SDATA.id), ep(SDATA.text), ep(SDATA.symbol1), ep(SDATA.symbol2), ep(SDATA.color), ep(SDATA.color2), ep(SDATA.color3), ep(SDATA.color4), ep(SDATA.nobox)] + "\n";
  });
  return csv;
}

function toJSON(a) {
  function pe(foepyt) { //The PatternExtractor: IDK WHAT IM DOING HLEP
    var b;
    switch (foepyt) {
      case "boolean":
        a.replace(/^(.*?)(,|\n|$)([\S\s]*)/, function(s1, s2, s3, s4) {
          b = s2;
          a = s4;
        });
        return b === "true";
      case "number":
        a.replace(/^(.*?)(,|\n|$)([\S\s]*)/, function(s1, s2, s3, s4) {
          b = s2;
          a = s4;
        });
        return Number(b);
      case "character":
        a.replace(/^(.*?)(,|\n|$)([\S\s]*)/, function(s1, s2, s3, s4) {
          b = s2;
          a = s4;
        });
        return up(Array.from(b)[0] || "");
      case "string":
        a.replace(/^(.*?)(,|\n|$)([\S\s]*)/, function(s1, s2, s3, s4) {
          b = s2;
          a = s4;
        });
        return up(b);
      case "array":
        a.replace(/^(.*?)(\n|$)([\S\s]*)/, function(s1, s2, s3, s4) {
          b = s2;
          a = s4;
        });
        return b.split(",").map(function(t) {
          return up(t);
        }).filter(function(t) {
          return t !== "";
        });
      case "color":
        a.replace(/^(.*?),(.*?),(.*?)(,|\n|$)([\S\s]*)/, function(s1, s21, s22, s23, s3, s4) {
          b = [s21, s22, s23];
          a = s4;
        });
        return _.map(b, t => +t);
      case "object":
        a.replace(/^(.*?)(\n|$)([\S\s]*)/, (s1, s2, s3, s4) => {
          b = s2;
          a = s4;
        });
        return b.split(",").reduce((p1, p2) => {
          p2.replace(/^(.*?):(.*)/, (s1, s2, s3) => {
            p1[up(s2)] = up(s3);
          });
          return p1;
        }, {});
    }
  }

  function up(t) {
    return t.replace(/\\n/g, "\n").replace(/\\a/g, ",").replace(/\\o/g, ":").replace(/\\b/g, "\\");
  }
  var data = {
    name: pe("string"),
    labels: {
      rank: pe("string"),
      faction: pe("string"),
      rarity: pe("string")
    },
    sketch: pe("array"),
    custom: {}
  };
  _.forEach(LEVELS, function(level) {
    data[level] = {
      cost: pe("number"),
      passives: pe("string"),
      moves: pe("object")
    };
  });
  var tmp = a,
    tmz = a.match(/^.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?$/mg);
  if (tmz) _.forEach(tmz, function(t) {
    a = t;
    var id = pe("string");
    if (!MOVES[IMOVE[id]]) throw ({
      message: "Invalid moveSquare ID detected"
    });
    data.custom[id] = {
      id: id,
      name: MOVES[IMOVE[id]].name,
      text: pe("string"),
      symbol1: pe("character"),
      symbol2: pe("character"),
      color: pe("color"),
      color2: pe("color"),
      color3: pe("color"),
      color4: pe("color"),
      nobox: pe("boolean")
    };
  });
  a = tmp;
  return data;
}

function validate(source) {
  try { //Tests:
    console.log(source);
    DATA = toJSON(source); //Syntax test
    restore();
  } catch (e) {
    console.log(e);
    document.body.setAttribute("mode", "share");
    //$("#code").val("Error! " + e.message);
  }
}
//Save and Restore Functions

function saveImage() {
  DATA.sketch = sketch.actions;
}

function dirty() {
  return DATA;
}

function restore() {
  let prevaction = ACTION
  restoreName();
  restoreCustom();
  restoreMoves();
  restoreDisplay();
  restoreCost();
  restoreLabels();
  restorePassives();
  restoreImage();
  ACTION = prevaction;
  loadMove(MOVES[SMOVE[prevaction]]); // main_gi: There seems to be an import bug with actions, I'm pretty sure this fixes it
}

function restoreName() {
  if (DATA.name === undefined) DATA.name = "PieceName";
  $("#name").text(DATA.name);
  $("#plus .name").text(DATA.name + "+");
  $("#plusplus .name").text(DATA.name + "++");
  $("#plusplusplus .name").text(DATA.name + "+++");
}

function restoreImage() {
  if (!DATA.sketch) return;
  sketch.actions = DATA.sketch;
  sketch.redraw();
}

function restoreDisplay() {
  for (var l = 0; l < 4; l++) {
    for (var i = 0; i < Object.keys(SMOVE).length; i++) {
      removeDisplay(LEVELS[l], Object.keys(SMOVE)[i]);
    }
  }
  $("section").each(function() {
    var level = this.id;
    _.forEach(Object.keys(DATA[level].moves), function(cls) {
      setDisplay(level, MOVES[IMOVE[cls]].name);
    });
  });
}

function restoreMoves() {
  for (var l = 0; l < 4; l++) {
    updateSVG(l);
    for (var i = 0; i < 225; i++) {
      if (getSpell(i).dataset) {
        getSpell(i).remove();
      }
    }
    var curMoves = DATA[LEVELS[l]].moves;
    var impList = {};
    var obKeys = Object.keys(curMoves);
    for (var i = 0; i < obKeys.length; i++) {
      impList[IMOVE[obKeys[i]]] = curMoves[obKeys[i]].match(/../g) || [];
    }
    obKeys = Object.keys(impList);
    for (var i = 0; i < obKeys.length; i++) {
      var coords = impList[obKeys[i]];
      loadMove(MOVES[obKeys[i]]);
      for (var j = 0; j < impList[obKeys[i]].length; j++) {
        setSpellOnBoard(parseInt(impList[obKeys[i]][j], 15));
      }
    }
  }
}

function restoreCost() {
  _.forEach(LEVELS, function(level) {
    $("#" + level + " .cost input").val(DATA[level].cost);
  });
}

function restoreLabels() {
  if (!DATA.labels) DATA.labels = {};
  for (var label in LABELS) {
    $(".info span." + label).text(DATA.labels[label] || LABELS[label][0]);
  }
}

function restorePassives() {
  for (var level in LEVELS) {
    curPASSIVE = LEVELS[LEVELS.length - level - 1];
    var p = DATA[curPASSIVE].passives || "";
    setPassive(p, curPASSIVE);
    var $d = $("#" + curPASSIVE + " .passives");
    $d.text($d.attr("data-raw"));
  }
  curPASSIVE = "base";
}

function restoreCustom() {
  if (!DATA.custom) return;
  for (var moves in DATA.custom) {
    var movename = DATA.custom[moves].name;
    Object.assign(MOVES[SMOVE[movename]], DATA.custom[moves]);

    loadMove(DATA.custom[moves]);
    document.getElementById("spell-"+movename).remove();
    document.getElementById("defs").insertAdjacentHTML("beforeend", makeSpellSVG());

    $(".moves ." + movename).attr("data-description", MOVES[SMOVE[movename]].text);
  }
}

$("#action svg, .cusmodalbody .moves.gallery svg").mouseenter(function () {
  tooltip.style.top = this.getBoundingClientRect().top + 20 + "px";
  tooltip.style.left = this.getBoundingClientRect().left - 5 + "px";
  tooltip.style.visibility = "visible";
  tooltip.innerText = this.dataset.description;
});
$("#action svg, .cusmodalbody .moves.gallery svg").mouseleave(function () {
  tooltip.style.visibility = "hidden";
});
if ($("#code").val()) validate($("#code").val());


// main_gi: The majority of the above code is to "restore" things, for the export/import feature.
// main_gi: However, I want to make custom troll pieces and a gallery, so:

!function(a,b,c,d,e,f,g,h,i){function j(a){var b,c=a.length,e=this,f=0,g=e.i=e.j=0,h=e.S=[];for(c||(a=[c++]);d>f;)h[f]=f++;for(f=0;d>f;f++)h[f]=h[g=s&g+a[f%c]+(b=h[f])],h[g]=b;(e.g=function(a){for(var b,c=0,f=e.i,g=e.j,h=e.S;a--;)b=h[f=s&f+1],c=c*d+h[s&(h[f]=h[g=s&g+b])+(h[g]=b)];return e.i=f,e.j=g,c})(d)}function k(a,b){var c,d=[],e=typeof a;if(b&&"object"==e)for(c in a)try{d.push(k(a[c],b-1))}catch(f){}return d.length?d:"string"==e?a:a+"\0"}function l(a,b){for(var c,d=a+"",e=0;e<d.length;)b[s&e]=s&(c^=19*b[s&e])+d.charCodeAt(e++);return n(b)}function m(c){try{return o?n(o.randomBytes(d)):(a.crypto.getRandomValues(c=new Uint8Array(d)),n(c))}catch(e){return[+new Date,a,(c=a.navigator)&&c.plugins,a.screen,n(b)]}}function n(a){return String.fromCharCode.apply(0,a)}var o,p=c.pow(d,e),q=c.pow(2,f),r=2*q,s=d-1,t=c["seed"+i]=function(a,f,g){var h=[];f=1==f?{entropy:!0}:f||{};var o=l(k(f.entropy?[a,n(b)]:null==a?m():a,3),h),s=new j(h);return l(n(s.S),b),(f.pass||g||function(a,b,d){return d?(c[i]=a,b):a})(function(){for(var a=s.g(e),b=p,c=0;q>a;)a=(a+c)*d,b*=d,c=s.g(1);for(;a>=r;)a/=2,b/=2,c>>>=1;return(a+c)/b},o,"global"in f?f.global:this==c)};if(l(c[i](),b),g&&g.exports){g.exports=t;try{o=require("crypto")}catch(u){}}else h&&h.amd&&h(function(){return t})}(this,[],Math,256,6,52,"object"==typeof module&&module,"function"==typeof define&&define,"random");
// this is the min.js for http://davidbau.com/archives/2010/01/30/random_seeds_coded_hints_and_quintillions.html

function l(x){console.log(x)}
function r(randomed, min, max) {
  if (max == null) {max = min; min = 0}
  if (max < min) {return max}
  min = Math.ceil(min); max = Math.floor(max); return Math.floor(randomed * (max - min + 1)) + min; // Fully inclusive
}

// main_gi: Time to smear my r() function into everything I touch.


function numify (x) {return parseInt(x, 10)}
function tob15 (x) {rv = numify(x).toString(15); return (rv.length==1?"0":"") + rv} // adds the zeros

function x (i) {
  return (i % 15) - 7
}
function y (i) {
  return Math.floor(i / 15) - 7
}
function fixxy (x, y) {return (x+7) + (y+7)*15} // gets x and y back into a number from 0-225
function pm (x, y, symmetry="none") {
  rv = [tob15(fixxy(x, y))]
  if (symmetry == "horizontal") {
    rv = rv.concat(tob15(fixxy(-x, y)))
  } else if (symmetry == "full") {
    rv = rv.concat(tob15(fixxy(-x, y)))
    rv = rv.concat(tob15(fixxy(x, -y)))
    rv = rv.concat(tob15(fixxy(-x, -y)))
    rv = rv.concat(tob15(fixxy(y, x)))
    rv = rv.concat(tob15(fixxy(-y, x)))
    rv = rv.concat(tob15(fixxy(y, -x)))
    rv = rv.concat(tob15(fixxy(-y, -x)))

  }
  return [...new Set(rv)].join("") // nice hack, converts it into a set which must only contain uniques
}

function evaluatexy(x, y, action) { // Evaluates the worth of an infopanel square, depending on where it is
  let rv = 2
  // Extra value if it's forwards, but not that much
  if (MOVES[action].text.toLowerCase().includes("after") && MOVES[action].text.toLowerCase().includes("turns")) { // TM
    rv += (y<1? (y/7):(y*y/16))
  } else if (!MOVES[action].text.includes("unable to act") && (MOVES[action].text.includes("(Magic)") || MOVES[action].text.includes("(Unblockable)"))) {
    rv += (y<1? (y/7):(y*y))
  } else {
    rv += (y<1? (y/7):1)
  }

  if (y == 0) {rv -= 0.5}
  if (x == 0) {rv = rv/2} // if x is zero there's only 1 instead of 2 spots

  if (rv < 0.5) {rv = 0.5} // not too low...
  return rv
}

let lastCEOversion = "v" + Math.max(...Object.keys(CEO).map(x => numify(x.slice(1)))) // WHAT A HACK LMAOOO. Gets the highest named key.
// Have to put it here cause something else uses it

let randomsuffixes = ["ae", "a", "e", "o", "ung", "nt", "og", "sh", "shine", "place", "doke", "marr", "sen", "xo", "ox", "la", "nu", "inpai", "ushi", "unga", "onga", "ish", "ocho", "onti", "peku", "nura", "siba", "su", "luka", "coco", "no", "uper", "oob", "sucker", "eater", "butt", "dog", "ten", "life", "ushiga", "yamoto", "smol", "uwa", "pora", "nga", "nya", "chya", "yang", "tong", "ren", "nin", "m", "kek", "ke", "pper", "llula", "lust", "saga", "nori", "mura", "yuki", "ntacle", "norse", "indi", "blyat"]

let fnkobtc = (a, b) => [].concat(...a.map(a => b.map(b => [].concat(a, b))));
let cartesian = (a, b, ...c) => b ? cartesian(fnkobtc(a, b), ...c) : a; // https://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript

let allgridspots = cartesian([0,1,2,3,4,5,6,7],[0,1,2,3,4,5,6,7]).slice(1)
let onlyUnique = (x) => Object.values(x.reduce((p,c) => (p[JSON.stringify(c)] = c,p),{})); // https://stackoverflow.com/a/57564376

function arraysequal(a, b) { // https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
} // THANKS JAVASHIT

function allSymmetries (array, symmetry="full") { // NOTE: This is an array that contains pairs. [2,-1] will not work, you need [[2,-1]] at least.
  if (symmetry == "full") {
    rv = array.map(x=>[[x[0], x[1]], [-x[0], x[1]], [x[0], -x[1]], [-x[0], -x[1]], [x[1], x[0]], [-x[1], x[0]], [x[1], -x[0]], [-x[1], -x[0]]])
    return rv;
  } else if (symmetry == "horizontal") {
    rv = array.map(x=>[[x[0], x[1]], [-x[0], x[1]]])
    return rv;
  }
}

function limitGridSpots(array, symmetry="full") { // inversion of allSymmetries
  if (symmetry == "full") {
    return array.filter(x=>x[0] >= x[1]) // Yup it was that simple. We only get the ones where the first number is greater.
  } else if (symmetry == "horizontal") {
    return array.filter(x=>x[0] >= 0)
  }
}

function legitSpotsOnly(array) {
  return array.filter(x=>!(x[0] == 0 && x[1] == 0) && Math.abs(x[0]) < 8 && Math.abs(x[1]) < 8) // not [0, 0], nothing above 8 or below -8
}

function convertToSymmetry(array, symmetry="full") {
  if (symmetry == "full") {
    return onlyUnique(array.map(x=>[Math.abs(x[0]), Math.abs(x[1])][0] > [Math.abs(x[0]), Math.abs(x[1])][1]?
      [Math.abs(x[0]), Math.abs(x[1])] : [Math.abs(x[1]), Math.abs(x[0])]))
  } else if (symmetry == "horizontal") {
    return onlyUnique(array.map(x=>[Math.abs(x[0]), x[1]]))
  }
}

function arraysubtract(array, brray) { // B array, lol
  rv = []
  for (i = 0; i < array.length; i++) {
    let insidebrray = false;
    for (j = 0; j < brray.length; j++) {if (arraysequal(array[i], brray[j])) {insidebrray = true}}
    if (insidebrray == false) {rv.push(array[i])}
  }
  return rv
} // javascript trash, the "filter includes" solution doesn't work


function arrayindexof(arr, val, comparer=arraysequal) { // https://stackoverflow.com/questions/10260165/javascript-indexof-for-an-array-of-arrays-not-finding-array // ISN'T JS GREAT!!!

    for (var i = 0, len = arr.length; i < len; ++i) { // why use ++i you are really crazy
        if ( i in arr && comparer(arr[i], val) ) {
            return i;
        }
    }
    return -1;
}

// I like how all these shitty array functions don't work as normal functions so they're still broken

function cleanseforexport (a) {
  return a.replace(/\\/g, "\\b").replace(/\n/g, "\\n").replace(/,/g, "\\a").replace(/\:/g, "\\o").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}



function makepiece(seed) { // Somehow I feel like this being in my life is a reference to me having played Layton Brothers several years ago (a character's name being Keelan Makepeace)
  let rng = new Math.seedrandom(seed);

  // First, define the themes:
  let themes = []
  let genericpassives = ["(Status-Immune).", "(Magic-Immune).", "(Ranged-Immune).", "Immune to Freeze.", "Immune to Poison.", "Immune to Petrify.", "Immune to Compel.", "(Displacement-Immune).", "On Kill: Lose # morale.", "On Death: Lose # morale.", "Does not block movement.", "Vanishes after attacking.", "On Melee Death: Destroy the attacker.", "Cannot be targeted by enemy minions.", "Blocks one ability.", "Destroyed on Freeze.", "Cannot move until turn 3.", "(Melee-Immune)."].map(x=>cleanseforexport(x))
  let passivecosts = [0.5, 0.5, 0.5, 0.2, 0.2, 0.2, 0.2, 0, -1.5, -2, -0.5, -2, 5, 7, 6, 0, -1, 15]

  let nongenericpassives = ["On Death: Kill all adjacent ally units.", "On Death: Petrify all adjacent ally units for 5 turns.", "On Kill: Kill all adjacent ally units.", "On Death: Enchant adjacent ally units for 2 turns.", "Cannot attack enemy units on your opponent's side of the field.", "Cannot attack enemy units until turn 200.", "Cannot attack enemies of lesser value than itself.", "Wins the game if it promotes.", "On Kill: Gains 6 value.\\nBeyond move 20, this unit loses 1 value per turn. If this unit reaches 0 value it is destroyed.", "If caught between 2 adjacent enemy champions, this unit is rescued and opponent gains 5 morale.", "(Status-Immune).\\n(Max Value: #).\\nOn Magic: All ally Tombstones gain 1 value.\\nRange 2 Augmented: Summon Skeleton at the location of a fallen ally and remove death location.", "Augmented: Teleport to any location adjacent to enemy King.", `On Kill: Opponent loses # morale and your King gains # value. If you do not have a King, this unit gains value instead.`, `On Kill: Swap places with enemy King.`, `On Champion Kill: Opponent loses 1 morale and this unit changes teams.`, `Made by StratShotPlayer.`, `On Kill: Transform into PieceReviver2.`, `Start of Game, On Kill, On Death: Gain # morale.`, `Cannot be Sodomy.`, `On Kill: Gain $5 in STEEM currency.`, `Cannot be targeted beyond Range 2. If targeted beyond Range 2, instantly dies.`, `On Kill: Lose 3 morale, which makes the unit unplayable trash.`, ``].map(x=>cleanseforexport(x))
  let nongenericcosts = [-12, -8, -4, 4, 6, 8, 10, 4, -3, 4, 6, 6, 2, 0, -4, 5, -1, 1, 1, -3, -3, -3, 87] // last one just makes the cost ridiculous

  let actionvalues =
  `10,3+2,7,10+4++7+++X,16+6++8+++X,7,9,14,9,8,1+3,
  5+7++X,6,5,11++7,10,1+5,20,35,5,12`.split(",") // only intuition behind the numbers, not logic

  // + means bonus value at range 2 forwards
  // ++ means bonus value at range 3 forwards: if X then don't put it there!
  // +++ means bonus value at range 4 forwards

  var randoms = Array.from({length: 700}, () => rng()); // Big list of random numbers that'll stay the same

  function rr(i, shiftoverby=2) {
    while (randoms[i] == 0 && i < randoms.length) {i++}
    randoms[i] = randoms[i]*(Math.pow(10, shiftoverby)) - Math.trunc(randoms[i]*(Math.pow(10, shiftoverby)))
  } // "Reset"s the value by dropping two of its digits. I can use about 24 of these before the variable just dies, in which it'll be replaced with the next one then
  // rr() is a declarative function based on randoms

  function arrayToX(number) {rv = []; for (var i = 0; i <= number; i++) {rv.push(i)}; return rv} // creates [0, 1, 2, ..., X]
  function arrayspamming(value, len) {return Array.from({length: len}).map(x => value)} // array spammed with a value, length times

  function shuffleArray(array, seednumber) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(randoms[seednumber] * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
      if (randoms[seednumber] == 0) {seednumber++}
      rr(seednumber)
    }
    return array
  } // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array/18650169#18650169



  let minionorchampion = r(randoms[0], 1) // Minion or Champion? (Champion is 1)
  let xr; // dummy number
  xr = r(randoms[2], 40)
  let rarity = (xr<10)?"Common":(xr<20)?"Rare":(xr<30)?"Epic":"Legendary" // Minion or Champion? (Champion is 1)
  let costs = [0,0,0,0];
  let passives = ["", "", "", ""];
  let movesets = [[], [], [], []];

  if (r(randoms[25], 20) > 15) { // Get a passive first, very low chance
    rr(25); let passivepicked = r(randoms[25], genericpassives.length-1); // passivepicked is an index
    rr(25);
    passives = passives.map(x => genericpassives[passivepicked].replace("#", r(randoms[25], 2, 6).toString() + `[+${r(randoms[26], 1, 34)}]`)) // the "lose morale" number
    costs[0] += passivecosts[passivepicked]
  }
  rr(25); rr(26)
  if (r(randoms[25], 20) > 18) { // non generic passive (added on)
    rr(25); let passivepicked = r(randoms[25], nongenericpassives.length-1); // passivepicked is an index
    rr(25);
    passives = passives.map(x => (x.length>0? x+"\\n":"") + nongenericpassives[passivepicked].replace("#", r(randoms[25], 2, 6).toString() + `[+${r(randoms[26], 1, 34)}]`)) // the "lose morale" number
    costs[0] += nongenericcosts[passivepicked]
  }

  let actionstouse = r(randoms[50], 1, 4); rr(50) // This is the NUMBER of random actions involved
  let shuffledactions = shuffleArray(arrayToX(182).slice(6), 50).filter(x=>!MOVES[x].text.includes("random") && !(MOVES[x].text == "Ability Target.") && (minionorchampion || !MOVES[x].text.includes("starting position"))).slice(0, actionstouse) // Remove the first 6 'basic' abilities, we'll use them later
  if (shuffledactions.filter(x => MOVES[x].text.includes("Ability Target")).length > 0 && !shuffledactions.includes(26-1)) {shuffledactions = ([26-1]).concat(shuffledactions)} // number of Ability Target. -1 is a reminder that it's "25" in this code
  // Shuffle an array that goes [0, 1, 2, 3, ...] using a random seed number, then take the first few, which simulates picking that many random elements 
  // The filters are: no random, and no "starting position" unless minion











  // Generate an array ONLY CONSISTING of good grid spaces.

  let symmetrytype = (r(randoms[20], 0, 3) != 0)?"full":"horizontal"; rr(20)

  if (minionorchampion == 0 && symmetrytype == "full" && (r(randoms[20], 0, 3) != 0)) {symmetrytype = "horizontal"}; rr(20)

  let goodgridspots = cartesian([0,1,2,3],[0,-3,-2,-1,1,2,3]).slice(1).concat([4,5,6,7].map(x=>[x,x])).concat([4,5,6,7].map(x=>[x,0])).concat([4,5,6,7].map(x=>[0,x]))
  // That "slice(1)" is to get rid of the 0,0 lol
  if (symmetrytype == "full") {goodgridspots = limitGridSpots(goodgridspots, "full")}
  if (minionorchampion == 0) {goodgridspots = goodgridspots.filter(x=>Math.abs(x[0]) <= 2 && x[1] >= -1 && x[1] <= 3)} // limit to range 3 if minion, and limit backwards movement to only 1


  // Generate GENERIC squares

  let genericactions = shuffleArray(arrayToX(5), 41).slice(0, r(randoms[40], 0, 2)) // 0-2 random actions
  let genericactionassignments = [] // list with [3, 2], [3, 3] etc
  let genericactionassignments2 = [] // another list like that, but if there were 2 random actions picked
  
  if (genericactions.length != 0) {
    let rangelimit = minionorchampion==0? 2:7

    let horizontal = r(randoms[40], 0, rangelimit); rr(40)
    let vertical = r(randoms[40], 0, rangelimit); rr(40)
    let diagonal = r(randoms[40], 0, rangelimit); rr(40)

    let hDisplace = (r(randoms[40], 0, 6)==6? 1:0); rr(40) // displace should be rare (1/7 chance right now)
    let vDisplace = (r(randoms[40], 0, 6)==6? 1:0); rr(40)
    let dDisplace = (r(randoms[40], 0, 6)==6? 1:0); rr(40)
    //l(horizontal); l(vertical); l(diagonal); l(hDisplace); l(vDisplace); l(dDisplace)

    genericactionassignments = [].concat(arrayToX(horizontal).slice(hDisplace).map(x=>[0, x+hDisplace]), arrayToX(vertical).slice(vDisplace).map(x=>[x+vDisplace, 0]), arrayToX(diagonal).slice(dDisplace).map(x=>[x+dDisplace, x+dDisplace]))
    genericactionassignments = onlyUnique(limitGridSpots(legitSpotsOnly(genericactionassignments), symmetrytype), symmetrytype)

    if (genericactions.length == 2) {
      let horizontal2 = r(randoms[40], 1, rangelimit-horizontal); rr(40)
      let vertical2 = r(randoms[40], 1, rangelimit-vertical); rr(40)
      let diagonal2 = r(randoms[40], 1, rangelimit-diagonal); rr(40)
      genericactionassignments2 = [].concat(arrayToX(horizontal2).slice(hDisplace+horizontal).map(x=>[0, x+hDisplace+horizontal]), arrayToX(vertical2).slice(vDisplace+vertical).map(x=>[x+vDisplace+vertical, 0]), arrayToX(diagonal2).slice(dDisplace+diagonal).map(x=>[x+dDisplace+diagonal, x+dDisplace+diagonal]))
      genericactionassignments2 = onlyUnique(limitGridSpots(legitSpotsOnly(genericactionassignments2), symmetrytype), symmetrytype)
      if (genericactionassignments2.length == 0) {genericactions.slice(0, 1)} // whoops, no action!
    } // The idea is that the 2nd generic action comes after the first one
    // These are full symmetric no matter what. We include ALL valid numbers
  }



  let atomstouse = r(randoms[100], actionstouse, 5); rr(100) // This is the NUMBER of random actions involved

  let shuffledgridspots = shuffleArray(goodgridspots, 75)
  let selectedgridspots = shuffledgridspots.slice(0, atomstouse)
  selectedgridspots = arraysubtract(convertToSymmetry(selectedgridspots), genericactionassignments.concat(genericactionassignments2))

  // Now assign the actions to the grid spots?
  let actionassignments = []
  for (let i = 0; i < selectedgridspots.length; i++) {
    actionassignments[i] = shuffledactions[i%shuffledactions.length] // They're already both shuffled, so no extra random needed!
  }

  //l(genericactions); l(genericactionassignments); l(genericactionassignments2); l(randoms[40])
  //l(selectedgridspots); l(actionassignments)  // Incorporate the generic moveset into the assignments and grid spots!
  shuffledactions = shuffledactions.concat(genericactions)
  selectedgridspots = selectedgridspots.concat(genericactionassignments, genericactionassignments2)
  actionassignments = actionassignments.concat(arrayspamming(genericactions[0], genericactionassignments.length), arrayspamming(genericactions[1], genericactionassignments2.length))


  // Short explanation: "shuffledactions" is an array of all the ID's involved. [0, 1, 2] means [Move or Attack, Move only, Attack only], as ordered in the piecemaker.
  // "selectedgridspots" is an array of pairs of numbers, corresponding to the grid. [[0, 1], [2, 3], [4, 4]], for instance. These numbers must correctly correspond to the symmetry type - if it's full symmetry, [0, 1] and [1, 0] in this same list will cause errors.
  // "actionassignments" is an array of the same length as selectedgridspots. Each element is the same as the ID of one of the shuffledactions, corresponding to it.


  function finalMoveMaker() {
    differentsymmetry = actionassignments.map(x => symmetrytype) // list full of same symmetry as type
    let finalmoveset = ""
    for (let i = 0; i < shuffledactions.length; i++) {
      if (!actionassignments.includes(shuffledactions[i])) {continue} // ???
      finalmoveset = finalmoveset + MOVES[shuffledactions[i]].id + ":"
      for (let j = 0; j < actionassignments.length; j++) {
        if (actionassignments[j] == shuffledactions[i]) {
          if (shuffledactions[i] == 26-1 || shuffledactions[i] == 25-1) {
            differentsymmetry[j] = "none";
            if (selectedgridspots[j][0] != 0) {
              for (let k = 1; k <= 7; k++) { // Loop from 1 to 7 to see if we can get a forwards ability target anywhere
                if (arrayindexof(selectedgridspots, [0, k]) == -1) {
                  selectedgridspots[j][0] = 0; selectedgridspots[j][1] = k; break
                }
              }
            }
          } // action 26-1 = "Ability Target", which cannot be sideways ever.
          // TODO: still an issue where you can get 2x ability targets probably, but whatever
          // Also added 25-1, the samurai autoattack. It also can't be sideways due to horizontal symmetry + ambiguigutiuty

          if (differentsymmetry[j] != symmetrytype) {
            finalmoveset = finalmoveset + pm(selectedgridspots[j][0], -selectedgridspots[j][1], differentsymmetry[j])
          } else {
            finalmoveset = finalmoveset + pm(selectedgridspots[j][0], -selectedgridspots[j][1], symmetrytype) // y is flipped?? fixed
          }
        }
      }
      finalmoveset = finalmoveset + ","
    }
    return finalmoveset.replace(/,$/, "") // remove the last comma
  }
  movesets[0] = finalMoveMaker()
  costs[0] = costs[0] + (movesets[0].length/4 + r(randoms[30], -3, 3))
  costs = costs.map(x=>costs[0])

  // Okay now make the +, ++, and +++ tiers with GRAND DESIGN
  // + tier: extra move only
  // ++ tier: king attack
  // +++ tier: knight teleports, valk teleports, knight swaps, king swaps

  let weave = (a, b) => a.length ? [a[0], ...weave(b, a.slice(1))] : b; // https://stackoverflow.com/questions/10308012/combine-two-arrays-in-a-zipping-fashion-javascript/55077593

  // Find the first open spot to give move onto

  let upgradeamount = r(randoms[150], 1, 7); rr(150)
  if (upgradeamount >= 5) {upgradeamount = 1}

  let scanspots = (legitSpotsOnly(weave(arrayToX(7).map(x => [x,x]), (arrayToX(7).map(x => [x,0])))))
  for (let k=0; k < upgradeamount; k++) {
    for (let i=0; i < scanspots.length; i++) {
      if (arrayindexof(selectedgridspots, scanspots[i]) == -1) {
        selectedgridspots.push(scanspots[i]); actionassignments.push(1); shuffledactions.push(1); shuffledactions = onlyUnique(shuffledactions)
        break
      } else if (arraysequal(scanspots[i], [2, 2]) && arrayindexof(selectedgridspots, [2, 1]) == -1) { // The knight move is missing? Let's put it in!
        selectedgridspots.push([2, 1]); actionassignments.push(5);
        if (symmetrytype == "horizontal") {selectedgridspots.push([1, 2]); actionassignments.push(5)}
        shuffledactions.push(5); shuffledactions = onlyUnique(shuffledactions); break
      }
    }
  }


  movesets[1] = finalMoveMaker()
  costs[1] = costs[0] + upgradeamount + r(randoms[125], 0, 2); rr(125)

  upgradeamount = r(randoms[150], 1, 7); rr(150)
  if (upgradeamount >= 5) {upgradeamount = 1}


  for (let k=0; k < upgradeamount; k++) {
    for (let i=0; i < scanspots.length; i++) {
      let scan = arrayindexof(selectedgridspots, scanspots[i])
      if (scan == -1) {
        selectedgridspots.push(scanspots[i]); actionassignments.push(2); shuffledactions.push(2); shuffledactions = onlyUnique(shuffledactions)
        break
      } else if (actionassignments[scan] == 1 || actionassignments[scan] == 2) { // Move only / attack only, upgrade it to move or attack
        actionassignments[scan] = 0; shuffledactions.push(0); shuffledactions = onlyUnique(shuffledactions); break
      } else if (actionassignments[scan] == 5) { // Teleport. upgrade to jump
        actionassignments[scan] = 3; shuffledactions.push(3); shuffledactions = onlyUnique(shuffledactions); break
      } else if (arraysequal(scanspots[i], [2, 2]) && arrayindexof(selectedgridspots, [2, 1]) == -1) { // Knight attack is missing? Let's put it in!
        selectedgridspots.push([2, 1]); actionassignments.push(52);
        if (symmetrytype == "horizontal") {selectedgridspots.push([1, 2]); actionassignments.push(52)}
        shuffledactions.push(52); shuffledactions = onlyUnique(shuffledactions); break
      } else if (arraysequal(scanspots[i], [2, 2]) && actionassignments[arrayindexof(selectedgridspots, [2, 1])] == 5) { // Knight teleport? Upgrade it to move+attack!
        actionassignments[arrayindexof(selectedgridspots, [2, 1])] = 3; shuffledactions.push(3);
        if (symmetrytype == "horizontal" && arrayindexof(selectedgridspots, [1, 2])) {actionassignments[arrayindexof(selectedgridspots, [1, 2])] = 3}
        shuffledactions = onlyUnique(shuffledactions); break
      }
    }
  }

  movesets[2] = finalMoveMaker()
  costs[2] = costs[1] + upgradeamount + r(randoms[125], 0, 2); rr(125)


  upgradeamount = r(randoms[150], 1, 10); rr(150)
  if (upgradeamount >= 5 && upgradeamount != 10) {upgradeamount = 1}

  scanspots = (legitSpotsOnly(weave(arrayToX(7).map(x => [x,0]), arrayToX(7).map(x => [x,x])))) // switch to axials first

  for (let k=0; k < upgradeamount; k++) {
    for (let i=0; i < scanspots.length; i++) {
      let scan = arrayindexof(selectedgridspots, scanspots[i])
      if (scan == -1) {
        selectedgridspots.push(scanspots[i]); actionassignments.push(0); shuffledactions.push(0); shuffledactions = onlyUnique(shuffledactions) // RANDOM ATTACKS!
        break
      } else if (actionassignments[scan] == 0) { // Upgrade move/attack to swap, but 1/7 the time upgrade it to armor
        let swaporarmor = r(randoms[301], 6)!=6? 4:34; rr(301)
        actionassignments[scan] = swaporarmor; shuffledactions.push(swaporarmor); shuffledactions = onlyUnique(shuffledactions); break

      } else if (arraysequal(scanspots[i], [2, 0]) && actionassignments[arrayindexof(selectedgridspots, [2, 1])] == 5) { // Knight teleport? Upgrade it to teleswap
        actionassignments[arrayindexof(selectedgridspots, [2, 1])] = 30; shuffledactions.push(30);
        if (symmetrytype == "horizontal" && arrayindexof(selectedgridspots, [1, 2])) {actionassignments[arrayindexof(selectedgridspots, [1, 2])] = 30}
        shuffledactions = onlyUnique(shuffledactions); break

        shuffledactions.push(52); shuffledactions = onlyUnique(shuffledactions); break
      } else if (arraysequal(scanspots[i], [2, 0]) && actionassignments[arrayindexof(selectedgridspots, [2, 1])] == 3) { // Knight jump? SWAPPPPP
        actionassignments[arrayindexof(selectedgridspots, [2, 1])] = 4; shuffledactions.push(4);
        if (symmetrytype == "horizontal" && arrayindexof(selectedgridspots, [1, 2])) {actionassignments[arrayindexof(selectedgridspots, [1, 2])] = 4}
        shuffledactions = onlyUnique(shuffledactions); break
      } else if (arraysequal(scanspots[i], [2, 0]) && arrayindexof(selectedgridspots, [3, 1]) == -1) { // No valk teleport? Go!
        selectedgridspots.push([3, 1]); actionassignments.push(5);
        if (symmetrytype == "horizontal") {selectedgridspots.push([1, 3]); actionassignments.push(5)}
        shuffledactions.push(52); shuffledactions = onlyUnique(shuffledactions); break

      } else if (actionassignments[scan] == 1 || actionassignments[scan] == 2) { // Move only / attack only, upgrade it to jswap
        actionassignments[scan] = 4; shuffledactions.push(4); shuffledactions = onlyUnique(shuffledactions); break
      } else if (actionassignments[scan] == 5) { // Teleport. upgrade to jswap
        actionassignments[scan] = 4; shuffledactions.push(4); shuffledactions = onlyUnique(shuffledactions); break

      }

    }
  }


  movesets[3] = finalMoveMaker()
  costs[3] = costs[2] + upgradeamount + r(randoms[125], 0, 2); rr(125)














  if (minionorchampion==0 && symmetrytype == "horizontal") { // PROMOTES TO SOMETHING
    let nameinput;
    if (Math.random() > 0.5) {nameinput = nouns[r(randoms[500], nouns.length-1)]}
    else {let rv = verbs[r(randoms[501], verbs.length-1)]; if (rv.length > 3) {nameinput = rv.slice(0, r(randoms[502], rv.length-2, rv.length-3))} else {nameinput = rv};
    nameinput = nameinput + randomsuffixes[r(randoms[503], randomsuffixes.length-1)]}
    nameinput = nameinput.slice(0,1).toUpperCase() + nameinput.slice(1) // cap first letter
    passives = passives.map(x => (x.length>0? x+"\\n":"") + `Promotes to ${nameinput}[+].`)
  }



  costs = costs.map(x=>x<0? 0:Math.floor(x))




  return `${seed},${minionorchampion==0?"Minion":"Champion"},Basic,${rarity}

${costs[0]},${passives[0]},${movesets[0]}
${costs[1]},${passives[1]},${movesets[1]}
${costs[2]},${passives[2]},${movesets[2]}
${costs[3]},${passives[3]},${movesets[3]}
` // NOTE: \\o needs to be written for a colon, \\a for a newline, I think
}

function getgallery (nameinput, version=lastCEOversion) {
  let lename = nameinput.replace(/\d/, "");
  let lepiece = CEO[version][`${lename}`]
  let lepiece2 = CEO[version][`${lename}2`]
  let lepiece3 = CEO[version][`${lename}3`]
  let lepiece4 = CEO[version][`${lename}4`]
  if (lepiece === undefined || lename == "actionlist") {return} // don't output error in console

  ClanBoxList = ["Ninja","Swordsman","Spearman","Axeman","Legionary","Paladin","Berserker","Antimage","Warrior","Samurai"];
  ArcaneBoxList = ["Wizard","Bomber","Pyromancer","Banshee","Phantasm","FrostMage","Fireball","PoisonMage","SoulKeeper","WindMage","Portal","ThunderMage"];
  ForestBoxList = ["Dragon","Wisp","Guardian","Dryad","Ranger","Archer","Spider","Basilisk","Enchantress","Tiger","Drake"];
  // Hardcoded because this info is not anywhere near the piece data itself

  let pieceset = ClanBoxList.includes(lename)? "Clan":ArcaneBoxList.includes(lename)? "Arcane":ForestBoxList.includes(lename)? "Forest":"Basic"

  // Don't forget to switch 42 and 43, because the piecemaker is literally wrong here
  //function r4243 (x) {return x.replaceAll("42:", "FOURTYTHREE").replaceAll("43:","42:").replaceAll("FOURTYTHREE", "43:")}
  function r4243 (x) {return x}

  function fixpassive (x) {return x? x.replaceAll(",","\\a"):""}
  function fixoutdatedactions (x, gamegallery) { // this looks at the whole export string and adds custom actions if the current ability text does not match the old version text
    let totalmoves;
    if (lepiece2 === undefined && lepiece3 === undefined && lepiece4 === undefined) {totalmoves = lepiece.movetypespmformat.split(", ")}
    else {totalmoves = [...new Set(lepiece.movetypespmformat.split(", ").concat(lepiece2.movetypespmformat.split(", "), lepiece3.movetypespmformat.split(", "), lepiece4.movetypespmformat.split(", ")))].sort()}
    let custommovesused = 0;
    let custommovedefinitions = []

    
    for (let i=0; i < totalmoves.length; i++) {
      // The unit gallery data cleanses the passive text to properly parse newlines, so we have to do this for proper equality check
      //let thisfourtytwoandfourtythreefix = totalmoves[i]
      //if (totalmoves[i] == 42) {totalmoves[i] = 43} else if (totalmoves[i] == 43) {totalmoves[i] = 42}

      let tx1 = cleanseforexport(MOVES[numify(totalmoves[i])-1].text)
      let tx2 = gamegallery.actionlist[totalmoves[i]]
      
      l(totalmoves[i]); l("CFE " + tx1); l("GG " + tx2); l(tx1 == tx2); 

      if (tx1 != tx2) {
        //if (totalmoves[i] == 42) {totalmoves[i] = 43} else if (totalmoves[i] == 43) {totalmoves[i] = 42} // Have to fix this nonsense again.

        totalmoves[i]-- // We have to sub 1 first to get it to be accurate to the MOVES database, but we'll have to undo this after

        let y = []

        if (MOVES[totalmoves[i]].symbol1) {y.push(MOVES[totalmoves[i]].symbol1)} else {y.push("")}
        if (MOVES[totalmoves[i]].symbol2) {y.push(MOVES[totalmoves[i]].symbol2)} else {y.push("")}
        if (MOVES[totalmoves[i]].color) {y.push(MOVES[totalmoves[i]].color[0]), y.push(MOVES[totalmoves[i]].color[1]), y.push(MOVES[totalmoves[i]].color[2])} else {y.push("0", "0", "0")} // in reality this is a joke, there always is a border color

        let b = cur => Math.floor((255 - cur) / 2 + cur); // transforms a fill color into a bright equivalent by inverting each value kinda

        if (MOVES[totalmoves[i]].color2) {y.push(MOVES[totalmoves[i]].color2[0]), y.push(MOVES[totalmoves[i]].color2[1]), y.push(MOVES[totalmoves[i]].color2[2])} else {y.push(b(MOVES[totalmoves[i]].color[0])), y.push(b(MOVES[totalmoves[i]].color[1])), y.push(b(MOVES[totalmoves[i]].color[2]))}
        if (MOVES[totalmoves[i]].color3) {y.push(MOVES[totalmoves[i]].color3[0]), y.push(MOVES[totalmoves[i]].color3[1]), y.push(MOVES[totalmoves[i]].color3[2])} else {y.push(MOVES[totalmoves[i]].color[0]), y.push(MOVES[totalmoves[i]].color[1]), y.push(MOVES[totalmoves[i]].color[2])}
        if (MOVES[totalmoves[i]].color4) {y.push(MOVES[totalmoves[i]].color4[0]), y.push(MOVES[totalmoves[i]].color4[1]), y.push(MOVES[totalmoves[i]].color4[2])} else {y.push(MOVES[totalmoves[i]].color[0]), y.push(MOVES[totalmoves[i]].color[1]), y.push(MOVES[totalmoves[i]].color[2])}
        if (MOVES[totalmoves[i]].nobox) {y.push(MOVES[totalmoves[i]].nobox)} else {y.push("false")}

        totalmoves[i]++

        custommovesused++
        x = x.replaceAll("," + totalmoves[i] + ":", ",c" + custommovesused + ":")
        custommovedefinitions.push(`c${custommovesused},${gamegallery.actionlist[totalmoves[i]]},${y.join(",")}`)

        // Makes a clone of the icon for the custom ability.
        // This doesn't store the icons of past versions but the icons should just be better looking anyway.
        // The order is: symbol1, symbol2, bordercolor RED, bordercolor GREEN, bordercolor BLUE, fillcolor RED, fillcolor GREEN, fillcolor BLUE, symbol1color RED, symbol1color GREEN, symbol1color BLUE, symbol2color RED, symbol2color GREEN, symbol2color BLUE, nobox
      }
    }
    /*
    CEO[version].actionlist
    */
    return x + "\n" + custommovedefinitions.join("\n")
/* MoonFox,Champion,Basic,Legendary

9,,1:444a5559666886889599a4aa,c1:87
11,,1:333b444a5559666886889599a4aab3bb,c1:87
13,,1:222c333b444a5559666886889599a4aab3bbc2cc,c1:87
15,,1:222c333b444a5559666886889599a4aab3bbc2cc,3:67,c1:87
c1,(Trigger) On Melee Death\o Revive into this empty location with value decreased by 10. If this unit's value is less than 10this ability cannot activate.,☽,,0,0,0,255,255,255,0,0,0,0,0,0,false
*/

  }

  if (lepiece2 === undefined && lepiece3 === undefined && lepiece4 === undefined) {
    otherstuff = `0,,
0,,
0,,`
  } else {
    otherstuff = `${lepiece2.cost},${fixpassive(lepiece2.passive)},${r4243(lepiece2.movespmformat)}
${lepiece3.cost},${fixpassive(lepiece3.passive)},${r4243(lepiece3.movespmformat)}
${lepiece4.cost},${fixpassive(lepiece4.passive)},${r4243(lepiece4.movespmformat)}`
  }

  validate(fixoutdatedactions(`${lename},${lepiece.class},${pieceset},${lepiece.rarity}

${lepiece.cost},${fixpassive(lepiece.passive)},${r4243(lepiece.movespmformat)}
${otherstuff}`, CEO[version]))

}

function randint(min, max) {
  if (max == null) {max = min; min = 0}
  min = Math.ceil(min); max = Math.floor(max); return Math.floor(Math.random() * (max - min + 1)) + min; // Fully inclusive
}
function randarray(array) {return array[randint(array.length-1)]}








$("#makeceo").click(function() { // main_gi: Make Chess Evolved Online (piece)
  let nameinput = $("#nameinput").val().trim();

  if (nameinput.length == 0) {
    if (Math.random() > 0.5) {nameinput = randarray(nouns)}
    else {let rv = randarray(verbs); if (rv.length > 3) {nameinput = rv.slice(0, randint(rv.length-2, rv.length-3))} else {nameinput = rv};
    nameinput = nameinput + randarray(["ae", "a", "e", "o", "ung", "nt", "og", "sh", "shine", "place", "doke", "marr", "sen", "xo", "ox", "la", "nu", "inpai", "ushi", "unga", "onga", "ish", "ocho", "onti", "peku", "nura", "siba", "su", "luka", "coco", "no", "uper", "oob", "sucker", "eater", "butt", "dog", "ten", "life", "ushiga", "yamoto", "smol", "uwa", "pora", "nga", "nya", "chya", "yang", "tong", "ren", "nin", "m", "kek", "ke", "pper", "llula", "lust", "saga", "nori", "mura", "yuki", "ntacle", "norse", "indi", "blyat"])}
  }
  nameinput = nameinput.slice(0,1).toUpperCase() + nameinput.slice(1) // cap first letter
  $("#kocmessage").text(kocmessage(nameinput))
  $("#sspmessage").text(sspmessage(nameinput))
  if ($("#feedback")[0].style.display = "none") {
    $("#feedback")[0].style.display = "initial"
  }

  if (Object.keys(CEO[`${lastCEOversion}`]).includes(nameinput.replace(/\d/, ""))) {getgallery(nameinput)}
  else {validate(makepiece(nameinput));}
});

$("#makefc").click(function () {


})

$("#makecba").click(function() { // main_gi: Make Chess Evolved Online (piece)
  let nameinput = $("#nameinput").val().trim();
  let sspunits = [`TrielemDragon,Champion,Dragon,Epic

12,,c2:97755779,c4:6585698956589698,c1:66688688,c3:4774a77a
14,,c2:7579975767767887,c4:6585698956589698,c1:66688688,c3:4774a77a
18,,c2:7579975767767887,c4:6585695658969889,c1:6668868855599599,c3:4774a77a
20,,c2:7579975767767887,c3:4774a77a444aa4aa,c4:6585695658969889,c1:6668868855599599
c2,Ranged Wind\\o Push unit 3 spaces max\\a Freezes it 3 Turns.,◌,,95,215,255,255,255,255,95,215,255,87,218,40,false
c3,Ranged Wind\\o Shock unit 2 turns\\a used next 3 Turns in still.,◌,,255,255,95,255,255,255,255,255,0,87,218,40,false
c4,NoBlock\\o Move or Attack.,,,0,151,0,127,199,127,20,151,24,20,151,24,false
c1,Ranged Wind\\o Push unit 1 space\\a Fire Burn kills next move.,◌,,255,199,0,255,255,255,255,199,0,87,218,40,false`, `MW ChargeRod,Champion,Thunder,Rare

4,NoBlock\\o Uses all Ranged areas. Ranged 1\\o Stuns for 1 turn.,c4:79577597,c1:67787687
5,NoBlock\\o Uses all Ranged areas. Ranged 1\\o Stuns for 1 turn.,c4:79577597,c1:67787687,c5:55599599
6,NoBlock\\o Uses all Ranged areas. Ranged 1\\o Stuns for 2 turns.,c4:79577597,c1:67787687,c5:55599599
7,NoBlock\\o Uses all Ranged areas. Ranged 1\\o Stuns for 2 turns.,c4:79577597,c1:67787687,c7:55599599
c4,NoBlock\\o Move or Attack.,,,0,151,0,127,199,127,20,151,24,20,151,24,false
c1,Ranged Electric\\o Charge area. Destroy there after 2 turns.,⚡,,0,0,0,255,255,255,255,255,0,87,218,40,false
c7,NoBlock\\o Teleport.,,,127,0,127,191,127,191,121,19,153,121,19,153,false

BambooswordMan,Minion,Common,Forest

2,,c3:57977579,c4:66886886
3,,c3:57977579,c4:88688666,c7:55599599
5,,c7:55995995,c5:87677678,c3:57757997,c4:66688688
6,,c7:55959959,c5:87677678,c4:66688688,c3:57759779,c8:47a7747a
c3,Move or Attack.,,,0,0,0,127,127,127,0,0,0,0,0,0,false
c4,Move only.,,,0,0,255,127,127,255,0,0,0,0,0,0,false
c5,NoBlock\\o Attack only.,,,127,0,0,215,127,127,255,0,0,0,0,0,false
c7,NoBlock\\o Move only.,,,127,127,255,0,0,255,0,0,0,0,0,0,false
c8,Attack Minion.,⎚,,255,95,95,255,255,255,255,95,95,0,0,0,false

VWave Sergeant,Champion,Plasma,Epic

7,Wave\o Width 3\a inward V\a 1 use\a\nFired adjc\a advances 1/opp move.,c1:47747aa7,c3:67877678,c7:5665586989989685
10,Wave\o Width 3\a inward V\a 1 use\a\nFired adjc\a advances 1/opp move.,c1:47747aa7,c7:5665586989989685,c3:6787767866688688
14,Wave\o Width 3\a inward V\a 2 uses\a\nFired adjc\a advances 1/opp move.,c1:47747aa7,c7:5665586989989685,c3:6787767866688688
20,Wave\o Width 3\a inward V\a 3 uses\a\nFired adjc\a advances 1/opp move.,c1:47747aa799595595,c7:5665586989989685,c3:66688688,c2:67768778
c2,NoBlock\o Move|Attack|Swap ally.,,,255,199,0,255,239,127,0,0,0,0,0,0,false
c1,Ranged Wave\o Destroy on impact.,^,,255,0,0,255,255,255,255,0,0,255,0,0,false
c3,Move or Attack.,,,0,0,0,127,127,127,0,0,0,0,0,0,false
c7,Move only. Adjc Dgnl1 first.,×,,0,0,255,127,127,255,0,0,255,0,0,0,false

CatswordMan,Minion,Basic,Forest

1,,c3:66886886
2,,c3:66886886,c4:7576787987
3,,c2:66886886,c5:87,c7:75767879
4,,c1:7c66688688,c6:7576787987
c2,NoBlock\o Move or Attack.,,,0,151,0,127,199,127,0,0,0,0,0,0,false
c1,NoBlock\o Move|Attack|Swap ally.,,,255,199,0,255,239,127,0,0,0,0,0,0,false
c3,Move or Attack.,,,0,0,0,127,127,127,0,0,0,0,0,0,false
c4,Move only.,,,0,0,255,127,127,255,0,0,255,0,0,255,false
c5,Move|Swap ally.,,,0,0,255,127,127,255,0,0,0,0,0,0,false
c6,NoBlock\o Move|Swap ally.,,,127,127,255,0,0,255,0,0,0,0,0,0,false
c7,NoBlock\o Move only.,,,127,127,255,0,0,255,0,0,0,0,0,0,false

KingShinLion+,King,Royal,Unique

5,Kingmove x2\a in adjc range.\nCastling\o 1 Use.\nLoss\o -25 Morale.\nKingless\o -3 Morale/Turn.,c6:8687887868676676,c3:444a3b33a4b3aabb
15,Kingmove x2\a in square range2.\nCastling\o 1 Use.\nLoss\o -25 Morale.\nKingless\o -3 Morale/Turn.,c6:8687887868676676,c3:444a3b33a4b3aabb
30,Kingmove x3\a in radius range3.\nCastling\o 1 Use.\nLoss\o -25 Morale.\nKingless\o -3 Morale/Turn.,c6:8687887868676676,c3:444a3b33a4b3aabb
50,Kingmove x4\a in radius range4.\nCastling\o 1 Use.\nLoss\o -25 Morale.\nKingless\o -3 Morale/Turn.,c6:8687887868676676,c3:444a3b33a4b3aabb
c3,Move before it Ally Champion\a pass it around this unit.,♖,,0,0,0,255,255,255,0,0,0,0,0,0,false
c6,Move or Attack.,,,0,0,0,127,127,127,0,0,0,0,0,0,false

RoyalKnight,Champion,Royal,Rare

7,Max 2 King Move to Target.,c3:76786787,c5:5665586989989685
10,Max 3 King Move to Target.,c5:5665586989989685,c3:7678876668678688,c7:57757997
14,Max 3 Kingmove to Target.,c5:5665586989989685,c3:66688688,c7:57757997,c1:67767887
19,Max 4 Kingmove to Target.,c4:5665859698896958,c3:66688688,c1:67767887,c6:57797597
c4,NoBlock\o Move|Attack|SwapAlly.,,,255,199,0,255,223,127,20,151,24,20,151,24,false
c3,Ally King may Move to here\a may turn once for that.,!,,255,159,0,255,255,255,0,0,0,0,0,0,false
c5,NoBlock\o Move or Attack.,,,0,151,0,127,199,127,20,151,24,20,151,24,false
c6,Move or Attack.,,,0,0,0,127,127,127,0,0,0,0,0,0,false
c2,Ally King may Move to here\a may turn once for that. Move only.,!,,0,0,255,255,255,255,0,0,0,0,0,0,false
c1,Ally King may Move to here\a may turn once for that. Move|Attack.,!,,0,0,0,255,255,255,0,0,0,0,0,0,false
c7,Move only.,,,0,0,255,127,127,255,0,0,255,0,0,255,false
`]

  let rv = randarray(sspunits)
  nameinput = nameinput.slice(0,1).toUpperCase() + nameinput.slice(1) // cap first letter
  if (Object.keys(CEO[`${lastCEOversion}`]).includes(nameinput.replace(/\d/, ""))) {getgallery(nameinput)}
  else {validate(makepiece(nameinput));}
});



function convCSS(input) {
  input = input.replace(/;\s*$/, ""); // Ignore the last ;
  let result = {}, attributes = input.split('; ').join(";").split(';');

  for (let i = 0; i < attributes.length; i++) {
      let entry = attributes[i].split(':');
      result[entry.splice(0,1)[0]] = entry.join(':').trim();
  }
  return result
}

let changedmoves = [] // Array of changes made so we can undo them later :)

function changemove(movename, description, bordercolor, fillcolor, symbol1, symbol1color, symbol2, symbol2color, nobox, clearinglist=false) { // Changes the look of a move. NOT FOR SPELL MOVES, but for the style switches.
  let prevaction = ACTION
  let moves = movename;
  let changerecord = [movename, 0, 0, 0, 0, 0, 0, 0, 0];
  if (description != 0)    {changerecord[1] = MOVES[SMOVE[movename]].text; MOVES[SMOVE[movename]].text = description}
  if (bordercolor != 0)    {changerecord[2] = MOVES[SMOVE[movename]].color; MOVES[SMOVE[movename]].color = bordercolor}
  if (fillcolor != 0)      {changerecord[3] = MOVES[SMOVE[movename]].color2; MOVES[SMOVE[movename]].color2 = fillcolor}
  if (symbol1 != 0)        {changerecord[4] = MOVES[SMOVE[movename]].symbol1; MOVES[SMOVE[movename]].symbol1 = symbol1}
  if (symbol1color != 0)   {changerecord[5] = MOVES[SMOVE[movename]].color3; MOVES[SMOVE[movename]].color3 = symbol1color}
  if (symbol2 != 0)        {changerecord[6] = MOVES[SMOVE[movename]].symbol2; MOVES[SMOVE[movename]].symbol2 = symbol2}
  if (symbol2color != 0)   {changerecord[7] = MOVES[SMOVE[movename]].color4; MOVES[SMOVE[movename]].color4 = symbol2color}
  if (nobox != 0)          {changerecord[8] = MOVES[SMOVE[movename]].nobox; MOVES[SMOVE[movename]].nobox = nobox}
  if (!clearinglist) {changedmoves.push(changerecord)}

  loadMove(MOVES[SMOVE[moves]]);
  document.getElementById("spell-"+moves).remove();
  document.getElementById("defs").insertAdjacentHTML("beforeend", makeSpellSVG());
  style.sheet.deleteRule(SMOVE[moves]);
  style.sheet.insertRule(makeRule(MOVES[SMOVE[moves]]), SMOVE[moves]); //Reapply css
  document.styleSheets[1] = style;
  $(".moves ." + moves).attr("data-description", MOVES[SMOVE[moves]].text);


  svgMove = $(".moves svg." + movename) // main_gi: This sets all displayed text to the new description
  for (let m = 0; m < svgMove.length; m++) { 
    if (!(!svgMove[m].nextSibling || svgMove[m].nextSibling.tagName.toLowerCase() == "svg")) {
      $(svgMove[m].nextSibling).not(this).text(description)
    }
  }



  ACTION = prevaction;
  loadMove(MOVES[SMOVE[prevaction]]); // main_gi: There seems to be an import bug with actions, I'm pretty sure this fixes it. (AGAIN)
}


function SSPify(input) {
  let sspreplaces = ["Magic", "Teleport", "Unblockable"]
  let sspreplacetos = ["Mgc", "Tprt", "NoBlock"]
  for (i=0; i<sspreplaces.length; i++) {
    input = input.replace(sspreplaces[i], sspreplacetos[i])
  }
  return input
}

function clearmovechanges() {
  for (let i=0; i<changedmoves.length; i++) {
    changemove(changedmoves[i][0], changedmoves[i][1], changedmoves[i][2], changedmoves[i][3], changedmoves[i][4], changedmoves[i][5], changedmoves[i][6], changedmoves[i][7], changedmoves[i][8], "clearing")
  }
  changedmoves = []
}

function resetSpellLooks() {
  spellstyle = [10, 1, 9]
  $(".spell").attr("height", spellstyle[0])
  $(".spell").attr("width", spellstyle[0])
  $(".spell").attr("x", spellstyle[1])
  $(".spell").attr("y", spellstyle[1])
  $(".spell-symbol").attr("font-size", spellstyle[2])
  $(".spell-gallery").css("transform", "none")
}

$("#switchceo").click(function() { // main_gi: Switch to ceo stylings
  $("html").removeClass("cd")
  $("html").removeClass("fc")
  $("html").removeClass("cba")
  clearmovechanges()
  resetSpellLooks()
}) 
$("#switchcd").click(function() { // main_gi: Switch to CD stylings
  $("html").addClass("cd")
  $("html").removeClass("fc")
  $("html").removeClass("cba")
  clearmovechanges()
  resetSpellLooks()

  let white = [255, 255, 255]; let black = [0, 0, 0]; let red = [255, 0, 0]; let blue = [20, 125, 255] // [0, 102, 255] is the real color in game
  let unblockablesymbol = "⛶" //"◜"
  changemove("moveattack", "Move or Attack.", black, white, "⚫", black)
  changemove("move", "Move only.", blue, white, "⚫", blue)
  changemove("movestart", "Move from your second row.", blue, white, "o", blue)
  changemove("attack", "Attack only.", red, white, "⚫", red)
  changemove("jump", "(Unblockable) Move or Attack.", black, white, unblockablesymbol)
  changemove("teleport", "(Unblockable) Move only.", blue, white, unblockablesymbol)
  changemove("teleportstart", "(Unblockable) Move from your second row.", blue, white, "o", blue, unblockablesymbol, blue)
  changemove("jumpattack", "(Unblockable) Attack only.", red, white, unblockablesymbol)

  changemove("jumpswap", "(Unblockable) Move, Attack, or swap places with ally.", black, white, "🗘", black, unblockablesymbol)
  changemove("moveattackswap", "Move, Attack, or swap places with ally.", black, white, "", black, "🗘", black) // first symbol was ⚫, removed it
  changemove("swap", "(Unblockable) Swap places with ally.", black, white, "🗘", blue, 0, 0, "true")

  changemove("moveswap", "Move or swap places with ally.", blue, white, "🗘", blue)
  changemove("teleportswap", "(Unblockable) Move or swap places with ally.", blue, white, "🗘", blue, unblockablesymbol)
  changemove("attackswap", "Attack or swap places with ally.", red, white, "🗘", red)
  changemove("jumpattackswap", "(Unblockable) Attack or swap places with ally.", red, white, "🗘", red, unblockablesymbol)

  /* Thing we want to modify: <rect height="10" width="10" stroke="rgb(0,0,255)" stroke-width="2" stroke-alignment="outer" x="1" y="1" fill="rgb(255,255,255)" class="spell" data-id="2"></rect>

  the height, width, x, and y*/
  spellstyle = [16, -2.25, 12]
  $(".spell").attr("height", spellstyle[0])
  $(".spell").attr("width", spellstyle[0])
  $(".spell").attr("x", spellstyle[1])
  $(".spell").attr("y", spellstyle[1])
  $(".spell-symbol").attr("font-size", spellstyle[2])
  $(".spell-gallery").css("transform", "scale(0.8) translate(3px, 3px)")


}) 
$("#switchfc").click(function() { // main_gi: Switch to favuor chess stylings
  $("html").removeClass("cd")
  $("html").addClass("fc")
  $("html").removeClass("cba")
  clearmovechanges()
  resetSpellLooks()

  let white = [255, 255, 255]; let black = [0, 0, 0]; let movecolor = [97, 119, 224]; let attackcolor = [237, 28, 36];
  changemove("moveattack", "move or attack", 0, 0, "■", black, 0, 0, "true")
  changemove("move", "move", 0, 0, "■", movecolor, 0, 0, "true")
  changemove("attack", "attack", 0, 0, "■", attackcolor, 0, 0, "true")
  changemove("jump", "move or attack (unblockable)", 0, 0, "●", black, 0, 0, "true")
  changemove("teleport", "move (unblockable)", 0, 0, "●", movecolor, 0, 0, "true")
  changemove("jumpattack", "attack (unblockable)", 0, 0, "●", attackcolor, 0, 0, "true")
  changemove("movestart", "move (only from starting position)", 0, 0, "■", movecolor, "S", white, "true")
  changemove("teleportstart", "move (unblockable) (only from starting position)", 0, 0, "●", movecolor, "S", white, "true")
  changemove("moveattackswap", "move or attack or swap ally", 0, 0, "■", black, "🗘", white, "true")
  changemove("moveswap", "move or swap ally", 0, 0, "■", movecolor, "🗘", white, "true")
  changemove("attackswap", "attack or swap ally", 0, 0, "■", attackcolor, "🗘", white, "true")
  changemove("blockableswap", "swap ally", 0, 0, "■", [127, 127, 127], "🗘", white, "true")
  changemove("jumpswap", "move or attack or swap ally (unblockable)", 0, 0, "●", black, "🗘", white, "true")
  changemove("teleportswap", "move or swap ally (unblockable)", 0, 0, "●", movecolor, "🗘", white, "true")
  changemove("jumpattackswap", "attack or swap ally (unblockable)", 0, 0, "●", attackcolor, "🗘", white, "true")
  changemove("swap", "swap ally (unblockable)", 0, 0, "●", [127, 127, 127], "🗘", white, "true")


}) 
$("#switchcba").click(function() { // main_gi: Switch to favuor chess stylings
  $("html").removeClass("cd")
  $("html").removeClass("fc")
  $("html").addClass("cba")
  clearmovechanges()
  resetSpellLooks()
}) 

// CEO's: linear-gradient(rgba(238,238,238,0.9),rgba(238,238,238,0.9)), url("../resources/bg.jpg")


var items=""
var currentlySelectedGalleryUnit = "Pawn"
var currentlySelectedGalleryVersion = lastCEOversion

let isactualunit = (key, value) => (!key.match(/\d/) && value.rarity != "N/A" && value.rarity != "?" && !key.startsWith("GeminiTwin") && key != "actionlist")


$.each(CEO, function(key, value) {
  items+=`<option ${lastCEOversion == key?'selected':''}value=${key}>${key}</option>` // Trying to fix "v52" to "v0.52" does not work. It's not important enough to bother.
 });
$("#galleryversion").html(items);

$('#galleryversion').change(function(){
  let data= $(this).val();
  currentlySelectedGalleryVersion = data
  let increment = 0;
  for (let i = 0; i < $("#gallery option").length; i++) {
    $("#gallery option")[i].style = "color: gray"
  }
  $.each(CEO[`${currentlySelectedGalleryVersion}`], function(key, value) {
    if (isactualunit(key, value)) {
      $("#gallery option")[increment].style = "color: black"
      increment++
    }
  });
  // this grays out units that aren't in the update
  $('#gallery')[0].style.color = $('#gallery')[0].options[$('#gallery')[0].selectedIndex].style.color; // copies style of the option value to the unit dropdown

  getgallery(currentlySelectedGalleryUnit, currentlySelectedGalleryVersion)
});

$("#galleryversion").val(lastCEOversion);

items = ""
$.each(CEO[`${currentlySelectedGalleryVersion}`], function(key, value) {
  if (isactualunit(key, value)) {items+="<option value='" + key + "'>" + key + "</option>"}
 });
$("#gallery").html(items);

$('#gallery').change(function(){
  this.style.color = this.options[this.selectedIndex].style.color; // copies style of the option value

  currentlySelectedGalleryUnit = $(this).val();
  getgallery(currentlySelectedGalleryUnit, currentlySelectedGalleryVersion)
});





var thing1 = ["teleporting ally king", "summoning ally pieces", "summoning enemy pieces", "summoning pieces", "teleporting pieces", "moving pieces", "status effect", "stun effect", "swapping enemy", "dealing damage", "on death effect", "on kill effect", "promote", "that ability", "turn 1 checkmate", "magic destroy", "charm", "range 4 attack", "jumping over ally", "killing allies", "morale", "petrify", "freeze", "double damage", "downgrade", "upgrade", "invisible pieces", "rng", "random effect", "revive", "graveyard", "banish", "push", "pull mechanic", "fps mechanic", "pie rule mechanic", "morale decay mechanic", "domain victory", "threefold repetition", "checkmate", "classic chess", "blitz token mechanic", "transformation mechanic", "summoning a sapling", "teleporting caster", "destroying all adjacent pieces", "battle royale mechanic", "thundermage thunder", "lightning strike", "armored unit effect", "favorchess berserk", "caste system", "concentration camp mechanic", "sodomy", "bukkake", "brainfluid keyword", "low-iq mode", "pooping on enemy piece", "piss on ally unit", "add extra army points", "on death lose morale", "lose the game mechanic", "anal mechanic", "does not block movement", "phoenixegg passive", "sextoy mechanic", "pinkdildo keyword", "path mechanic", "anti-grandmaster unit", "naked status effect", "circumcision mechanic", "buttplug", "footfetish mechanic", "vore", "necrophilia", "assclench mechanic", "nosepick mechanic", "headlice", "coronavirus", "itchybutt", "white supremacy", "flatearth", "racism", "heterophobia", "eyegouge", "penisize", "boogereat mechanic", "buttlick mechanic", "big boob art", "anime girl art", "2 men kissing", "freeze foot off", "block enemy attack", "stealth", "hidden information mechanic", "market crash mechanic", "infinite ruby farm", "gain contribution using ability", "use ability limited number of times", "pay to use ability", "sacrifice this piece", "diarrhea", "prostitution", "behead", "earwax", "masturb8", "message deletion mechanic", "deleting messages", "attacking f3", "attacking newceo members", "leaking newceo", "making fun of favorchess", "obesity", "suicide", "suicide forest", "adjust cost", "market system", "contribution farming", "farting in mouth", "tooth removal", "death by hanging", "suffocation", "wind magic", "stonepillar", "shock opponent with electric shock", "steal time from opponent", "punch opponent through screen", "reputation system", "gravity", "insult opponent", "destroy opponents coins", "fingernail clipping", "toenail eating", "bleeding", "kidney stone", "blood transfusion", "add morale", "lose value", "vampire drain", "transform into bat and fly", "unstoppable ability", "stealing pieces from another game", "winking to girl", "cut loose skin", "excercize machine", "treadmill", "banning opponent unit for sexism", "swastika moveset", "void unit", "swap with ally", "swap with empty square", "ban evasion on favorchess", "alt infiltration", "rp trading", "bribing with rp", "get crowns for using ability", "quest system", "trolling awetalehu", "bat transformation", "kill temporarily", "stun unit for 20 turns", "internal bleeding", "waterboarding", "enchant", "throwing up", "giving birth", "intercourse", "ruby farming", "gold farming", "stock market", "shortselling stock", "abusing player", "grooming", "losing hair", "pubeshaving", "armpit smell", "turning gay", "custom pieces", "using words", "using english language", "translate to chinese", "french translator", "spanish translator", "using numbers", "using english alphabet", "using piecemaker", "using brain", "throw water at computer", "break controller", "throw mouse at computer", "drink water", "eatass", "copy enemy piece", "copy ally piece", "countDown to 0", "lifespan", "crack skull open", "destroy all ally pieces", "win the game on turn 3", "cant move until turn 3", "summon soulkeeper instead of ghost", "gain life", "add morale", "add iq", "smell like shit", "pay to win", "put camera in ass", "lying", "welcoming alts to abstract strategy game server", "national surveillance", "licking keyboard", "declaw", "spend money to win", "drop tv on foot", "lose finger", "pick nose", "infect opponent", "take off clothes", "cat scam", "sodomy is good, but the other ability", "yesterdays bukkake was bad, this bukkake is dull and", "bad voice acting", "voicecrack", "being past prime at 15", "losing to 46 point army", "delete kong account", "report kong account", "make 5 kong accounts", "banned on discord", "using vpn", "trolling opponent", "troll awetalehu", "making fake username", "making fun of me", "paradox", "7 cost piece", "14 cost piece", "21 cost piece", "152 cost piece", "move only", "attack only", "unblockable", "magic", "video game development", "go to the moon", "go to mars", "teleport to corner", "rename enemy unit", "make enemy catch cold", "HIV", "turn enemy piece female", "spamming prismata server", "demod everyone", "go on power trip", "sending rp to scammer", "40 people online on ceo", "spending money on scholarship", "scammed by university", "taking out stupid student loan", "turn ally into incel", "create vpn", "make sexual joke", "emojis", "pixel art", "lick enemy legs", "sit on enemys face", "bdsm", "masochism enemy unit", "fart on face", "messing with clock", "an extended leap attack", "more path mechanics", "poison 6", "starting move decay on turn 25", "talking trash about grand"]
var beendone = ["is something that has been done", "has been done", "was done before", "has already been done", "isnt original", "isnt new", "is oveursed", "is overdone", "has been done in hex", "has been done on boardgames", "has been done before", "is something that has been done before", "has been done and is overused", "is too obvious and already done", "is my idea", "is just a copy of a ceo mechanic", "is just a copy of tetris and puyopuyo", "is stolen from hex", "has been done by grand", "has been proven as too luckbaased", "has been established as lame", "has been done, is just a variant of move or attack", "has been done, just a variant on magic destroy", "has been done, just a basic variant on teleport", "too predictable", "is too obvious, just a variant on move or attack", "has been done, it is basically just attack only with a small twist", "is really unoriginal, just the worst of 2 ceo mechanics", "is a thing thats been done before", "is a babys first idea for a mechanic", "is already implemeneted", "is uncreative, already beeen done", "has been done, too easy to think of", "has been done, babys first mechanic", "has been done before by 6 other people", "has already been done before", "is something thats already been done, has never been interesting", "has been done, the mechanic is already fully explored by better piecemakers than you", "has been done several times in the past", "is way too obvious has been done", "has been done already", "sucks, its been done", "is lame, its been done", "has been done by ssp", "has been done, its just transform with extra steps", "has been done, its just a vanilla unit with a useless ability", "has been done, its useless", "has been done, just part of firemage ability with a twist", "has been done, ssp did it 4 years ago", "has been done, i did it 3 years ago", "has been done, just an obvious variant of ranged destroy", "has been done, just a ripoff of comet and a favorchess piece", "has been done by newceo already", "has been done, just a ripoff of other kongregate games", "has been done, just stealing ideas from facebook pages", "has been done on miniclip", "has been done in krunker", "has been done, its just a hearthstone mechanic", "has been done by lormand", "has been done by gracelesshawk", "has been done, by ssp and grand", "has been done by james", "has been done by stormcommando", "is horrible, been done already", "sucks, ive seen it a billion times", "has been done by CBA", "has been done better by ssp", "sux, come up with something thats not been done", "is boring, come up with something new", "is useless, not new", "is not new", "is not new at all", "isnt original, has been done", "isnt new, its been done too many times", "is so boring, its been done too many times", "has been done way too many times", "has been done, you posted this same piece 2 weeks ago, get a new idea", "is just a more powerful tiger", "is like enchanting pieces as a downside, has been done and doesnt excite me", "doesnt add anything good to the game", "doesnt do anything exciting", "is ugly and inconsistent", "is stupid and boring"]

var nointerest = ["this isnt very thought provoking", "this isnt very striking", "pretty boring", "this isnt new at all", "not very interesting", "pretty uninteresting", "quite boring", "not intriguing at all", "not well thought out", "pretty stupid", "kinda stupid", "not really intelligently built", "messes with the strategicality tactics balance", "should use pawndrops", "needs credits system to be interesting", "could be more like favor chess", "just an obvious copy of a ceo mechanic", "completely overpowered", "totally underpowered", "unusable", "uninspiring", "just lazy", "too much like favor chess", "just change for changes sake", "pretty parasitic", "this sucks compared to my early pieces", "too much like newceo", "would be better with 2 click ability", "doesnt interact with enough mechanics", "has too much synergy", "just made to farm contribution", "too many words to explain simple ability", "not understandable enough", "hard to read", "not enough depth", "needs an ability that regards piece by its relative position in the game", "doesnt add anything good", "also too many typos in the descripition", "its supposed to be on more pieces", "it needs to be on more pieces", "it needs more token pieces to work", "high complexity low depth", "unstrategic", "nothing interesting to see here", "why is it designed in such a boring way", "ive seen better pieces from stratshotplayer", "grand makes better pieces than this", "ghostly can make better pieces than this", "i can make much better pieces than this", "james would get a hardon seeing this mechanic tho", "seems like you would easily forget where your king went with this", "really a braindead design", "youre a bad designer", "youre a boring designer", "youre a crappy designer lel", "i think your bad at this", "designer was on crack making this", "designer was on drugs like lormand", "designer mustve been smoking weed lel", "really underwhelming", "kinda ugly too", "i dont like the art", "art looks like a random scribble", "name is just random scrambled letters", "u probably smell bad irl", "i need glasses to understand this", "i need ssp to translate this for me", "just dumb", "just idiotic", "no depth", "this isnt striking at all", "this isnt thought provoking in the slightest", "all those pieces are op", "all those pieces are bad", "all your pieces suck", "your piece sucks", "nothing good about this", "nothing striking here", "nothing to see here", "nothing thought provoking", "nothing good about this piece", "impossible to balance", "prismata did it better", "favorchess would do it better", "nothing interesting about this piece", "waste of time", "wasting my time", "just a waste of time", "no depth to this one", "nothing good about this one", "nothing new to offer", "brings nothing new to the table", "this is very boring", "unstriking", "needs to promote to a better piece", "also doesnt say what sodomy does", "noone would use this", "nobody liked that", "its much worse than my pieces", "theres a reason noone llikes it", "i dont like this", "i dont like this verymuch", "just a bad copy of newceo", "whats the point of this", "no point in this", "theres no point in this", "theres no point doing this", "no point using this", "whats this even trying to do", "what does this even mean", "too much math", "too many numbers", "too many numbers wtf", "wtf is this", "wtf were you thinking", "wtf is wrong with you", "is cursed like the abstract strategy games server", "this is something i dont believe in", "you put this on alotta pieces but theyre all bad", "overall your pieces suck compared to my beginning pieces, and i dont think that you have a bright future in piecemaking", "not that cool but its fine", "meh", "never make another piece again please", "just die", "stupid pawndrops ripoff"]
var igiveit = ["", "", "", "", "", "", "i give it a", "i give it a", "i give it a", "i give it", "it deserves a", "it's pretty bad,", "pretty bad,", "not good,", "pretty terrible,", "garbage,", "do better next time,", "trash,", "not worth thinking about,", "so boring,", "bad,", "its not very good,", "not very good,", "i give it only a", "its around a", "NEXT,", "awful,", "what a joke,", "laziest designer ever,"]
var ratings = ["0/10", "1/10", "2/10", "3/10", "4/10", "0/10", "1/10", "2/10", "3/10", "4/10", "5/10", "almost 5/10", "-1/10", "1.1/10", "0.6/10", "3.2/10", "2.4/10"]
var period = ["", "."]
var periodorcomma = [".", ","/*, ".", ",", ".", ",", ""*/]

function kocmessage (name) {
  return name+": "+randarray(thing1)+" "+randarray(beendone)+randarray(periodorcomma)+" "+randarray(nointerest)+", "+randarray(igiveit)+" "+randarray(ratings)+randarray(period)
}

function sspmessage (name) {
  let ratings = [`SS`, `S`, `A`, `B`, `C`, `D`, `F`]
  let regexlist = [[/([A-Z]..).+([A-Z])/g, "$1$2"], [/dd/g, "d"], [/ff/g, "f"], [/mm/g, "m"], [/tt/g, "t"], [/pp/g, "p"], [/gg/g, "g"], [/ll/g, "l"], [/cc/g, "c"], [/rr/g, "r"], [/nn/g, "n"], [/ss/g, "s"], [/ee/g, "i"], [/^Ex/g, "X"], /a|e|i|o|u/, /a|e|i|o|u/, /a|e|i|o|u/, /a|e|i|o|u/g, /y/g, /h/g, /n/g, "DUMMYELEMENT"] // dummy so that the while loop and length check doesn't fall apart
  let shtn = name
  while (shtn.length > 4) {
    let takefirstfour = shtn.slice(0, 4)
    if (regexlist.length == 1) {shtn = takefirstfour}
    if (regexlist[0].length == 2) { 
      shtn = shtn.replace(regexlist[0][0], regexlist[0][1]);
    } else {
      shtn = shtn.replace(regexlist[0], '');
    }
    if (shtn.slice(0, 4).toLowerCase() == name.slice(0, 4).toLowerCase() && shtn.slice(0, 4) != name.slice(0, 4)) { // this is for cheesy "FirE" names
      shtn = shtn.slice(0, 4)
    }
    if (shtn.length <= 3) {shtn = takefirstfour}
    regexlist.shift() // remove first element
  }


  return `${shtn}: ${randarray(ratings)}${randarray(plusorminus)}, ${randarray(ratings)}${randarray(plusorminus)}, ${randarray(ratings)}${randarray(plusorminus)}, ${randarray(ratings)}${randarray(plusorminus)}. ${randarray(ssp1)} ${randarray(ssp2)}${randint(0, 5)==5?" "+rsspn.join("|")+".":""} ${randarray(sspratings)} ${randarray(sspratings2)}|10.`.replace(/{\[NAME\]}/g, name).replace(/{\[SHTN\]}/g, shtn) // the "rsspn" part: 1/6 chance for ssp to suggest his own unit rebalance
}

var plusorminus = [`+`, ``, ``, ``, `-`, `-`, `--`]
var ssp1 = [``, `Strong synergy and power right from setup.`, `This has been Vaccinated it appears.`, `This alone is level expected.`, `Weak.`, `You don't know scratch about balance.`, `Blatantly Broken.`, `Turn 1 checkmate is a valid game design...`, `That's my Unit, the regime's enforcement cops.`, `It's very specialized, so it's cheap. Can be used as Pawn, to develop a Champion or rescue some unit.`, `No, it can't kill 2 units in 1 turn.`, `No joke pieces.`, `That should cost 25.`, `Needs to be harder to trade well.`, `Upgraded it's 1 too cheap.`, `Fairly weak, may become Stuck on 8th row, bad upgrades.`, `Weak moves, fair ability, risky emergency ability.`, `Fine, but +2 sucks.`, `Overcosted, weak high tiers.`, `A bit cheap, class typo.`, `Mostly gimmick.`, `Weak moves, fair ability, risky emergency ability.`, `Strong combo potential, plus, overcosted, sidegrade.`, `It doesn't fill any challenges.`, `Too dificult to provide Dementia.`, `Broken dodgespam, brokener from Plus, too cheap.`, `Good support, cheap,`, `Too expensive, gets cheaper,`, `Balanced, but passive hardly matters.`, `Overcosted for what it does,`, `UP base, sudden OP Knight attack at plus, rest is not too OP.`, `Overcosted for range ability, otherwise balanced.`, `Weak without support, balanced at base and +.`, `Fair & Balanced.`, `Good, but may be too expensive. -1 cost.`, `Payless LfSt...`, `Ability is not that strong wthout combos, since it's ussually worse than Saplingkill.`, `Nice, but bad scaling, OP at +3.`, `Weak though balanced, niche unit,`, `Too weak for what it does. 1|2|4|6.`, `Broken with RespawnTarget units, otherwise broken from + tier, since it can Tport freely after 1 charge, and reload Destroy.`, `Sidegrades, and these aren't even good.`, `Broken upgrading, otherwise OK.`, `Powerful ranged ability and fast movement balanced by tempo and coverage.`, `Overcosted, situational ability.`, `Good but overcosted.`, `Frenzy is best single: Swap Frenzy1 1 Fwrd, Place and Attack repeatedly with Frenzy0s, end with Frenzy1. An attack like this drains 29|45|63 Morale, as well as 10 Value.`, `{[SHTN]} uses a powrful passive. it's sad that he didn't remove the "And lose this ability" part.`, `Gimmicky, unclear and useless.`, `{[SHTN]} is OP, may cheap 2x1, later T2 cheapmate.`, `{[SHTN]} is quick and deadly, but hard to use, later it may be slightly OP.`, `Is OKish, but OP for trading.`, `Nice and tactical.`, `{[SHTN]} is gud unit.`, `Small but kinda fair.`, `Is fair enough.`, `This is OP.`, `Powerful but balanced.`, `{[SHTN]} is undefined.`, `Poop.`, `Too cheap, but good design.`, `Half lazy.`, `Fast promoter but weak, can be used for cheese with Harmor, otherwise you'd just use Bat3|PriQ2.`, `Nice design, can defend well without being OP.`, `Decent moves but overcosted.`, `Obvious Joke, just like TheG.`, `Needs +, weak melee but balanced destroy.`, `Looks OP, and what happens if you fling them, or otherwise 2 triggers? I'd say front, opposite boardside first, so N, NW, NE, W, E, SW, SE, S when on right half.`, `{[SHTN]} is strong piece that can take unit behind, quite powerful, it is undercosted.`, `It is overcosted, and allows nasty cheese fighting.`, `Overcosted, has detrimental trigger.`, `Weak bomber that is undercosted, then OP, then Broken.`, `Horribly useless, wastes Champ for net loss. |||.`, `Decent power, wind seems random, high jump from Plus1 to Plus2. 6|7|13|14. Actually wait. 5|8|16|18...`, `Unit whose main power is on Push, which moves target diagonally until 5 spaces total, whenever possible. It may be used twice, which gives double attack potential. Its harmblock is not threatening, but may avoid defense, and it leaves attacker open. Upgrades give stronger defense, attack and movement.`, `WTF?`, `Looks like 1|2|3|6 unit at first... Unreadable Description, impossible to evaluate, learn English.`, `You're biased, and you should feel bad.`, `This piece trying to Imposteranate my piece design?`, `Improper and poor templating.`, `Very bad at moving Frward.`, `Barrage range of Drgn0 outer range.`, `It's Broken with Paladin, also with Guardian, Colonist and such.`, `I suggested these prices. It needs sliightly higher costs.`, `Too weak. Needs to be more threatening.`, `A friend tells another when he's being dumb, which it is.`, `Ability is like OverHead: Ranged, goes over Units. Can be blocked by things other than Units, such as ForceWalls.`, `I put this in my Site: Site is up! Here you can discuss Chess Evolved Online from a better design focus.`, `Levitated {[SHTN]}1 is Broken, can attack as much as it wants, while nigh invincible, at least against Chess army.`, `Fairly balanced unit, not OP or repetitive.`, `Rook|Rangestroy hybrid, encourages repetition.`, `Do you have brain damg?`, `Really bad ability. New Ability: It fires a fast reflecting Beam, bouncing changes square color unless bouncing from board corner. Can't use long range past 6th row, can Destroy diagonally at +2, has 2 Block areas at +3.`, `Not random, but most of these are more efficient at low tiers, more so with a discount.`, `Throw something cheaper at it, win.`, `Hey, SSP is my updated response. CC could be CosmiClasher.`, `It's just cheap. A cost of 10 makes it harder to trade, maybe too costly.`, `sShould cost 10, it's stronger than Warr2 at Range2, no Kingrange Attack but strong swap.`, `Suggestion 1: Base cost 12 moves Lgnr0. Plus cost 14 moves Warr2. Plus2 cost 16 moves Lgnr3. Plus3 cost 18 moves Bhmt3. Pros: No overly tradeable tiers, decent control ability. Cons: Move Only upgrades, not mandatory to buy Plus2|3.`, `Seems OK to counter Ranger2|3 and the like.`, `{[SHTN]}: 31 Cost, + Adjc NoBlock SwapAlly. If 34 cost, RangeImmune, ReactImmune, NgtvStatusImmune.`, `{[SHTN]}1 is worth about 8, costs 2, pnlt 10. With LfSt1 Buff is worth about 10, costs 6, pnlt 7, weak but defensive until used. Seems fairly good.`, `This is Pay2Play. Also, Knight0 meta.`, `It's not broken at all. Targeted minion would be cast out, and Ptgs would be wasted.`, `SwpAlly don't make a lot of sense.`, `Would be shorter in Spanish.`, `Dumb idea.`, `Description way too long.`
]
var ssp2 = [``, "Es basura, no puede definir ganancia.", "Lacks Chess Battle Advanced tenets.", "Unclear templating.", "It's like one of my designs.", "Unclear description.", "Uncreative name, bad poison.", "Clearly, this makes the Unit too punishing for these armies.", `So, this ends up losing|giving King X-4 Worth. X=6|5|5|4, but 5|4|5|4 for a King. Net balance being -(4|5|4|6).`, `It should get Tired after 3 moves.`, `Same as with Valk portal.`, `That'd actually make little difference.`, `BAN Armored Range 3 to Enemy 2nd.`, `It's almost strictly worse.`, `Also, {[NAME]} is Broken as long as it sticks to White squares.`, `Solution: Reduce the Petrify duration to 2 turns.`, `Also, fullquote is stupid.`, `An attack to left corner then to the right can't be interfered by Samurai.`, `Really weak, may break some units.`, `Broken with Hoplites at +2.`, `meaningless passive,`, `unspecified path for attack.`, `Broken with Hostage for King threat...`, `Balanced, protect and attack, slightly weak +2.`, `Not very strong, +2 may be sidegrade.`, `Has "Equally Pointless" element demergency (dx emergency ~ dx obfuscation).`, `Broken with Knight|Valk, even Pyro, but also boosts Enemy unit. It may seem weird to be attacked by Trees.`, `Limit to 15 turns.`, `It's not that weak, it is an utility piece, overcosted though.`, `Strong tradeability upgraded.`, `OP in some Combos.`, `Randomness, bad scaling, gimmicky, broken, useless.`, `Balanced abilities, except BatV Tport, especially at +3.`, `Too tradeable, otherwise Balanced.`, `You aren't very good designer.`, `Overcosted by 2-3, weak upgrades.`, `Balanced power, HUGE morale pains to be worth it, overcosted.`, `Good but overcosted.`, `Also, sidegrades are UP. 6|8|8|8. Also, repeated Rook drilling in general.`, `I already have similar piece in Chess Battle Advanced.`, `That Trigger is Temporary Attack Power, NOT Auto Attack.`, `This piece got voted Higher than a thing that certain 4x1s at +3 with Portal? We ought better than to stay on such a bad pick selection. In my PPS, I held 50% score power due to this.`, `This is like Silk Spider poison which can Paralize, and Bind deactivates minion such as Revr, FzMp and SuFl, as well as Knight movers, a Queen2 doesn't want to downgrade 2 tiers.`, `and with Portal, nigh useless Bind.`, `Brokener at +3 with Portal, kills champ and 3 minions.`, `Never getting into CEO really.`, `Stolen idea from immature Awetalehu.`, `Fait unit is too weak at low tiers, turtling potential.`, `{[SHTN]} is weak for what it can do, best is +1.`, `Hates Knights, boo.`, `Costly at later tiers.`, `It can hold a position well, but too weak.`, `0 Cost triggerish wall is kinda OK, but using +1 may be Broken.`, `Use 4 letter Abrv, which are clearer.`, `Should lose 1 Value on ability use, to avoid spam`, `Need a lot less vwls.`, `I designed much better piece in CheBA.`, `That's a nice {[SHTN]}, seems OP for rushing tool though.`, `...Such procedures result in Egg mutating into a Fire Elemental of similar Tier and slightly higher Value... ...The mutation is not apparent until the Egg hatches, a large amount of Heat is released upwards then... ...Resulting creature does not appear hostile, but may be made attack nearby Entities for susteinance...`, `That's not a valid design. For all valid regular armies there shouldn't be a chance to unfair loss situation.`, `Reversing spots avoids Turn 2 swap secure with Minion, except at higher tiers. Like Legionary but not good at 9 for Base. Could use 2 Orthogonal move at base, cost 9, while Plus uses Warrior range, cost 11.`, `Rather weak, needs buff.`, `Underwhelming, but +3 looks pretty cool, and it's OP.`, `Slightly overcosted, as it's easy to know where it will strike.`, `Worth 11 without KillAllSame and Passive.`, `For some reason, Kongregate does not let me Flag this stupid unit, instead showing the Kongregate message tab blank. Please fix this.`, `James, no, that's a correct use of Augmented squares. Capy, you'd find that CloseUp means getting closer, and MeleeJab is Melee with an extend, no unexpected interactions, not NoBlock. Slash was stated to avoid BlowUp though, so you may have thought that of this too.`, `Actually... {[SHTN]}3 is broken. It's 2 tempos that you need to get rid of it, even into a Lust pull or whatever unit can get to attack their 5th row. This -2tempo attack is less problematic on champions. F300 was right on that.`, `Technically, it gets the most out of +1, and it has higher penalty too.`, `This is better as a standalone appeal.`, `Buff: Can Attack|SwapAlly on Rspw locations. Nerf: Costs 5|6|7|8, Penalty 4|7|9|11, Power 2(x-1).`, `Would rate this 0 in a contest, plz improve.`, `Think designer had no brain cells.`, `Needs lots of changes, poorly designed.`

]
var rsspn = [randint(1, 12)]; rsspn.push(rsspn[0] + randint(1, 6)); rsspn.push(rsspn[1] + randint(1, 6)); rsspn.push(rsspn[2] + randint(1, 6)); 
var sspratings = `0 3.5 4 4.5 5 5.5 6 6.5`.split(` `)
var sspratings2  = `-0.5 -1 -1.5 -2`.split(` `)

$("#confirmToolSize").click(function() {
  let customToolSize = $("#customToolSize").val().trim();
  sketch.set("size", customToolSize)
})

$("#confirmToolColor").click(function() {
  let customToolColor = $("#customToolColor").val().trim();
  sketch.set("color", customToolColor)
})
