/* Khung chung cho trang "Công cụ luyện tập": đăng ký công cụ, trang hub, tiện ích dùng lại. */
window.TOOLS = (function () {
  'use strict';
  var list = [], byId = {}, cur = null;
  var GROUPS = [
    ['net', '🌐', 'Mạng', 'Tính subnet, đọc nhị phân, chẩn đoán “mất mạng” bằng lệnh thật'],
    ['sys', '🖥️', 'Hệ thống & tài khoản', 'Việc hằng ngày trên AD, tra mã lỗi, cây chẩn đoán, tính nhanh'],
    ['proc', '🎫', 'Quy trình & giao tiếp', 'Phân loại ticket, SLA, cách trả lời user'],
    ['sec', '🛡️', 'Bảo mật', 'Nhận diện email lừa đảo như đi làm thật'],
    ['mem', '🧠', 'Ghi nhớ', 'Thẻ ghi nhớ và gõ lệnh để nhớ lâu']
  ];
  var A = function () { return window.APP; };
  var esc = function (s) { return A().esc(s); };

  function reg(def) { list.push(def); byId[def.id] = def; }
  function stat(id) { var m = A().mem; if (!m.tools) m.tools = {}; return m.tools[id] || (m.tools[id] = {}); }
  function save() { A().save(); }
  function rnd(n) { return Math.floor(Math.random() * n); }
  function pick(a) { return a[rnd(a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = rnd(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function bar(done, total) { return '<span class="mini"><i style="width:' + (total ? Math.round(done / total * 100) : 0) + '%"></i></span>'; }
  // Thanh tab: items = [[giá trị, nhãn], ...]
  function seg(items, active, act) {
    return '<div class="seg" role="tablist">' + items.map(function (x) {
      return '<button role="tab" aria-selected="' + (x[0] === active) + '" class="' + (x[0] === active ? 'on' : '') + '" data-a="' + act + '" data-v="' + esc(x[0]) + '">' + x[1] + '</button>';
    }).join('') + '</div>';
  }
  var toastTimer;
  function toast(msg) {
    var t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('show'); }, 1800);
  }
  function copy(text, btn) { A().copy(text, btn); if (!btn) toast('Đã chép ✓'); }
  function prog(d) { try { return d.progress ? d.progress() : null; } catch (e) { return null; } }

  function hub() {
    var done = 0, total = 0;
    list.forEach(function (d) { var p = prog(d); if (p) { done += p[0]; total += p[1]; } });
    var h = '<div class="tools-hero"><div><h1>🛠️ Công cụ luyện tập</h1><p>' + list.length + ' công cụ mô phỏng công việc helpdesk thật: gõ lệnh trên máy “hỏng”, xử lý tài khoản trong AD, phân loại ticket, nhận diện email lừa đảo… Mỗi công cụ có tình huống cụ thể, chấm điểm và giải thích vì sao.</p></div>' +
      '<div class="tools-total"><b>' + done + '<small>/' + total + '</small></b><span>bài luyện đã hoàn thành</span>' + bar(done, total) + '</div></div>';
    h += '<div class="tool-path"><b>Lộ trình luyện 30 phút gợi ý:</b> <a href="#/tools/terminal">Terminal</a> (10′) → <a href="#/tools/aduc">AD Users</a> (7′) → <a href="#/tools/triage">Phân loại ticket</a> (7′) → <a href="#/tools/phish">Email lừa đảo</a> (6′)</div>';
    GROUPS.forEach(function (g) {
      var items = list.filter(function (d) { return d.group === g[0]; });
      if (!items.length) return;
      h += '<section class="tgroup"><div class="tgroup-h"><span>' + g[1] + '</span><div><h2>' + g[2] + '</h2><p>' + g[3] + '</p></div></div><div class="tgrid">';
      items.forEach(function (d) {
        var p = prog(d);
        h += '<a class="tcard g-' + d.group + '" href="#/tools/' + d.id + '"><span class="ticon">' + d.icon + '</span><div class="tbody"><h3>' + esc(d.title) + '</h3><p>' + d.desc + '</p>' +
          '<div class="tmeta"><span class="lv lv-' + d.lv + '">' + ['', 'Cơ bản', 'Trung bình', 'Nâng cao'][d.lv] + '</span><span>⏱ ' + d.min + '</span>' + (d.days ? '<span>Ngày ' + d.days.join(', ') + '</span>' : '') + (p ? '<span class="tprog">' + bar(p[0], p[1]) + p[0] + '/' + p[1] + '</span>' : '') + '</div></div></a>';
      });
      h += '</div></section>';
    });
    return h;
  }

  function shell(d) {
    var i = list.indexOf(d), prev = list[i - 1], next = list[i + 1];
    var h = '<div class="crumbs"><a href="#/tools">Công cụ</a> › ' + esc(d.title) + '</div>' +
      '<header class="tool-head g-' + d.group + '"><span class="ticon">' + d.icon + '</span><div><h1>' + esc(d.title) + '</h1><p>' + d.desc + '</p></div></header>' +
      '<nav class="tool-switch" aria-label="Chuyển công cụ">' + list.map(function (x) {
        return '<a href="#/tools/' + x.id + '" class="' + (x === d ? 'on' : '') + '" title="' + esc(x.title) + '"><span>' + x.icon + '</span>' + esc(x.short || x.title) + '</a>';
      }).join('') + '</nav>' +
      '<div id="tool-body" class="tool-body"></div>' +
      '<div class="footer-nav">' + (prev ? '<a class="btn ghost" href="#/tools/' + prev.id + '">← ' + esc(prev.short || prev.title) + '</a>' : '<a class="btn ghost" href="#/tools">← Tất cả công cụ</a>') +
      (next ? '<a class="btn" href="#/tools/' + next.id + '">' + esc(next.short || next.title) + ' →</a>' : '<a class="btn" href="#/tools">Tất cả công cụ</a>') + '</div>';
    return h;
  }

  function page(id) {
    if (!id) return hub();
    var d = byId[id];
    return d ? shell(d) : '<h1>Không có công cụ này</h1><p><a href="#/tools">← Về danh sách công cụ</a></p>';
  }

  function mount(id) {
    leave();
    var d = byId[id], root = document.getElementById('tool-body');
    if (!d || !root) { if (!id) document.title = 'Công cụ luyện tập'; return; }
    cur = d;
    document.title = d.title + ' · Công cụ luyện tập';
    ['click', 'input', 'change', 'keydown'].forEach(function (t) {
      root.addEventListener(t, function (e) { if (cur === d && d.ev) d.ev(t, e); });
    });
    d.mount(root);
    // thanh chuyển công cụ: cuộn tới mục đang chọn
    var on = document.querySelector('.tool-switch a.on'); if (on && on.scrollIntoView) on.scrollIntoView({ block: 'nearest', inline: 'center' });
  }
  function leave() { if (cur && cur.unmount) cur.unmount(); cur = null; }

  return { reg: reg, page: page, mount: mount, leave: leave, stat: stat, save: save, rnd: rnd, pick: pick, shuffle: shuffle, bar: bar, seg: seg, toast: toast, copy: copy, esc: esc, list: list };
})();
