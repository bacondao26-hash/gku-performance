// AUTO-REGENERATE: node tools/generate-inseason.mjs
import fs from 'node:fs';

const TIERS = ['beginner', 'intermediate', 'advanced'];
const TOTAL_WEEKS = 18;

const PHASES = [
  { id: 1, weeks: [1,2,3,4,5,6], name: 'Early Season', focus: 'Full intensity — bank strength while legs are fresh.' },
  { id: 2, weeks: [7,8,9,10,11,12], name: 'Mid Season', focus: '2 matches this week? Drop to 1 strength session: squat + Nordic + Copenhagen only.' },
  { id: 3, weeks: [13,14,15,16,17,18], name: 'Late Season / Push', focus: 'Lowest volume, intensity stays. Freshness wins games — trim sets, never RPE.' },
];

const LIGHT_WEEKS = [6, 12, 18];

// [sets, reps] per phase. Light week = sets - 1, same RPE.
const PHASE_SETS = {
  squat:  { 1: [3, 5], 2: [3, 4], 3: [2, 4] },
  hip:    { 1: [3, 8], 2: [3, 6], 3: [2, 6] },
  hinge:  { 1: [3, 5], 2: [3, 4], 3: [2, 4] },
  press:  { 1: [3, 6], 2: [3, 5], 3: [2, 5] },
  pull:   { 1: [3, 8], 2: [3, 6], 3: [2, 6] },
  power:  { 1: [3, 4], 2: [3, 3], 3: [2, 3] },
};

const TIER = {
  beginner: {
    rpe: 6.5, rpe2: 6,
    squat: 'Back Squat (technique first)',
    hinge: 'Trap Bar Deadlift (moderate)',
    press: 'Barbell Bench Press',
    pull:  'Lat Pulldown',
    jump:  'Box Jump (submax)',
    throw: 'Med Ball Chest Pass (3kg)',
    nordic: 'Nordic Eccentric (band-assisted)',
    copenh: 'Copenhagen Plank (short-lever hold)',
    copenhReps: '15-20s/side',
  },
  intermediate: {
    rpe: 7.5, rpe2: 7,
    squat: 'Back Squat or Trap Bar',
    hinge: 'Trap Bar Deadlift',
    press: 'Push Press',
    pull:  'Pull-Up or DB Row',
    jump:  'Jump Squat (light, max speed)',
    throw: 'Med Ball Rotational Pass (4kg)',
    nordic: 'Nordic Eccentric (anchored)',
    copenh: 'Copenhagen Plank (long-lever hold)',
    copenhReps: '20-25s/side',
  },
  advanced: {
    rpe: 8, rpe2: 7.5,
    squat: 'Back Squat or Trap Bar (heavy)',
    hinge: 'Trap Bar Deadlift or RDL',
    press: 'Push Press',
    pull:  'Weighted Pull-Up',
    jump:  'Jump Squat or Depth Jump (low box)',
    throw: 'Med Ball Rotational Throw (5kg)',
    nordic: 'Nordic Eccentric (bodyweight)',
    copenh: 'Copenhagen Dynamic',
    copenhReps: '6-8/side',
  },
};

const YOUTH_FLAG = ' ⚠️ U13-U14: RPE cap 7.';

function sr(slot, phaseId, light) {
  const [s, r] = PHASE_SETS[slot][phaseId];
  return [light ? Math.max(s - 1, 1) : s, r];
}

function strengthA(tier, phaseId, light) {
  const t = TIER[tier];
  const [pS, pR] = sr('power', phaseId, light);
  const [sS, sR] = sr('squat', phaseId, light);
  const [hS, hR] = sr('hip', phaseId, light);
  return {
    day: 'Strength A', title: 'Lower — Squat + Hip',
    meta: '~50-60min',
    primer: 'Warm-up ~10min: bike 3min · hips · glutes · bar ramp-up.' + YOUTH_FLAG,
    slots: [
      { tag: 'Power', exercise: t.jump, sets: pS, reps: pR, load: light ? 'Submax' : 'Max intent', rest: '2min', notes: 'Quality reps only — stop set if speed drops.' },
      { tag: 'Squat', exercise: t.squat, sets: sS, reps: sR, load: `RPE ${t.rpe}`, rest: '2-3min', notes: 'Intensity stays high in-season — only volume drops.' },
      { tag: 'Hip Power', exercise: 'Hip Thrust (barbell)', sets: hS, reps: hR, load: `RPE ${t.rpe2}`, rest: '90s', notes: 'Dive push-off transfer.' },
      { tag: 'Prehab — Nordic', exercise: t.nordic, sets: 2, reps: tier === 'advanced' ? 5 : 4, load: 'Bodyweight', rest: '2min', notes: 'Never the exercise you cut.' },
      { tag: 'Prehab — Copenhagen', exercise: t.copenh, sets: 2, reps: t.copenhReps, load: 'Bodyweight', rest: '60s', notes: 'Congested week keepers: squat + Nordic + this.' },
    ],
  };
}

function strengthB(tier, phaseId, light) {
  const t = TIER[tier];
  const [pS, pR] = sr('power', phaseId, light);
  const [hS, hR] = sr('hinge', phaseId, light);
  const [prS, prR] = sr('press', phaseId, light);
  const [plS, plR] = sr('pull', phaseId, light);
  return {
    day: 'Strength B', title: 'Upper + Hinge',
    meta: '~45-55min',
    primer: 'Warm-up ~8min: row 3min · shoulders · build-up sets.' + YOUTH_FLAG,
    slots: [
      { tag: 'Power', exercise: t.throw, sets: pS, reps: pR, load: light ? 'Submax' : 'Max intent', rest: '90s', notes: 'Full reset between throws.' },
      { tag: 'Hinge', exercise: t.hinge, sets: hS, reps: hR, load: `RPE ${t.rpe}`, rest: '2min', notes: 'Bar speed over grinding.' },
      { tag: 'Press', exercise: t.press, sets: prS, reps: prR, load: `RPE ${t.rpe2}`, rest: '2min', notes: t.press.includes('Push Press') ? 'Dip-drive-press.' : 'Control the eccentric.' },
      { tag: 'Pull', exercise: t.pull, sets: plS, reps: plR, load: `RPE ${t.rpe2}`, rest: '90s', notes: 'Shoulder robustness for diving load.' },
      { tag: 'Core — Anti-Rot', exercise: 'Pallof Press (standing)', sets: 2, reps: '8/side', load: 'Light-moderate', rest: '60s', notes: 'Resist rotation.' },
    ],
  };
}

function mobilityA() {
  return {
    day: 'Mobility A', title: 'Hip & Lower Mobility',
    meta: '~20-25min',
    primer: 'Best on MD+1. Easy movement, no forcing range.',
    slots: [
      { tag: 'Mobility', exercise: 'Hip 90/90 Flow', sets: 2, reps: '5/side', load: '—', rest: '—', notes: 'Split-save hip range.' },
      { tag: 'Mobility', exercise: 'Ankle Dorsiflexion (WBLT)', sets: 2, reps: '8/side', load: '—', rest: '—', notes: 'Low-dive depth.' },
      { tag: 'Mobility', exercise: 'Adductor Rock-Back', sets: 2, reps: '45s/side', load: '—', rest: '—', notes: 'Groin length.' },
      { tag: 'Mobility', exercise: 'Couch Stretch', sets: 2, reps: '45s/side', load: '—', rest: '—', notes: 'Undoes crouched set-position.' },
      { tag: 'Recovery', exercise: 'Cossack Squat (slow flow)', sets: 2, reps: '5/side', load: 'Bodyweight', rest: '—', notes: 'Own the bottom position.' },
    ],
  };
}

function mobilityB() {
  return {
    day: 'Mobility B', title: 'Shoulder & T-Spine Mobility',
    meta: '~20-25min',
    primer: 'Slot anywhere. No loading, no forcing range.',
    slots: [
      { tag: 'Mobility', exercise: 'T-Spine Rotation', sets: 2, reps: '8/side', load: '—', rest: '—', notes: 'Throwing range.' },
      { tag: 'Mobility', exercise: 'Band ER + Sleeper Stretch', sets: 2, reps: '10 + 30s/side', load: '—', rest: '—', notes: 'Posterior shoulder health.' },
      { tag: 'Shoulder Health', exercise: 'Shoulder series: Band ER 12 + Face Pull 12 + W-Raise 10', sets: 2, reps: 'as listed', load: 'Light', rest: '45s', notes: '' },
      { tag: 'Technical', exercise: 'Landing Mechanics (low volume)', sets: 2, reps: 4, load: 'Bodyweight', rest: '60s', notes: 'Land quiet, no knee collapse.' },
    ],
  };
}

const data = { tiers: {} };
for (const tier of TIERS) {
  data.tiers[tier] = { phases: PHASES, weeks: {} };
  for (let w = 1; w <= TOTAL_WEEKS; w++) {
    const light = LIGHT_WEEKS.includes(w);
    const phase = PHASES.find(p => p.weeks.includes(w));
    data.tiers[tier].weeks[w] = {
      phaseId: phase.id,
      light,
      sessions: [strengthA(tier, phase.id, light), strengthB(tier, phase.id, light), mobilityA(), mobilityB()],
    };
  }
}

data.primers = {
  practice: {
    name: 'Practice-Day Primer',
    meta: '10-15min before every practice',
    steps: [
      'Min 0-4: Easy jog (HR 120-130)',
      'Min 4-8: Dynamic mobility — leg swings, hip circles, lunges, ankles',
      'Min 8-11: Activation — glute bridges, mini-band walks',
      'Min 11-14: GK build-up — footwork drills, 2-3 progressive reaction starts',
    ],
    note: 'Never dive at max speed cold. 3-5 build-up reps first — that\'s where tears happen.',
  },
  game: {
    name: 'Game-Day Primer',
    meta: '~55-60min pre-kickoff, lateral/reactive emphasis',
    steps: [
      'T-60: Jog, hip/ankle mobility, glute + band activation',
      'T-45: GK technical — footwork, handling, shot-stopping',
      'T-20: PAPE — wall squat iso 3×5s + RFE lunge iso 2×5s/side, rest 5-7min',
      'T-10: Lateral bounds ×4-6, reactive dive drill ×4-6',
      'T-5: Tunnel',
    ],
    note: 'Cold (<10°C): cut PAPE rest to 3-5min, add 5min to warm-up.',
  },
};

const out = `// AUTO-GENERATED by tools/generate-inseason.mjs — do not hand-edit. Edit the tables in that file.\nwindow.INSEASON_DATA = ${JSON.stringify(data, null, 2)};\n`;
fs.writeFileSync(new URL('../assets/js/data-inseason.js', import.meta.url), out);
console.log('wrote assets/js/data-inseason.js');
