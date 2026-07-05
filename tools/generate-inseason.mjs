// AUTO-REGENERATE: node tools/generate-inseason.mjs
import fs from 'node:fs';

const TIERS = ['beginner', 'intermediate', 'advanced'];
const TOTAL_WEEKS = 18;

const PHASES = [
  { id: 1, weeks: [1,2,3,4,5,6], name: 'Early Season', focus: 'Full MED intensity — legs are freshest now, bank strength while match load is establishing. Slightly higher reps to hold off-season gains.' },
  { id: 2, weeks: [7,8,9,10,11,12], name: 'Mid Season', focus: 'Congestion-aware. If 2 matches this week: drop to 1 strength session (Nordic + Copenhagen + squat only) and skip the rest. Intensity holds, volume flexes.' },
  { id: 3, weeks: [13,14,15,16,17,18], name: 'Late Season / Push', focus: 'Lowest volume, intensity stays. Freshness wins games in this phase — trim sets before any playoff week, never trim RPE.' },
];

// Light/reset week at the end of each 6-week phase
const LIGHT_WEEKS = [6, 12, 18];

// [sets, reps] per phase for main strength slots. Light week = sets - 1, same RPE.
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
    squat: 'Back Squat (technique priority — bar speed crisp every rep)',
    hinge: 'Trap Bar Deadlift (moderate)',
    press: 'Barbell Bench Press',
    pull:  'Lat Pulldown or Assisted Pull-Up',
    jump:  'Box Jump (submax — stick every landing)',
    throw: 'Med Ball Chest Pass (standing, wall — 3kg)',
    nordic: 'Nordic Hamstring Eccentric (band-assisted or anchored)',
    copenh: 'Copenhagen Plank (short-lever, static hold)',
    copenhReps: '15-20s hold/side',
  },
  intermediate: {
    rpe: 7.5, rpe2: 7,
    squat: 'Back Squat or Trap Bar Deadlift',
    hinge: 'Trap Bar Deadlift',
    press: 'Push Press',
    pull:  'Pull-Up or DB Row',
    jump:  'Jump Squat (light bar or DB — max velocity intent)',
    throw: 'Med Ball Rotational Pass (4kg)',
    nordic: 'Nordic Hamstring Eccentric (anchored, controlled)',
    copenh: 'Copenhagen Plank (long-lever, static hold)',
    copenhReps: '20-25s hold/side',
  },
  advanced: {
    rpe: 8, rpe2: 7.5,
    squat: 'Back Squat or Trap Bar Deadlift (heavy singles-doubles range)',
    hinge: 'Trap Bar Deadlift or RDL',
    press: 'Push Press',
    pull:  'Weighted Pull-Up',
    jump:  'Jump Squat or Depth Jump (low box — max intent)',
    throw: 'Med Ball Rotational Throw (5kg)',
    nordic: 'Nordic Hamstring Eccentric (bodyweight, 4s down)',
    copenh: 'Copenhagen Dynamic (long-lever)',
    copenhReps: '6-8/side',
  },
};

const YOUTH_FLAG = ' ⚠️ U13-U14: cap RPE at 7 on all loaded sets — technique before load.';

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
    day: 'Strength A', title: 'Lower — Squat + Hip MED',
    meta: '~50-60min',
    primer: 'Warm-up (~10min): 3min bike/jog, hip 90/90 ×8/side, leg swings ×10/direction, glute bridge 2×12, mini-band squat ×12. Bar warm-up: empty bar ×8, 40%×5, 60%×3.' + YOUTH_FLAG,
    slots: [
      { tag: 'Power', exercise: t.jump, sets: pS, reps: pR, load: light ? 'Submax — quality only' : 'Max velocity intent', rest: '2min (full recovery)', notes: 'Maintains RFD without adding fatigue. Quality reps only — stop the set if speed drops.' },
      { tag: 'Squat', exercise: t.squat, sets: sS, reps: sR, load: `RPE ${t.rpe}`, rest: '2-3min', notes: 'Intensity stays high in-season — only volume drops. This is the MED principle in action.' },
      { tag: 'Hip Power', exercise: 'Hip Thrust (barbell)', sets: hS, reps: hR, load: `RPE ${t.rpe2}`, rest: '90s', notes: 'Highest glute activation of common lifts — acceleration and dive push-off transfer.' },
      { tag: 'Prehab — Nordic', exercise: t.nordic, sets: 2, reps: tier === 'advanced' ? 5 : 4, load: 'Bodyweight', rest: '2min', notes: 'Non-negotiable — 51% hamstring injury risk reduction. Never the exercise you cut in a busy week.' },
      { tag: 'Prehab — Copenhagen', exercise: t.copenh, sets: 2, reps: t.copenhReps, load: 'Bodyweight', rest: '60s', notes: 'Groin durability maintenance dose. If congested week: this + Nordic + squat are the 3 keepers.' },
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
    day: 'Strength B', title: 'Upper + Hinge MED',
    meta: '~45-55min',
    primer: 'Warm-up (~8min): 3min row, arm circles ×10, band pull-apart ×15, scap push-up ×10, face pull ×12 light. Build-up sets on first loaded movement.' + YOUTH_FLAG,
    slots: [
      { tag: 'Power', exercise: t.throw, sets: pS, reps: pR, load: light ? 'Submax' : 'Max intent per throw', rest: '90s', notes: 'Upper power maintenance — full reset between reps.' },
      { tag: 'Hinge', exercise: t.hinge, sets: hS, reps: hR, load: `RPE ${t.rpe}`, rest: '2min', notes: 'Explosive concentric intent — bar speed over grinding.' },
      { tag: 'Press', exercise: t.press, sets: prS, reps: prR, load: `RPE ${t.rpe2}`, rest: '2min', notes: t.press.includes('Push Press') ? 'Dip-drive-catch. Leg drive is the point — full-body force chain.' : 'Shoulder blades pinned, control the eccentric.' },
      { tag: 'Pull', exercise: t.pull, sets: plS, reps: plR, load: `RPE ${t.rpe2}`, rest: '90s', notes: 'Shoulder robustness for punching, catching, diving load.' },
      { tag: 'Core — Anti-Rot', exercise: 'Pallof Press (standing, band or cable)', sets: 2, reps: '8/side', load: 'Light-moderate', rest: '60s', notes: 'Resist rotation — dive-landing torque control. Maintenance dose.' },
    ],
  };
}

function mobilityA() {
  return {
    day: 'Mobility A', title: 'Hip & Lower Body Mobility',
    meta: '~20-25min',
    primer: 'Best placed the day after a match (MD+1) — easy movement, no loading, no forcing range.',
    slots: [
      { tag: 'Mobility', exercise: 'Hip 90/90 Flow', sets: 2, reps: '5/side', load: '—', rest: '—', notes: 'Rotational hip range for split saves and low balls.' },
      { tag: 'Mobility', exercise: 'Weight-Bearing Ankle Dorsiflexion (WBLT)', sets: 2, reps: '8/side', load: '—', rest: '—', notes: 'Ankle restriction limits low-dive depth and landing absorption.' },
      { tag: 'Mobility', exercise: 'Adductor Rock-Back Stretch', sets: 2, reps: '45s/side', load: '—', rest: '—', notes: 'Groin length maintenance — pairs with the Copenhagen work in Strength A.' },
      { tag: 'Mobility', exercise: 'Couch Stretch (hip flexor)', sets: 2, reps: '45s/side', load: '—', rest: '—', notes: 'Hip extension range — undoes the crouched GK set-position posture.' },
      { tag: 'Recovery', exercise: 'Cossack Squat (bodyweight, slow flow)', sets: 2, reps: '5/side', load: 'Bodyweight', rest: '—', notes: 'Loaded lateral range without fatigue cost — move slow, own the bottom.' },
    ],
  };
}

function mobilityB() {
  return {
    day: 'Mobility B', title: 'Shoulder & Thoracic Mobility',
    meta: '~20-25min',
    primer: 'Slot anywhere — pairs well with a video/analysis day. No loading, no forcing range.',
    slots: [
      { tag: 'Mobility', exercise: 'T-Spine Rotation (quadruped or half-kneeling)', sets: 2, reps: '8/side', load: '—', rest: '—', notes: 'Distribution and throwing range.' },
      { tag: 'Mobility', exercise: 'Band Shoulder ER + Sleeper Stretch', sets: 2, reps: '10 + 30s hold/side', load: '—', rest: '—', notes: 'Posterior shoulder health — the wear zone from repeated diving and catching.' },
      { tag: 'Shoulder Health', exercise: '3-way shoulder series: Band ER ×12 + Face Pull ×12 + W-Raise ×10', sets: 2, reps: 'as listed', load: 'Light only', rest: '45s', notes: 'Maintenance dose of the off-season shoulder series.' },
      { tag: 'Technical', exercise: 'Landing Mechanics Reinforcement (low volume)', sets: 2, reps: 4, load: 'Bodyweight', rest: '60s', notes: 'Land quiet, absorb through the whole foot, no valgus collapse. Not a fatigue exercise.' },
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
    meta: '10-15min, before every regular practice (not a lifting day)',
    steps: [
      'Min 0-4: Easy jog / general movement (HR 120-130bpm)',
      'Min 4-8: Dynamic mobility — leg swings (sagittal + frontal), hip circles, walking lunge + rotation, ankle circles, lateral lunge',
      'Min 8-11: Activation — glute bridge, single-leg glute bridge, mini-band clam/lateral walk',
      'Min 11-14: GK build-up — footwork/dive-recovery drill x3-4, 2-3 progressive reaction starts',
    ],
    note: 'Never go into max-speed dive work or sprints cold. Progressive build-up (3-5 reps) before max intent — most soft-tissue tears happen skipping this step.',
  },
  game: {
    name: 'Game-Day Primer (Matchday Activation)',
    meta: '~55-60min pre-kickoff, GK-specific (lateral/reactive emphasis, not linear sprint like outfield)',
    steps: [
      'T-60 to T-45: Jog, hip/ankle mobility, glute bridge + band walk activation',
      'T-45 to T-30: GK-specific technical — footwork, handling, shot-stopping reps',
      'T-20: PAPE — Isometric wall squat 3x5s max effort + isometric RFE lunge 2x5s/side, then rest 5-7min',
      'T-10 to T-7: Lateral bound x4-6, reactive dive/save drill x4-6, 1-2 reactive starts on visual cue',
      'T-5: Tunnel',
    ],
    note: 'Cold weather (<10°C): shorten the T-20 rest window to 3-5min (potentiation fades faster) and extend the general warm-up by 5min.',
  },
};

const out = `// AUTO-GENERATED by tools/generate-inseason.mjs — do not hand-edit. Edit the tables in that file.\nwindow.INSEASON_DATA = ${JSON.stringify(data, null, 2)};\n`;
fs.writeFileSync(new URL('../assets/js/data-inseason.js', import.meta.url), out);
console.log('wrote assets/js/data-inseason.js');
