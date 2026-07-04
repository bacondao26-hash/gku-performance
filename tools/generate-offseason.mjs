// AUTO-REGENERATE: node tools/generate-offseason.mjs
import fs from 'node:fs';

const TIERS = ['beginner', 'intermediate', 'advanced'];

const BLOCKS = [
  { id: 1, weeks: [1,2,3,4], name: 'Block 1 — Structural Strength (Eccentric)', focus: 'Tempo eccentric loading (3-1-1 tempo), tissue prep, and movement quality. Foundation block — don\'t rush the slow part.' },
  { id: 2, weeks: [5,6,7,8], name: 'Block 2 — Strength-Power (Isometric)', focus: 'Pause strength at sticking point (X:3:X tempo), RFD development, reactive elements introduced alongside max strength.' },
  { id: 3, weeks: [9,10,11,12], name: 'Block 3 — Power-Speed (Realization)', focus: 'Explosive concentric intent every rep, contrast pairing (Advanced), speed. Taper into pre-season — quality over quantity.' },
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
  power:        '2-3min (full CNS recovery)',
  squat:        '2-3min',
  unilateral:   '90s',
  hinge:        '2min',
  hip_thrust:   '90s',
  nordic:       '2min',
  copenh:       '60s',
  press:        '2-3min',
  pull:         '90s',
  shoulder:     '45s (no grinding)',
  core_antirot: '60s',
  core_antiext: '60s',
  lat_power:    '2-3min (full CNS recovery)',
  lat_squat:    '60s',
};

// Exercises per tier. String = same across all blocks. Array[3] = per-block progression.
const EX = {
  power_d1: {
    beginner:     ['Half-Kneeling Box Jump (low box — push-off initiation pattern)',
                   'Box Jump (bilateral, moderate height — full arm drive)',
                   'Box Jump (max intent — drive arms, full hip/knee extension)'],
    intermediate: ['Depth Drop → Box Jump (low box — reactive landing)',
                   'Depth Jump (low-mod box)',
                   'Depth Jump (mid box) + Box Jump contrast set (2+2)'],
    advanced:     ['Depth Jump (moderate box)',
                   'Depth Jump → Sprint 5m (reactive transition)',
                   'Drop Jump → Max CMJ contrast set (2+2 — max intent every rep)'],
  },
  squat_d1: {
    beginner:     'Back Squat (barbell, light load — technique priority)',
    intermediate: 'Back Squat',
    advanced:     'Back Squat (heavy)',
  },
  rfess_d1: {
    beginner:     'Rear-Foot Elevated Split Squat (RFESS) — Bodyweight or Light DB',
    intermediate: 'Rear-Foot Elevated Split Squat (RFESS) — DB/KB loaded',
    advanced:     'Rear-Foot Elevated Split Squat (RFESS) — Heavy DB or Barbell',
  },
  hinge_d1: {
    beginner:     'Romanian Deadlift — DB, 3s eccentric',
    intermediate: 'Romanian Deadlift — barbell',
    advanced:     'Single-Leg RDL — barbell or heavy KB',
  },
  nordic_d1: {
    beginner:     ['Nordic Hamstring Eccentric (band-assisted, 5s down — hands catch floor)',
                   'Nordic Hamstring Eccentric (anchored, 5s down — use hands to return)',
                   'Nordic Hamstring Eccentric (anchored, 4s down — minimal hand assist)'],
    intermediate: ['Nordic Hamstring Eccentric (anchored, 5s down)',
                   'Nordic Hamstring Eccentric (anchored, 4s down — controlled)',
                   'Weighted Nordic (5-10kg plate held on chest, 4s eccentric)'],
    advanced:     ['Nordic Hamstring Eccentric (bodyweight, 4s down)',
                   'Weighted Nordic (10kg plate on chest, 4s eccentric)',
                   'Weighted Nordic (12-15kg — progressed load from Block 2)'],
  },
  copenh_d1: {
    beginner:     ['Copenhagen Plank (short-lever — knee on bench, static hold)',
                   'Copenhagen Plank (long-lever — foot on bench, static hold)',
                   'Copenhagen Plank (long-lever, dynamic — raise/lower top leg, controlled)'],
    intermediate: ['Copenhagen Plank (long-lever — foot on bench, static hold)',
                   'Copenhagen Side Plank + Hip Adduction (dynamic, foot on bench)',
                   'Copenhagen Dynamic + 5kg plate on hip'],
    advanced:     ['Copenhagen Dynamic (long-lever — foot on bench, 8-10 reps)',
                   'Copenhagen Dynamic + 10kg plate on hip',
                   'Copenhagen Dynamic — heavy (12-15kg plate, controlled reps)'],
  },
  power_d2: {
    beginner:     ['Med Ball Chest Pass (seated, wall — 3kg)',
                   'Med Ball Chest Pass (standing, wall — 3kg)',
                   'Med Ball Chest Pass (standing, explosive reactive catch-and-throw — 3kg)'],
    intermediate: ['Med Ball Chest Pass (standing, wall — 4kg)',
                   'Med Ball Overhead Slam (max intent — 4-6kg)',
                   'Med Ball Rotational Pass (GK dive-load pattern — 4-5kg)'],
    advanced:     ['Med Ball Rotational Throw (wall — 5-6kg)',
                   'Med Ball Overhead Slam (heavy — 6-8kg)',
                   'Med Ball Rotational Throw + Step-off Entry (GK dive-load pattern — 5-6kg)'],
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
    beginner:     ['Lat Pulldown (bilateral, full ROM)',
                   'Lat Pulldown (bilateral)',
                   'Assisted Pull-Up or Lat Pulldown'],
    intermediate: ['Seated Cable Row',
                   'Seated Cable Row',
                   'Pull-Up (bodyweight or band-assisted)'],
    advanced:     ['Weighted Pull-Up',
                   'Weighted Pull-Up',
                   'Barbell Bent-Over Row'],
  },
  core_antirot_d2: {
    beginner:     ['Pallof Press (kneeling, band — 3s isometric hold per rep)',
                   'Pallof Press (standing, band)',
                   'Pallof Press (standing, band — slow controlled press-out)'],
    intermediate: ['Pallof Press (standing, cable or band)',
                   'Pallof Press + Press-out (cable, controlled)',
                   'Pallof Press + Rotation (standing, cable — controlled)'],
    advanced:     ['Pallof Press + Press-out (cable)',
                   'Pallof Press + Rotation (cable)',
                   'Single-Arm Cable Anti-Rotation Press + Rotation (heavy)'],
  },
  core_antiext_d2: {
    beginner:     ['Kneeling Plank (elbows — 3×30-40s hold)',
                   'Ab Wheel Rollout (kneeling, short range)',
                   'Ab Wheel Rollout (kneeling, full range)'],
    intermediate: ['Ab Wheel Rollout (kneeling)',
                   'Ab Wheel Rollout (kneeling, full range)',
                   'Ab Wheel Rollout — attempt 1 standing rep at end of each set'],
    advanced:     ['Ab Wheel Rollout (full kneeling range)',
                   'Ab Wheel Rollout (standing, short range)',
                   'Ab Wheel Rollout (standing, controlled full range)'],
  },
  lat_power_d3: {
    beginner:     ['Lateral Bound — bilateral takeoff → SL stick landing (submax)',
                   'SL Lateral Bound (stick landing, both sides)',
                   'SL Lateral Bound (continuous alternating — 3/side per set)'],
    intermediate: ['SL Lateral Bound (stick landing, both sides)',
                   'SL Lateral Bound (continuous alternating — 4/side)',
                   'SL Lateral Bound → Sprint 5m (reactive transition)'],
    advanced:     ['SL Lateral Bound (continuous alternating — 4/side)',
                   'SL Lateral Bound → Sprint 5m',
                   'Reactive Lateral Bound (coach-cue start — GK dive-entry pattern)'],
  },
  hinge_d3: {
    beginner:     ['Trap Bar Deadlift (light load, 3s eccentric — technique priority)',
                   'Trap Bar Deadlift (moderate load, 2s eccentric)',
                   'Trap Bar Deadlift (working load — explosive pull intent)'],
    intermediate: ['Trap Bar Deadlift (3s eccentric)',
                   'Trap Bar Deadlift (loaded, 2s eccentric)',
                   'Trap Bar Deadlift (heavy — explosive concentric)'],
    advanced:     ['Conventional Deadlift (3s eccentric)',
                   'Conventional Deadlift (heavy, 2s eccentric)',
                   'Conventional Deadlift (near-max — explosive intent)'],
  },
  hip_thrust_d3: {
    beginner:     'Hip Thrust — barbell, light-moderate load, 2s squeeze at top',
    intermediate: 'Hip Thrust — barbell, moderate-heavy, drive fast through top',
    advanced:     'Hip Thrust — heavy barbell, 1.5-rep method (full → halfway → full = 1 rep)',
  },
  lat_squat_d3: {
    beginner:     'Cossack Squat (bodyweight — full range of motion, controlled tempo)',
    intermediate: 'Lateral Squat (DB loaded, 8-10/side)',
    advanced:     'Lateral Squat (heavy DB or landmine, 6-8/side)',
  },
};

// Fixed shoulder series — same tag, same text, all tiers/blocks
const SHOULDER_SERIES = '3-way shoulder series: Band External Rotation ×15 + Face Pull ×15 + W-Raise ×12 — light load only, no grinding, full ROM every rep';

// GK reactive drills per block — all solo/cone-based, no partner required
const GK_REACTIVE = [
  'Lateral Cone Shuffle Drill — 5m apart, touch each cone, change direction sharp (6 reps × 5m, self-paced)',
  'Low Box Lateral Drop → Dive and Return — step off low box, lateral dive to ground, getup, reset (6 reps/side)',
  'GK Dive-Recovery Circuit — full dive to ground → getup fast → lateral sprint to cone → reset (8 reps, 30s between)',
];

// Conditioning finisher for Day 3 per block
const CONDITIONING = [
  '4×30s lateral shuffle shuttles @ RPE 6 (1:2 work:rest) — 5m cone-to-cone, feet stay in contact with ground',
  '6×20s lateral agility (T-drill variation) @ RPE 7-8 (1:3 work:rest) — plant-and-cut quality over raw speed',
  '8×10s reactive sprint (partner-cue start) @ max intent (1:4 work:rest) — full CNS recovery between reps',
];

const PRIMER_D1 = 'Warm-up (~12min): 3min row/bike or jog. Hip mobility: world\'s greatest stretch 5/side, hip 90/90 switch ×10, leg swings ×10/direction. Activation: glute bridge 2×15s, mini-band squat ×15, tempo box squat ×5 BW. Bar warm-up on squat: empty bar ×8, 40%×5, 60%×3, 75%×2. ⚠️ U13-U14: cap RPE at 7 on all compound loaded sets — technique before load.';
const PRIMER_D2 = 'Warm-up (~10min): 3min row or jog. Shoulder: arm circles ×10, band pull-apart ×15, shoulder CARs 5/side. Activation: face pull ×15 (light), push-up plus ×10, scap push-up ×10. Bar warm-up on press: empty bar ×10, 40%×5, 60%×3. ⚠️ U13-U14: cap RPE at 7 on all compound loaded sets.';
const PRIMER_D3 = 'Warm-up (~12min): 3min lateral shuffle or bike. Mobility: hip 90/90 ×10/side, adductor rock-back ×10, ankle CARs. Activation: lateral band walk ×15/side, SL glute bridge ×12/side. Bar warm-up on hinge: 40%×5, 60%×3, 75%×2. ⚠️ U13-U14: cap RPE at 7 on all loaded sets — omit lateral bound (replace with lateral shuffle) until U14+.';

function getEx(obj, tier, blockIdx) {
  const v = obj[tier] !== undefined ? obj[tier] : obj.all;
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
  if (blockId === 1) return 'Tempo 3-1-1 (3s eccentric, 1s pause, 1s up) — eccentric overload phase.';
  if (blockId === 2) return 'X:3:X tempo — pause 3s at sticking point, do not bounce. RFD phase.';
  return 'Explosive concentric intent every rep — power realization phase. Bar speed matters.';
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
  const coholdNote = (tier === 'beginner' && bId === 1);
  return {
    day: 'Day 1', title: 'Lower Strength + Power',
    meta: '~75-85min',
    primer: PRIMER_D1,
    slots: [
      {
        tag: 'Power',
        exercise: getEx(EX.power_d1, tier, bId - 1),
        sets: ps, reps: pr,
        load: deload ? 'Submax — quality focus only' : `${rpeStr(tier, bId, wIdx)} intent (near-max effort)`,
        rest: REST.power,
        notes: 'Full CNS recovery between reps — this is not conditioning. Reset, then go.',
      },
      {
        tag: 'Squat',
        exercise: getEx(EX.squat_d1, tier, bId - 1),
        sets: ss, reps: sr,
        load: rpeStr(tier, bId, wIdx),
        rest: REST.squat,
        notes: tempoNote(bId),
      },
      {
        tag: 'Unilateral',
        exercise: getEx(EX.rfess_d1, tier, bId - 1),
        sets: us, reps: `${ur}/side`,
        load: rpeSecondary(tier, bId, wIdx),
        rest: REST.unilateral,
        notes: 'GK dive push-off pattern. Front foot flat, rear foot on bench. Control descent.',
      },
      {
        tag: 'Hinge',
        exercise: getEx(EX.hinge_d1, tier, bId - 1),
        sets: hs, reps: hr,
        load: rpeSecondary(tier, bId, wIdx),
        rest: REST.hinge,
        notes: bId === 1 ? 'Hip hinge, not back bend. Bar/DB stays close. 3s eccentric.' : bId === 2 ? 'Pause at bottom. Control the eccentric, drive through heels.' : 'Explosive hip extension intent. Bar speed on the way up.',
      },
      {
        tag: 'Prehab — Nordic',
        exercise: getEx(EX.nordic_d1, tier, bId - 1),
        sets: ns, reps: nr,
        load: 'Bodyweight (or band-assist for Beginner)',
        rest: REST.nordic,
        notes: 'Never skip. Primary hamstring injury-prevention work. Quality of eccentric > reps. Hands catch floor on failure.',
      },
      {
        tag: 'Prehab — Copenhagen',
        exercise: getEx(EX.copenh_d1, tier, bId - 1),
        sets: cs, reps: coholdNote ? `${cr}s hold/side` : `${cr}/side`,
        load: 'Bodyweight (+ load as specified)',
        rest: REST.copenh,
        notes: 'Groin/adductor durability — high injury risk in GKs. Progress deliberately through the ladder.',
      },
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
      {
        tag: 'Power',
        exercise: getEx(EX.power_d2, tier, bId - 1),
        sets: ps, reps: pr,
        load: deload ? 'Submax — quality focus' : 'Max intent per throw — reset grip between reps',
        rest: REST.power,
        notes: 'Upper body explosive work. Reset body position fully between reps.',
      },
      {
        tag: 'Press',
        exercise: pressEx,
        sets: prs, reps: prr,
        load: rpeStr(tier, bId, wIdx),
        rest: REST.press,
        notes: isPushPress ? 'Push press: dip-drive-catch. Slight knee bend → explosive hip extension → press. Catch with elbows through.' : tempoNote(bId),
      },
      {
        tag: 'Pull',
        exercise: getEx(EX.pull_d2, tier, bId - 1),
        sets: pls, reps: plr,
        load: rpeSecondary(tier, bId, wIdx),
        rest: REST.pull,
        notes: 'Scapula retract and depress first. Elbows drive down and back — not arms pulling.',
      },
      {
        tag: 'Shoulder Health',
        exercise: SHOULDER_SERIES,
        sets: shs, reps: shr,
        load: 'Light — RPE 5-6 max',
        rest: REST.shoulder,
        notes: 'GK overhead demand is high. This is injury prevention, not strength work. Never grind through range of motion.',
      },
      {
        tag: 'Core — Anti-Rot',
        exercise: getEx(EX.core_antirot_d2, tier, bId - 1),
        sets: ars, reps: `${arr}/side`,
        load: 'Light-moderate band or cable',
        rest: REST.core_antirot,
        notes: 'Resist the rotation — don\'t move the spine. GK core has to resist dive-force and landing torque.',
      },
      {
        tag: 'Core — Anti-Ext',
        exercise: getEx(EX.core_antiext_d2, tier, bId - 1),
        sets: aes, reps: aer,
        load: 'Bodyweight',
        rest: REST.core_antiext,
        notes: 'Rib cage down, glutes squeezed throughout. Do not let lower back arch — quality over range.',
      },
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
  const condStr = deload
    ? '3×20s lateral shuffle @ RPE 5 — movement quality only, no fatigue target'
    : CONDITIONING[bId - 1];
  // GK reactive: fixed per block, use BASE-derived sets for structure
  const [grs] = adj(tier, [bId === 1 ? 2 : 3, 0]); // sets scale slightly with tier
  return {
    day: 'Day 3', title: 'Full Body Power + GK Movement',
    meta: '~70-80min',
    primer: PRIMER_D3,
    slots: [
      {
        tag: 'Lateral Power',
        exercise: getEx(EX.lat_power_d3, tier, bId - 1),
        sets: lps, reps: `${lpr}/side`,
        load: deload ? 'Submax — stick and absorb only' : 'Max lateral effort — stick the landing',
        rest: REST.lat_power,
        notes: 'GK push-off power. Land softly, absorb force. Reactive version = first-step cue response.',
      },
      {
        tag: 'Hinge',
        exercise: getEx(EX.hinge_d3, tier, bId - 1),
        sets: hs, reps: hr,
        load: rpeStr(tier, bId, wIdx),
        rest: REST.hinge,
        notes: tempoNote(bId) + ' Hinge at hip, bar stays close. Braced through entire rep.',
      },
      {
        tag: 'Hip Power',
        exercise: getEx(EX.hip_thrust_d3, tier, bId - 1),
        sets: hts, reps: htr,
        load: rpeSecondary(tier, bId, wIdx),
        rest: REST.hip_thrust,
        notes: 'Full hip extension at top — 2s hold. Hip extension power directly transfers to aerial duels and ground recovery.',
      },
      {
        tag: 'Lateral Pattern',
        exercise: getEx(EX.lat_squat_d3, tier, bId - 1),
        sets: lss, reps: `${lsr}/side`,
        load: 'Quality over load — upright torso',
        rest: REST.lat_squat,
        notes: 'Lateral hip and groin strength. Keep heel down on bending leg. Don\'t rush through range.',
      },
      {
        tag: 'GK Reactive',
        exercise: GK_REACTIVE[bId - 1],
        sets: grs, reps: 'per drill',
        load: '—',
        rest: '90s',
        notes: 'GK movement quality — not conditioning. Sharp reactions, full reset between reps.',
      },
      {
        tag: 'Conditioning',
        exercise: condStr,
        sets: '—', reps: '—',
        load: 'Per protocol above',
        rest: 'Per protocol',
        notes: 'Finisher only — do not grind into next-day soreness. Stop if form breaks.',
      },
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
        sessions: [
          buildDay1(tier, block, wIdx),
          buildDay2(tier, block, wIdx),
          buildDay3(tier, block, wIdx),
        ],
      };
    });
  }
}

const out = `// AUTO-GENERATED by tools/generate-offseason.mjs — do not hand-edit. Edit the tables in that file.\nwindow.OFFSEASON_DATA = ${JSON.stringify(data, null, 2)};\n`;
fs.writeFileSync(new URL('../assets/js/data-offseason.js', import.meta.url), out);
console.log('wrote assets/js/data-offseason.js');
