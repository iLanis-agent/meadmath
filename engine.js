/* MeadMath engine - honest mead math. Pure functions, no DOM. */
var MeadEngine = (function () {
  var PPG = 35; /* gravity points per lb of honey per gallon */
  var LB_PER_GAL_HONEY = 12; /* honey weighs ~12 lb/gal, so 1 lb displaces 1/12 gal */
  var BOTTLE_OZ = 25.36; /* 750 ml */

  function r1(x) { return Math.round(x * 10) / 10; }
  function r2(x) { return Math.round(x * 100) / 100; }
  function r3(x) { return Math.round(x * 1000) / 1000; }

  /* lbs of honey to hit a target original gravity in the given batch size */
  function honeyLbsForOG(gallons, og) {
    return r1((og - 1) * 1000 * gallons / PPG);
  }

  /* gravity you actually get from a weighed amount of honey */
  function ogFromHoney(gallons, lbs) {
    return r3(1 + lbs * PPG / (1000 * gallons));
  }

  function abv(og, fg) {
    if (fg > og) throw new Error('FG above OG - nothing fermented');
    return r1((og - fg) * 131.25);
  }

  /* the FG a yeast with this alcohol tolerance (%) will actually reach */
  function fgFromTolerance(og, tolerance) {
    return Math.max(0.990, r3(og - tolerance / 131.25));
  }

  function sweetness(fg) {
    if (fg < 1.000) return 'dry';
    if (fg < 1.010) return 'off-dry';
    if (fg < 1.020) return 'semi-sweet';
    return 'sweet';
  }

  function bottles(gallons, bottleOz) {
    var oz = bottleOz || BOTTLE_OZ;
    return Math.ceil(gallons * 128 / oz);
  }

  /* water to top up after the honey goes in (honey takes up space too) */
  function waterGal(gallons, honeyLbs) {
    var w = gallons - honeyLbs / LB_PER_GAL_HONEY;
    if (w <= 0) throw new Error('more honey than batch - impossible');
    return r2(w);
  }

  /* TOSNA-style Fermaid-O schedule: total scales with target ABV, split 40/30/20/10 */
  function nutrient(gallons, targetAbv) {
    var total = r1(2.0 * gallons * targetAbv / 12);
    return {
      total: total,
      additions: [0.4, 0.3, 0.2, 0.1].map(function (f) { return r1(total * f); }),
      at: ['at pitch', '24 h', '48 h', '1/3 sugar break']
    };
  }

  /* primary fermentation window by must temperature */
  function timeline(tempF) {
    if (tempF >= 75) return { min: 2, max: 3, note: 'warm and fast - watch for fusel heat, keep it under 78' };
    if (tempF >= 68) return { min: 3, max: 5, note: 'the sweet spot - steady and clean' };
    if (tempF >= 60) return { min: 5, max: 8, note: 'cool and slow - cleaner esters, more patience' };
    return { min: 8, max: 12, note: 'stuck-ferment risk below 60F - warm it up before you blame the yeast' };
  }

  /* hydrometer temperature correction (standard polynomial, per-degree F) */
  function tempCorrectSG(sg, tempF, calF) {
    var cal = calF || 60;
    function d(t) {
      return 1.313454 - 0.132674 * t + 0.002057793 * t * t - 0.000002627471 * t * t * t;
    }
    return r3(sg + (d(tempF) - d(cal)) * 0.001);
  }

  /* honey (oz per batch) to raise gravity by the given points when backsweetening */
  function backsweetenOz(gallons, points) {
    return r1(points * gallons * 16 / PPG);
  }

  var YEASTS = {
    bread: { name: 'Bread yeast (JAOM style)', tolerance: 12 },
    d47: { name: 'Lalvin D47', tolerance: 14 },
    k1v: { name: 'Lalvin K1-V1116', tolerance: 16 },
    ec1118: { name: 'Lalvin EC-1118', tolerance: 18 }
  };

  return {
    PPG: PPG, BOTTLE_OZ: BOTTLE_OZ, YEASTS: YEASTS,
    honeyLbsForOG: honeyLbsForOG, ogFromHoney: ogFromHoney, abv: abv,
    fgFromTolerance: fgFromTolerance, sweetness: sweetness, bottles: bottles,
    waterGal: waterGal, nutrient: nutrient, timeline: timeline,
    tempCorrectSG: tempCorrectSG, backsweetenOz: backsweetenOz
  };
})();
if (typeof module !== 'undefined' && module.exports) module.exports = MeadEngine;
