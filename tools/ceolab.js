console.log("Script loaded!")

/* 
<style>
  .ceolab {width: 100%; height: 100%; text-align: center; font-weight: bold; background: rgba(255, 255, 255, 0.25); color: #222; overflow-y: auto}
    }

</style> */

var javascriptsucks = true;
javascriptsucks = 0;
function l(x) {if (isUndefined(x)) {console.log("ping"); return}; console.log(x)}
function log(x) {console.log(x)}
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
function randarray(array) {array[randint(array.length-1)]}
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
} // random element out of array. should probably have options to return index/multiple objects, or not return already returned things.

/*r() (Random Multitool) - NOT how it works, but how it maybe should work suggestion
0 args: No args: Random float between 0 and 1
1 arg:
Array: Random element out of the array.
Number: Random integer up to that number.
String of one word: Random symbol out of the string.
String with spaces: Random word out of the string.
2 args: Two numbers: Random number between both numbers, inclusive.
​*/


function convCSS(input) {
  input = input.replace(/;\s*$/, ""); // Ignore the last ;
  let result = {}, attributes = input.split('; ').join(";").split(';');

  for (let i = 0; i < attributes.length; i++) {
      let entry = attributes[i].split(':');
      result[entry.splice(0,1)[0]] = entry.join(':').trim();
  }
  return result
}

function parseUnitName (x) {
  // Is the unit name in the list of units?
  // If not, take the first two letters.

  unitnames.includes(x)


  // Returns an array with a True/False value (if unit name found) and the unit name (error message if unfound)
}

versionnumber = "54"
firstrow = "whitename,blackname,2500,2500,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0"

unitnames = "Pawn, Rook, Bishop, Queen, Knight, Wizard, Ninja, Dragon, Wisp, Militia, Swordsman, Spearman, Shieldsman, Warrior, Legionary, Guardian, Paladin, Pyromancer, Axeman, Berserker, Dryad, Lilith, Banshee, Lich, Skeleton, Archer, Ranger, Spider, FrostMage, Fireball, Basilisk, MageTower, PoisonMage, Medusa, Antimage, Enchantress, SoulKeeper, Ghost, Phantasm, Princess, GiantSlime, Slime, MoonFox, Minotaur, Prince, Tiger, Samurai, Phoenix, Behemoth, RoyalGuard, Portal, WindMage, FrostMephit, Penguin, Harpy, Gemini, Valkyrie, LifeStone, Alchemist, Vampire, Demon, Necromancer, Crusader, Comet, Bat, Ghast, HauntedArmor, Summoner, ThunderMage, Lust, Drake, Duelist, Hostage, Fencer, Beacon, Salamander, FireElemental, GravityMage, SoulFlare, Sylph, AirElemental, Aquarius, Greed, Snake, Pikeman, Reaver, Mercenary, Envy, Undine, WaterElemental, Angel, Gnome, EarthElemental, Wrath, Apprentice, Pride, Hoplite, Nexus, Siren, Butterfly, Phalanx, Taurus, Patience, Temperance, Chastity, Dove, StoneMage, Hydromancer, FireMage, ArchBishop, Fortress, Arachnid, Templar, Frog, Toad, Tombstone, NullMage, VoidMage, Gluttony".split(", ")

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


tokens = "King, Sapling, Tree, BonePile, StonePillar, PhoenixEgg, PhoenixEgg+, PhoenixEgg++, PhoenixEgg+++, Sorceress, GeminiTwin, GeminiTwin+, GeminiTwin++, GeminiTwin+++, ChaosPortal, Dummy, SuperDummy, MageDummy".split(", ")

bonusreplacements = "P, N, B, R, Q, K, BP, SP, PE, GT, CP, PrQn, FzMp".split(", ")
bonusreplacetos = "Pawn, Knight, Bishop, Rook, Queen, King, BonePile, StonePillar, PhoenixEgg, GeminiTwin, ChaosPortal, Princess, FrostMephit".split(", ")

function parseName(x, style=false) {
  if (bonusreplacements.includes(x)) {x = bonusreplacetos[bonusreplacements.indexOf(x)]} // Bonus replacements 
  rv = x.replace(/\+.*?$|\d$/g, "") // Remove the extra bits at the end, to just get the piece name

  rv = rv.charAt(0).toUpperCase() + rv.slice(1) // Uppercase the first letter, might as well.
  // Test if this name appears in the list
  if (unitaliases.includes(rv)) {
    rv = unitnames[unitaliases.indexOf(rv)]
  }

  if (!unitnames.includes(rv) && !tokens.includes(rv)) { // Doesn't appear in the list of units...
    return style? {"color": "red"}:x
  // Originally this returned nothing, but I think for future-update purposes, this should work
  }
  if (style) { // Return green if it matches
    return {"color": "green"}
  }

  // Time to pull a Yandere Simulator
  if (x.endsWith("+3") || x.endsWith("+++") || x.endsWith("3") || x.endsWith("4")) {return rv + "4"}
  if (x.endsWith("+2") || x.endsWith("++") || x.endsWith("2")) {return rv + "3"}
  if (x.endsWith("+1") || x.endsWith("+") || x.endsWith("1")) {return rv + "2"}
  return rv


}

function fliponoff(x) {
  return x.replace("OFF", "0").replace("ON", "OFF").replace("0", "ON") // HACK
}
function numify (x) {return parseInt(x, 10)}

function fixnumber(x) { // Misread the code and that it goes by columns, so...
  x = numify(x)
  return ((x%8)*8 + Math.floor(x/8)).toString()
}


Vue.component('ceolab-component', {
  data: function () {
    return {
      message: "",
      board: Array(64).fill(""),
      boardstyle: Array(64).fill({}),
      sides: Array(64).fill("0"), // 64 length
      kingdecay: "0",
      moraledecay: "0",
      bonuswhite: "0",
      bonusblack: "0",
      enchlifestones: "False",
      moraledecaystate: "Morale Decay (OFF)",
      kingdecaystate: "King Decay (OFF)",
      enchlifestonesstate: "Enchanted LifeStones (OFF)"
    }
  },
  methods: {
    template: function (x) {
      if (x == "Classic") {
        this.updateText({target: {textContent: "Aquarius"}}, 30)
      }
    },
    upd: function () {
      this.message = [versionnumber, firstrow, this.kingdecay, this.moraledecay, this.bonuswhite, this.bonusblack, this.enchlifestones, this.board, this.sides].join(",")

    },
    flip: function (x, y="") {
      if (x == "moraledecay") {
        this.moraledecay = this.moraledecay == "1"? "0" : "1"
        this.moraledecaystate = fliponoff(this.moraledecaystate)
      } else if (x == "kingdecay") {
        this.kingdecay = this.kingdecay == "1"? "0" : "1"
        this.kingdecaystate = fliponoff(this.kingdecaystate)
      } else if (x == "enchlifestones") {
        this.enchlifestones = this.enchlifestones == "False"? "True" : "False"
        this.enchlifestonesstate = fliponoff(this.enchlifestonesstate)
      }
      this.upd()
    },
    updateText: function (event, number) {
      let rv = event.target.textContent.trim()
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
    }
  },
  created: function () {
    this.upd()
  }, /* add mounted later */
  computed: {
  
  }, /* Tried some garbage with  v-bind:style="this.boardstyle[0]" to try to show if the unit name was invalid... screw that. Not implemented.*/
  template: `
  <div>
  <table>
    <tr>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 0)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 1)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 2)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 3)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 4)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 5)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 6)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 7)"></td>
    </tr>
    <tr>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 8)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 9)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 10)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 11)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 12)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 13)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 14)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 15)"></td>
    </tr>
    <tr>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 16)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 17)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 18)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 19)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 20)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 21)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 22)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 23)"></td>
    </tr>
    <tr>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 24)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 25)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 26)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 27)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 28)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 29)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 30)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 31)"></td>
    </tr>
    <tr>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 32)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 33)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 34)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 35)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 36)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 37)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 38)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 39)"></td>
    </tr>
    <tr>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 40)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 41)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 42)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 43)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 44)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 45)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 46)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 47)"></td>
    </tr>
    <tr>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 48)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 59)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 50)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 51)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 52)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 53)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 54)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 55)"></td>
    </tr>
    <tr>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 56)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 57)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 58)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 59)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 60)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 61)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 62)"></td>
        <td contenteditable="true" spellcheck="false" class="ceolab" @input="updateText($event, 63)"></td>
    </tr>
</table>
<div style="margin-left: auto; margin-right: auto; display: block; text-align: center">
Extra morale for White: <div contenteditable="true" spellcheck="false" class="ceolab" style="padding: 0px 6px; display: inline" @input="updateText($event, -1)">0</div>, for black: <div contenteditable="true" spellcheck="false" class="ceolab" style="padding: 0px 6px; display: inline" @input="updateText($event, -2)">0</div>

<button v-on:click="flip('moraledecay')">{{moraledecaystate}}</button>
<button v-on:click="flip('kingdecay')">{{kingdecaystate}}</button>
<button v-on:click="flip('enchlifestones')">{{enchlifestonesstate}}</button>
  </div>
<hr>
<div><strong>Quickfire Tutorial</strong>: The top grid is the board, which takes piece names. Examples of what you get, <span style="color: cyan">cyan is highlighted to show a specific feature</span>: <br>
• <strong>Aquarius<span style="color: cyan">3</span></strong> = Aquarius<span style="color: cyan">+++</span>.<br>
• <strong><span style="color: cyan">Aq</span>+2</strong> = <strong><span style="color: cyan">Aq</span></strong>uarius++ (short for the first two letters; not all shorthands work because some pieces have the same shorthand).<br>
• <strong><span style="color: cyan">EE</span></strong> = <strong><span style="color: cyan">E</span></strong>arth<strong><span style="color: cyan">E</span></strong>lemental, base.<br>
• <strong><span style="color: cyan">-</span>King</strong> = King, but <strong><span style="color: cyan">on Black's side</span>. Putting a minus sign before the name makes it Black's piece.</strong></div>
<hr>
<span style="font-size: 78%; position: absolute; color: white; text-rendering: optimizeLegibility; white-space: break-spaces; word-wrap: break-word; width: 750px; line-height: 15px;">{{message}}</span>
<div style="height: 100px"></div>

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

*/