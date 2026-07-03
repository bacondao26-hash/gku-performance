// Generates assets/js/data-inseason.js from weekly MED + mobility templates.
// Re-run with `node tools/generate-inseason.mjs` after changing tables below.
import fs from 'node:fs';

const TIERS = ['beginner', 'intermediate', 'advanced'];
const TOTAL_WEEKS = 18;

const PHASES = [
  { id: 1, weeks: [1, 2, 3, 4, 5, 6], name: 'Early Season', focus: 'Full MED intensity — legs are freshest now, bank strength while match load is establishing.' },
  { id: 2, weeks: [7, 8, 9, 10, 11, 12], name: 'Mid Season', focus: 'Congestion-aware. If 2 matches this week: drop to 1 strength session, Nordic + Copenhagen only, skip the 2nd.' },
  { id: 3, weeks: [13, 14, 15, 16, 17, 18], name: 'Late Season / Push', focus: 'Maintain strength, protect freshness. Trim volume before any playoff/postseason week, not intensity.' },
];

// Light/reset week at the end of each 6-week phase (6, 12, 18)
const LIGHT_WEEKS = [6, 12, 18];

const TIER_LOAD = {
  beginner: { squatRpe: 6, hipThrustRpe: 6, upperRpe: 5, squatEx: 'Goblet Squat', hingeEx: 'Trap Bar Deadlift (moderate)', pullEx: 'Lat Pulldown / Assisted Pull-Up', jumpEx: 'Box Jump (submax)' },
  intermediate: { squatRpe: 7, hipThrustRpe: 7, upperRpe: 6, squatEx: 'Back Squat / Trap Bar', hingeEx: 'Trap Bar Deadlift', pullEx: 'Pull-Up / DB Row', jumpEx: 'Jump Squat (light bar/DB)' },
  advanced: { squatRpe: 7.5, hipThrustRpe: 7.5, upperRpe: 6.5, squatEx: 'Back Squat / Trap Bar', hingeEx: 'Trap Bar Deadlift / RDL', pullEx: 'Weighted Pull-Up', jumpEx: 'Jump Squat (light, max intent)' },
};

function strengthSessionA(tier, light) {
  const t = TIER_LOAD[tier];
  const rpe = light ? Math.max(t.squatRpe - 2, 4) : t.squatRpe;
  const hipRpe = light ? Math.max(t.hipThrustRpe - 2, 4) : t.hipThrustRpe;
  return {
    day: 'Strength A', title: 'Lower — Squat + Hinge MED',
    meta: (light ? 'Light week — ' : '') + '~45-55min',
    primer: 'Warm-up: 10min general + bar warm-up on main lift (empty bar x10, 40%x5, 60%x3). Full protocol: exercise library.',
    slots: [
      { tag: 'Strength', exercise: t.squatEx, sets: light ? 2 : 3, reps: tier === 'beginner' ? 5 : 4, load: `RPE ${rpe}`, rest: '2-3min', notes: 'Intensity stays high in-season — only volume drops.' },
      { tag: 'Strength', exercise: 'Hip Thrust (barbell)', sets: light ? 2 : 3, reps: tier === 'beginner' ? 8 : 6, load: `RPE ${hipRpe}`, rest: '2min', notes: 'Highest glute activation of common lifts — accel transfer.' },
      { tag: 'Durability', exercise: 'Nordic Hamstring Eccentric', sets: 2, reps: tier === 'beginner' ? '5/side' : '6/side', load: light ? 'Light' : 'Bodyweight', rest: '60s', notes: 'Non-negotiable — 51% HSI risk reduction. Never the exercise you cut.' },
    ],
  };
}

function strengthSessionB(tier, light) {
  const t = TIER_LOAD[tier];
  const rpe = light ? Math.max(t.upperRpe - 2, 4) : t.upperRpe;
  return {
    day: 'Strength B', title: 'Upper + Power MED',
    meta: (light ? 'Light week — ' : '') + '~35-45min',
    primer: 'Warm-up: 10min general + 2 build-up sets on first movement. Full protocol: exercise library.',
    slots: [
      { tag: 'Power', exercise: t.jumpEx, sets: light ? 2 : 3, reps: 5, load: light ? 'Submax' : 'Light load, max velocity intent', rest: '2min (full recovery)', notes: 'Maintains RFD without adding fatigue — quality reps only.' },
      { tag: 'Strength', exercise: t.hingeEx, sets: light ? 2 : 3, reps: 5, load: `RPE ${rpe}`, rest: '2min', notes: '' },
      { tag: 'Upper', exercise: t.pullEx, sets: light ? 2 : 3, reps: 8, load: `RPE ${rpe}`, rest: '90s', notes: 'Shoulder robustness for punching, catching, diving load.' },
    ],
  };
}

function mobilityA(light) {
  return {
    day: 'Mobility A', title: 'Hip & Lower Body Mobility',
    meta: (light ? 'Light week — ' : '') + '~20-25min',
    primer: '',
    slots: [
      { tag: 'Mobility', exercise: 'Hip 90/90 Flow', sets: 2, reps: '5/side', load: '', rest: '—', notes: 'Rotational hip range for split saves and low balls.' },
      { tag: 'Mobility', exercise: 'Weight-Bearing Ankle Dorsiflexion (WBLT)', sets: 2, reps: '8/side', load: '', rest: '—', notes: 'Ankle DF restriction limits low-dive depth and landing absorption.' },
      { tag: 'Mobility', exercise: 'Adductor Rock-Back Stretch', sets: 2, reps: '45s/side', load: '', rest: '—', notes: '' },
      { tag: 'Durability', exercise: 'Copenhagen Plank Iso Hold (maintenance)', sets: 2, reps: '15-20s/side', load: 'Submax', rest: '45s', notes: 'Maintenance dose only — this is not the strength session.' },
    ],
  };
}

function mobilityB(light) {
  return {
    day: 'Mobility B', title: 'Shoulder & Thoracic Mobility',
    meta: (light ? 'Light week — ' : '') + '~20-25min',
    primer: '',
    slots: [
      { tag: 'Mobility', exercise: 'T-Spine Rotation (quadruped or half-kneeling)', sets: 2, reps: '8/side', load: '', rest: '—', notes: 'Distribution and throwing range.' },
      { tag: 'Mobility', exercise: 'Band Shoulder ER + Sleeper Stretch', sets: 2, reps: '10 + 30s hold/side', load: '', rest: '—', notes: 'Diving and shot-stopping shoulder health.' },
      { tag: 'Core', exercise: 'Half-Kneeling Pallof Press (light maintenance)', sets: 2, reps: '8/side', load: 'Light', rest: '45s', notes: '' },
      { tag: 'Technical', exercise: 'Landing Mechanics Reinforcement (low volume)', sets: 2, reps: '4', load: 'Bodyweight', rest: '60s', notes: 'Coach-cued landing quality — not a fatigue exercise.' },
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
      sessions: [strengthSessionA(tier, light), strengthSessionB(tier, light), mobilityA(light), mobilityB(light)],
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

const out = `// AUTO-GENERATED by tools/generate-inseason.mjs — do not hand-edit, edit the tables in that file instead.\nwindow.INSEASON_DATA = ${JSON.stringify(data, null, 2)};\n`;
fs.writeFileSync(new URL('../assets/js/data-inseason.js', import.meta.url), out);
console.log('wrote assets/js/data-inseason.js');
