/* Công cụ quy trình & ghi nhớ: phân loại ticket + SLA, giao tiếp với user, nhận diện phishing, thẻ ghi nhớ, thử thách gõ lệnh. */
(function () {
  'use strict';
  var T = TOOLS, esc = T.esc, D = window.TPRAC;
  function idxs(n) { var a = []; for (var i = 0; i < n; i++) a.push(i); return T.shuffle(a); }

  /* ================= Phân loại ticket + SLA ================= */
  var TYPES = [['Incident', 'Sự cố (Incident)'], ['Service Request', 'Yêu cầu dịch vụ'], ['Problem', 'Vấn đề gốc (Problem)'], ['Change', 'Thay đổi (Change)']];
  var ROUTES = [['l1', 'L1 xử lý ngay'], ['sys', 'L2 Hệ thống / Ứng dụng'], ['net', 'L2 Mạng'], ['sec', 'Security'], ['appr', 'Chờ phê duyệt / CAB'], ['info', 'Hỏi thêm thông tin']];
  var TR = { tab: 'practice', order: null, i: 0, a: {}, res: null, pts: 0, n: 0 };
  var SLA = { p: 2, mode: 'biz', pause: 0, when: '' };
  var SLA_T = { 1: { name: 'P1 – Nghiêm trọng', resp: 15, res: 240, cal: true, ex: 'Dịch vụ cốt lõi ngừng, nhiều người bị ảnh hưởng' }, 2: { name: 'P2 – Cao', resp: 30, res: 480, ex: 'Một nhóm/ người quan trọng không làm việc được' }, 3: { name: 'P3 – Trung bình', resp: 120, res: 1440, ex: 'Một người bị ảnh hưởng, có cách làm tạm' }, 4: { name: 'P4 – Thấp', resp: 240, res: 2400, ex: 'Câu hỏi, yêu cầu nhỏ, không gấp' } };
  function trDone() { var d = T.stat('triage'); return d.perfect || (d.perfect = {}); }
  function trNew() { TR.order = idxs(D.tickets.length); TR.i = 0; TR.a = {}; TR.res = null; }
  function chooser(label, key, items) {
    return '<div class="choice"><span class="lbl">' + label + '</span><div class="chips">' + items.map(function (x) { return '<button class="chip ' + (TR.a[key] === String(x[0]) ? 'on' : '') + '" data-a="tr" data-k="' + key + '" data-v="' + esc(x[0]) + '"' + (TR.res ? ' disabled' : '') + '>' + x[1] + '</button>'; }).join('') + '</div></div>';
  }
  function trPractice() {
    if (!TR.order) trNew();
    var t = D.tickets[TR.order[TR.i % TR.order.length]], h = '<div class="pq-meta"><span>Ticket ' + (TR.i + 1) + '</span><span>Điểm phiên: <b>' + TR.pts + '/' + (TR.n * 3) + '</b></span><span>Hoàn hảo: <b>' + Object.keys(trDone()).length + '/' + D.tickets.length + '</b></span></div>';
    h += '<div class="ticket"><div class="ticket-h"><span class="tk-id">NEW</span><span class="tk-from">' + esc(t.from) + '</span></div><div class="ticket-b"><b>' + esc(t.subj) + '</b><p>' + esc(t.body) + '</p></div></div>';
    h += '<div class="panel">' + chooser('1. Loại yêu cầu', 'type', TYPES) + chooser('2. Mức ưu tiên (Impact × Urgency)', 'pri', [[1, 'P1 Nghiêm trọng'], [2, 'P2 Cao'], [3, 'P3 Trung bình'], [4, 'P4 Thấp']]) + chooser('3. Chuyển cho ai / bước tiếp theo', 'route', ROUTES);
    if (!TR.res) h += '<div class="field"><button class="btn" data-a="trgrade"' + (TR.a.type && TR.a.pri && TR.a.route ? '' : ' disabled') + '>Chấm điểm</button><button class="markbtn" data-a="trskip">Bỏ qua</button><button class="markbtn" data-a="trmx">Xem ma trận ưu tiên</button></div>';
    else {
      var r = TR.res, row = function (ok, lab, right) { return '<li class="' + (ok ? 'y' : 'n') + '">' + (ok ? '✔' : '✘') + ' ' + lab + (ok ? '' : ' → đáp án: <b>' + right + '</b>') + '</li>'; };
      h += '<div class="verdict ' + (r.score === 3 ? 'ok' : r.score >= 2 ? 'warn' : 'bad') + '">' + (r.score === 3 ? '🎯 Hoàn hảo 3/3' : 'Đạt ' + r.score + '/3') + '<ul class="reqs">' + row(r.t, 'Loại', t.type === 'Incident' ? 'Sự cố (Incident)' : t.type === 'Service Request' ? 'Yêu cầu dịch vụ' : t.type === 'Problem' ? 'Vấn đề gốc (Problem)' : 'Thay đổi (Change)') + row(r.p, 'Ưu tiên', 'P' + t.pri) + row(r.r, 'Chuyển cho', ROUTES.filter(function (x) { return x[0] === t.route; })[0][1]) + '</ul><span>' + t.why + '</span></div><div class="field"><button class="btn" data-a="trnext" id="tr-next">Ticket tiếp theo →</button></div>';
    }
    return h + '</div>';
  }
  function bizAdd(start, mins) {
    var d = new Date(start), S = 8 * 60, E = 17 * 60;
    function norm() {
      for (var g = 0; g < 14; g++) {
        var w = d.getDay(), m = d.getHours() * 60 + d.getMinutes();
        if (w === 0 || w === 6 || m >= E) { d.setDate(d.getDate() + 1); d.setHours(8, 0, 0, 0); }
        else if (m < S) { d.setHours(8, 0, 0, 0); } else return;
      }
    }
    norm();
    while (mins > 0) {
      var cur = d.getHours() * 60 + d.getMinutes(), room = E - cur;
      if (mins <= room) { d.setMinutes(d.getMinutes() + mins); return d; }
      mins -= room; d.setDate(d.getDate() + 1); d.setHours(8, 0, 0, 0); norm();
    }
    return d;
  }
  var DOW = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  function fmtD(d) { return DOW[d.getDay()] + ' ' + ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + ' lúc ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  function isoLocal(d) { var p = function (n) { return ('0' + n).slice(-2); }; return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + 'T' + p(d.getHours()) + ':' + p(d.getMinutes()); }
  function slaOut() {
    var s = SLA_T[SLA.p], st = new Date(SLA.when || Date.now()); if (isNaN(st)) st = new Date();
    var add = function (m) { m += SLA.pause; return SLA.mode === 'biz' ? bizAdd(st, m) : new Date(st.getTime() + m * 60000); };
    return '<div class="result"><div><b>Hạn phản hồi đầu tiên (' + s.resp + ' phút' + (SLA.mode === 'biz' ? ' làm việc' : '') + ')</b><span>' + fmtD(add(s.resp)) + '</span></div><div><b>Hạn khắc phục (' + (s.res >= 60 ? (s.res / 60) + ' giờ' : s.res + ' phút') + (SLA.mode === 'biz' ? ' làm việc' : '') + ')</b><span>' + fmtD(add(s.res)) + '</span></div></div>';
  }
  function trMatrix() {
    if (!SLA.when) SLA.when = isoLocal(new Date());
    var M = [['Cao', 'P1', 'P2', 'P3'], ['Trung bình', 'P2', 'P3', 'P4'], ['Thấp', 'P3', 'P4', 'P4']];
    var h = '<div class="panel"><h3>Ma trận ưu tiên = Impact × Urgency</h3><div class="tbl"><table class="matrix"><thead><tr><th>Impact ↓ · Urgency →</th><th>Cao (không làm việc được / hạn chót)</th><th>Trung bình</th><th>Thấp (không gấp)</th></tr></thead><tbody>' + M.map(function (r) { return '<tr><th>' + r[0] + '</th>' + r.slice(1).map(function (c) { return '<td class="mx p' + c.charAt(1) + '">' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div><p class="hint"><b>Impact</b> = bao nhiêu người/dịch vụ bị ảnh hưởng (cả công ty > một phòng > một người). <b>Urgency</b> = cần xử lý gấp đến mức nào (hạn chót, không có cách làm tạm). Người dùng VIP hoặc rủi ro bảo mật thường được nâng ưu tiên.</p></div>';
    h += '<div class="panel"><h3>Bảng SLA mẫu (tham khảo)</h3><div class="tbl"><table><thead><tr><th>Ưu tiên</th><th>Ví dụ</th><th>Phản hồi</th><th>Khắc phục</th><th>Khung giờ</th></tr></thead><tbody>' + [1, 2, 3, 4].map(function (p) { var s = SLA_T[p]; return '<tr><td><b>' + s.name + '</b></td><td>' + s.ex + '</td><td>' + s.resp + ' phút</td><td>' + (s.res >= 1440 ? (s.res / 480) + ' ngày làm việc' : s.res >= 60 ? s.res / 60 + ' giờ' : s.res + ' phút') + '</td><td>' + (s.cal ? '24×7' : 'Giờ làm việc') + '</td></tr>'; }).join('') + '</tbody></table></div><p class="hint">Con số chỉ minh hoạ — mỗi công ty/hợp đồng có SLA riêng. Giờ làm việc ở đây: T2–T6, 08:00–17:00.</p></div>';
    h += '<div class="panel"><h3>Tính hạn SLA</h3><div class="field"><select class="in" id="sla-p">' + [1, 2, 3, 4].map(function (p) { return '<option value="' + p + '"' + (p === SLA.p ? ' selected' : '') + '>' + SLA_T[p].name + '</option>'; }).join('') + '</select><input class="in" id="sla-t" type="datetime-local" value="' + SLA.when + '" aria-label="Thời điểm tạo ticket"><select class="in" id="sla-m"><option value="biz"' + (SLA.mode === 'biz' ? ' selected' : '') + '>Giờ làm việc (T2–T6, 8–17h)</option><option value="cal"' + (SLA.mode === 'cal' ? ' selected' : '') + '>24×7</option></select><label class="lbl" style="margin:0">Thời gian chờ user (phút)</label><input class="in" id="sla-z" type="number" min="0" value="' + SLA.pause + '" style="width:90px"></div><div id="sla-out">' + slaOut() + '</div><p class="hint">“Thời gian chờ user” (trạng thái Pending) thường được tạm dừng đồng hồ SLA — cộng vào hạn. Ví dụ ticket P2 tạo lúc 16:30 thứ Sáu, tính theo giờ làm việc, hạn khắc phục rơi vào thứ Hai.</p></div>';
    return h;
  }
  function trRender() { document.getElementById('tr-body').innerHTML = T.seg([['practice', '🎯 Luyện phân loại'], ['matrix', '📊 Ma trận & SLA']], TR.tab, 'trtab') + (TR.tab === 'practice' ? trPractice() : trMatrix()); }
  T.reg({
    id: 'triage', group: 'proc', icon: '🎫', short: 'Phân loại ticket', title: 'Phân loại ticket & tính SLA', lv: 2, min: '8–10′', days: [1],
    desc: '21 ticket thật: chọn <b>loại</b> (Incident/Request/Problem/Change), <b>mức ưu tiên</b> (Impact × Urgency) và <b>chuyển cho ai</b>. Có ma trận ưu tiên và máy tính hạn SLA theo giờ làm việc.',
    progress: function () { return [Object.keys(trDone()).length, D.tickets.length]; },
    mount: function (root) { root.innerHTML = '<div id="tr-body"></div>'; trNew(); trRender(); },
    ev: function (t, e) {
      if (t === 'change' && /^sla-/.test(e.target.id)) {
        var v = e.target.value, id = e.target.id;
        if (id === 'sla-p') SLA.p = +v; else if (id === 'sla-t') SLA.when = v; else if (id === 'sla-m') SLA.mode = v; else SLA.pause = Math.max(0, +v || 0);
        document.getElementById('sla-out').innerHTML = slaOut(); return;
      }
      var b = e.target.closest('[data-a]'); if (t !== 'click' || !b || b.disabled) return;
      var a = b.dataset.a, tk = D.tickets[TR.order[TR.i % TR.order.length]];
      if (a === 'trtab') { TR.tab = b.dataset.v; trRender(); }
      else if (a === 'trmx') { TR.tab = 'matrix'; trRender(); }
      else if (a === 'tr') { TR.a[b.dataset.k] = b.dataset.v; trRender(); }
      else if (a === 'trskip' || a === 'trnext') { TR.i++; TR.a = {}; TR.res = null; trRender(); }
      else if (a === 'trgrade') {
        var r = { t: TR.a.type === tk.type, p: +TR.a.pri === tk.pri, r: TR.a.route === tk.route }; r.score = (r.t ? 1 : 0) + (r.p ? 1 : 0) + (r.r ? 1 : 0);
        TR.res = r; TR.pts += r.score; TR.n++;
        if (r.score === 3) { trDone()[TR.order[TR.i % TR.order.length]] = 1; T.save(); }
        APP.markActive(); trRender(); var nx = document.getElementById('tr-next'); if (nx) nx.focus();
      }
    }
  });

  /* ================= Giao tiếp với user ================= */
  var CM = { order: null, i: 0, opts: null, picked: -1, pts: 0, n: 0 };
  function cmDone() { var d = T.stat('comm'); return d.best || (d.best = {}); }
  function cmNew() { if (!CM.order || CM.i >= CM.order.length) { CM.order = idxs(D.comm.length); CM.i = 0; } CM.picked = -1; CM.opts = T.shuffle(D.comm[CM.order[CM.i]].opts); }
  function cmHtml() {
    var q = D.comm[CM.order[CM.i]], L = ['A', 'B', 'C'];
    var h = '<div class="pq-meta"><span>Tình huống ' + (CM.i + 1) + '/' + D.comm.length + '</span><span>Điểm: <b>' + CM.pts + '/' + (CM.n * 2) + '</b></span><span>Chọn tốt nhất: <b>' + Object.keys(cmDone()).length + '/' + D.comm.length + '</b></span></div>';
    h += '<div class="panel"><div class="pill">' + (q.kind === 'note' ? '📝 Viết ghi chú ticket' : '💬 Cách trả lời user') + '</div><div class="pq-text">' + q.sit + '</div><div class="replies">';
    CM.opts.forEach(function (o, i) {
      var done = CM.picked >= 0, cls = done ? (o.s === 2 ? 'best' : o.s === 1 ? 'ok' : 'bad') : '';
      h += '<button class="reply ' + cls + (CM.picked === i ? ' sel' : '') + '" data-a="cmpick" data-i="' + i + '"' + (done ? ' disabled' : '') + '><span class="rl">' + L[i] + '</span><span>' + esc(o.t) + (done ? '<em class="rwhy">' + ['❌ Nên tránh', '⚠ Chấp nhận được', '✅ Tốt nhất'][o.s] + ' — ' + o.w + '</em>' : '') + '</span></button>';
    });
    h += '</div>' + (CM.picked >= 0 ? '<div class="field"><button class="btn" data-a="cmnext" id="cm-next">Tình huống tiếp theo →</button></div>' : '<p class="hint">Chọn cách bạn sẽ làm trong thực tế — không có câu trả lời “an toàn” nào ngoài việc cân nhắc người dùng, quy trình và bảo mật.</p>') + '</div>';
    return h;
  }
  function cmRender() { document.getElementById('cm-body').innerHTML = cmHtml(); }
  T.reg({
    id: 'comm', group: 'proc', icon: '💬', short: 'Giao tiếp user', title: 'Giao tiếp với người dùng & viết ghi chú', lv: 1, min: '5–8′', days: [1],
    desc: '12 tình huống giao tiếp: user bực bội, sếp đòi mật khẩu, giải thích thuật ngữ, thông báo chờ linh kiện, đóng ticket, viết ghi chú/leo thang… So sánh ba cách trả lời và hiểu <b>vì sao</b> cách nào tốt hơn.',
    progress: function () { return [Object.keys(cmDone()).length, D.comm.length]; },
    mount: function (root) { root.innerHTML = '<div id="cm-body"></div>'; CM.order = null; cmNew(); cmRender(); },
    ev: function (t, e) {
      var b = e.target.closest('[data-a]'); if (t !== 'click' || !b || b.disabled) return;
      if (b.dataset.a === 'cmpick') {
        var o = CM.opts[+b.dataset.i]; CM.picked = +b.dataset.i; CM.pts += o.s; CM.n++;
        if (o.s === 2) { cmDone()[CM.order[CM.i]] = 1; T.save(); }
        APP.markActive(); cmRender(); var nx = document.getElementById('cm-next'); if (nx) nx.focus();
      } else if (b.dataset.a === 'cmnext') { CM.i++; cmNew(); cmRender(); }
    }
  });

  /* ================= Nhận diện phishing ================= */
  var FLAGS = [['sender', 'Người gửi / tên miền đáng ngờ hoặc giả mạo'], ['link', 'Liên kết dẫn tới địa chỉ không khớp'], ['urgency', 'Tạo áp lực, doạ hậu quả, thời hạn gấp'], ['creds', 'Đòi mật khẩu / thông tin đăng nhập'], ['attach', 'Tệp đính kèm nguy hiểm'], ['generic', 'Chào chung chung, không cá nhân hoá'], ['money', 'Yêu cầu tiền / thẻ quà tặng / thanh toán']];
  var PH = { order: null, i: 0, verdict: null, flags: {}, res: null, showAddr: false, link: null, pts: 0, n: 0 };
  function phDone() { var d = T.stat('phish'); return d.ok || (d.ok = {}); }
  function phNew() { if (!PH.order || PH.i >= PH.order.length) { PH.order = idxs(D.phish.length); PH.i = 0; } PH.verdict = null; PH.flags = {}; PH.res = null; PH.showAddr = false; PH.link = null; }
  function phHtml() {
    var m = D.phish[PH.order[PH.i]], body = m.body.replace('{L0}', m.links[0] ? '<a href="#" class="mlink" data-a="phlink" data-i="0">' + esc(m.links[0].t) + '</a>' : '');
    var h = '<div class="pq-meta"><span>Email ' + (PH.i + 1) + '/' + D.phish.length + '</span><span>Điểm: <b>' + PH.pts + '/' + (PH.n * 100) + '</b></span><span>Nhận diện đúng: <b>' + Object.keys(phDone()).length + '/' + D.phish.length + '</b></span></div>';
    h += '<div class="mail"><div class="mail-h"><div class="mail-subj">' + esc(m.subj) + '</div><div class="mail-from"><span class="av">' + esc(m.name.charAt(0)) + '</span><div><button class="linkbtn" data-a="phaddr" title="Bấm để xem địa chỉ email thật"><b>' + esc(m.name) + '</b></button>' + (PH.showAddr ? ' <code>&lt;' + esc(m.addr) + '&gt;</code>' : ' <small class="hint">(bấm tên để xem địa chỉ)</small>') + '<div class="hint">Đến: bạn@corp.example</div></div></div></div><div class="mail-b">' + body + (m.att ? '<div class="att">📎 <b>' + esc(m.att) + '</b></div>' : '') + '</div><div class="mail-status" id="mail-status">' + (PH.link != null ? '🔗 Địa chỉ thật của liên kết: <code>' + esc(m.links[PH.link].h) + '</code>' : '<span class="hint">Mẹo: bấm vào liên kết để xem địa chỉ thật (không truy cập). Như khi rê chuột lên link.</span>') + '</div></div>';
    h += '<div class="panel">';
    if (!PH.res) {
      h += '<h3>1. Bạn kết luận thế nào?</h3><div class="field"><button class="btn bad-b ' + (PH.verdict === 'phish' ? 'sel' : '') + '" data-a="phv" data-v="phish">🚩 Lừa đảo (phishing)</button><button class="btn ok-b ' + (PH.verdict === 'safe' ? 'sel' : '') + '" data-a="phv" data-v="safe">✅ An toàn</button></div><h3>2. Dấu hiệu bạn nhận thấy (chọn nhiều)</h3><div class="flaglist">' + FLAGS.map(function (f) { return '<label class="chk"><input type="checkbox" data-a="phf" data-v="' + f[0] + '"' + (PH.flags[f[0]] ? ' checked' : '') + '> ' + f[1] + '</label>'; }).join('') + '</div><div class="field"><button class="btn" data-a="phgrade"' + (PH.verdict ? '' : ' disabled') + '>Chấm điểm</button><button class="markbtn" data-a="phnext">Bỏ qua</button></div>';
    } else {
      var r = PH.res;
      h += '<div class="verdict ' + (r.vok ? 'ok' : 'bad') + '">' + (r.vok ? '✅ Kết luận đúng: ' : '❌ Kết luận chưa đúng. Đây là email ') + (m.phish ? '<b>LỪA ĐẢO</b>' : '<b>AN TOÀN</b>') + ' · ' + r.score + '/100 điểm<span>' + m.why + '</span></div>';
      h += '<h4>Dấu hiệu thực tế của email này</h4><ul class="reqs">' + (m.flags.length ? FLAGS.filter(function (f) { return m.flags.indexOf(f[0]) >= 0; }).map(function (f) { return '<li class="' + (PH.flags[f[0]] ? 'y' : 'n') + '">' + (PH.flags[f[0]] ? '✔ Bạn đã thấy: ' : '✘ Bạn bỏ sót: ') + f[1] + '</li>'; }).join('') : '<li class="y">Không có dấu hiệu đáng ngờ (email hợp lệ)</li>') + FLAGS.filter(function (f) { return PH.flags[f[0]] && m.flags.indexOf(f[0]) < 0; }).map(function (f) { return '<li class="n">✘ Bạn chọn nhầm: ' + f[1] + '</li>'; }).join('') + '</ul><div class="field"><button class="btn" data-a="phnext" id="ph-next">Email tiếp theo →</button></div>';
    }
    return h + '</div>';
  }
  function phRender() { document.getElementById('ph-body').innerHTML = phHtml(); }
  T.reg({
    id: 'phish', group: 'sec', icon: '🎣', short: 'Email lừa đảo', title: 'Nhận diện email lừa đảo (phishing)', lv: 2, min: '6–8′', days: [5],
    desc: '10 email như hộp thư thật: 7 lừa đảo (giả Microsoft, CEO fraud, hoá đơn .pdf.exe, gift card…) và 3 hợp lệ. Xem địa chỉ người gửi, địa chỉ thật của link, chọn dấu hiệu và nhận giải thích chi tiết.',
    progress: function () { return [Object.keys(phDone()).length, D.phish.length]; },
    mount: function (root) { root.innerHTML = '<div id="ph-body"></div>'; PH.order = null; phNew(); phRender(); },
    ev: function (t, e) {
      var b = e.target.closest('[data-a]'); if (!b) return;
      var a = b.dataset.a;
      if (t === 'click' && a === 'phlink') { e.preventDefault(); PH.link = +b.dataset.i; phRender(); return; }
      if (t === 'change' && a === 'phf') { PH.flags[b.dataset.v] = b.checked; return; }
      if (t !== 'click' || b.disabled) return;
      if (a === 'phaddr') { PH.showAddr = !PH.showAddr; phRender(); }
      else if (a === 'phv') { PH.verdict = b.dataset.v; phRender(); }
      else if (a === 'phnext') { PH.i++; phNew(); phRender(); }
      else if (a === 'phgrade') {
        var m = D.phish[PH.order[PH.i]], vok = (PH.verdict === 'phish') === m.phish, sel = Object.keys(PH.flags).filter(function (k) { return PH.flags[k]; });
        var hit = sel.filter(function (k) { return m.flags.indexOf(k) >= 0; }).length, union = m.flags.length + sel.length - hit;
        var fs = union ? hit / union : 1, score = Math.round((vok ? 60 : 0) + fs * 40);
        PH.res = { vok: vok, score: score }; PH.pts += score; PH.n++;
        if (vok) { phDone()[PH.order[PH.i]] = 1; T.save(); }
        APP.markActive(); phRender(); var nx = document.getElementById('ph-next'); if (nx) nx.focus();
      }
    }
  });

  /* ================= Thẻ ghi nhớ ================= */
  function allDecks() {
    var ports = (window.COURSE && COURSE.ports || []).map(function (p) { return ['Cổng ' + p[0] + ' (' + p[1] + ')', p[2] + ' — ' + p[3]]; });
    ports = ports.concat([['Cổng 161 (UDP)', 'SNMP — giám sát thiết bị mạng'], ['Cổng 514 (UDP)', 'Syslog — gửi log về server'], ['Cổng 636 (TCP)', 'LDAPS — LDAP mã hoá'], ['Cổng 8080 (TCP)', 'HTTP thay thế / proxy']]);
    return [{ id: 'ports', icon: '🔌', title: 'Cổng & giao thức', cards: ports }].concat(D.decks);
  }
  var FC = { deck: null, rev: false, mode: 'flip', queue: [], pos: 0, flipped: false, q: null, qpicked: -1, onlyNew: true, qok: 0, qn: 0 };
  function fcKnown(id) { var d = T.stat('cards'); return d[id] || (d[id] = {}); }
  function fcDeck() { return allDecks().filter(function (d) { return d.id === FC.deck; })[0]; }
  function fcBuild() {
    var d = fcDeck(), k = fcKnown(d.id), all = d.cards.map(function (c, i) { return i; });
    var pool = FC.onlyNew ? all.filter(function (i) { return !k[i]; }) : all;
    FC.queue = T.shuffle(pool); FC.pos = 0; FC.flipped = false; FC.q = null; FC.qpicked = -1;
  }
  function fcFront(c) { return FC.rev ? c[1] : c[0]; }
  function fcBack(c) { return FC.rev ? c[0] : c[1]; }
  function fcQuiz() {
    var d = fcDeck(), idx = FC.queue[FC.pos], c = d.cards[idx], wrong = T.shuffle(d.cards.filter(function (x, i) { return i !== idx && fcBack(x) !== fcBack(c); })).slice(0, 3).map(fcBack);
    FC.q = { idx: idx, opts: T.shuffle(wrong.concat([fcBack(c)])), ans: fcBack(c) }; FC.qpicked = -1;
  }
  function fcHtml() {
    var decks = allDecks();
    if (!FC.deck) {
      return '<p class="hint">Chọn một bộ thẻ. Thẻ bạn đánh dấu “Nhớ rồi” sẽ không xuất hiện lại trong chế độ “chỉ thẻ chưa thuộc”. Ôn lại vài lần mỗi ngày hiệu quả hơn học một lần dài.</p><div class="tgrid">' + decks.map(function (d) { var k = Object.keys(fcKnown(d.id)).length; return '<button class="tcard g-mem flbtn" data-a="fcdeck" data-v="' + d.id + '"><span class="ticon">' + d.icon + '</span><div class="tbody"><h3>' + esc(d.title) + '</h3><p>' + d.cards.length + ' thẻ</p><div class="tmeta"><span class="tprog">' + T.bar(k, d.cards.length) + k + '/' + d.cards.length + ' đã thuộc</span></div></div></button>'; }).join('') + '</div>';
    }
    var d = fcDeck(), k = fcKnown(d.id), known = Object.keys(k).length;
    var h = '<div class="fl-top"><button class="markbtn" data-a="fchome">← Bộ thẻ khác</button><b>' + d.icon + ' ' + esc(d.title) + '</b><span class="hint">' + known + '/' + d.cards.length + ' đã thuộc</span></div>' +
      T.seg([['flip', '🃏 Lật thẻ'], ['quiz', '❓ Trắc nghiệm']], FC.mode, 'fcmode') +
      '<div class="field"><label class="chk"><input type="checkbox" data-a="fcrev"' + (FC.rev ? ' checked' : '') + '> Đảo chiều (hỏi đáp án → nhớ thuật ngữ)</label><label class="chk"><input type="checkbox" data-a="fconly"' + (FC.onlyNew ? ' checked' : '') + '> Chỉ thẻ chưa thuộc</label><button class="markbtn" data-a="fcreset">Xoá tiến độ bộ này</button></div>';
    if (FC.pos >= FC.queue.length) return h + '<div class="panel center"><h3>' + (FC.queue.length ? '🎉 Hết lượt!' : '🎉 Bạn đã thuộc cả bộ này!') + '</h3><p>Còn ' + (d.cards.length - known) + ' thẻ chưa thuộc.</p><div class="field" style="justify-content:center"><button class="btn" data-a="fcagain">Học lại</button></div></div>';
    var c = d.cards[FC.queue[FC.pos]], prog = '<div class="pq-meta"><span>Thẻ ' + (FC.pos + 1) + '/' + FC.queue.length + '</span>' + (FC.mode === 'quiz' ? '<span>Đúng: <b>' + FC.qok + '/' + FC.qn + '</b></span>' : '') + '</div>';
    if (FC.mode === 'flip') {
      return h + prog + '<button class="fcard ' + (FC.flipped ? 'back' : '') + '" data-a="fcflip" id="fcard" aria-label="Lật thẻ"><small>' + (FC.flipped ? 'ĐÁP ÁN' : 'CÂU HỎI — bấm hoặc nhấn Space để lật') + '</small><span>' + esc(FC.flipped ? fcBack(c) : fcFront(c)) + '</span></button>' +
        '<div class="field fc-act"><button class="markbtn" data-a="fcno"' + (FC.flipped ? '' : ' disabled') + '>✘ Chưa nhớ (1)</button><button class="btn" data-a="fcyes"' + (FC.flipped ? '' : ' disabled') + '>✔ Nhớ rồi (2)</button></div>';
    }
    if (!FC.q) fcQuiz();
    return h + prog + '<div class="fcard static"><small>CÂU HỎI</small><span>' + esc(fcFront(c)) + '</span></div><div class="replies">' + FC.q.opts.map(function (o, i) { var done = FC.qpicked >= 0, right = o === FC.q.ans; return '<button class="reply ' + (done ? (right ? 'best' : (FC.qpicked === i ? 'bad' : '')) : '') + '" data-a="fcpick" data-i="' + i + '"' + (done ? ' disabled' : '') + '><span class="rl">' + 'ABCD'.charAt(i) + '</span><span>' + esc(o) + '</span></button>'; }).join('') + '</div>' + (FC.qpicked >= 0 ? '<div class="field"><button class="btn" data-a="fcnext" id="fc-next">Thẻ tiếp theo →</button></div>' : '');
  }
  function fcRender() { document.getElementById('fc-body').innerHTML = fcHtml(); var f = document.getElementById('fcard') || document.getElementById('fc-next'); if (f) f.focus({ preventScroll: true }); }
  function fcAdvance() { FC.pos++; FC.flipped = false; FC.q = null; FC.qpicked = -1; fcRender(); }
  T.reg({
    id: 'cards', group: 'mem', icon: '🃏', short: 'Thẻ ghi nhớ', title: 'Thẻ ghi nhớ (flashcards)', lv: 1, min: '5–10′ / lượt', days: [2, 3, 4, 5],
    desc: '7 bộ thẻ: cổng & giao thức, lệnh Win+R, phím tắt, thuật ngữ mạng, AD & M365, ITIL, bảo mật, lệnh Linux. Lật thẻ hoặc làm trắc nghiệm; tiến độ được lưu để ôn đúng chỗ còn yếu.',
    progress: function () { var t = 0, k = 0; allDecks().forEach(function (d) { t += d.cards.length; k += Object.keys(fcKnown(d.id)).length; }); return [k, t]; },
    mount: function (root) { root.innerHTML = '<div id="fc-body"></div>'; FC.deck = null; fcRender(); },
    ev: function (t, e) {
      if (t === 'keydown' && FC.deck && FC.mode === 'flip' && FC.pos < FC.queue.length) {
        if (FC.flipped && (e.key === '1' || e.key === '2')) { var d = fcDeck(), i = FC.queue[FC.pos]; if (e.key === '2') { fcKnown(d.id)[i] = 1; T.save(); APP.markActive(); } fcAdvance(); }
        return;
      }
      var b = e.target.closest('[data-a]'); if (!b) return;
      var a = b.dataset.a;
      if (t === 'change') {
        if (a === 'fcrev') { FC.rev = b.checked; fcBuild(); fcRender(); } else if (a === 'fconly') { FC.onlyNew = b.checked; fcBuild(); fcRender(); }
        return;
      }
      if (t !== 'click' || b.disabled) return;
      if (a === 'fcdeck') { FC.deck = b.dataset.v; FC.qok = FC.qn = 0; fcBuild(); fcRender(); }
      else if (a === 'fchome') { FC.deck = null; fcRender(); }
      else if (a === 'fcmode') { FC.mode = b.dataset.v; FC.qok = FC.qn = 0; fcBuild(); fcRender(); }
      else if (a === 'fcagain') { fcBuild(); fcRender(); }
      else if (a === 'fcreset') { if (confirm('Xoá tiến độ của bộ thẻ này?')) { T.stat('cards')[FC.deck] = {}; T.save(); fcBuild(); fcRender(); } }
      else if (a === 'fcflip') { FC.flipped = !FC.flipped; fcRender(); }
      else if (a === 'fcyes' || a === 'fcno') { if (a === 'fcyes') { fcKnown(FC.deck)[FC.queue[FC.pos]] = 1; T.save(); APP.markActive(); } fcAdvance(); }
      else if (a === 'fcpick') {
        FC.qpicked = +b.dataset.i; var ok = FC.q.opts[FC.qpicked] === FC.q.ans; FC.qn++;
        if (ok) { FC.qok++; fcKnown(FC.deck)[FC.q.idx] = 1; T.save(); APP.markActive(); } fcRender();
      }
      else if (a === 'fcnext') fcAdvance();
    }
  });

  /* ================= Thử thách gõ lệnh ================= */
  var CQ = { cat: 'Tất cả', order: null, i: 0, res: null, ok: 0, n: 0, streak: 0, hint: false };
  function cqDone() { var d = T.stat('cmdquiz'); return d.ok || (d.ok = {}); }
  function cqNorm(s) { return String(s).toLowerCase().replace(/["']/g, '').replace(/\s+/g, ' ').trim(); }
  function cqPool() { var a = []; D.cmds.forEach(function (c, i) { if (CQ.cat === 'Tất cả' || c.cat === CQ.cat) a.push(i); }); return a; }
  function cqNew() { CQ.order = T.shuffle(cqPool()); CQ.i = 0; CQ.res = null; CQ.hint = false; }
  function cqHtml() {
    var cats = ['Tất cả']; D.cmds.forEach(function (c) { if (cats.indexOf(c.cat) < 0) cats.push(c.cat); });
    var h = '<div class="chips">' + cats.map(function (c) { return '<button class="chip ' + (c === CQ.cat ? 'on' : '') + '" data-a="cqcat" data-v="' + esc(c) + '">' + esc(c) + '</button>'; }).join('') + '</div>';
    if (!CQ.order.length) return h + '<p class="hint">Không có câu hỏi.</p>';
    var q = D.cmds[CQ.order[CQ.i % CQ.order.length]];
    h += '<div class="panel practice"><div class="pq-meta"><span>Câu ' + (CQ.i + 1) + '</span><span>🔥 chuỗi: <b>' + CQ.streak + '</b></span><span>✔ ' + CQ.ok + '/' + CQ.n + '</span><span>Đã thuộc: <b>' + Object.keys(cqDone()).length + '/' + D.cmds.length + '</b></span></div><div class="pill">' + esc(q.cat) + '</div><div class="pq-text">' + q.q + '</div>';
    if (!CQ.res) {
      h += '<div class="field"><div class="cq-in"><span class="prompt">&gt;</span><input class="in grow mono" id="cq-in" autocomplete="off" spellcheck="false" autocapitalize="off" placeholder="Gõ lệnh rồi nhấn Enter"></div><button class="btn" data-a="cqcheck">Kiểm tra</button></div><div class="field"><button class="markbtn" data-a="cqhint">💡 Gợi ý</button><button class="markbtn" data-a="cqshow">Xem đáp án</button></div>' + (CQ.hint ? '<p class="hint">Gợi ý: lệnh bắt đầu bằng <code>' + esc(q.ex.split(' ')[0]) + '</code> và có ' + q.ex.split(' ').length + ' phần.</p>' : '');
    } else {
      h += '<div class="verdict ' + (CQ.res.ok ? 'ok' : 'bad') + '">' + (CQ.res.ok ? '✅ Chính xác!' : CQ.res.shown ? 'Đáp án:' : '❌ Chưa đúng. Bạn gõ: <code>' + esc(CQ.res.typed) + '</code>') + '<span>Lệnh chuẩn: <code class="mono">' + esc(q.ex) + '</code>' + (q.alt.length ? ' · cũng chấp nhận: ' + q.alt.map(function (x) { return '<code>' + esc(x) + '</code>'; }).join(', ') : '') + '</span></div><div class="field"><button class="markbtn" data-a="cqcopy">Chép lệnh</button><button class="btn" data-a="cqnext" id="cq-next">Câu tiếp theo →</button></div>';
    }
    return h + '</div>';
  }
  function cqRender() { document.getElementById('cq-body').innerHTML = cqHtml(); var i = document.getElementById('cq-in') || document.getElementById('cq-next'); if (i) i.focus(); }
  function cqCheck(typed, shown) {
    var q = D.cmds[CQ.order[CQ.i % CQ.order.length]], ok = !shown && [q.ex].concat(q.alt).some(function (x) { return cqNorm(x) === cqNorm(typed); });
    if (!shown && !typed.trim()) return;
    CQ.n++; if (ok) { CQ.ok++; CQ.streak++; cqDone()[CQ.order[CQ.i % CQ.order.length]] = 1; T.save(); APP.markActive(); } else CQ.streak = 0;
    CQ.res = { ok: ok, typed: typed, shown: shown }; cqRender();
  }
  T.reg({
    id: 'cmdquiz', group: 'mem', icon: '⌨️', short: 'Gõ lệnh', title: 'Thử thách gõ lệnh', lv: 2, min: '5–10′', days: [2, 3, 4, 6],
    desc: '50+ nhiệm vụ “gõ đúng lệnh”: mạng, Windows, hộp Run, PowerShell/AD, Linux. Không chọn đáp án — bạn phải <b>tự gõ</b> như khi đi làm. Có gợi ý và đáp án kèm biến thể chấp nhận được.',
    progress: function () { return [Object.keys(cqDone()).length, D.cmds.length]; },
    mount: function (root) { root.innerHTML = '<div id="cq-body"></div>'; CQ.cat = 'Tất cả'; cqNew(); cqRender(); },
    ev: function (t, e) {
      if (t === 'keydown' && e.key === 'Enter' && e.target.id === 'cq-in') return cqCheck(e.target.value, false);
      var b = e.target.closest('[data-a]'); if (t !== 'click' || !b) return;
      var a = b.dataset.a;
      if (a === 'cqcat') { CQ.cat = b.dataset.v; cqNew(); cqRender(); }
      else if (a === 'cqcheck') cqCheck(document.getElementById('cq-in').value, false);
      else if (a === 'cqshow') cqCheck('', true);
      else if (a === 'cqhint') { CQ.hint = true; var v = (document.getElementById('cq-in') || {}).value; cqRender(); if (v) document.getElementById('cq-in').value = v; }
      else if (a === 'cqnext') { CQ.i++; CQ.res = null; CQ.hint = false; cqRender(); }
      else if (a === 'cqcopy') T.copy(D.cmds[CQ.order[CQ.i % CQ.order.length]].ex, b);
    }
  });
})();
