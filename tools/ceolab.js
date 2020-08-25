console.log("Script loaded!")

/* 
<style>
  .ceotable {width: 100%; height: 100%; text-align: center; font-weight: bold; background: rgba(255, 255, 255, 0.25); color: #222; overflow-y: auto}
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

bonusreplacements = "P, N, B, R, Q, K, BP, SP, PE, GT, CP, PrQn, FzMp, FireE, ., Awetalehu, SSP".split(", ")
bonusreplacetos = "Pawn, Knight, Bishop, Rook, Queen, King, BonePile, StonePillar, PhoenixEgg, GeminiTwin, ChaosPortal, Princess, FrostMephit, FireElemental, StonePillar, Dummy, Hostage".split(", ") // The "dot" is like, a wall character

function parseName(x, style=false) {
  rv = x.replace(/\+.*?$|\d$/g, "") // Remove the extra bits at the end, to just get the piece name

  rv = rv.charAt(0).toUpperCase() + rv.slice(1) // Uppercase the first letter, might as well.
  if (bonusreplacements.includes(rv)) {rv = bonusreplacetos[bonusreplacements.indexOf(rv)]} // Bonus replacements 
  // Test if this name appears in the list
  if (unitaliases.includes(rv)) {
    rv = unitnames[unitaliases.indexOf(rv)]
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

function fixnumber(x) { // Misread the code and that it goes by columns, so...
  x = numify(x)
  return ((x%8)*8 + Math.floor(x/8)).toString()
}

function trimCommas(x) {
  return x.replace(/(^[,\s]+)|([,\s]+$)/g, '');
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
      positiondata: "",
      rerenderplease: 0
    }
  },
  methods: {
    importcode: function (unless=false) {
      // Basically we have to do this all in reverse, decode the thing and print it.
      let rv = this.importtext

      if (unless == "Classic") {
        rv = "54,whitename,blackname,2500,2500,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,False,Rook,Pawn,,,,,Pawn,Rook,Knight,Pawn,,,,,Pawn,Knight,Bishop,Pawn,,,,,Pawn,Bishop,Queen,Pawn,,,,,Pawn,Queen,King,Pawn,,,,,Pawn,King,Bishop,Pawn,,,,,Pawn,Bishop,Knight,Pawn,,,,,Pawn,Knight,Rook,Pawn,,,,,Pawn,Rook,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0"
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

      this.otherdata = rv.slice(0, 32).join(",") // First 32 elements are "otherdata"
      this.kingdecay = rv.slice(32, 33).join(",")
      this.moraledecay = rv.slice(33, 34).join(",")
      this.bonuswhite = rv.slice(34, 35).join(",")
      this.bonusblack = rv.slice(35, 36).join(",")
      this.enchlifestones = rv.slice(36, 37).join(",") // Might have a problem with lower/upper casing?
      let tempboard = rv.slice(37, 101)
      let tempsides = rv.slice(101, 165)
      this.positiondata = rv.slice(165).join(",") // Might have a problem with lower/upper casing?

      // Yes really I'm doing it this way. It's time to update this.
      // Remember we have to convert the sides data onto the board representation!

      entries = document.getElementsByClassName("ceotable")
      for (let i = 0; i < entries.length; i++) {
        let j = numify(fixnumber(i.toString())) // kinda stupid, because "i" is an actual number and not a string this time
        if (i == 64)      {entries[i].textContent = this.bonuswhite}
        else if (i == 65) {entries[i].textContent = this.bonusblack}
        else              {this.display[i] = (tempsides[j] == "1"? "-":"") + tempboard[j].replace("4", "+++").replace("3", "++").replace("2", "+"); this.board[j] = tempboard[j]; this.sides[j] = tempsides[j]}
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


      this.upd()
    },
    upd: function () {
      this.message = [trimCommas(this.otherdata), this.kingdecay, this.moraledecay, this.bonuswhite, this.bonusblack, this.enchlifestones, this.board, this.sides, trimCommas(this.positiondata)].join(",")

    },
    flip: function (x, y="") {
      if (x == "moraledecay") {
        this.moraledecay = this.moraledecay == "1"? "0" : "1"
        this.moraledecaystate = parsestate(this.moraledecaystate, this.moraledecay)
      } else if (x == "kingdecay") {
        this.kingdecay = this.kingdecay == "1"? "0" : "1"
        this.kingdecaystate = parsestate(this.kingdecaystate, this.kingdecay)
      } else if (x == "enchlifestones") {
        this.enchlifestones = this.enchlifestones == "False"? "True" : "False"
        this.enchlifestonesstate = parsestate(this.enchlifestonesstate, this.enchlifestones)
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
        <td class="ceotableouter"><span class="ceotablemark">0</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 0)" v-text="display[0]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">1</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 1)" v-text="display[1]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">2</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 2)" v-text="display[2]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">3</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 3)" v-text="display[3]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">4</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 4)" v-text="display[4]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">5</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 5)" v-text="display[5]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">6</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 6)" v-text="display[6]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">7</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 7)" v-text="display[7]"></span></td>
    </tr>
    <tr>
        <td class="ceotableouter"><span class="ceotablemark">8</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 8)" v-text="display[8]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">9</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 9)" v-text="display[9]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">10</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 10)" v-text="display[10]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">11</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 11)" v-text="display[11]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">12</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 12)" v-text="display[12]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">13</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 13)" v-text="display[13]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">14</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 14)" v-text="display[14]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">15</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 15)" v-text="display[15]"></span></td>
    </tr>
    <tr>
        <td class="ceotableouter"><span class="ceotablemark">16</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 16)" v-text="display[16]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">17</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 17)" v-text="display[17]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">18</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 18)" v-text="display[18]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">19</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 19)" v-text="display[19]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">20</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 20)" v-text="display[20]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">21</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 21)" v-text="display[21]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">22</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 22)" v-text="display[22]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">23</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 23)" v-text="display[23]"></span></td>
    </tr>
    <tr>
        <td class="ceotableouter"><span class="ceotablemark">24</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 24)" v-text="display[24]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">25</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 25)" v-text="display[25]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">26</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 26)" v-text="display[26]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">27</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 27)" v-text="display[27]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">28</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 28)" v-text="display[28]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">29</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 29)" v-text="display[29]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">30</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 30)" v-text="display[30]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">31</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 31)" v-text="display[31]"></span></td>
    </tr>
    <tr>
        <td class="ceotableouter"><span class="ceotablemark">32</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 32)" v-text="display[32]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">33</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 33)" v-text="display[33]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">34</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 34)" v-text="display[34]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">35</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 35)" v-text="display[35]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">36</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 36)" v-text="display[36]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">37</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 37)" v-text="display[37]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">38</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 38)" v-text="display[38]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">39</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 39)" v-text="display[39]"></span></td>
    </tr>
    <tr>
        <td class="ceotableouter"><span class="ceotablemark">40</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 40)" v-text="display[40]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">41</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 41)" v-text="display[41]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">42</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 42)" v-text="display[42]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">43</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 43)" v-text="display[43]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">44</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 44)" v-text="display[44]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">45</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 45)" v-text="display[45]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">46</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 46)" v-text="display[46]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">47</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 47)" v-text="display[47]"></span></td>
    </tr>
    <tr>
        <td class="ceotableouter"><span class="ceotablemark">48</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 48)" v-text="display[48]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">49</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 49)" v-text="display[49]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">50</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 50)" v-text="display[50]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">51</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 51)" v-text="display[51]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">52</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 52)" v-text="display[52]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">53</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 53)" v-text="display[53]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">54</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 54)" v-text="display[54]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">55</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 55)" v-text="display[55]"></span></td>
    </tr>
    <tr>
        <td class="ceotableouter"><span class="ceotablemark">56</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 56)" v-text="display[56]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">57</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 57)" v-text="display[57]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">58</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 58)" v-text="display[58]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">59</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 59)" v-text="display[59]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">60</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 60)" v-text="display[60]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">61</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 61)" v-text="display[61]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">62</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 62)" v-text="display[62]"></span></td>
        <td class="ceotableouter"><span class="ceotablemark">63</span><span contenteditable="true" spellcheck="false" class="ceotableinner" @input="updateText($event, 63)" v-text="display[63]"></span></td>
    </tr>
</table>
<div style="margin-left: auto; margin-right: auto; display: block; text-align: center">
Extra morale for White: <div contenteditable="true" spellcheck="false" class="ceotableinner" style="padding: 0px 6px; display: inline" @input="updateText($event, -1)">0</div>, for Black: <div contenteditable="true" spellcheck="false" class="ceotableinner" style="padding: 0px 6px; display: inline" @input="updateText($event, -2)">0</div>

<button v-on:click="flip('moraledecay')" :key="rerenderplease">{{moraledecaystate}}</button>
<button v-on:click="flip('kingdecay')" :key="rerenderplease">{{kingdecaystate}}</button>
<button v-on:click="flip('enchlifestones')" :key="rerenderplease">{{enchlifestonesstate}}</button>

<br>Other data: <textarea v-model="otherdata" @input="upd()"></textarea> (don't touch if you don't know what you're doing)
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
<textarea v-model="importtext"></textarea>
<button v-on:click="importcode()">Import Replay Code</button>
<hr>
These buttons replace the entire board with a template.
<button v-on:click="importcode('Classic')">Use Template: Classic Chess</button>
<button v-on:click="importcode('Chess960')">Use Template: Chess960</button>
<hr>
<b>Replay Data</b><br>
These position codes also store replay data, stored as additional numbers after the code. The numbers correspond to positions of the chessboard, and come in pairs - each pair represents an action in a turn, where the first number is the piece that was used, and the second number is where you targeted it.

<br>
<br>If you have replay data, you can put it here:<br><textarea v-model="positiondata" @input="upd()"></textarea>



</div>
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