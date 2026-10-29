/* IT Support Fresher 7 ngày — ứng dụng một trang, không cần build. */
(function () {
  'use strict';
  var C = window.COURSE;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* ---------- lưu tiến độ ---------- */
  var KEY = 'itsh7-progress-v1';
  var mem = { lessons: {}, labs: {}, quiz: {}, cards: {} };
  var store = {
    load: function () { try { var j = JSON.parse(localStorage.getItem(KEY)); if (j) mem = Object.assign(mem, j); } catch (e) {} },
    save: function () { try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) {} }
  };
  store.load();

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
  }

  /* ---------- điều hướng ---------- */
  var NAV_EXTRA = [
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
      '<div class="btns"><a class="btn" href="#/day/1">▶ Bắt đầu Ngày 1</a><a class="btn ghost" href="#/projects">Xem dự án CV</a><a class="btn ghost" href="#/interview">Luyện phỏng vấn</a></div>' +
      '<div class="stats"><div class="stat"><b>7</b><span>ngày · 6–8 giờ/ngày</span></div><div class="stat"><b>' + lessons + '</b><span>bài học có ví dụ</span></div><div class="stat"><b>' + C.projects.length + '</b><span>dự án cho CV</span></div><div class="stat"><b>' + C.interview.length + '</b><span>câu hỏi phỏng vấn</span></div></div></section>';

    h += '<div class="section-title"><h2>Lộ trình 7 ngày</h2></div><div class="grid">';
    C.days.forEach(function (d) {
      var s = dayStats(d);
      h += '<a class="card daycard" href="#/day/' + d.n + '"><span class="tag">Ngày ' + d.n + '</span><h3>' + esc(d.title) + '</h3><p>' + esc(d.tagline) + '</p><div class="bar"><i style="width:' + s.pct + '%"></i></div><small class="hint">' + s.done + '/' + s.total + ' mục hoàn thành</small></a>';
    });
    h += '</div>';

    h += '<div class="section-title"><h2>Cách học để nhanh mà vẫn nhớ</h2></div><div class="cols">' +
      '<div><h3>1. Học – làm – kiểm tra</h3><p>Mỗi ngày: đọc bài (~40%), làm lab trên máy ảo (~40%), làm quiz + tình huống (~20%). <b>Gõ lệnh thật</b>, đừng chỉ đọc.</p></div>' +
      '<div><h3>2. Ghi chú như đi làm</h3><p>Mỗi lỗi bạn tự gây ra và tự sửa trong lab → viết thành 1 bài Knowledge Base ngắn. Đó là bằng chứng kinh nghiệm cho CV.</p></div>' +
      '<div><h3>3. Đừng bỏ ngày 7</h3><p>Dự án + CV + phỏng vấn mới là thứ biến kiến thức thành offer. Nếu thiếu thời gian, rút bớt nội dung phụ ở ngày 5–6, đừng rút ngày 7.</p></div></div>';

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
      '<a href="#/day/' + d.n + '" data-goto="quiz' + d.n + '"><span class="chk"></span>✅ Quiz &amp; tình huống</a></nav>';

    d.lessons.forEach(function (l, i) {
      h += '<article class="lesson" id="' + l.id + '"><header><h2>Bài ' + (i + 1) + '. ' + esc(l.title) + '</h2><span class="min">⏱ ' + l.min + ' phút</span></header>' + l.html +
        '<div class="lesson-foot"><button class="markbtn ' + (mem.lessons[l.id] ? 'on' : '') + '" data-act="lesson" data-id="' + l.id + '">' + (mem.lessons[l.id] ? '✓ Đã học xong' : 'Đánh dấu đã học') + '</button></div></article>';
    });

    h += '<section class="labbox" id="lab' + d.n + '"><h2>🧪 Lab: ' + esc(d.lab.title) + '</h2>' + d.lab.html +
      '<div class="lesson-foot"><button class="markbtn ' + (mem.labs['d' + d.n] ? 'on' : '') + '" data-act="lab" data-id="d' + d.n + '">' + (mem.labs['d' + d.n] ? '✓ Đã làm xong lab' : 'Đánh dấu đã làm lab') + '</button></div></section>';

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

  /* ---------- công cụ: subnet, terminal, ports ---------- */
  function pageTools() {
    var h = '<h1>🛠️ Công cụ luyện tập</h1><p>Ba công cụ nhỏ chạy ngay trong trình duyệt để luyện những kỹ năng hay bị hỏi nhất: tính subnet, đọc kết quả lệnh mạng, nhớ cổng dịch vụ.</p>';
    h += '<div class="section-title"><h2>1. Máy tính subnet (IPv4)</h2></div><div class="card"><div class="field"><input class="in" id="snIp" value="192.168.10.77" aria-label="Địa chỉ IP"><span>/</span><input class="in" id="snCidr" type="number" min="0" max="32" value="26" style="width:80px" aria-label="Prefix"><button class="btn" data-act="subnet">Tính</button></div><div id="snOut" class="result"></div><p class="hint">Thử: 10.0.5.130/22 · 172.16.4.9/20 · 192.168.1.1/30. Tự tính tay trước (xem Ngày 3), rồi dùng công cụ để kiểm tra.</p></div>';
    h += '<div class="section-title"><h2>2. Terminal mô phỏng — chẩn đoán mạng</h2></div><div class="card"><p>Chọn một sự cố, rồi dùng <code>ipconfig</code>, <code>ping</code>, <code>nslookup</code>, <code>tracert</code>… để tìm nguyên nhân như đang hỗ trợ user thật. Gõ <code>help</code> để xem lệnh.</p>' +
      '<div class="field"><select class="in" id="tmCase"><option value="ok">Mạng bình thường</option><option value="apipa">Sự cố A (user: “mất mạng”)</option><option value="dns">Sự cố B (user: “vào web không được”)</option><option value="gw">Sự cố C (user: “internet đứt”)</option><option value="vpn">Sự cố D (user: “không vào được file server”)</option></select><button class="markbtn" data-act="tmreveal">Xem đáp án</button></div>' +
      '<div class="term" id="term" tabindex="0"></div><p class="hint" id="tmAns"></p></div>';
    h += '<div class="section-title"><h2>3. Cổng (port) &amp; giao thức hay gặp</h2></div><div class="card" style="padding:0"><table><thead><tr><th>Cổng</th><th>Giao thức</th><th>Dịch vụ</th><th>Gặp khi nào</th></tr></thead><tbody>' +
      C.ports.map(function (p) { return '<tr><td><code>' + p[0] + '</code></td><td>' + p[1] + '</td><td>' + p[2] + '</td><td>' + p[3] + '</td></tr>'; }).join('') + '</tbody></table></div>';
    return h;
  }
  function ip2n(s) { var p = s.trim().split('.'); if (p.length !== 4) return null; var n = 0; for (var i = 0; i < 4; i++) { var v = +p[i]; if (p[i] === '' || isNaN(v) || v < 0 || v > 255) return null; n = n * 256 + v; } return n; }
  function n2ip(n) { return [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.'); }
  function subnet() {
    var ip = ip2n($('#snIp').value), c = parseInt($('#snCidr').value, 10), out = $('#snOut');
    if (ip === null || isNaN(c) || c < 0 || c > 32) { out.innerHTML = '<div><b>Lỗi</b><span>IP hoặc prefix không hợp lệ</span></div>'; return; }
    var mask = c === 0 ? 0 : (0xFFFFFFFF << (32 - c)) >>> 0, net = (ip & mask) >>> 0, bc = (net | (~mask >>> 0)) >>> 0;
    var hosts = c >= 31 ? (c === 32 ? 1 : 2) : Math.pow(2, 32 - c) - 2;
    var first = c >= 31 ? net : net + 1, last = c >= 31 ? bc : bc - 1;
    var a = ip >>> 24, priv = (a === 10) || (a === 172 && ((ip >>> 16) & 255) >= 16 && ((ip >>> 16) & 255) <= 31) || (a === 192 && ((ip >>> 16) & 255) === 168);
    var kind = priv ? 'Private (RFC1918)' : (a === 169 && ((ip >>> 16) & 255) === 254) ? 'APIPA (DHCP lỗi!)' : a === 127 ? 'Loopback' : 'Public / khác';
    var cls = a < 128 ? 'A' : a < 192 ? 'B' : a < 224 ? 'C' : a < 240 ? 'D (multicast)' : 'E';
    var rows = [['Network', n2ip(net)], ['Broadcast', n2ip(bc)], ['Subnet mask', n2ip(mask)], ['Wildcard', n2ip(~mask >>> 0)], ['Host đầu tiên', n2ip(first)], ['Host cuối cùng', n2ip(last)], ['Số host dùng được', hosts.toLocaleString('vi-VN')], ['Loại địa chỉ', kind + ' · lớp ' + cls], ['Nhị phân mask', n2ip(mask).split('.').map(function (x) { return ('00000000' + (+x).toString(2)).slice(-8); }).join('.')]];
    out.innerHTML = rows.map(function (r) { return '<div><b>' + r[0] + '</b><span>' + r[1] + '</span></div>'; }).join('');
  }

  /* terminal mô phỏng */
  var T = { case: 'ok', hist: [] };
  var NET = {
    ok:    { ip: '192.168.1.45', mask: '255.255.255.0', gw: '192.168.1.1', dns: '192.168.1.10', ping: { gw: true, ext: true, dns: true } },
    apipa: { ip: '169.254.87.12', mask: '255.255.0.0', gw: '', dns: '', ping: { gw: false, ext: false, dns: false } },
    dns:   { ip: '192.168.1.45', mask: '255.255.255.0', gw: '192.168.1.1', dns: '192.168.1.10', ping: { gw: true, ext: true, dns: false } },
    gw:    { ip: '192.168.1.45', mask: '255.255.255.0', gw: '192.168.1.1', dns: '192.168.1.10', ping: { gw: false, ext: false, dns: false } },
    vpn:   { ip: '192.168.1.45', mask: '255.255.255.0', gw: '192.168.1.1', dns: '8.8.8.8', ping: { gw: true, ext: true, dns: true }, dnsPublic: true }
  };
  var ANS = {
    ok: 'Mạng bình thường — dùng để so sánh với các sự cố.',
    apipa: 'Đáp án A: IP 169.254.x.x (APIPA) = máy không nhận được địa chỉ từ DHCP. Kiểm tra cáp/Wi-Fi, DHCP server, rồi ipconfig /release → /renew.',
    dns: 'Đáp án B: ping IP (8.8.8.8) được nhưng ping tên thì không → lỗi phân giải DNS. Kiểm tra DNS server được cấp, ipconfig /flushdns, nslookup, đổi thử DNS.',
    gw: 'Đáp án C: có IP hợp lệ nhưng không ping được default gateway → lỗi từ gateway/switch/cáp/VLAN trở đi (không phải lỗi máy user). Báo L2/network, thử cổng/cáp/Wi-Fi khác.',
    vpn: 'Đáp án D: máy dùng DNS công cộng 8.8.8.8 nên không phân giải được tên nội bộ (fileserver.corp.local). Do VPN/DHCP không cấp DNS nội bộ: kết nối lại VPN, kiểm tra cấu hình DNS của VPN adapter.'
  };
  function tprint(t, cls) { var d = document.createElement('div'); d.className = 'l ' + (cls || ''); d.textContent = t; var term = $('#term'); term.insertBefore(d, $('#tmLine')); term.scrollTop = term.scrollHeight; }
  function termInit() {
    var term = $('#term'); if (!term) return;
    term.innerHTML = '<div class="l">Microsoft Windows [Version 10.0.22631.4890]\n(Giả lập — gõ "help" để xem lệnh)\n</div><div id="tmLine"><span class="p">C:\\Users\\user&gt;</span> <input id="tmIn" autocomplete="off" spellcheck="false" aria-label="Dòng lệnh"></div>';
    $('#tmIn').addEventListener('keydown', function (e) { if (e.key === 'Enter') { var v = this.value; this.value = ''; runCmd(v); } });
    term.addEventListener('click', function () { $('#tmIn').focus(); });
  }
  function resolve(host, N) {
    host = host.toLowerCase();
    var map = { 'google.com': '142.250.199.14', 'www.google.com': '142.250.199.14', 'fileserver.corp.local': '192.168.1.20', 'corp.local': '192.168.1.10', 'dc01.corp.local': '192.168.1.10', 'microsoft.com': '20.70.246.20' };
    if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) return host;
    if (T.case === 'dns' || T.case === 'apipa' || T.case === 'gw') return null;
    if (T.case === 'vpn' && /corp\.local$/.test(host)) return null;
    return map[host] || null;
  }
  function runCmd(raw) {
    var cmd = raw.trim(), N = NET[T.case], low = cmd.toLowerCase(), a = low.split(/\s+/);
    tprint('C:\\Users\\user> ' + cmd, 'p');
    if (!cmd) return;
    if (a[0] === 'help') return tprint('Lệnh: ipconfig [/all|/release|/renew|/flushdns] · ping <host> · nslookup <host> · tracert <host> · hostname · whoami · arp -a · netstat -an · cls');
    if (a[0] === 'cls') { $$('#term .l').forEach(function (x) { x.remove(); }); return; }
    if (a[0] === 'hostname') return tprint('PC-ACC-017');
    if (a[0] === 'whoami') return tprint('corp\\nguyen.an');
    if (a[0] === 'ipconfig') {
      if (a[1] === '/flushdns') return tprint('Windows IP Configuration\n\nSuccessfully flushed the DNS Resolver Cache.');
      if (a[1] === '/release') return tprint('Windows IP Configuration\n\nEthernet adapter Ethernet:\n\n   Connection-specific DNS Suffix  . :\n   Default Gateway . . . . . . . . . :\n   (Địa chỉ IPv4 đã được trả lại cho DHCP server)');
      if (a[1] === '/renew') return tprint(T.case === 'apipa' ? 'An error occurred while renewing interface Ethernet : unable to contact your DHCP server. Request has timed out.' : 'Ethernet adapter Ethernet:\n   IPv4 Address. . . . . . . . . . . : ' + N.ip + '\n   (Đã gia hạn thành công)');
      var full = a[1] === '/all';
      var o = 'Windows IP Configuration\n\n' + (full ? '   Host Name . . . . . . . . . . . . : PC-ACC-017\n   Primary Dns Suffix  . . . . . . . : corp.local\n' : '') + 'Ethernet adapter Ethernet:\n\n   Connection-specific DNS Suffix  . : ' + (T.case === 'apipa' ? '' : 'corp.local') + '\n' +
        (full ? '   Physical Address. . . . . . . . . : 8C-16-45-A2-3F-1B\n   DHCP Enabled. . . . . . . . . . . : Yes\n' : '') +
        (T.case === 'apipa' ? '   Autoconfiguration IPv4 Address. . : ' + N.ip + '(Preferred)\n' : '   IPv4 Address. . . . . . . . . . . : ' + N.ip + '(Preferred)\n') +
        '   Subnet Mask . . . . . . . . . . . : ' + N.mask + '\n   Default Gateway . . . . . . . . . : ' + N.gw + '\n' +
        (full ? '   DHCP Server . . . . . . . . . . . : ' + (T.case === 'apipa' ? '' : '192.168.1.10') + '\n   DNS Servers . . . . . . . . . . . : ' + N.dns + '\n' : '');
      return tprint(o);
    }
    if (a[0] === 'ping') {
      var host = a[1]; if (!host) return tprint('Usage: ping <host>');
      var ip = resolve(host, N);
      if (!ip) return tprint('Ping request could not find host ' + host + '. Please check the name and try again.');
      var ok = ip === '127.0.0.1' || ip === N.ip ? true : ip === N.gw ? N.ping.gw : (ip === '192.168.1.10' ? N.ping.gw : N.ping.ext);
      if (ip === '192.168.1.20' && T.case === 'vpn') ok = false;
      var lines = 'Pinging ' + (host !== ip ? host + ' [' + ip + ']' : ip) + ' with 32 bytes of data:\n';
      if (ok) { for (var i = 0; i < 4; i++) lines += 'Reply from ' + ip + ': bytes=32 time=' + (ip === N.gw ? 1 : 14 + i * 2) + 'ms TTL=' + (ip === N.gw ? 64 : 117) + '\n'; lines += '\nPing statistics for ' + ip + ':\n    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)'; }
      else { var msg = T.case === 'apipa' ? 'PING: transmit failed. General failure.' : 'Request timed out.'; for (var k = 0; k < 4; k++) lines += msg + '\n'; lines += '\nPing statistics for ' + ip + ':\n    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss)'; }
      return tprint(lines);
    }
    if (a[0] === 'nslookup') {
      var h = a[1]; if (!h) return tprint('Usage: nslookup <host>');
      var r = resolve(h, N);
      var head = 'Server:  ' + (N.dns || 'UnKnown') + '\nAddress:  ' + (N.dns || '') + '\n\n';
      if (T.case === 'apipa') return tprint('DNS request timed out.\n    timeout was 2 seconds.\n*** Can\'t find server name for address ' + '(none)' + ': Timed out');
      if (T.case === 'dns') return tprint('DNS request timed out.\n    timeout was 2 seconds.\nServer:  UnKnown\nAddress:  ' + N.dns + '\n\n*** UnKnown can\'t find ' + h + ': Timed out');
      if (!r) return tprint(head + '*** ' + (N.dns) + ' can\'t find ' + h + ': Non-existent domain');
      return tprint(head + 'Name:    ' + h + '\nAddress:  ' + r);
    }
    if (a[0] === 'tracert') {
      var t = a[1]; if (!t) return tprint('Usage: tracert <host>');
      var rip = resolve(t, N); if (!rip) return tprint('Unable to resolve target system name ' + t + '.');
      if (!N.ping.gw) return tprint('Tracing route to ' + t + ' [' + rip + ']\n\n  1     *        *        *     Request timed out.\n  2     *        *        *     Request timed out.\n  3     *        *        *     Request timed out.');
      return tprint('Tracing route to ' + t + ' [' + rip + ']\nover a maximum of 30 hops:\n\n  1    <1 ms    <1 ms    <1 ms  192.168.1.1\n  2     5 ms     4 ms     5 ms  10.20.0.1\n  3    12 ms    11 ms    12 ms  203.0.113.9\n  4    14 ms    15 ms    14 ms  ' + rip + '\n\nTrace complete.');
    }
    if (a[0] === 'arp') return tprint('Interface: ' + N.ip + ' --- 0x7\n  Internet Address      Physical Address      Type\n  ' + (N.gw || '192.168.1.1') + '        b0-4e-26-1c-9d-02     dynamic\n  192.168.1.255         ff-ff-ff-ff-ff-ff     static');
    if (a[0] === 'netstat') return tprint('Active Connections\n\n  Proto  Local Address          Foreign Address        State\n  TCP    ' + N.ip + ':50321   142.250.199.14:443     ESTABLISHED\n  TCP    ' + N.ip + ':50400   192.168.1.20:445       ESTABLISHED\n  TCP    0.0.0.0:135            0.0.0.0:0              LISTENING');
    tprint("'" + a[0] + "' is not recognized as an internal or external command (hoặc chưa được giả lập). Gõ help.");
  }

  /* ---------- 404 ---------- */
  function notFound() { return '<h1>Không tìm thấy trang</h1><p><a href="#/">Về tổng quan</a></p>'; }

  /* ---------- router ---------- */
  function route() {
    var r = (location.hash || '#/').replace(/^#\/?/, '').replace(/\/$/, ''), html;
    var m = r.match(/^day\/(\d+)$/);
    if (r === '') html = pageHome();
    else if (m) html = pageDay(+m[1]);
    else if (r === 'projects') html = pageProjects();
    else if (r === 'interview') html = pageInterview();
    else if (r === 'cheatsheet') html = pageCheat();
    else if (r === 'tools') html = pageTools();
    else html = notFound();
    $('#main').innerHTML = html;
    renderNav(m ? 'day/' + m[1] : r);
    document.body.classList.remove('navopen');
    addCopyButtons();
    if (r === 'interview') ivList();
    if (r === 'cheatsheet') chList();
    if (r === 'tools') { subnet(); T.case = 'ok'; termInit(); }
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
      t.classList.toggle('on', !!bag[key]);
      t.textContent = act === 'lesson' ? (bag[key] ? '✓ Đã học xong' : 'Đánh dấu đã học') : (bag[key] ? '✓ Đã làm xong lab' : 'Đánh dấu đã làm lab');
      var toc = $('[data-toc="' + key + '"]'); if (toc) { toc.classList.toggle('done', !!bag[key]); $('.chk', toc).textContent = bag[key] ? '✓' : ''; }
      updateChrome();
    }
    else if (act === 'copypre') copy($('code', t.parentNode).textContent, t);
    else if (act === 'copycmd') copy(t.dataset.c, t);
    else if (act === 'ivcat') { ivFilter.cat = t.dataset.cat; $$('[data-act="ivcat"]').forEach(function (b) { b.classList.toggle('on', b === t); }); ivList(); }
    else if (act === 'chcat') { chFilter.cat = t.dataset.cat; $$('[data-act="chcat"]').forEach(function (b) { b.classList.toggle('on', b === t); }); chList(); }
    else if (act === 'subnet') subnet();
    else if (act === 'tmreveal') $('#tmAns').textContent = ANS[T.case];
  });
  document.addEventListener('input', function (e) {
    if (e.target.id === 'ivSearch') { ivFilter.q = e.target.value; ivList(); }
    if (e.target.id === 'chSearch') { chFilter.q = e.target.value; chList(); }
  });
  document.addEventListener('change', function (e) {
    if (e.target.id === 'tmCase') { T.case = e.target.value; $('#tmAns').textContent = ''; termInit(); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Enter' && (e.target.id === 'snIp' || e.target.id === 'snCidr')) subnet(); });

  /* giao diện sáng/tối */
  function applyTheme(t) { if (t) document.documentElement.setAttribute('data-theme', t); else document.documentElement.removeAttribute('data-theme'); }
  try { applyTheme(localStorage.getItem('itsh7-theme')); } catch (e) {}
  $('#themeBtn').addEventListener('click', function () {
    var cur = document.documentElement.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var nx = cur === 'dark' ? 'light' : 'dark'; applyTheme(nx); try { localStorage.setItem('itsh7-theme', nx); } catch (e) {}
  });
  $('#menuBtn').addEventListener('click', function () { document.body.classList.toggle('navopen'); });
  $('#scrim').addEventListener('click', function () { document.body.classList.remove('navopen'); });
  window.addEventListener('hashchange', route);
  route();
})();
