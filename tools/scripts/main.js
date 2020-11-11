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
  var oldtext = $("#" + curPASSIVE + " .passives").attr("data-raw") && $("#" + curPASSIVE + " .passives").attr("data-description").concat("\n") || "";
  $("#" + curPASSIVE + " .passives").text(oldtext + text);
  setPassive(oldtext + text, curPASSIVE);
}

function setPassive(text, level, importing=false) {
  var old = $("#" + level + " .passives").attr("data-raw");
  var oldhtml = $("#" + level + " .passives").html();
  text = cleanseText(text);
  $("#" + level + " .passives").attr("data-description", parseText(text, level)).attr("data-raw", text);
  DATA[level].passives = text;
  //if (level != curPASSIVE)
  //    $("#" + level + " .passives").text(DATA[level].passives);
  if ((level = nextLevel(level)) && old == $("#" + level + " .passives").attr("data-raw") && importing == false) { // main_gi: TODO: There must be a bug involving this line and exports, where if you export from say Gemini to BonePile, the +1, +2, and +3 versions still show text even though it should be empty. This is an official piecemaker bug too. The "level = nextLevel" assignment doesn't look great.
    // main_gi: Fixed.
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
  // text = text.replace(/\*\*([^\*]*)\*\*/g, function(a, b) {return `<b>${b}</b>`})
  // text = text.replace(/\*([^\*]*)\*/g, function(a, b) {return `<i>${b}</i>`} )
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

          DATA.custom[MOVES[SMOVE[movename]].id] = DATA.custom[MOVES[SMOVE[movename]].id] || {id: MOVES[SMOVE[movename]].id, name: movename}
          DATA.custom[MOVES[SMOVE[movename]].id].text = this.innerText

          if (MOVES[SMOVE[movename]].symbol1) {DATA.custom[MOVES[SMOVE[movename]].id].symbol1 = MOVES[SMOVE[movename]].symbol1} else {DATA.custom[MOVES[SMOVE[movename]].id].symbol1 = ""}
          if (MOVES[SMOVE[movename]].symbol2) {DATA.custom[MOVES[SMOVE[movename]].id].symbol2 = MOVES[SMOVE[movename]].symbol2} else {DATA.custom[MOVES[SMOVE[movename]].id].symbol2 = ""}
          if (MOVES[SMOVE[movename]].color) {DATA.custom[MOVES[SMOVE[movename]].id].color = MOVES[SMOVE[movename]].color}
          let b = cur => Math.floor((255 - cur) / 2 + cur); // transforms a fill color into a bright equivalent by inverting each value kinda
          if (MOVES[SMOVE[movename]].color2) {DATA.custom[MOVES[SMOVE[movename]].id].color2 = MOVES[SMOVE[movename]].color2} else {DATA.custom[MOVES[SMOVE[movename]].id].color2 = MOVES[SMOVE[movename]].color.map(x=>b(x))}
          if (MOVES[SMOVE[movename]].color3) {DATA.custom[MOVES[SMOVE[movename]].id].color3 = MOVES[SMOVE[movename]].color3} else {DATA.custom[MOVES[SMOVE[movename]].id].color3 = MOVES[SMOVE[movename]].color}
          if (MOVES[SMOVE[movename]].color4) {DATA.custom[MOVES[SMOVE[movename]].id].color4 = MOVES[SMOVE[movename]].color4} else {DATA.custom[MOVES[SMOVE[movename]].id].color4 = MOVES[SMOVE[movename]].color}


          if (MOVES[SMOVE[movename]].nobox == "true") {DATA.custom[MOVES[SMOVE[movename]].id].nobox = true} else {MOVES[SMOVE[movename]].nobox = false}





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
  // Apply move to subsequent level, unless don't-update is on. Also, this "noTierUpdate" variable was declared in rewrite.js.
  if (noTierUpdate) {return}
  if (level = nextLevel(level)) deltaCost(level, delta);
}
$(".cost input").on("keyup mouseup", function() {
  var lv = level(this);
  deltaCost(lv, (+this.value) - DATA[lv].cost);
});
$("input[type=number]").on("wheel", function(e) {
  e.preventDefault();
}); //Lazy approach to support edge cases: Remove them :D

let royalStyle = false // so we don't spam class operations

function checkSpecialStyles() {
  let faction = $(".info span.faction")[0].textContent
  let boardcolor1 = "#ccc"; let royalcolor1 = "#ee7"
  let boardcolor2 = "#eee"; let royalcolor2 = "#ff8"
  if (royalStyle == false && (faction == "Royal" || faction == "Hero") && currentstyle == "cd") {
    royalStyle = true
    $("html").addClass("royal")
    $(".tile").each(function(index) {
      if (this.getAttribute("fill") == boardcolor1) {this.setAttribute("fill", royalcolor1)}
      else {this.setAttribute("fill", royalcolor2)}
    })
  } else if (royalStyle == true && (!(faction == "Royal" || faction == "Hero") || !(currentstyle == "cd"))) {
    royalStyle = false
    $("html").removeClass("royal")
    $(".tile").each(function(index) {
      if (this.getAttribute("fill") == royalcolor1) {this.setAttribute("fill", boardcolor1)}
      else {this.setAttribute("fill", boardcolor2)}
    })
  }
}

//Toggle labels
$(".info span").click(function() {
  var labels = LABELS[this.className],
    ix = labels.indexOf(this.innerText);
  ix += 1;
  ix %= labels.length; // loop around

  $(".info span." + this.className).text(labels[ix]);
  DATA.labels[this.className] = labels[ix];
  checkSpecialStyles()
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
$("#exjh").click(function() { // main_gi: Okay what does this acronym mean, "export javascript hyperlink"?
  var uri = {
    q: toCSV(DATA)
  };
  if (CUSTOM) uri.c = CUSTOM;
  history.replaceState("", "", "?" + $.param(uri));
});

$("#exjb").click(function() { // Export to Betza (Bexport)
  let rv = [];
  let a = toCSV(DATA).split("\n")
  let boards = [a[2], a[3], a[4], a[5]]

  let othertext = a[0].split(",") // A thing like ["Knight", "Champion", "Basic", "Common"]
  if (othertext[0] == "Name" || othertext[0] == "name" || othertext[0] == "PieceName" || othertext[0] == "") {
    // Do nothing then.
  } else {
    rv.push(othertext.join(" ")) // Makes the first line "Knight Champion Basic Common" then
  }

  for (let i = 0; i < boards.length; i++) {
    let x = boards[i].split(",")
    let cost = x[0]
    let passive = x[1]
    let movetypes = array_to_betza(exportcode_to_array(x.slice(2).join(",")), 0) // Slice 2 stuff is because every movetype is split by a comma.
    rv.push(`[${cost}] ${movetypes}${(passive == "")? "" : ` | ${passive}`}`)
  }
  rv = rv.join("\n")

  $("#code").val(rv);
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
$("#hsot").click(function() { // main_gi: Hide/show other tiers
  if ($("#plus").css("display") != "none") {
    $("#plus").css("display", "none");
    $("#plusplus").css("display", "none");
    $("#plusplusplus").css("display", "none");
    $("#hsot")[0].innerHTML = "Hide/Show Upgraded Tiers (hidden)";
  } else {
    $("#plus").css("display", "inherit");
    $("#plusplus").css("display", "inherit");
    $("#plusplusplus").css("display", "inherit");
    $("#hsot")[0].innerHTML = "Hide/Show Upgraded Tiers (shown)";
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

function validate(source) { // THIS IS BASICALLY PART OF IMPORTING

  // main_gi: Check if Betza notation is being used. If so, fix up the notation.
  // Yes, no more than 1 person will ever use this.
  if (!source.match(",")) { // No commas.
    let pieces = ["0,,", "0,,", "0,,", "0,,"]
    let othertext = ["", "", "", ""]
    try {
      let rv = source.replace(/\[|\]|\|/g, "") // replace []| characters (those three)
      rv = rv.replace(/^\n+/, "") // get rid of starting newlines
      rv = rv.split("\n")
      // okay now we have a string like:
      /*
      Knight Champion Basic Common
      [6] jN
      [8] mWjN
      [10] WjN
      [12] WmFjN | Pretend passive here

      There's a quick way to detect if the first string contains "othertext" like that: lowercase letters at the very end (after deleting any potential passive?).

      This doesn't seem like a perfect detection method though.

      A perfect one might involve deleting the 'cost' (number at front) if detected, then splitting spaces, then checking the first element of that.
      */

      if (rv[0].replace(/ \|.+$/, "").match(/[a-z]+$/) && rv[0].split(" ").length <= 4) {
        l(rv)
        let splitted = rv[0].split(" ")

        if (splitted.length == 4) {
          othertext = splitted
        } else {

          try {
            othertext[3] = splitted[0]
            othertext[2] = splitted[1]
            othertext[1] = splitted[2]
          } catch (error) {

          }
          othertext = rv[0].split(" ")
        }
        
        rv.shift()
      }


      let costs = rv.map(x => (x.match(/^([\d\.\-]+)/))? parseFloat(x.match(/^([\d\.\-]+)/)[0]) : 0 ) // No number found, use 0 instead
      rv = rv.map(x => x.replace(/^[\d\.\-]+ /g, ""))


      if (rv[0].match(/(\S+):/)) {
        othertext[0] = rv[0].match(/(\S+):/)[1]
        rv = rv.map(x => x.replace(/(\S+): /, ""))
      }
      let actions = rv.map(x => array_to_exportcode(betza_to_array(x.match(/^\S+/)[0]), 1))
      rv = rv.map(x => x.replace(/^\S+/g, "")) // Get rid of the betza...
      rv = rv.map(x => x.replace(/ \| /g, "")) // Then the | ...
      rv = rv.map(x => x.replace(/^ +/g, ""))  // Then the spaces.
      let passives = rv.map(x => x)

      for (let i=0; i < costs.length; i++) {
        if (i == 4) {break}
        pieces[i] = `${costs[i]},${passives[i]},${actions[i]}`
      }
      l(actions)
      l(pieces)

    } catch (e) {console.log(e)}

    source = `${othertext.join(",")}

${pieces.join(`\n`)}`
  }

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
  checkSpecialStyles()
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
    setPassive(p, curPASSIVE, true);
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

let ORIGINALMOVES = JSON.parse(JSON.stringify(MOVES)) // javascript sucks, this is an array containing objects so it uses crappy references anyway


// main_gi: The majority of the above code is to "restore" things, for the export/import feature.
// main_gi: However, I want to make custom troll pieces and a gallery, so:

!function(a,b,c,d,e,f,g,h,i){function j(a){var b,c=a.length,e=this,f=0,g=e.i=e.j=0,h=e.S=[];for(c||(a=[c++]);d>f;)h[f]=f++;for(f=0;d>f;f++)h[f]=h[g=s&g+a[f%c]+(b=h[f])],h[g]=b;(e.g=function(a){for(var b,c=0,f=e.i,g=e.j,h=e.S;a--;)b=h[f=s&f+1],c=c*d+h[s&(h[f]=h[g=s&g+b])+(h[g]=b)];return e.i=f,e.j=g,c})(d)}function k(a,b){var c,d=[],e=typeof a;if(b&&"object"==e)for(c in a)try{d.push(k(a[c],b-1))}catch(f){}return d.length?d:"string"==e?a:a+"\0"}function l(a,b){for(var c,d=a+"",e=0;e<d.length;)b[s&e]=s&(c^=19*b[s&e])+d.charCodeAt(e++);return n(b)}function m(c){try{return o?n(o.randomBytes(d)):(a.crypto.getRandomValues(c=new Uint8Array(d)),n(c))}catch(e){return[+new Date,a,(c=a.navigator)&&c.plugins,a.screen,n(b)]}}function n(a){return String.fromCharCode.apply(0,a)}var o,p=c.pow(d,e),q=c.pow(2,f),r=2*q,s=d-1,t=c["seed"+i]=function(a,f,g){var h=[];f=1==f?{entropy:!0}:f||{};var o=l(k(f.entropy?[a,n(b)]:null==a?m():a,3),h),s=new j(h);return l(n(s.S),b),(f.pass||g||function(a,b,d){return d?(c[i]=a,b):a})(function(){for(var a=s.g(e),b=p,c=0;q>a;)a=(a+c)*d,b*=d,c=s.g(1);for(;a>=r;)a/=2,b/=2,c>>>=1;return(a+c)/b},o,"global"in f?f.global:this==c)};if(l(c[i](),b),g&&g.exports){g.exports=t;try{o=require("crypto")}catch(u){}}else h&&h.amd&&h(function(){return t})}(this,[],Math,256,6,52,"object"==typeof module&&module,"function"==typeof define&&define,"random");
// this is the min.js for http://davidbau.com/archives/2010/01/30/random_seeds_coded_hints_and_quintillions.html

function l(x) {console.log(x)}
function r(randomed, min, max) {
  if (max == null) {max = min; min = 0}
  if (max < min) {return max}
  min = Math.ceil(min); max = Math.floor(max); return Math.floor(randomed * (max - min + 1)) + min; // Fully inclusive
}

function replaceAll(string, changethis, tothis) { // Because this is unsupported in some browsers, I have to reimplement it thanks js
  return string.split(changethis).join(tothis)
}

// main_gi: Time to smear my r() function into everything I touch.


function numify (x) {return parseInt(x, 10)}
function tob15 (x) {rv = numify(x).toString(15); return (rv.length==1?"0":"") + rv} // "tob15" = "to base 15". Adds leading zeros too.

function tob10 (x) {return parseInt(x, 15)}

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

let lastCEOversion = "v" + Math.max(...Object.keys(CEO).map(x => numify(x.slice(1))).filter(x => !isNaN(x)))


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
  return array.filter(x=>!(Math.abs(x[0]) == 0 && Math.abs(x[1]) == 0) && (Math.abs(x[0]) < 8) && (Math.abs(x[1]) < 8)) // not [0, 0], nothing above 8 or below -8. Also apparently -0 exists, we have to fix that.
}

function convertToSymmetry(array, symmetry="full") {
  if (symmetry == "full") {
    return onlyUnique(array.map(x=>[Math.abs(x[0]), Math.abs(x[1])][0] > [Math.abs(x[0]), Math.abs(x[1])][1]?
      [Math.abs(x[0]), Math.abs(x[1])] : [Math.abs(x[1]), Math.abs(x[0])]))
  } else if (symmetry == "horizontal") {
    return onlyUnique(array.map(x=>[Math.abs(x[0]), x[1]]))
  }
}

function isNumber (value) {return (value == 0 || (!isNaN(value) && value != "" && value != false))? 1 : 0}
function spamAllSymmetry (array, symmetry="full") {
  if (array.length == 2 && isNumber(array[0]) && isNumber(array[1])) {array = [array]} // if you got like [2,1] instead of [[2,1]]

  rv = [...array]
  for (let i=0; i<array.length; i++) {
    let x = array[i][0]
    let y = array[i][1]
    if (symmetry == "horizontal") {
      if (x != 0) {rv.push([-x, y])}
    } else if (symmetry == "full") {
      rv.push([y, x])
      if (x != 0) {
        rv.push([-x, y])
        rv.push([y, -x])
        if (y != 0) {
          rv.push([-x, -y])
          rv.push([-y, -x])
        }
      }
      if (y != 0) {
        rv.push([-y, x])
        rv.push([x, -y])
      }

    }
  }
  return onlyUnique(rv) // nice hack, converts it into a set which must only contain uniques
}

function arraysum (array) {return array.reduce(function(a, b){return a + b;}, 0)}

function arraysubtract(array, brray) { // B array, lol
  rv = []
  for (let i=0; i < array.length; i++) {
    let insidebrray = false;
    for (let j = 0; j < brray.length; j++) {if (arraysequal(array[i], brray[j])) {insidebrray = true}}
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
function uncleanseforhtml (a) {
  if (a === undefined || a === null) {return ""}
  return a.replace(/\\b/g, "\\").replace(/\\n/g, "\n").replace(/\\a/g, ",").replace(/\\o/g, ":").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}
function arrayToX(number) {let rv = []; for (var i = 0; i <= number; i++) {rv.push(i)}; return rv} // creates [0, 1, 2, ..., X]
function arrayspamming(value, len) {return Array.from({length: len}).map(x => value)} // array spammed with a value, length times



function makepiece(seed) { // Somehow I feel like this being in my life is a reference to me having played Layton Brothers several years ago (a character's name being Keelan Makepeace)
  let rng = new Math.seedrandom(seed);

  // First, define the themes:
  let themes = [] // main_gi: LMAO NEVER USED!
  let genericpassives = ["(Status-Immune).", "(Magic-Immune).", "(Ranged-Immune).", "Immune to Freeze.", "Immune to Poison.", "Immune to Petrify.", "Immune to Compel.", "(Displacement-Immune).", "On Kill: Lose # morale.", "On Death: Lose # morale.", "Does not block movement.", "Vanishes after attacking.", "On Melee Death: Destroy the attacker.", "Cannot be targeted by enemy minions.", "Blocks one ability.", "Destroyed on Freeze.", "Cannot move until turn 3.", "(Melee-Immune).", `Begins the game Enchanted for #-ish turns, becoming immune to melee attacks.`].map(x=>cleanseforexport(x))
  let passivecosts = [0.5, 0.5, 0.5, 0.2, 0.2, 0.2, 0.2, 0, -1.5, -2, -0.5, -2, 5, 7, 6, 0, -1, 15, 0.2]

  let nongenericpassives = ["On Death: Kill all adjacent ally units.", "On Death: Petrify all adjacent ally units for 5 turns.", "On Kill: Kill all adjacent ally units.", "On Death: Enchant adjacent ally units for 2 turns.", "Cannot attack enemy units on your opponent's side of the field.", "Cannot attack enemy units until turn ##.", "Cannot attack enemies of lesser value than itself.", "Wins the game if it promotes.", "On Kill: Gains 6 value.\nBeyond move 20, this unit loses 1 value per turn. If this unit reaches 0 value it is destroyed.", "If caught between 2 adjacent enemy champions, this unit is rescued and opponent gains 5 morale.", "If caught between ## adjacent enemy champions, this unit is rescued and opponent gains # morale.", "(Status-Immune).\n(Max Value: #).\nOn Magic: All ally Tombstones gain 1 value.\nRange 2 Augmented: Summon Skeleton at the location of a fallen ally and remove death location.", "Augmented: Teleport to any location adjacent to enemy King.", `On Kill: Opponent loses # morale and your King gains # value. If you do not have a King, this unit gains value instead.`, `On Kill: Swap places with enemy King.`, `On Champion Kill: Opponent loses 1 morale and this unit changes teams.`, `Made by StratShotPlayer.`, `On Kill: Transform into PieceReviver2.`, `Start of Game, On Kill, On Death: Gain # morale.`, `Cannot be Sodomy.`, `On Kill: Gain $## in STEEM currency.`, `Cannot be targeted beyond Range 2. If targeted beyond Range 2, instantly dies.`, `On Kill: Lose 3 morale, which makes the unit unplayable trash.`, `If # enemy champions have been lost, transform into VoidMage+++.`, ``].map(x=>cleanseforexport(x))
  let nongenericcosts = [-12, -8, -4, 4, 6, 8, 10, 4, -3, 4, 6, 6, 2, 0, -4, 5, -1, 1, 1, -3, -3, -3, -3, -3, 87] // last one just makes the cost ridiculous

  // REMEMBER TO ADD TO THE COSTS ARRAY WHEN ADDING A PASSIVE!!


  // + means bonus value at range 2 forwards
  // ++ means bonus value at range 3 forwards: if X then don't put it there!
  // +++ means bonus value at range 4 forwards

  var randoms = Array.from({length: 700}, () => rng()); // Big list of random numbers that'll stay the same

  function rr(i, shiftoverby=2) {
    while (randoms[i] == 0 && i < randoms.length) {i++}
    randoms[i] = randoms[i]*(Math.pow(10, shiftoverby)) - Math.trunc(randoms[i]*(Math.pow(10, shiftoverby)))
  } // "Reset"s the value by dropping two of its digits. I can use about 24 of these before the variable just dies, in which it'll be replaced with the next one then
  // rr() is a declarative function based on randoms

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
    passives = passives.map(x => genericpassives[passivepicked].replace(/\#/g, r(randoms[25], 2, 6).toString() + `[+${r(randoms[26], 1, 34)}]`)) // the "lose morale" number
    costs[0] += passivecosts[passivepicked]
  }
  rr(25); rr(26)
  if (r(randoms[25], 20) > 18) { // non generic passive (added on)
    rr(25); let passivepicked = r(randoms[25], nongenericpassives.length-1); // passivepicked is an index
    rr(25);
    passives = passives.map(x => (x.length>0? x+"\\n":"") + nongenericpassives[passivepicked].replace(/\#/g, r(randoms[25], 2, 6).toString() + `[+${r(randoms[26], 10, 30)}]`.replace(/\#/g, r(randoms[25], 2, 6).toString() + `[+${r(randoms[26], 1, 5)}]`))) // the "lose morale" number, something idiotic

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
  let genericgridspots = [] // list with [3, 2], [3, 3] etc
  let genericgridspots2 = [] // another list like that, but if there were 2 random actions picked
  
  if (genericactions.length != 0) {
    let rangelimit = minionorchampion==0? 2:7

    let horizontal = r(randoms[40], 0, rangelimit); rr(40)
    let vertical = r(randoms[40], 0, rangelimit); rr(40)
    let diagonal = r(randoms[40], 0, rangelimit); rr(40)

    let hDisplace = (r(randoms[40], 0, 6)==6? 1:0); rr(40) // displace should be rare (1/7 chance right now)
    let vDisplace = (r(randoms[40], 0, 6)==6? 1:0); rr(40)
    let dDisplace = (r(randoms[40], 0, 6)==6? 1:0); rr(40)
    //l(horizontal); l(vertical); l(diagonal); l(hDisplace); l(vDisplace); l(dDisplace)

    genericgridspots = [].concat(arrayToX(horizontal).slice(hDisplace).map(x=>[0, x+hDisplace]), arrayToX(vertical).slice(vDisplace).map(x=>[x+vDisplace, 0]), arrayToX(diagonal).slice(dDisplace).map(x=>[x+dDisplace, x+dDisplace]))
    genericgridspots = onlyUnique(limitGridSpots(legitSpotsOnly(genericgridspots), symmetrytype), symmetrytype)

    if (genericactions.length == 2) {
      let horizontal2 = r(randoms[40], horizontal, rangelimit); rr(40)
      let vertical2 = r(randoms[40], vertical, rangelimit); rr(40)
      let diagonal2 = r(randoms[40], diagonal, rangelimit); rr(40)
      genericgridspots2 = [].concat(arrayToX(horizontal2).slice(hDisplace+horizontal).map(x=>[0, x+hDisplace+horizontal]), arrayToX(vertical2).slice(vDisplace+vertical).map(x=>[x+vDisplace+vertical, 0]), arrayToX(diagonal2).slice(dDisplace+diagonal).map(x=>[x+dDisplace+diagonal, x+dDisplace+diagonal]))
      genericgridspots2 = onlyUnique(limitGridSpots(legitSpotsOnly(genericgridspots2), symmetrytype), symmetrytype)
      if (genericgridspots2.length == 0) {genericactions.slice(0, 1)} // whoops, no action!
    } // The idea is that the 2nd generic action comes after the first one
    // These are full symmetric no matter what. We include ALL valid numbers
  }



  let atomstouse = r(randoms[100], actionstouse, 5); rr(100) // This is the NUMBER of random actions involved

  let shuffledgridspots = shuffleArray(goodgridspots, 75)
  let selectedgridspots = shuffledgridspots.slice(0, atomstouse)
  selectedgridspots = arraysubtract(convertToSymmetry(selectedgridspots), genericgridspots.concat(genericgridspots2))

  // Now assign the actions to the grid spots?
  let actionassignments = []
  for (let i = 0; i < selectedgridspots.length; i++) {
    actionassignments[i] = shuffledactions[i%shuffledactions.length] // They're already both shuffled, so no extra random needed!
  }

  //l(genericactions); l(genericgridspots); l(genericgridspots2); l(randoms[40])
  //l(selectedgridspots); l(actionassignments)  // Incorporate the generic moveset into the assignments and grid spots!
  shuffledactions = shuffledactions.concat(genericactions)
  selectedgridspots = selectedgridspots.concat(genericgridspots, genericgridspots2)
  actionassignments = actionassignments.concat(arrayspamming(genericactions[0], genericgridspots.length), arrayspamming(genericactions[1], genericgridspots2.length))


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
                if (arrayindexof(selectedgridspots, [0, k]) == -1 && arrayindexof(selectedgridspots, [k, 0]) == -1) {
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
      } else if (minionorchampion == 0 && (symmetrytype == "horizontal") && (arrayindexof(selectedgridspots, [2, 2]) == -1)) { // Move from start range 2
        selectedgridspots.push([2, 2]); actionassignments.push(10);
        shuffledactions.push(10); shuffledactions = onlyUnique(shuffledactions); break
      } else if (minionorchampion == 0 && (symmetrytype == "horizontal") && (arrayindexof(selectedgridspots, [0, -1]) == -1)) { // Backmove
        selectedgridspots.push([0, -1]); actionassignments.push(1);
        shuffledactions.push(1); shuffledactions = onlyUnique(shuffledactions); break
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
    if (randoms[499] < 0.5) {nameinput = nouns[r(randoms[500], nouns.length-1)]}
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





function makefcpiece (seed) {
  let rng = new Math.seedrandom(seed);
  var randoms = Array.from({length: 700}, () => rng()); // Big list of random numbers that'll stay the same

  function rr(i, shiftoverby=2) {
    while (randoms[i] == 0 && i < randoms.length) {i++}
    randoms[i] = randoms[i]*(Math.pow(10, shiftoverby)) - Math.trunc(randoms[i]*(Math.pow(10, shiftoverby)))
  } // REROLL a random number, can be used like 24 times
  function seedrandomarray (x, y) {return x[r(randoms[y], x.length-1)]}
  function shuffleArray(array, seednumber) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(randoms[seednumber] * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
      if (randoms[seednumber] == 0) {seednumber++}
      rr(seednumber)
    }
    return array
  } // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array/18650169#18650169
  function ordinal(i) {
    var j = i % 10, k = i % 100;
    if (j == 1 && k != 11) {return i + "st";} if (j == 2 && k != 12) {return i + "nd";} if (j == 3 && k != 13) {return i + "rd";}
    return i + "th";}
  function plural(word) {if (word.endsWith("y")) {return word.slice(0, word.length-1) + "ies"} else if (word.endsWith("x")) {return word.slice(0, word.length-1) + "es"} else if (word.endsWith("s")) {return word.slice(0, word.length-1) + "ses"} else {return word + "s"}}
  function aan (name) {if (/^([aeiou])/i.test(name)) {return "an " + name} else {return "a " + name}} // Inaccurate, but you know what, it's FC. Whatever.

  let unittype = r(randoms[0], 2); rr(0) // Minion, Champion, Token?
  unittype = unittype==0?"Minion": unittype==1?"Champion" : "Token"
  if (randoms[0] < 0.1) {unittype = "King"}
  rr(0)

  let xr = r(randoms[0], 29); rr(0)
  let rarity = (xr<10)?"Common":(xr<20)?"Rare":(xr<30)?"Epic":"Legendary" // Minion or Champion? (Champion is 1)
  let isUnique = false
  function setUnique() {isUnique = true; rarity = rarity + " (unique)"}
  function toBlockable (x) {if (x == 3) {return 0} else if (x == 4) {return 111} else if (x == 5) {return 1} else {return x}} 
  function isBlockable (x) {return (x == toBlockable(x))}
  function isAttack (x) {return x==0||x==2||x==3||x==111? true:false}
  function isMove (x) {return x==0||x==1||x==3||x==5||x==111? true:false}
  function removeMove (x) {return 2} // So you can't do anything about '1', the move only... so I did this instead.

  let edition = r(randoms[3], 1, 999); rr(0)
  let costs = [0,0,0,0];
  let passives = ["", "", "", ""];
  let movesets = [[], [], [], []];
  let customabilitydeclarations = "" // usually nothing

  let selectedgridspots = [] // list with [3, 2], [3, 3] etc

  function capitalize(x) {return x.charAt(0).toUpperCase() + x.slice(1);}
  function randomlycap(x) {if (Math.random() > 0.5) {return x.charAt(0).toUpperCase() + x.slice(1);} else {return x.charAt(0).toLowerCase() + x.slice(1);}} // could seed it but i think it's funnier not to
  let otherunit = randomlycap(seedrandomarray(fcnouns, 99)); rr(99) // random unit names, sometimes it is used in tokens and sometimes not
  let otherunit2 = randomlycap(seedrandomarray(fcnouns, 99)); rr(99)
  let otherunit3 = randomlycap(seedrandomarray(fcnouns, 99)); rr(99)


  if (unittype == "Token") {

    let tokentarget = [`No target (Passive)`, `No target (Active)`, `Target allied  (Active)`, `Target allied minion (Active)`, `Target enemy minion (Active)`, `Target unoccupied square in play (Active)`, `Target reserve unoccupied square (Active)`] // random extra space is intentional to match FC
    tokentarget = seedrandomarray(tokentarget, 60); rr(60) // pick one
    let quickplaymaybe = ""
    if (r(randoms[60], 3) == 3 && tokentarget != `No target (Passive)`) {quickplaymaybe = " (Quick Play)"}; rr(60) // quick play chance


    let tokenturndelay = r(randoms[60], 100); rr(60)
    if (tokenturndelay >= 75) {tokenturndelay = ""}
    else if (tokenturndelay >= 70) {tokenturndelay = "Only usable with after you've lost 4 or more champions"}
    else if (tokenturndelay >= 68) {tokenturndelay = "Only usable with after you've captured 4 or more enemy champions, captured 5 or more enemy minions, lost 6 or more of your champions, or lost 7 or more of your minions"}
    else if (tokenturndelay >= 66) {tokenturndelay = "Only usable with after you've captured the enemy king or lost your own king or captured 8 or more enemy champions"}
    else if (tokenturndelay >= 50) {tokenturndelay = "Only usable with after you've captured 4 or more enemy champions"}
    else {
      tokenturndelay = tokenturndelay - (tokenturndelay % 5) + 5
      tokenturndelay = `Only playable on turn ${tokenturndelay} or later`} // should make multiples of 5 up to 75
    let secondcondition = r(randoms[60], 5); rr(60)
    let secondconditions = [`and if you have less than 2 golems`, `and if you have less than 2 champions`, `and if you haven't lost any pieces this game`, `and if you have used less than 3 tokens this game`, `and if your opponent has no Stealth pieces`, `and if one of your pieces has lost Armored`, `and if you have a Central piece in a corner`]
    if (secondcondition == 5 && tokenturndelay != "") {tokenturndelay = tokenturndelay + " " + secondconditions[r(randoms[60], secondconditions.length-1)]}

    let tokeneffects = r(randoms[60], 100); rr(60)
    let chosenx = r(randoms[60], 100); rr(60) // Dummy variables for the same random numbers to be used 
    let choseny = r(randoms[60], 100); rr(60) // wait, 'dummy' is offensive, they're idiot variables instead
    let chosenz = r(randoms[60], 100); rr(60) // idiot variable 3

    let dumbsmallnumber = r(randoms[62], 2, 8); rr(62)
    let dumbmediumnumber = r(randoms[62], 10, 30); rr(62)
    let dumbhighnumber = r(randoms[62], 50, 200); rr(62)
    let restofthing = ""

    if ([`Target unoccupied square in play (Active)`, `Target reserve unoccupied square (Active)`].includes(tokentarget)) {
      let inyour = [`in your reserve`, `on any unoccupied square on the board`, `on any unoccupied square on your half of the board`, `on any unoccupied empty square with an even numbered ID`, `in your opponent's reserve`, `on any unoccupied white square`, `on any square one of your allied pieces died in`, `on any square that an enemy minion died in`, `on any square where one of your Queens died in`, `in all unoccupied squares of your reserve`]
      inyour = seedrandomarray(inyour, 70); rr(70)

      if (choseny >= 75) {
        restofthing = `Create ${aan(otherunit)} ${inyour}.`
      } else if (choseny >= 50) {
        restofthing = `Create three adjacent ${plural(otherunit)} ${inyour}.`
      } else if (choseny >= 25) {
        restofthing = `Create a camel, zebra, lion, and ${aan(otherunit)} ${inyour}.`
      } else {
        restofthing = `Create ${aan(otherunit)}, ${otherunit2}, and ${otherunit3} ${inyour}.`
      }
    } else if ([`Target allied  (Active)`, `Target allied minion (Active)`, `Target enemy minion (Active)`].includes(tokentarget)) {
      let nonsenseabilities = [...new Set(MOVES.map(x=>x.text).filter(x=>x.includes("ally") && x.slice(0, 1) == x.slice(0, 1).toUpperCase()).map(x=>x.replace(/\[Pay \d+\]:|\(.+\)/g, "").trim()))]
      let morenonsense = [`Move two friendly champions or minions to your reserve.`, `Capture any two enemy minions.`, `Delete an enemy minion from the game.`, `Capture all enemy minions.`, `Capture one of your own minions and put it in the reserve.`, `Turn your reserve into not-the-reserve.`, `Move one friendly minion and any adjacent minions forward 2 squares if the square is unoccupied.`, `Move one friendly minion and one enemy minion closer together. They castle.`]
      nonsenseabilities = nonsenseabilities.concat(morenonsense)
      restofthing = seedrandomarray(nonsenseabilities, 71); rr(71)
    } else if (tokentarget == `No target (Passive)`) { 
      let nonsenseabilities = [`Begin the game with a row of ${plural(otherunit)} in front of your row of minions. They do not count as being in their starting location.`, `Twice per turn after moving a piece that was in the reserve you may make another move with a different piece.`, `Your opponent's champion line now counts as the reserve except for their King.`, `Move one friendly piece to the reserve to the unoccupied square directly in front of it or to the side of it. That piece cannot move or attack or swap or use an ability for # turns. After use, ${randomlycap(seed)} can be used again in # turns, unless you used another token.`, `Increase your game clock's remaining time by ###%.`, `Enemy pieces that couldn't move until turn 3 now can't move until turn ###.`, `Your opponent has ##% less bonus time on each of their turns.`, `You get ###% more bonus time on each of your turns.`, `You can add # more pieces to your reserve.`, `Your army can include # more copies of each champion.`, `You only need to deploy # minions instead of 8.`, `You only need to deploy ## minions instead of ###.`, `The first time one of your minions promotes, it becomes ${aan(otherunit)}.`, `The first time one of your minions promotes, it becomes ${aan(otherunit)} if you have 2 ${plural(otherunit)} deployed.`, `Your king is indestructible, but if your king is threatened # times, you lose the game.`, `The first time your king captures a piece, the king transforms into it, it still counts as a king by the way.`, `At the start of your turn if a player has # or less minions deployed or have two or more kings they lose.`]
      restofthing = seedrandomarray(nonsenseabilities, 71); rr(71)

    } else {// "no target" active
      let nonsenseabilities = [`Increase your game clock's remaining time by ###%.`, `Steal ###% of your opponent's timer.`, `Your king cannot be killed for the next # turns.`, `Stop your opponent's king from moving.`, `Scramble the digits of your timer.`, `Steal ##% of your opponent's timer. If you use this token when your timer ends in ":010" or ":60", steal an additional #% of your opponent's timer.`, `Your captures deal double damage for the next # turns.`, `Negate the next # enemy turns.`, `Steal your opponent's next turn.`, `You gain ##% more gold and experience after this game.`, `You gain ##% more rating after this game.`, `Every piece you summon this game gives you ## gold.`, `Declare that you plan to lose this game, then get # free turns. If you don't lose in that time, you lose ## rating.`, `Put ${aan(otherunit)} into your collection.`, `Put # ${plural(otherunit)} into your collection.`]
      restofthing = seedrandomarray(nonsenseabilities, 71); rr(71)

    }

    if (tokenturndelay != "") {tokenturndelay += ". "}
    passives[0] = `${tokentarget}${quickplaymaybe}\n\n${tokenturndelay}${restofthing}`
    if (seed == "Crazyhouse") {
      passives[0] = `No target (Passive)\n\nWhen you capture an enemy piece, put it into your reserve.`
    } else if (seed == "Necromancer") {
      passives[0] = `No target (Passive)\n\nThe first allied piece that captures an enemy piece instantly moves back to its original position.`
    } else if (seed == "Hillking") {
      passives[0] = `No target (Passive)\n\nDomain victory can be achieved in the center four squares.`
    }
    passives[0] = passives[0].replace(/###/g, dumbhighnumber).replace(/##/g, dumbmediumnumber).replace(/#/g, dumbsmallnumber)
    passives[0] = cleanseforexport(passives[0])
  }


  let rangelimit = unittype=="Minion"? 2:6
  let symmetrytype = unittype=="Minion"? "horizontal":"full"

  let axial = r(randoms[40], 0, rangelimit); rr(40)
  let diagonal = r(randoms[40], 0, rangelimit); rr(40)
  let giraffe  = r(randoms[40], 0, rangelimit+50); rr(40) // we're not doing it if it's above 7

  let aDisplace = (r(randoms[40], 0, 6)==6? 1:0); rr(40) // displace should be rare (1/7 chance right now)
  let dDisplace = (r(randoms[40], 0, 6)==6? 1:0); rr(40)

  // axial and digagonal thresholds
  let xThr = r(randoms[40], 0, axial); rr(40)    // second action overwrites first action if below threshold
  let yThr = r(randoms[40], 0, diagonal); rr(40) // this means 0 and 0 thresholds = no overwrite

  selectedgridspots = [].concat(arrayToX(axial).slice(aDisplace).map(x=>[0, x]), arrayToX(diagonal).slice(1+dDisplace).map(x=>[x, x])) // Slice the diagonal array by 1 by default, because 0,0

  if (unittype == "Minion") { // Before completing the gridspot checks, let's add some if it's a minion that may not be there
    let addspots = r(randoms[40], 0, 10); rr(40)
    if (addspots >= 5) {selectedgridspots.push([1, 0])}
    if (addspots % 3 == 1) {selectedgridspots.push([1, -1])}
    if (addspots % 3 == 2) {selectedgridspots.push([0, -1])}
  } else if (giraffe <= 7) {
    selectedgridspots = selectedgridspots.concat(arrayToX(giraffe).map(x=>[1, x+2]))
  }

  selectedgridspots = onlyUnique(legitSpotsOnly(spamAllSymmetry(selectedgridspots, symmetrytype)))

  let actionstouse = [0, 1, 2, 3, 5]
  if (r(randoms[41], 22) == 22) {actionstouse.push(111)}; rr(41) // 111 is blockable move/attack/swap, should be rare
  actionstouse = shuffleArray(actionstouse, 39).slice(0, r(randoms[40], 2, 2)); rr(40) // 1-2 random actions 

  let hasAbility = false; let abilitycheck = r(randoms[41], 14); let custommoveid = SMOVE["custom1"]
  if (abilitycheck <= 1 && unittype != "Minion") {hasAbility = true; actionstouse[1] = custommoveid}; rr(41)
  if (unittype == "Minion" && abilitycheck <= 1) {actionstouse[1] = 10} // we reusing this as "move from start"

  if (seed.endsWith("Wall")) {unittype = "Minion"; actionstouse.map(x => removeMove(x))} // delete all non moves lol

  let actionassignments = selectedgridspots.map(x=> (Math.abs(x[0]) > xThr) || (Math.abs(x[1]) > yThr)? actionstouse[0]:actionstouse[1]) // CURRENTLY BROKEN. On second thought this looks even better than doing it correctly. So nevermind.
  // (I wanted the thresholds to be axial and diagonal but it was x and y instead, which makes vertically asymmetrical stuff)


  actionassignments = selectedgridspots.map((x, index) => Math.abs(x[0]) <= 1 && Math.abs(x[1]) <= 1 && !actionstouse.includes(toBlockable(actionassignments[index]))? toBlockable(actionassignments[index]) : actionassignments[index]) // the "all are range 1" blockable check, worded like this so that it doesn't create "dryad+" level useless teleports
  actionassignments = selectedgridspots.map((x, index) => Math.abs(x[1]) >= 4 && !((giraffe <= 7) && Math.abs(x[1] == 1)) && !isBlockable(actionassignments[index]) && isAttack(actionassignments[index])? toBlockable(actionassignments[index]) : actionassignments[index]) // the "range 3+" unblockable check 


  // add knight, camel, zebra actions
  let actionchosenforknightlikes = (r(randoms[42], 1)==1)? 3:5
  if (unittype == "Minion" && actionchosenforknightlikes == 3) {actionchosenforknightlikes = 20} // unblockable knight stuff

  if (giraffe > 7) { // don't make the knight parts if giraffe done
    if (r(randoms[42], 8) == 8) {let extramoves = spamAllSymmetry([1, 2], symmetrytype); selectedgridspots = selectedgridspots.concat(extramoves); actionassignments.push(...arrayspamming(actionchosenforknightlikes, extramoves.length))}; rr(42)
    if (r(randoms[42], 12) == 12) {let extramoves = spamAllSymmetry([1, 3], symmetrytype); selectedgridspots = selectedgridspots.concat(extramoves); actionassignments.push(...arrayspamming(actionchosenforknightlikes, extramoves.length))}; rr(42)
  }
  if (r(randoms[42], 25) == 25) {let extramoves = spamAllSymmetry([2, 3], symmetrytype); selectedgridspots = selectedgridspots.concat(extramoves); actionassignments.push(...arrayspamming(actionchosenforknightlikes, extramoves.length))}; rr(42)

  if (unittype == "Token") {actionstouse = []; selectedgridspots = []; actionassignments = []}

  actionstouse = onlyUnique(actionassignments);        l(actionstouse); l(selectedgridspots); l(actionassignments); l(`+: ${axial}, X: ${diagonal}, + TH: ${xThr}, X TH: ${yThr}, + DISPLACE: ${aDisplace}, X DISPLACE: ${dDisplace}`)

  function finalMoveMaker() {
    let finalmoveset = ""
    for (let i = 0; i < actionstouse.length; i++) {
      if (!actionassignments.includes(actionstouse[i])) {continue} // ???
      finalmoveset = finalmoveset + MOVES[actionstouse[i]].id + ":"
      for (let j = 0; j < actionassignments.length; j++) {
        if (actionassignments[j] == actionstouse[i]) {
          finalmoveset = finalmoveset + pm(selectedgridspots[j][0], -selectedgridspots[j][1]) // y is flipped?? fixed
        }
      }
      finalmoveset = finalmoveset + ","
    }
    return finalmoveset.replace(/,$/, "") // remove the last comma
  }
  movesets[0] = finalMoveMaker()

  //let actionworths =   `10,3+2,7,10+4++7+++X,16+6++8+++X,7,9,14,9,8,1+3,5+7++X,6,5,11++7,10,1+5,20,35,5,12`.split(",") // only intuition behind the numbers, not logic
  let actionworths = [10, 2, 7, 15, undefined, 4]

  function actionvalue(id) {
    if (id == 111) {return 15}
    if (id == custommoveid) {return 4}
    if (actionworths[id] == undefined) {return 9}
    return actionworths[id]
  }
  function countInArray(array, value) {return array.reduce((n, x) => n + (x === value), 0)}

  costs[0] = arraysum(actionstouse.map(x => actionvalue(x) * countInArray(actionassignments, x) / 22))
  costs[0] += r(randoms[30], -1, 1); rr(30)
  
  let unittypeinpassive = unittype
  if (unittype == "Minion") {
    // "WAIT UP!" The Pawn said, fleet of foot --
    // "You forgot to mention what I promote to!"
    // The ephemeral ghost took a sip of his coffee, spun around in his chair, and nodded his head.
    unittypeinpassive = `Minion (promotes to ${capitalize(otherunit3)})`
    // "YAY!!!" The Pawn cried happily, but the shimmering ghost was unimpressed.
    if (seed.endsWith("n")) {unittypeinpassive = `Minion (does not promote)`}
    // "I'm a solo developer. I don't need to do anything you request."
  } else if (unittype == "Token") {
    costs[0] = r(randoms[30], 2, 33)
  }
  let passivelist = []

  if (unittype != "Token") {

    let unitHasAttacks = actionstouse.filter(x => isAttack(x)).length > 0
    let unitHasMoves = actionstouse.filter(x => isMove(x)).length > 0
    let unitIsColorbound = selectedgridspots.filter(x => isMove(actionassignments[arrayindexof(selectedgridspots, x)]) && (Math.abs(x[0]) + Math.abs(x[1])) % 2 == 0).length > 0 // if upon adding their moves they're all even
    let unitIsDoublebound = selectedgridspots.filter(x => isMove(actionassignments[arrayindexof(selectedgridspots, x)]) && Math.abs(x[0]) % 2 == 0 && Math.abs(x[1]) % 2 == 0).length > 0 // if both x and y are all even

    if (unittype == "Minion") {costs[0] += 2}
    if (unitHasAttacks) {costs[0] += 1} // ability to attack at all
    if (unitHasMoves) {costs[0] -= 2}
    else if (unitIsDoublebound) {costs[0] -= 1.5}
    else if (unitIsColorbound) {costs[0] -= 1}

    if (selectedgridspots.filter(x => Math.abs(x[0]) <= 1 && Math.abs(x[1]) <= 1 && isAttack(actionassignments[arrayindexof(selectedgridspots, x)])).length == 8) {costs[0] += 2} // kingattack

    if (r(randoms[110], 0, 4) == 4) {passivelist.push("*Stealth"); costs[0] += 3}; rr(110)
    if (diagonal >= 6) { // check for central
      let centraltest = selectedgridspots.filter((x) => Math.abs(x[0]) >= 6 && Math.abs(x[1]) >= 6 && isAttack(actionassignments[arrayindexof(selectedgridspots, x)]))
      if (centraltest.length > 0) {passivelist.push("*Central")}
    }
    if (r(randoms[110], 0, 4) == 4) {passivelist.push("*Armored"); costs[0] += 4; costs[0] *= 1.4}; rr(110)
    if (r(randoms[110], 0, 4) == 4 && unitHasMoves) {passivelist.push("*Withdraw"); costs[0] += 0.1}; rr(110)
    if (r(randoms[110], 0, 4) == 4 && unitHasAttacks) {passivelist.push("*Berserk"); costs[0] -= 1}; rr(110)
    if (r(randoms[110], 0, 4) == 4 && !unitHasAttacks && unittype != "King") {passivelist.push("*Indestructible"); setUnique(); if (passivelist.includes("*Armored")) {passivelist = passivelist.splice(passivelist.indexOf("Armored"), 1)}; costs[0] += 2.5}; rr(110) // no attacks

    if (selectedgridspots.filter(x => Math.abs(x[1]) == 3 && !isBlockable(actionassignments[arrayindexof(selectedgridspots, x)]) && isAttack(actionassignments[arrayindexof(selectedgridspots, x)])).length > 0) {passivelist.push("Cannot move until turn 3.")} //  "selectedgridspots.indexOf(x)" EQUALS the current element index


    if (unittype == "King" && unitHasAttacks && selectedgridspots.filter(x => Math.abs(x[1]) >= 2 && isMove(actionassignments[arrayindexof(selectedgridspots, x)])).length >= 2) {passivelist.push("Cannot achieve domain victory."); costs[0] += (selectedgridspots.filter(x => Math.abs(x[1]) >= 2 && isMove(actionassignments[arrayindexof(selectedgridspots, x)])).length) * 3 / 4}; rr(110) // extra moves count a lot for a king

    if (seed.endsWith("Wall") || costs[0] < 2) {passivelist.push("*Deployed")}
    if (hasAbility && unittype != "Token") {
      customabilitydeclarations = "c1,use ability,■,,0,0,0,127,127,127,255,242,0,255,242,0,true"
      if (abilitycheck == 0) {passivelist.push("Ability: create " + aan(otherunit) + " once per game.")} // the "check == 0" does not mean it failed to check, it's just a random number that was declared before
      if (abilitycheck == 1) {passivelist.push("Ability: create " + aan(otherunit) + " three times per game."); costs[0] += 3}
    }
    passives[0] = `${unittypeinpassive}\\n${passivelist.map(x=>cleanseforexport(x)).join("\\n")}`

  }
  passives[0] += `\\n\\n${rarity} - ${ordinal(edition)} Edition`
  costs = costs.map(x=>Math.floor(Math.max(0, costs[0])))




  return `${seed},${unittype},Basic,${rarity}

${costs[0]},${passives[0]},${movesets[0]}
${costs[1]},${passives[1]},${movesets[1]}
${costs[2]},${passives[2]},${movesets[2]}
${costs[3]},${passives[3]},${movesets[3]}
${customabilitydeclarations}
` // NOTE: \\o needs to be written for a colon, \\a for a newline, I think

}

function bold (s) {return `<b>${s}</b>`}

function newUnitsParse(a) {
  if (a == undefined || a.length == 0) {return ""}
  let tokens = "King, Sapling, Tree, BonePile, StonePillar, PhoenixEgg, PhoenixEgg+, PhoenixEgg++, PhoenixEgg+++, Sorceress, GeminiTwin, GeminiTwin+, GeminiTwin++, GeminiTwin+++, ChaosPortal, Dummy, SuperDummy, MageDummy, Blank".split(", ")
  a = a.filter(x => !tokens.includes(x)).concat(a.filter(x => tokens.includes(x))) // Puts tokens at the very end

  let veryOP = `GravityMage, AirElemental, Greed, Snake, Reaver, Pikeman, Nexus, VoidMage`
  let overpowered = `Salamander, FireElemental, Angel, EarthElemental, Gnome, Apprentice`.split(', ')
  let underpowered = `Summoner, Lust, Duelist, SoulFlare, Sylph, ArchBishop, Fortress, Templar, Wrath, Phalanx, Gluttony, Hydromancer, Toad, Tombstone`.split(', ')
  let veryUP = `ThunderMage, Hostage, Fencer, Beacon, Mercenary, Envy, Hoplite, Siren, Butterfly, Taurus, Temperance, NullMage, StoneMage, FireMage`

  let partialOP = `Aquarius, Undine, WaterElemental, Pride, Chastity`.split(', ')


  function boldcolor(x, color) {return `<span style="font-weight: bold; color: ${color}">${x}</span>`}
  function token (x) {return `<span style="font-style: italic; color: #aaa">${x}</span>`}

  return `${bold("New units:")} ` + a.map(x =>
    veryOP.includes(x)?        boldcolor(x, "#0FF") // Cyan = very OP
    :overpowered.includes(x)?  boldcolor(x, "#8F0") // Lime = OP
    :partialOP.includes(x)?    boldcolor(x, "#FF0") // Yellow = partial OP/UP
    :underpowered.includes(x)? boldcolor(x, "#F80") // Orange = UP
    :veryUP.includes(x)?       boldcolor(x, "#F00") // Red = very UP
    :tokens.includes(x)?       token(x)             // Gray = token piece
    :bold(x)).join(", ")
}

function updateGalleryChangelog(version) {
  let log = CEO[version].misc.parsedlog; let timePast = ``

  if (CEO[version].misc.prevversionnumber && CEO[version].misc.release) {
    let daysPast = Math.round((Date.parse(CEO[version].misc.release) - Date.parse(CEO[CEO[version].misc.prevversionnumber].misc.release))/(1000*60*60*24)) // there is some stupid leap year stuff probably, hope JS takes care of it.
    let monthsPast = 0
    let yearsPast = 0
    if (daysPast >= 30) {
      monthsPast = Math.floor(daysPast/30); daysPast = daysPast % 30
    }
    if (monthsPast >= 12) {
      yearsPast = Math.floor(monthsPast/12); monthsPast = monthsPast % 12
    }
    function plural (n, s) {if (n != 1) {return s + "s"} else {return s}}
    timePast = [`${yearsPast > 0? yearsPast + " " + plural(yearsPast, "year"):``}`,
    `${monthsPast > 0? monthsPast + " " + plural(monthsPast, "month"):``}`,
    `${daysPast > 0? daysPast + " " + plural(daysPast, "day"):``}`].filter(x => x != ``) .join(", ") + ` past`
    if (timePast == ` past`) {timePast = ``}
  }

  let release = CEO[version].misc.release? `(${CEO[version].misc.release}) <i style="font-size: 80%">${timePast}</i>` : ``
  let highlights = CEO[version].misc.highlights? `<div style="padding: 5px; border: 1px solid white; background: radial-gradient(#242440, #1416bc); line-height: 120%">${CEO[version].misc.highlights.replace(/(^\s*(?!.+)\n+)|(\n+\s+(?!.+)$)/g, "")}</div>`.replace(/\n/g, "<br>") : ``
  let firstlogsection = `<div style="text-align: center; border-top: 1px solid white; border-bottom: 1px solid white; background: radial-gradient(#242440, #1416bc);"><b style="font-size: 120%">${version}</b> ${release}
    <br><div style="color: #aaa; font-size: 80%; line-height: 100%">(warning: changelog compression is somewhat potato, also summaries are partially just my opinion)</div>
    </div>`

  if (!log && !highlights) {$("#gallerychangestext2").html(`<b>${version}</b> ${release}`); return}
  else if (!log) {$("#gallerychangestext2").html(uncleanseforhtml(
    `${firstlogsection}
    <div style="height: 10px"></div>
    ${highlights}`)); return
  }
  $("#gallerychangestext2").html(uncleanseforhtml(
    `${firstlogsection}
    <div style="height: 10px"></div>
    ${highlights}<div style="height: 10px"></div>
    ${newUnitsParse(CEO[version].misc.newunits)} <div style="height: 10px"></div>
    ${log? log.join("\n").replace(/\n/g, "<br>") :""}`))
}

updateGalleryChangelog(lastCEOversion) // "initializes" it

function getgallery (nameinput, version=lastCEOversion, versionChangedAtAll=false) {
  let lename = nameinput.replace(/\d/, "");
  let lepieces = [CEO[version][`${lename}`], CEO[version][`${lename}2`], CEO[version][`${lename}3`], CEO[version][`${lename}4`]]
  if (lename == "misc") {return} // don't output error in console

  if (lepieces.every(x => x == undefined)) {lepieces[0] = {cost: "", rarity: " ", movesraw: "1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1", movetypespmformat: "NaN", movespmformat: "", betza: "", class: " ", changes: "", passive: "(This piece doesn't exist in the currently selected version.)" }}

  lepieces = lepieces.map(x=> x != undefined? x : { cost: "0", rarity: " ", movesraw: "1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1", movetypespmformat: "NaN", movespmformat: "", betza: "", class: " ", changes: "" })
  
  for (let i=0; i < lepieces.length; i++) { // Would have been a one-liner with good map syntax.
    let x = lepieces[i]
    if ((x.movetypespmformat) == "NaN") {lepieces[i].movetypespmformat = ""}
  }
  

  let ClanBoxList = ["Ninja","Swordsman","Spearman","Axeman","Legionary","Paladin","Berserker","Antimage","Warrior","Samurai"];
  let ArcaneBoxList = ["Wizard","Bomber","Pyromancer","Banshee","Phantasm","FrostMage","Fireball","PoisonMage","SoulKeeper","WindMage","Portal","ThunderMage"];
  let ForestBoxList = ["Dragon","Wisp","Guardian","Dryad","Ranger","Archer","Spider","Basilisk","Enchantress","Tiger","Drake"];
  // Hardcoded because this info is not anywhere near the piece data itself. Grand also hardcoded it this way.

  let pieceset = ClanBoxList.includes(lename)? "Clan":ArcaneBoxList.includes(lename)? "Arcane":ForestBoxList.includes(lename)? "Forest":"Basic"
  if (version.endsWith("40") && lename == "ThunderMage") {pieceset = "Basic"} // Thanks grand!

  
  if ($("#gallerychanges")[0].style.display = "none") {
    $("#gallerychanges")[0].style.display = "initial"
  }

  $("#gallerychangestext").html(lepieces.map(x=>x.betza? x.betza : 0).filter(x => x != 0).join("<br>"))

  if (versionChangedAtAll) { // should save on performance, recentlychangedversion stuff
    updateGalleryChangelog(version)
  } // the "toString" is because I keep forgetting if changelog should be [] or ""

  // Don't forget to switch 42 and 43, because the piecemaker is literally wrong here
  //function r4243 (x) {return x.replaceAll("42:", "FOURTYTHREE").replaceAll("43:","42:").replaceAll("FOURTYTHREE", "43:")}
  function r4243 (x) {return x}
  function fixpassive (x) {return x? x:""} // if there's no passive, returns empty string

  function fixoutdatedactions (x, gamegallery) { // this looks at the whole export string and adds custom actions if the current ability text does not match the old version text
    let totalmoves = onlyUnique(lepieces.map(x=>x.movetypespmformat).toString().replace(/ /g, "").split(",")).sort() // Only unique movetypes across the tiers
    let custommovesused = 0;
    let custommovedefinitions = []

    if (totalmoves[0] == "") {totalmoves.shift()} // due to spacing, an extra "" element may appear, which should be removed

    for (let i=0; i < totalmoves.length; i++) {
      // The unit gallery data cleanses the passive text to properly parse newlines, so we have to do this for proper equality check
      //let thisfourtytwoandfourtythreefix = totalmoves[i]
      //if (totalmoves[i] == 42) {totalmoves[i] = 43} else if (totalmoves[i] == 43) {totalmoves[i] = 42}

      let tx1 = cleanseforexport(ORIGINALMOVES[numify(totalmoves[i])-1].text)
      let tx2 = gamegallery.misc.actions[totalmoves[i]]
      
      //l(totalmoves[i]); l("CFE " + tx1); l("GG " + tx2); l(tx1 == tx2); 

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
        x = replaceAll(x, "," + totalmoves[i] + ":", ",c" + custommovesused + ":")
        custommovedefinitions.push(`c${custommovesused},${gamegallery.misc.actions[totalmoves[i]]},${y.join(",")}`)

        // Makes a clone of the icon for the custom ability.
        // This doesn't store the icons of past versions but the icons should just be better looking anyway.
        // The order is: symbol1, symbol2, bordercolor RED, bordercolor GREEN, bordercolor BLUE, fillcolor RED, fillcolor GREEN, fillcolor BLUE, symbol1color RED, symbol1color GREEN, symbol1color BLUE, symbol2color RED, symbol2color GREEN, symbol2color BLUE, nobox
      }
    }
    /*
    CEO[version].actions
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

  if (lepieces[1] === undefined && lepieces[2] === undefined && lepieces[3] === undefined) {
    otherstuff = `0,,
0,,
0,,`
  } else {
    otherstuff = `${lepieces[1].cost},${fixpassive(lepieces[1].passive)},${r4243(lepieces[1].movespmformat)}
${lepieces[2].cost},${fixpassive(lepieces[2].passive)},${r4243(lepieces[2].movespmformat)}
${lepieces[3].cost},${fixpassive(lepieces[3].passive)},${r4243(lepieces[3].movespmformat)}`
  }

  validate(fixoutdatedactions(`${lename},${lepieces[0].class},${pieceset},${lepieces[0].rarity}

${lepieces[0].cost},${fixpassive(lepieces[0].passive)},${r4243(lepieces[0].movespmformat)}
${otherstuff}`, CEO[version]))

}

function randint(min, max) {
  if (max == null) {max = min; min = 0}
  min = Math.ceil(min); max = Math.floor(max); return Math.floor(Math.random() * (max - min + 1)) + min; // Fully inclusive
}
function randarray(array) {return array[randint(array.length-1)]}

let eastereggunits = [`PieceReviver2,Champion,Arcane,Legendary
set3#0000marker
8,When the value of this piece is reduced to 0 or less\\a it dies.\\n\\nOn Death\\o Lose morale equal to (8-(value of this piece)),1:66687678868887,c1:67
9,When the value of this piece is reduced to 0 or less\\a it dies.\\n\\nOn Death\\o Lose morale equal to (9-(value of this piece)),1:66687678868887,6:7579,c1:67
11,When the value of this piece is reduced to 0 or less\\a it dies.\\n\\nOn Death\\o Lose morale equal to (11-(value of this piece)),1:66687678868887,6:757957,c1:67
13,When the value of this piece is reduced to 0 or less\\a it dies.\\n\\nOn Death\\o Lose morale equal to (13-(value of this piece)),1:66687678868887,6:7579575559,c1:67
c1,Make a copy of the most recently fallen piece in your graveyard that has both a value that is greater than 0 and has the lowest value of all the pieces in your graveyard and put it on this square\\a then lose morale equal to the cost of the revived piece. Then this piece loses value equal to the value of the revived piece.,1,,245,46,46,250,150,150,245,46,46,245,46,46,false
`,
`Hermit,Champion,Basic,Legendary

12,,1:76787579,5:071727374757678797a7b7c7d7e7
14,,1:7678757966688688,5:071727374757678797a7b7c7d7e7
15,,1:7678757966688688,5:071727374757678797a7b7c7d7e7,6:747a55599599
16,,1:7678757966688688,5:071727374757678797a7b7c7d7e7,31:5559747a9599
`]
let eastereggunitnames = eastereggunits.map(x=>x.split(",")[0])




$("#nameinput").keyup(function(event) {
  if (event.keyCode === 13) { // enter button. I had to change textarea to input because textarea doesn't work, thanks js
    if (currentstyle == "fc") {
      $("#makefc").click();
    } else {
      $("#makeceo").click();
    }
    event.preventDefault();
    event.stopPropagation();
  }
});

function dealwithpiecename (passitoffto, extradata="") { // passitoffto is the function that #makeceo, #makefc, etc. use for the game specific piece
  let nameinput = $("#nameinput").val().trim();
  if (nameinput.toLowerCase() == "piecereviver2") {nameinput = `PieceReviver2`} // don't want lowercase to ruin joke

  if (nameinput.length == 0) {
    if (extradata == "fc") {nameinput = randarray(fcnouns)}
    else if (Math.random() > 0.5) {nameinput = randarray(nouns)}
    else {let rv = randarray(verbs); if (rv.length > 3) {nameinput = rv.slice(0, randint(rv.length-2, rv.length-3))} else {nameinput = rv};
    nameinput = nameinput + randarray(["ae", "a", "e", "o", "ung", "nt", "og", "sh", "shine", "place", "doke", "marr", "sen", "xo", "ox", "la", "nu", "inpai", "ushi", "unga", "onga", "ish", "ocho", "onti", "peku", "nura", "siba", "su", "luka", "coco", "no", "uper", "oob", "sucker", "eater", "butt", "dog", "ten", "life", "ushiga", "yamoto", "smol", "uwa", "pora", "nga", "nya", "chya", "yang", "tong", "ren", "nin", "m", "kek", "ke", "pper", "llula", "lust", "saga", "nori", "mura", "yuki", "ntacle", "norse", "indi", "blyat", "son", "mon", "gon", "rosh", "dosh", "lesu", "len", "lentil", "koc", "na", "be", "ick", "pega", "farm", "non", "lul", "pen", "wor", "ingo", "lish", "nish", "grave", "life", "rank", "shoe", "nose", "lick", "form", "rit", "ware", "hard", "soft", "maker", "fake", "rare", "nag", "pull", "push"])}
    $("#nameinput").attr("placeholder", nameinput) // Since it was empty, we put this as a placeholder
  } else {
    $("#nameinput").attr("placeholder", "")
  }
  //nameinput = nameinput.slice(0,1).toUpperCase() + nameinput.slice(1) // cap first letter
  nameinput = nameinput.replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase()); // match text transform capitalize
  $("#kocmessage").text(kocmessage(nameinput))
  $("#sspmessage").text(sspmessage(nameinput))
  let randomkocname = randarray(`kocbftn/ntfbcok/fnkobtc/awetalehu/jonny/Gum/GummyMan/sblmlmsg/mtgtcg/6aaaaaa/kfw1/mean_joe/flpenteros/#leaknewceo/#underminenewceo/fuolz/del10610791_1240/Randalf23/geklypip/nakari2/discorduser1/jdhfmxc/sdmers/ahbccfg`.split("/"))
  if (Math.random() > 0.5) {randomkocname = "kocbftn".split('').sort(function(){return 0.5-Math.random()}).join('');}
  $("#kocname").text(randomkocname)
  $("#koctime").text("Today at " + randint(1, 6) + ":" + randint(10, 59) + " AM")

  if ($("#feedback")[0].style.display = "none") {
    $("#feedback")[0].style.display = "initial"
  }


  if (extradata == "fc") {validate(passitoffto(nameinput)); return}

  if (Object.keys(CEO[`${lastCEOversion}`]).includes(nameinput.replace(/\d/g, ""))) {getgallery(nameinput)}
  else if (Object.keys(CEO).includes(nameinput.replace(/[vV]0?\.?(\d+) ?.+/g, "v$1")) && Object.keys(CEO[nameinput.replace(/[vV]0?\.?(\d+) ?.+/g, "v$1")]).includes(nameinput.replace(/[vV]0?\.?\d+ ?(.+)/g, "$1"))) {
    getgallery(nameinput.replace(/[vV]0?\.?\d+ ?(.+)/g, "$1"), nameinput.replace(/[vV]0?\.?(\d+) ?.+/g, "v$1"))
  } // filters for version number!
  else if (eastereggunitnames.includes(nameinput)) {validate(eastereggunits[eastereggunitnames.indexOf(nameinput)])}
  else {validate(passitoffto(nameinput));}

}

$("#makeceo").click(function() { // main_gi: Make Chess Evolved Online (piece)
  dealwithpiecename(makepiece)
});

let madefcyet = false

$("#makefc").click(function () { // main_gi: Make Favuor Chess (piece)
  if (madefcyet == false) {globalswitchfc(); madefcyet = true}  // only switch to fc the first time
  dealwithpiecename(makefcpiece, "fc")

})

$("#makecba").click(function() { // main_gi: Make Chess Battle Advanced (piece)
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

function changemove(movename, description, bordercolor, fillcolor, symbol1, symbol1color, symbol2, symbol2color, nobox) { // Changes the look of a move. NOT FOR SPELL MOVES, but for the style switches.
  let prevaction = ACTION
  if (description != 0)    {MOVES[SMOVE[movename]].text = description}
  if (bordercolor != 0)    {MOVES[SMOVE[movename]].color = bordercolor}
  if (fillcolor != 0)      {MOVES[SMOVE[movename]].color2 = fillcolor}
  if (symbol1 != 0)        {MOVES[SMOVE[movename]].symbol1 = symbol1}
  if (symbol1color != 0)   {MOVES[SMOVE[movename]].color3 = symbol1color}
  if (symbol2 != 0)        {MOVES[SMOVE[movename]].symbol2 = symbol2}
  if (symbol2color != 0)   {MOVES[SMOVE[movename]].color4 = symbol2color}
  if (nobox != 0)          {MOVES[SMOVE[movename]].nobox = nobox}
  changedmoves.push(movename)
  

  loadMove(MOVES[SMOVE[movename]]);
  document.getElementById("spell-"+movename).remove();
  document.getElementById("defs").insertAdjacentHTML("beforeend", makeSpellSVG());
  style.sheet.deleteRule(SMOVE[movename]);
  style.sheet.insertRule(makeRule(MOVES[SMOVE[movename]]), SMOVE[movename]); //Reapply css
  document.styleSheets[1] = style;
  $(".moves ." + movename).attr("data-description", MOVES[SMOVE[movename]].text);


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
  for (let i=0; i<sspreplaces.length; i++) {
    input = input.replace(sspreplaces[i], sspreplacetos[i])
  }
  return input
}

let changedmoves = new Set() // Array of changes made so we can undo them later :) Set for uniqueness.

function clearmovechanges() {
  let prevaction = ACTION
  for (let i=0; i<changedmoves.length; i++) {
    let movename = changedmoves[i]
    MOVES[SMOVE[movename]] = JSON.parse(JSON.stringify(ORIGINALMOVES[SMOVE[movename]])) // I HATE JAVASCRIPT FOR THIS DEEP CLONE COPY GARBAGE!!!!!!!!!!!!!!!!!!!!!!!!!

    loadMove(MOVES[SMOVE[movename]]);
    document.getElementById("spell-"+movename).remove();
    document.getElementById("defs").insertAdjacentHTML("beforeend", makeSpellSVG());
    style.sheet.deleteRule(SMOVE[movename]);
    style.sheet.insertRule(makeRule(MOVES[SMOVE[movename]]), SMOVE[movename]); //Reapply css
    document.styleSheets[1] = style;
    $(".moves ." + movename).attr("data-description", MOVES[SMOVE[movename]].text);


    svgMove = $(".moves svg." + movename) // main_gi: This sets all displayed text to the new description
    for (let m = 0; m < svgMove.length; m++) { 
      if (!(!svgMove[m].nextSibling || svgMove[m].nextSibling.tagName.toLowerCase() == "svg")) {
        $(svgMove[m].nextSibling).not(this).text(MOVES[SMOVE[movename]].text)
      }
    }

  }
  changedmoves = []
  ACTION = prevaction;
  loadMove(MOVES[SMOVE[prevaction]]); // main_gi: There seems to be an import bug with actions, I'm pretty sure this fixes it. (AGAIN)
}

function resetSpellLooks() {
  spellstyle = [10, 1, 9]
  $(".spell").attr("height", spellstyle[0])
  $(".spell").attr("width", spellstyle[0])
  $(".spell").attr("x", spellstyle[1])
  $(".spell").attr("y", spellstyle[1])
  $(".spell-symbol").attr("font-size", spellstyle[2])
  //$(".spell-gallery").css("transform", "none") // bug on chrome only, setting transform to none will not fix the scale on the attributes. Thanks to ABC for pointing this one out.
  $(".spell-gallery").css("transform", "scale(1.25, 1.25)")

  checkSpecialStyles() // Not exactly part of the "spell looks" reset but we should do it anyway
}

let currentstyle = "ceo"

$("#switchceo").click(function() { // main_gi: Switch to ceo stylings
  $("html").removeClass("cd")
  $("html").removeClass("fc")
  $("html").removeClass("cba")
  currentstyle = "ceo"
  clearmovechanges()
  resetSpellLooks()
}) 
$("#switchcd").click(function() { // main_gi: Switch to CD stylings
  $("html").addClass("cd")
  $("html").removeClass("fc")
  $("html").removeClass("cba")
  currentstyle = "cd"
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
  changemove("swapenemy", "(Unblockable) Swap places with enemy.", black, white, "🗘", red, 0, 0, "true")
  changemove("swapall", "(Unblockable) Swap places with unit.", black, white, "🗘", black, 0, 0, "true")

  changemove("moveswap", "Move or swap places with ally.", blue, white, "🗘", blue)
  changemove("teleportswap", "(Unblockable) Move or swap places with ally.", blue, white, "🗘", blue, unblockablesymbol)
  changemove("attackswap", "Attack or swap places with ally.", red, white, "🗘", red)
  changemove("jumpattackswap", "(Unblockable) Attack or swap places with ally.", red, white, "🗘", red, unblockablesymbol)

  changemove("attackany", "Attack enemy or ally.", red, white, "❇", red)
  changemove("jumpattackany", "(Unblockable) Attack enemy or ally.", red, white, "❇", red, "⛶", red)


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

function globalswitchfc() { // main_gi: Switch to favuor chess stylings, this is outside function so i can reuse it
  $("html").removeClass("cd")
  $("html").addClass("fc")
  $("html").removeClass("cba")
  currentstyle = "fc"
  clearmovechanges()
  resetSpellLooks()
  /*
  spellstyle = [16, -2.25, 12]
  $(".spell").attr("height", spellstyle[0])
  $(".spell").attr("width", spellstyle[0])
  $(".spell").attr("x", spellstyle[1])
  $(".spell").attr("y", spellstyle[1])
  $(".spell-symbol").attr("font-size", spellstyle[2])
  $(".spell-gallery").css("transform", "scale(0.8) translate(3px, 3px)")*/

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
}

$("#switchfc").click(function(){globalswitchfc()}) // Yes, this is absolutely ridiculous that I need to wrap it around a "function()", but otherwise js autocalls this for no reason when the page loads. js sux

$("#switchcba").click(function() { // main_gi: Switch to favuor chess stylings
  $("html").removeClass("cd")
  $("html").removeClass("fc")
  $("html").addClass("cba")
  currentstyle = "cba"
  clearmovechanges()
  resetSpellLooks()
}) 

// CEO's: linear-gradient(rgba(238,238,238,0.9),rgba(238,238,238,0.9)), url("../resources/bg.jpg")


var items=""
var currentlySelectedGalleryUnit = "Pawn"
var currentlySelectedGalleryVersion = lastCEOversion

let isactualunit = (key, value) => (!key.match(/\d/) && value.rarity != "N/A" && value.rarity != "?" && !key.startsWith("GeminiTwin") && key != "misc")

function hideVersion(version) {return !version.match(/\d$/)} // this means 'no digit at the end'

$.each(CEO, function(key, value) {
  items+=`<option ${hideVersion(key)? `class="hiddendisplay" style="display: none"`:``} ${lastCEOversion == key?'selected':''}value=${key}>${key}</option>` // Trying to fix "v52" to "v0.52" does not work. It's not important enough to bother.
 });
$("#galleryversion").html(items);

$('#galleryversion').change(function(){
  let data = $(this).val();
  currentlySelectedGalleryVersion = data
  let increment = 0;
  for (let i = 0; i < $("#gallery option").length; i++) {
    $("#gallery option")[i].style = "color: gray"
  }
  let goptionlength = $("#gallery option").length
  $.each(CEO[`${currentlySelectedGalleryVersion}`], function(key, value) {
    if (isactualunit(key, value)) {
      let incrementprior = increment
      while (increment < goptionlength && $("#gallery option")[increment].value != key) {
        increment++
      }
      if (increment >= goptionlength) { // This check means it looped around without finding the unit, so now look through the previous parts of the list.
        increment = 0
        while (increment < incrementprior && $("#gallery option")[increment].value != key) {
          increment++
        }
        if (increment == incrementprior) {return true} // This means "continue" effectively, since no unit was found.
      }



      $("#gallery option")[increment].style = "color: black"; increment++
      // This is some effort to save processing by taking advantage of this: the order of the latest gallery versions' pieces should generally match the order of the older version's. There are exceptions, like with v0.50, though, but this solution should account for those as well.
    }
  });
  // this grays out units that aren't in the update

  $('#gallery')[0].style.color = $('#gallery')[0].options[$('#gallery')[0].selectedIndex].style.color; // copies style of the option value to the unit dropdown

  getgallery(currentlySelectedGalleryUnit, currentlySelectedGalleryVersion, true) // the "true" is a marker for "version changed"
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






var thing1 = ["teleporting ally king", "summoning ally pieces", "summoning enemy pieces", "summoning pieces", "teleporting pieces", "moving pieces", "status effect", "stun effect", "swapping enemy", "dealing damage", "on death effect", "on kill effect", "promote", "that ability", "turn 1 checkmate", "magic destroy", "charm", "range 4 attack", "jumping over ally", "killing allies", "morale", "petrify", "freeze", "double damage", "downgrade", "upgrade", "invisible pieces", "rng", "random effect", "revive", "graveyard", "banish", "push", "pull mechanic", "fps mechanic", "pie rule mechanic", "morale decay mechanic", "domain victory", "threefold repetition", "checkmate", "classic chess", "blitz token mechanic", "transformation mechanic", "summoning a sapling", "teleporting caster", "destroying all adjacent pieces", "battle royale mechanic", "thundermage thunder", "lightning strike", "armored unit effect", "favorchess berserk", "caste system", "concentration camp mechanic", "sodomy", "bukkake", "brainfluid keyword", "low-iq mode", "pooping on enemy piece", "piss on ally unit", "add extra army points", "on death lose morale", "lose the game mechanic", "anal mechanic", "does not block movement", "phoenixegg passive", "sextoy mechanic", "pinkdildo keyword", "path mechanic", "anti-grandmaster unit", "naked status effect", "circumcision mechanic", "buttplug", "footfetish mechanic", "vore", "necrophilia", "assclench mechanic", "nosepick mechanic", "headlice", "coronavirus", "itchybutt", "white supremacy", "flatearth", "racism", "heterophobia", "eyegouge", "penisize", "boogereat mechanic", "buttlick mechanic", "big boob art", "anime girl art", "2 men kissing", "freeze foot off", "block enemy attack", "stealth", "hidden information mechanic", "market crash mechanic", "infinite ruby farm", "gain contribution using ability", "use ability limited number of times", "pay to use ability", "sacrifice this piece", "diarrhea", "prostitution", "behead", "earwax", "masturb8", "message deletion mechanic", "deleting messages", "attacking f3", "attacking newceo members", "leaking newceo", "making fun of favorchess", "obesity", "suicide", "suicide forest", "adjust cost", "market system", "contribution farming", "farting in mouth", "tooth removal", "death by hanging", "suffocation", "wind magic", "stonepillar", "shock opponent with electric shock", "steal time from opponent", "punch opponent through screen", "reputation system", "gravity", "insult opponent", "destroy opponents coins", "fingernail clipping", "toenail eating", "bleeding", "kidney stone", "blood transfusion", "add morale", "lose value", "vampire drain", "transform into bat and fly", "unstoppable ability", "stealing pieces from another game", "winking to girl", "cut loose skin", "excercize machine", "treadmill", "banning opponent unit for sexism", "swastika moveset", "void unit", "swap with ally", "swap with empty square", "ban evasion on favorchess", "alt infiltration", "rp trading", "bribing with rp", "get crowns for using ability", "quest system", "trolling awetalehu", "bat transformation", "kill temporarily", "stun unit for 20 turns", "internal bleeding", "waterboarding", "enchant", "throwing up", "giving birth", "intercourse", "ruby farming", "gold farming", "stock market", "shortselling stock", "abusing player", "grooming", "losing hair", "pubeshaving", "armpit smell", "turning gay", "custom pieces", "using words", "using english language", `destroy english language`, `demolish english language`, `disconnect vs ai`, "translate to chinese", "french translator", "spanish translator", "using numbers", "using english alphabet", "using piecemaker", "using brain", "throw water at computer", "break controller", "throw mouse at computer", "drink water", "eatass", "copy enemy piece", "copy ally piece", "countDown to 0", "lifespan", "crack skull open", "destroy all ally pieces", "win the game on turn 3", "cant move until turn 3", "summon soulkeeper instead of ghost", "gain life", "add morale", "add iq", "smell like shit", "pay to win", "put camera in ass", "lying", "welcoming alts to abstract strategy game server", "national surveillance", "licking keyboard", "declaw", "spend money to win", "drop tv on foot", "lose finger", "pick nose", "infect opponent", "take off clothes", "cat scam", "sodomy is good, but the other ability", "yesterdays bukkake was bad, this bukkake is dull and", "bad voice acting", "voicecrack", "being past prime at 15", "losing to 46 point army", "delete kong account", "report kong account", "make 5 kong accounts", "banned on discord", "using vpn", "trolling opponent", "troll awetalehu", "making fake username", "making fun of me", "paradox", "7 cost piece", "14 cost piece", "21 cost piece", "152 cost piece", "move only", "attack only", "unblockable", "magic", "video game development", "go to the moon", "go to mars", "teleport to corner", "rename enemy unit", "make enemy catch cold", "HIV", "turn enemy piece female", "turn enemy piece male", "change enemy gender", "slander favorchess", "spamming prismata server", "demod everyone", "go on power trip", "sending rp to scammer", "40 people online on ceo", "spending money on scholarship", "scammed by university", "taking out stupid student loan", "going to college to get brainwash", "turn ally into incel", "create vpn", "make sexual joke", "emojis", "pixel art", "lick enemy legs", "sit on enemys face", "bdsm", "masochism enemy unit", "fart on face", "messing with clock", "an extended leap attack", "more path mechanics", "poison 6", "starting move decay on turn 25", "talking trash about grand", `oppressive government`, `abusive schooling`, `criticizing developer`, `trolling ghostly`, `insulting ghostly`, `lying to ghostly`, `making 5 alts in favorchess server`, `useless teacher`, `trolling grand`, `vest streak`, `farming contribution`, `pretending to be grand`, `blurry favorchesspiece`, `stamina mechanic`, `ability target`, `factphobia`, `posting eggplant in favorchess server`, `getting banned from favorchess server`, `farming mastery`, `cant farm mastery until turn 3`, `status effect that turns enemy into moron`, `corrupt officer`, `just gaining moves on upgrades`, `useless ability target`, `gaining attack on ++`, `get offended at bad game design`, `raging at ghostly`, `upgrade living shit out of unit`, `making money off idiots`, `mislead new player`, `lie about cba`, `advertise game that doesnt exist`, `host idiotic pretendpiece tournament`, `faking moon landing`, `following corrupt laws`, `intentionally broken unit`, `spamming alternate accounts`, `grand pretending to be anime girl`, `ban from prismata server`, `turn 1 checkmate with unblockable`, `idiotic swap everywhere`, `killstreak`, `spamming idiotic abilities`, `mocking awetalehu`, `ability that is mocking ghostly`, `value adding`, `piece reviving`, `complicated mathematics`, `troll grand and get him angry`, `create new delusional gender`, `government stealing your money and call it tax`, `trying to infiltrate newceo server`, `riling up ghostly`, `sorcerize ability`, `gain morale on death or kill`, `trolling ghostly into banning emoji`, `getting offended by everything`, `lie about obviously provable fact`, `lying about obvious fact`, `redefine terminology`, `make up new thing to get offended about`, `disguise as ally unit`, `create new unit`, `making another bad unit`, `envy effect`, `siren effect`, `favchess bersrk`, `stratshotplayer reorganizer`, `gain morale for free`, `"ranged magic"`, `"unblockable ranged"`, `"blockable magic"`, `"ranged magic"`, `"magic blockable"`, `poison 6 and mess with clock`, `pieces moving other pieces`, `spreading smallpox in grands hometown to force him to nerf piece`, `new pretendporn genre`, `extort awetalehu`, `make up hypocritical reasons to skew votes in tournament`, `turn 1 magic checkmt`, `exhaust mechanic`, `undo mechanic`, `armybuilding mechanic`, `oligopoly`, `plutocracy`, `technocracy`, `faking disease`, `faking instuititutionilism`, `recursive definitonism`, `redefnitionisim to suit ur argument`]
var beendone = ["is something that has been done", "has been done", "was done before", "has already been done", "isnt original", "isnt new", "is oveursed", "is overdone", "has been done in hex", "has been done on boardgames", "has been done before", "is something that has been done before", "has been done and is overused", "is too obvious and already done", "is my idea", "is just a copy of a ceo mechanic", "is just a copy of tetris and puyopuyo", "is stolen from hex", "has been done by grand", "has been proven as too luckbaased", "has been established as lame", "has been done, is just a variant of move or attack", "has been done, just a variant on magic destroy", "has been done, just a basic variant on teleport", "too predictable", "is too obvious, just a variant on move or attack", "has been done, it is basically just attack only with a small twist", "is really unoriginal, just the worst of 2 ceo mechanics", "is a thing thats been done before", "is a babys first idea for a mechanic", "is already implemeneted", "is uncreative, already beeen done", "has been done, too easy to think of", "has been done, babys first mechanic", "has been done before by 6 other people", "has already been done before", "is something thats already been done, has never been interesting", "has been done, the mechanic is already fully explored by better piecemakers than you", "has been done several times in the past", "is way too obvious has been done", "has been done already", "sucks, its been done", "is lame, its been done", "has been done by ssp", "has been done, its just transform with extra steps", "has been done, its just a vanilla unit with a useless ability", "has been done, its useless", "has been done, just part of firemage ability with a twist", "has been done, ssp did it 4 years ago", "has been done, i did it 3 years ago", "has been done, just an obvious variant of ranged destroy", "has been done, just a ripoff of comet and a favorchess piece", "has been done by newceo already", "has been done, just a ripoff of other kongregate games", "has been done, just stealing ideas from facebook pages", "has been done on miniclip", "has been done in krunker", "has been done, its just a hearthstone mechanic", "has been done by lormand", "has been done by gracelesshawk", "has been done, by ssp and grand", "has been done by james", "has been done by stormcommando", "is horrible, been done already", "sucks, ive seen it a billion times", "has been done by CBA", "has been done better by ssp", "sux, come up with something thats not been done", "is boring, come up with something new", "is useless, not new", "is not new", "is not new at all", "isnt original, has been done", "isnt new, its been done too many times", "is so boring, its been done too many times", "has been done way too many times", "has been done, you posted this same piece 2 weeks ago, get a new idea", "is just a more powerful tiger", "is like enchanting pieces as a downside, has been done and doesnt excite me", "doesnt add anything good to the game", "doesnt do anything exciting", "is ugly and inconsistent", "is stupid and boring", "has never been done i think... wait grand did this", "seems like a unique ability but breaks the game", "ruins the game", "is terrible", "is a stolen mechanic and badly designed", "is never a good design", "will never be in the game", "has been done so manyn times and failed each time", "cant be made into anything good", `has no success rate`, `is so stupid and idiotic`, `has nothing good involved`, `has never ben good`, `has failed every time`, `is obnoxious and boring as hell`, `is stupid, just useless and been done`, `is ghostly-level idiotic, stupid, been done`, `is grand-level stupid, been done`, `is from ssp, lame and just idiotic, and its been done before`, `is just stolen from mtg`, `is a boring shogi mechanic`, `is like pawndrops but 10 times worse lel`, `has been done and will destabilize the strategicality tactics balance`, `has prolly been done`, `has definitley been done`, `has been done and will destroy strataegicality tactics balance`, `is completely idiotic and unoriginal`, `is terrible, ugly, idiotic, moronic, unoriginal, boring, stupid, horrible, unexciting, unstriking, failureprone, uncreative, overdone, notnew, and has been done at least twice before`, `is a horrible idea and been done million times`, `is utterly boring, its a waste to make ideas that have been done, you could get computer to generate endless amounts of these pieces`, `has been done by CEO, newCEO, FC, newFC, CBA, and newCBA`, `is dtfifinteley a bad idea`, `is so stupid and overdone`, `is mindless to think about`, `is completely unnecessary and adds nothing to the game`, `is pathetic, get a better brain this piece idea sucks`, `is overdone and theres no potential here, terrible iedea`, `is useless, boring, and overall unexcaiting`, `is already overdone in ceo, why add more of it`, `is already so common in favor chess`, `is obviously a terrible design, wtf`, `has zero potential to make any good pieces and its been done`, `is idiotic, is overpowered no matter what piece has it, just throw this idea in trash lel`, `is completely useless, this ability does nothing at all and has been done`, `has BEEN DONE, idiot`, `has been done so many times that lormand got sent into psych ward over it`, `seemed original to me at first, then i saw lormand do it`, `has srsly BnDne mny tmes`, `is really overdone`, `is really unnew at this point`, `is quite original, xcept i saw someone do it 2 weeks ago lel`, `is from that card game hex`, `is stolen from mroe card games`, `is stolen from bloons tower monkey defense 5`, `is stolen from pong`, `is stolen from the bloons hex ninja game`, `is a thiefed mechanic from enimation throwdown`, `is thieved mechanic from knight erront`, `is stolen from chessplus`, `is stolen from weaponized chess`, `has been done, its just stolen mechanic from starbound crusade`]

var nointerest = ["this isnt very thought provoking", "this isnt very striking", "pretty boring", "this isnt new at all", "not very interesting", "pretty uninteresting", "quite boring", "not intriguing at all", "not well thought out", "pretty stupid", "kinda stupid", "not really intelligently built", "messes with the strategicality tactics balance", "should use pawndrops", "needs credits system to be interesting", "could be more like favor chess", "just an obvious copy of a ceo mechanic", "completely overpowered", "totally underpowered", "unusable", "uninspiring", "just lazy", "too much like favor chess", "just change for changes sake", "pretty parasitic", "this sucks compared to my early pieces", "too much like newceo", "would be better with 2 click ability", "doesnt interact with enough mechanics", "has too much synergy", "just made to farm contribution", "too many words to explain simple ability", "not understandable enough", "hard to read", "not enough depth", "needs an ability that regards piece by its relative position in the game", "doesnt add anything good", "also too many typos in the descripition", "its supposed to be on more pieces", "it needs to be on more pieces", "it needs more token pieces to work", "high complexity low depth", "unstrategic", "nothing interesting to see here", "why is it designed in such a boring way", "ive seen better pieces from stratshotplayer", "grand makes better pieces than this", "ghostly can make better pieces than this", "i can make much better pieces than this", "james would get a hardon seeing this mechanic tho", "seems like you would easily forget where your king went with this", "really a braindead design", "youre a bad designer", "youre a boring designer", "youre a crappy designer lel", "i think your bad at this", "designer was on crack making this", "designer was on drugs like lormand", "designer mustve been smoking weed lel", "really underwhelming", "kinda ugly too", "i dont like the art", "art looks like a random scribble", "name is just random scrambled letters", "u probably smell bad irl", "i need glasses to understand this", "i need ssp to translate this for me", "just dumb", "just idiotic", "no depth", "this isnt striking at all", "this isnt thought provoking in the slightest", "all those pieces are op", "all those pieces are bad", "all your pieces suck", "your piece sucks", "nothing good about this", "nothing striking here", "nothing to see here", "nothing thought provoking", "nothing good about this piece", "impossible to balance", "prismata did it better", "favorchess would do it better", "nothing interesting about this piece", "waste of time", "wasting my time", "just a waste of time", "no depth to this one", "nothing good about this one", "nothing new to offer", "brings nothing new to the table", "this is very boring", "unstriking", "needs to promote to a better piece", "also doesnt say what sodomy does", "noone would use this", "nobody liked that", "its much worse than my pieces", "theres a reason noone llikes it", "i dont like this", "i dont like this verymuch", "just a bad copy of newceo", "whats the point of this", "no point in this", "theres no point in this", "theres no point doing this", "no point using this", "whats this even trying to do", "what does this even mean", "too much math", "too many numbers", "too many numbers wtf", "wtf is this", "wtf were you thinking", "wtf is wrong with you", "is cursed like the abstract strategy games server", "this is something i dont believe in", "you put this on alotta pieces but theyre all bad", "overall your pieces suck compared to my beginning pieces, and i dont think that you have a bright future in piecemaking", "not that cool but its fine", "meh", "never make another piece again please", "just die", "stupid pawndrops ripoff", "get outta here lol", "you suck at making pieces and suck at making games", "go to cba server", "send this to favor chess server instead", "just a boring copy of crazy alphacore rant", "just a copy of delusional grand", "just a bootleg version of james mechanics", "just an obvious variant of grands ideas", `this piece is even worse design than queen lel`, `one knight can beat this up lel`, `ban the idiot who designed this`, `ban the designer from the server`, `ban this idiot from the server, he has done enough damage`, `whoever designed this should leave community forever lel`, `just delete this`, `erase this form my memory`, `completely stupid`, `i dont understand why youd make something this idiotic`, `nothing good about this piece`, `whos the idiot who designed this`, `youve made like 3 pieces and all of them were boring as hell and have been done too many times`, `i feel like this idea could go into a rng piece but rng pieces are bad`, `leave community forever`, `just copying grands worst designs`, `boring and unnew`, `i think this was made just to troll me, not falling for it`, `send this to favor chess server to troll ghostly`, `this is mocking me`, `doesnt give any sense of pride or accomplishment`, `fits right into a p2w game`, `this is a prismata idea`, `new combo destroyer idea with this piece: 1. Both players may choose UP TO 4 pieces that their opponent controls that they would like to swap with pieces in their own army, 2. Next any players who did number 1 choose the pieces in their own army that they would like to swap, making sure that minions and champions will not be swapped with each other 3. after the swap, if the pieces a player chose to recieve have a higher total cost than the pieces that player chose to give, he loses morale equal to the difference.`, `this is just unusable and bad`, `this is one of those trash pieces youd see in a draft`, `this is really a filler piece`, `actually upon rereading the ability, i dont think anyone's done it lol`, `so laziest`, `how boring`, `its so lazy, how boring is that? umm`, `ummmmmmmmm, did you even think about this lel`, `this community is troll infested`, `whys this community full of trollish behavior and bad pieces`, `this piece is exhibiting trollish behavior`, `youre just trolling at this point`, `its not confusing, its just that it makes it harder to plan a-errr... its not transparent, yknow it's not that easy, yknow it takes some time to... uhhhh, figure out... you know what effect it can have, y'know, uhh... okay so im bad at explaining but, right, like, it's not like yknow... because you have to look around... look around the piece... to its yknow target squares... and figure out 'okay which of these pieces is a threat if it's moved to the ability target' and i don't know it just, it just takes some time to like, evaluate the, evaluate the threat that it poses...`, `kinda sorta really stupid`]
var igiveit = ["", "", "", "", "", "", "i give it a", "i give it a", "i give it a", "i give it", "it deserves a", "it's pretty bad,", "pretty bad,", "not good,", "pretty terrible,", "garbage,", "do better next time,", "trash,", "not worth thinking about,", "so boring,", "bad,", "its not very good,", "not very good,", "i give it only a", "its around a", "NEXT,", "awful,", "what a joke,", "laziest designer ever,", `i give it probably`, `its worth a`, `trash,`, `all your pieces are`, `you are not smart at all,`, `youre brainded,`, `awful,`, `doubleplusungood,`, `i give it like a`, `its like a`]
var ratings = ["0/10", "1/10", "2/10", "3/10", "4/10", "0/10", "1/10", "2/10", "3/10", "4/10", "5/10", "almost 5/10", "-1/10", "1.1/10", "0.6/10", "3.2/10", "2.4/10"]
var period = ["", "."]
var periodorcomma = [".", ","/*, ".", ",", ".", ",", ""*/]



var kocpositive = ["best piece ever made", `genius idea`, `never done before idea, really cool`, `this has never been done before`, `ive never seen this done before`, `wow this idea is good`, `wow this is the best piece ive seen so far`, `one of the best custom pieces`, `some of the best design yet`, `this design is so good`, `this idea is really eleegant`, `supergreat idea`, `amazingish idea`, `niceish idea and really great`, `amazingcoolish idea`, `supercoolgreat idea wow`]
var wouldkiss = [`would kiss designer`, `i would kiss the designer`, `can i get autograph from the designer`, `even better than f3s pieces`, `so much better than most other piecs`, `beautiful design`, `great design`, `GENIUS`, `amazingly well thought out`, `so good`, `actually really innovative`, `alotta creativity here`, `creator should make their own game i want to see it`, `brilliant`, `unbeleveble well donedesign`, `super welldesigned`, `ceo should add this`, `newceo should add this piece`, `ssp would dream to have such brillaint piece in cba`, `ghostly will never design piece this good`]
var positiveigiveit = [`i give it a`, `i gladly award this a`, `i award this a`, `i grant this a`, `i give it a`, `i proudly give it`, `im giving it a`, `ill give it one of my highest retings,`, `i give it a highest rating`, `its excellent,`]
var positiverating = [`8/10`, `9/10`, `10/10`, `11/10`, `9.1/10`]

function kocmessage (name) {
  if (name == "PieceReviver2") {return `PieceReviver2: ${randarray(kocpositive)}, ${randarray(wouldkiss)}, ${randarray(positiveigiveit)} ${randarray(positiverating)}`}
  return name+": "+randarray(thing1)+" "+randarray(beendone)+randarray(periodorcomma)+" "+randarray(nointerest)+", "+randarray(igiveit)+" "+randarray(ratings)+randarray(period)
}

function sspmessage (name) {
  let ratings = [`SS`, `S`, `A`, `B`, `C`, `D`, `F`]
  let regexlist = [[/([A-Z]..).+([A-Z])/g, "$1$2"], [/dd/g, "d"], [/ff/g, "f"], [/mm/g, "m"], [/tt/g, "t"], [/pp/g, "p"], [/gg/g, "g"], [/ll/g, "l"], [/cc/g, "c"], [/rr/g, "r"], [/nn/g, "n"], [/ss/g, "s"], [/ee/g, "i"], [/^Ex/g, "X"], /a|e|i|o|u/, /a|e|i|o|u/, /a|e|i|o|u/, /a|e|i|o|u/g, /y/g, /h/g, /n/g, "DUMMYELEMENT"] // dummy so that the while loop and length check doesn't fall apart
  let shtn = name.replace(/ |\.|\:|\,/g, '') // clear useless characters
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

  if (name == "Crazyhouse") {shtn = "Cyzh"}
  else if (name == "Princess") {shtn = "PrQn"}
  else if (name == "FrostMephit") {shtn = "FzMp"}
  else if (name == "PieceReviver2") {shtn = "PRv2"}
  else if (name == "Chess Battle Advanced") {shtn = randarray(["CheBA", "CheB.A.", "ChBA", "Ch. B. A.", "CBA", "CBAdv", "ChBaAd", "ChBAdv", `ChBatt`, `CBAd`, `CBAD`, `CsBA`])}

  let shtn2 = name.replace(/ /g, '') // we're going to make a second shortname just for distinction, so "RylG", "RyGd", and "RGrd" exist

  regexlist = [[/([A-Z].+[A-Z]).+/g, "$1"], /a|e|i|o|u/, /a|e|i|o|u/, /a|e|i|o|u/, /a|e|i|o|u/g, [/dd/g, "d"], [/ff/g, "f"], [/mm/g, "m"], [/tt/g, "t"], [/pp/g, "p"], [/gg/g, "g"], [/ll/g, "l"], [/cc/g, "c"], [/rr/g, "r"], [/nn/g, "n"], [/ss/g, "s"], [/ee/g, "i"], [/^Ex/g, "X"], /y/g, /h/g, /n/g, "DUMMYELEMENT"] // dummy so that the while loop and length check doesn't fall apart
  while (shtn2.length > 4) {
    let takefirstfour = shtn2.slice(0, 4)
    if (regexlist.length == 1) {shtn2 = takefirstfour}
    if (regexlist[0].length == 2) { 
      shtn2 = shtn2.replace(regexlist[0][0], regexlist[0][1]);
    } else {
      shtn2 = shtn2.replace(regexlist[0], '');
    }
    if (shtn2.slice(0, 4).toLowerCase() == name.slice(0, 4).toLowerCase() && shtn2.slice(0, 4) != name.slice(0, 4)) { // this is for cheesy "FirE" names
      shtn2 = shtn2.slice(0, 4)
    }
    if (shtn2.length <= 3) {shtn2 = takefirstfour}
    regexlist.shift() // remove first element
  }
  if (name.replace(/[a-z]/g, "").length >= 4) { // if you remove all lowercase and length 4 or more
    shtn2 = name.replace(/[a-z ]/g, "")
  }




  return `${shtn}: ${randarray(ratings)}${randarray(plusorminus)}, ${randarray(ratings)}${randarray(plusorminus)}, ${randarray(ratings)}${randarray(plusorminus)}, ${randarray(ratings)}${randarray(plusorminus)}. ${randarray(ssp1)} ${randarray(ssp2)}${randint(0, 5)==5?" "+rsspn.join("|")+".":""} ${randarray(sspratings)} ${randarray(sspratings2)}|10.`.replace(/{\[NAME\]}/g, name).replace(/{\[SHTN\]}/g, shtn2).replace(/{\[1STL\]}/g, name.slice(0, 1)) // the "rsspn" part: 1/6 chance for ssp to suggest his own unit rebalance
}

var plusorminus = [`+`, ``, ``, ``, `-`, `-`, `--`]
var ssp1 = [``, `Strong synergy and power right from setup.`, `This has been Vaccinated it appears.`, `This alone is level expected.`, `Weak.`, `You don't know scratch about balance.`, `Blatantly Broken.`, `Turn 1 checkmate is a valid game design...`, `That's my Unit, the regime's enforcement cops.`, `It's very specialized, so it's cheap. Can be used as Pawn, to develop a Champion or rescue some unit.`, `No, it can't kill 2 units in 1 turn.`, `No joke pieces.`, `That should cost 25.`, `Needs to be harder to trade well.`, `Upgraded it's 1 too cheap.`, `Fairly weak, may become Stuck on 8th row, bad upgrades.`, `Weak moves, fair ability, risky emergency ability.`, `Fine, but +2 sucks.`, `Overcosted, weak high tiers.`, `A bit cheap, class typo.`, `Mostly gimmick.`, `Weak moves, fair ability, risky emergency ability.`, `Strong combo potential, plus, overcosted, sidegrade.`, `It doesn't fill any challenges.`, `Too dificult to provide Dementia.`, `Broken dodgespam, brokener from Plus, too cheap.`, `Good support, cheap,`, `Too expensive, gets cheaper,`, `Balanced, but passive hardly matters.`, `Overcosted for what it does,`, `UP base, sudden OP Knight attack at plus, rest is not too OP.`, `Overcosted for range ability, otherwise balanced.`, `Weak without support, balanced at base and +.`, `Fair & Balanced.`, `Good, but may be too expensive. -1 cost.`, `Payless LfSt...`, `Ability is not that strong wthout combos, since it's ussually worse than Saplingkill.`, `Nice, but bad scaling, OP at +3.`, `Weak though balanced, niche unit,`, `Too weak for what it does. 1|2|4|6.`, `Broken with RespawnTarget units, otherwise broken from + tier, since it can Tport freely after 1 charge, and reload Destroy.`, `Sidegrades, and these aren't even good.`, `Broken upgrading, otherwise OK.`, `Powerful ranged ability and fast movement balanced by tempo and coverage.`, `Overcosted, situational ability.`, `Good but overcosted.`, `Frenzy is best single: Swap Frenzy1 1 Fwrd, Place and Attack repeatedly with Frenzy0s, end with Frenzy1. An attack like this drains 29|45|63 Morale, as well as 10 Value.`, `{[SHTN]} uses a powrful passive. it's sad that he removed the "And lose this ability" part.`, `Gimmicky, unclear and useless.`, `{[SHTN]} is OP, may cheap 2x1, later T2 cheapmate.`, `{[SHTN]} is quick and deadly, but hard to use, later it may be slightly OP.`, `Is OKish, but OP for trading.`, `Nice and tactical.`, `{[SHTN]} is gud unit.`, `Small but kinda fair.`, `Is fair enough.`, `This is OP.`, `Powerful but balanced.`, `{[SHTN]} is undefined.`, `Poop.`, `Too cheap, but good design.`, `Half lazy.`, `Fast promoter but weak, can be used for cheese with Harmor, otherwise you'd just use Bat3|PriQ2.`, `Nice design, can defend well without being OP.`, `Decent moves but overcosted.`, `Obvious Joke, just like TheG.`, `Needs +, weak melee but balanced destroy.`, `Looks OP, and what happens if you fling them, or otherwise 2 triggers? I'd say front, opposite boardside first, so N, NW, NE, W, E, SW, SE, S when on right half.`, `{[SHTN]} is strong piece that can take unit behind, quite powerful, it is undercosted.`, `It is overcosted, and allows nasty cheese fighting.`, `Overcosted, has detrimental trigger.`, `Weak bomber that is undercosted, then OP, then Broken.`, `Horribly useless, wastes Champ for net loss. |||.`, `Decent power, wind seems random, high jump from Plus1 to Plus2. 6|7|13|14. Actually wait. 5|8|16|18...`, `Unit whose main power is on Push, which moves target diagonally until 5 spaces total, whenever possible. It may be used twice, which gives double attack potential. Its harmblock is not threatening, but may avoid defense, and it leaves attacker open. Upgrades give stronger defense, attack and movement.`, `WTF?`, `Looks like 1|2|3|6 unit at first... Unreadable Description, impossible to evaluate, learn English.`, `You're biased, and you should feel bad.`, `This piece trying to Imposteranate my piece design?`, `Improper and poor templating.`, `Very bad at moving Frward.`, `Barrage range of Drgn0 outer range.`, `It's Broken with Paladin, also with Guardian, Colonist and such.`, `I suggested these prices. It needs sliightly higher costs.`, `Too weak. Needs to be more threatening.`, `A friend tells another when he's being dumb, which it is.`, `Ability is like OverHead: Ranged, goes over Units. Can be blocked by things other than Units, such as ForceWalls.`, `I put this in my Site: Site is up! Here you can discuss Chess Evolved Online from a better design focus.`, `Levitated {[SHTN]}1 is Broken, can attack as much as it wants, while nigh invincible, at least against Chess army.`, `Fairly balanced unit, not OP or repetitive.`, `Rook|Rangestroy hybrid, encourages repetition.`, `Do you have brain damg?`, `Really bad ability. New Ability: It fires a fast reflecting Beam, bouncing changes square color unless bouncing from board corner. Can't use long range past 6th row, can Destroy diagonally at +2, has 2 Block areas at +3.`, `Not random, but most of these are more efficient at low tiers, more so with a discount.`, `Throw something cheaper at it, win.`, `Hey, SSP is my updated response. CC could be CosmiClasher.`, `It's just cheap. A cost of 10 makes it harder to trade, maybe too costly.`, `sShould cost 10, it's stronger than Warr2 at Range2, no Kingrange Attack but strong swap.`, `Suggestion 1: Base cost 12 moves Lgnr0. Plus cost 14 moves Warr2. Plus2 cost 16 moves Lgnr3. Plus3 cost 18 moves Bhmt3. Pros: No overly tradeable tiers, decent control ability. Cons: Move Only upgrades, not mandatory to buy Plus2|3.`, `Seems OK to counter Ranger2|3 and the like.`, `{[SHTN]}: 31 Cost, + Adjc NoBlock SwapAlly. If 34 cost, RangeImmune, ReactImmune, NgtvStatusImmune.`, `{[SHTN]}1 is worth about 8, costs 2, pnlt 10. With LfSt1 Buff is worth about 10, costs 6, pnlt 7, weak but defensive until used. Seems fairly good.`, `This is Pay2Play. Also, Knight0 meta.`, `It's not broken at all. Targeted minion would be cast out, and Ptgs would be wasted.`, `SwpAlly don't make a lot of sense.`, `Would be shorter in Spanish.`, `Dumb idea.`, `Description way too long.`, `Impossible to freeze.`, `Cannot even attack.`, `Can't even Atck.`, `Can't deal Dmg at all, why.`, `I saw this piece before, you removed Knight attacks for some reason.`, `Old version of this pce had Armor.`, `Suggestion: Delete passive.`, `Suggestion: Remove ALL brainless ability from it.`, `Why nothing inteeresting about this idea.`, `This piece idea so bad I am deleting all similar idea from Chess Battle Advanced.`, `Pay2Win.`, `Unreasonable design.`, `Complete unreasonability, you need do better.`, `It is broken, and allows nasty moldy cheese.`, `It is poorly thoughted out and creates nasty Complexity fetish.`, `Seemse like a good design......... At first. Then you read it, and it is bad.`, `Offully awful.`, `Trash piece, like the ones TheG makes.`
]
var ssp2 = [``, "Es basura, no puede definir ganancia.", "Lacks Chess Battle Advanced tenets.", "Unclear templating.", "It's like one of my designs.", "Unclear description.", "Uncreative name, bad poison.", "Clearly, this makes the Unit too punishing for these armies.", `So, this ends up losing|giving King X-4 Worth. X=6|5|5|4, but 5|4|5|4 for a King. Net balance being -(4|5|4|6).`, `It should get Tired after 3 moves.`, `Same as with Valk portal.`, `That'd actually make little difference.`, `BAN Armored Range 3 to Enemy 2nd.`, `It's almost strictly worse.`, `Also, {[NAME]} is Broken as long as it sticks to White squares.`, `Solution: Reduce the Petrify duration to 2 turns.`, `Also, fullquote is stupid.`, `An attack to left corner then to the right can't be interfered by Samurai.`, `Really weak, may break some units.`, `Broken with Hoplites at +2.`, `meaningless passive,`, `unspecified path for attack.`, `Broken with Hostage for King threat...`, `Balanced, protect and attack, slightly weak +2.`, `Not very strong, +2 may be sidegrade.`, `Has "Equally Pointless" element demergency (dx emergency ~ dx obfuscation).`, `Broken with Knight|Valk, even Pyro, but also boosts Enemy unit. It may seem weird to be attacked by Trees.`, `Limit to 15 turns.`, `It's not that weak, it is an utility piece, overcosted though.`, `Strong tradeability upgraded.`, `OP in some Combos.`, `Randomness, bad scaling, gimmicky, broken, useless.`, `Balanced abilities, except BatV Tport, especially at +3.`, `Too tradeable, otherwise Balanced.`, `You aren't very good designer.`, `Overcosted by 2-3, weak upgrades.`, `Balanced power, HUGE morale pains to be worth it, overcosted.`, `Good but overcosted.`, `Also, sidegrades are UP. 6|8|8|8. Also, repeated Rook drilling in general.`, `I already have similar piece in Chess Battle Advanced.`, `I added this piece to Chess Battle Advanced.`, `That Trigger is Temporary Attack Power, NOT Auto Attack.`, `This piece got voted Higher than a thing that certain 4x1s at +3 with Portal? We ought better than to stay on such a bad pick selection. In my PPS, I held 50% score power due to this.`, `This is like Silk Spider poison which can Paralize, and Bind deactivates minion such as Revr, FzMp and SuFl, as well as Knight movers, a Queen2 doesn't want to downgrade 2 tiers.`, `and with Portal, nigh useless Bind.`, `Brokener at +3 with Portal, kills champ and 3 minions.`, `Never getting into CEO really.`, `Stolen idea from immature Awetalehu.`, `Fait unit is too weak at low tiers, turtling potential.`, `{[SHTN]} is weak for what it can do, best is +1.`, `Hates Knights, boo.`, `Costly at later tiers.`, `It can hold a position well, but too weak.`, `0 Cost triggerish wall is kinda OK, but using +1 may be Broken.`, `Use 4 letter Abrv, which are clearer.`, `Should lose 1 Value on ability use, to avoid spam`, `Need a lot less vwls.`, `I designed much better piece in CheBA.`, `That's a nice {[SHTN]}, seems OP for rushing tool though.`, `...Such procedures result in Egg mutating into a Fire Elemental of similar Tier and slightly higher Value... ...The mutation is not apparent until the Egg hatches, a large amount of Heat is released upwards then... ...Resulting creature does not appear hostile, but may be made attack nearby Entities for susteinance...`, `That's not a valid design. For all valid regular armies there shouldn't be a chance to unfair loss situation.`, `Reversing spots avoids Turn 2 swap secure with Minion, except at higher tiers. Like Legionary but not good at 9 for Base. Could use 2 Orthogonal move at base, cost 9, while Plus uses Warrior range, cost 11.`, `Rather weak, needs buff.`, `Underwhelming, but +3 looks pretty cool, and it's OP.`, `Slightly overcosted, as it's easy to know where it will strike.`, `Worth 11 without KillAllSame and Passive.`, `For some reason, Kongregate does not let me Flag this stupid unit, instead showing the Kongregate message tab blank. Please fix this.`, `James, no, that's a correct use of Augmented squares. Capy, you'd find that CloseUp means getting closer, and MeleeJab is Melee with an extend, no unexpected interactions, not NoBlock. Slash was stated to avoid BlowUp though, so you may have thought that of this too.`, `Actually... {[SHTN]}3 is broken. It's 2 tempos that you need to get rid of it, even into a Lust pull or whatever unit can get to attack their 5th row. This -2tempo attack is less problematic on champions. F300 was right on that.`, `Technically, it gets the most out of +1, and it has higher penalty too.`, `This is better as a standalone appeal.`, `Buff: Can Attack|SwapAlly on Rspw locations. Nerf: Costs 5|6|7|8, Penalty 4|7|9|11, Power 2(x-1).`, `Would rate this 0 in a contest, plz improve.`, `Think designer had no brain cells.`, `Needs lots of changes, poorly designed.`, `So, it's an antiminion Pyro at +2|3, which you can't kill, since you lose Morale. And immune to some range attacks. Too strong.`, `Can perform strong, quick forks, not good.`, `Is this Ghostly's? Ghostly does not want to accept he messed up in designs.`, `Messy infopanel, nonsense.`, `Nonsensicable prices, not worth any good.`, `Also {[SHTN]} is stupid name, get rid of it.`, `This is as bad as Tar.`, `{[SHTN]} bad theming, bad design, bad idea.`, `{[SHTN]} no brain inside designer's head.`, `Also {[SHTN]} impossible name to abbrviate well.`, `This piece also stolen from Chess Battle Advanced.`, `This piece from Chess Battle Advanced just modify badly.`, `{[SHTN]} is not thought outed.`, `When I become Cybg I am deleting this piece from memory.`, `{[SHTN]} is kinda stupid name.`, `This piece would destroy ChEO.`, `Very weak, except when becomes OP.`, `Twerrible idea.`, `Too much nasty dirty potential.`, `Big Issue: It ussually attacks first, targetting one or two champions, it has to be hit, then it attacks again. Losing a LifeStone and or a Princess is very annoying, and cheap.`, `Annoying resistant overpowered build: King x1 {[SHTN]}+2 x1 SlKpr+2 x1 Enchantress+3 x1 Paladin+2 x1 MoonFox x2 Wisp+1 x1 Fireball+1 x2 Penguin x3 Ghost+2 x1 Princess+2 x1 LifeStone+2 x1`, `It’s OP with SlKpr+2, Knight, Pyro, or such.`, `It’s ability does not have a penalty, is instant, and ussually unavoidable. Gemini has to split, so it could be targeted by Ranged before it splits, but it’s annoying too. Just attacks once, and again, easily taking out some defenses for a Bishop, Rook, etc.`, `No replies? This piece’s too strong.`, `It’s a Champion unit, not a Minion, it’s mainly for trading with more expensive pieces. It’s a Champion unit, and it’s quite weak, can’t move back, and can’t move sideways unupgraded.`, `These should cost 3 points instead of 2, ice effect is deadly.`, `Is similar to the Ranger, but has Knight range, so it can attack them, also, dispose of non-double Fireball+ and most units.`, `This unit can kamikaze, then again, giving material advantage with no effort, even if it’s a minion. This should cost 14 at base, then 16, 18 and 21, and respawn once with any version. Not everybody uses Pyro, or can afford to waste a Comet.`, `By the way, Comet+ can Freeze minions around target.`, `Too powerful. These are cheap, and one shot is all you need to take down a unit, while zapping Minions with Ranger, Pyro or SlKpr+2. They can’t be attacked properly, as that means losing a Minion to Ranged, or losing a Champion. Also, Minions ussually get 1 kill anyway.`, `Chess games should NOT have ANY random piece.`, `Wyvern, Fencer, Muse, Musketeer, Chrono/Time M. No Katana, Ballister or Griffin.`, `What if you have a LifeStone+1 and a Princess+2? These could be hit hard anyway.`, `Rockets explode on hit too.`, `This first fits into the CheBA custom theme set: Ninja King x1. 10 Cost. King can jump 2 on plus shape. Katana+2 x1. 25 Cost. Pierces Special. Jumps and Attacks. Ballister+1 x1. 15 Cost. Agile, puts pressure. Militian+2 x2. 12 Cost. Cheap melee unit. Alfil+1 x2. 12 Cost. Cheap jumping unit. Griffin x1. 11 Cost. Pattern of attack can threaten most pieces. Nin+2 x1. 5 Cost. Fighting Ninja Minion. Line Guard x1. 3 Cost. Guarding Paladin Minion. Frost Pillar+2 x1. 3 Cost. Freezes enemies. Door Guard+1 x4. 4 Cost. A guard that can attack well. Door Guard x1. 0 Cost. Can defend some squares.`, `Targetting so many squares for 16…`, `How balanced? It gets picked off by something, if it attacks a {[SHTN]}, it dies anyway.`, `This seems a nice nerf. Farthest squares are Attack Minion only. Cost 1, 2, 3, 4.`, `Nerf: Dies if Poisoned.`, `A piece with this range is worth 5 easily, two of these 10, 4 extra for special. A piece Knight+Warrior costs 7+7 +4, and can’t respawn.`, `This piece make me angry inside.`, `Gets get picked off by Ranged attacks. Swapping takes 2 moves only, teleporting and swapping.`, `Did awetalehu make this piece?`, `Added {[SHTN]} to the site.`, `There are too many broken pieces in this game. Gemini gives 2 Champions for one without too much difficulty, while Moonfox can hit twice, easily overthrowing defenses. Comet can trap pieces at the start for a quick attack. LifeStone gives more Morale when it uses its ability. Princess+2 or +3 is very agile, even though it’s a priority target. Ench is broken, more when +3. And now you make {[SHTN]}? Terrible idea.`, `{[SHTN]} is OP. Nerf: Reduces it’s own value by 2 on Special, if less than 2, dissappears, with 1/Turn Morale Loss penalty. That gives 2 shots, a third one would leave a -1 Morale Penalty for 25 Turns, and an unit less.`, `Also, a Katana revamp. Basic: 3,1 or 1,3 Unblockable Jump. 1,0, 1,1 or 0,1 Move or Attack. 2,0 or 0,2 Move Only. 0,+1 Unblockable Move or Attack/Unblockable, Immune Trigger Attack. Cost: 16 Plus1: 2,0 or 0,2 Move or Attack, 3,0 or 0,3 Move Only. 1,+1 Unblockable Move or Attack, Shield. Cost: 18 Plus2: 1,0, 1,1 or 0,1 Unblockable Move or Attack. 1, 1 Shield. 0,+2 Immune Trigger Attack. Hit Foe that Steps Near if still for 3 Turns. Cost: 23 Plus3: 3,0, 2,2 or 0,3 Unblockable Jump. Hit Attacker on Melee Death or Shield Hit if still for 3 Turns. Cost: 28`, `Better: Samurai, but can use Unblockable Jump 2 squares ahead instead of Trigger. Plus1: Move or Trigger back square. Plus2: Attack Target in front Plus3: Teleport two to the side. Rare Clan Minion. Cost: 3, 4, 5, 6. Promotes into Ninja, Samurai into Katana.`, `A board build that uses Fireballs and {[SHTN]}. King x1. 0 Cost. 1 King. Prince x1. 10 Cost. 1 Prince. Ench x1. 5 Cost. 1 Ench. Paladin+1 x1. 14 Cost. 4 Paladin. {[SHTN]}+1 x4. 44 Cost. 16 {[SHTN]}. Fireball+2 x8. 24 Cost. 200 Fireballs. Total: 97 Cost. F F F F F F F F {[1STL]} K B E B B B G`, `Also why does piece name start with {[1STL]}, this HasBeenDone.`, `And my name's not Richard.`, `This piece so bad I deleted all similar pieces from CBA.`, `Stop trolling.`, `You stole this idea from ChBA source code, someone is getting Fired.`, `Tar killed Dinosaurs.`, `Did Awetalehu leak this piece from ChBA?`, `This seems like a Ghostly piece. His game is bogus.`, `This seems like piece from that anime piecemaker.`, `This piece coming away from all sense.`, `This piece mind have none, really.`, `This piece design have no idea of creation.`, `None piece design make sense for here.`, `None ability make much sense and lines too many of text.`, `No real idea of sense. Need massive design changes.`, `No real logic, you are poll and see this is bad.`, `Not good, like Lich Dryd.`, `High power for a minion/champion, Hax ability.`, `Easy explaanation for voting system, also: S Exceptionally effective, good in majority of situations. A Efficient at role, strong with little support. B Expensive for ability, requires dedicated combo. C Effort to grant use, cannot reliably act. D Exceptions for deploying, inferior value. F Es basura, no puede definir ganancia.`, `Plus1 has 1,f1 Move Only.`, `Too slow.`, `A bit too expensive.`, `Warrior but better.`, `Petrify is really strong.`, `Easy to set up a double kill.`, `Costly but handy.`, `Cost +6 with King range Destroy.`, `No close range weakness.`, `Too annoying Knight move.`, `Plus 1 gets 1,f1 Move, Plus2 1,f1 Attack, Plus3 2, f2 Move.`, `Freeze is really strong.`, `Dries nearby Slime on death. These need Ice or Eat to become regular Slimes.`, `Obviously, the beacon deserves (Unstoppable) Fly or Destroy Target squares.`, `Kinda PretendPorn.`, `This effectiveness rather depends on Opponent’s level, if airship bay it’s built, using enough energy on a high level opponent, they could be sent.`, `And I'm clearly a dude, otherwise it would be SSPlayeress.`, `I actually don't sh'tpost in the forums, my terminology and ideas are quite consistent, not an attampt on trolling.`, `Otherwise, I might care about your grittyness, since it would make sense.`]
var rsspn = [randint(1, 12)]; rsspn.push(rsspn[0] + randint(1, 6)); rsspn.push(rsspn[1] + randint(1, 6)); rsspn.push(rsspn[2] + randint(1, 6)); 
var sspratings = `0 3.5 4 4.5 5 5.5 6 6.5`.split(` `)
var sspratings2  = `-0.5 -1 -1.5 -2`.split(` `)

function isColor(x){ // https://stackoverflow.com/questions/48484767/javascript-check-if-string-is-valid-css-color
  let s = new Option().style;
  s.color = x;

  if (x.startsWith("#")) {x = x.slice(1)} // don't need it
  let tests = [s.color == x, /^rgb([0-9A-F,])$/i.test(x), /^rgba([0-9A-F,])$/i.test(x)]
  let tests2 = [/^[0-9A-F]{6}$/i.test(x), /^[0-9A-F]{8}$/i.test(x)]

  if (tests.some(x=>x)){return x} else if (tests2.some(x=>x)){return "#" + x} else {return false}
}

$("#customToolSize").on('change keydown paste input', function() { // Classic JS. You can't do it simply in JS and the jquery library is the easier solution. Again.
  let customToolSize = $("#customToolSize").val().trim();
  if (/^[\.\d]+$/.test(customToolSize)) {
    sketch.set("size", customToolSize)
  }
})

$("#customToolColor").on('change keydown paste input', function() {
  let customToolColor = $("#customToolColor").val().trim();
  if (isColor(customToolColor)) {
    sketch.set("color", isColor(customToolColor))
  }
})

$("#creditsbutton").click(function() {
  $("#credits")[0].style.display = `block`
})

var modal = document.getElementById('credits');
window.onclick = function(event) {
  if (event.target.id !== 'creditsbutton' && modal.style.display == "block"){
    modal.style.display = 'none';
  }
} // https://stackoverflow.com/questions/33060993/click-outside-div-to-hide-div-in-pure-javascript
modal.scrollTop = 0; // thanks for autoscrolling to the bottom for some reason


var grand2 = `not sure I like the idea, seems hollow, bypasses gameplay elements, robs opponent of satisfaction in taking it, removes charm nuance, and more`



function exportasgame () {
  // Exports to ingame code. Only for people trying to make a piece gallery, or think their ideas are so good that it needs as little time as possible to import.
  // THIS DOES NOT ACTUALLY MAKE IT COMPLETELY ACCURATE INGAME CODE, the result is only like half accurate, but all info in the result is enough to work for the gallery parser.

  rv = ``

  for (let level in LEVELS) { // "LEVELS" is an array ["base", "plus", "plusplus", "plusplusplus"]. Conveniently, x is [0, 1, 2, 3] throughout this.
    let movelist = arrayspamming(0, 15*15)
    for (let levelmoves in DATA[`${LEVELS[level]}`].moves) {
      if (DATA[`${LEVELS[level]}`].moves[levelmoves].length > 0) { // This line is necessary so it doesn't error if it's blank.
        let moveresults = (DATA[`${LEVELS[level]}`].moves[levelmoves].match(/.{1,2}/g).map(z=>tob10(z)))
        for (let i = 0; i < moveresults.length; i++) {
          movelist[moveresults[i]] = levelmoves
        }
      }
    }
    a = level==0? "":(numify(level)+1).toString()    // this changes [0, 1, 2, 3] to ["", "2", "3", "4"]
    plusses = arrayspamming("+", level).join("") // nice function reuse

    bonusnonsense = ``

    let passive = `D_${DATA.name}${a}.Passive = "${DATA[`${LEVELS[level]}`].passives}";`.replace(/\n/g, "\\n")
    let movetypes = Object.keys(DATA[`${LEVELS[level]}`].moves).map(x=>numify(x)+1)

    if (passive.match(/Promotes to (.+)/)) {bonusnonsense += `\nD_${DATA.name}${a}.Promote = "${passive.match(/Promotes to (.+)/)[1]}";`}
    if (passive.match(/On Death: Lose \d+/)) {bonusnonsense += `\nD_${DATA.name}${a}.Penalty = ${passive.match(/On Death: Lose (\d+)/)[1]};`}
    if (passive.includes("Status-Immune")) {bonusnonsense += `\nD_${DATA.name}${a}.StatusImmune = true;`}
    if (passive.match(/Immune to.+Freeze/)) {bonusnonsense += `\nD_${DATA.name}${a}.FreezeImmune = true;`}
    if (passive.match(/Immune to.+Petrify/)) {bonusnonsense += `\nD_${DATA.name}${a}.PetrifyImmune = true;`}
    if (passive.match(/Immune to.+Poison/)) {bonusnonsense += `\nD_${DATA.name}${a}.PoisonImmune = true;`}
    if (passive.match(/Immune to.+Compel/)) {bonusnonsense += `\nD_${DATA.name}${a}.CompelImmune = true;`}
    if (passive.includes("Displacement-Immune")) {bonusnonsense += `\nD_${DATA.name}${a}.DisplacementImmune = true;`}
    if (movetypes.includes(28)) {bonusnonsense += `\nD_${DATA.name}${a}.HasTarget = true;`}
    if (movetypes.includes(34)) {bonusnonsense += `\nD_${DATA.name}${a}.TurnTrigger = "Start";`} // Alchemist trigger
    if (movetypes.includes(42)) {bonusnonsense += `\nD_${DATA.name}${a}.TurnTrigger = "End";`} // Lust trigger

    LEVELS[level]
    rv += `
    D_${DATA.name}${a} = new Object();
    UnitLibrary[Place] = "${DATA.name}${a}";
    D_${DATA.name}${a}.Name = "${DATA.name}${plusses}";
    D_${DATA.name}${a}.Index = Place;
    Place++;
    D_${DATA.name}${a}.Cost = ${DATA[`${LEVELS[level]}`].cost};
    D_${DATA.name}${a}.Rarity = "${DATA.labels.rarity}";
    D_${DATA.name}${a}.Moves = [${movelist.map(x=>numify(x)+1).join(",")}];
    D_${DATA.name}${a}.MoveTypes = [${movetypes}];${DATA[`${LEVELS[level]}`].passives? `\n    ` + `D_${DATA.name}${a}.Passive = "${DATA[`${LEVELS[level]}`].passives}";`.replace(/\n/g, "\\n") : ``}
    D_${DATA.name}${a}.Minion = ${DATA.labels.rank == "Minion"?"true":"false"};${bonusnonsense}
    D_${DATA.name}${a}.Tier = ${level};
    D_${DATA.name}${a}.AIskip = 50;`

  }
  return rv
}

var devtoolsrevealed = false
document.addEventListener('keydown', function (e) { // dev tools
  if (!devtoolsrevealed && `${e.code}` == "Backquote") {
     document.getElementById("devtools").style.display = "initial"; 
     $(".hiddendisplay").attr("style", "display: initial")
     $("#revealdevtools").attr("style", "display: none")
     devtoolsrevealed = true
  }
});

document.getElementById("revealdevtools").addEventListener("click", function() {
  if (!devtoolsrevealed) {
     document.getElementById("devtools").style.display = "initial"; 
     $(".hiddendisplay").attr("style", "display: initial")
     $("#revealdevtools").attr("style", "display: none")
     devtoolsrevealed = true
  }
});



document.getElementById("copyButton").addEventListener("click", function() {
  document.getElementById("copyTarget").value = exportasgame()
  copyToClipboard(document.getElementById("copyTarget"));
});
document.getElementById("movesetArray").addEventListener("click", function() {
  document.getElementById("copyTarget").value = ("[" + (/Moves = \[(.+)\]/gi).exec(  exportasgame()  )[1] + "]")
  copyToClipboard(document.getElementById("copyTarget"));
});




// main_gi: Isn't it great that this simple feature is so much filler?
// https://stackoverflow.com/questions/22581345/click-button-copy-to-clipboard-using-jquery
function copyToClipboard(e){var t,n,o="INPUT"===e.tagName||"TEXTAREA"===e.tagName;if(o)c=e,t=e.selectionStart,n=e.selectionEnd;else{if(!(c=document.getElementById("_hiddenCopyText_"))){var c=document.createElement("textarea");c.style.position="absolute",c.style.left="-9999px",c.style.top="0",c.id="_hiddenCopyText_",document.body.appendChild(c)}c.textContent=e.textContent}var a,d=document.activeElement;c.focus(),c.setSelectionRange(0,c.value.length);try{a=document.execCommand("copy")}catch(e){a=!1}return d&&"function"==typeof d.focus&&d.focus(),o?e.setSelectionRange(t,n):c.textContent="",a}

function tl (x) {l(x)} // temporary log
function tl (x) {} // if this is declared, tl does nothing

let pretendtournament1 = `*7 .4
*6 .35
*5 .3
*4 .3
*3 .4
*2 .5
*1 .75

j *3 1
j *2 .75
j *1 undefined

a ma*.8
m ma*.5

t *7 .5
t j*.5

{0a} ma*.5 (unblockable allyswap)
{1a} ma*1.5 (blockable move/attack/allyswap)

js j+ma*.5
ts t+ma*.5

{mp} ma*.3

(path not programmed)
(colorbound checks not programmed)
('error checks' like blockables-on-unblockable-squares, or too many forward unblockable range 3 squares, not programmed)

(These values are for this tournament: https://steemit.com/hive-135459/@e3gewinnt/oppiecespiecemakingandcorrespondanceplaycontest)
(Comments in parentheses are ignored.)`

let pretendtournament2 = `*7 .4
*6 .35
*5 .3
*4 .3
*3 .4
*2 .5
*1 .75

ma f*7 ma*1.3
ma b*7 ma*.7

j *3 1
j *2 .75
j *1 undefined

j f*7 j*1.3
j b*7 j*.7

a ma*.8
m ma*.5

t *7 .5
t j*.5

{0a} ma*.5 (unblockable allyswap)
{1a} ma*1.5 (blockable move/attack/allyswap)

js j+ma*.5
ts t+ma*.5

{mp} ma*.3

(path not programmed)
(colorbound checks not programmed)
('error checks' like blockables-on-unblockable-squares, or too many forward unblockable range 3 squares, not programmed)

(These values are for this tournament: https://steemit.com/hive-135459/@e3gewinnt/oppiecespiecemakingandcorrespondanceplaycontest)
(Comments in parentheses are ignored.)`

document.getElementById("devtool_scoring").value = pretendtournament2

function update_devtool_score (a) {
  // a = the given array

  //devtoolsrevealed
  let declarations = document.getElementById("devtool_scoring").value.replace(/\(.+\)/g, "").split("\n").filter(x => x != "")
  let totalscore = 0
  try {
    let scoringlookup = {} // An object that will contain stuff like "2: [ARRAY FORM DATA]", with the 2 being the move id.
    function make_key_if_unmade (key) {
      if (scoringlookup[`${key}`]) {return}
      scoringlookup[`${key}`] = arrayspamming(NaN, 15*15)
    }

    function shortcut_to_array (s) { // Can be a shortcut like "ma" or number like ".5"
      if (shortcuts.includes(s)) {
        let action = shortcuts.indexOf(s)-1
        return Object.assign([], scoringlookup[`${action}`]) // AAAAAAAAGH COPY BY REFERENCE JS SUCKS SO HARD
      } else if (s == "ma") {
        return Object.assign([], scoringlookup[`0`])
      } else { // assume it's a float then
        return arrayspamming(parseFloat(s), 15*15)
      }
    }

    function multiply_boards (a) {
      let reductivevalue = a.shift()
      for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < reductivevalue.length; j++) {
          reductivevalue[j] = reductivevalue[j] * a[i][j] // <- MULTIPLICATION SIGN IN THIS LINE
        }
      }
      return reductivevalue
    }

    function add_boards (a) {
      let reductivevalue = a.shift()
      for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < reductivevalue.length; j++) {
          reductivevalue[j] = reductivevalue[j] + a[i][j] // <- ADDITION SIGN IN THIS LINE
        }
      }
      return reductivevalue
    }

    function evaluate_string (s) {
      let a = s.split("+")
      return add_boards(a.map(x => multiply_boards(x.split("*").map(x => shortcut_to_array(x)))))
    }





    for (let i=0; i < declarations.length; i++) {
      let words = declarations[i].trim().split(" ") // "trim" to get rid of potential floating spaces
      let action = 0;
      if (shortcuts.includes(words[0])) { // first word is a shortcut
        action = shortcuts.indexOf(words[0])-1
        words.shift() // get rid of first element
      } else if (words[0] == "ma") {
        words.shift() // idiot
      }

      make_key_if_unmade(action)
      if (words.length == 1) {
        tl("scoring:")
        tl(scoringlookup)
        // Then it's a kind of multiplier onto an existing action that uses the existing action as a base.
        let rv = evaluate_string(words[0])

        // Before replacing scoringlookup[`${action}`], it should NOT overwrite if any values would be replaced with NaNs.
        for (let i = 0; i < scoringlookup[`${action}`].length; i++) {
          if (!isNaN(rv[i])) {
            scoringlookup[`${action}`][i] = rv[i]
          }
        }


      } else if (words.length == 2) {
        let array_this_declaration = betza_to_array(words[0], 0)
        if (words[1].match(/\+|\*/g)) { // if + or * detected
          given_score = evaluate_string(words[1])
        } else {
          given_score = arrayspamming(parseFloat(words[1]), 15*15)
        }

        for (let j=0; j < array_this_declaration.length; j++) {
          if (array_this_declaration[j] != 0 && array_this_declaration[j] != undefined && !isNaN(array_this_declaration[j])) {
            scoringlookup[`${action}`][j] = given_score[j]
          }
        }

      } else {
        //throw "too many words 7.8/10"
      }


    }
    tl("lookup " + JSON.stringify(scoringlookup))

    for (let j=0; j < a.length; j++) { // Finally let's check against scoringlookup.
      let action = a[j]-2 // Due to nonsense this is 2 off, but that means "no action" = -1.
      if (action != -1) {
        totalscore += scoringlookup[`${action}`][j]
      }
    }

  } catch (error) {
    l(error)
  }
  return totalscore
}

let scoresync = false
let autobexport = false

$("#getscore").click(function() {
  let rv = update_devtool_score(exportcode_to_array(toCSV(DATA).split("\n")[2].split(",").slice(2).join(","), 1))
  if (rv.toFixed("14") != rv) { // floating point error fix, hopefully this functionality is invisible
    rv = rv.toFixed("13").replace(/0+$/, "")
  }

  $("#devtool_scoring_number").text(rv);

})

$("#scoresync").click(function() {
  scoresync = !scoresync;
  $("#scoresync")[0].innerHTML = "Sync Scores with Costs " + "(" + (scoresync?"on":"off") + ")"
});
$("#autobexport").click(function() {
  autobexport = !autobexport;
  $("#autobexport")[0].innerHTML = "Automatic Bexport each edit " + "(" + (autobexport?"on":"off") + ")"

});

$("#devtool_scoring").change(function () {scoresync_function()})
$("#devtool_scoring").keyup(function () {scoresync_function()})

function scoresync_function () {
  if (!scoresync) {return}

  let costs = [
  update_devtool_score(exportcode_to_array(toCSV(DATA).split("\n")[2].split(",").slice(2).join(","), 1)),
  update_devtool_score(exportcode_to_array(toCSV(DATA).split("\n")[3].split(",").slice(2).join(","), 1)),
  update_devtool_score(exportcode_to_array(toCSV(DATA).split("\n")[4].split(",").slice(2).join(","), 1)),
  update_devtool_score(exportcode_to_array(toCSV(DATA).split("\n")[5].split(",").slice(2).join(","), 1))
  ]
  costs = costs.map(x => x.toFixed("14") != x? x.toFixed("13").replace(/0+$/, "") : x) // floating point error fix, hopefully this functionality is invisible


  $("#base input").val(costs[0]);
  $("#plus input").val(costs[1]);
  $("#plusplus input").val(costs[2]);
  $("#plusplusplus input").val(costs[3]);
}

function autobexport_function () {
  if (!autobexport) {return}
  let rv = [];
  let a = toCSV(DATA).split("\n")
  let boards = [a[2], a[3], a[4], a[5]]

  let othertext = a[0].split(",") // A thing like ["Knight", "Champion", "Basic", "Common"]
  if (othertext[0] == "Name" || othertext[0] == "name" || othertext[0] == "PieceName" || othertext[0] == "") {
    // Do nothing then.
  } else {
    rv.push(othertext.join(" ")) // Makes the first line "Knight Champion Basic Common" then
  }

  for (let i = 0; i < boards.length; i++) {
    let x = boards[i].split(",")
    let cost = x[0]
    let passive = x[1]
    let movetypes = array_to_betza(exportcode_to_array(x.slice(2).join(",")), 0) // Slice 2 stuff is because every movetype is split by a comma.
    rv.push(`[${cost}] ${movetypes}${(passive == "")? "" : ` | ${passive}`}`)
  }
  rv = rv.join("\n")

  $("#code").val(rv);
}


var directions = ["f", "b", "l", "r", "v", "h"]
var basicatoms = ["W", "F", "D", "N", "A", "T", "V", "Z", "Y"]
var basicatomcorrespond = [[0, 1], [1, 1], [2, 0], [2, 1], [2, 2], [3, 0], [3, 1], [3, 2], [3, 3]]
var advancedatoms = ["K", "Q"]

var bishopatoms = ["X2", "X3", "X4", "X5", "X6", "B"]
var rookatoms   = ["+2", "+3", "+4", "+5", "+6", "R"]

function del_n(s, n) {if (!isNumber(n)) {n = n.length}; return s.slice(n)}

var shortcuts = [``, // blank
"",  // Move or Attack (should usually be unused)
"m",    // Move
"a",    // Attack
"j",    // Jump (unblockable move/attack)
"js",   // Jump-swap (unblockable move/attack/swap)
"t",    // Teleport (unblockable move)
"{md}", // Magic Destroy
"{ss}", // Summon Sapling
"{ch}", // Charm
"{sk}", // Summon Skeleton
"{ms}", // Move from start
"{po}", // Poison
`{fr}`, // Freeze
`{pe}`, // Petrify
`{ptirt}`, // Polymorph to random minion (SHOULD NOT BE USED)
`{tttrt}`, // Teleport unit to random location (SHOULD NOT BE USED)
`{ttmt}`,  // Teleport and mass-teleport adjacent (SHOULD NOT BE USED)
`{so}`, // Sorceress ability (SHOULD NOT BE USED)
`{en}`, // Enchant
`{gh}`, // Ghostify (SoulKeeper)
`{ts}`, // Teleport from start
`{gs}`, // GiantSlime
`{mf}`, // MoonFox
`{ml}`, // Minion Lunge (Tiger)
`{aa}`, // Auto-Attack (Samurai)
`{at}`, // Ability Target
`{to}`, // Tele-out (Portal)
`{rp}`, // Ranged Push (AirElemental)
`{sp}`, // Split (Gemini)
`{tk}`, // Teleport King (Valkyrie)
`ts`,   // Tele-swap
`{ls}`, // LifeStone revive
`{cu}`, // Cure (Alchemist)
`{ne}`, // Necromancer ability
"{bl}", // Block (HauntedArmor)
"{fe}", // Freeze-Explosion (Comet)
"{fs}", // Freeze-Strike (Aquarius)
"{ba}", // Bat (Vampire)
"{ca}", // Castle
"{tm}", // Thundermark (ThunderMage)
"{lu}", // Lust
"{ti}", // Tele-in (Beacon recall)
"{rd}", // Ranged Destroy
"{mt}", // Move to Ability Target (GravityMage)
"{is}", // Instant Swap (Guardian)
"{en}", // Envy
"{sp}", // Splash
"{pi}", // Pikeman
"{mp}", // Magic Push
"{si}", // Siren
"{bu}", // Butterfly Effect
"{ta}", // Taurus Rush
"{l}",    // Lunge (unblockable attack only)
"{pi}", // Pillar (StoneMage, EarthElemental)
"{fi}", // FireMage
`{pvma}`, // random crappy path abilities
`{phma}`,
`{plma}`,
`{prma}`,
`{le}`, // Leap (Toad)
`{pva}`, // Path Vertical
`{pha}`, // Path Horizontal
`{pla}`, // Path Diagonal "Left"
`{pra}`, // Path Diagonal "Right"
`{nu}`, // Null
`{vo}` // Void
]

// Now populate shortcuts with any missing stuff, using the "id" key in MOVES for each, and starting at shortcuts.length

for (let i = shortcuts.length-1; i < MOVES.length; i++) {
  shortcuts.push(`{${MOVES[i].id}}`)
}




function betza_to_array(s, offset = +1) {
  function fixxy (x, y) {return (x+7) + (-y+7)*15} // gets x and y back into a number from 0-225. Note that this one has "y" flipped.
  let a = arrayspamming(0, 15*15)
  let curaction = 1
  let shortcutsnoblanks = shortcuts.filter(x => x != "")

  // Iterate using 3 steps: Check shortcut, check directional modifiers, check atoms.

  while (s != "") {
    //l(s)
    let curshortcuts = shortcutsnoblanks.filter(x => s.startsWith(x)) // if starts with a shortcut?
    if (curshortcuts.length > 0) {
      let longeststring = function (array) {return array.sort(function (a, b) { return b.length - a.length; })[0]}
      curaction = shortcuts.indexOf(longeststring(curshortcuts)); // Because I want it to match "js" over "j", but "j" comes first
      s = del_n(s, longeststring(curshortcuts).length)
    }
    let curdirectionsfound = []
    while (shortcutsnoblanks.filter(x => s.startsWith(x)).length == 0 && s != "") {
      let directionsfound = []; let weak = false; let atomsaffected;
      let wisplike = false;
      while (directions.filter(x => s.startsWith(x)).length != 0) { // Look at the start repeatedly until it's not a direction.
        let founddirection = directions.filter(x => s.startsWith(x))[0]
        directionsfound.push(founddirection); s = del_n(s, founddirection)
      }
      // As the while loop finished, the next symbol should be an atom or part of one.

      // Okay, this modification makes the directionsfound *not matter* if there are no results. Basically, fWD will be treated as fWfD instead of DfW:
      if (directionsfound.length == 0 && curdirectionsfound.length != 0) {directionsfound = curdirectionsfound}
      else {curdirectionsfound = directionsfound}


      let ex = 0; let ey = 0;
      if (s.startsWith("Q")) { // TODO
        s = del_n(s, "Q")
        s = "B" + directionsfound.join("") + "R" + s
      }

      if (basicatoms.filter(x => s.startsWith(x)).length) {
        let foundatom = basicatoms.filter(x => s.startsWith(x))[0]
        ex = basicatomcorrespond[basicatoms.indexOf(foundatom)][0]
        ey = basicatomcorrespond[basicatoms.indexOf(foundatom)][1]
        s = del_n(s, foundatom)
      } else if (s.startsWith("K")) {
        ex = 0
        ey = 1
        s = del_n(s, "K")
        s = directionsfound.join("") + "F" + s
      } else if (bishopatoms.filter(x => s.startsWith(x)).length) {
        let foundatom = bishopatoms.filter(x => s.startsWith(x))[0]
        let currange = bishopatoms.indexOf(foundatom)+2
        s = del_n(s, foundatom.length)
        function bishopline(n) {return arrayToX(n).map(x => x.toString()+x.toString()).slice(1)} // slice(1) to remove "00"

        atomsaffected = spamAllSymmetry(bishopline(currange).map(x => [numify(x.slice(0,1)), numify(x.slice(1,2))]))
        weak = true

      } else if (rookatoms.filter(x => s.startsWith(x)).length) {
        let foundatom = rookatoms.filter(x => s.startsWith(x))[0]
        let currange = rookatoms.indexOf(foundatom)+2
        s = del_n(s, foundatom.length) // This "length" is NECESSARY because isNumber will troll and think the string "+3" = 3
        function rookline(n) {return arrayToX(n).map(x => "0"+x.toString()).slice(1)} // slice(1) to remove "00"


        atomsaffected = spamAllSymmetry(rookline(currange).map(x => [numify(x.slice(0,1)), numify(x.slice(1,2))]))
        weak = true

      } else if (s.match(/^\*\d/)) { // Wisp-like. Not sure what to do here.
        let currange = numify(s.slice(1,2)) // Should be the number.
        s = del_n(s, 2)
        function range(n) {return arrayToX(n).map(x => x.toString()+n.toString())}
        function rangeUpTo(n) {return ([].concat.apply([], (arrayToX(n).map(n=>range(n))))).slice(1)} // slice(1) at the end to remove "00" element.
        atomsaffected = spamAllSymmetry(rangeUpTo(currange).map(x => [numify(x.slice(0,1)), numify(x.slice(1,2))]))
        weak = true
        wisplike = true
        ex = 1; ey = 2 // Manipulating likeAtom to be N
        /*
        for (let i = 0; i < atomsaffected.length; i++) {
          let x = atomsaffected[i]
          if (a[fixxy(x[0], x[1])] != 0) {continue}
          a[fixxy(x[0], x[1])] = curaction
        }
        break*/

      } else if (s.match(/^\d/)) { // Because JS doesn't allow startswith with regex.
        ex = numify(s.slice(0, 1))
        ey = numify(s.slice(1, 2))
        s = del_n(s, 2)
      } else {l(`ERROR, final string: "`+s+`"`); throw WhereIsTheDamnAtom}

      let likeAtom = "N"; if (ex == ey) {likeAtom = "F"} else if (ex == 0 || ey == 0) {likeAtom = "W"}
      // kay, so both ex and ey should be positive based on how this is made. That means it's top-right by default...
      
      if (!weak) {atomsaffected = spamAllSymmetry([ex, ey])}

      for (let i = 0; i < directionsfound.length; i++) {
        let it = directionsfound[i]
        if (wisplike) {ex = x[0]; ey = x[1]} // To have it autoupdate on every value instead of just doing it once

        if (it == "f") {atomsaffected = atomsaffected.filter(x => x[1] > 0)}
        else if (it == "b") {atomsaffected = atomsaffected.filter(x => x[1] < 0)}
        else if (it == "l") {atomsaffected = atomsaffected.filter(x => x[0] < 0)}
        else if (it == "r") {atomsaffected = atomsaffected.filter(x => x[0] > 0)}
        else if (it == "h") {atomsaffected = atomsaffected.filter(x => x[0] != 0)}
        else if (it == "v") {atomsaffected = atomsaffected.filter(x => x[1] != 0)}
        if (likeAtom == "N" && (directionsfound[i-1] == directionsfound[i] || it == "h" || it == "v")) { // Kind of a hack, it checks adjacent equality.
          if (!wisplike) {
            // Most things aren't wisplikes, it's faster to compute 'longer' once.
            let longer = Math.max(ex, ey)
            if (it == "f") {atomsaffected = atomsaffected.filter(x => x[1] == longer)}
            if (it == "b") {atomsaffected = atomsaffected.filter(x => x[1] == -longer)}
            if (it == "l") {atomsaffected = atomsaffected.filter(x => x[0] == -longer)}
            if (it == "r") {atomsaffected = atomsaffected.filter(x => x[0] == longer)}
            if (it == "h") {atomsaffected = atomsaffected.filter(x => Math.abs(x[0]) == longer)}
            if (it == "v") {atomsaffected = atomsaffected.filter(x => Math.abs(x[1]) == longer)}
          } else {
            // If wisplike, must filter on every element.
            if (it == "f") {atomsaffected = atomsaffected.filter(x => x[1] >= Math.max(Math.abs(x[0]), Math.abs(x[1])))}
            if (it == "b") {atomsaffected = atomsaffected.filter(x => x[1] <= -Math.max(Math.abs(x[0]), Math.abs(x[1])))}
            if (it == "l") {atomsaffected = atomsaffected.filter(x => x[0] <= -Math.max(Math.abs(x[0]), Math.abs(x[1])))}
            if (it == "r") {atomsaffected = atomsaffected.filter(x => x[0] >= Math.max(Math.abs(x[0]), Math.abs(x[1])))}
            if (it == "h") {atomsaffected = atomsaffected.filter(x => Math.abs(x[0]) == Math.max(Math.abs(x[0]), Math.abs(x[1])))}
            if (it == "v") {atomsaffected = atomsaffected.filter(x => Math.abs(x[1]) == Math.max(Math.abs(x[0]), Math.abs(x[1])))}

          }
        }
        if (directionsfound[i-1] == directionsfound[i] && (directionsfound[i-2] == directionsfound[i-1] || (it == "h" || it == "v"))) { // triple? actually, just get ridda the diagonals
          atomsaffected = atomsaffected.filter(x => Math.abs(x[0]) != Math.abs(x[1]))
        }
      }

      for (let i = 0; i < atomsaffected.length; i++) {
        let x = atomsaffected[i]
        if (weak && a[fixxy(x[0], x[1])] != 0) {continue} // Gives precedence to earlier atoms if the current one is a ranged atom.
        a[fixxy(x[0], x[1])] = curaction
      }
    }

  }
  a = a.map(x => x+offset) // +1, thanks grand

  return a
}

let MOVES_ids = MOVES.map(x => x.id)
function MOVESindex_to_id (x) {
  return MOVES_ids.indexOf(x)
}

function array_to_exportcode (a, offset=0, returnmovetypes=false) {
  a = a.map(x => numify(x) - offset)
  let movetypes = onlyUnique(a).filter(x => x != 0); if (returnmovetypes) {return movetypes}
  let typeslist = []
  for (let j=0; j < movetypes.length; j++) {
    let movetypenumber = movetypes[j]
    typeslist.push(`${MOVES_ids[movetypenumber-1]}:${a.reduce(function(array, element, index) {if (element == movetypenumber) array.push(tob15(index)); return array;}, []).join("")}`) // Filter for only the numbers that match the movetype, and push the hex'd index
  }
  return typeslist.join(",")
}

function exportcode_to_array (s, offset=0) {
  // Might come in something like this:
  // 1,Promotes to Legionary.,1:67,3:57

  let a = s.split(",").filter(x => x.includes(":")) // Needs a colon or it's not a moveset
  let rv = arrayspamming(0, 15*15)

  for (let i=0; i < a.length; i++) {
    let movetype = MOVESindex_to_id(a[i].split(":")[0]) +1 // We need to do this to properly convert stuff like "c1" (custom ability 1)

    let actions  = a[i].split(":")[1].match(/.{1,2}/g) // Split every 2 symbols, that's how the export code works.

    for (let j=0; j < actions.length; j++) {
      rv[tob10(actions[j])] = movetype // Convert it to base 10, then modify the array up.
    }

  }
  return rv.map(x => x + offset)
}





function array_to_betza (a, offset=0) {
  let betzarv = []
  a = a.map(x => numify(x) - offset)
  let movetypes = onlyUnique(a).filter(x => x != 0)//.map(x => x.toString())
  for (j=0; j < movetypes.length; j++) {
    let movetypenumber = (movetypes[j]).toString() // MINUS ONE TO MATCH!

    // This part is now for Betza notation. Welcome back, my function friends:
    let x = function (i) {return (i % 15) - 7}
    let y = function (i) {return 7 - Math.floor(i / 15)}
    let fixxy = function (x, y) {return (x+7) + (y+7)*15} // gets x and y back

    let atomsconsidered = []
    let atomsdirections = []
    let likeatoms = []
    let learray = a.reduce(function(array, element, i) { // i = index
      // This 'reduce' function's "array" part is superfluous really, and is only used for high values like (4,0) and such.

      if (element == movetypenumber) {
        let atom = false; let absx = Math.abs(x(i)); let absy = Math.abs(y(i))
        let likeAtom = (absx == absy)? "F" :(absx == 0 || absy == 0)? "W" : "N"
        switch (absx + absy) {
          case 1: atom = "W"; break
          case 2:
            if (absx == 0 || absy == 0) {atom = "D"} else {atom = "F"}; break
          case 3:
            if (absx == 0 || absy == 0) {atom = "T"} else {atom = "N"}; break
          case 4:
            if (absx == 1 || absy == 1) {atom = "V"} else {atom = "A"}; break
          case 5:
            atom = "Z"; break
          case 6:
            atom = "Y"; break
          default:
            atom = false
        }
        if (absx >= 4 || absy >= 4) {
          //array.push(`(${x(i)},${y(i)})`) // Actually, new notation change, >4 atoms will be treated as their own things, basically allowing symmetry. This means "atom != false" is always triggering now.
          if (absx < absy) {atom = absx.toString() + absy.toString()} else {atom = absy.toString() + absx.toString()}
        }

        //else if (atom != false) {
          if (atomsconsidered.indexOf(atom) == -1) {atomsconsidered.unshift(atom); atomsdirections.unshift([]); likeatoms.unshift(likeAtom)}
          // IMPORTANT: It's shifted instead of pushed, so "ANDFW" is instead read "WFDNA" which is the correct order IMO.

          let tochange = ""; let shorter = 0;
          if (likeAtom == "N") {shorter = Math.min(absx, absy)} // In an N-like atom, one number must be lower than the other.
          if (y(i) > 0)  {tochange += "f"}
          if (y(i) > shorter && likeAtom == "N")  {tochange += "f"}
          if (y(i) < 0)  {tochange += "b"}
          if (y(i) < -shorter && likeAtom == "N") {tochange += "b"}
          if (x(i) < 0)  {tochange += "l"}
          if (x(i) < -shorter && likeAtom == "N") {tochange += "l"}
          if (x(i) > 0)  {tochange += "r"}
          if (x(i) > shorter && likeAtom == "N")  {tochange += "r"}
          atomsdirections[atomsconsidered.indexOf(atom)].push(tochange)
        //}

      }
      return array;
    }, []) // (end the big "reduce")

    // Now, the atoms and directions are logged, now they must be simplified and sorted.

    let weave = (a, b) => a.length ? [a[0], ...weave(b, a.slice(1))] : b; // https://stackoverflow.com/questions/10308012/combine-two-arrays-in-a-zipping-fashion-javascript/55077593
    function removeelement(a, value) {let index = a.indexOf(value); if (index > -1) {a.splice(index, 1);} return a;}
    function removeelements(a, values) {for (let i=0; i<values.length; i++) {a = removeelement(a, values[i])}; return a}

    atomsdirections = atomsdirections.map(function (a, index) {
      // As complex as this looks, there are actually only 3 possible cases: W-like, F-like, or N-like. The knight-like has 8 symmetries and the other two have 4. Unfortunately due to path, I must also account asymmetry.
      // f, b, v (fb), h (lr), fh (flr), bh (blr), [none] (fblr) - W-like
      // f, b - F-like
      // f, ff, b, bb, h (llrr)
      let likeAtom = likeatoms[index] // From the last loop.
      let atom = atomsconsidered[index]

      function utterlyMerge(a, CHECKTHESE, thingtopush) { // CHECKTHESE is an array like ["f", "b"]. This function checks if the array contains all of those elements. If it does, removes them all and pushes CHECKTHESE as an element.
        if (CHECKTHESE.every(x => a.includes(x))) {
          removeelements(a, CHECKTHESE); if (thingtopush == false) {return} else {a.push(thingtopush)}
        }
      }
      if (likeAtom == "W") { // As there are only 3 types of atoms it can 'be like' (D is like W, A is like F, Z is like N):
        utterlyMerge(a, ["f", "b"], "v")
        utterlyMerge(a, ["l", "r"], "h")
        utterlyMerge(a, ["v", "h"], false)
      } else if (likeAtom == "F") {
        utterlyMerge(a, ["fl", "fr"], "f")
        utterlyMerge(a, ["bl", "br"], "b")
        utterlyMerge(a, ["f", "b"], false)
      } else if (likeAtom == "N") { // There is "ffl", "ffr", "fll", "frr", "bll", "brr", "bbl", "bbr".
        utterlyMerge(a, ["ffl", "ffr"], "ff")
        utterlyMerge(a, ["fll", "frr"], "fh")
        utterlyMerge(a, ["bbl", "bbr"], "bb")
        utterlyMerge(a, ["bll", "brr"], "bh")
        utterlyMerge(a, ["ff", "fh"], "f")
        utterlyMerge(a, ["bb", "bh"], "b")
        utterlyMerge(a, ["f", "b"], false)
        utterlyMerge(a, ["ffl", "ffl"], "fl")
        utterlyMerge(a, ["ffr", "frr"], "fr")
        utterlyMerge(a, ["bbl", "bll"], "bl")
        utterlyMerge(a, ["bbr", "brr"], "br")
        utterlyMerge(a, ["ff", "bb"], "v")
        utterlyMerge(a, ["fh", "bh"], "h")
      }
      return a // main_gi: Don't remove this. This is inside a map()
    })
    function atomshortcut (values, shortento) { // This is not "functional programming" this time, as it is dealing with both atomsconsidered and atomsdirections.
      //values.reverse() // This is for """performance""" by checking the 'rarer' atoms (as in, the ones at the end of the array) first. It should do nothing otherwise.

      // main_gi: Actually no. JS craps itself and thinks values.reverse() should change by reference.

      if (values.every(x => atomsconsidered.includes(x)) && [...new Set(values.map(x => atomsdirections[atomsconsidered.indexOf(x)].join(",")))].length == 1) {
        // The "new set" thing asks: "Does the array only have 1 unique value?". There is a bit of spaghetti, in that since JS doesn't think [2, 3] is equal to [2, 3], so it has to be joined to do a string comparison.

        let firstfound = values.shift()
        let indexesofremovedelements = values.map(x => atomsconsidered.indexOf(x))
        // if (values.includes("04") && this_is_the_name_with_plus_signs_thanks_js_for_being_trash == "Paladin") {l(data[i]); l(values); l(indexesofremovedelements); l(atomsconsidered); l(atomsdirections); throw TypeError;} // DEBUG COMMENT

        removeelements(atomsconsidered, values) // Remove all but the first element
        indexesofremovedelements.reverse().filter(x => atomsdirections.splice(x, 1)) // Remove the elements from corresponding atomsdirections.
        // ....................... I have to reverse the indexes array, otherwise the splice is CAUSING THE ARRAY TO CHANGE SIZE and therefore change the indexes.

        atomsconsidered[atomsconsidered.indexOf(firstfound)] = shortento // Replace the saved first element with the new name
      }
    }
    // Now that everything is sorted out, there are shortcuts to make:
    // (need wisp range too)
    let rook = ["W", "D", "T", "04", "05", "06", "07"]
    let bishop = ["F", "A", "Y", "44", "55", "66", "77"]
    function arrayToX(number) {let rv = []; for (var i = 0; i <= number; i++) {rv.push(i)}; return rv} // creates [0, 1, 2, ..., X]
    function range(n) {return arrayToX(n).map(x => x.toString()+n.toString())}
    let rangeUpTo3 = ["W", "F", "D", "N", "A", "T", "V", "Z", "Y"]
    function rangeUpTo(n) {return rangeUpTo3.concat([].concat.apply([], (arrayToX(n).slice(4).map(n=>range(n)))))} // "slice 4" because this function only works for range >=4
    atomshortcut(rangeUpTo(7), "*7")
    atomshortcut(rangeUpTo(6), "*6")
    atomshortcut(rangeUpTo(5), "*5")
    atomshortcut(rangeUpTo(4), "*4")
    atomshortcut(rangeUpTo(3), "*3")
    atomshortcut(rook, "R")
    atomshortcut(bishop, "B")
    atomshortcut(["R", "B"], "Q")
    atomshortcut(rook.slice(0, 6), "+6")
    atomshortcut(bishop.slice(0, 6), "X6")
    atomshortcut(rook.slice(0, 5), "+5")
    atomshortcut(bishop.slice(0, 5), "X5")
    atomshortcut(rook.slice(0, 4), "+4")
    atomshortcut(bishop.slice(0, 4), "X4")
    atomshortcut(rook.slice(0, 3), "+3")
    atomshortcut(bishop.slice(0, 3), "X3")

/* I want to support this notation but it's work. This is never ambiguous because a string like "+1406" vs. "+406" is distinguishable by odd/even. (+406 = +0406)
    atomshortcut(rook.slice(1, 6), "+16")
    atomshortcut(bishop.slice(1, 6), "X16")
    atomshortcut(rook.slice(1, 5), "+15")
    atomshortcut(bishop.slice(1, 5), "X15")
    atomshortcut(rook.slice(1, 4), "+14")
    atomshortcut(bishop.slice(1, 4), "X14")
    atomshortcut(rook.slice(1, 3), "+13")
    atomshortcut(bishop.slice(1, 3), "X13")
    */
    atomshortcut(["W", "F"], "K")

    atomsdirections = atomsdirections.map((a, index) => a.join(atomsconsidered[index])) // Finally take care of the last bits, where an array of ["f", "l"] should be written as "fWlW" for example.

    betzarv.push(`${shortcuts[numify(movetypenumber)]}${weave(atomsdirections, atomsconsidered).join("")}${learray.join("")}`)
  } // closing the "movetypes" loop
  return betzarv.join("")
}
