window.EXERCISE_LIBRARY = [
  { cat: 'Squat', name: 'Goblet Squat', cue: 'Elbows inside knees, chest tall, drive through mid-foot, full depth.', why: 'Beginner squat pattern entry point — same force-production pattern as back squat without the technical load.' },
  { cat: 'Squat', name: 'Back Squat', cue: 'Brace before unrack, sit back and down, knees track over toes, drive the floor away.', why: 'r=0.77 correlation with sprint speed — the single best general strength predictor of acceleration force.' },

  { cat: 'Hip Hinge', name: 'Trap Bar Deadlift', cue: 'Hips back to bar, flat back, drive through the floor, stand tall — don\'t yank.', why: 'Greater peak power and bar velocity than a conventional deadlift; hip hinge power transfers to acceleration, braking, and landing.' },
  { cat: 'Hip Hinge', name: 'DB Romanian Deadlift', cue: 'Soft knees, push hips back, feel hamstring stretch, DBs stay close to legs.', why: 'Entry-level hamstring eccentric loading — same injury-risk-reduction logic as the barbell RDL.' },
  { cat: 'Hip Hinge', name: 'Single-Leg RDL', cue: 'Hinge at hip, back leg reaches behind, hips stay square, light knee bend on standing leg.', why: 'Hamstring eccentric length-tension under single-leg load — deceleration control plus balance/proprioception.' },
  { cat: 'Hip Hinge', name: 'Hip Thrust (Barbell)', cue: 'Shoulder blades on bench, chin tucked, drive hips up, squeeze glutes hard at top.', why: 'Highest glute activation of common lifts — strongest transfer to 10-30m acceleration of any exercise on this list.' },

  { cat: 'Unilateral', name: 'Box Step-Up', cue: 'Full foot on box, drive through the working leg, don\'t push off the trail leg.', why: 'Beginner-safe unilateral entry — builds single-leg strength without split-squat balance demand.' },
  { cat: 'Unilateral', name: 'RFESS (Rear-Foot Elevated Split Squat)', cue: 'Rear foot on bench, torso upright, front shin stays vertical, drop straight down.', why: 'Unilateral strength matching every sprint stride — also the fastest way to expose a left/right asymmetry.' },

  { cat: 'Plyometric', name: 'Half-Kneeling Box Jump', cue: 'Start half-kneeling, explode up and land softly on the box in a dead-stop position.', why: 'Mimics dive initiation from a low, unloaded position — GK-specific power pattern, not a generic jump.' },
  { cat: 'Plyometric', name: 'Box Jump', cue: 'Athletic stance, arm swing, land soft with knees tracking over toes, step down — don\'t jump down.', why: 'Concentric-only power expression; safe way to build jump confidence before reactive (depth) work.' },
  { cat: 'Plyometric', name: 'Pogo Hops', cue: 'Stiff ankle, minimal knee bend, quick ground contacts, stay tall.', why: 'Low-intensity reactive strength intro — trains the ankle stiffness that underlies every landing.' },
  { cat: 'Plyometric', name: 'Depth Drop → Stick', cue: 'Step off box, land on two feet, absorb and freeze — no rebound.', why: 'Teaches landing mechanics and force absorption before adding a rebound — this is dive-landing rehearsal.' },
  { cat: 'Plyometric', name: 'Depth Jump', cue: 'Step off box, minimal ground contact time, explode vertically immediately on landing.', why: 'Reactive strength (SSC) development — the quality behind a quick second effort after an initial dive or save.' },
  { cat: 'Plyometric', name: 'Broad Jump', cue: 'Two-foot takeoff, full arm swing, land soft and stick — control the landing.', why: 'Horizontal power expression — the general base quality behind a full-extension dive.' },
  { cat: 'Plyometric', name: 'SL Broad Jump', cue: 'Single-leg takeoff, single-leg landing, must stick — no hop or step to balance.', why: 'Unilateral horizontal power + built-in asymmetry test — track left vs. right over time.' },
  { cat: 'Plyometric', name: 'Lateral Bound', cue: 'Push off outside leg, land soft on the opposite leg, control the deceleration.', why: 'Direct transfer to diving push-off — the single most GK-specific plyometric in this program.' },
  { cat: 'Plyometric', name: 'SL Lateral Bound', cue: 'Same as lateral bound, but takeoff and landing on the same leg — must stick.', why: 'Closest field test/exercise to an actual dive push-off; watch for a widening L/R gap here first.' },
  { cat: 'Plyometric', name: 'Jump Squat (light load)', cue: 'Light bar or DBs, sit into a quarter-squat, explode up, land soft.', why: 'In-season RFD maintenance — enough stimulus to hold power without the fatigue cost of heavy loading.' },

  { cat: 'GK-Specific', name: 'Reactive Catch-and-Land Drill', cue: 'React to the ball/cue, catch or parry, land under control, reset stance immediately.', why: 'Combines the catching/handling skill with the landing-mechanics quality in one movement — GK-specific by design.' },
  { cat: 'GK-Specific', name: 'GK Reactive Shuttle Finisher', cue: 'Short shuttle bursts on a reaction cue (visual or verbal), sprint, decelerate, reset.', why: 'Short high-intensity reactive conditioning matching the GK match profile — GK aerobic demand is lower than outfield, so conditioning stays short and sharp.' },
  { cat: 'GK-Specific', name: 'Landing Mechanics Reinforcement', cue: 'Coach-cued: knees soft, land quiet, absorb through the whole foot, no valgus collapse.', why: 'Low-volume technical work, not a fatigue exercise — the highest-dive-volume position needs this rehearsed constantly.' },

  { cat: 'Upper Body', name: 'Incline DB Press', cue: 'Dumbbells start at shoulder height, press up and slightly in, control the descent.', why: 'Beginner-friendly upper pressing pattern — punching/parrying power foundation.' },
  { cat: 'Upper Body', name: 'Barbell Bench Press', cue: 'Shoulder blades pinned, feet planted, bar path stays over the wrists, control the eccentric.', why: 'General upper body pressing strength — distribution and punching power base.' },
  { cat: 'Upper Body', name: 'Lat Pulldown', cue: 'Pull to upper chest, elbows drive down and back, no swinging.', why: 'Pull-strength entry point before loading a full pull-up.' },
  { cat: 'Upper Body', name: 'Weighted Pull-Up', cue: 'Full hang start, drive elbows down, chin clears the bar, control the descent.', why: 'Upper body robustness for aerial contests and shoulder health under diving/catching load.' },
  { cat: 'Upper Body', name: 'Med Ball Chest Pass', cue: 'Load the chest like a basketball pass, extend fully, release with intent.', why: 'Explosive upper power — mirrors the distribution/throw pattern under speed.' },
  { cat: 'Upper Body', name: 'Med Ball Rotational Throw', cue: 'Load through the hips and trunk, rotate and release, follow through.', why: 'Rotational power for one-arm distribution and reactive punching from an angle.' },

  { cat: 'Durability', name: 'Nordic Hamstring Eccentric', cue: 'Kneel, partner/anchor holds ankles, lower under control as long as possible, catch yourself at the bottom.', why: '51% hamstring injury rate reduction — the single most evidence-backed exercise in this entire program. Never the one you cut.' },
  { cat: 'Durability', name: 'Copenhagen Plank', cue: 'Top leg on bench, bottom leg hovers, hold a straight line hip to shoulder.', why: '35% adductor strength increase in 8 weeks — groin strain is one of the most common non-contact GK injuries.' },
  { cat: 'Durability', name: 'Band ER + Face Pull', cue: 'Elbow pinned at side for ER, pull band to face for face pull, squeeze shoulder blades.', why: 'Shoulder health series for the diving/catching/throwing demand unique to this position.' },

  { cat: 'Core', name: 'Half-Kneeling Pallof Press', cue: 'Half-kneeling, press cable/band straight out, resist the rotational pull — don\'t let your torso twist.', why: 'Core stiffness under rotational load — carries over to contact, turning, and one-arm saves.' },

  { cat: 'Mobility', name: 'Hip 90/90 Flow', cue: 'Both knees bent 90°, rotate through the hips switching front-to-back, chest stays tall.', why: 'Rotational hip range — directly supports split saves and getting low on ground balls.' },
  { cat: 'Mobility', name: 'Weight-Bearing Ankle Dorsiflexion (WBLT)', cue: 'Knee drives over toes without the heel lifting, hold the end range briefly.', why: 'Ankle DF restriction limits low-dive depth and landing absorption — a commonly missed mobility gap.' },
  { cat: 'Mobility', name: 'Adductor Rock-Back Stretch', cue: 'Wide stance, rock hips back over one leg keeping it straight, feel the inner thigh stretch.', why: 'Groin length maintenance — pairs with the Copenhagen strength work above.' },
  { cat: 'Mobility', name: 'T-Spine Rotation', cue: 'Quadruped or half-kneeling, one hand behind head, rotate and follow the elbow up.', why: 'Thoracic rotation range for distribution and throwing mechanics.' },
  { cat: 'Mobility', name: 'Band Shoulder ER + Sleeper Stretch', cue: 'ER: elbow pinned, rotate band out. Sleeper: side-lying, gently press forearm down toward the floor.', why: 'Posterior shoulder capsule health — the wear-and-tear zone from repeated diving and catching.' },
];
