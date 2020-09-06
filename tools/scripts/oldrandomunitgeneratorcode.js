// PROBLEMS WITH THIS CODE: Using betza "atoms" instead of programmatic generation!


$("#makeceo").click(function() { // main_gi: Make Chess Evolved Online (piece)

  function makepiece(seed) { // Somehow I feel like this being in my life is a reference to me having played Layton Brothers several years ago (a character's name being Keelan Makepeace)
    let rng = new Math.seedrandom(seed);
    let x; // dummy number

    // First, define the themes:
    let themes = []
    let genericpassives = ["(Status-Immune).", "(Magic-Immune).", "(Ranged-Immune.)", "Immune to Freeze.", "Immune to Poison.", "Immune to Petrify.", "Immune to Compel.", "(Displacement-Immune).", "On Kill: Lose # morale.", "On Death: Lose # morale.", "Does not block movement.", "Vanishes after attacking.", "On Melee Death: Destroy the attacker."]
    let passivecosts = [0.5, 0.5, 0.5, 0.2, 0.2, 0.2, 0.2, 0, -1.5, -2, -0.5, -2, 5]

    let nongenericpassives = ["On Death: Kill all adjacent ally units.", "On Death: Petrify all adjacent ally units for 5 turns.", "On Kill: Kill all adjacent ally units.", "On Death: Enchant adjacent ally units for 2 turns.", "Cannot attack enemy units until turn 50.", "Cannot attack enemy units until turn 200."]
    let nongenericcosts = [-12, -8, -4, 4, 8, 12]

    let actionvalues =
    `10,3+2,7,10+4++7+++X,16+6++8+++X,7,9,14,9,8,1+3,
    5+7++X,6,5,11++7,10,1+5,20,35,5,12`.split(",") // only intuition behind the numbers, not logic

    // + means bonus value at range 2 forwards
    // ++ means bonus value at range 3 forwards: if X then don't put it there!
    // +++ means bonus value at range 4 forwards

    var randoms = Array.from({length: 500}, () => rng()); // Big list of random numbers that'll stay the same

    function rr(index, shiftoverby=2) {x = randoms[i]; x = x*(Math.pow(10, shiftoverby)); randoms[i] = x - Math.trunc(x)} // "Reset" the value by dropping two of its digits. I can use about 24 of these before the variable just dies.
    // rr() is a declarative function based on randoms

    function arrayToX(number) { // creates an array from 0 to number
      rv = []
      for (var i = 0; i <= number; i++) {rv.push(i)}
      return rv
    }

    function shuffleArray(array, seednumber) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(randoms[seednumber] * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
        rr(seednumber)
      }
      return array
    } // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array/18650169#18650169


    let minionorchampion = r(randoms[0], 1) // Minion or Champion? (Champion is 1)
    x = r(randoms[2], 40)
    let rarity = (x<10)?"Common":(x<20)?"Rare":(x<30)?"Epic":"Legendary" // Minion or Champion? (Champion is 1)

    let startingcost = r(randoms[5], minionorchampion?7:20) + (minionorchampion?0:4) + ((r(randoms[9], 101) > 100)?r(randoms[9], 100):0)
    // Determine base cost, with a chance to add a stupidly high graceless number
    rr(5); let extracost1 = r(randoms[5], 1, minionorchampion?3:6)
    rr(5); let extracost2 = r(randoms[5], 1, minionorchampion?3:6)
    rr(5); let extracost3 = r(randoms[5], 1, minionorchampion?3:6)

    let costs = [startingcost, startingcost+extracost1, startingcost+extracost1+extracost2, startingcost+extracost1+extracost2+extracost3]
    let runningcosts = costs.map(x => x+1.5) // Copy this array and use it as running cost that slowly decreases. We give it extra points by the way as "unit advantage".

    let passives = ["", "", "", ""];
    let movesets = [[], [], [], []];

    if (r(randoms[25], 20) > 18) { // Get a passive first, very low chance
      rr(25); let passivepicked = r(randoms[25], genericpassives.length-1); // passivepicked is an index
      rr(25);
      if (passivecosts[passivepicked] < startingcost) {
        passives = passives.map(x => genericpassives[passivepicked].replace("#", r(randoms[25], 2, 6).toString() + "[+1]")) // TODO: maybe change the +1 part
      }
    }




    atomlist = ["W", "F", "D", "A", "N", "V", "Z", "+", "X", "*"]// "K", "B", "R", "Q"]
    atomvalues = [1, 2, 3, 4, 6, 6, 6, 2, 3, 12]//4, 8, 11, 20]
    atomoutput = ["76786787", "66688688", "57757997", "55599599", "4648646a848aa6a8", "4549545a949aa5a9", "678776785797757947a7747a37b7737b27c7727c17d7717d07e7707e", "6668868855599599444aa4aa333bb3bb222cc2cc111dd1dd000ee0ee", "67767887668668885665856989589698559559997557977947747aa74664846a8a48a6a84554945a9a49a5a944a44aaa37737bb73663836b8b38b6b83553935b9b39b5b93443a34bab3ab4ba33b33bbb27727cc72662826c8c28c6c82552925c9c29c5c92442a24cac2ac4ca2332b23cbc2bc3cb22c22ccc17717dd71661816d8d18d6d81551915d9d19d5d91441a14dad1ad4da1331b13dbd1bd3db1221c12dcd1cd2dc11d11ddd07707ee70660806e8e08e6e80440a04eae0ae4ea0330b03ebe0be3eb0220c02ece0ce2ec0110d01ede0de1ed00e00eee0550905e9e09e5e9"] // is this a good idea? conveniently splitting these strings into halves works somewhat
    // for that last one, you can split it into multiples of eight, as "range x" always has "8*x" squares, aka 16*x characters that define the range

    // Come up with random moves:
    let actionstouse = r(randoms[50], 1, 4) // This is the NUMBER of actions involved
    rr(50)
    let shuffledactions = shuffleArray(arrayToX(actionvalues.length-1), 50).slice(0, actionstouse)


    for (let i = 0; i < actionstouse; i++) {
      rr(50); let actionthiscycle = shuffledactions[i] // Multiply the value of the action by the movelist. Note that it only picks those I've given a value for.


      // Choose how many atoms to use out of that list. A higher cost allows more atoms (an atom is like W/F/...).
      let atomstouse = r(randoms[100], 1, Math.floor(costs[0]/5)) // so 30 cost = 6 moves

      let shuffledindexes = shuffleArray(arrayToX(atomlist.length-1), 110).slice(0, atomstouse)
      // Shuffle an array that goes [0, 1, 2, 3, ...] using a random seed number, then take the first atomstouse, which simulates picking atomstouse random elements from it. We're going with these, unless they turn out overpriced.
      
      const arraySum = array => array.reduce((a,b) => a + b, 0)
      while (arraySum(shuffledindexes.map(x => atomvalues[x])) > runningcosts[0]) {
        shuffledindexes = shuffledindexes.slice(0, shuffledindexes-1)
        runningcosts[0]+=0.1 // infinite loop prevention??
      }
      // Now that we have a list of atoms let's join them in:
      movesets[0].push(actionthiscycle + ":" + shuffledindexes.map(x => atomoutput[x]).join(""))
      runningcosts[0] -= arraySum(shuffledindexes.map(x => atomvalues[x]))
      //l(runningcosts[0])

      //for (let j = 0; j < shuffledindexes.length; j++) {
      //}


      


      //rr(50); actionvalues[actionthiscycle] * atomvalues
      // let's not use actionvalues for now, which'll require extra effort to parse


    }
    movesets = movesets.map(x => x.join(","))

    // First, give it a generic moveset.
    // There shouldn't be anything that skips very awkwardly unless maybe it's a teleporter.

    let diagonal = 0; let horizontal = 0; let vertical = 0;


    //cost += (diagonal - dDisplacement / 2) * .8 * Math.pow(diagonal, .83) * actionValue;
    //cost += (horizontal - hDisplacement / 2) * .4 * Math.sqrt(horizontal) * actionValue;
    //cost += (vertical - vDisplacement / 4) * .63 * Math.pow(vertical, .75) * actionValue;


    // Bonus:   Kingattack
    // Deficit: Colorbound (attacks)
    // Count Attack Squares??

    
    // for each in the moveset convert it to hex ccg

    // Make a starting unit, then build on it

    // output should be like,
    // KDjN
    // KDAjN
    // KjNDA
    // KjNDAtV
    // That's Dragon's moveset.



    return `${seed},${minionorchampion?"Minion":"Champion"},Basic,${rarity}

${costs[0]},${passives[0]},${movesets[0]}
${costs[1]},${passives[1]},${movesets[1]}
${costs[2]},${passives[2]},${movesets[2]}
${costs[3]},${passives[3]},${movesets[3]}
` // NOTE: \\o needs to be written for a colon, \\a for a newline, I think
  }

  let nameinput = $("#nameinput").val();
  nameinput = nameinput.slice(0,1).toUpperCase() + nameinput.slice(1)

  let lastCEOversion = "v" + Math.max(...Object.keys(CEO).map(x => numify(x.slice(1)))) // WHAT A HACK LMAOOO. Gets the highest named key.

  if (Object.keys(CEO[`${lastCEOversion}`]).includes(nameinput.replace(/\d/, ""))) {
    let lename = nameinput.replace(/\d/, "");
    let lepiece = CEO[`${lastCEOversion}`][`${lename}`]
    let lepiece2 = CEO[`${lastCEOversion}`][`${lename}2`]
    let lepiece3 = CEO[`${lastCEOversion}`][`${lename}3`]
    let lepiece4 = CEO[`${lastCEOversion}`][`${lename}4`]
    ClanBoxList = ["Ninja","Swordsman","Spearman","Axeman","Legionary","Paladin","Berserker","Antimage","Warrior","Samurai"];
    ArcaneBoxList = ["Wizard","Bomber","Pyromancer","Banshee","Phantasm","FrostMage","Fireball","PoisonMage","SoulKeeper","WindMage","Portal","ThunderMage"];
    ForestBoxList = ["Dragon","Wisp","Guardian","Dryad","Ranger","Archer","Spider","Basilisk","Enchantress","Tiger","Drake"];
    // Hardcoded because this info is not anywhere near the piece data itself

    let pieceset = ClanBoxList.includes(lename)? "Clan":ArcaneBoxList.includes(lename)? "Arcane":ForestBoxList.includes(lename)? "Forest":"Basic"

    // Don't forget to switch 42 and 43, because the piecemaker is literally wrong here
    function r4243 (x) {return x.replace("42:", "FOURTYTHREE:").replace("43:","42:").replace("FOURTYTHREE", "43:")}
    function fixpassive (x) {return x?x.replace(",","\\a"):""}

    if (lepiece2 === undefined) {
      otherstuff = `0,,
0,,
0,,`
    } else {
      otherstuff = `${lepiece2.cost},${fixpassive(lepiece2.passive)},${r4243(lepiece2.movespmformat)}
${lepiece3.cost},${fixpassive(lepiece3.passive)},${r4243(lepiece3.movespmformat)}
${lepiece4.cost},${fixpassive(lepiece4.passive)},${r4243(lepiece4.movespmformat)}`
    }

    validate(`${lename},${lepiece.class},${pieceset},${lepiece.rarity}

${lepiece.cost},${fixpassive(lepiece.passive)},${r4243(lepiece.movespmformat)}
${otherstuff}`)
  }
  else {validate(makepiece(nameinput));}

  //$("#duht")[0].innerHTML = "Don't Autoupdate Higher Tiers " + "(" + (noTierUpdate?"on":"off") + ")"

});


/* ALSO OLD CODE


  let startingcost = r(randoms[5], minionorchampion?7:20) + (minionorchampion?0:4) + ((r(randoms[9], 101) > 100)?r(randoms[9], 100):0)
  // Determine base cost, with a chance to add a stupidly high graceless number
  rr(5); let extracost1 = r(randoms[5], 1, minionorchampion?3:6)
  rr(5); let extracost2 = r(randoms[5], 1, minionorchampion?3:6)
  rr(5); let extracost3 = r(randoms[5], 1, minionorchampion?3:6)

  let costs = [startingcost, startingcost+extracost1, startingcost+extracost1+extracost2, startingcost+extracost1+extracost2+extracost3]
  let runningcosts = costs.map(x => x+1.5) // Copy this array and use it as running cost that slowly decreases. We give it extra points by the way as "unit advantage".

  let passives = ["", "", "", ""];
  let movesets = [[], [], [], []];

  if (r(randoms[25], 20) > 18) { // Get a passive first, very low chance
    rr(25); let passivepicked = r(randoms[25], genericpassives.length-1); // passivepicked is an index
    rr(25);
    if (passivecosts[passivepicked] < startingcost) {
      passives = passives.map(x => genericpassives[passivepicked].replace("#", r(randoms[25], 2, 6).toString() + "[+1]")) // TODO: maybe change the +1 part
    }
  }

  // Come up with random moves:
  let actionstouse = r(randoms[50], 1, 4) // This is the NUMBER of actions involved
  rr(50)
  //let shuffledactions = shuffleArray(arrayToX(actionvalues.length-1), 50).slice(0, actionstouse)
  let shuffledactions = shuffleArray(arrayToX(182), 50).slice(0, actionstouse)
  // Shuffle an array that goes [0, 1, 2, 3, ...] using a random seed number, then take the first few, which simulates picking that many random elements 




  let genericatoms = 4+r(randoms[25], Math.floor(costs[0]*2)) // Amount dedicated to horizontal/vertical/diagonal stuff
  let genericatomslist = []

  // Come up with the "total range of control" // Note that each "move" is a pair with horizontal symmetry. So Rook has 7*4=28 moves
  let atomstouse = 4+r(randoms[25], Math.floor(costs[0]*2)) // so 30 cost = 60 moves
  let atomslist = []

  while (atomstouse > 0) {  // Generate atoms, which will be two random numbers from -7 to 7 (kinda)
    let pushx = r(randoms[26], 0, 7)
    let pushy = r(randoms[27], -7, 7) // Making this a "topush" array is a pain cause of JS being made by idiots ([3,-1] == [3,-1] is false)
    atomstouse--
    rr(26); rr(27); rr(28);
    if (r(randoms[28], 0, 5) != 5) {pushx = (Math.floor(pushx/2)); pushy = (Math.floor(pushy/2))} //almost always clamp to a more reasonable number
    if (pushx == 0 && pushy == 0) {continue}

    if (atomslist.filter(x => (x[0]==pushx && x[1]==pushy)? true : false).length == 0) {atomslist.push([pushx, pushy])}
  }

  let atomactionassignments = new Array(atomslist.length).fill("") // Because we may get unlucky dupes in atomslist

  for (let i = 0; i < actionstouse; i++) {
    rr(50); let actionthiscycle = shuffledactions[i]
    for (let i = 0; i < atomslist.length; i++) { // Look at each thing in the atomslist and apply an action to it - "remove" the atom if it ends up being used. (Not really removed, we need the indexes still)
      let costforthiscase = evaluatexy(atomslist[i][0], atomslist[i][1], actionthiscycle)

      if (r(randoms[100], 0, 2) == 0 && costforthiscase < runningcosts[0] && atomactionassignments[i] == "") {
        runningcosts[0] -= costforthiscase
        atomactionassignments[i] = actionthiscycle
      } // 1/3 chance to do this
      rr(100)
    }


  }

  // TODO: "move is undefined"????, causing square residue to appear

  // Time to convert all of this into a coherent whole
  let finalmoveset = ""
  // For each action we picked, look into the atomactionassignments. Each index, look into that same index in atomslist and convert it to PM format.

  shuffledactions = shuffledactions.map(x=>numify(x)).sort()
  l(shuffledactions)
  l(atomactionassignments)
  l(atomslist)

  for (let i = 0; i < shuffledactions.length; i++) {
    finalmoveset = finalmoveset + MOVES[shuffledactions[i]].id + ":"
    for (let j = 0; j < atomactionassignments.length; j++) {
      if (atomactionassignments[j] == shuffledactions[i]) {
        finalmoveset = finalmoveset + tob15(fixxy(atomslist[j][0], atomslist[j][1]))
        if (atomslist[j][0] != 0) {finalmoveset = finalmoveset + tob15(fixxy(-atomslist[j][0], atomslist[j][1]))} // horizontal symmetry
      }
    }
    finalmoveset = finalmoveset + ","
  }
  movesets[0] = finalmoveset.replace(/,$/, "") // remove the last comma


  */