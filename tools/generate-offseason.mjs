// Generates assets/js/data-offseason.js from block/wave templates.
// Re-run with `node tools/generate-offseason.mjs` after changing any table below.
import fs from 'node:fs';

const TIERS = ['beginner', 'intermediate', 'advanced'];

const BLOCKS = [
  { id: 1, weeks: [1, 2, 3, 4], name: 'Block 1 — Structural Strength (Eccentric)', focus: 'Tempo eccentric loading, movement quality, tissue prep for the loading ahead.' },
  { id: 2, weeks: [5, 6, 7, 8], name: 'Block 2 — Strength-Power (Isometric)', focus: 'Pause strength, force production, reactive elements introduced.' },
  { id: 3, weeks: [9, 10, 11, 12], name: 'Block 3 — Power-Speed (Realization)', focus: 'Explosive intent, contrast pairing, speed — taper into pre-season.' },
];

// sets/reps baseline (intermediate) by slot type, block id, week-in-block (1-4, 4=deload)
const BASE = {
  strength_primary: {
    1: [[3, 8], [4, 8], [4, 6], [2, 8]],
    2: [[4, 5], [5, 4], [5, 3], [3, 5]],
    3: [[4, 3], [5, 3], [3, 2], [2, 3]],
  },
  strength_secondary: {
    1: [[3, 10], [3, 10], [4, 8], [2, 10]],
    2: [[3, 8], [4, 6], [4, 5], [2, 8]],
    3: [[3, 5], [4, 4], [3, 3], [2, 5]],
  },
  power: {
    1: [[3, 4], [3, 5], [4, 4], [2, 4]],
    2: [[4, 4], [4, 4], [5, 3], [3, 3]],
    3: [[4, 3], [5, 3], [3, 3], [2, 3]],
  },
  accessory: {
    1: [[3, 8], [3, 10], [3, 10], [2, 8]],
    2: [[3, 8], [3, 8], [4, 6], [2, 8]],
    3: [[3, 6], [3, 6], [3, 5], [2, 6]],
  },
  conditioning: {
    1: ['4x30s @ RPE6 (1:2 work:rest)', '5x30s @ RPE6', '6x30s @ RPE7', '3x30s @ RPE5 (deload)'],
    2: ['6x20s @ RPE7 (1:2)', '8x20s @ RPE8', '10x20s @ RPE8-9', '4x20s @ RPE6 (deload)'],
    3: ['8x10s max intent (1:4)', '10x10s max intent', '6x10s @ RPE9 (taper volume)', '4x10s @ RPE6 (freshness, deload)'],
  },
};

const RPE_BY_BLOCK_WEEK = {
  1: [6, 7, 8, 5],
  2: [7, 8, 9, 6],
  3: [7, 8, 9, 6],
};

const REST = {
  strength_primary: '2-3min',
  strength_secondary: '90s',
  power: '2min (full recovery)',
  accessory: '60s',
};

const TIER_ADJUST = {
  beginner: { repDelta: 2, setDelta: 0, rpeCap: 7.5, restPad: '+30s', label: 'Beginner' },
  intermediate: { repDelta: 0, setDelta: 0, rpeCap: 9, restPad: '', label: 'Intermediate' },
  advanced: { repDelta: -1, setDelta: 0, rpeCap: 9.5, restPad: '-15s', label: 'Advanced' },
};

const EXERCISES = {
  beginner: {
    d1: { primary: 'Goblet Squat', secondary: 'Box Step-Up', power: ['Half-Kneeling Box Jump (low box, technique)', 'Half-Kneeling Box Jump (moderate box)', 'Box Jump (bilateral, standing)'], accessory: 'Copenhagen Plank (short-lever, knee)' },
    d2: { primary: 'Incline DB Press', secondary: 'Lat Pulldown', power: ['Med Ball Chest Pass (seated)', 'Med Ball Chest Pass (standing)', 'Reactive Catch-and-Land drill'], accessory: 'Band ER + Face Pull (shoulder health series)' },
    d3: { primary: 'Trap Bar Deadlift (light, technique focus)', secondary: 'DB Romanian Deadlift', power: ['Broad Jump (submax, stick landing)', 'Broad Jump (progressive)', 'SL Broad Jump (assisted progression)'], accessory: 'Nordic Hamstring Eccentric (band-assisted)' },
  },
  intermediate: {
    d1: { primary: 'Back Squat', secondary: 'Rear-Foot Elevated Split Squat', power: ['Half-Kneeling Box Jump (dive-initiation pattern)', 'Depth Drop → Stick (low box)', 'Depth Jump (low box)'], accessory: 'Copenhagen Plank (long-lever, bent knee)' },
    d2: { primary: 'Barbell Bench Press', secondary: 'Weighted Pull-Up', power: ['Med Ball Chest Pass (standing)', 'Reactive Catch-and-Land drill', 'Reactive Catch-and-Land drill (weighted vest optional)'], accessory: 'Band ER + Face Pull (shoulder health series)' },
    d3: { primary: 'Trap Bar Deadlift', secondary: 'Single-Leg RDL', power: ['Lateral Bound (stick)', 'Lateral Bound (continuous x2)', 'Lateral Bound → Sprint 5m'], accessory: 'Nordic Hamstring Eccentric (bodyweight, partner-held)' },
  },
  advanced: {
    d1: { primary: 'Back Squat', secondary: 'RFESS (loaded, tempo eccentric)', power: ['Half-Kneeling Box Jump (weighted vest optional)', 'Depth Jump (mid box)', 'Depth Jump (mid-high box) + Box Jump contrast pair'], accessory: 'Copenhagen Plank (long-lever, straight leg)' },
    d2: { primary: 'Barbell Bench Press', secondary: 'Weighted Pull-Up', power: ['Med Ball Rotational Throw', 'Reactive Catch-and-Land (GK dive-recovery pattern)', 'Reactive Catch-and-Land (GK dive-recovery, reaction cue)'], accessory: 'Band ER + Face Pull (heavier band)' },
    d3: { primary: 'Trap Bar Deadlift', secondary: 'Single-Leg RDL (tempo eccentric)', power: ['SL Lateral Bound (stick)', 'SL Lateral Bound (continuous) + Depth Jump→Sprint 5m', 'Depth Jump → Sprint 5m (max intent) + Contrast Box Jump'], accessory: 'Nordic Hamstring Eccentric (bodyweight + light load)'},
  },
};

const PRIMER_NOTE = 'Warm-up (not counted below, ~12-15min): general — row/bike or jog 3-4min. Mobility — world\'s greatest stretch 5/side, hip 90/90 switch 10/side, leg swings + hip circles 10/direction, ankle CARs. Activation — glute bridge 2x15s, mini-band squat x15, tempo box squat x5 (BW). Bar warm-up on main lift: empty bar x10, 40%x5, 60%x3, 75%x2. Full detail: exercise library.';

function repsFor(tier, base) {
  const adj = TIER_ADJUST[tier];
  return [base[0] + adj.setDelta, Math.max(1, base[1] + adj.repDelta)];
}

function rpeFor(tier, rpe) {
  const adj = TIER_ADJUST[tier];
  return Math.min(rpe, adj.rpeCap);
}

function buildSession(tier, block, weekInBlock, dayKey, dayLabel) {
  const ex = EXERCISES[tier][dayKey];
  const wIdx = weekInBlock - 1;
  const rpe = rpeFor(tier, RPE_BY_BLOCK_WEEK[block.id][wIdx]);
  const deload = weekInBlock === 4;
  const rest = REST;

  const slots = [];

  const [ps, pr] = repsFor(tier, BASE.power[block.id][wIdx]);
  slots.push({
    tag: 'Power',
    exercise: ex.power[block.id - 1],
    sets: ps, reps: pr,
    load: deload ? 'Submax, focus quality' : `RPE ${rpe - 1} intent (near-max effort, not to failure)`,
    rest: rest.power,
    notes: 'Full recovery between reps — quality over fatigue.',
  });

  const [s1s, s1r] = repsFor(tier, BASE.strength_primary[block.id][wIdx]);
  slots.push({
    tag: 'Strength',
    exercise: ex.primary,
    sets: s1s, reps: s1r,
    load: `RPE ${rpe}`,
    rest: rest.strength_primary,
    notes: block.id === 1 ? 'Tempo 3-1-1 (3s eccentric, 1s pause, 1s concentric) — eccentric phase.' : block.id === 2 ? 'Isometric pause 3s at sticking point (X:3:X tempo) — RFD phase.' : 'Explosive concentric intent every rep — power/realization phase.',
  });

  const [s2s, s2r] = repsFor(tier, BASE.strength_secondary[block.id][wIdx]);
  slots.push({
    tag: 'Unilateral',
    exercise: ex.secondary,
    sets: s2s, reps: s2r + '/side',
    load: `RPE ${Math.max(rpe - 1, 4)}`,
    rest: rest.strength_secondary,
    notes: '',
  });

  const [as, ar] = repsFor(tier, BASE.accessory[block.id][wIdx]);
  slots.push({
    tag: 'Durability',
    exercise: ex.accessory,
    sets: as, reps: ar + '/side',
    load: deload ? 'Light' : `RPE ${Math.max(rpe - 2, 4)}`,
    rest: rest.accessory,
    notes: 'Groin/hamstring/shoulder durability — do not skip, this is injury-prevention work.',
  });

  if (dayKey === 'd3') {
    slots.push({
      tag: 'Conditioning',
      exercise: 'GK Reactive Shuttle Finisher',
      sets: '—', reps: BASE.conditioning[block.id][wIdx],
      load: '', rest: 'per protocol',
      notes: 'Short shuttle/reactive-agility intervals — see exercise library for pattern.',
    });
  }

  return {
    day: dayLabel,
    title: dayKey === 'd1' ? 'Lower Strength + Power' : dayKey === 'd2' ? 'Upper Body + Core + Reactive' : 'Full Body Power + GK Movement',
    meta: (deload ? 'Deload — ' : '') + '~75-90min',
    primer: PRIMER_NOTE,
    slots,
  };
}

const data = { tiers: {} };

for (const tier of TIERS) {
  data.tiers[tier] = { blocks: BLOCKS.map(b => ({ id: b.id, name: b.name, focus: b.focus, weeks: b.weeks })), weeks: {} };
  for (const block of BLOCKS) {
    block.weeks.forEach((weekNum, i) => {
      const weekInBlock = i + 1;
      data.tiers[tier].weeks[weekNum] = {
        blockId: block.id,
        deload: weekInBlock === 4,
        sessions: [
          buildSession(tier, block, weekInBlock, 'd1', 'Day 1'),
          buildSession(tier, block, weekInBlock, 'd2', 'Day 2'),
          buildSession(tier, block, weekInBlock, 'd3', 'Day 3'),
        ],
      };
    });
  }
}

const out = `// AUTO-GENERATED by tools/generate-offseason.mjs — do not hand-edit, edit the tables in that file instead.\nwindow.OFFSEASON_DATA = ${JSON.stringify(data, null, 2)};\n`;
fs.writeFileSync(new URL('../assets/js/data-offseason.js', import.meta.url), out);
console.log('wrote assets/js/data-offseason.js');
