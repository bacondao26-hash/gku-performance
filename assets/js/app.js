/* GKU x Performance Bacon — shared site behavior */

(function () {
  // Mark active nav link
  var path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav.main-nav a').forEach(function (a) {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
})();

/* ---------- Session accordion + checkbox progress ---------- */
function gkuInitSessions(rootEl, storageKey) {
  rootEl.querySelectorAll('.session').forEach(function (sess) {
    var head = sess.querySelector('.session-head');
    head.addEventListener('click', function (e) {
      if (e.target.tagName === 'INPUT') return;
      sess.classList.toggle('open');
    });

    var cb = sess.querySelector('.session-check input');
    if (!cb) return;
    var id = sess.dataset.sessionId;
    var saved = gkuLoadProgress(storageKey);
    cb.checked = !!saved[id];
    cb.addEventListener('click', function (e) { e.stopPropagation(); });
    cb.addEventListener('change', function () {
      var p = gkuLoadProgress(storageKey);
      p[id] = cb.checked;
      localStorage.setItem(storageKey, JSON.stringify(p));
      gkuUpdateProgressCount(rootEl, storageKey);
    });
  });
  gkuUpdateProgressCount(rootEl, storageKey);
}

function gkuLoadProgress(key) {
  try { return JSON.parse(localStorage.getItem(key)) || {}; }
  catch (e) { return {}; }
}

function gkuUpdateProgressCount(rootEl, storageKey) {
  var boxes = rootEl.querySelectorAll('.session-check input');
  var done = 0;
  boxes.forEach(function (b) { if (b.checked) done++; });
  var out = document.querySelector('.progress-mini');
  if (out) out.textContent = done + ' / ' + boxes.length + ' sessions logged';
}

/* ---------- Tier tabs ---------- */
function gkuInitTiers(onChange) {
  var tabs = document.querySelectorAll('.tier-tabs button');
  tabs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      tabs.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      onChange(btn.dataset.tier);
    });
  });
  var active = document.querySelector('.tier-tabs button.active');
  return active ? active.dataset.tier : tabs[0].dataset.tier;
}

/* ---------- Exercise library search ---------- */
function gkuInitLibrarySearch(inputEl, cardsSelector) {
  inputEl.addEventListener('input', function () {
    var q = inputEl.value.toLowerCase();
    document.querySelectorAll(cardsSelector).forEach(function (card) {
      var hay = card.textContent.toLowerCase();
      card.style.display = hay.indexOf(q) > -1 ? '' : 'none';
    });
  });
}
