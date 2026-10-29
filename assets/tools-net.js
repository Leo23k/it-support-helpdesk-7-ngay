/* Công cụ mạng: máy tính subnet (tính / chia VLSM / luyện) và luyện nhị phân. */
(function () {
  'use strict';
  var T = TOOLS, esc = T.esc;

  /* ---------- tiện ích IPv4 ---------- */
  function ip2n(s) { var p = String(s).trim().split('.'); if (p.length !== 4) return null; var n = 0; for (var i = 0; i < 4; i++) { var v = +p[i]; if (p[i] === '' || !/^\d+$/.test(p[i]) || v > 255) return null; n = n * 256 + v; } return n; }
  function n2ip(n) { return [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.'); }
  function maskN(c) { return c === 0 ? 0 : (0xFFFFFFFF << (32 - c)) >>> 0; }
  function maskToPrefix(m) { for (var c = 0; c <= 32; c++) if (maskN(c) === m) return c; return -1; }
  function bin8(x) { return ('00000000' + x.toString(2)).slice(-8); }
  function parseNet(s) {
    var m = String(s).trim().match(/^(\d+\.\d+\.\d+\.\d+)\s*(?:\/|\s)\s*(\d+(?:\.\d+\.\d+\.\d+)?)$/);
    if (!m) return null;
    var ip = ip2n(m[1]), c; if (ip === null) return null;
    if (m[2].indexOf('.') >= 0) { var mn = ip2n(m[2]); if (mn === null) return null; c = maskToPrefix(mn); if (c < 0) return null; }
    else { c = +m[2]; if (c > 32) return null; }
    return { ip: ip, c: c };
  }
  function info(ip, c) {
    var mask = maskN(c), net = (ip & mask) >>> 0, bc = (net | (~mask >>> 0)) >>> 0;
    var hosts = c === 32 ? 1 : c === 31 ? 2 : Math.pow(2, 32 - c) - 2;
    var o2 = (ip >>> 16) & 255, a = ip >>> 24;
    var priv = a === 10 || (a === 172 && o2 >= 16 && o2 <= 31) || (a === 192 && o2 === 168);
    var kind = priv ? 'Private (RFC 1918)' : a === 169 && o2 === 254 ? 'APIPA — DHCP lỗi!' : a === 127 ? 'Loopback' : a >= 224 ? 'Multicast / dành riêng' : 'Public';
    return { mask: mask, net: net, bc: bc, hosts: hosts, first: c >= 31 ? net : net + 1, last: c >= 31 ? bc : bc - 1, kind: kind, cls: a < 128 ? 'A' : a < 192 ? 'B' : a < 224 ? 'C' : a < 240 ? 'D' : 'E' };
  }
  // Cách tính tay bằng "bước nhảy" (block size).
  function explain(ip, c) {
    if (c === 0 || c === 32) return '';
    var o = [ip >>> 24, (ip >>> 16) & 255, (ip >>> 8) & 255, ip & 255], mk = n2ip(maskN(c));
    if (c % 8 === 0) return 'Mask /' + c + ' = ' + mk + ': ' + (c / 8) + ' octet đầu là phần mạng (giữ nguyên), các octet còn lại là phần host (network = 0, broadcast = 255).';
    var k = Math.floor(c / 8), block = Math.pow(2, 8 - (c % 8)), v = o[k], nv = Math.floor(v / block) * block, net = o.slice(), bc = o.slice(), blocks = [];
    for (var i = k + 1; i < 4; i++) { net[i] = 0; bc[i] = 255; }
    net[k] = nv; bc[k] = nv + block - 1;
    for (var b = 0; b < 256 && blocks.length < 8; b += block) blocks.push(b);
    return 'Mask /' + c + ' = ' + mk + '. Octet thứ ' + (k + 1) + ' là octet “đặc biệt”: bước nhảy = 256 − ' + (256 - block) + ' = ' + block + ', các khối bắt đầu ở ' + blocks.join(', ') + (blocks.length < 256 / block ? ', …' : '') + '. Số ' + v + ' nằm trong khối ' + nv + '–' + (nv + block - 1) + ' → Network = ' + net.join('.') + ', Broadcast = ' + bc.join('.') + ', host dùng được từ ' + n2ip(ip2n(net.join('.')) + 1) + ' đến ' + n2ip(ip2n(bc.join('.')) - 1) + '.';
  }
  function bitsViz(ip, c) {
    var s = '';
    for (var i = 0; i < 32; i++) { if (i && i % 8 === 0) s += '<span class="dot">.</span>'; s += '<span class="bit ' + (i < c ? 'n' : 'h') + '">' + ((ip >>> (31 - i)) & 1) + '</span>'; }
    return '<div class="bits" aria-label="Địa chỉ ở dạng nhị phân">' + s + '</div><div class="bits-legend"><span class="bit n">■</span> phần mạng (' + c + ' bit) &nbsp; <span class="bit h">■</span> phần host (' + (32 - c) + ' bit)</div>';
  }

  /* ---------- Subnet ---------- */
  var SN = { tab: 'calc', q: null, res: null, n: 0, ok: 0, streak: 0 };
  var EXAMPLES = ['192.168.10.77/26', '10.0.5.130/22', '172.16.4.9/20', '192.168.1.1/30', '169.254.87.12/16'];

  function snCalcHtml() {
    return '<div class="panel"><label class="lbl" for="sn-in">Địa chỉ IP / prefix (hoặc IP + subnet mask)</label>' +
      '<div class="field"><input class="in grow mono" id="sn-in" value="192.168.10.77/26" spellcheck="false" autocomplete="off"><button class="btn" data-a="calc">Tính</button></div>' +
      '<div class="chips">' + EXAMPLES.map(function (x) { return '<button class="chip" data-a="ex" data-v="' + x + '">' + x + '</button>'; }).join('') + '</div>' +
      '<div id="sn-out"></div></div>' +
      '<div class="panel"><h3>Hai máy có thông nhau không? (cùng subnet)</h3><p class="hint">Lỗi kinh điển: máy gán IP tĩnh sai lớp mạng nên không ra được gateway. Nhập hai IP và mask/prefix để kiểm tra.</p>' +
      '<div class="field"><input class="in mono" id="sm-a" value="192.168.1.130" aria-label="IP máy A"><input class="in mono" id="sm-b" value="192.168.1.10" aria-label="IP máy B"><input class="in mono" id="sm-m" value="255.255.255.128" aria-label="Mask hoặc prefix" style="width:160px"></div><div id="sm-out"></div></div>';
  }
  function snCalc() {
    var out = document.getElementById('sn-out'), p = parseNet(document.getElementById('sn-in').value);
    if (!p) { out.innerHTML = '<p class="bad-msg">⚠ Nhập dạng <code>192.168.10.77/26</code> hoặc <code>192.168.10.77 255.255.255.192</code>.</p>'; return; }
    var i = info(p.ip, p.c);
    var rows = [['Network', n2ip(i.net)], ['Broadcast', n2ip(i.bc)], ['Subnet mask', n2ip(i.mask) + '  (/' + p.c + ')'], ['Wildcard', n2ip(~i.mask >>> 0)], ['Host đầu tiên', n2ip(i.first)], ['Host cuối cùng', n2ip(i.last)], ['Số host dùng được', i.hosts.toLocaleString('vi-VN')], ['Loại địa chỉ', i.kind + ' · lớp ' + i.cls]];
    out.innerHTML = '<div class="result">' + rows.map(function (r) { return '<div><b>' + r[0] + '</b><span>' + r[1] + '</span></div>'; }).join('') + '</div>' + bitsViz(p.ip, p.c) +
      '<div class="calc-explain"><b>Cách tính tay:</b> ' + explain(p.ip, p.c) + '</div>';
  }
  function snSame() {
    var a = ip2n(document.getElementById('sm-a').value), b = ip2n(document.getElementById('sm-b').value), m = document.getElementById('sm-m').value.trim(), out = document.getElementById('sm-out'), c;
    if (m.indexOf('.') >= 0) { var mn = ip2n(m); c = mn === null ? -1 : maskToPrefix(mn); } else c = /^\d+$/.test(m) && +m <= 32 ? +m : -1;
    if (a === null || b === null || c < 0) { out.innerHTML = '<p class="bad-msg">⚠ IP hoặc mask chưa hợp lệ.</p>'; return; }
    var na = (a & maskN(c)) >>> 0, nb = (b & maskN(c)) >>> 0, same = na === nb;
    out.innerHTML = '<div class="verdict ' + (same ? 'ok' : 'bad') + '">' + (same ? '✅ Cùng subnet' : '❌ Khác subnet') + '<span>A thuộc mạng <b>' + n2ip(na) + '/' + c + '</b>, B thuộc mạng <b>' + n2ip(nb) + '/' + c + '</b>. ' + (same ? 'Hai máy nói chuyện trực tiếp được (không cần router).' : 'Muốn liên lạc phải đi qua router/default gateway.') + '</span></div>';
  }

  function snVlsmHtml() {
    return '<div class="panel"><h3>Chia mạng theo nhu cầu từng phòng ban (VLSM)</h3><p class="hint">Bài toán thực tế: được cấp một dải, cần chia cho nhiều phòng với số máy khác nhau. Quy tắc: xếp từ phòng <b>lớn nhất</b> đến nhỏ nhất, mỗi mạng cần (số máy + 2) địa chỉ, làm tròn lên lũy thừa của 2.</p>' +
      '<label class="lbl" for="vl-base">Dải được cấp</label><input class="in mono" id="vl-base" value="192.168.10.0/24" style="max-width:260px">' +
      '<label class="lbl" for="vl-req">Nhu cầu (mỗi dòng: <i>tên phòng</i> rồi <i>số máy</i>)</label><textarea class="in mono" id="vl-req" rows="6">Kế toán 50\nKinh doanh 28\nNhân sự 12\nIT 6\nLiên kết router 2</textarea>' +
      '<div class="field"><button class="btn" data-a="vlsm">Chia mạng</button></div><div id="vl-out"></div></div>';
  }
  function snVlsm() {
    var out = document.getElementById('vl-out'), base = parseNet(document.getElementById('vl-base').value);
    if (!base) { out.innerHTML = '<p class="bad-msg">⚠ Dải được cấp chưa hợp lệ (vd 192.168.10.0/24).</p>'; return; }
    var bi = info(base.ip, base.c), reqs = [];
    document.getElementById('vl-req').value.split('\n').forEach(function (l) { var m = l.trim().match(/^(.*?)\s+(\d+)$/); if (m) reqs.push({ name: m[1], n: +m[2] }); });
    if (!reqs.length) { out.innerHTML = '<p class="bad-msg">⚠ Chưa có dòng nào hợp lệ (vd “Kế toán 50”).</p>'; return; }
    reqs.sort(function (a, b) { return b.n - a.n; });
    var cur = bi.net, used = 0, rows = '', err = '';
    for (var i = 0; i < reqs.length; i++) {
      var bits = Math.max(2, Math.ceil(Math.log(reqs[i].n + 2) / Math.LN2)), size = Math.pow(2, bits);
      cur = Math.ceil(cur / size) * size;
      if (cur + size - 1 > bi.bc) { err = 'Không đủ chỗ cho “' + esc(reqs[i].name) + '” (' + reqs[i].n + ' máy cần /' + (32 - bits) + '). Hãy xin dải lớn hơn hoặc giảm nhu cầu.'; break; }
      var inf = info(cur, 32 - bits);
      rows += '<tr><td>' + esc(reqs[i].name) + '</td><td>' + reqs[i].n + '</td><td><code>' + n2ip(cur) + '/' + (32 - bits) + '</code></td><td>' + n2ip(inf.mask) + '</td><td>' + n2ip(inf.first) + ' – ' + n2ip(inf.last) + '</td><td>' + n2ip(inf.bc) + '</td><td>' + inf.hosts + '</td></tr>';
      used += size; cur += size;
    }
    var total = bi.bc - bi.net + 1;
    out.innerHTML = (err ? '<p class="bad-msg">⚠ ' + err + '</p>' : '') + (rows ? '<div class="tbl"><table><thead><tr><th>Phòng</th><th>Cần</th><th>Mạng</th><th>Mask</th><th>Dải host</th><th>Broadcast</th><th>Host tối đa</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<p class="hint">Đã dùng ' + used + '/' + total + ' địa chỉ (' + Math.round(used / total * 100) + '%)' + (err ? '' : cur <= bi.bc ? ' · còn trống từ <code>' + n2ip(cur) + '</code> để mở rộng sau.' : '.') + ' Gateway thường đặt ở host đầu tiên của mỗi mạng.</p>' : '');
  }

  /* luyện subnet */
  function genQ() {
    var c = T.pick([17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30]), kind = T.rnd(3), o;
    o = kind === 0 ? [10, T.rnd(256), T.rnd(256), 1 + T.rnd(254)] : kind === 1 ? [172, 16 + T.rnd(16), T.rnd(256), 1 + T.rnd(254)] : [192, 168, T.rnd(256), 1 + T.rnd(254)];
    var ip = ip2n(o.join('.')), i = info(ip, c), type = T.pick(['net', 'net', 'bc', 'hosts', 'first', 'last', 'same', 'mask', 'need']), q = { type: type, ip: ip, c: c, i: i };
    var cidr = n2ip(ip) + '/' + c;
    if (type === 'net') { q.text = 'Địa chỉ mạng (Network) của <b class="mono">' + cidr + '</b> là gì?'; q.ans = n2ip(i.net); }
    else if (type === 'bc') { q.text = 'Địa chỉ broadcast của <b class="mono">' + cidr + '</b> là gì?'; q.ans = n2ip(i.bc); }
    else if (type === 'hosts') { q.text = 'Mạng <b class="mono">/' + c + '</b> có bao nhiêu host dùng được?'; q.ans = String(i.hosts); q.ex = 'Số host = 2^(32 − ' + c + ') − 2 = 2^' + (32 - c) + ' − 2 = ' + i.hosts + '.'; }
    else if (type === 'first') { q.text = 'Host đầu tiên dùng được của <b class="mono">' + cidr + '</b> là?'; q.ans = n2ip(i.first); }
    else if (type === 'last') { q.text = 'Host cuối cùng dùng được của <b class="mono">' + cidr + '</b> là?'; q.ans = n2ip(i.last); }
    else if (type === 'mask') { q.text = 'Subnet mask của prefix <b class="mono">/' + c + '</b> là?'; q.ans = n2ip(i.mask); q.ex = 'Mask /' + c + ': ' + n2ip(i.mask).split('.').map(function (x) { return bin8(+x); }).join('.') + ' (' + c + ' bit 1 liên tiếp).'; }
    else if (type === 'need') { var need = 5 + T.rnd(200), bits = Math.ceil(Math.log(need + 2) / Math.LN2); q.text = 'Một phòng có <b>' + need + '</b> máy. Prefix <b>dài nhất</b> (mạng nhỏ nhất) vẫn đủ địa chỉ là /?'; q.ans = String(32 - bits); q.ex = need + ' máy + 2 (network, broadcast) = ' + (need + 2) + ' → cần 2^' + bits + ' = ' + Math.pow(2, bits) + ' địa chỉ → host bits = ' + bits + ' → prefix = 32 − ' + bits + ' = /' + (32 - bits) + '.'; }
    else {
      var inside = T.rnd(2) === 0, size = i.bc - i.net + 1, b;
      if (inside) b = i.net + 1 + T.rnd(Math.max(1, size - 2)); else { b = i.net + size * (1 + T.rnd(2)) + 1 + T.rnd(Math.max(1, size - 2)); if (b > 0xFFFFFFFE) b = i.net - size + 1; }
      q.b = b >>> 0; q.same = (info(q.b, c).net === i.net);
      q.text = 'Máy A <b class="mono">' + n2ip(ip) + '</b> và máy B <b class="mono">' + n2ip(q.b) + '</b>, cùng mask <b class="mono">/' + c + '</b>. Hai máy có cùng subnet không?'; q.ans = q.same ? 'có' : 'không';
      q.ex = 'A thuộc mạng ' + n2ip(i.net) + ', B thuộc mạng ' + n2ip(info(q.b, c).net) + ' → ' + (q.same ? 'cùng' : 'khác') + ' mạng.';
    }
    if (!q.ex) q.ex = explain(ip, c);
    return q;
  }
  function norm(s) { return String(s).trim().toLowerCase().replace(/^\//, '').replace(/\s+/g, ''); }
  function snPracticeHtml() {
    if (!SN.q) SN.q = genQ();
    var q = SN.q, st = T.stat('subnet');
    var h = '<div class="panel practice"><div class="pq-meta"><span>Câu ' + (SN.n + (SN.res ? 0 : 1)) + '</span><span>🔥 chuỗi đúng: <b>' + SN.streak + '</b></span><span>✔ ' + SN.ok + '/' + SN.n + '</span><span>Tổng đã giải đúng: <b>' + (st.solved || 0) + '</b></span></div><div class="pq-text">' + q.text + '</div>';
    if (!SN.res) {
      if (q.type === 'same') h += '<div class="field"><button class="btn" data-a="ans" data-v="có">✅ Cùng subnet</button><button class="btn ghost" data-a="ans" data-v="không">❌ Khác subnet</button></div>';
      else h += '<div class="field"><input class="in grow mono" id="pq-in" autocomplete="off" spellcheck="false" placeholder="Nhập đáp án rồi nhấn Enter"><button class="btn" data-a="check">Kiểm tra</button></div>';
      h += '<div class="field"><button class="markbtn" data-a="skip">Bỏ qua</button></div><p class="hint">Mẹo: tự tính trên giấy bằng bước nhảy trước, rồi mới nhập. Sai thì xem cách tính ở bên dưới.</p>';
    } else {
      h += '<div class="verdict ' + (SN.res.ok ? 'ok' : 'bad') + '">' + (SN.res.ok ? '✅ Chính xác!' : '❌ Chưa đúng. Đáp án: <b class="mono">' + esc(q.ans) + '</b>') + '<span>' + q.ex + '</span></div><div class="field"><button class="btn" data-a="next" id="pq-next">Câu tiếp theo →</button></div>';
    }
    return h + '</div>';
  }
  function snAnswer(v) {
    var ok = norm(v) === norm(SN.q.ans);
    SN.n++; if (ok) { SN.ok++; SN.streak++; var st = T.stat('subnet'); st.solved = (st.solved || 0) + 1; T.save(); APP.markActive(); } else SN.streak = 0;
    SN.res = { ok: ok }; snRender();
    var nx = document.getElementById('pq-next'); if (nx) nx.focus();
  }
  function snRender() {
    var body = document.getElementById('sn-body');
    body.innerHTML = T.seg([['calc', '🧮 Tính subnet'], ['vlsm', '✂️ Chia mạng (VLSM)'], ['practice', '🎯 Luyện tập']], SN.tab, 'tab') +
      (SN.tab === 'calc' ? snCalcHtml() : SN.tab === 'vlsm' ? snVlsmHtml() : snPracticeHtml());
    if (SN.tab === 'calc') { snCalc(); snSame(); } else if (SN.tab === 'vlsm') snVlsm(); else { var i = document.getElementById('pq-in'); if (i) i.focus(); }
  }

  T.reg({
    id: 'subnet', group: 'net', icon: '🧮', short: 'Subnet', title: 'Máy tính & luyện Subnet', lv: 2, min: '10–15′', days: [3],
    desc: 'Tính network/broadcast/host kèm <b>cách tính tay</b>, chia mạng VLSM cho cả công ty, và luyện hàng chục câu ngẫu nhiên đến khi nhẩm được.',
    progress: function () { return [Math.min(T.stat('subnet').solved || 0, 20), 20]; },
    mount: function (root) { root.innerHTML = '<div id="sn-body"></div>'; SN.q = null; SN.res = null; snRender(); },
    ev: function (t, e) {
      if (t === 'input' && /^(sn-in)$/.test(e.target.id)) return snCalc();
      if (t === 'input' && /^sm-/.test(e.target.id)) return snSame();
      if (t === 'keydown' && e.key === 'Enter') {
        if (e.target.id === 'pq-in') return snAnswer(e.target.value);
        if (e.target.id === 'sn-in') return snCalc();
      }
      var b = e.target.closest('[data-a]'); if (t !== 'click' || !b) return;
      var a = b.dataset.a;
      if (a === 'tab') { SN.tab = b.dataset.v; snRender(); }
      else if (a === 'calc') snCalc();
      else if (a === 'ex') { document.getElementById('sn-in').value = b.dataset.v; snCalc(); }
      else if (a === 'vlsm') snVlsm();
      else if (a === 'check') snAnswer(document.getElementById('pq-in').value);
      else if (a === 'ans') snAnswer(b.dataset.v);
      else if (a === 'skip') { SN.q = genQ(); SN.res = null; SN.streak = 0; snRender(); }
      else if (a === 'next') { SN.q = genQ(); SN.res = null; snRender(); }
    }
  });

  /* ---------- Luyện nhị phân ---------- */
  var BN = { mode: 'bits', target: 0, bits: [0, 0, 0, 0, 0, 0, 0, 0], q: null, res: null, ok: 0, n: 0, streak: 0 };
  var PLACE = [128, 64, 32, 16, 8, 4, 2, 1], MASKS = [128, 192, 224, 240, 248, 252, 254, 255];
  function bnVal() { var v = 0; BN.bits.forEach(function (b, i) { if (b) v += PLACE[i]; }); return v; }
  function bnNew() {
    BN.res = null; BN.bits = [0, 0, 0, 0, 0, 0, 0, 0];
    if (BN.mode === 'bits') { BN.target = 1 + T.rnd(255); }
    else if (BN.mode === 'b2d') { var v = 1 + T.rnd(255); BN.q = { text: 'Đổi sang thập phân: <b class="mono big">' + bin8(v) + '</b>', ans: String(v), ex: PLACE.map(function (p, i) { return bin8(v)[i] === '1' ? p : null; }).filter(Boolean).join(' + ') + ' = ' + v }; }
    else {
      var c = T.pick([17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30]), which = T.rnd(2);
      var mk = n2ip(maskN(c));
      BN.q = which ? { text: 'Prefix <b class="mono big">/' + c + '</b> ứng với subnet mask nào?', ans: mk, ex: '/' + c + ' = ' + Math.floor(c / 8) + ' octet 255' + (c % 8 ? ' + octet ' + MASKS[(c % 8) - 1] + ' (có ' + (c % 8) + ' bit 1 đầu)' : '') + ' → ' + mk }
        : { text: 'Subnet mask <b class="mono big">' + mk + '</b> ứng với prefix /?', ans: String(c), ex: 'Đếm số bit 1: ' + mk.split('.').map(function (x) { return bin8(+x); }).join('.') + ' → ' + c + ' bit → /' + c };
    }
  }
  function bnHtml() {
    var h = T.seg([['bits', '🔘 Bật bit'], ['b2d', '🔢 Nhị phân → thập phân'], ['mask', '🎭 Mask ↔ Prefix']], BN.mode, 'bmode');
    h += '<div class="panel practice"><div class="pq-meta"><span>🔥 chuỗi: <b>' + BN.streak + '</b></span><span>✔ ' + BN.ok + '/' + BN.n + '</span></div>';
    if (BN.mode === 'bits') {
      var val = bnVal();
      h += '<div class="pq-text">Bật/tắt các bit để tạo số <b class="mono big">' + BN.target + '</b></div><div class="bitrow">' + PLACE.map(function (p, i) { return '<button class="bitbtn ' + (BN.bits[i] ? 'on' : '') + '" data-a="flip" data-i="' + i + '" aria-pressed="' + !!BN.bits[i] + '"><small>' + p + '</small><b>' + BN.bits[i] + '</b></button>'; }).join('') + '</div>' +
        '<div class="bitsum">Tổng hiện tại: <b class="' + (val === BN.target ? 'okc' : '') + '">' + val + '</b>' + (val === BN.target ? ' ✅ Đúng! ' : val > BN.target ? ' (vượt ' + (val - BN.target) + ')' : ' (còn thiếu ' + (BN.target - val) + ')') + '</div>' +
        '<div class="field">' + (val === BN.target ? '<button class="btn" data-a="bnext">Số tiếp theo →</button>' : '<button class="markbtn" data-a="bnext">Bỏ qua</button>') + '</div><p class="hint">Cách làm: từ trái sang phải, nếu số còn lại ≥ giá trị bit thì bật bit đó rồi trừ đi. Ví dụ 77: 64 + 8 + 4 + 1 → <span class="mono">01001101</span>.</p>';
    } else if (!BN.res) {
      h += '<div class="pq-text">' + BN.q.text + '</div><div class="field"><input class="in grow mono" id="bn-in" autocomplete="off" placeholder="Nhập đáp án rồi nhấn Enter"><button class="btn" data-a="bcheck">Kiểm tra</button></div>';
    } else {
      h += '<div class="pq-text">' + BN.q.text + '</div><div class="verdict ' + (BN.res.ok ? 'ok' : 'bad') + '">' + (BN.res.ok ? '✅ Chính xác!' : '❌ Đáp án: <b class="mono">' + esc(BN.q.ans) + '</b>') + '<span>' + BN.q.ex + '</span></div><div class="field"><button class="btn" id="bn-next" data-a="bnext">Câu tiếp theo →</button></div>';
    }
    h += '</div><div class="panel"><h3>Bảng cần thuộc</h3><div class="tbl"><table><thead><tr><th>Bit</th>' + PLACE.map(function (p) { return '<th>' + p + '</th>'; }).join('') + '</tr></thead><tbody><tr><td>Số bit 1 đầu</td>' + MASKS.map(function (m, i) { return '<td>' + (i + 1) + ' → <b>' + m + '</b></td>'; }).join('') + '</tr></tbody></table></div><p class="hint">Các giá trị của octet mask: <b>128, 192, 224, 240, 248, 252, 254, 255</b>. Thuộc lòng 8 số này là tính subnet nhanh hơn rất nhiều.</p></div>';
    return h;
  }
  function bnRender() { document.getElementById('bn-body').innerHTML = bnHtml(); var i = document.getElementById('bn-in'); if (i) i.focus(); }
  function bnScore(ok) {
    BN.n++; if (ok) { BN.ok++; BN.streak++; var st = T.stat('binary'); st.solved = (st.solved || 0) + 1; T.save(); APP.markActive(); } else BN.streak = 0;
  }
  T.reg({
    id: 'binary', group: 'net', icon: '🔢', short: 'Nhị phân', title: 'Luyện nhị phân & subnet mask', lv: 1, min: '5–10′', days: [3],
    desc: 'Bật/tắt từng bit để tạo số, đổi nhị phân ↔ thập phân, nhớ mask ↔ prefix. Nền móng để nhẩm subnet không cần máy tính.',
    progress: function () { return [Math.min(T.stat('binary').solved || 0, 20), 20]; },
    mount: function (root) { root.innerHTML = '<div id="bn-body"></div>'; BN.mode = 'bits'; bnNew(); bnRender(); },
    ev: function (t, e) {
      if (t === 'keydown' && e.key === 'Enter' && e.target.id === 'bn-in') { var ok = String(e.target.value).trim().replace(/^\//, '') === BN.q.ans; BN.res = { ok: ok }; bnScore(ok); bnRender(); var n = document.getElementById('bn-next'); if (n) n.focus(); return; }
      var b = e.target.closest('[data-a]'); if (t !== 'click' || !b) return;
      var a = b.dataset.a;
      if (a === 'bmode') { BN.mode = b.dataset.v; bnNew(); bnRender(); }
      else if (a === 'flip') { var i = +b.dataset.i; BN.bits[i] = BN.bits[i] ? 0 : 1; if (bnVal() === BN.target) bnScore(true); bnRender(); }
      else if (a === 'bnext') { if (BN.mode === 'bits' && bnVal() !== BN.target) BN.streak = 0; bnNew(); bnRender(); }
      else if (a === 'bcheck') { var inp = document.getElementById('bn-in'), ok2 = String(inp.value).trim().replace(/^\//, '') === BN.q.ans; BN.res = { ok: ok2 }; bnScore(ok2); bnRender(); }
    }
  });
})();
