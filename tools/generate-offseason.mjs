// AUTO-REGENERATE: node tools/generate-offseason.mjs
import fs from 'node:fs';

const TIERS = ['beginner', 'intermediate', 'advanced'];

const BLOCKS = [
  { id: 1, weeks: [1,2,3,4], name: 'Block 1 — Structural Strength (Eccentric)', focus: 'Slow eccentrics (3-1-1), tissue prep, movement quality.' },
  { id: 2, weeks: [5,6,7,8], name: 'Block 2 — Strength-Power (Isometric)', focus: 'Pause strength (X:3:X), rate of force development, reactive work begins.' },
  { id: 3, weeks: [9,10,11,12], name: 'Block 3 — Power-Speed (Realization)', focus: 'Explosive intent every rep. Taper into pre-season.' },
];

// [sets, reps] by slot type → block id → week-in-block index (0=wk1, 1=wk2, 2=wk3, 3=deload)
// Intermediate baseline. Tier adjust applied separately.
const BASE = {
  power:        { 1:[[3,4],[3,5],[4,4],[2,4]],   2:[[4,3],[4,4],[5,3],[2,3]],   3:[[4,3],[5,3],[4,3],[2,3]]  },
  squat:        { 1:[[3,8],[4,8],[4,6],[2,6]],    2:[[4,5],[5,4],[5,3],[3,4]],   3:[[4,3],[5,3],[4,3],[2,3]]  },
  unilateral:   { 1:[[3,8],[3,8],[4,6],[2,6]],    2:[[3,6],[4,6],[4,5],[2,5]],   3:[[3,5],[4,4],[3,4],[2,4]]  },
  hinge:        { 1:[[3,10],[3,10],[4,8],[2,8]],  2:[[3,8],[4,6],[4,5],[2,5]],   3:[[3,5],[4,5],[3,4],[2,4]]  },
  hip_thrust:   { 1:[[3,12],[3,12],[4,10],[2,10]],2:[[4,8],[4,8],[5,6],[2,8]],   3:[[4,6],[5,5],[3,5],[2,5]]  },
  nordic:       { 1:[[3,5],[3,6],[4,5],[2,5]],    2:[[3,5],[3,5],[4,4],[2,5]],   3:[[3,4],[4,4],[3,4],[2,4]]  },
  copenh:       { 1:[[3,8],[3,10],[3,10],[2,8]],  2:[[3,8],[3,8],[4,8],[2,8]],   3:[[3,6],[3,6],[3,6],[2,6]]  },
  press:        { 1:[[3,8],[4,8],[4,6],[2,6]],    2:[[4,5],[5,4],[5,3],[3,4]],   3:[[4,3],[5,3],[4,3],[2,3]]  },
  pull:         { 1:[[3,10],[3,10],[4,8],[2,8]],  2:[[3,8],[4,6],[4,5],[2,6]],   3:[[3,5],[4,5],[3,4],[2,5]]  },
  shoulder:     { 1:[[3,15],[3,15],[3,15],[2,12]],2:[[3,15],[3,15],[3,12],[2,12]],3:[[3,12],[3,12],[3,12],[2,10]] },
  core_antirot: { 1:[[3,8],[3,10],[3,10],[2,8]],  2:[[3,8],[3,8],[4,8],[2,8]],   3:[[3,8],[3,10],[3,10],[2,8]] },
  core_antiext: { 1:[[3,8],[3,10],[3,10],[2,8]],  2:[[3,8],[3,8],[4,8],[2,8]],   3:[[3,8],[3,8],[3,8],[2,6]]  },
  lat_power:    { 1:[[3,4],[3,5],[4,4],[2,4]],    2:[[3,4],[4,4],[4,3],[2,3]],   3:[[4,3],[5,3],[4,3],[2,3]]  },
  lat_squat:    { 1:[[3,8],[3,8],[3,8],[2,6]],    2:[[3,8],[3,8],[3,8],[2,6]],   3:[[3,6],[3,8],[3,8],[2,6]]  },
};

// RPE per block → week index. Deload (index 3) keeps ~80% of peak — volume cuts, not intensity.
const RPE = {
  1: [6,   7,   8,   7  ],
  2: [7,   7.5, 8.5, 7  ],
  3: [7,   8,   9,   7.5],
};

const TIER_ADJUST = {
  beginner:     { rpeCap: 7.5, repDelta: +2, setDelta:  0 },
  intermediate: { rpeCap: 8.5, repDelta:  0, setDelta:  0 },
  advanced:     { rpeCap: 9.5, repDelta: -1, setDelta: +1 },
};

const REST = {
  power:        '2-3min',
  squat:        '2-3min',
  unilateral:   '90s',
  hinge:        '2min',
  hip_thrust:   '90s',
  nordic:       '2min',
  copenh:       '60s',
  press:        '2-3min',
  pull:         '90s',
  shoulder:     '45s',
  core_antirot: '60s',
  core_antiext: '60s',
  lat_power:    '2-3min',
  lat_squat:    '60s',
};

// Exercises per tier. String = same across all blocks. Array[3] = per-block progression.
const EX = {
  power_d1: {
    beginner:     ['Half-Kneeling Box Jump (low box)',
                   'Box Jump (moderate height)',
                   'Box Jump (max intent)'],
    intermediate: ['Depth Drop → Box Jump (low box)',
                   'Depth Jump (low-mod box)',
                   'Depth Jump + Box Jump contrast (2+2)'],
    advanced:     ['Depth Jump (moderate box)',
                   'Depth Jump → Sprint 5m',
                   'Drop Jump → Max CMJ contrast (2+2)'],
  },
  squat_d1: {
    beginner:     'Back Squat (light — technique first)',
    intermediate: 'Back Squat',
    advanced:     'Back Squat (heavy)',
  },
  rfess_d1: {
    beginner:     'RFESS (bodyweight or light DB)',
    intermediate: 'RFESS (DB/KB loaded)',
    advanced:     'RFESS (heavy DB or barbell)',
  },
  hinge_d1: {
    beginner:     'Romanian Deadlift (DB, 3s down)',
    intermediate: 'Romanian Deadlift (barbell)',
    advanced:     'Single-Leg RDL (barbell or heavy KB)',
  },
  nordic_d1: {
    beginner:     ['Nordic Eccentric (band-assisted, 5s down)',
                   'Nordic Eccentric (anchored, 5s down)',
                   'Nordic Eccentric (anchored, 4s down)'],
    intermediate: ['Nordic Eccentric (anchored, 5s down)',
                   'Nordic Eccentric (anchored, 4s down)',
                   'Weighted Nordic (5-10kg plate)'],
    advanced:     ['Nordic Eccentric (bodyweight, 4s down)',
                   'Weighted Nordic (10kg plate)',
                   'Weighted Nordic (12-15kg)'],
  },
  copenh_d1: {
    beginner:     ['Copenhagen Plank (short-lever hold)',
                   'Copenhagen Plank (long-lever hold)',
                   'Copenhagen Dynamic (controlled)'],
    intermediate: ['Copenhagen Plank (long-lever hold)',
                   'Copenhagen Dynamic',
                   'Copenhagen Dynamic (+5kg on hip)'],
    advanced:     ['Copenhagen Dynamic (long-lever)',
                   'Copenhagen Dynamic (+10kg)',
                   'Copenhagen Dynamic (+12-15kg)'],
  },
  power_d2: {
    beginner:     ['Med Ball Chest Pass (seated, 3kg)',
                   'Med Ball Chest Pass (standing, 3kg)',
                   'Med Ball Chest Pass (reactive, 3kg)'],
    intermediate: ['Med Ball Chest Pass (standing, 4kg)',
                   'Med Ball Overhead Slam (4-6kg)',
                   'Med Ball Rotational Pass (4-5kg)'],
    advanced:     ['Med Ball Rotational Throw (5-6kg)',
                   'Med Ball Overhead Slam (6-8kg)',
                   'Med Ball Rotational Throw + step-off (5-6kg)'],
  },
  press_d2: {
    beginner:     'Barbell Bench Press',
    intermediate: ['Barbell Bench Press',
                   'Push Press',
                   'Push Press'],
    advanced:     ['Barbell Bench Press',
                   'Push Press',
                   'Push Press (heavy)'],
  },
  pull_d2: {
    beginner:     ['Lat Pulldown',
                   'Lat Pulldown',
                   'Assisted Pull-Up or Lat Pulldown'],
    intermediate: ['Seated Cable Row',
                   'Seated Cable Row',
                   'Pull-Up'],
    advanced:     ['Weighted Pull-Up',
                   'Weighted Pull-Up',
                   'Barbell Bent-Over Row'],
  },
  core_antirot_d2: {
    beginner:     ['Pallof Press (kneeling, 3s holds)',
                   'Pallof Press (standing)',
                   'Pallof Press (standing, slow)'],
    intermediate: ['Pallof Press (standing)',
                   'Pallof Press + press-out',
                   'Pallof Press + rotation'],
    advanced:     ['Pallof Press + press-out',
                   'Pallof Press + rotation',
                   'Single-Arm Cable Anti-Rotation (heavy)'],
  },
  core_antiext_d2: {
    beginner:     ['Plank (elbows, 30-40s)',
                   'Ab Wheel Rollout (kneeling, short)',
                   'Ab Wheel Rollout (kneeling)'],
    intermediate: ['Ab Wheel Rollout (kneeling)',
                   'Ab Wheel Rollout (kneeling, full range)',
                   'Ab Wheel Rollout (try standing)'],
    advanced:     ['Ab Wheel Rollout (kneeling, full range)',
                   'Ab Wheel Rollout (standing, short)',
                   'Ab Wheel Rollout (standing)'],
  },
  lat_power_d3: {
    beginner:     ['Lateral Bound (stick landing)',
                   'SL Lateral Bound (stick)',
                   'SL Lateral Bound (continuous)'],
    intermediate: ['SL Lateral Bound (stick)',
                   'SL Lateral Bound (continuous)',
                   'SL Lateral Bound → Sprint 5m'],
    advanced:     ['SL Lateral Bound (continuous)',
                   'SL Lateral Bound → Sprint 5m',
                   'Reactive Lateral Bound (cue start)'],
  },
  hinge_d3: {
    beginner:     ['Trap Bar Deadlift (light, 3s down)',
                   'Trap Bar Deadlift (moderate)',
                   'Trap Bar Deadlift (explosive pull)'],
    intermediate: ['Trap Bar Deadlift (3s down)',
                   'Trap Bar Deadlift (2s down)',
                   'Trap Bar Deadlift (heavy, explosive)'],
    advanced:     ['Conventional Deadlift (3s down)',
                   'Conventional Deadlift (heavy)',
                   'Conventional Deadlift (near-max)'],
  },
  hip_thrust_d3: {
    beginner:     'Hip Thrust (barbell, 2s squeeze at top)',
    intermediate: 'Hip Thrust (barbell, drive fast)',
    advanced:     'Hip Thrust (heavy, 1.5-rep method)',
  },
  lat_squat_d3: {
    beginner:     'Cossack Squat (bodyweight)',
    intermediate: 'Lateral Squat (DB)',
    advanced:     'Lateral Squat (heavy DB or landmine)',
  },
};

const SHOULDER_SERIES = 'Shoulder series: Band ER 15 + Face Pull 15 + W-Raise 12';

// GK reactive drills per block — solo/cone-based, no partner needed
const GK_REACTIVE = [
  'Lateral Cone Shuffle (5m, sharp cuts)',
  'Box Drop → Lateral Dive + Getup',
  'Dive-Recovery Circuit (dive, getup, sprint 5m)',
];

const CONDITIONING = [
  '4×30s lateral shuttles @ RPE 6 (1:2 rest)',
  '6×20s T-drill cuts @ RPE 7-8 (1:3 rest)',
  '8×10s reactive sprints @ max (1:4 rest)',
];

const PRIMER_D1 = 'Warm-up ~12min: bike/jog 3min · hips (90/90, leg swings) · glutes (bridge, mini-band) · bar ramp-up. ⚠️ U13-U14: RPE cap 7.';
const PRIMER_D2 = 'Warm-up ~10min: row 3min · shoulders (circles, pull-aparts, face pulls) · bar ramp-up. ⚠️ U13-U14: RPE cap 7.';
const PRIMER_D3 = 'Warm-up ~12min: shuffle/bike 3min · hips + ankles · band walks, SL bridge · bar ramp-up. ⚠️ U13-U14: RPE cap 7, swap bounds for shuffles.';

function getEx(obj, tier, blockIdx) {
  const v = obj[tier];
  return Array.isArray(v) ? v[blockIdx] : v;
}

function adj(tier, base) {
  const t = TIER_ADJUST[tier];
  return [base[0] + t.setDelta, Math.max(1, base[1] + t.repDelta)];
}

function rpeNum(tier, blockId, wIdx) {
  return Math.min(RPE[blockId][wIdx], TIER_ADJUST[tier].rpeCap);
}

function rpeStr(tier, blockId, wIdx) {
  return `RPE ${rpeNum(tier, blockId, wIdx)}`;
}

function rpeSecondary(tier, blockId, wIdx) {
  return `RPE ${Math.max(rpeNum(tier, blockId, wIdx) - 1, 4)}`;
}

function tempoNote(blockId) {
  if (blockId === 1) return '3-1-1 tempo — 3s down, 1s pause.';
  if (blockId === 2) return 'Pause 3s at sticking point.';
  return 'Explosive intent — bar speed.';
}

function buildDay1(tier, block, wIdx) {
  const bId = block.id;
  const deload = wIdx === 3;
  const [ps, pr] = adj(tier, BASE.power[bId][wIdx]);
  const [ss, sr] = adj(tier, BASE.squat[bId][wIdx]);
  const [us, ur] = adj(tier, BASE.unilateral[bId][wIdx]);
  const [hs, hr] = adj(tier, BASE.hinge[bId][wIdx]);
  const [ns, nr] = adj(tier, BASE.nordic[bId][wIdx]);
  const [cs, cr] = adj(tier, BASE.copenh[bId][wIdx]);
  const cohold = (tier === 'beginner' && bId === 1);
  return {
    day: 'Day 1', title: 'Lower Strength + Power',
    meta: '~75-85min',
    primer: PRIMER_D1,
    slots: [
      { tag: 'Power', exercise: getEx(EX.power_d1, tier, bId - 1), sets: ps, reps: pr,
        load: deload ? 'Submax' : 'Max intent', rest: REST.power,
        notes: 'Full rest between reps — quality, not conditioning.' },
      { tag: 'Squat', exercise: getEx(EX.squat_d1, tier, bId - 1), sets: ss, reps: sr,
        load: rpeStr(tier, bId, wIdx), rest: REST.squat, notes: tempoNote(bId) },
      { tag: 'Unilateral', exercise: getEx(EX.rfess_d1, tier, bId - 1), sets: us, reps: `${ur}/side`,
        load: rpeSecondary(tier, bId, wIdx), rest: REST.unilateral,
        notes: 'Dive push-off pattern. Control the descent.' },
      { tag: 'Hinge', exercise: getEx(EX.hinge_d1, tier, bId - 1), sets: hs, reps: hr,
        load: rpeSecondary(tier, bId, wIdx), rest: REST.hinge,
        notes: 'Hinge at hip, bar stays close.' },
      { tag: 'Prehab — Nordic', exercise: getEx(EX.nordic_d1, tier, bId - 1), sets: ns, reps: nr,
        load: 'Bodyweight', rest: REST.nordic,
        notes: 'Never skip — #1 hamstring protection.' },
      { tag: 'Prehab — Copenhagen', exercise: getEx(EX.copenh_d1, tier, bId - 1), sets: cs,
        reps: cohold ? `${cr}s hold/side` : `${cr}/side`,
        load: 'Bodyweight', rest: REST.copenh,
        notes: 'Groin durability — progress slow.' },
    ],
  };
}

function buildDay2(tier, block, wIdx) {
  const bId = block.id;
  const deload = wIdx === 3;
  const [ps, pr] = adj(tier, BASE.power[bId][wIdx]);
  const [prs, prr] = adj(tier, BASE.press[bId][wIdx]);
  const [pls, plr] = adj(tier, BASE.pull[bId][wIdx]);
  const [shs, shr] = adj(tier, BASE.shoulder[bId][wIdx]);
  const [ars, arr] = adj(tier, BASE.core_antirot[bId][wIdx]);
  const [aes, aer] = adj(tier, BASE.core_antiext[bId][wIdx]);
  const pressEx = getEx(EX.press_d2, tier, bId - 1);
  const isPushPress = pressEx.toLowerCase().includes('push press');
  return {
    day: 'Day 2', title: 'Upper Body + Core',
    meta: '~65-75min',
    primer: PRIMER_D2,
    slots: [
      { tag: 'Power', exercise: getEx(EX.power_d2, tier, bId - 1), sets: ps, reps: pr,
        load: deload ? 'Submax' : 'Max intent', rest: REST.power,
        notes: 'Full reset between throws.' },
      { tag: 'Press', exercise: pressEx, sets: prs, reps: prr,
        load: rpeStr(tier, bId, wIdx), rest: REST.press,
        notes: isPushPress ? 'Dip-drive-press. Catch with elbows through.' : tempoNote(bId) },
      { tag: 'Pull', exercise: getEx(EX.pull_d2, tier, bId - 1), sets: pls, reps: plr,
        load: rpeSecondary(tier, bId, wIdx), rest: REST.pull,
        notes: 'Scaps first, elbows down and back.' },
      { tag: 'Shoulder Health', exercise: SHOULDER_SERIES, sets: shs, reps: shr,
        load: 'Light (RPE 5-6)', rest: REST.shoulder,
        notes: 'Injury prevention — never grind.' },
      { tag: 'Core — Anti-Rot', exercise: getEx(EX.core_antirot_d2, tier, bId - 1), sets: ars, reps: `${arr}/side`,
        load: 'Light-moderate', rest: REST.core_antirot,
        notes: 'Resist rotation — spine stays still.' },
      { tag: 'Core — Anti-Ext', exercise: getEx(EX.core_antiext_d2, tier, bId - 1), sets: aes, reps: aer,
        load: 'Bodyweight', rest: REST.core_antiext,
        notes: 'Ribs down, no back arch.' },
    ],
  };
}

function buildDay3(tier, block, wIdx) {
  const bId = block.id;
  const deload = wIdx === 3;
  const [lps, lpr] = adj(tier, BASE.lat_power[bId][wIdx]);
  const [hs, hr] = adj(tier, BASE.hinge[bId][wIdx]);
  const [hts, htr] = adj(tier, BASE.hip_thrust[bId][wIdx]);
  const [lss, lsr] = adj(tier, BASE.lat_squat[bId][wIdx]);
  const condStr = deload ? '3×20s easy shuffle @ RPE 5' : CONDITIONING[bId - 1];
  const [grs] = adj(tier, [bId === 1 ? 2 : 3, 0]);
  return {
    day: 'Day 3', title: 'Full Body Power + GK Movement',
    meta: '~70-80min',
    primer: PRIMER_D3,
    slots: [
      { tag: 'Lateral Power', exercise: getEx(EX.lat_power_d3, tier, bId - 1), sets: lps, reps: `${lpr}/side`,
        load: deload ? 'Submax' : 'Max effort', rest: REST.lat_power,
        notes: 'Push-off power. Stick every landing.' },
      { tag: 'Hinge', exercise: getEx(EX.hinge_d3, tier, bId - 1), sets: hs, reps: hr,
        load: rpeStr(tier, bId, wIdx), rest: REST.hinge, notes: tempoNote(bId) },
      { tag: 'Hip Power', exercise: getEx(EX.hip_thrust_d3, tier, bId - 1), sets: hts, reps: htr,
        load: rpeSecondary(tier, bId, wIdx), rest: REST.hip_thrust,
        notes: 'Full extension, 2s hold at top.' },
      { tag: 'Lateral Pattern', exercise: getEx(EX.lat_squat_d3, tier, bId - 1), sets: lss, reps: `${lsr}/side`,
        load: 'Quality over load', rest: REST.lat_squat,
        notes: 'Heel down, torso tall.' },
      { tag: 'GK Reactive', exercise: GK_REACTIVE[bId - 1], sets: grs, reps: bId === 1 ? '6' : bId === 2 ? '6/side' : '8',
        load: '—', rest: '90s',
        notes: 'Movement quality — full reset between reps.' },
      { tag: 'Conditioning', exercise: condStr, sets: '—', reps: '—',
        load: 'Per protocol', rest: 'Per protocol',
        notes: 'Finisher — stop if form breaks.' },
    ],
  };
}

const data = { tiers: {} };
for (const tier of TIERS) {
  data.tiers[tier] = {
    blocks: BLOCKS.map(b => ({ id: b.id, name: b.name, focus: b.focus, weeks: b.weeks })),
    weeks: {},
  };
  for (const block of BLOCKS) {
    block.weeks.forEach((weekNum, wIdx) => {
      data.tiers[tier].weeks[weekNum] = {
        blockId: block.id,
        deload: wIdx === 3,
        sessions: [buildDay1(tier, block, wIdx), buildDay2(tier, block, wIdx), buildDay3(tier, block, wIdx)],
      };
    });
  }
}

const out = `// AUTO-GENERATED by tools/generate-offseason.mjs — do not hand-edit. Edit the tables in that file.\nwindow.OFFSEASON_DATA = ${JSON.stringify(data, null, 2)};\n`;
fs.writeFileSync(new URL('../assets/js/data-offseason.js', import.meta.url), out);
console.log('wrote assets/js/data-offseason.js');
