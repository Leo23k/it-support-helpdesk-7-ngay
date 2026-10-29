/* Công cụ hệ thống & tài khoản: AD Users mô phỏng, tra mã lỗi, cây chẩn đoán, tính nhanh (chmod/RAID/truyền file). */
(function () {
  'use strict';
  var T = TOOLS, esc = T.esc, R = window.TREF;

  /* ================= AD Users and Computers mô phỏng ================= */
  var OUS = ['Kế toán', 'Kinh doanh', 'Nhân sự', 'IT', 'Disabled Users'];
  var GROUPS = ['GG_All_Staff', 'GG_KeToan_Share', 'GG_KinhDoanh_Share', 'GG_NhanSu_Share', 'VPN_Users', 'GG_IT_Admins', 'Domain Admins'];
  var PROTECTED = ['Domain Admins', 'GG_IT_Admins'];
  function U(sam, name, ou, groups, o) { return Object.assign({ sam: sam, name: name, ou: ou, enabled: true, locked: false, mustChange: false, pwSet: 0, groups: ['GG_All_Staff'].concat(groups || []), title: '' }, o || {}); }
  function has(u, g) { return u.groups.indexOf(g) >= 0; }
  function ok(c, t) { return { ok: !!c, t: t }; }

  var TASKS = [
    {
      id: 'unlock', lv: 1, title: 'Mở khoá tài khoản', from: 'Võ Thị Lan · Kinh doanh · gọi điện',
      text: 'Chị Lan gọi: “Em gõ sai mật khẩu mấy lần, giờ máy báo tài khoản bị khoá. Em nhớ mật khẩu đúng rồi, chỉ cần mở khoá thôi.”',
      users: function () { return [U('vo.lan', 'Võ Thị Lan', 'Kinh doanh', ['GG_KinhDoanh_Share'], { locked: true }), U('le.hung', 'Lê Hùng', 'Kinh doanh', ['GG_KinhDoanh_Share']), U('pham.minh', 'Phạm Minh', 'Kinh doanh', ['GG_KinhDoanh_Share'])]; },
      check: function (A, u) { var l = u('vo.lan'); return [ok(!l.locked, 'Tài khoản vo.lan đã được mở khoá'), ok(l.pwSet === 0, 'Không đặt lại mật khẩu (user đã nhớ mật khẩu — chỉ cần Unlock)'), ok(l.enabled, 'Tài khoản vẫn đang Enabled')]; },
      why: 'Khoá (lockout) khác với quên mật khẩu: nếu user nhớ mật khẩu, chỉ Unlock. Reset không cần thiết gây phiền và làm user phải đổi mật khẩu lại.'
    },
    {
      id: 'reset', lv: 1, title: 'Đặt lại mật khẩu (đã xác minh)', from: 'Lê Hùng · Kinh doanh · gọi điện',
      text: 'Anh Hùng quên mật khẩu. Bạn đã gọi lại vào số điện thoại đã đăng ký trong hồ sơ HR và xác minh đúng danh tính. Hãy đặt mật khẩu tạm đạt chính sách và buộc anh ấy tự đổi ở lần đăng nhập đầu.',
      users: function () { return [U('vo.lan', 'Võ Thị Lan', 'Kinh doanh', ['GG_KinhDoanh_Share']), U('le.hung', 'Lê Hùng', 'Kinh doanh', ['GG_KinhDoanh_Share']), U('pham.minh', 'Phạm Minh', 'Kinh doanh', ['GG_KinhDoanh_Share'])]; },
      check: function (A, u) { var h = u('le.hung'); return [ok(h.pwSet > 0, 'Đã đặt lại mật khẩu cho le.hung'), ok(h.mustChange, 'Bật “User must change password at next logon”'), ok(u('vo.lan').pwSet === 0 && u('pham.minh').pwSet === 0, 'Không đụng tới tài khoản của người khác')]; },
      why: 'Mật khẩu tạm chỉ cho dùng một lần và phải đổi ngay — helpdesk không nên biết mật khẩu thật của user. Mật khẩu tạm phải đạt chính sách (≥ 8 ký tự, đủ 3/4 loại ký tự, không chứa tên đăng nhập).'
    },
    {
      id: 'addgroup', lv: 1, title: 'Cấp quyền thư mục qua nhóm', from: 'Phạm Minh · Kinh doanh · ticket',
      text: 'Minh mới vào Kinh doanh, cần truy cập thư mục chung “Kinh doanh” (nhóm bảo mật <b>GG_KinhDoanh_Share</b>). Trưởng phòng đã duyệt trong ticket. Cấp đúng nhóm, không cấp thừa.',
      users: function () { return [U('pham.minh', 'Phạm Minh', 'Kinh doanh', []), U('le.hung', 'Lê Hùng', 'Kinh doanh', ['GG_KinhDoanh_Share']), U('vo.lan', 'Võ Thị Lan', 'Kinh doanh', ['GG_KinhDoanh_Share'])]; },
      check: function (A, u) { var m = u('pham.minh'); return [ok(has(m, 'GG_KinhDoanh_Share'), 'pham.minh là thành viên GG_KinhDoanh_Share'), ok(has(m, 'GG_All_Staff'), 'Vẫn giữ nhóm GG_All_Staff'), ok(m.groups.length === 2 && A.attempts.length === 0, 'Không cấp thêm nhóm nào khác / không thử cấp nhóm đặc quyền')]; },
      why: 'Cấp quyền theo nhóm (AGDLP), không cấp trực tiếp trên thư mục. Chỉ cấp đúng thứ được duyệt (least privilege).'
    },
    {
      id: 'offboard', lv: 2, title: 'Offboarding: nhân viên nghỉ việc', from: 'Phòng Nhân sự · ticket',
      text: 'Chị Trang (Kế toán) nghỉ việc từ hôm nay. HR yêu cầu: <b>vô hiệu hoá</b> tài khoản, <b>gỡ quyền truy cập</b> (VPN và thư mục Kế toán), <b>chuyển sang OU “Disabled Users”</b>. <u>Không xoá</u> tài khoản (giữ 90 ngày theo chính sách).',
      users: function () { return [U('do.trang', 'Đỗ Thị Trang', 'Kế toán', ['GG_KeToan_Share', 'VPN_Users']), U('nguyen.an', 'Nguyễn An', 'Kế toán', ['GG_KeToan_Share']), U('tran.tuan', 'Trần Tuấn', 'Kế toán', ['GG_KeToan_Share', 'VPN_Users'])]; },
      check: function (A, u) { var t = u('do.trang'); return [ok(!t.enabled, 'Tài khoản do.trang đã bị Disable'), ok(t.ou === 'Disabled Users', 'Đã chuyển sang OU Disabled Users'), ok(!has(t, 'VPN_Users'), 'Đã gỡ khỏi VPN_Users'), ok(!has(t, 'GG_KeToan_Share'), 'Đã gỡ khỏi GG_KeToan_Share'), ok(u('nguyen.an').enabled && u('tran.tuan').enabled && has(u('tran.tuan'), 'VPN_Users'), 'Không ảnh hưởng người khác')]; },
      why: 'Quy trình nghỉ việc: disable ngay, gỡ quyền, chuyển OU (để GPO cô lập/ dễ rà soát), giữ tài khoản một thời gian rồi mới xoá. Thực tế còn: thu hồi thiết bị, chuyển tiếp email, xử lý license, ghi ticket.'
    },
    {
      id: 'newhire', lv: 2, title: 'Onboarding: tạo tài khoản nhân viên mới', from: 'Phòng Nhân sự · ticket',
      text: 'Nhân viên mới <b>Trần Bình</b> vào phòng <b>Kế toán</b> ngày mai. Quy ước tên đăng nhập: <i>họ.tên không dấu</i> (vd nguyen.an). Cần: nằm trong OU Kế toán, nhóm <b>GG_All_Staff</b> + <b>GG_KeToan_Share</b>, mật khẩu tạm bắt đổi ở lần đăng nhập đầu. Không cần VPN.',
      users: function () { return [U('nguyen.an', 'Nguyễn An', 'Kế toán', ['GG_KeToan_Share']), U('tran.tuan', 'Trần Tuấn', 'Kế toán', ['GG_KeToan_Share', 'VPN_Users'])]; },
      check: function (A, u) { var b = u('tran.binh'); if (!b) return [ok(false, 'Tạo user tran.binh (nút “Người dùng mới”)')]; return [ok(true, 'Đã tạo tài khoản tran.binh'), ok(b.ou === 'Kế toán', 'Nằm trong OU Kế toán'), ok(has(b, 'GG_All_Staff') && has(b, 'GG_KeToan_Share'), 'Có nhóm GG_All_Staff và GG_KeToan_Share'), ok(!has(b, 'VPN_Users') && b.groups.length === 2, 'Không cấp VPN / nhóm thừa'), ok(b.mustChange && b.enabled, 'Bắt đổi mật khẩu lần đầu và tài khoản Enabled')]; },
      why: 'Onboarding đúng: theo mẫu của phòng ban, tối thiểu quyền cần thiết, mật khẩu tạm đổi ngay. Thực tế còn tạo mailbox/license M365, cấp thiết bị và gửi thông tin đăng nhập qua kênh an toàn.'
    },
    {
      id: 'transfer', lv: 2, title: 'Điều chuyển phòng ban', from: 'Phòng Nhân sự · ticket',
      text: 'Chị Hoa chuyển từ <b>Kế toán</b> sang <b>Nhân sự</b>, hiệu lực hôm nay. Cần chuyển OU, <u>gỡ</u> quyền Kế toán, cấp quyền Nhân sự (<b>GG_NhanSu_Share</b>); vẫn giữ GG_All_Staff.',
      users: function () { return [U('bui.hoa', 'Bùi Thị Hoa', 'Kế toán', ['GG_KeToan_Share']), U('nguyen.an', 'Nguyễn An', 'Kế toán', ['GG_KeToan_Share']), U('mai.huong', 'Mai Hương', 'Nhân sự', ['GG_NhanSu_Share'])]; },
      check: function (A, u) { var h = u('bui.hoa'); return [ok(h.ou === 'Nhân sự', 'Đã chuyển sang OU Nhân sự'), ok(!has(h, 'GG_KeToan_Share'), 'Đã gỡ GG_KeToan_Share (không giữ quyền cũ)'), ok(has(h, 'GG_NhanSu_Share'), 'Đã thêm GG_NhanSu_Share'), ok(has(h, 'GG_All_Staff'), 'Vẫn giữ GG_All_Staff')]; },
      why: 'Lỗi hay gặp: chỉ thêm quyền mới mà quên gỡ quyền cũ ⇒ “tích luỹ quyền” (privilege creep). Điều chuyển = gỡ cũ + cấp mới.'
    },
    {
      id: 'reenable', lv: 2, title: 'Bật lại tài khoản sau nghỉ dài ngày', from: 'Phòng Nhân sự · ticket',
      text: 'Chị Vân (Nhân sự) nghỉ thai sản 8 tháng và quay lại làm việc hôm nay (HR xác nhận). Tài khoản đã bị vô hiệu hoá tự động. Hãy bật lại và đặt mật khẩu tạm (mật khẩu cũ đã hết hạn), buộc đổi ở lần đăng nhập đầu.',
      users: function () { return [U('hoang.van', 'Hoàng Thị Vân', 'Nhân sự', ['GG_NhanSu_Share'], { enabled: false }), U('mai.huong', 'Mai Hương', 'Nhân sự', ['GG_NhanSu_Share'])]; },
      check: function (A, u) { var v = u('hoang.van'); return [ok(v.enabled, 'Đã Enable tài khoản hoang.van'), ok(v.pwSet > 0, 'Đã đặt mật khẩu tạm mới'), ok(v.mustChange, 'Bắt đổi mật khẩu ở lần đăng nhập đầu'), ok(v.ou === 'Nhân sự' && has(v, 'GG_NhanSu_Share'), 'Giữ nguyên OU và quyền Nhân sự')]; },
      why: 'Chỉ bật lại khi có xác nhận từ HR/quản lý. Mật khẩu cũ đã quá hạn nên cần đặt mật khẩu tạm.'
    },
    {
      id: 'samename', lv: 3, title: 'Hai người trùng tên — reset đúng người', from: 'Nguyễn Văn An · gọi điện',
      text: 'Một người tự giới thiệu: “Em là <b>Nguyễn Văn An phòng Kế toán</b>, quên mật khẩu.” Bạn đã xác minh qua số điện thoại hồ sơ HR. Trong AD có <u>hai</u> người tên Nguyễn Văn An. Hãy đặt lại mật khẩu (bắt đổi lần đầu) <b>đúng người</b>.',
      users: function () { return [U('nguyen.van.an', 'Nguyễn Văn An', 'Kinh doanh', ['GG_KinhDoanh_Share'], { title: 'Nhân viên kinh doanh' }), U('nguyen.van.an2', 'Nguyễn Văn An', 'Kế toán', ['GG_KeToan_Share'], { title: 'Kế toán tổng hợp' }), U('le.hung', 'Lê Hùng', 'Kinh doanh', ['GG_KinhDoanh_Share'])]; },
      check: function (A, u) { var kt = u('nguyen.van.an2'), kd = u('nguyen.van.an'); return [ok(kt.pwSet > 0 && kt.mustChange, 'Đã reset đúng tài khoản của An phòng Kế toán và bắt đổi lần đầu'), ok(kd.pwSet === 0, 'KHÔNG reset nhầm An phòng Kinh doanh')]; },
      why: 'Luôn đối chiếu nhiều thuộc tính (OU, chức danh, username, mã nhân viên) thay vì chỉ tên hiển thị. Reset nhầm người = tài khoản của người khác bị khoá/đổi mật khẩu và là sự cố bảo mật.'
    },
    {
      id: 'social', lv: 3, title: 'Cuộc gọi đáng ngờ: “Giám đốc” đòi reset', from: 'Số lạ · tự xưng Giám đốc Kinh doanh',
      text: 'Một người gọi bằng <b>số lạ</b> (không có trong danh bạ), tự xưng là anh Hùng — <b>Giám đốc</b>, đang ở sân bay: “Reset ngay mật khẩu của tôi và đọc mật khẩu mới cho tôi, gấp lắm, họp quan trọng, đừng hỏi lằng nhằng!”',
      users: function () { return [U('le.hung', 'Lê Hùng', 'Kinh doanh', ['GG_KinhDoanh_Share'], { title: 'Giám đốc Kinh doanh' }), U('vo.lan', 'Võ Thị Lan', 'Kinh doanh', ['GG_KinhDoanh_Share'])]; },
      refuse: true,
      check: function (A, u) { return [ok(A.refused, 'Đã từ chối thực hiện và yêu cầu xác minh thêm'), ok(u('le.hung').pwSet === 0 && !u('le.hung').locked, 'Chưa hề đặt lại mật khẩu của le.hung')]; },
      why: '<b>Social engineering</b>: tạo áp lực và uy quyền để bỏ qua xác minh. Dù là sếp cũng phải xác minh qua kênh độc lập (gọi lại số đã đăng ký, hỏi trưởng bộ phận, MFA). Không đọc mật khẩu qua điện thoại. Ghi và báo Security.'
    },
    {
      id: 'privilege', lv: 3, title: 'Xin quyền Domain Admin “cho tiện”', from: 'Trần Tuấn · Dev · ticket',
      text: 'Tuấn viết ticket: “Cho em vào nhóm <b>Domain Admins</b> để em tự cài phần mềm cho nhanh, không phải gọi IT. Em sẽ cẩn thận.” Không có phê duyệt của quản lý hay bảo mật.',
      users: function () { return [U('tran.tuan', 'Trần Tuấn', 'IT', ['VPN_Users']), U('le.hung', 'Lê Hùng', 'Kinh doanh', ['GG_KinhDoanh_Share'])]; },
      refuse: true,
      check: function (A, u) { return [ok(A.refused, 'Đã từ chối và hướng dẫn quy trình (cần phê duyệt / yêu cầu cài đặt qua IT)'), ok(!has(u('tran.tuan'), 'Domain Admins') && !has(u('tran.tuan'), 'GG_IT_Admins'), 'Tuấn không có quyền quản trị')]; },
      why: 'Quyền Domain Admin là chìa khoá toàn domain — chỉ cấp qua quy trình có phê duyệt và lý do kinh doanh. Nguyên tắc <b>least privilege</b>. Đề xuất giải pháp thay thế: cài phần mềm qua Software Center hoặc cấp quyền admin cục bộ có kiểm soát.'
    }
  ];

  var AD = { ti: 0, users: [], sel: null, ou: '*', dlg: null, log: [], res: null, refused: false, attempts: [], q: '' };
  function adDone() { var d = T.stat('aduc'); return d.done || (d.done = {}); }
  function adLoad(i) {
    AD.ti = i; AD.users = TASKS[i].users(); AD.sel = null; AD.ou = '*'; AD.dlg = null; AD.log = []; AD.res = null; AD.refused = false; AD.attempts = []; AD.q = '';
  }
  function byS(s) { for (var i = 0; i < AD.users.length; i++) if (AD.users[i].sam === s) return AD.users[i]; return null; }
  function lg(m) { AD.log.push(m); }
  function pwErr(pw, sam) {
    if (pw.length < 8) return 'Mật khẩu phải có ít nhất 8 ký tự.';
    var k = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter(function (r) { return r.test(pw); }).length;
    if (k < 3) return 'Cần ít nhất 3 trong 4 loại ký tự: chữ thường, chữ hoa, số, ký tự đặc biệt.';
    if (sam && pw.toLowerCase().indexOf(sam.split('.')[0].toLowerCase()) >= 0 && sam.split('.')[0].length > 2) return 'Mật khẩu không được chứa tên đăng nhập.';
    return '';
  }
  function pwMeter(pw, sam) { var e = pwErr(pw, sam); return pw ? (e ? '<span class="bad-msg">✗ ' + e + '</span>' : '<span class="okc">✓ Đạt chính sách mật khẩu</span>') : '<span class="hint">Chính sách: ≥ 8 ký tự, đủ 3/4 loại ký tự, không chứa tên đăng nhập.</span>'; }

  function adDetail(u) {
    if (!u) return '<div class="ad-empty">Chọn một tài khoản bên trái để xem và thao tác.<br><small>Mẹo: đọc kỹ yêu cầu, đối chiếu OU/nhóm rồi mới thao tác.</small></div>';
    var h = '<div class="ad-head"><span class="ad-av">' + esc(u.name.split(' ').pop().charAt(0)) + '</span><div><b>' + esc(u.name) + '</b><div class="hint">' + esc(u.sam) + (u.title ? ' · ' + esc(u.title) : '') + '</div></div></div>' +
      '<div class="ad-tags"><span class="adt ' + (u.enabled ? 'ok' : 'bad') + '">' + (u.enabled ? 'Enabled' : 'Disabled') + '</span>' + (u.locked ? '<span class="adt bad">🔒 Locked out</span>' : '') + (u.mustChange ? '<span class="adt warn">Phải đổi mật khẩu</span>' : '') + '<span class="adt">OU: ' + esc(u.ou) + '</span></div>' +
      '<div class="ad-btns"><button class="markbtn" data-a="unlock"' + (u.locked ? '' : ' disabled') + '>🔓 Unlock account</button><button class="markbtn" data-a="dlg" data-v="reset">🔑 Reset password…</button><button class="markbtn" data-a="toggle">' + (u.enabled ? '⛔ Disable account' : '✅ Enable account') + '</button><button class="markbtn" data-a="dlg" data-v="move">📁 Move…</button></div>';
    if (AD.dlg === 'reset') h += '<div class="ad-dlg"><h4>Reset Password — ' + esc(u.sam) + '</h4><label class="lbl" for="ad-pw">Mật khẩu mới</label><input class="in mono" id="ad-pw" type="text" autocomplete="off" placeholder="Nhập mật khẩu tạm"><div id="ad-pwm" class="hint">' + pwMeter('', u.sam) + '</div><label class="chk"><input type="checkbox" id="ad-mc" checked> User must change password at next logon</label><label class="chk"><input type="checkbox" id="ad-ul"> Unlock the user’s account</label><div class="field"><button class="btn" data-a="resetok">OK</button><button class="markbtn" data-a="dlgx">Huỷ</button></div></div>';
    if (AD.dlg === 'move') h += '<div class="ad-dlg"><h4>Move object into container</h4><select class="in" id="ad-mv">' + OUS.map(function (o) { return '<option' + (o === u.ou ? ' selected' : '') + '>' + o + '</option>'; }).join('') + '</select><div class="field"><button class="btn" data-a="moveok">OK</button><button class="markbtn" data-a="dlgx">Huỷ</button></div></div>';
    h += '<h4>Member Of</h4><ul class="ad-groups">' + u.groups.map(function (g) { return '<li><span>👥 ' + esc(g) + '</span><button class="mini-x" data-a="rmg" data-v="' + esc(g) + '" title="Remove">Remove</button></li>'; }).join('') + '</ul>' +
      '<div class="field"><select class="in" id="ad-g">' + GROUPS.filter(function (g) { return !has(u, g); }).map(function (g) { return '<option>' + g + '</option>'; }).join('') + '</select><button class="markbtn" data-a="addg">➕ Add to group</button></div>';
    return h;
  }
  function adNewDlg() {
    return '<div class="ad-dlg wide"><h4>New Object — User</h4><div class="ad-form"><div><label class="lbl" for="nu-f">Họ và tên đệm</label><input class="in" id="nu-f" placeholder="Trần"></div><div><label class="lbl" for="nu-l">Tên</label><input class="in" id="nu-l" placeholder="Bình"></div><div><label class="lbl" for="nu-s">User logon name (sAMAccountName)</label><input class="in mono" id="nu-s" placeholder="ho.ten"></div><div><label class="lbl" for="nu-o">Tạo trong OU</label><select class="in" id="nu-o">' + OUS.filter(function (o) { return o !== 'Disabled Users'; }).map(function (o) { return '<option>' + o + '</option>'; }).join('') + '</select></div><div><label class="lbl" for="nu-p">Mật khẩu tạm</label><input class="in mono" id="nu-p" autocomplete="off"></div></div><div id="nu-pm" class="hint">' + pwMeter('', '') + '</div><label class="chk"><input type="checkbox" id="nu-mc" checked> User must change password at next logon</label><label class="lbl">Thêm vào nhóm</label><div class="ad-checks">' + GROUPS.map(function (g) { return '<label class="chk"><input type="checkbox" class="nu-g" value="' + g + '"' + (g === 'GG_All_Staff' ? ' checked' : '') + (PROTECTED.indexOf(g) >= 0 ? ' disabled' : '') + '> ' + g + '</label>'; }).join('') + '</div><div id="nu-err" class="bad-msg"></div><div class="field"><button class="btn" data-a="newok">Tạo</button><button class="markbtn" data-a="dlgx">Huỷ</button></div></div>';
  }
  function adHtml() {
    var t = TASKS[AD.ti], done = adDone();
    var h = '<div class="ad-tasks">' + TASKS.map(function (x, i) { return '<button class="sc-card ' + (i === AD.ti ? 'on' : '') + ' ' + (done[x.id] ? 'done' : '') + '" data-a="task" data-v="' + i + '"><span class="sc-n">' + (done[x.id] ? '✓' : i + 1) + '</span><span class="sc-t"><b>' + esc(x.title) + '</b><small>' + ['', 'Dễ', 'Vừa', 'Khó'][x.lv] + '</small></span></button>'; }).join('') + '</div>';
    h += '<div class="ticket"><div class="ticket-h"><span class="tk-id">TASK-' + (AD.ti + 1) + '</span><span class="tk-from">' + esc(t.from) + '</span></div><div class="ticket-b"><b>' + esc(t.title) + '</b><p>' + t.text + '</p></div></div>';
    var list = AD.users.filter(function (u) { return (AD.ou === '*' || u.ou === AD.ou) && (!AD.q || (u.name + ' ' + u.sam).toLowerCase().indexOf(AD.q.toLowerCase()) >= 0); });
    h += '<div class="win"><div class="win-title"><span>🗂 Active Directory Users and Computers — corp.local</span><span class="win-ctl">— ☐ ✕</span></div><div class="win-menu"><button class="markbtn" data-a="dlg" data-v="new">➕ Người dùng mới</button><input class="in" id="ad-q" type="search" placeholder="Tìm tên / username…" value="' + esc(AD.q) + '" style="max-width:240px"></div><div class="ad-body"><div class="ad-tree"><div class="ad-node ' + (AD.ou === '*' ? 'on' : '') + '" data-a="ou" data-v="*">🌐 corp.local <small>(' + AD.users.length + ')</small></div>' + OUS.map(function (o) { return '<div class="ad-node sub ' + (AD.ou === o ? 'on' : '') + '" data-a="ou" data-v="' + esc(o) + '">📁 ' + o + ' <small>(' + AD.users.filter(function (u) { return u.ou === o; }).length + ')</small></div>'; }).join('') + '</div>' +
      '<div class="ad-list"><table><thead><tr><th>Name</th><th>Logon</th><th>OU</th><th>Trạng thái</th></tr></thead><tbody>' + (list.map(function (u) { return '<tr class="' + (AD.sel === u.sam ? 'on' : '') + '" data-a="sel" data-v="' + esc(u.sam) + '"><td>👤 ' + esc(u.name) + '</td><td class="mono">' + esc(u.sam) + '</td><td>' + esc(u.ou) + '</td><td>' + (u.enabled ? '' : '⛔ ') + (u.locked ? '🔒' : '') + '</td></tr>'; }).join('') || '<tr><td colspan="4" class="hint">Không có đối tượng.</td></tr>') + '</tbody></table></div>' +
      '<div class="ad-detail">' + (AD.dlg === 'new' ? adNewDlg() : adDetail(byS(AD.sel))) + '</div></div></div>';
    h += '<div class="field" style="margin-top:12px"><button class="btn" data-a="check">✅ Kiểm tra kết quả</button><button class="markbtn" data-a="refuse">⛔ Không thực hiện — cần xác minh thêm</button><button class="markbtn" data-a="retry">↺ Làm lại</button></div>';
    if (AD.res) h += '<div class="verdict ' + (AD.res.pass ? 'ok' : 'bad') + '">' + (AD.res.pass ? '🎉 Hoàn thành tốt!' : 'Chưa đạt — còn thiếu:') + '<ul class="reqs">' + AD.res.items.map(function (r) { return '<li class="' + (r.ok ? 'y' : 'n') + '">' + (r.ok ? '✔' : '✘') + ' ' + r.t + '</li>'; }).join('') + '</ul>' + (AD.res.pass ? '<span>' + t.why + '</span>' : '') + '</div>';
    if (AD.log.length) h += '<details class="panel" open><summary><b>Nhật ký thao tác của bạn</b> (audit)</summary><ol class="ad-log">' + AD.log.map(function (l) { return '<li>' + l + '</li>'; }).join('') + '</ol></details>';
    return h;
  }
  function adRender() { document.getElementById('ad-root').innerHTML = adHtml(); }
  function adNeedSel() { var u = byS(AD.sel); if (!u) T.toast('Hãy chọn một tài khoản trước'); return u; }

  T.reg({
    id: 'aduc', group: 'sys', icon: '🗂️', short: 'AD Users', title: 'AD Users & Computers mô phỏng', lv: 2, min: '5–8′ / bài', days: [4],
    desc: 'Giao diện giống ADUC: mở khoá, reset mật khẩu, cấp quyền theo nhóm, onboarding/offboarding, điều chuyển. Có bài <b>bẫy social engineering</b> và <b>trùng tên</b> — kiểm tra kết quả theo từng yêu cầu.',
    progress: function () { return [Object.keys(adDone()).length, TASKS.length]; },
    mount: function (root) { root.innerHTML = '<div id="ad-root"></div>'; var d = adDone(), f = 0; for (var i = 0; i < TASKS.length; i++) if (!d[TASKS[i].id]) { f = i; break; } adLoad(f); adRender(); },
    ev: function (t, e) {
      if (t === 'input') {
        if (e.target.id === 'ad-pw') document.getElementById('ad-pwm').innerHTML = pwMeter(e.target.value, AD.sel);
        else if (e.target.id === 'nu-p') document.getElementById('nu-pm').innerHTML = pwMeter(e.target.value, '');
        else if (e.target.id === 'ad-q') { AD.q = e.target.value; var pos = e.target.selectionStart; adRender(); var q = document.getElementById('ad-q'); q.focus(); q.setSelectionRange(pos, pos); }
        return;
      }
      var b = e.target.closest('[data-a]'); if (t !== 'click' || !b || b.disabled) return;
      var a = b.dataset.a, u = byS(AD.sel);
      if (a === 'task') { adLoad(+b.dataset.v); adRender(); }
      else if (a === 'retry') { adLoad(AD.ti); adRender(); }
      else if (a === 'ou') { AD.ou = b.dataset.v; adRender(); }
      else if (a === 'sel') { AD.sel = b.dataset.v; AD.dlg = null; adRender(); }
      else if (a === 'dlg') { if (b.dataset.v !== 'new' && !adNeedSel()) return; AD.dlg = b.dataset.v; adRender(); var f = document.getElementById('ad-pw') || document.getElementById('nu-f'); if (f) f.focus(); }
      else if (a === 'dlgx') { AD.dlg = null; adRender(); }
      else if (a === 'unlock' && u) { u.locked = false; lg('Unlock account <b>' + esc(u.sam) + '</b>'); adRender(); }
      else if (a === 'toggle' && u) { u.enabled = !u.enabled; lg((u.enabled ? 'Enable' : 'Disable') + ' account <b>' + esc(u.sam) + '</b>'); adRender(); }
      else if (a === 'resetok' && u) {
        var pw = document.getElementById('ad-pw').value, er = pwErr(pw, u.sam);
        if (er) { document.getElementById('ad-pwm').innerHTML = '<span class="bad-msg">✗ The password does not meet the password policy requirements. ' + er + '</span>'; return; }
        u.pwSet++; u.mustChange = document.getElementById('ad-mc').checked; if (document.getElementById('ad-ul').checked) u.locked = false;
        lg('Reset password <b>' + esc(u.sam) + '</b> (must change: ' + (u.mustChange ? 'có' : 'không') + ')'); AD.dlg = null; adRender();
      }
      else if (a === 'moveok' && u) { u.ou = document.getElementById('ad-mv').value; lg('Move <b>' + esc(u.sam) + '</b> → OU ' + esc(u.ou)); AD.dlg = null; adRender(); }
      else if (a === 'rmg' && u) { u.groups = u.groups.filter(function (g) { return g !== b.dataset.v; }); lg('Remove <b>' + esc(u.sam) + '</b> khỏi ' + esc(b.dataset.v)); adRender(); }
      else if (a === 'addg' && u) {
        var g = document.getElementById('ad-g').value; if (!g) return;
        if (PROTECTED.indexOf(g) >= 0) { AD.attempts.push(g); lg('⚠ Thử thêm <b>' + esc(u.sam) + '</b> vào nhóm đặc quyền ' + esc(g) + ' → bị từ chối'); adRender(); T.toast('Access denied: tài khoản helpdesk không có quyền sửa nhóm đặc quyền'); return; }
        u.groups.push(g); lg('Add <b>' + esc(u.sam) + '</b> vào ' + esc(g)); adRender();
      }
      else if (a === 'newok') {
        var f1 = document.getElementById('nu-f').value.trim(), l1 = document.getElementById('nu-l').value.trim(), sam = document.getElementById('nu-s').value.trim().toLowerCase(), p = document.getElementById('nu-p').value, err = '';
        if (!f1 || !l1 || !sam) err = 'Hãy nhập đủ họ, tên và user logon name.'; else if (!/^[a-z0-9.]+$/.test(sam)) err = 'User logon name chỉ gồm chữ thường không dấu, số và dấu chấm.'; else if (byS(sam)) err = 'The specified user account already exists.'; else err = pwErr(p, sam);
        if (err) { document.getElementById('nu-err').textContent = '✗ ' + err; return; }
        var gs = [].slice.call(document.querySelectorAll('.nu-g:checked')).map(function (c) { return c.value; });
        var nu = U(sam, f1 + ' ' + l1, document.getElementById('nu-o').value, [], { mustChange: document.getElementById('nu-mc').checked, pwSet: 1 }); nu.groups = gs;
        AD.users.push(nu); AD.sel = sam; AD.dlg = null; lg('Tạo user <b>' + esc(sam) + '</b> trong OU ' + esc(nu.ou) + ', nhóm: ' + gs.map(esc).join(', ')); adRender();
      }
      else if (a === 'refuse') { AD.refused = true; lg('Từ chối thực hiện / yêu cầu xác minh thêm'); AD.res = null; T.toast('Đã ghi nhận: yêu cầu xác minh thêm'); adRender(); }
      else if (a === 'check') {
        var t0 = TASKS[AD.ti], items = t0.check(AD, byS);
        if (!t0.refuse && AD.refused) items.push(ok(false, 'Yêu cầu này hợp lệ và đã được duyệt — không cần từ chối'));
        var pass = items.every(function (x) { return x.ok; });
        AD.res = { pass: pass, items: items };
        if (pass) { var d = adDone(); if (!d[t0.id]) { d[t0.id] = 1; T.save(); } APP.markActive(); }
        adRender(); document.querySelector('.verdict').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  });

  /* ================= Tra mã lỗi ================= */
  var LK = { cat: 'Tất cả', q: '' };
  function lkAll() {
    var list = R.errors.slice();
    (window.COURSE && COURSE.ports || []).forEach(function (p) { list.push({ cat: 'Cổng', code: p[0], name: p[2], meaning: p[1] + ' · ' + p[3], todo: '' }); });
    return list;
  }
  function lkList() {
    var all = lkAll(), q = LK.q.trim().toLowerCase(), out = [];
    all.forEach(function (x) {
      if (LK.cat !== 'Tất cả' && x.cat !== LK.cat) return;
      if (q) { var hay = (x.code + ' ' + x.name + ' ' + x.meaning + ' ' + x.todo).toLowerCase(); if (hay.indexOf(q) < 0) return; }
      out.push(x);
    });
    if (q) out.sort(function (a, b) { return (b.code.toLowerCase() === q) - (a.code.toLowerCase() === q); });
    return out;
  }
  function lkRender() {
    var l = lkList();
    document.getElementById('lk-out').innerHTML = (l.map(function (x) {
      return '<div class="lk"><div class="lk-code"><code>' + esc(x.code) + '</code><span class="pill">' + esc(x.cat) + '</span></div><div class="lk-body"><b>' + esc(x.name) + '</b><p>' + esc(x.meaning) + '</p>' + (x.todo ? '<p class="lk-todo"><b>Làm gì:</b> ' + esc(x.todo) + '</p>' : '') + '</div><button class="markbtn" data-a="lkcopy" data-v="' + esc(x.code + ' — ' + x.name) + '">Chép</button></div>';
    }).join('') || '<p class="hint">Không tìm thấy. Thử từ khoá ngắn hơn, ví dụ “0x80070005”, “4625”, “503”.</p>') + '<p class="hint">' + l.length + ' mục</p>';
  }
  T.reg({
    id: 'lookup', group: 'sys', icon: '🔎', short: 'Tra mã lỗi', title: 'Tra mã lỗi, Event ID & cổng', lv: 1, min: 'Tra cứu', days: [2, 3, 4, 5],
    desc: 'Gõ mã bạn đang gặp (<code>4625</code>, <code>0x80070005</code>, <code>AADSTS50126</code>, <code>503</code>, <code>445</code>…) để biết nghĩa và <b>việc cần làm đầu tiên</b>. Gồm Event ID, màn hình xanh, mã lỗi Windows/Outlook/M365, HTTP, NDR email, cổng dịch vụ.',
    progress: null,
    mount: function (root) {
      var cats = ['Tất cả', 'Event ID', 'BSOD', 'Mã lỗi Windows', 'Outlook & M365', 'HTTP', 'Email (NDR)', 'Cổng'];
      root.innerHTML = '<div class="toolbar"><input id="lk-q" type="search" placeholder="Nhập mã hoặc từ khoá (vd 4625, access denied, 503, 3389)…" autocomplete="off"></div><div class="chips" id="lk-chips">' + cats.map(function (c) { return '<button class="chip ' + (c === LK.cat ? 'on' : '') + '" data-a="lkcat" data-v="' + esc(c) + '">' + esc(c) + '</button>'; }).join('') + '</div><div id="lk-out" class="lk-list"></div>';
      document.getElementById('lk-q').value = LK.q; lkRender();
    },
    ev: function (t, e) {
      if (t === 'input' && e.target.id === 'lk-q') { LK.q = e.target.value; lkRender(); return; }
      var b = e.target.closest('[data-a]'); if (t !== 'click' || !b) return;
      if (b.dataset.a === 'lkcat') { LK.cat = b.dataset.v; [].forEach.call(document.querySelectorAll('#lk-chips .chip'), function (c) { c.classList.toggle('on', c === b); }); lkRender(); }
      else if (b.dataset.a === 'lkcopy') T.copy(b.dataset.v, b);
    }
  });

  /* ================= Cây chẩn đoán ================= */
  var FL = { flow: null, node: null, trail: [] };
  function flDone() { var d = T.stat('flow'); return d.done || (d.done = {}); }
  function flFind(id) { return R.flows.filter(function (f) { return f.id === id; })[0]; }
  function flTrailText() {
    var f = flFind(FL.flow), end = f.n[FL.node];
    return 'Chẩn đoán: ' + f.title + '\n' + FL.trail.map(function (s, i) { return (i + 1) + '. ' + s.q + ' → ' + s.a; }).join('\n') + '\nKết luận: ' + end.t + (end.e === 'esc' ? ' (đã chuyển cấp trên)' : '') + '\nChi tiết: ' + end.d.replace(/<[^>]+>/g, '');
  }
  function flRender() {
    var root = document.getElementById('fl-root'), done = flDone();
    if (!FL.flow) {
      root.innerHTML = '<p class="hint">Chọn tình huống để đi từng bước như một kỹ thuật viên có kinh nghiệm. Cuối cây là kết luận (tự xử lý hay leo thang) và <b>mẫu ghi chú ticket</b>.</p><div class="tgrid">' + R.flows.map(function (f) { return '<button class="tcard g-sys flbtn" data-a="flstart" data-v="' + f.id + '"><span class="ticon">' + f.icon + '</span><div class="tbody"><h3>' + esc(f.title) + '</h3><p>' + (done[f.id] ? '✓ Đã đi hết một nhánh' : 'Chưa thử') + '</p></div></button>'; }).join('') + '</div>';
      return;
    }
    var f = flFind(FL.flow), n = f.n[FL.node], h = '<div class="fl-top"><button class="markbtn" data-a="flhome">← Chọn tình huống khác</button><b>' + f.icon + ' ' + esc(f.title) + '</b></div>';
    if (FL.trail.length) h += '<ol class="fl-trail">' + FL.trail.map(function (s) { return '<li><span>' + esc(s.q) + '</span><b>' + esc(s.a) + '</b></li>'; }).join('') + '</ol>';
    if (n.q) {
      h += '<div class="fl-q"><div class="fl-qt">' + esc(n.q) + '</div><div class="fl-opts">' + n.o.map(function (o, i) { return '<button class="fl-opt" data-a="flpick" data-i="' + i + '">' + esc(o[0]) + '</button>'; }).join('') + '</div></div>';
      if (FL.trail.length) h += '<button class="markbtn" data-a="flback">↩ Quay lại bước trước</button>';
    } else {
      var lab = { fix: ['✅ Tự xử lý được (L1)', 'ok'], esc: ['⬆️ Leo thang', 'warn'], info: ['ℹ️ Hướng xử lý tiếp', ''] }[n.e];
      h += '<div class="verdict ' + lab[1] + ' fl-end"><span class="fl-kind">' + lab[0] + '</span><b>' + esc(n.t) + '</b><span>' + n.d + '</span></div>';
      h += '<h4>Ghi chú vào ticket</h4><pre class="note-pre">' + esc(flTrailText()) + '</pre><div class="field"><button class="btn" data-a="flcopy">📋 Chép ghi chú</button>' + (FL.trail.length ? '<button class="markbtn" data-a="flback">↩ Quay lại</button>' : '') + '<button class="markbtn" data-a="flrestart">↺ Làm lại từ đầu</button></div>';
    }
    root.innerHTML = h;
  }
  T.reg({
    id: 'flow', group: 'sys', icon: '🧭', short: 'Cây chẩn đoán', title: 'Cây chẩn đoán sự cố', lv: 1, min: '3–5′ / cây', days: [1, 2, 3],
    desc: '10 cây quyết định cho sự cố thường gặp: không lên nguồn, không có hình, chậm, mất mạng, máy in, Outlook, đăng nhập, màn hình xanh, Wi-Fi, Teams. Mỗi nhánh kết thúc bằng <b>kết luận + ghi chú ticket</b> để chép đi.',
    progress: function () { return [Object.keys(flDone()).length, R.flows.length]; },
    mount: function (root) { FL = { flow: null, node: null, trail: [] }; root.innerHTML = '<div id="fl-root"></div>'; flRender(); },
    ev: function (t, e) {
      var b = e.target.closest('[data-a]'); if (t !== 'click' || !b) return;
      var a = b.dataset.a, f = FL.flow && flFind(FL.flow);
      if (a === 'flstart') { FL = { flow: b.dataset.v, node: flFind(b.dataset.v).start, trail: [] }; }
      else if (a === 'flhome') FL = { flow: null, node: null, trail: [] };
      else if (a === 'flrestart') FL = { flow: FL.flow, node: f.start, trail: [] };
      else if (a === 'flback') { var last = FL.trail.pop(); FL.node = last.from; }
      else if (a === 'flpick') {
        var n = f.n[FL.node], o = n.o[+b.dataset.i];
        FL.trail.push({ from: FL.node, q: n.q, a: o[0] }); FL.node = o[1];
        if (f.n[FL.node].e) { var d = flDone(); if (!d[f.id]) { d[f.id] = 1; T.save(); } APP.markActive(); }
      }
      else if (a === 'flcopy') { T.copy(flTrailText(), b); return; }
      flRender();
      var top = document.getElementById('fl-root'); if (top && top.getBoundingClientRect().top < 0) top.scrollIntoView({ block: 'start' });
    }
  });

  /* ================= Tính nhanh: chmod / RAID / truyền file ================= */
  var CK = { tab: 'chmod', perm: [6, 4, 4], raid: 5, disks: 4, size: 4, sz: 50, szu: 'GB', sp: 1, spu: 'Gbps', eff: 80 };
  var PRESETS = [['644', 'File thông thường (chủ ghi, người khác đọc)'], ['755', 'Script / thư mục (ai cũng chạy/vào được, chỉ chủ ghi)'], ['600', 'Khoá riêng tư (SSH key) — chỉ chủ'], ['700', 'Thư mục riêng tư — chỉ chủ'], ['664', 'File dùng chung trong nhóm'], ['777', '⚠ Ai cũng ghi được — tránh dùng']];
  function sym(n) { return (n & 4 ? 'r' : '-') + (n & 2 ? 'w' : '-') + (n & 1 ? 'x' : '-'); }
  function chmodHtml() {
    var oct = CK.perm.join(''), who = ['Owner (chủ)', 'Group (nhóm)', 'Others (người khác)'];
    var grid = '<div class="perm-grid"><span></span><b>Read (4)</b><b>Write (2)</b><b>Execute (1)</b>' + who.map(function (w, i) { return '<b>' + w + '</b>' + [4, 2, 1].map(function (bit) { return '<label class="permc"><input type="checkbox" data-a="perm" data-i="' + i + '" data-b="' + bit + '"' + (CK.perm[i] & bit ? ' checked' : '') + '><i></i></label>'; }).join(''); }).join('') + '</div>';
    var risk = oct[2] >= '6' ? '<div class="verdict bad">⚠ Others có quyền ghi — rất rủi ro với file web, script, cấu hình.</div>' : '';
    return '<div class="panel"><h3>Máy tính quyền Linux (chmod)</h3>' + grid + '<div class="result"><div><b>Dạng số (octal)</b><span>' + oct + '</span></div><div><b>Dạng chữ</b><span>-' + CK.perm.map(sym).join('') + '</span></div><div><b>Lệnh</b><span>chmod ' + oct + ' tenfile</span></div></div>' + risk + '<div class="field"><label class="lbl" for="ck-oct" style="margin:0">Hoặc nhập số:</label><input class="in mono" id="ck-oct" value="' + oct + '" maxlength="3" style="width:90px"><button class="markbtn" data-a="ckcopy">Chép lệnh</button></div><h4>Mẫu thường dùng</h4><div class="chips">' + PRESETS.map(function (p) { return '<button class="chip" data-a="preset" data-v="' + p[0] + '" title="' + esc(p[1]) + '">' + p[0] + '</button>'; }).join('') + '</div><p class="hint">Chủ sở hữu (user) • nhóm (group) • người khác (others). Xem <code>ls -l</code>: <code>-rw-r--r--</code> = 644. Đổi chủ: <code>chown user:nhom tenfile</code>.</p></div>';
  }
  var RAIDS = { 0: { n: 'RAID 0 (striping)', min: 2, cap: function (n, s) { return n * s; }, tol: 'Không chịu được hỏng ổ nào (mất 1 ổ = mất hết)', note: 'Nhanh nhưng KHÔNG an toàn. Chỉ dùng cho dữ liệu tạm.' }, 1: { n: 'RAID 1 (mirror)', min: 2, cap: function (n, s) { return s; }, tol: 'Hỏng được n−1 ổ (mỗi ổ là bản sao)', note: 'Đơn giản, an toàn; dung lượng bằng 1 ổ.' }, 5: { n: 'RAID 5', min: 3, cap: function (n, s) { return (n - 1) * s; }, tol: 'Hỏng được 1 ổ', note: 'Cân bằng dung lượng/an toàn. Khi rebuild, ổ thứ hai hỏng = mất dữ liệu.' }, 6: { n: 'RAID 6', min: 4, cap: function (n, s) { return (n - 2) * s; }, tol: 'Hỏng được 2 ổ', note: 'An toàn hơn RAID 5, ghi chậm hơn một chút.' }, 10: { n: 'RAID 10 (1+0)', min: 4, cap: function (n, s) { return n / 2 * s; }, tol: 'Hỏng được 1 ổ mỗi cặp mirror (ít nhất 1 ổ)', note: 'Nhanh và an toàn, tốn 50% dung lượng; số ổ phải chẵn.' } };
  function raidHtml() {
    var r = RAIDS[CK.raid], n = CK.disks, s = CK.size, valid = n >= r.min && (CK.raid !== 10 || n % 2 === 0), cap = valid ? r.cap(n, s) : 0;
    return '<div class="panel"><h3>Tính dung lượng RAID</h3><div class="field"><select class="in" id="rd-lv">' + Object.keys(RAIDS).map(function (k) { return '<option value="' + k + '"' + (+k === CK.raid ? ' selected' : '') + '>' + RAIDS[k].n + '</option>'; }).join('') + '</select><label class="lbl" style="margin:0">Số ổ</label><input class="in" id="rd-n" type="number" min="1" max="24" value="' + n + '" style="width:80px"><label class="lbl" style="margin:0">Dung lượng mỗi ổ (TB)</label><input class="in" id="rd-s" type="number" min="0.1" step="0.5" value="' + s + '" style="width:100px"></div>' +
      (valid ? '<div class="result"><div><b>Dung lượng dùng được</b><span>' + cap.toLocaleString('vi-VN') + ' TB</span></div><div><b>Hiệu suất</b><span>' + Math.round(cap / (n * s) * 100) + '% tổng dung lượng thô</span></div><div><b>Chịu lỗi</b><span>' + r.tol + '</span></div></div>' : '<p class="bad-msg">⚠ ' + r.n + ' cần tối thiểu ' + r.min + ' ổ' + (CK.raid === 10 ? ' và số ổ chẵn' : '') + '.</p>') +
      '<p class="hint">' + r.note + ' <b>RAID không phải là sao lưu</b>: xoá nhầm, mã độc tống tiền, cháy nổ vẫn mất dữ liệu — vẫn cần backup (quy tắc 3-2-1).</p></div>';
  }
  function xferHtml() {
    var sizeB = CK.sz * ({ MB: 1e6, GB: 1e9, TB: 1e12 }[CK.szu]), bps = CK.sp * ({ Mbps: 1e6, Gbps: 1e9, 'MB/s': 8e6 }[CK.spu]) * CK.eff / 100, sec = sizeB * 8 / bps;
    var fmt = function (x) { if (!isFinite(x)) return '—'; var h = Math.floor(x / 3600), m = Math.floor(x % 3600 / 60), s = Math.round(x % 60); return (h ? h + ' giờ ' : '') + (m ? m + ' phút ' : '') + s + ' giây'; };
    var gib = CK.szu === 'TB' ? CK.sz * 1e12 / Math.pow(1024, 3) : null;
    return '<div class="panel"><h3>Thời gian sao chép / tải file</h3><div class="field"><label class="lbl" style="margin:0">Dung lượng</label><input class="in" id="xf-sz" type="number" min="0" step="any" value="' + CK.sz + '" style="width:100px"><select class="in" id="xf-szu">' + ['MB', 'GB', 'TB'].map(function (u) { return '<option' + (u === CK.szu ? ' selected' : '') + '>' + u + '</option>'; }).join('') + '</select><label class="lbl" style="margin:0">Tốc độ</label><input class="in" id="xf-sp" type="number" min="0" step="any" value="' + CK.sp + '" style="width:90px"><select class="in" id="xf-spu">' + ['Mbps', 'Gbps', 'MB/s'].map(function (u) { return '<option' + (u === CK.spu ? ' selected' : '') + '>' + u + '</option>'; }).join('') + '</select><label class="lbl" style="margin:0">Hiệu suất thực tế</label><input class="in" id="xf-eff" type="number" min="10" max="100" value="' + CK.eff + '" style="width:80px">%</div>' +
      '<div class="result"><div><b>Thời gian ước tính</b><span>' + fmt(sec) + '</span></div><div><b>Tốc độ thực</b><span>' + (bps / 8e6).toFixed(1) + ' MB/s</span></div></div>' +
      '<p class="hint"><b>Mbps ≠ MB/s</b>: 1 MB/s = 8 Mbps. Mạng 1 Gbps lý thuyết ≈ 125 MB/s, thực tế ~80–100 MB/s do giao thức và ổ đĩa. Nhà sản xuất tính 1 TB = 1.000 GB (thập phân), Windows hiển thị theo 1024 → ổ 1 TB chỉ còn ~931 GB (≈ 931 GiB).' + (gib ? ' Với ' + CK.sz + ' TB ≈ <b>' + Math.round(gib).toLocaleString('vi-VN') + ' GiB</b> trong Windows.' : '') + '</p></div>';
  }
  function ckRender() {
    document.getElementById('ck-body').innerHTML = T.seg([['chmod', '🔐 chmod'], ['raid', '💽 RAID'], ['xfer', '⏱ Thời gian truyền file']], CK.tab, 'cktab') + (CK.tab === 'chmod' ? chmodHtml() : CK.tab === 'raid' ? raidHtml() : xferHtml());
  }
  T.reg({
    id: 'calc', group: 'sys', icon: '🧰', short: 'Tính nhanh', title: 'Máy tính IT: chmod, RAID, thời gian truyền', lv: 1, min: 'Tra cứu', days: [2, 6],
    desc: 'Ba bộ tính hay gặp khi đi làm và đi phỏng vấn: quyền file Linux (chmod), dung lượng & độ an toàn RAID, thời gian sao chép dữ liệu (Mbps vs MB/s, TB vs GiB).',
    progress: null,
    mount: function (root) { root.innerHTML = '<div id="ck-body"></div>'; ckRender(); },
    ev: function (t, e) {
      var el = e.target, id = el.id;
      if (t === 'change' || t === 'input') {
        if (el.dataset && el.dataset.a === 'perm' && t === 'change') { var i = +el.dataset.i, bit = +el.dataset.b; CK.perm[i] = el.checked ? CK.perm[i] | bit : CK.perm[i] & ~bit; ckRender(); return; }
        if (id === 'ck-oct' && /^[0-7]{3}$/.test(el.value)) { CK.perm = el.value.split('').map(Number); ckRender(); var o = document.getElementById('ck-oct'); o.focus(); o.setSelectionRange(3, 3); return; }
        var m = { 'rd-lv': ['raid', parseInt], 'rd-n': ['disks', parseInt], 'rd-s': ['size', parseFloat], 'xf-sz': ['sz', parseFloat], 'xf-szu': ['szu', String], 'xf-sp': ['sp', parseFloat], 'xf-spu': ['spu', String], 'xf-eff': ['eff', parseFloat] }[id];
        if (m && t === 'change') { var v = m[1](el.value, 10); if (v === v) { CK[m[0]] = v; ckRender(); } }
        return;
      }
      var b = el.closest('[data-a]'); if (t !== 'click' || !b) return;
      if (b.dataset.a === 'cktab') { CK.tab = b.dataset.v; ckRender(); }
      else if (b.dataset.a === 'preset') { CK.perm = b.dataset.v.split('').map(Number); ckRender(); }
      else if (b.dataset.a === 'ckcopy') T.copy('chmod ' + CK.perm.join('') + ' tenfile', b);
    }
  });
})();
