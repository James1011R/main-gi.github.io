console.log("Script loaded!")

/* 
<style>
  .ceotable {width: 100%; height: 100%; text-align: center; font-weight: bold; background: rgba(255, 255, 255, 0.25); color: #222; overflow-y: auto}
    }

</style> */

var javascriptsucks = true;
function l(x) {if (isUndefined(x)) {console.log("ping"); return}; console.log(x)}
function print(x) {console.log(x)}

function isNumber (value) {return (value === 0 || (!isNaN(value) && value !== "" && value != false))? 1 : 0}
//function isNumber (value) {return typeof value === 'number' && isFinite(value);}
function isInteger (v) {return (typeof v==='number' && (v%1)===0);}
function positiveInt (v) {return (isInteger(v) && v >= 1)}
function isString (value) {return (typeof value === 'string')? 1 : 0}
function isObject (value) {return (typeof value === 'object' && value !== null)}
function isUndefined (value) {return typeof value === 'undefined'}
function emptyArray (v) {return !v.length}
function emptyObject (v) {return !Object.keys(v).length}
function rgb (r, g, b) {return `rgb(`+r+`,`+g+`,`+b+`)`}
function rgbr (x, y) {return rgb(r(x, y), r(x, y), r(x, y))}

function randint(min, max) {
  if (max == null) {max = min; min = 0}
  min = Math.ceil(min); max = Math.floor(max); return Math.floor(Math.random() * (max - min + 1)) + min; // Fully inclusive
}
function randarray(array) {return array[randint(array.length-1)]}
function randproperty (obj) {
    var keys = Object.keys(obj);
    return obj[keys[keys.length * Math.random() << 0]];
};

function r(x, y) {
  rv = arguments//JSON.stringify(arguments)
  if (rv.length == 0) {
    return Math.random()
  } else if (rv.length == 1) {
    if (isObject(x)) {return randproperty(x)}
    else if (Array.isArray(x)) {return randarray(x)}
    else if (isNumber(x)) {return randint(x)}
    else if (isString(x)) {
      if (/\s/.test(x)) /*any whitespace*/{return randarray(x.split(" "))} else {return randarray(x.split(""))}
    } else {
      print("Umm, this shouldn't happen...")
    }

  } else if (rv.length == 2) {
    return randint(x, y)
  }
} 

/*r() (Random Multitool) - NOT how it works, but how it maybe should work suggestion
0 args: No args: Random float between 0 and 1
1 arg:
Array: Random element out of the array.
Number: Random integer up to that number.
String of one word: Random symbol out of the string.
String with spaces: Random word out of the string.
2 args: Two numbers: Random number between both numbers, inclusive.
​*/


function convCSS(input) { // convert CSS string to an object
  input = input.replace(/;\s*$/, ""); // Ignore the last ;
  let result = {}, attributes = input.split('; ').join(";").split(';');

  for (let i = 0; i < attributes.length; i++) {
      let entry = attributes[i].split(':');
      result[entry.splice(0,1)[0]] = entry.join(':').trim();
  }
  return result
}


originalunitnames = "Pawn, Rook, Bishop, Queen, Knight, Wizard, Ninja, Dragon, Wisp, Militia, Swordsman, Spearman, Shieldsman, Warrior, Legionary, Guardian, Paladin, Pyromancer, Axeman, Berserker, Dryad, Lilith, Banshee, Lich, Skeleton, Archer, Ranger, Spider, FrostMage, Bomber, Fireball, Basilisk, MageTower, PoisonMage, Medusa, Antimage, Enchantress, SoulKeeper, Ghost, Phantasm, Princess, GiantSlime, Slime, MoonFox, Minotaur, Prince, Tiger, Samurai, Phoenix, Behemoth, RoyalGuard, Portal, WindMage, FrostMephit, Penguin, Harpy, Gemini, Valkyrie, LifeStone, Alchemist, Vampire, Demon, Necromancer, Crusader, Comet, Bat, Ghast, HauntedArmor, Summoner, ThunderMage, Lust, Drake, Duelist, Hostage, Fencer, Beacon, Salamander, FireElemental, GravityMage, SoulFlare, Sylph, AirElemental, Aquarius, Greed, Snake, Pikeman, Reaver, Mercenary, Envy, Undine, WaterElemental, Angel, Gnome, EarthElemental, Wrath, Apprentice, Pride, Hoplite, Nexus, Siren, Butterfly, Phalanx, Taurus, Patience, Temperance, Chastity, Dove, StoneMage, Hydromancer, FireMage, ArchBishop, Fortress, Arachnid, Templar, Frog, Toad, Tombstone, NullMage, VoidMage, Gluttony".split(", ")

tokens = "King, Sapling, Tree, BonePile, StonePillar, PhoenixEgg, Sorceress, GeminiTwin, ChaosPortal, Dummy, SuperDummy, MageDummy".split(", ")

let unitnames = originalunitnames.concat(tokens) // thanks JS for not letting me use +

unitnamesbutlowercase = unitnames.map(x => x.toLowerCase())

unitaliases = []

function getindices (x) {
  let positions = [];
  for(var i=0; i<x.length; i++){
    if (x[i].match(/[A-Z]/) != null){
      positions.push(i);
    }
  }
  return positions
}

for (let i = 0; i < unitnames.length; i++) {
  let x = unitnames[i]; let appendix
  if (getindices(x).length >= 2) {
    appendix = (x[getindices(x)[0]] + x[getindices(x)[1]])
  } else {
    appendix = x.slice(0,2)
  }
  if (unitnames.includes(appendix)) {
    print(appendix + " = " + x + " or " + units2[unitnames.indexOf(appendix)])
  }

  unitaliases.push(appendix)
}

print(unitaliases)


bonusreplacements = "P, N, B, R, Q, K, L, G, V, A, D, W, BP, SP, PE, GT, CP, PrQn, FzMp, FireE, ., Awetalehu, SSP, Vam, Pri,".split(", ")
bonusreplacetos = "Pawn, Knight, Bishop, Rook, Queen, King, Legionary, Greed, Valkyrie, Angel, Dryad, Wizard, BonePile, StonePillar, PhoenixEgg, GeminiTwin, ChaosPortal, Princess, FrostMephit, FireElemental, StonePillar, Dummy, Hostage, Vampire, Pride".split(", ") // The "dot" is like, a wall character

function parseName(x, style=false) {
  rv = x.replace(/\+.*?$|\d$/g, "") // Remove the extra bits at the end, to just get the piece name

  rv = rv.charAt(0).toUpperCase() + rv.slice(1) // Uppercase the first letter, might as well.
  if (bonusreplacements.includes(rv)) {rv = bonusreplacetos[bonusreplacements.indexOf(rv)]} // Bonus replacements 
  // Test if this name appears in the list
  if (unitnamesbutlowercase.includes(rv.toLowerCase())) {
    rv = unitnames[unitnamesbutlowercase.indexOf(rv.toLowerCase())]
  }
  if (unitaliases.includes(rv)) {
    rv = unitnames[unitaliases.indexOf(rv)]
  } else if (rv.length == 2 && unitaliases.includes(rv.toUpperCase())) {
    rv = unitnames[unitaliases.indexOf(rv.toUpperCase())]
  }
/*
  if (!unitnames.includes(rv) && !tokens.includes(rv)) { // Doesn't appear in the list of units...
    return style? {"color": "red"}:x
  // Originally this returned nothing, but I think for future-update purposes, this should work
  }
  if (style) { // Return green if it matches
    return {"color": "green"}
  }
*/
  // Time to pull a Yandere Simulator
  if (x.endsWith("+3") || x.endsWith("+++") || x.endsWith("3") || x.endsWith("4")) {return rv + "4"}
  if (x.endsWith("+2") || x.endsWith("++") || x.endsWith("2")) {return rv + "3"}
  if (x.endsWith("+1") || x.endsWith("+") || x.endsWith("1")) {return rv + "2"}
  return rv


}

function parsestate(string, x) {
  return string.replace("(OFF)", "").replace("(ON)", "") + (x == "True" || x == "1" ? "(ON)":"(OFF)")
}
function numify (x) {return parseInt(x, 10)}

function fixnumber(x) { // thx grnd
  x = numify(x)
  return ((x%8)*8 + Math.floor(x/8)).toString()
} 


function trimCommas(x) {
  return x.replace(/(^[,\s]+)|([,\s]+$)/g, '');
}

function flipsign(x) {
  if (x.slice(0, 1) == "-") {
    x = x.slice(1)
  } else {
    x = "-" + x
  }
  return x
}

function removesign(x) {
  if (x.slice(0, 1) == "-") {
    x = x.slice(1)
  }
  return x
}

Vue.component('ceo-component', {
  data: function () {
    return {
      message: "",
      board: Array(64).fill(""),
      display: Array(64).fill(""), // Pure display, should not be modified except for imports
      boardstyle: Array(64).fill({}),
      sides: Array(64).fill("0"), // 64 length
      otherdata: "54,whitename,blackname,2500,2500,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0",
      kingdecay: "0",
      moraledecay: "0",
      bonuswhite: "0",
      bonusblack: "0",
      enchlifestones: "False",
      moraledecaystate: "Morale Decay (OFF)",
      kingdecaystate: "King Decay (OFF)",
      enchlifestonesstate: "Enchanted LifeStones (OFF)",
      importtext: "",
      userpositiondata: "",
      positiondata: "",
      positiondatamessage: "",
      rerenderplease: 0
    }
  },
  methods: {
    importcode: function (unless=false) {
      // Basically we have to do this all in reverse, decode the thing and print it.
      let rv = this.importtext

      if (unless == "Classic") {
        rv = "54,whitename,blackname,2500,2500,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,False,Rook,Pawn,,,,,Pawn,Rook,Knight,Pawn,,,,,Pawn,Knight,Bishop,Pawn,,,,,Pawn,Bishop,Queen,Pawn,,,,,Pawn,Queen,King,Pawn,,,,,Pawn,King,Bishop,Pawn,,,,,Pawn,Bishop,Knight,Pawn,,,,,Pawn,Knight,Rook,Pawn,,,,,Pawn,Rook,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0"
      } else if (unless == "Clear") {
        rv = "54,whitename,blackname,2500,2500,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,False,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0"
      } else if (unless == "Random") {
        let randomunits = []
        let randomsides = []
        for (let i = 0; i <= 63; i++) {
          randomunits.push(r(originalunitnames) + r(["", 2, 3, 4]).toString())
          randomsides.push(r(0,1))
        }
        rv = "54,whitename,blackname,2500,2500,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,False," + randomunits.join(",") + "," + randomsides.join(",")
      } else if (unless == "Chess960") {
        rv = "54,whitename,blackname,2500,2500,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,False,PLACEHOLDER,Pawn,,,,,Pawn,PLACEHOLDER,PLACEHOLDER,Pawn,,,,,Pawn,PLACEHOLDER,PLACEHOLDER,Pawn,,,,,Pawn,PLACEHOLDER,PLACEHOLDER,Pawn,,,,,Pawn,PLACEHOLDER,PLACEHOLDER,Pawn,,,,,Pawn,PLACEHOLDER,PLACEHOLDER,Pawn,,,,,Pawn,PLACEHOLDER,PLACEHOLDER,Pawn,,,,,Pawn,PLACEHOLDER,PLACEHOLDER,Pawn,,,,,Pawn,PLACEHOLDER,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0"
        // Each 'placeholder' will be filled in
        let unitswhite = "Queen, Rook, Rook, Bishop, Bishop, Knight, Knight, King".split(", ")
        
        // For some braindead reason, JavaScript replace = only the *first* replacement. Well I'm taking advantage of that for once.

        while (unitswhite.length != 0) {
          let gen = r(unitswhite.length-1)
          print(gen)
          print(rv)
          rv = rv.replace("PLACEHOLDER", unitswhite[gen])
          rv = rv.replace("PLACEHOLDER", unitswhite[gen])
          unitswhite.splice(gen, 1) // Classic JS, making removing an element a pain in the butt
        }
      
      }
      rv = rv.trim().split(",")
      if (rv.length < 165) {return}

      this.display = Array(64).fill("") // destroy array

      this.otherdata = rv.slice(0, 32).join(",") // First 32 elements are "otherdata"
      this.kingdecay = rv.slice(32, 33).join(",")
      this.moraledecay = rv.slice(33, 34).join(",")
      this.bonuswhite = rv.slice(34, 35).join(",")
      this.bonusblack = rv.slice(35, 36).join(",")
      this.enchlifestones = rv.slice(36, 37).join(",") // Might have a problem with lower/upper casing?
      let tempboard = rv.slice(37, 101)
      let tempsides = rv.slice(101, 165)
      this.positiondata = rv.slice(165).join(",") // Might have a problem with lower/upper casing?
      this.userpositiondata = this.positiondata

      // Yes really I'm doing it this way. It's time to update this.
      // Remember we have to convert the sides data onto the board representation!

      entries = document.getElementsByClassName("ceotableinner")
      for (let i = 0; i < entries.length; i++) {
        let j = numify(fixnumber(i.toString())) // kinda stupid, because "i" is an actual number and not a string this time, but fixnumber works on strings

        if (i == 64)      {entries[i].textContent = this.bonuswhite}
        else if (i == 65) {entries[i].textContent = this.bonusblack}
        else              {
          if (tempboard[j] == "") { // this code is probably unnecessary but i am trying to debug two-way-binding garbage
            this.display[i] = ""
          } else {
            this.display[i] = (tempsides[j] == "1"? "-":"") + tempboard[j].replace("4", "+++").replace("3", "++").replace("2", "+");
          }

          this.board[j] = tempboard[j]; this.sides[j] = tempsides[j]
        }
        // Note that only the display's "i" is legit.
      }
      //this.board = tempboard.join(",")
      //this.sides = tempsides.join(",")
      // ^^ THIS COMMENTED OUT CODE CAUSES THE BOARD TO COMPLETELY UNBIND
      // YAY IMPORTS WORK NOW
      this.moraledecaystate = parsestate(this.moraledecaystate, this.moraledecay)
      this.kingdecaystate = parsestate(this.kingdecaystate, this.kingdecay)
      this.enchlifestonesstate = parsestate(this.enchlifestonesstate, this.enchlifestones)

      this.rerenderplease = this.rerenderplease? 0:1 // https://michaelnthiessen.com/force-re-render/
      // Thanks a lot Vue for this very easy to figure out RERENDERING solution stupid stupid stupid stupid stupid stupid stupid
      // Also, I like how you can tell this is a hack, because the console will screech about duplicate keys when you try to do this

      this.checkpositiondata()
      this.upd()

    },
    upd: function () {
      this.message = trimCommas([trimCommas(this.otherdata), this.kingdecay, this.moraledecay, this.bonuswhite, this.bonusblack, this.enchlifestones, this.board, this.sides, this.positiondata].join(","))

    },
    macro: function (x) {
      if (x == "Board Upside Down") {
        let bogusboard = []
        let bogussides = []
        let bogusdisplay = []
        this.board = this.board.map((x,index) => { // If I used only one loop, it would overwrite itself halfway through.
          index++;
          bogusdisplay.push(this.display[63-index+1])
          bogusboard.push(this.board[63-index+1])
          bogussides.push(this.sides[63-index+1])
          return x
        })

        for (let i = 0; i < this.board.length; i++) {
          this.display[i] = bogusdisplay[i];
          this.board[i] = bogusboard[i];
          this.sides[i] = bogussides[i];
        }

      } else if (x == "Flip Team Colors") {
        this.sides = this.sides.map((x,index) => {
          index++;
          let fixedindex = fixnumber(index-1) // display numbers are messed up
          if (this.board[index-1] != "") { // still need to rely on board numbers here though
            this.display[fixedindex] = flipsign(this.display[fixedindex])
          }
          return (x==0) && (this.board[index-1] != "")? 1:0
        }) // index -1, because it would start at 1 otherwise
        
      } else if (x == "Bottom 4 Rows White, Top 4 Rows Black") {
        this.sides = this.sides.map((x,index) => {
          index++;
          let fixedindex = fixnumber(index-1) // display numbers are messed up
          if (this.display[fixedindex] != "") {
            if (fixedindex > 31) {
              this.display[fixedindex] = removesign(this.display[fixedindex])
            } else {
              this.display[fixedindex] = "-" + removesign(this.display[fixedindex])
            }
          }
          return (x==0) && (fixedindex > 31)? 0:1
        }) // index -1, because it would start at 1 otherwise
        
        
      } else if (x == "Bottom 4 Rows Black, Top 4 Rows White") {
        this.sides = this.sides.map((x,index) => {
          index++;
          let fixedindex = fixnumber(index-1) // display numbers are messed up
          if (this.display[fixedindex] != "") {
            if (fixedindex > 31) {
              this.display[fixedindex] = "-" + removesign(this.display[fixedindex])
            } else {
              this.display[fixedindex] = removesign(this.display[fixedindex])
            }
          }
          return (x==0) && (fixedindex > 31)? 1:0
        }) // index -1, because it would start at 1 otherwise
        
      }
      this.rerenderplease = this.rerenderplease? 0:1
      this.upd()
    },
    flip: function (x, y="") {
      if (x == "moraledecay") {
        this.moraledecay = this.moraledecay == "1"? "0" : "1"
        this.moraledecaystate = parsestate(this.moraledecaystate, this.moraledecay)
      } else if (x == "kingdecay") {
        this.kingdecay = this.kingdecay == "1"? "0" : "1"
        this.kingdecaystate = parsestate(this.kingdecaystate, this.kingdecay)
      } else if (x == "enchlifestones") {
        this.enchlifestones = this.enchlifestones == "False"||this.enchlifestones == "0"? "True" : "False"
        this.enchlifestonesstate = parsestate(this.enchlifestonesstate, this.enchlifestones)
      }
      this.upd()
    },
    updateText: function (event, number) {
      //let rv = event.target.textContent.trim() // old code when it was using contenteditable divs
      let rv = this.display[number]
      if (number < 0) {
        if (number == -1) { // White extra morale
          this.bonuswhite = rv
        } else if (number == -2) { // Black extra morale
          this.bonusblack = rv
        } // Not gonna bother checking if it's a number
        this.upd()

        return
      }
      number = fixnumber(number)
      if (rv.charAt(0) == "-") {
        rv = rv.slice(1)
        this.sides[number] = "1" // That means black
      } else {
        this.sides[number] = "0"
      }
      // At this point rv is the unit's name.
      this.board[number] = parseName(rv)
      this.boardstyle[number] = parseName(rv, true)
      this.upd()
    },
    checkpositiondata: function () {
      let actions = trimCommas(this.userpositiondata).replace(", ", ",").split(",")
      this.positiondata = actions
      let numbers = actions.length // Pair of numbers is a half-turn



      let OPENPANDORASBOX = false // I QUIT WORKING ON THIS CODE!
      if (OPENPANDORASBOX) {
      // Simulate a really low quality mockup of the game where only moves/attacks/swaps exist.

      function chunk(array, chunkSize) {
        return Array(Math.ceil(array.length/chunkSize)).fill().map(function(_,i){
            return array.slice(i*chunkSize,i*chunkSize+chunkSize);
        });
      } // https://ourcodeworld.com/articles/read/278/how-to-split-an-array-into-chunks-of-the-same-size-easily-in-javascript

      let log = []
      let boardsimulation = chunk([...this.board], 8)
      boardsimulation = boardsimulation.map((_, colIndex) => boardsimulation.map(row => row[colIndex])).flat(); // THANKS
      let sidessimulation = chunk([...this.sides], 8)
      sidessimulation = sidessimulation.map((_, colIndex) => sidessimulation.map(row => row[colIndex])).flat(); // GRAND

      // You see, the board numbers only correspond to the positions in the action log, which go left to right, then top to bottom. But it is not that way in the output. It starts columns first for whatever reason.

      let whichcolorshoulditbe = "0" // 0 = White
      // Gotta love all the added spaghetti because everything's a string, so you can't do simple boolean comparisons!

      // So, we made a new copy of the board and sides so we could modify it in the middle of this log, to simulate the game's moves
      // boardsimulation[actions[i]] = the piece on the board of the first number
      // boardsimulation[actions[i+1]] = the piece on the board of the second number
      // sidessimulation[actions[i]] = if the first number's piece is white or black
      // sidessimulation[actions[i+1]] = if the second number's piece is white or black

      for (let i = 0; i < actions.length; i+=2) {
        if (sidessimulation[actions[i]] != whichcolorshoulditbe && whichcolorshoulditbe != -1) {log.push("Note: " + sidessimulation[actions[i]]=="0"?"White":"Black" + " played this turn but it should've been the other player's turn."); whichcolorshoulditbe = -1} else {whichcolorshoulditbe = whichcolorshoulditbe == "0"?"1" : "0"}
        if (boardsimulation[actions[i]] == "") {log.push(`Note: [${actions[i]}] is an empty square, but you tried to move it somewhere?`); continue}

        let movedattackedorswapped = boardsimulation[actions[i+1]] == ""? "moved to" : sidessimulation[actions[i]] != sidessimulation[actions[i+1]]? "attacked" : "swapped" // If no unit on the 2nd number, it's moved. If sides don't match / match, it's an attack / swap.

        let targetedpiece = `${sidessimulation[actions[i+1]]=="0"?"White":"Black"} ${boardsimulation[actions[i+1]]}` // We don't display this if it turned out it was a move.
        log.push(`[${actions[i]}] ${sidessimulation[actions[i]]=="0"?"White":"Black"} ${boardsimulation[actions[i]]} ${movedattackedorswapped} [${actions[i+1]}] ${movedattackedorswapped == "moved to"?"":targetedpiece}`)

        if (movedattackedorswapped == "moved to") {
          boardsimulation[actions[i]]
        }
      }

      if (numbers % 2 == 1) {log.push("<b>Error:</b> Your recorded moves have an error, they're not paired!")}
       //else {this.positiondatamessage = "(" + numbers/4 + " turn game)"}

      this.positiondatamessage = log.join("<br>")
      if (numbers/2 < 1) {this.positiondatamessage = ""}
      }

      // The above code was supposed to represent an action log but I decided screw it. Too much work and useless near the end.

      // If I cared enough I would check if the numbers are between 0-63
      print(actions)
      if (actions == "") {this.positiondatamessage = ""}
      else if (numbers % 2 == 1) {this.positiondatamessage = (`You have <b style="color: red">${numbers}</b> position${numbers==1?"":"s"} recorded, you need to add another number that represents the target location.`)}
      else {this.positiondatamessage = `You have <b>${numbers}</b> positions recorded, representing ${numbers/2} half-turns in a ${numbers/4} turn game.`}
      this.upd()
    },
    togglecheckerboard: function () { 
      let element = document.getElementById("board");
      element.classList.toggle("checkered");
    }
  },
  created: function () {
    this.upd()
  }, /* add mounted later */
  computed: {
  
  }, /* Tried some garbage with  v-bind:style="this.boardstyle[0]" to try to show if the unit name was invalid... screw that. Not implemented.*/
  template: `
  <div>
  <table id="board">
    <tr>
        <td class="ceotableouter"><span class="ceotablemark">0</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 0)" v-model="display[0]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">1</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 1)" v-model="display[1]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">2</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 2)" v-model="display[2]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">3</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 3)" v-model="display[3]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">4</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 4)" v-model="display[4]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">5</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 5)" v-model="display[5]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">6</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 6)" v-model="display[6]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">7</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 7)" v-model="display[7]"></textarea></td>
    </tr>
    <tr>
        <td class="ceotableouter"><span class="ceotablemark">8</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 8)" v-model="display[8]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">9</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 9)" v-model="display[9]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">10</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 10)" v-model="display[10]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">11</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 11)" v-model="display[11]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">12</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 12)" v-model="display[12]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">13</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 13)" v-model="display[13]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">14</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 14)" v-model="display[14]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">15</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 15)" v-model="display[15]"></textarea></td>
    </tr>
    <tr>
        <td class="ceotableouter"><span class="ceotablemark">16</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 16)" v-model="display[16]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">17</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 17)" v-model="display[17]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">18</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 18)" v-model="display[18]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">19</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 19)" v-model="display[19]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">20</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 20)" v-model="display[20]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">21</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 21)" v-model="display[21]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">22</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 22)" v-model="display[22]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">23</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 23)" v-model="display[23]"></textarea></td>
    </tr>
    <tr>
        <td class="ceotableouter"><span class="ceotablemark">24</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 24)" v-model="display[24]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">25</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 25)" v-model="display[25]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">26</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 26)" v-model="display[26]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">27</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 27)" v-model="display[27]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">28</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 28)" v-model="display[28]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">29</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 29)" v-model="display[29]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">30</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 30)" v-model="display[30]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">31</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 31)" v-model="display[31]"></textarea></td>
    </tr>
    <tr>
        <td class="ceotableouter"><span class="ceotablemark">32</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 32)" v-model="display[32]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">33</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 33)" v-model="display[33]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">34</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 34)" v-model="display[34]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">35</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 35)" v-model="display[35]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">36</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 36)" v-model="display[36]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">37</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 37)" v-model="display[37]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">38</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 38)" v-model="display[38]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">39</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 39)" v-model="display[39]"></textarea></td>
    </tr>
    <tr>
        <td class="ceotableouter"><span class="ceotablemark">40</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 40)" v-model="display[40]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">41</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 41)" v-model="display[41]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">42</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 42)" v-model="display[42]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">43</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 43)" v-model="display[43]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">44</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 44)" v-model="display[44]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">45</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 45)" v-model="display[45]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">46</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 46)" v-model="display[46]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">47</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 47)" v-model="display[47]"></textarea></td>
    </tr>
    <tr>
        <td class="ceotableouter"><span class="ceotablemark">48</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 48)" v-model="display[48]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">49</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 49)" v-model="display[49]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">50</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 50)" v-model="display[50]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">51</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 51)" v-model="display[51]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">52</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 52)" v-model="display[52]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">53</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 53)" v-model="display[53]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">54</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 54)" v-model="display[54]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">55</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 55)" v-model="display[55]"></textarea></td>
    </tr>
    <tr>
        <td class="ceotableouter"><span class="ceotablemark">56</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 56)" v-model="display[56]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">57</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 57)" v-model="display[57]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">58</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 58)" v-model="display[58]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">59</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 59)" v-model="display[59]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">60</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 60)" v-model="display[60]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">61</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 61)" v-model="display[61]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">62</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 62)" v-model="display[62]"></textarea></td>
        <td class="ceotableouter"><span class="ceotablemark">63</span><textarea contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 63)" v-model="display[63]"></textarea></td>
    </tr>
</table>
<div style="margin-left: auto; margin-right: auto; display: block; text-align: center">
Extra morale for White: <div contenteditable="true" spellcheck="false" class="ceotableinner" style="padding: 0px 6px; display: inline" @input="updateText($event, -1)">0</div>, for Black: <div contenteditable="true" spellcheck="false" class="ceotableinner" style="padding: 0px 6px; display: inline" @input="updateText($event, -2)">0</div>

<button v-on:click="flip('moraledecay')" :key="rerenderplease">{{moraledecaystate}}</button>
<button v-on:click="flip('kingdecay')" :key="rerenderplease">{{kingdecaystate}}</button>
<button v-on:click="flip('enchlifestones')" :key="rerenderplease">{{enchlifestonesstate}}</button>

<br>Other data: <textarea v-model="otherdata" @input="upd()" style="height: 25px"></textarea> (don't touch if you don't know what you're doing)
  </div>
<hr>
<span class="c1-2" style="font-size: 78%; position: absolute; color: white; text-rendering: optimizeLegibility; white-space: break-spaces; word-wrap: break-word; width: 45%; line-height: 15px; height: 50%; user-select: all">{{message}}</span>
<div class="c2-2" style="float: right"><strong>Quickfire Tutorial</strong>: The top grid is the chessboard, which takes piece names. Examples of what you get, <span style="color: cyan">cyan is highlighted to show a specific feature</span>: <br>
• <strong>Aquarius<span style="color: cyan">3</span></strong> = Aquarius<span style="color: cyan">+++</span>.<br>
• <strong><span style="color: cyan">Aq</span>+2</strong> = <strong><span style="color: cyan">Aq</span></strong>uarius++.<br>
• <strong><span style="color: cyan">EE</span></strong> = <strong><span style="color: cyan">E</span></strong>arth<strong><span style="color: cyan">E</span></strong>lemental, base.<br>
• Every piece has an abbreviated version by just using the first two letters of the name, <strong>except for the ones with two capital letters like EarthElemental</strong>, which use the capital letters instead. Not all shorthands work because some pieces have the same shorthand.<br>
• <strong><span style="color: cyan">-</span>King</strong> = King, but <strong><span style="color: cyan">on Black's side</span>. Putting a minus sign before the name makes it Black's piece.</strong>

<br><hr>

This site has no saving. After you're done making your position, copy the code (on the left side) and save it somewhere.<br>
You can use this <b>Import Tool</b> to put replay codes into the UI:<br>
<textarea v-model="importtext" style="height: 25px"></textarea>
<button v-on:click="importcode()">Import Replay Code</button>
<hr>
<b>Action Log</b><br>
These position codes can also store a replay of actions done on the board, stored as numbers that represents each square of the 8x8 chessboard, from 0 to 63 (shown on the grid above). The numbers come in pairs, the first is the piece that was used, and the second is where you targeted it.<br>
Ex: If you use the Classic Chess template, "<b>51,35,1,18</b>" represents two moves:<br>
* "<b>51,35</b>" is White moving their d2 Pawn (on "<b>51</b>") to d4 (on "<b>35</b>").<br>
* "<b>1,18</b>" is Black moving their b8 Knight (on "<b>1</b>") to c6 (on "<b>18</b>").<br>
This system can describe any move, attack, or ability.
<br>


<br>



<div style="display: flex">

<div class="c1-2">
If you have actions, put them here:<br><textarea v-model="userpositiondata" @input="checkpositiondata()" style="height: 25px"></textarea>
<div style="height: 100px"></div>
</div>

<div class="c2-2" style="float: right">
<span v-html="positiondatamessage"></span>

</div>

</div>

<hr>
Extra Tools:<br>
<button v-on:click="macro('Board Upside Down')">Board Upside Down</button>
<button v-on:click="macro('Flip Team Colors')">Flip Team Colors</button>
<button v-on:click="macro('Bottom 4 Rows White, Top 4 Rows Black')">Bottom 4 Rows White, Top 4 Rows Black</button>
<button v-on:click="macro('Bottom 4 Rows Black, Top 4 Rows White')">Bottom 4 Rows Black, Top 4 Rows White</button>
<button v-on:click="togglecheckerboard()">Toggle Checkered Board Colors</button>
<br>These buttons replace the entire board with a template. You can't undo these!<br>
<button v-on:click="importcode('Classic')">Use Template: Classic Chess</button>
<button v-on:click="importcode('Chess960')">Use Template: Chess960</button>
<button v-on:click="importcode('Random')">Use Template: Fill Board With Nonsense</button>
<button v-on:click="importcode('Clear')">Clear Entire Board</button>
<div style="height: 20px"></div>


</div>

</div></div>
  </div>


</div>`
})
window.Event = new Vue()
var game = new Vue({
      el: '#content',
      data: {}
})
/*

[name]: [thing1] [beendone], [nointerest], [giveita]
[Vizier]: [teleporting ally king] [is something that has been done], [this isnt very thought provoking], [i give it a 2/10.]


<div class="c2-2" style="float: right">
  <table style="float: none; margin: 0 auto">
    <tr>
        <td class="ceosmallertable">0</td>
        <td class="ceosmallertable">1</td>
        <td class="ceosmallertable">2</td>
        <td class="ceosmallertable">3</td>
        <td class="ceosmallertable">4</td>
        <td class="ceosmallertable">5</td>
        <td class="ceosmallertable">6</td>
        <td class="ceosmallertable">7</td>
    </tr>
    <tr>
        <td class="ceosmallertable">8</td>
        <td class="ceosmallertable">9</td>
        <td class="ceosmallertable">10</td>
        <td class="ceosmallertable">11</td>
        <td class="ceosmallertable">12</td>
        <td class="ceosmallertable">13</td>
        <td class="ceosmallertable">14</td>
        <td class="ceosmallertable">15</td>
    </tr>
    <tr>
        <td class="ceosmallertable">16</td>
        <td class="ceosmallertable">17</td>
        <td class="ceosmallertable">18</td>
        <td class="ceosmallertable">19</td>
        <td class="ceosmallertable">20</td>
        <td class="ceosmallertable">21</td>
        <td class="ceosmallertable">22</td>
        <td class="ceosmallertable">23</td>
    </tr>
    <tr>
        <td class="ceosmallertable">24</td>
        <td class="ceosmallertable">25</td>
        <td class="ceosmallertable">26</td>
        <td class="ceosmallertable">27</td>
        <td class="ceosmallertable">28</td>
        <td class="ceosmallertable">29</td>
        <td class="ceosmallertable">30</td>
        <td class="ceosmallertable">31</td>
    </tr>
    <tr>
        <td class="ceosmallertable">32</td>
        <td class="ceosmallertable">33</td>
        <td class="ceosmallertable">34</td>
        <td class="ceosmallertable">35</td>
        <td class="ceosmallertable">36</td>
        <td class="ceosmallertable">37</td>
        <td class="ceosmallertable">38</td>
        <td class="ceosmallertable">39</td>
    </tr>
    <tr>
        <td class="ceosmallertable">40</td>
        <td class="ceosmallertable">41</td>
        <td class="ceosmallertable">42</td>
        <td class="ceosmallertable">43</td>
        <td class="ceosmallertable">44</td>
        <td class="ceosmallertable">45</td>
        <td class="ceosmallertable">46</td>
        <td class="ceosmallertable">47</td>
    </tr>
    <tr>
        <td class="ceosmallertable">48</td>
        <td class="ceosmallertable">49</td>
        <td class="ceosmallertable">50</td>
        <td class="ceosmallertable">51</td>
        <td class="ceosmallertable">52</td>
        <td class="ceosmallertable">53</td>
        <td class="ceosmallertable">54</td>
        <td class="ceosmallertable">55</td>
    </tr>
    <tr>
        <td class="ceosmallertable">56</td>
        <td class="ceosmallertable">57</td>
        <td class="ceosmallertable">58</td>
        <td class="ceosmallertable">59</td>
        <td class="ceosmallertable">60</td>
        <td class="ceosmallertable">61</td>
        <td class="ceosmallertable">62</td>
        <td class="ceosmallertable">63</td>
    </tr>
</table>
*/

/* TODO: maybe flip board, mirror board, copypaste into multiple slots, replay code thing
also flip colors of white/black

*/











































