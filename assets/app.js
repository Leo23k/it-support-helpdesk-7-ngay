/* IT Support Fresher 7 ngày — ứng dụng một trang, không cần build. */
(function () {
  'use strict';
  var C = window.COURSE;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* ---------- lưu tiến độ ---------- */
  var KEY = 'itsh7-progress-v1';
  var mem = { lessons: {}, labs: {}, quiz: {}, cards: {}, active: [], notes: [], reviews: {}, tools: {} };
  var store = {
    load: function () { try { var j = JSON.parse(localStorage.getItem(KEY)); if (j) mem = Object.assign(mem, j); } catch (e) {} },
    save: function () { try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) {} }
  };
  store.load();

  /* ---------- chuỗi ngày học ---------- */
  function keyOf(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function parseKey(k) { var p = k.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
  // Gọi khi người học hoàn thành một việc (bài, lab, câu quiz) trong ngày.
  function markActive() {
    var k = keyOf(new Date());
    if (mem.active.indexOf(k) < 0) { mem.active.push(k); store.save(); }
    updateChrome();
  }
  // cur: chuỗi đang chạy; broken: đã bỏ lỡ ít nhất một ngày; lost: độ dài chuỗi vừa mất; best: chuỗi dài nhất.
  function streakInfo() {
    var days = mem.active.slice().sort(), out = { cur: 0, lost: 0, broken: false, best: 0 };
    if (!days.length) return out;
    var set = {};
    days.forEach(function (k) { set[k] = true; });
    function runEnding(k) { var n = 0, d = parseKey(k); while (set[keyOf(d)]) { n++; d = addDays(d, -1); } return n; }
    var today = keyOf(new Date()), yest = keyOf(addDays(new Date(), -1)), last = days[days.length - 1];
    if (last === today || last === yest) out.cur = runEnding(last);
    else { out.broken = true; out.lost = runEnding(last); }
    days.forEach(function (k) { var r = runEnding(k); if (r > out.best) out.best = r; });
    return out;
  }
  function renderStreak() {
    var s = streakInfo(), chip = $('#streak'), box = $('#alarm');
    if (chip) chip.textContent = s.cur ? '🔥 ' + s.cur + ' ngày' : '';
    if (!box) return;
    if (s.broken) {
      box.hidden = false;
      box.textContent = '⚠️ Bạn đã MẤT chuỗi ' + s.lost + ' ngày. Hôm nay phải học ít nhất 1 bài, lab hoặc quiz để bắt đầu lại.';
    } else box.hidden = true;
  }

  /* ---------- tính tiến độ ---------- */
  function dayStats(d) {
    var total = d.lessons.length + 2, done = 0;
    d.lessons.forEach(function (l) { if (mem.lessons[l.id]) done++; });
    if (mem.labs['d' + d.n]) done++;
    var q = mem.quiz['d' + d.n + 'q'];
    if (q && q.best / q.total >= 0.7) done++;
    return { total: total, done: done, pct: Math.round(done / total * 100) };
  }
  function overall() {
    var t = 0, dn = 0;
    C.days.forEach(function (d) { var s = dayStats(d); t += s.total; dn += s.done; });
    return t ? Math.round(dn / t * 100) : 0;
  }
  function updateChrome() {
    var p = overall();
    $('#topBar').style.width = p + '%';
    $('#topPct').textContent = p + '%';
    $$('#nav a[data-day]').forEach(function (a) {
      var d = C.days[+a.dataset.day - 1], s = dayStats(d);
      a.classList.toggle('done', s.pct === 100);
      $('.pc', a).textContent = s.pct + '%';
    });
    renderStreak();
  }

  /* ---------- điều hướng ---------- */
  var NAV_EXTRA = [
    ['notes', '📝', 'Ghi chú của tôi'],
    ['projects', '🧪', 'Dự án làm CV'],
    ['interview', '🎤', 'Hỏi đáp phỏng vấn'],
    ['cheatsheet', '📋', 'Cheatsheet lệnh'],
    ['tools', '🛠️', 'Công cụ luyện tập']
  ];
  function renderNav(route) {
    var h = '<a href="#/" class="' + (route === '' ? 'active' : '') + '"><span class="dn">⌂</span>Tổng quan</a><h5>Lộ trình 7 ngày</h5>';
    C.days.forEach(function (d) {
      h += '<a data-day="' + d.n + '" href="#/day/' + d.n + '" class="' + (route === 'day/' + d.n ? 'active' : '') + '"><span class="dn">' + d.n + '</span><span>' + esc(d.short) + '</span><span class="pc">0%</span></a>';
    });
    h += '<h5>Tài nguyên</h5>';
    NAV_EXTRA.forEach(function (x) {
      h += '<a href="#/' + x[0] + '" class="' + (route === x[0] ? 'active' : '') + '"><span class="dn">' + x[1] + '</span>' + x[2] + '</a>';
    });
    $('#nav').innerHTML = h;
    updateChrome();
  }

  /* ---------- trang chủ ---------- */
  function pageHome() {
    var lessons = 0; C.days.forEach(function (d) { lessons += d.lessons.length; });
    var h = '<section class="hero"><h1>Từ con số 0 đến sẵn sàng đi làm IT Support / Helpdesk — trong 7 ngày</h1>' +
      '<p>Lộ trình thực chiến bám sát yêu cầu tuyển dụng fresher hiện nay: Windows, mạng, Active Directory, Microsoft 365, ticket &amp; ITIL, bảo mật cơ bản, kèm lab, quiz, dự án để bỏ vào CV và bộ câu hỏi phỏng vấn.</p>' +
      '<div class="btns"><a class="btn" href="#/day/1">▶ Bắt đầu Ngày 1</a><a class="btn ghost" href="#/tools">🛠️ Công cụ luyện tập</a><a class="btn ghost" href="#/projects">Xem dự án CV</a><a class="btn ghost" href="#/interview">Luyện phỏng vấn</a></div>' +
      '<div class="stats"><div class="stat"><b>7</b><span>ngày · 6–8 giờ/ngày</span></div><div class="stat"><b>' + lessons + '</b><span>bài học có ví dụ</span></div><div class="stat"><b>' + C.projects.length + '</b><span>dự án cho CV</span></div><div class="stat"><b>' + C.interview.length + '</b><span>câu hỏi phỏng vấn</span></div><div class="stat"><b>' + streakInfo().cur + '</b><span>ngày học liên tiếp · cao nhất ' + streakInfo().best + '</span></div></div></section>';

    h += reviewCard();
    h += '<div class="section-title"><h2>Lộ trình 7 ngày</h2></div><div class="grid">';
    C.days.forEach(function (d) {
      var s = dayStats(d);
      h += '<a class="card daycard" href="#/day/' + d.n + '"><span class="tag">Ngày ' + d.n + '</span><h3>' + esc(d.title) + '</h3><p>' + esc(d.tagline) + '</p><div class="bar"><i style="width:' + s.pct + '%"></i></div><small class="hint">' + s.done + '/' + s.total + ' mục hoàn thành</small></a>';
    });
    h += '</div>';

    h += '<div class="section-title"><h2>Cách học để nhanh mà vẫn nhớ</h2></div><div class="cols">' +
      '<div><h3>1. Học – làm – kiểm tra</h3><p>Mỗi ngày: đọc bài (~40%), làm lab trên máy ảo (~40%), làm quiz + tình huống (~20%). <b>Gõ lệnh thật</b>, đừng chỉ đọc.</p></div>' +
      '<div><h3>2. Ghi chú như đi làm</h3><p>Mỗi lỗi bạn tự gây ra và tự sửa trong lab → viết thành 1 bài Knowledge Base ngắn. Đó là bằng chứng kinh nghiệm cho CV.</p></div>' +
      '<div><h3>3. Đừng bỏ ngày 7</h3><p>Dự án + CV + phỏng vấn mới là thứ biến kiến thức thành offer. Nếu thiếu thời gian, rút bớt nội dung phụ ở ngày 5–6, đừng rút ngày 7.</p></div>' +
      '<div><h3>4. Ghi chú &amp; ôn cách quãng</h3><p>Sau mỗi bài, gấp bài lại và viết 3 ý chính bằng lời của bạn vào <a href="#/notes">Ghi chú</a>. Bài đã học sẽ được nhắc ôn sau 1, 3, 7 và 14 ngày — nhớ lâu hơn nhiều so với đọc một lần.</p></div></div>';

    h += '<div class="section-title"><h2>Fresher cần gì để được nhận?</h2></div><div class="card"><p>Tổng hợp từ các mô tả công việc IT Support / Helpdesk / Service Desk fresher phổ biến (công ty outsourcing, ngân hàng, tập đoàn, shared-service của công ty nước ngoài):</p><div class="cols">' +
      '<div><h4>Bắt buộc (gần như JD nào cũng có)</h4><ul><li>Cài đặt, xử lý sự cố Windows 10/11, Office</li><li>Mạng cơ bản: IP, DHCP, DNS, Wi-Fi, VPN</li><li>Xử lý máy in, thiết bị ngoại vi</li><li>Giao tiếp tốt, kiên nhẫn, ghi ticket rõ ràng</li><li>Đọc hiểu tiếng Anh kỹ thuật</li></ul></div>' +
      '<div><h4>Điểm cộng lớn (làm bạn nổi bật)</h4><ul><li>Active Directory, Group Policy</li><li>Microsoft 365 / Entra ID / Intune</li><li>PowerShell cơ bản</li><li>Home lab + GitHub + tài liệu runbook</li><li>CompTIA A+, MS-900, ITIL 4 Foundation</li></ul></div>' +
      '<div><h4>Khóa học này phủ</h4><ul><li>Toàn bộ mục bắt buộc ✔</li><li>Toàn bộ điểm cộng (mức nhập môn) ✔</li><li>6 dự án CV + mẫu bullet ✔</li><li>' + C.interview.length + ' câu hỏi phỏng vấn kèm đáp án ✔</li></ul></div></div></div>';

    h += '<p class="notice">Tiến độ được lưu trong trình duyệt của bạn (localStorage). Mức lương, tên chứng chỉ, phiên bản phần mềm thay đổi theo thời gian — hãy đối chiếu với tin tuyển dụng thực tế khi bạn ứng tuyển.</p>';
    return h;
  }

  /* ---------- trang ngày học ---------- */
  var quizReg = {};
  function pageDay(n) {
    var d = C.days[n - 1]; if (!d) return notFound();
    var s = dayStats(d);
    var h = '<div class="crumbs"><a href="#/">Tổng quan</a> › Ngày ' + d.n + '</div>' +
      '<div class="dayhead"><div style="flex:1;min-width:260px"><span class="pill">Ngày ' + d.n + ' / 7</span><span class="pill">' + esc(d.hours) + '</span>' + (s.pct === 100 ? '<span class="pill ok">Hoàn thành ✓</span>' : '') +
      '<h1>' + esc(d.title) + '</h1><p>' + d.intro + '</p></div></div>';
    h += '<div class="cols"><div><h3>Sau ngày này bạn sẽ…</h3><ul class="outcomes">' + d.outcomes.map(function (o) { return '<li>' + o + '</li>'; }).join('') + '</ul></div>' +
      '<div><h3>Gợi ý lịch học</h3><ul>' + d.plan.map(function (o) { return '<li>' + o + '</li>'; }).join('') + '</ul></div></div>';

    h += '<nav class="toc" aria-label="Mục lục ngày ' + d.n + '"><b>Mục lục</b>';
    d.lessons.forEach(function (l, i) {
      h += '<a href="#/day/' + d.n + '" data-goto="' + l.id + '" data-toc="' + l.id + '" class="' + (mem.lessons[l.id] ? 'done' : '') + '"><span class="chk">' + (mem.lessons[l.id] ? '✓' : '') + '</span>Bài ' + (i + 1) + '. ' + esc(l.title) + '<span class="min">' + l.min + ' phút</span></a>';
    });
    h += '<a href="#/day/' + d.n + '" data-goto="lab' + d.n + '"><span class="chk">' + (mem.labs['d' + d.n] ? '✓' : '') + '</span>🧪 Lab thực hành: ' + esc(d.lab.title) + '</a>' +
      '<a href="#/day/' + d.n + '" data-goto="dnotes"><span class="chk"></span>📝 Ghi chú của bạn (<span data-ncount="' + d.n + '">' + notesFor(d.n, '').length + '</span>)</a>' +
      '<a href="#/day/' + d.n + '" data-goto="quiz' + d.n + '"><span class="chk"></span>✅ Quiz &amp; tình huống</a></nav>';

    d.lessons.forEach(function (l, i) {
      h += '<article class="lesson" id="' + l.id + '"><header><h2>Bài ' + (i + 1) + '. ' + esc(l.title) + '</h2><span class="min">⏱ ' + l.min + ' phút</span></header>' + l.html +
        '<div class="lesson-foot"><span class="recall">🧠 Tự kiểm tra: gấp bài lại, nhắc lại 3 ý chính bằng lời của bạn rồi ghi vào ghi chú.</span><span class="foot-actions"><button class="markbtn" data-act="notelesson" data-day="' + d.n + '" data-id="' + l.id + '">📝 Ghi chú bài này</button><button class="markbtn ' + (mem.lessons[l.id] ? 'on' : '') + '" data-act="lesson" data-id="' + l.id + '">' + (mem.lessons[l.id] ? '✓ Đã học xong' : 'Đánh dấu đã học') + '</button></span></div></article>';
    });

    h += '<section class="labbox" id="lab' + d.n + '"><h2>🧪 Lab: ' + esc(d.lab.title) + '</h2>' + d.lab.html +
      '<div class="lesson-foot"><button class="markbtn ' + (mem.labs['d' + d.n] ? 'on' : '') + '" data-act="lab" data-id="d' + d.n + '">' + (mem.labs['d' + d.n] ? '✓ Đã làm xong lab' : 'Đánh dấu đã làm lab') + '</button></div></section>';

    var tl = window.TOOLS ? TOOLS.list.filter(function (x) { return x.days && x.days.indexOf(n) >= 0; }) : [];
    if (tl.length) h += '<section class="card toolsrow"><h3>🛠️ Luyện thêm bằng công cụ</h3><div class="chips">' + tl.map(function (x) { return '<a class="chip" href="#/tools/' + x.id + '">' + x.icon + ' ' + esc(x.title) + '</a>'; }).join('') + '</div></section>';
    h += dayNotesSection(d);
    h += '<section id="quiz' + d.n + '"><div class="section-title"><h2>✅ Quiz kiểm tra (đạt ≥ 70% để hoàn thành)</h2></div>' + renderQuiz('d' + d.n + 'q', d.quiz, true) +
      '<div class="section-title"><h2>🎯 Tình huống thực tế — bạn sẽ xử lý thế nào?</h2></div>' + renderQuiz('d' + d.n + 's', d.scenarios, false) + '</section>';

    h += '<div class="footer-nav">' + (n > 1 ? '<a class="btn ghost" href="#/day/' + (n - 1) + '">← Ngày ' + (n - 1) + '</a>' : '<span></span>') +
      (n < C.days.length ? '<a class="btn" href="#/day/' + (n + 1) + '">Ngày ' + (n + 1) + ' →</a>' : '<a class="btn" href="#/projects">Làm dự án CV →</a>') + '</div>';
    return h;
  }

  /* ---------- quiz ---------- */
  function renderQuiz(id, items, track) {
    quizReg[id] = { items: items, answered: {}, correct: 0, track: track };
    var prev = mem.quiz[id];
    var h = '<div id="qz-' + id + '">';
    items.forEach(function (it, i) {
      h += '<div class="q" data-q="' + id + ':' + i + '"><div class="qt">' + (i + 1) + '. ' + it.q + '</div>' +
        it.o.map(function (o, j) { return '<button class="opt" data-act="opt" data-quiz="' + id + '" data-i="' + i + '" data-j="' + j + '">' + o + '</button>'; }).join('') +
        '<div class="exp"></div></div>';
    });
    h += '<div class="score" id="sc-' + id + '">' + (prev ? 'Điểm cao nhất: ' + prev.best + '/' + prev.total : 'Chưa làm') + '</div> <button class="markbtn" data-act="retry" data-quiz="' + id + '">Làm lại</button></div>';
    return h;
  }
  function answer(btn) {
    var id = btn.dataset.quiz, i = +btn.dataset.i, j = +btn.dataset.j, R = quizReg[id], it = R.items[i];
    var box = btn.closest('.q'); if (box.classList.contains('answered')) return;
    box.classList.add('answered'); R.answered[i] = true;
    markActive();
    $$('.opt', box).forEach(function (b, k) { b.disabled = true; if (k === it.a) b.classList.add('right'); else if (k === j) b.classList.add('wrong'); });
    $('.exp', box).innerHTML = (j === it.a ? '✅ Chính xác. ' : '❌ Chưa đúng. ') + it.e;
    if (j === it.a) R.correct++;
    var n = Object.keys(R.answered).length;
    var sc = $('#sc-' + id);
    if (n === R.items.length) {
      var prev = mem.quiz[id], best = Math.max(prev ? prev.best : 0, R.correct);
      mem.quiz[id] = { best: best, total: R.items.length }; store.save();
      sc.textContent = 'Kết quả: ' + R.correct + '/' + R.items.length + ' · Cao nhất: ' + best + '/' + R.items.length + (R.correct / R.items.length >= 0.7 ? ' 🎉 Đạt' : ' — nên đọc lại phần giải thích rồi làm lại');
      updateChrome();
    } else sc.textContent = 'Đã trả lời ' + n + '/' + R.items.length + ' · đúng ' + R.correct;
  }

  /* ---------- dự án CV ---------- */
  function pageProjects() {
    var h = '<h1>🧪 Dự án làm CV</h1><p>Nhà tuyển dụng fresher helpdesk muốn thấy bạn <b>đã tự tay làm</b>. Sáu dự án dưới đây đều chạy được trên máy cá nhân (miễn phí), mỗi dự án tạo ra bằng chứng cụ thể: ảnh chụp màn hình, tài liệu, script, repo GitHub. <b>Tối thiểu hãy làm dự án 1, 2 và 3</b> (khoảng 1–2 ngày cuối tuần); dự án 4–6 để nổi bật.</p>';
    h += '<aside class="tip"><p>Cách trình bày: tạo 1 repo GitHub tên <code>it-support-portfolio</code>, mỗi dự án 1 thư mục có <code>README.md</code> (mục tiêu → sơ đồ → các bước → ảnh chụp → bài học/lỗi đã gặp). Dán link repo vào CV và LinkedIn.</p></aside>';
    C.projects.forEach(function (p, i) {
      h += '<article class="lesson proj"><header><h2>Dự án ' + (i + 1) + ': ' + esc(p.title) + '</h2><span class="pill">' + esc(p.level) + '</span><span class="pill">⏱ ' + esc(p.time) + '</span></header>' + p.html + '</article>';
    });
    return h;
  }

  /* ---------- phỏng vấn ---------- */
  var ivFilter = { cat: 'Tất cả', q: '' };
  function pageInterview() {
    var cats = ['Tất cả']; C.interview.forEach(function (x) { if (cats.indexOf(x.cat) < 0) cats.push(x.cat); });
    var h = '<h1>🎤 Hỏi đáp phỏng vấn IT Support fresher</h1><p>Đọc câu hỏi, <b>tự trả lời thành tiếng trước</b>, rồi mới mở đáp án. Đáp án là khung ý chính — hãy diễn đạt lại bằng ví dụ từ lab của chính bạn.</p>' +
      '<div class="toolbar"><input id="ivSearch" type="search" placeholder="Tìm câu hỏi…" value="' + esc(ivFilter.q) + '"><div class="chips">' +
      cats.map(function (c) { return '<button class="chip ' + (c === ivFilter.cat ? 'on' : '') + '" data-act="ivcat" data-cat="' + esc(c) + '">' + esc(c) + '</button>'; }).join('') + '</div></div>' +
      '<div id="ivList"></div>';
    return h;
  }
  function ivList() {
    var q = ivFilter.q.toLowerCase(), out = '', n = 0;
    C.interview.forEach(function (x) {
      if (ivFilter.cat !== 'Tất cả' && x.cat !== ivFilter.cat) return;
      if (q && (x.q + ' ' + x.a).toLowerCase().indexOf(q) < 0) return;
      n++;
      out += '<details class="qa"><summary><span>' + x.q + '</span><span class="lv">' + esc(x.cat) + '</span></summary><div class="ans">' + x.a + '</div></details>';
    });
    $('#ivList').innerHTML = (out || '<p>Không có câu hỏi phù hợp.</p>') + '<p class="hint">' + n + ' câu</p>';
  }

  /* ---------- cheatsheet ---------- */
  var chFilter = { cat: 'Tất cả', q: '' };
  function pageCheat() {
    var cats = ['Tất cả']; C.cheats.forEach(function (x) { if (cats.indexOf(x.cat) < 0) cats.push(x.cat); });
    return '<h1>📋 Cheatsheet lệnh &amp; công cụ</h1><p>Tra nhanh khi làm lab và khi đi làm. Bấm <b>Chép</b> để copy lệnh.</p>' +
      '<div class="toolbar"><input id="chSearch" type="search" placeholder="Tìm lệnh hoặc chức năng (vd: dns, reset, disk)…" value="' + esc(chFilter.q) + '"><div class="chips">' +
      cats.map(function (c) { return '<button class="chip ' + (c === chFilter.cat ? 'on' : '') + '" data-act="chcat" data-cat="' + esc(c) + '">' + esc(c) + '</button>'; }).join('') + '</div></div><div id="chList"></div>';
  }
  function chList() {
    var q = chFilter.q.toLowerCase(), groups = {}, order = [];
    C.cheats.forEach(function (x) {
      if (chFilter.cat !== 'Tất cả' && x.cat !== chFilter.cat) return;
      if (q && (x.c + ' ' + x.d).toLowerCase().indexOf(q) < 0) return;
      if (!groups[x.cat]) { groups[x.cat] = []; order.push(x.cat); }
      groups[x.cat].push(x);
    });
    var h = '';
    order.forEach(function (g) {
      h += '<h3>' + esc(g) + '</h3><div class="card" style="padding:0">';
      groups[g].forEach(function (x) { h += '<div class="cmd"><code>' + esc(x.c) + '</code><span>' + x.d + '</span><button data-act="copycmd" data-c="' + esc(x.c) + '">Chép</button></div>'; });
      h += '</div>';
    });
    $('#chList').innerHTML = h || '<p>Không tìm thấy.</p>';
  }

  /* ---------- ghi chú ---------- */
  var noteUI = { editing: null, day: -1, q: '' };   // day: -1 = tất cả, 0 = ghi chú chung, 1..7 = theo ngày
  function newId() { return 'n' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function findNote(id) { for (var i = 0; i < mem.notes.length; i++) if (mem.notes[i].id === id) return mem.notes[i]; return null; }
  function lessonLabel(dayNo, id) {
    var d = C.days[dayNo - 1];
    if (!id || !d) return 'Chung';
    for (var i = 0; i < d.lessons.length; i++) if (d.lessons[i].id === id) return 'Bài ' + (i + 1) + '. ' + d.lessons[i].title;
    return 'Chung';
  }
  function fmtTime(ts) {
    var d = new Date(ts);
    return d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }
  function notesFor(dayNo, q) {
    q = (q || '').toLowerCase();
    return mem.notes.filter(function (n) {
      return (dayNo === -1 || n.day === dayNo) && (!q || (n.text + ' ' + lessonLabel(n.day, n.lesson)).toLowerCase().indexOf(q) >= 0);
    }).sort(function (a, b) { return (b.upd || b.ts) - (a.upd || a.ts); });
  }
  function noteItem(n) {
    var h = '<div class="note"><div class="note-meta"><span class="pill">' + (n.day ? 'Ngày ' + n.day : 'Chung') + '</span><span class="note-lesson">' + esc(lessonLabel(n.day, n.lesson)) + '</span><span class="note-time">' + fmtTime(n.upd || n.ts) + '</span></div>';
    if (noteUI.editing === n.id) {
      h += '<textarea class="in note-edit" id="ne-' + n.id + '" rows="4">' + esc(n.text) + '</textarea><div class="note-actions"><button class="markbtn on" data-act="notesave" data-id="' + n.id + '">Lưu</button><button class="markbtn" data-act="notecancel">Huỷ</button></div>';
    } else {
      h += '<div class="note-text">' + esc(n.text) + '</div><div class="note-actions"><button class="markbtn" data-act="noteedit" data-id="' + n.id + '">Sửa</button><button class="markbtn" data-act="notedel" data-id="' + n.id + '">Xoá</button></div>';
    }
    return h + '</div>';
  }
  function dayNoteList(dayNo) {
    var l = notesFor(dayNo, '');
    return l.map(noteItem).join('') || '<p class="hint">Chưa có ghi chú nào cho ngày này.</p>';
  }
  function dayNotesSection(d) {
    var opts = '<option value="">Chung cả ngày</option>' + d.lessons.map(function (l, i) { return '<option value="' + l.id + '">Bài ' + (i + 1) + '. ' + esc(l.title) + '</option>'; }).join('');
    return '<section class="notesbox" id="dnotes"><div class="section-title"><h2>📝 Ghi chú của bạn — Ngày ' + d.n + '</h2></div>' +
      '<p class="hint">Viết bằng lời của bạn: ý chính, lệnh cần nhớ, chỗ hay nhầm, câu hỏi cần tra thêm. Có thể thêm nhiều ghi chú. Tất cả được gom ở trang <a href="#/notes">Ghi chú của tôi</a> để ôn trước phỏng vấn.</p>' +
      '<div class="noteform"><select class="in" id="nl-' + d.n + '" aria-label="Gắn vào bài">' + opts + '</select>' +
      '<textarea class="in" id="nt-' + d.n + '" rows="3" placeholder="Ghi chú mới… (Ctrl+Enter để lưu)"></textarea>' +
      '<button class="btn" data-act="noteadd" data-day="' + d.n + '">Thêm ghi chú</button></div>' +
      '<div id="notes-day-' + d.n + '" class="notelist">' + dayNoteList(d.n) + '</div></section>';
  }
  function notesAllHtml() {
    var list = notesFor(noteUI.day, noteUI.q), groups = {}, order = [], out = '';
    if (!list.length) return '<p class="hint">' + (mem.notes.length ? 'Không có ghi chú phù hợp.' : 'Bạn chưa có ghi chú nào. Vào một ngày học và bấm “📝 Ghi chú bài này”, hoặc viết ghi chú chung ở trên.') + '</p>';
    list.forEach(function (n) { if (!groups[n.day]) { groups[n.day] = []; order.push(n.day); } groups[n.day].push(n); });
    order.sort(function (a, b) { return a - b; });
    order.forEach(function (g) {
      out += '<h3>' + (g ? 'Ngày ' + g + ' — ' + esc(C.days[g - 1].title) : 'Ghi chú chung') + ' <small class="hint">(' + groups[g].length + ')</small></h3>' + groups[g].map(noteItem).join('');
    });
    return out;
  }
  function pageNotes() {
    var chips = [['-1', 'Tất cả'], ['0', 'Chung']].concat(C.days.map(function (d) { return [String(d.n), 'Ngày ' + d.n]; }));
    var dayOpts = '<option value="0">Ghi chú chung</option>' + C.days.map(function (d) { return '<option value="' + d.n + '">Ngày ' + d.n + '</option>'; }).join('');
    return '<h1>📝 Ghi chú của tôi</h1><p>Toàn bộ ghi chú của bạn qua 7 ngày, gom theo ngày. Đọc lại trang này trước buổi phỏng vấn: đây là bản tóm tắt viết bằng lời của chính bạn nên dễ nhớ hơn tài liệu có sẵn. Ghi chú được lưu trong trình duyệt này, hãy dùng nút xuất bên dưới để sao lưu.</p>' +
      '<div class="noteform"><select class="in" id="nd-new" aria-label="Ngày">' + dayOpts + '</select><textarea class="in" id="nt-new" rows="3" placeholder="Thêm ghi chú nhanh… (Ctrl+Enter để lưu)"></textarea><button class="btn" data-act="noteaddgen">Thêm ghi chú</button></div>' +
      '<div class="toolbar"><input id="nSearch" type="search" placeholder="Tìm trong ghi chú…" value="' + esc(noteUI.q) + '"><div class="chips">' +
      chips.map(function (c) { return '<button class="chip ' + (String(noteUI.day) === c[0] ? 'on' : '') + '" data-act="notefilter" data-day="' + c[0] + '">' + c[1] + '</button>'; }).join('') + '</div></div>' +
      '<div class="toolbar"><button class="markbtn" data-act="noteexport-copy">📋 Chép tất cả (Markdown)</button><button class="markbtn" data-act="noteexport-dl">⬇ Tải file .md</button><span class="hint" style="align-self:center">' + mem.notes.length + ' ghi chú</span></div>' +
      '<div id="notes-all" class="notelist">' + notesAllHtml() + '</div>';
  }
  function refreshNotes() {
    var all = $('#notes-all'); if (all) all.innerHTML = notesAllHtml();
    C.days.forEach(function (d) { var el = $('#notes-day-' + d.n); if (el) el.innerHTML = dayNoteList(d.n); });
    $$('[data-ncount]').forEach(function (el) { el.textContent = notesFor(+el.dataset.ncount, '').length; });
  }
  function addNote(dayNo, lessonId, ta) {
    if (!ta) return;
    var text = ta.value.trim();
    if (!text) { ta.focus(); return; }
    mem.notes.push({ id: newId(), day: dayNo, lesson: lessonId || '', text: text.slice(0, 5000), ts: Date.now() });
    ta.value = ''; store.save(); refreshNotes(); markActive();
  }
  function notesMarkdown() {
    var out = '# Ghi chú IT Support Fresher\n\n', groups = {};
    if (!mem.notes.length) return out + '(Chưa có ghi chú)\n';
    mem.notes.slice().sort(function (a, b) { return a.ts - b.ts; }).forEach(function (n) { (groups[n.day] = groups[n.day] || []).push(n); });
    Object.keys(groups).map(Number).sort(function (a, b) { return a - b; }).forEach(function (g) {
      out += '## ' + (g ? 'Ngày ' + g + ' — ' + C.days[g - 1].title : 'Ghi chú chung') + '\n\n';
      groups[g].forEach(function (n) { out += '### ' + lessonLabel(n.day, n.lesson) + '\n\n' + n.text + '\n\n'; });
    });
    return out;
  }
  function downloadNotes() {
    var blob = new Blob([notesMarkdown()], { type: 'text/markdown;charset=utf-8' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'ghi-chu-it-support.md';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }
  function noteAction(act, t) {
    if (act === 'noteadd') {
      var dn = +t.dataset.day, sel = $('#nl-' + dn);
      addNote(dn, sel ? sel.value : '', $('#nt-' + dn));
    } else if (act === 'noteaddgen') {
      var ds = $('#nd-new');
      addNote(ds ? +ds.value : 0, '', $('#nt-new'));
    } else if (act === 'notelesson') {
      var d2 = +t.dataset.day, box = $('#dnotes'), s2 = $('#nl-' + d2), ta2 = $('#nt-' + d2);
      if (s2) s2.value = t.dataset.id;
      if (box) box.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (ta2) setTimeout(function () { ta2.focus(); }, 450);
    } else if (act === 'noteedit') {
      noteUI.editing = t.dataset.id; refreshNotes();
      var ed = $('#ne-' + t.dataset.id); if (ed) ed.focus();
    } else if (act === 'notecancel') {
      noteUI.editing = null; refreshNotes();
    } else if (act === 'notesave') {
      var n = findNote(t.dataset.id), te = $('#ne-' + t.dataset.id);
      if (n && te && te.value.trim()) { n.text = te.value.trim().slice(0, 5000); n.upd = Date.now(); store.save(); }
      noteUI.editing = null; refreshNotes();
    } else if (act === 'notedel') {
      if (window.confirm('Xoá ghi chú này?')) { mem.notes = mem.notes.filter(function (x) { return x.id !== t.dataset.id; }); store.save(); refreshNotes(); }
    } else if (act === 'notefilter') {
      noteUI.day = +t.dataset.day;
      $$('[data-act="notefilter"]').forEach(function (b) { b.classList.toggle('on', b === t); });
      refreshNotes();
    } else if (act === 'noteexport-copy') copy(notesMarkdown(), t);
    else if (act === 'noteexport-dl') downloadNotes();
    else if (act === 'reviewdone') {
      var r = mem.reviews[t.dataset.id];
      if (r) { r.step++; store.save(); }
      markActive(); route();
    }
  }

  /* ---------- ôn tập cách quãng ---------- */
  var REVIEW_DAYS = [1, 3, 7, 14];   // ôn sau 1, 3, 7, 14 ngày kể từ khi học xong
  function dueReviews() {
    var out = [], now = Date.now();
    C.days.forEach(function (d) {
      d.lessons.forEach(function (l, i) {
        var r = mem.reviews[l.id];
        if (!r || !mem.lessons[l.id] || r.step >= REVIEW_DAYS.length) return;
        if (now >= r.at + REVIEW_DAYS[r.step] * 864e5) out.push({ d: d, l: l, i: i, r: r });
      });
    });
    return out;
  }
  function reviewCard() {
    var due = dueReviews(), pending = 0;
    Object.keys(mem.reviews).forEach(function (k) { if (mem.lessons[k] && mem.reviews[k].step < REVIEW_DAYS.length) pending++; });
    if (!pending) return '';
    if (!due.length) return '<div class="card review"><b>📚 Ôn tập cách quãng:</b> chưa có bài nào đến hạn ôn hôm nay. Có ' + pending + ' bài đang chờ lịch ôn (sau 1, 3, 7, 14 ngày kể từ khi học xong).</div>';
    var h = '<div class="card review"><h2>📚 Ôn tập hôm nay (' + due.length + ' bài)</h2><p class="hint">Đóng bài lại, nhắc lại ý chính bằng lời của bạn, rồi mở bài ra đối chiếu. Chỗ nào quên thì ghi vào ghi chú. Xong bấm “Đã ôn”.</p>';
    due.forEach(function (x) {
      h += '<div class="rv"><a href="#/day/' + x.d.n + '">Ngày ' + x.d.n + ' · Bài ' + (x.i + 1) + '. ' + esc(x.l.title) + '</a><span class="hint">lần ôn ' + (x.r.step + 1) + '/' + REVIEW_DAYS.length + '</span><button class="markbtn" data-act="reviewdone" data-id="' + x.l.id + '">Đã ôn</button></div>';
    });
    return h + '</div>';
  }

  /* ---------- 404 ---------- */
  function notFound() { return '<h1>Không tìm thấy trang</h1><p><a href="#/">Về tổng quan</a></p>'; }

  /* ---------- router ---------- */
  function route() {
    noteUI.editing = null;
    if (window.TOOLS) TOOLS.leave();
    var r = (location.hash || '#/').replace(/^#\/?/, '').replace(/\/$/, ''), html;
    var m = r.match(/^day\/(\d+)$/);
    if (r === '') html = pageHome();
    else if (m) html = pageDay(+m[1]);
    else if (r === 'projects') html = pageProjects();
    else if (r === 'interview') html = pageInterview();
    else if (r === 'cheatsheet') html = pageCheat();
    else if (r === 'tools' || /^tools\/[\w-]+$/.test(r)) html = TOOLS.page(r.slice(6));
    else if (r === 'notes') html = pageNotes();
    else html = notFound();
    $('#main').innerHTML = html;
    renderNav(m ? 'day/' + m[1] : r.indexOf('tools') === 0 ? 'tools' : r);
    document.body.classList.remove('navopen');
    document.body.classList.toggle('wide', r.indexOf('tools') === 0);
    addCopyButtons();
    if (r === 'interview') ivList();
    if (r === 'cheatsheet') chList();
    if (r === 'tools' || r.indexOf('tools/') === 0) TOOLS.mount(r.slice(6));
    var pageTitle = m && C.days[+m[1] - 1] ? 'Ngày ' + m[1] + ': ' + C.days[+m[1] - 1].title : 'IT Support Fresher trong 7 ngày';
    document.title = pageTitle;
    window.scrollTo(0, 0);
  }
  function addCopyButtons() {
    $$('#main pre').forEach(function (pre) {
      if ($('.copy', pre)) return;
      var b = document.createElement('button'); b.className = 'copy'; b.textContent = 'Chép'; b.dataset.act = 'copypre'; pre.appendChild(b);
    });
  }
  function copy(text, btn) {
    var done = function () { if (btn) { var o = btn.textContent; btn.textContent = 'Đã chép ✓'; setTimeout(function () { btn.textContent = o; }, 1200); } };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
    else { var t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (e) {} t.remove(); done(); }
  }

  /* ---------- sự kiện ---------- */
  document.addEventListener('click', function (e) {
    var g = e.target.closest('[data-goto]');
    if (g) { e.preventDefault(); var el = document.getElementById(g.dataset.goto); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    var t = e.target.closest('[data-act]'); if (!t) return;
    var act = t.dataset.act;
    if (act === 'opt') answer(t);
    else if (act === 'retry') { var id = t.dataset.quiz, R = quizReg[id]; var wrap = $('#qz-' + id); var holder = document.createElement('div'); holder.innerHTML = renderQuiz(id, R.items, R.track); wrap.replaceWith(holder.firstChild); }
    else if (act === 'lesson' || act === 'lab') {
      var bag = act === 'lesson' ? mem.lessons : mem.labs, key = t.dataset.id;
      bag[key] = !bag[key]; store.save();
      if (act === 'lesson') {
        if (bag[key]) { if (!mem.reviews[key]) mem.reviews[key] = { at: Date.now(), step: 0 }; } else delete mem.reviews[key];
        store.save();
      }
      if (bag[key]) markActive();
      t.classList.toggle('on', !!bag[key]);
      t.textContent = act === 'lesson' ? (bag[key] ? '✓ Đã học xong' : 'Đánh dấu đã học') : (bag[key] ? '✓ Đã làm xong lab' : 'Đánh dấu đã làm lab');
      var toc = $('[data-toc="' + key + '"]'); if (toc) { toc.classList.toggle('done', !!bag[key]); $('.chk', toc).textContent = bag[key] ? '✓' : ''; }
      updateChrome();
    }
    else if (act === 'copypre') copy($('code', t.parentNode).textContent, t);
    else if (act === 'copycmd') copy(t.dataset.c, t);
    else if (act === 'ivcat') { ivFilter.cat = t.dataset.cat; $$('[data-act="ivcat"]').forEach(function (b) { b.classList.toggle('on', b === t); }); ivList(); }
    else if (act === 'chcat') { chFilter.cat = t.dataset.cat; $$('[data-act="chcat"]').forEach(function (b) { b.classList.toggle('on', b === t); }); chList(); }
    else noteAction(act, t);
  });
  document.addEventListener('input', function (e) {
    if (e.target.id === 'ivSearch') { ivFilter.q = e.target.value; ivList(); }
    if (e.target.id === 'chSearch') { chFilter.q = e.target.value; chList(); }
    if (e.target.id === 'nSearch') { noteUI.q = e.target.value; refreshNotes(); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && /^nt-/.test(e.target.id)) {
      var b = e.target.parentNode.querySelector('[data-act^="noteadd"]'); if (b) b.click();
    }
  });

  /* giao diện sáng/tối */
  function applyTheme(t) { if (t) document.documentElement.setAttribute('data-theme', t); else document.documentElement.removeAttribute('data-theme'); }
  try { applyTheme(localStorage.getItem('itsh7-theme')); } catch (e) {}
  $('#themeBtn').addEventListener('click', function () {
    var cur = document.documentElement.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var nx = cur === 'dark' ? 'light' : 'dark'; applyTheme(nx); try { localStorage.setItem('itsh7-theme', nx); } catch (e) {}
  });
  $('#menuBtn').addEventListener('click', function () { document.body.classList.toggle('navopen'); });
  $('#scrim').addEventListener('click', function () { document.body.classList.remove('navopen'); });
  window.APP = { mem: mem, save: store.save, esc: esc, copy: copy, markActive: markActive };
  window.addEventListener('hashchange', route);
  route();
})();
