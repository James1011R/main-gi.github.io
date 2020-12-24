console.log("Working!")

var javascriptsucks = true;
javascriptsucks = 0;

var oDoc, sDefTxt;

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

//l(r(`▖▗▘▙▚▛▜▝▞▟`.split("")))

function replacements(x, toTake, toRep) {
  if (toTake.length != toRep.length) {log("ERROR! Replacements done without equal lengths."); log(toTake); log(toRep)}
  for (let i = 0; i < toTake.length; i++) {
    x.replace(toTake[i], toRep[i])
  }
  return x
}

function convCSS(input) {
  input = input.replace(/;\s*$/, ""); // Ignore the last ;
  let result = {}, attributes = input.split('; ').join(";").split(';');

  for (let i = 0; i < attributes.length; i++) {
      let entry = attributes[i].split(':');
      result[entry.splice(0,1)[0]] = entry.join(':').trim();
  }
  return result
}


function initDoc() {
  oDoc = document.getElementById("textBox");
  sDefTxt = oDoc.innerHTML;
  if (document.compForm.switchMode.checked) { setDocMode(true); }
}

function formatDoc(sCmd, sValue) {
  if (validateMode()) { document.execCommand(sCmd, false, sValue); oDoc.focus(); }
}

function validateMode() {
  if (!document.compForm.switchMode.checked) { return true ; }
  alert("Uncheck \"Show HTML\".");
  oDoc.focus();
  return false;
}

function setDocMode(bToSource) {
  var oContent;
  if (bToSource) {
    oContent = document.createTextNode(oDoc.innerHTML);
    oDoc.innerHTML = "";
    var oPre = document.createElement("pre");
    oDoc.contentEditable = false;
    oPre.id = "sourceText";
    oPre.contentEditable = true;
    oPre.appendChild(oContent);
    oDoc.appendChild(oPre);
    document.execCommand("defaultParagraphSeparator", false, "div");
  } else {
    if (document.all) {
      oDoc.innerHTML = oDoc.innerText;
    } else {
      oContent = document.createRange();
      oContent.selectNodeContents(oDoc.firstChild);
      oDoc.innerHTML = oContent.toString();
    }
    oDoc.contentEditable = true;
  }
  oDoc.focus();
}


function numify (x) {return parseInt(x, 10)}
// Each transform is defined by an array containing (facultative) functions or strings used to convert:
// - the chars A-Z (U+41 - U+5A)  \
// - the chars a-z (U+61 - U+7A)  |-- these three transforms are encoded as code point offsets from the original ASCII chars.
// - the chars 0-9 (U+30 - U+39)  /
// - the special chars (among CHINPQRZ0)
// - the ASCII chars except space/DEL (U+21 - U+7E)
// - All Unicode chars
// - ... and an extra option to reverse the string

function screwball (input="", tab) {
	let rv = [];
  if (tab==-1 || input.length == 0) {
    return `<div style="font-size: 75%">
    The <strong>Transforms</strong> tab shows various transformations to the text, including many different "fonts", Zalgo, and randomcase.<hr>Unfortunately, it can be laggy. If you select the "?" tab here before entering your text, the computations won't happen.
    </div>`
  }
  if (tab==1) {
    if (!/[A-Za-z]/.test(input)) {return bold(`There are no letters here.`, 'red')}
    let nonscrew = "abcdefghijklmnopqrstuvwxyz"
    function rot(str, by){ // By N3R4ZZuRR0,  https://codereview.stackexchange.com/questions/132125/rot13-javascript
    return (str+'').replace(/[a-zA-Z]/gi,function(s){
        return String.fromCharCode(s.charCodeAt(0)+(s.toLowerCase()<nonscrew[by]?26-by:-by))
      })
    }
    function atbash(str){ // By N3R4ZZuRR0,  https://codereview.stackexchange.com/questions/132125/rot13-javascript
    return (str+'').replace(/[a-zA-Z]/gi,function(s){
        if (s.charCodeAt(0) >= 65 && s.charCodeAt(0) <= 90) {return String.fromCharCode(-s.charCodeAt(0)+155)}
        else {return String.fromCharCode(-s.charCodeAt(0)+219)} // else: it's lowercase. The numbers added are the range of the ASCII codes to the stuff. A-Z is 65-90, add those for 155. a-z is 97-122, add those for 219.
      })
    }
    function ltn(x) {
      var alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
      return x.toLowerCase().split("").map(x => alphabet.indexOf(x)+1).filter(x => x != 0).join(" ")
    }
    function ntl(x) {
      return x.replace(/(1[0-9]|2[0-6]|0?[1-9])/g, x => String.fromCharCode(96+parseInt(x, 10)).toUpperCase())
    }
    for (var i=25; i >= 0; i--) { // lookie switcheroo
      rv.push(`ROT`+(26-i)+`: `+ rot(input, i))
    }
    let skip2 = ''
    for (var i=0; i < input.length; i+=2) {skip2 += input[i]}
    rv.push(`Skip 2: `+ skip2)
    rv.push(`Atbash: `+ atbash(input))
    rv.push(`Letters To Numbers: `+ ltn(input))
    rv.push(`Numbers To Letters: `+ ntl(input))
    rv.push(`Blackout: `+ (input).replace(/\w/g, "█"))
    return rv.join("<br>")
  }
  if (tab==2) {
    return marked(input)
  }
  if (tab==3) {
    if (input.startsWith("bbb")) {
      input = input.slice(3)
      return input.replace(/ /gi, "　　").replace(/id|ID|vs|VS|ab|AB|a|A|b|B|cl|CL|o|O/gi, function(s){return ":" + s.toLowerCase()!="o"? s.toLowerCase():"o2" + ":"}).replace(/[a-zA-Z]/gi,function(s){return `:regional_indicator_` + s.toLowerCase() + `: `}) // Before doing the regional indicator, see the other possible colored emojos
    } else {
      return input.replace(/ /gi, "　　").replace(/[a-zA-Z]/gi,function(s){return `:regional_indicator_` + s.toLowerCase() + `: `})
    }
  }
(
  // On load, and when the text input is edited
  ex = c => {
  
    // Reset the output paragraph.
    // A non-breaking space is placed before the first transform.
    //o.innerHTML = " ";
    //print(input)
    // Loop on all the transforms, the current transform is called `i`.
    for(i of 
    [
      
      // rot13
      [
        ,         // A-Z
        ,         // a-z
        ,         // 0-9
        ,         // special chars
        c =>      // ASCII
          (c >= 0x41 && c <= 0x5A) ? "NOPQRSTUVWXYZABCDEFGHIJKLM"[c - 65] : // A-Z
          (c >= 0x61 && c <= 0x7a) ? "nopqrstuvwxyzabcdefghijklm"[c - 97] : // a-z
          String.fromCodePoint(c)                                          // Other
      ],
      // spaced out
      [
        ,         // A-Z
        ,         // a-z
        ,         // 0-9
        {" ": '　'},         // special chars
        c => String.fromCodePoint(c) + " "                                          // Other
      ],

      // Fullwidth (U+ff01-U+ff5e ！～)
      [
        ,         // A-Z
        ,         // a-z
        ,         // 0-9
        {" ": '　'},         // other chars
        c => String.fromCodePoint(c + 65248) // ASCII
      ],
      
      // Math bold (U+1d41a-U+1d433 𝐚𝐳 U+1d400-U+1d419 𝐀𝐙 U+1d7ce-U+1d7d7 𝟎𝟗)
      [
        6,        // A-Z
        119737,   // a-z
        120734,   // 0-9
      ],
      
      // Math fraktur (U+1d51e-U+1d537 𝔞𝔷 U+1d504-U+1d51c 𝔄𝔜 + exceptions: CHIRZ U+212d U+210c U+2111 U+211c U+2128 ℭℌℑℜℨ)
      [
        6,        // A-Z
        119997,   // a-z
        ,         // 0-9
        {C:"ℭ",H:"ℌ",R:"ℜ",Z:"ℨ",I:"ℑ"} // special chars: CHRZI
      ],
      
      // Math bold fraktur (U+1d586-U+1d59f 𝖆𝖟 U+1d56c-U+1d585 𝕬𝖅)
      [
        6,        // A-Z
        120101,   // a-z
      ],
      
      // Math bold italic (U+1d482-U+1d49b 𝒂𝒛 U+1d468-U+1d481 𝑨𝒁)
      [
        6,        // A-Z
        119841,   // a-z
      ],
      
      // Math bold script (U+1d4ea-U+1d503 𝓪𝔃 U+1d4d0-U+1d4e9 𝓐𝓩)
      [
        6,        // A-Z
        119945,   // a-z
      ],
      
      // Math double struck (U+1d552-U+1d56b 𝕒𝕫 U+1d538 𝔸 U+1d7d8-U+1d7e1 𝟘𝟡 exceptions: CHNPQRZ U+2102 U+210d U+2115 U+2119 U+211a U+211d U+2124 ℂℍℕℙℚℝℤ)
      [
        6,        // A-Z
        120049,   // a-z
        120744,   // 0-9 
        {C:"ℂ",H:"ℍ",R:"ℝ",Z:"ℤ",N:"ℕ",P:"ℙ",Q:"ℚ"} // special chars: CHRZNPQ
      ],
      
      // Math monospace (U+1d68a-U+1d6a3 𝚊𝚣 U+1d670-U+1d689 𝙰𝚉 U+1d7f6-U+1d7ff 𝟶𝟿)
      [
        6,        // A-Z
        120361,   // a-z
        120774,   // 0-9
      ],
      
      // Math sans (U+1d5ba-U+1d5d3 𝖺𝗓 U+1d5a0-U+1d5b9 𝖠𝖹 U+1d7e2-U+1d7eb 𝟢𝟫)
      [
        6,        // A-Z
        120153,   // a-z
        120754,   // 0-9
      ],
      // Math sans italic (U+1d622-U+1d63b 𝘢𝘻 U+1d608-U+1d621 𝘈𝘡)
      [
        6,        // A-Z
        120257,   // a-z
      ],
      // Math sans bold (U+1d5ee-U+1d607 𝗮𝘇 U+1d5d4-U+1d5ed 𝗔𝗭 U+1d7ec-U+1d7f5 𝟬𝟵)
      [
        6,        // A-Z
        120205,   // a-z
        120764,   // 0-9
      ],

      // Math sans bold italic (U+1d656-U+1d66f 𝙖𝙯 U+1d63c-U+1d655 𝘼𝙕)
      [
        6,        // A-Z
        120309,   // a-z
      ],
      
      // Parenthesized (U+249c-U+24b5 ⒜⒵ U+1f110-U+1f129 🄐🄩 U+2474-U+247c ⑴⑼ 0)
      [
        117908,   // A-Z
        9275,     // a-z
        9283,     // 0-9
        {0: '(0)'} // Special char: 0
      ],
      
      // Regional indicator (U+1f1e6-U+1f1ff 🇦 🇿)
      [
        32,       // A-Z
        127365,   // a-z
      ],
      
      // Strikethrough (U+0336)
      [
        ,         // A-Z
        ,         // a-z
        ,         // 0-9
        ,         // other chars
        ,         // ASCII
        c => String.fromCodePoint(c) + "̶" // Unicode
      ],
      
      // Tilde strikethrough (U+0334)
      [
        ,         // A-Z
        ,         // a-z
        ,         // 0-9
        ,         // other chars
        ,         // ASCII
        c => String.fromCodePoint(c) + "̴" // Unicode
      ],
      
      // Cross hatching (U+0337)
      [
        ,         // A-Z
        ,         // a-z
        ,         // 0-9
        ,         // other chars
        ,         // ASCII
        c => String.fromCodePoint(c) + "̷" // Unicode
      ],
      
      // Underline (U+0332)
      [
        ,         // A-Z
        ,         // a-z
        ,         // 0-9
        ,         // other chars
        ,         // ASCII
        c => String.fromCodePoint(c) + "̲" // Unicode
      ],
      
      // Superscript (ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖ۹ʳˢᵗᵘᵛʷˣʸᶻ ⁰¹²³⁴⁵⁶⁷⁸⁹)
      [
        ,         // A-Z
        ,         // a-z
        ,         // 0-9
        ,         // special chars
        c =>      // ASCII
          (c >= 0x30 && c <= 0x39) ? "⁰¹²³⁴⁵⁶⁷⁸⁹"[c - 48] :                // 0-9
          (c >= 0x41 && c <= 0x5A) ? "ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖ۹ʳˢᵗᵘᵛʷˣʸᶻ"[c - 65] : // A-Z
          (c >= 0x61 && c <= 0x7a) ? "ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖ۹ʳˢᵗᵘᵛʷˣʸᶻ"[c - 97] : // a-z
          String.fromCodePoint(c)                                          // Other
      ],
      // Subscript (ₐᵦ𝒸𝒹ₑ𝒻𝓰ₕᵢⱼₖₗₘₙₒₚᵩᵣₛₜᵤᵥ𝓌ₓᵧ𝓏 ₀₁₂₃₄₅₆₇₈₉)
      [
        ,         // A-Z
        ,         // a-z
        ,         // 0-9
        ,         // special chars
        c =>      // ASCII
          (c >= 0x30 && c <= 0x39) ? "₀₁₂₃₄₅₆₇₈₉"[c - 48] :                // 0-9
          (c >= 0x41 && c <= 0x5A) ? "ₐᵦ𝒸𝒹ₑ𝒻𝓰ₕᵢⱼₖₗₘₙₒₚᵩᵣₛₜᵤᵥ𝓌ₓᵧ𝓏"[c - 65] : // A-Z
          (c >= 0x61 && c <= 0x7a) ? "ₐᵦ𝒸𝒹ₑ𝒻𝓰ₕᵢⱼₖₗₘₙₒₚᵩᵣₛₜᵤᵥ𝓌ₓᵧ𝓏"[c - 97] : // a-z
          String.fromCodePoint(c)                                          // Other
      ],
      // Small Caps (ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ 0123456789)
      [
        ,         // A-Z
        ,         // a-z
        ,         // 0-9
        ,         // special chars
        c =>      // ASCII
          (c >= 0x41 && c <= 0x5A) ? "ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ"[c - 65] : // A-Z
          (c >= 0x61 && c <= 0x7a) ? "ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ"[c - 97] : // a-z
          String.fromCodePoint(c)                                          // Other
      ],
      // Inverted (top-bottom)
      [
        ,                   // A-Z
        ,                   // a-z
        ,                   // 0-9
        ,                   // other chars
        c => [..."¡„#$%⅋,)(*+‘-˙/0⥝ᘔε߈S9⏌86:⸵>=<¿@ɐqɔpǝɟƃɥᵎɾʞןɯuodbɹsʇnʌʍxʎz]\\[^_`ɐqɔpǝɟƃɥᵎɾʞןɯuodbɹsʇnʌʍxʎz}|{~"][c - 33] // ASCII
        ,                   // Unicode
        , 1                 // reverse
      ],
      // Circled (U+24b6-U+24cf ⒶⓏ U+24d0-U+24e9 ⓐⓩ U+2460-U+2468 ①⑨ U+24ea ⓪)
      [
        6,        // A-Z
        9327,     // a-z
        9263,     // 1-9
        {0: '⓪'}  // special char: 0
      ],
      
      // Circled negative (U+1f150-U+1f169 🅐🅩 U+1f150-U+1f169 🅐🅩 U+278a-U+2792 ➊➒ U+24FF ⓿)
      [
        32,       // A-Z
        127215,   // a-z
        10073,    // 1-9
        {0: '⓿'}  // special char: 0
      ],
      
      // Squared (U+1F130-U+1F149 🄰🅉)
      [
        32,       // A-Z
        127183,   // a-z
      ],
      
      // Squared negative (U+1F170-U+U+1F189 🅰🆉)
      [
        32,       // A-Z
        127247,   // a-z
      ],
      /*
      // Zalgo
      [
        ,           // A-Z
        ,           // a-z
        ,           // 0-9
        ,           // other chars
        ,           // ASCII
        c => { b = ""; for(d = 9; d--;) b += String.fromCodePoint(0x300 + Math.random()* 0x6F | 0); return String.fromCodePoint(c) + b } // Unicode
      ],
      */
      //  {"0":"📁︎","1":"📂︎","2":"📄︎","3":"🗏︎","4":"🗐︎","5":"🗄︎","6":"⌛︎","7":"🖮︎","8":"🖰︎","9":"🖲︎","!":"✏︎","\"":"✂︎","#":"✁︎","$":"👓︎","%":"🕭︎","&":"🕮︎","'":"🕯︎","(":"🕿︎",")":"✆︎","*":"🖂︎","+":"🖃︎",",":"📪︎","-":"📫︎",".":"📬︎","/":"📭︎",":":"🖳︎",";":"🖴︎","<":"🖫︎","=":"🖬︎",">":"✇︎","?":"✍︎","A":"✌︎","B":"👌︎","C":"👍︎","D":"👎︎","E":"☜︎","F":"☞︎","G":"☝︎","H":"☟︎","I":"✋︎","J":"☺︎","K":"😐︎","L":"☹︎","M":"💣︎","N":"☠︎","O":"⚐︎","P":"🏱︎","Q":"✈︎","R":"☼︎","S":"💧︎","T":"❄︎","U":"🕆︎","V":"✞︎","W":"🕈︎","X":"✠︎","Y":"✡︎","Z":"☪︎","[":"☯︎","\\":"ॐ︎","]":"☸︎","^":"♈︎","_":"♉︎","`":"♊︎","a":"♋︎","b":"♌︎","c":"♍︎","d":"♎︎","e":"♏︎","f":"♐︎","g":"♑︎","h":"♒︎","i":"♓︎","j":"🙰","k":"🙵","l":"●︎","m":"❍︎","n":"■︎","o":"□︎","p":"◻︎","q":"❑︎","r":"❒︎","s":"⬧︎","t":"⧫︎","u":"◆︎","v":"❖︎","w":"⬥︎","x":"⌧︎","y":"⍓︎","z":"⌘︎","{":"❀︎","|":"✿︎","}":"❝︎","~":"❞︎","":"▯︎","€":"⓪︎","":"①︎","‚":"②︎","ƒ":"③︎","„":"④︎","…":"⑤︎","†":"⑥︎","‡":"⑦︎","ˆ":"⑧︎","‰":"⑨︎","Š":"⑩︎","‹":"⓿︎","Œ":"❶︎","":"❷︎","Ž":"❸︎","":"❹︎","":"❺︎","‘":"❻︎","’":"❼︎","“":"❽︎","”":"❾︎","•":"❿︎","–":"◻︎","—":"◻︎","˜":"◻︎","™":"◻︎","š":"◻︎","›":"◻︎","œ":"◻︎","":"◻︎","ž":"·︎","Ÿ":"•︎","¡":"○︎","¢":"⭕︎","£":"◻︎","¤":"◉︎","¥":"◎︎","¦":"◻︎","§":"▪︎","¨":"◻︎","©":"◻︎","ª":"✦︎","«":"★︎","¬":"✶︎","®":"✹︎","¯":"✵︎","°":"◻︎","±":"⌖︎","²":"⟡︎","³":"⌑︎","´":"◻︎","µ":"✪︎","¶":"✰︎","·":"🕐︎","¸":"🕑︎","¹":"🕒︎","º":"🕓︎","»":"🕔︎","¼":"🕕︎","½":"🕖︎","¾":"🕗︎","¿":"🕘︎","À":"🕙︎","Á":"🕚︎","Â":"🕛︎","Ã":"◻︎","Ä":"◻︎","Å":"◻︎","Æ":"◻︎","Ç":"◻︎","È":"◻︎","É":"◻︎","Ê":"◻︎","Ë":"◻︎","Ì":"◻︎","Í":"◻︎","Î":"◻︎","Ï":"◻︎","Ð":"◻︎","Ñ":"◻︎","Ò":"◻︎","Ó":"◻︎","Ô":"◻︎","Õ":"⌫︎","Ö":"⌦︎","×":"◻︎","Ø":"➢︎","Ù":"◻︎","Ú":"◻︎","Û":"◻︎","Ü":"➲︎","Ý":"◻︎","Þ":"◻︎","ß":"◻︎","à":"◻︎","á":"◻︎","â":"◻︎","ã":"◻︎","ä":"◻︎","å":"◻︎","æ":"◻︎","ç":"◻︎","è":"➔︎","é":"◻︎","ê":"◻︎","ë":"◻︎","ì":"◻︎","í":"◻︎","î":"◻︎","ï":"⇦︎","ð":"⇨︎","ñ":"⇧︎","ò":"⇩︎","ó":"⬄︎","ô":"⇳︎","õ":"⬀︎","ö":"⬁︎","÷":"⬃︎","ø":"⬂︎","ù":"▭︎","ú":"▫︎","û":"✗︎","ü":"✓︎","ý":"☒︎","þ":"☑︎","ÿ":"◻︎"};

      // Wingding
    ]){

      // Reset the result of the current transform, called `r`.
      r = "";
      
      // Loop on all the glyphs of the input, the char is stored in `c`.
      // NB: the "..." operator was buggy on Chrome 71, so I waited the second month of the compo to submit it, hoping that enough people updated to Chrome 72.
      for(c of v = [...input]){
        
        // The char's code point is saved into `p`.
        p = c.codePointAt();
        
        // First, replace the special chars (if the transform contains a special char that matches `c`).
        if(i[3] && i[3][c]) r += i[3][c];
        
        // Then, replace the chars 0-9 (if the transform contains a code point offset for these chars).
        else if(p > 0x30 - 1 && p < 0x39 + 1 && i[2]) r += String.fromCodePoint(p + i[2]);

        // Then, replace the chars A-Z (if the transform contains a code point offset for these chars).
        // To save bytes, the A-Z chars offset is not stored directly, the difference with the a-z chars offset is stored instead.
        // This difference is generally 6 or 32, so RegPack will compress these numbers better than raw offsets.
        else if(p > 0x41 - 1 && p < 0x5A + 1 && i[0]) r += String.fromCodePoint(p + i[1]+i[0]);
        
        // Then, replace the chars a-z (if the transform contains a code point offset for these chars).
        else if(p > 0x61 - 1 && p < 0x7a + 1 && i[1]) r += String.fromCodePoint(p + i[1]);
        
        // Then replace the ASCII chars (if the transform contains a function to transform them).
        else if(p > 0x21 - 1 && p < 0x7e + 1 && i[4]) r += i[4](p);

        // Then replace all the Unicode chars (if the transform contains a function to transform them).
        else if(i[5]) r += i[5](p);
        
        // If a char has no transform available, output it unchanged.
        else r += c;
      }
      
      // If the transform enables the "reverse" option, the string is reversed and a line break is added.
      if(i[6]) r = [...r].reverse().join("") + "<br>";
      if (input == r) {continue} // Don't put it in if it's the same
      // The transformed string output is added to the output paragraph.
      // A non-breaking space is added before the next transform.
      rv.push(r+"<br>")
    }
  }
)()
if (rv.length >= 2) {
altercase = (array) => array.map((a) => a.length == 2? a[0].toLowerCase() + a[1].toUpperCase() : a[0])
rv.push("<br>" + altercase(input.match(/.{1,2}/g)).join(""))}

return rv.join("")
}
// this code ENTIRELY RIPPED FROM https://js1k.com/2019-x/details/4104 by xem
 // http://www.nogray.com/api/math/choose.php
function factorial(x){
    x = parseInt(x, 10);
    if (isNaN(x)) return 1;
    if (x <= 0) return 1;
    if (x > 170) return Infinity;
    var y = 1;
    for (var i = x; i>0; i--){
        y *= i;
    }
    return y;
}
function choose(n, k){
    // validating the input
    n = parseInt(n, 10);
    if (isNaN(n)) n = 0;
    if (n < 0) n = 0;
    
    k = parseInt(k, 10);
    if (isNaN(k)) k = 0;
    if (k < 0) k = 0;
    if (k > n) k = n;
    
    return (factorial(n)) / (factorial(k) * factorial(n - k));
}

function dec (x, trueCond="True", falseCond="False") {
  if (x) {return `<span style="color: green; font-weight: bold">` + trueCond + `</span>`}
    else {return `<span style="color: red; font-weight: bold">` + falseCond + `</span>`}
}
function bold (x, y=false) {
  if (y) {return `<span style="font-weight: bold; color:` + y + `">` + x + `</span>`}
  return `<span style="font-weight: bold">` + x + `</span>`}

function screwprops (x="", tab) {
  rv = []
  if (tab==-1 || x.length == 0) {
    return `<div style="font-size: 75%">
    The <strong>Properties</strong> tab shows properties and computations from your input.
    <hr><strong>Single Number</strong>: Shows if it's prime and the prime factors, as well as some multiples and its representations in different bases.
    <br><strong>Array</strong>: Putting a "[" at the start of the input will recognize it as an <strong>array of numbers</strong>, where commas or spaces separate numbers, though it's quite lenient. It'll give you the [length, average, sum, differences, standard deviation].
    <hr><strong>Distributions</strong>: If your array has <strong>exactly 4 values</strong>, it is treated as a hypergeometric distribution, where the values correspond to [population, hits, rolls, needed].
    <br>An example of how it works: if you have a deck of cards and want to see what the chance of getting 5 clubs is after 10 draws, your array is <strong>[52, 13, 10, 5]</strong>. Deck / number of clubs (hits from the deck) / rolls (draws) / number of hits needed.
    </div>`
  }



  if (isNumber(numify(x))) { // Single Number
    function primeFactorization(number, result) {
      result = (result || []);
      let root = Math.sqrt(number);
      let y = 2;
      if (number % y) {
        y = 3;
        while ((number % y) && ((y = (y + 2)) < root)) {}
      }
      y = (y <= root) ? y : number;
      result.push(y);
      return (y === number) ? result : primeFactorization((number / y), result);
    };// https://gist.github.com/jonathanmarvens/7206278

    if (x < 25555555555453545) {
      let leFactors = primeFactorization(x)
      let isPrime = leFactors.length == 1? true : false
      let isSquare = leFactors.length == 2 && (leFactors[0] == leFactors[1])? true : false
      let finalTouch = isSquare? bold("(square)", "blue") : dec(isPrime, "(prime)", "(not prime)")
      rv.push("Factors: " + bold(leFactors.join(", ")) + " " + finalTouch)
    }

    var base_convert = function(number, initial_base, change_base) {
   if ((initial_base && change_base) <2 || (initial_base && change_base)>36)
    return 'Base between 2 and 36';
   
    return parseInt(number + '', initial_base)
    .toString(change_base);
    }
    let z = numify(x)
    rv.push("Multiples: " + bold(z*2 + ", " + z*3 + ", " + z*4 + ", " + z*5 + ", " + z*6 + ", ..."))
    //rv.push("Square Root: " + bold(z/z))
    rv.push("<hr>Base 6: " + bold(base_convert(z, 10, 6)))
    rv.push("Base 12: " + bold(base_convert(z, 10, 12)))



  
  } else if (x.split("")[0] == "[" && x.match(/\d/)) { // Array syntax, split all non-numbers out.
     /*x.split("")[x.split("").length-1] == "]"*/ // I used to have ] match.
    let learray = x.match(/[+-]?(?:\d*\.)?\d+/g); // Split out ALL numbers!
    rv.push("Array: " + `[` + bold(learray.join(", ")) + `]`)
    learray = learray.map((a) => Number(a))

    if (learray.length > 1) {
      average = (array) => array.reduce((a, b) => a + b) / array.length;
      sum = (array) => array.reduce((a, b) => a + b);
      
      let diffs = []
      for (var i = 1; i < learray.length; i++) { // get diffs
        diffs.push(learray[i-1] - learray[i])
      }
      let leavg = average(learray)
      rv.push("<hr>Length: " + bold((learray).length))
      rv.push("Average: " + bold(average(learray)))
      rv.push("Sum: " + bold(sum(learray)))
      rv.push("Diffs: [" + bold(diffs.join(", ")) + "]")
      variance = (array) => array.reduce((a, b) => (b - leavg)*(b - leavg))
      rv.push("Std. Deviation: " + bold(Math.sqrt(variance(learray))))



      // Calculate the probabilities...!
      if (learray.length == 4) {
        rv.push(`<hr><strong>Probability Mode Activated</strong>
          <br>Population/Hits/Rolls/Needed:`) // Assuming hypergeometric, aka no replacements.
        
        let errorHit = true; // First ensure the values are right:
        if ( !(positiveInt(learray[0]) && positiveInt(learray[1]) && positiveInt(learray[2]) && positiveInt(learray[3])) ) {rv.push(bold(`Some of these numbers are zero or negative or have decimal points.`, `red`))}
        else if (learray[0] < learray[1]) {rv.push(bold(`Hits > Population (The number of hits is the number of successes in the population, it cannot be greater than the entire population.)`, `red`))}
        else if (learray[0] < learray[2]) {rv.push(bold(`Rolls > Population (The number of rolls is the number of times you take something out of the population, it cannot be greater than the entire population.)`, `red`))}
        else if (learray[0] < learray[3]) {rv.push(bold(`Needed > Population (The number of successful rolls cannot be greater than the entire population.)`, `red`))}
        else if (learray[1] < learray[3]) {rv.push(bold(`Needed > Hits (The number of successful rolls cannot be greater than the number of successes in the population.)`, `red`))}
        else if (learray[2] < learray[3]) {rv.push(bold(`Needed > Rolls (You cannot have more successful rolls needed than actual rolls.)`, `red`))}
        else if (learray[0] - learray[1] < learray[2] - learray[3]) {rv.push(bold(`Rolls - Needed > Population - Hits (There are too many hits in the population. Every sample would succeed.)`, `red`))}
        else {errorHit = false;
          lerv1 = choose(learray[1], learray[3])*choose((learray[0] - learray[1]), (learray[2] - learray[3]))/choose(learray[0], learray[2])
          rv.push("Exact Chance: " + bold(lerv1, "green"))
          while (learray[0] > learray[3] && learray[1] > learray[3] && learray[2] > learray[3]) {
            learray[3]++
            let leres = choose(learray[1], learray[3])*choose((learray[0] - learray[1]), (learray[2] - learray[3]))/choose(learray[0], learray[2]); l(leres)
            lerv1 += leres
          }
          //rv.push("Exact or Worse Chance: " + bold(lerv1, "green"))
          rv.push("Exact or Better Chance: " + bold(lerv1, "green"))
        }


        if (errorHit) {}
      }
    }

  } else {
    rv.push("Characters: " + bold(x.split("").length))
    rv.push("Lines: " + bold(x.split("\n").length))
    rv.push("Words: " + bold(x.split(/\s+/).length)) // Has the obvious problem of dashes being words y'knooooo
    average = (array) => array.reduce((a, b) => a + b) / array.length;
    rv.push("Average Word Length: " + bold(average(x.split(" ").map((a) => a.length))))

  }

  if (emptyArray(rv)) {return ""}
  return rv.join("<br>")
  
}


let arrows = `
♥ ♦ ♣ ♠ ♡♢♧♤
•⬤⭘🔴🔵🟠🟡🟢🟣🟤

Basic Math Symbols

≠ ± ∓ ÷ × ∙ – √ ‰ ⊗ ⊕ ⊖ ⊘ ⊙ ≤ ≥ ≦ ≧ ≨ ≩ ≺ ≻ ≼ ≽ ⊏ ⊐ ⊑ ⊒ ² ³ °

Geometry Symbols

∠ ∟ ° ≅ ~ ‖ ⟂ ⫛

Algebra Symbols

≡ ≜ ≈ ∝ ∞ ≪ ≫ ⌊⌋ ⌈⌉ ∘∏ ∐ ∑ ⋀ ⋁ ⋂ ⋃ ⨀ ⨁ ⨂ 𝖕 𝖖 𝖗

Set Theory Symbols

∅ ∖ ∁ ↦ ↣ ∩ ∪ ⊆ ⊂ ⊄ ⊊ ⊇ ⊃ ⊅ ⊋ ⊖ ∈ ∉ ∋ ∌ ℕ ℤ ℚ ℝ ℂ ℵ ℶ ℷ ℸ 𝓟

Logic Symbols

¬ ∨ ∧ ⊕ → ← ⇒ ⇐ ↔ ⇔ ∀ ∃ ∄ ∴ ∵ ⊤ ⊥ ⊢ ⊨ ⫤ ⊣

Calculus and Analysis Symbols

∫ ∬ ∭ ∮ ∯ ∰ ∇ ∆ δ ∂ ℱ ℒ ℓ

Greek Letters

𝛢𝛼 𝛣𝛽 𝛤𝛾 𝛥𝛿 𝛦𝜀𝜖 𝛧𝜁 𝛨𝜂 𝛩𝜃𝜗 𝛪𝜄 𝛫𝜅 𝛬𝜆 𝛭𝜇 𝛮𝜈 𝛯𝜉 𝛰𝜊 𝛱𝜋 𝛲𝜌 𝛴𝜎 𝛵𝜏 𝛶𝜐 𝛷𝜙𝜑 𝛸𝜒 𝛹𝜓 𝛺𝜔

Fractions

½ ⅓ ⅔ ¼ ¾ ⅕ ⅖ ⅗ ⅘ ⅙ ⅚ ⅐ ⅛ ⅜ ⅝ ⅞ ⅑ ⅒ ↉

▀▁▂▃▄▅▆▇█▉▊▋▌▍▎▏▐░▒▓▔▕▖▗▘▙▚▛▜▝▞▟ 

 🎜 🎝
♩ ♪ ♫ ♬
🏳 🏴 🏁♂♀
💠🔶🔷🚮


𝅜 𝅝 𝅗𝅥 𝅘𝅥 𝅘𝅥𝅮 𝅘𝅥𝅯 𝅘𝅥𝅰 𝅘𝅥𝅱 𝅘𝅥𝅲 
← → ↑ ↓
↔ ↕
↖ ↗ ↘ ↙
⤡ ⤢
↚ ↛ ↮
⟵ ⟶ ⟷
⇦ ⇨ ⇧ ⇩
⬄ ⇳
⬁ ⬀ ⬂ ⬃
⬅ ( ⮕ ➡ ) ⬆ ⬇
⬉ ⬈ ⬊ ⬋
⬌ ⬍
🡐 🡒 🡑 🡓
🡔 🡕 🡖 🡗
🡘 🡙
Heavy Arrow, Compressed Arrow
🠹 🠸 🠻 🠺
🡄 🡆 🡅 🡇
🠼 🠾 🠽 🠿
🡀 🡂 🡁 🡃
Equilateral Triangle Arrowhead
🠐 🠒 🠑 🠓
🠔 🠖 🠕 🠗
🠘 🠚 🠙 🠛
🠜 🠞 🠝 🠟
Triangle Arrowhead
⭠ ⭢ ⭡ ⭣
⭤ ⭥
⭦ ⭧ ⭨ ⭩
🠀 🠂 🠁 🠃
🠄 🠆 🠅 🠇
🠈 🠊 🠉 🠋
🠠 🠢 🠡 🠣
🠤 🠦 🠥 🠧
🠨 🠪 🠩 🠫
🠬 🠮 🠭 🠯
🠰 🠲 🠱 🠳
Barb Arrow
🡠 🡢 🡡 🡣 🡤 🡥 🡦 🡧
🡨 🡪 🡩 🡫 🡬 🡭 🡮 🡯
🡰 🡲 🡱 🡳 🡴 🡵 🡶 🡷
🡸 🡺 🡹 🡻 🡼 🡽 🡾 🡿
🢀 🢂 🢁 🢃 🢄 🢅 🢆 🢇
Circled Arrow
⮈ ⮊ ⮉ ⮋
➲
Dart Arrow
⮜ ⮞ ⮝ ⮟
⮘ ⮚ ⮙ ⮛
➢ ➣ ➤
Dashed/Dotted Arrows
⭪ ⭬ ⭫ ⭭
⇠ ⇢ ⇡ ⇣
⤌ ⤍ ⤎ ⤏
⬸ ⤑
⬷ ⤐
Harpoon Arrows
↼ ⇀ ↽ ⇁ ↿ ↾ ⇃ ⇂
⥊ ⥋ ⥌ ⥍
⥎ ⥐ ⥑ ⥏
⥒ ⥓ ⥖ ⥗ ⥔ ⥕ ⥘ ⥙
⥚ ⥛ ⥞ ⥟ ⥜ ⥝ ⥠ ⥡
⥢ ⥤ ⥣ ⥥
⇋ ⇌
⥦ ⥨ ⥧ ⥩
⥪ ⥬ ⥫ ⥭
⥮ ⥯
Paired Arrows
⮄ ⮆ ⮅ ⮇
⇈ ⇊ ⇇ ⇉
⇆ ⇄ ⇅ ⇵
⮀ ⮂ ⮁ ⮃
⭾ ⭿
Double/Triple/Quadruple Lines Arrows
⇐ ⇒ ⇑ ⇓
⇔ ⇕
⇖ ⇗ ⇘ ⇙
⇍ ⇏ ⇎
⟸ ⟹ ⟺
⤂ ⤃ ⤄
⤆ ⤇
⬱ ⇶
⇚ ⇛ ⤊ ⤋
⭅ ⭆ ⟰ ⟱
Arrow to/from Bar
⭰ ⭲ ⭱ ⭳
⭶ ⭷ ⭸ ⭹
⇤ ⇥ ⤒ ⤓ ↨
⤝ ⤞ ⤟ ⤠
↤ ↦ ↥ ↧
⬶ ⤅
⟻ ⟼
↸
⇱ ⇲
Wave/Squiggle Arrow
⇜ ⇝
⬳ ⟿
↜ ↝ ↭
⬿ ⤳
Stroked Arrows
⇷ ⇸ ⤉ ⤈ ⇹
⇺ ⇻ ⇞ ⇟ ⇼
⭺ ⭼ ⭻ ⭽
⬴ ⤀
⬵ ⤁
⬹ ⤔ ⬺ ⤕
⬻ ⤖ ⬼ ⤗ ⬽ ⤘
Sharp Turn Arrows
⮠ ⮡ ⮢ ⮣ ⮤ ⮥ ⮦ ⮧
↰ ↱ ↲ ↳ ⬐ ⬎ ⬑ ⬏ ↴ ↵
⮐ ⮑
⮒ ⮓
Arrows with Hook/Loop
↩ ↪
⤣ ⤤ ⤥ ⤦
⭚ ⭛
↫ ↬
Special Tail Arrows
⤙ ⤚ ⤛ ⤜
⥼ ⥽ ⥾ ⥿
Bent Arrows
⭜ ⭝
⭞ ⭟
↯ ⭍
Circular Arrows
↶ ↷ ⤾ ⤿ ⤸
⤺ ⤹ ⤻
⭯ ⭮ ↺ ↻
⟲ ⟳
⥀ ⥁
🗘
⮌ ⮍ ⮎ ⮏
⮔
🔁 🔂 🔃 🔄
⤶ ⤷ ⤴ ⤵
Ribbon Arrow
⮰ ⮱ ⮲ ⮳ ⮴ ⮵ ⮶ ⮷
Curved Arrow
➥ ➦
⮨ ⮩ ⮪ ⮫ ⮬ ⮭ ⮮ ⮯
Shaded/Shadowed
➩ ➪ ➫ ➬ ➭ ➮ ➯ ➱
🢠 🢡 🢢 🢣 🢤 🢥 🢦 🢧 🢨 🢩 🢪 🢫
Decorative Arrows
⇪ ⮸ ⇫ ⇬ ⇭ ⇮ ⇯
➳ ➵ ➴ ➶ ➸ ➷ ➹
➙ ➘ ➚
➾ ⇰
➛ ➜ ➔ ➝ ➞ ➟ ➠ ➧ ➨
➺ ➻ ➼ ➽
Pointers and Triangles
◄ ► ◅ ▻
◀ ▶ ▲ ▼
⯇ ⯈ ⯅ ⯆
Arrow Head, Arrow Shaft
🢐 🢒 🢑 🢓
⌃ ⌄
🢔 🢖 🢕 🢗
🢜 🢝 🢞 🢟 🢬 🢭
⮹
Double Head
↞ ↠ ↟ ↡
⯬ ⯭ ⯮ ⯯
misc
🠴 🠶 🠵 🠷
🢘 🢚 🢙 🢛
🔙 🔚 🔛 🔜 🔝
↢ ↣
⇽ ⇾ ⇿
⭎ ⭏
⥂ ⥃ ⥄
⥉ ⥰
Math Arrows
⤼ ⤽
⥶ ⥸
⥷ ⭃
⭀ ⥱
⭂ ⭈ ⭊ ⥵
⭁ ⭇ ⭉ ⥲
⭋ ⭌ ⥳ ⥴
⥆ ⥅
⬰ ⇴ ⥈
⬲ ⟴
⬾ ⥇
⥹ ⥻
⥺ ⭄

[see Unicode Math Symbols ∑ ∫ π² ∞]
Cross Arrows
⤪ ⤨ ⤧ ⤩
⤭ ⤮ ⤱ ⤲
⤯ ⤰
⤫ ⤬

 ⓪ ① ② ③ ④ ⑤ ⑥ ⑦ ⑧ ⑨ ⑩ ⑪ ⑫ ⑬ ⑭ ⑮ ⑯ ⑰ ⑱ ⑲ ⑳ ㉑ ㉒ ㉓ ㉔ ㉕ ㉖ ㉗ ㉘ ㉙ ㉚ ㉛ ㉜ ㉝ ㉞ ㉟ ㊱ ㊲ ㊳ ㊴ ㊵ ㊶ ㊷ ㊸ ㊹ ㊺ ㊻ ㊼ ㊽ ㊾ ㊿  ⓿ ❶ ❷ ❸ ❹ ❺ ❻ ❼ ❽ ❾ ❿ ⓫ ⓬ ⓭ ⓮ ⓯ ⓰ ⓱ ⓲ ⓳ ⓴  ㉈ ㉉ ㉊ ㉋ ㉌ ㉍ ㉎ ㉏  ⓵ ⓶ ⓷ ⓸ ⓹ ⓺ ⓻ ⓼ ⓽ ⓾ 

0️⃣ 1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣ 8️⃣ 9️⃣ 🔟`.replace(/[a-zA-Z\[\] \s]/gi, "")
// http://xahlee.info/comp/unicode_arrows.html

let pieces = ` ♚ ♛ ♜ ♝ ♞ ♟ ♔ ♕ ♖ ♗ ♘ ♙
🎲 ⚀ ⚁ ⚂ ⚃ ⚄ ⚅
♠ ♣ ♥ ♦ ♤ ♧ ♡ ♢
 🂱 🂲 🂳 🂴 🂵 🂶 🂷 🂸 🂹 🂺
🂻 🂼 🂽 🂾
🂡 🂢 🂣 🂤 🂥 🂦 🂧 🂨 🂩 🂪
🂫 🂬 🂭 🂮
🃁 🃂 🃃 🃄 🃅 🃆 🃇 🃈 🃉 🃊
🃋 🃌 🃍 🃎
🃑 🃒 🃓 🃔 🃕 🃖 🃗 🃘 🃙 🃚
🃛 🃜 🃝 🃞
🂠 🃏 🃟 🂿
🎴 🃠
🃡 🃢 🃣 🃤 🃥
🃦 🃧 🃨 🃩 🃪
🃫 🃬 🃭 🃮 🃯
🃰 🃱 🃲 🃳 🃴 🃵

`

let keycaps = `
0️⃣ 1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣ 8️⃣ 9️⃣ 🔟
`

/* The database should look like:
kanji = [{kanji: "一", meanings: "one, line radical", strokes: 1}, ]

*/
let links = `https://www.mypixwords.com/answers/S___A__O_/
https://www.oneacross.com/cgi-bin/search_anagram.cgi?p0=a+fake+with+pigtails&c0=&s=+Go+
regex101.com/
https://truben.no/table/
https://tech.pookey.co.uk/non-wp/encoder-decoder.php

`

function screwtwo (x="", tab) {
  if (tab==0) {return `<span style="letter-spacing: 5px">` + arrows + `</span>`}
  if (tab==1) {return `<iframe src="http://shapecatcher.com/" title="Shapecatcher"></iframe>`}
  if (tab==2) {return `` + links.replace("\n", "<br>") + ``}

}


Vue.component('stheme-component', {
    props: {
    },
  data: function () {
    return {
      shouldDisplayOverlay: false,
      currentTextNumber: 0,
      unlockedHints: 0,
      currentlyPressed: 0,
      currentAnimFrame: 0,
      displayBlack: false,
      currentInput: '',
      curText: '',
      tab0: '',
      tab1: '',
      tab2: '',
      tabs: [0, 0, 0],
      tabhoverstatus: [false, false, false],

      state: [], // This can be "game", "dialogue", or a menu state.
      modal: "none",
      nametag: "",
      words: "",
      hover: "",

      arrows: arrows,

      xyz: true // Purely to block commas
      }
  },
  methods: {
      l: function (event) {
        l(event)
      },
      onEnter: function (event) {
      },
      onDown: function (event) {
      },
      clickOutsideText: function (event) {
        this.modal = "none"
      },
      clickButton: function (number, unlock, event) {
        if (this.currentlyPressed != number) {
          this.currentlyPressed = number
        } else {
          if (!keepPressed) {
            this.currentlyPressed = 0
          }
        }
        event.stopPropagation();
      },
      openSettings: function () {
        if (this.modal == "settings") {this.modal = "none"} else {this.modal = "settings"}
      },
      openUpgrades: function () {
        if (this.modal == "upgrades") {this.modal = "none"} else {this.modal = "upgrades"}
      },
      changeTab: function (tab, v) {
        this.tabs[tab] = v; this.updateTab()
      },
      chHover: function (tab="", v) {
        if (tab.length == 0) {this.tabhoverstatus = [false, false, false]}
        Vue.set(this.tabhoverstatus, tab, v) // Because THIS makes sense. Screw you Vue.
      },
      updateText: function (event) {
        let rV = event.target.textContent.trim() // trim spaces
        this.curText = rV
        this.tab0 = screwball(rV, this.tabs[0])
        this.tab1 = screwprops(rV, this.tabs[1])
        this.tab2 = screwtwo(rV, this.tabs[2])
      },
      updateTab: function () {
        this.tab0 = this.tab1 = this.tab2 = "" // To fix the not-updating UI
        this.tab0 = screwball (this.curText, this.tabs[0])
        this.tab1 = screwprops(this.curText, this.tabs[1])
        this.tab2 = screwtwo  (this.curText, this.tabs[2])
      },
      doAbsolutelyNothing: function () {
        this.tab0 = this.tab0 + " "
        this.tab1 = this.tab1 + " "
        this.tab2 = this.tab2 + " "
      },
      stopText() {
        this.$el.querySelector('.pcatit-border').blur()
      },
      isPressedDown: function (number) {
        if (number == this.currentlyPressed) {return {'pcatit-pressed': true}} else {return {'pcatit-pressed': false}}
      },
      doDisplayHint: function (number) {
        if (number <= this.unlockedHints+1) {return "initial"} else {return "none"}
      },
      textHint: function (number, unlock) {
        // I've decided to make it work without the "Unlock" updating on the top, it might be perceived as a glitch.

      },
      animFrameOpacity: function (number) {
        return {'opacity': (number==this.currentAnimFrame? '1':'0')} // Cause they neeeeed strings
      },
      tabsty: function (x, y, add="") {
        let whatColor, lefirst;
        switch (x) {
          case 0: whatColor = '194'; break
          case 1: whatColor = '104'; break
          case 2: whatColor = '0'; break
        }
        lefirst = "background: hsl(" + whatColor + ",100%,71%); color: black;"
        if (this.tabs[x] == y) {lefirst = "background: hsl(" + whatColor + ",100%,22%); color: white;"}
        if (this.tabhoverstatus[x] !== false && this.tabhoverstatus[x] == y) {lefirst = "background: hsl(" + whatColor + ",100%,44%); color: black; cursor: pointer;"}
        if (this.tabs[x] == y && this.tabhoverstatus[x] !== false && this.tabhoverstatus[x] == y) {lefirst = "background: hsl(" + whatColor + ",100%,33%); color: white; cursor: pointer;"}

        return convCSS(lefirst + "font-weight: bold; margin-left: 1%; padding: 0% 2% 0% 2%; border-top-left-radius: 1em; border-top-right-radius: 1em; border: .1em solid black;" + add)
      },
      innersty: function (x) {
        let whatColor;
        switch (x) {
          case 0: whatColor = '#6bdcff'; break
          case 1: whatColor = '#b3ff98'; break
          case 2: whatColor = '#ff9898'; break
        }
        return convCSS(`background:` + whatColor + `; position: absolute; left: 1%; height: 100%; width: 100%; border: 0.1em solid black; padding: 2%; overflow-y: scroll; overflow-wrap: anywhere; scrollbar-color: dark`)
      },
      playSound (sound) {
        if (sound) {
          let audio = new Audio(sound);
          audio.play();
        }
      }
  },
  created: function () {
    this.state = "game"
    let rV = ""
    this.tab0 = screwball(rV, this.tabs[0])
    this.tab1 = screwprops(rV, this.tabs[1])
    this.tab2 = screwtwo(rV, this.tabs[2])
  }, /* add mounted later */
  computed: {
    overlayClass: function () {
      return {
        'hidden': !this.shouldDisplayOverlay,
        'brighter': this.currentText == '',
        'pcatit-overlay1': this.currentTextNumber == 1,
        'pcatit-overlay2': this.currentTextNumber == 2,
        'pcatit-overlay3': this.currentTextNumber == 3,
        'pcatit-overlay4': this.currentTextNumber == 4
        //'visibility': this.shouldDisplayOverlay ? "visible" : "hidden"
      }
    },
    hintButtonClass: function () {
      return {
        'pcatit-hint1': this.currentTextNumber == 1,
        'pcatit-hint2': this.currentTextNumber == 2,
        'pcatit-hint3': this.currentTextNumber == 3,
        'pcatit-hint4': this.currentTextNumber == 4
      }
    },
    displayDialogue: function () {
      if (this.state[0] == 'dialogue') {
        return {
          'display': 'visible'
        }
      } else {
        return {
          'display': 'none'
        }
      }
    },
    bgStyle: function () {
      //if (this.displayBlack) {return {'background': 'black'}}
      if (this.puzzletype == 'mark-answer') {
        return {
          'background-image': 'linear-gradient(rgba(185, 255, 222, 0.05), rgba(185, 255, 174, 0.05)), url("' + this.puzzlenum + '-bottom.png")'
        }
      } else {
        return {
          'background-image': 'linear-gradient(rgba(0, 255, 255, 0.65), rgba(163, 239, 200, 0.65)', 'padding-top': '60%', 'margin-top': '2%'
        }
      }
    },
    settingsStyle: function () {
      rv = convCSS("position: absolute; top: 2.5%; width: 95%; height: 95%; border: 2px solid black; background-color: #affd; z-index: 5")
      if (this.modal != "settings") {rv.display = 'none'}
      return rv
    },
    upgradesStyle: function () {
      rv = convCSS("position: absolute; top: 2.5%; width: 95%; height: 95%; border: 2px solid black; background-color: #fccd; z-index: 5")
      if (this.modal != "upgrades") {rv.display = 'none'}
      return rv
    },
    typeBorderStyle: function () {
      return convCSS("width: 50%; height: 20%; position: absolute; top: 85%; left: 50%; transform: translate(-50%, -50%); border: 2px solid")
    },
    typeInnerStyle: function () {
      return convCSS("width: 100%; height: 100%; text-align: center; font-weight: bold; background: rgba(255, 255, 255, 0.25); color: #222; overflow-y: auto")
    }
  },
  template: `<div class="pcatit-answer" v-bind:style="bgStyle" v-on:click.self="clickOutsideText">
    <div class="settings" v-bind:style="settingsStyle"></div>
    <div class="settings" v-bind:style="upgradesStyle" style="display: flex">



    </div>

    <button class="openSettings" style="position: absolute; bottom: 1%; left: 1%; height: 10%; color: white; font-weight: bold; font-size: 200%; z-index: 5" v-on:click="openSettings">⚙</button>
    <button class="openSettings" style="position: absolute; bottom: 1%; left: 8%; height: 10%; color: white; font-weight: bold; background-color: lime; font-size: 200%; z-index: 5" v-on:click="openSettings">⚙</button>
    <button class="openUpgrades" style="position: absolute; bottom: 1%; left: 15%; height: 10%; color: white; font-weight: bold; background-color: red; font-size: 200%; z-index: 5" v-on:click="openUpgrades">🡅</button>


    <div style="position: absolute; top: 1%; left: 1%; height: 60%; width: 32%;">
      <div>
      <span v-bind:style="tabsty(0, 0)" v-on:click="changeTab(0,0)" @mouseover="chHover(0,0)" @mouseleave="chHover()">Transforms</span>
      <span v-bind:style="tabsty(0, 3)" v-on:click="changeTab(0,3)" @mouseover="chHover(0,3)" @mouseleave="chHover()">2</span>
      <span v-bind:style="tabsty(0, 1)" v-on:click="changeTab(0,1)" @mouseover="chHover(0,1)" @mouseleave="chHover()">Decoding</span>
      <span v-bind:style="tabsty(0, 2)" v-on:click="changeTab(0,2)" @mouseover="chHover(0,2)" @mouseleave="chHover()">MD</span>
      <span v-bind:style="tabsty(0,-1, 'right: 0%; position: absolute;')" v-on:click="changeTab(0,-1)" @mouseover="chHover(0,-1)" @mouseleave="chHover()">?</span>
      </div>
      <div v-bind:style="innersty(0)">
      <div class="interpret" style="color: black" v-html="tab0"></div>
    </div>
    </div>
    
    <div style="position: absolute; top: 1%; left: 34%; height: 60%; width: 32%;">
      <div>
      <span v-bind:style="tabsty(1,0)" @mouseover="chHover(1,0)" @mouseleave="chHover()" v-on:click="changeTab(1,0)">Properties</span>
      <span v-bind:style="tabsty(1,-1, 'right: 0%; position: absolute;')" v-on:click="changeTab(1,-1)" @mouseover="chHover(1,-1)" @mouseleave="chHover()">?</span>

      </div>
      <div v-bind:style="innersty(1)">
      <div class="interpret" style="color: black" v-html="tab1"></div>
    </div>
    </div>

    <div style="position: absolute; top: 1%; left: 67%; height: 60%; width: 32%;">
      <div>
      <span v-bind:style="tabsty(2,0)" v-on:click="changeTab(2,0)" @mouseover="chHover(2,0)" @mouseleave="chHover()">References</span>
      <span v-bind:style="tabsty(2,1)" v-on:click="changeTab(2,1)" @mouseover="chHover(2,1)" @mouseleave="chHover()">Shapecatcher</span>
      <span v-bind:style="tabsty(2,2)" v-on:click="changeTab(2,2)" @mouseover="chHover(2,2)" @mouseleave="chHover()">L</span></div>
      <div v-bind:style="innersty(2)">
      <div class="interpret" style="color: black" v-html="tab2"></div>
    </div>
    </div>



    <div v-bind:style="typeBorderStyle">
      <div v-bind:style="typeInnerStyle" contenteditable="true" spellcheck="false" v-html="currentInput" @input="updateText($event)" @onpaste="onPaste($event)" @keydown.enter="stopText"></div>
    </div>
  </div>`
  }) //  v-bind:style="{'border': inputBorderStyle} // class="resetpos" 
  window.Event = new Vue()
  // 
    //<div class="interpret" style="color: black; position: absolute; top: 0%; left: 50%; transform: translate(-50%, -50%);" 



  /*   <div class="pcatit-border" v-bind:style="{'background': bg}">
    <div class="pcatit-textoverlay" v-on:mousedown="onDown" v-on:click="onClick" v-on:mouseenter="onEnter" v-on:mouseleave="onLeave" v-bind:class="classObject">{{current-text}}</div>
    <div class="pcatit-writeanswer">??? = ????</div>


    <span class="top">{{title}}</span>
    <div class="button-anchor">
    <div class="button" v-on:mousedown="onDown" v-on:click="onClick" v-on:mouseenter="onEnter" v-on:mouseleave="onLeave" v-bind:class="classObject" v-bind:style="{color: button.text, 'background-color': button.color, 'background-image': button.gradient, 'border': button.border}">
        <span class="button-display">{{display}}</span>
      </div>
      <div class="button-sub" v-html="sub"></div>
    </div>
  </div>` */

  var game = new Vue({
      el: '#content',
      data: {}
  })


// GETTING THE DATA TO THE CONSOLE
  // game.$children[0]._data
  // game.$children
