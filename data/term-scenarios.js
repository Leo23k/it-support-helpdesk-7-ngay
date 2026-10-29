// Kịch bản cho "Terminal giả lập". Mỗi kịch bản = một ticket thật + một máy "hỏng" có trạng thái.
// init() trả về trạng thái ban đầu; cmds ghi đè/bổ sung lệnh; actions là hành động ngoài lệnh;
// solved(s) = đã khắc phục; noFix = chỉ cần chẩn đoán rồi leo thang. Lệnh dùng regex trên chuỗi đã hạ chữ thường.
window.TERM = { scenarios: [] };
(function () {
  var add = function (x) { window.TERM.scenarios.push(x); };
  var CORP = { ip: '192.168.1.45', mask: '255.255.255.0', gw: '192.168.1.1', dns: ['192.168.1.10'], dhcpServer: '192.168.1.10', suffix: 'corp.local' };

  add({
    id: 'apipa', cat: 'Mạng', lv: 1, pri: 3, title: 'Cắm dây nhưng “mất mạng”', from: 'Nguyễn An · Kế toán', subject: 'Máy không vào được mạng',
    ticket: '“Em cắm dây mạng rồi mà biểu tượng mạng có dấu chấm than vàng, không vào được gì cả. Hôm qua vẫn bình thường.”',
    init: function () { return { net: { ip: '169.254.87.12', mask: '255.255.0.0', gw: '', dns: [], dhcpServer: '', suffix: '', apipa: true }, canRenew: false, goodNet: Object.assign({}, CORP) }; },
    actions: {
      neighbor: { label: '🙋 Hỏi đồng nghiệp bên cạnh', run: function () { return 'Đồng nghiệp cùng dãy vẫn dùng mạng bình thường. Chỉ máy này (cổng mạng 3F-12) bị.'; } },
      replug: { label: '🔌 Rút/cắm lại cáp', run: function () { return 'Đèn link nhấp nháy rồi sáng lại, Windows báo “Identifying…”. Vẫn chưa có IP hợp lệ.'; } },
      otherport: { label: '🔀 Đổi sang cổng mạng khác', run: function (s) { s.canRenew = true; return 'Cắm sang cổng 3F-13: đèn link xanh. Hãy chạy lại lệnh xin IP (ipconfig /renew).'; } }
    },
    causes: ['Card mạng của laptop bị hỏng driver', 'Máy không nhận được IP từ DHCP nên tự gán 169.254.x.x (APIPA) — lỗi nằm ở đường tới DHCP/cổng switch, không phải DNS hay tài khoản', 'DNS server nội bộ bị lỗi', 'Tài khoản của user bị khoá'], ans: 1,
    why: 'Địa chỉ 169.254.x.x (APIPA) nghĩa là Windows <b>không xin được IP từ DHCP</b> nên tự đặt. Mạng có IP tự gán thì không có gateway/DNS. Đồng nghiệp bên cạnh bình thường ⇒ lỗi cục bộ ở cổng/cáp/VLAN của vị trí này; sau khi đổi cổng, <code>ipconfig /renew</code> nhận lại IP 192.168.1.x.',
    hints: ['Bắt đầu bằng <code>ipconfig /all</code>: nhìn dòng IPv4 Address và DHCP Server.', 'Dải 169.254.0.0/16 là gì? Thử <code>ipconfig /release</code> rồi <code>ipconfig /renew</code>.', 'Nếu /renew vẫn báo “unable to contact your DHCP server”, hãy kiểm tra phần vật lý: rút/cắm cáp, hỏi người bên cạnh, đổi sang cổng khác.', 'Nguyên nhân: máy không xin được IP từ DHCP (APIPA).'],
    solved: function (s) { return !s.net.apipa && s.net.ip.indexOf('192.168.1.') === 0; },
    after: 'IP APIPA ⇒ DHCP không tới được máy. Đã loại trừ lỗi diện rộng (người khác bình thường), sửa ở lớp vật lý và xác nhận bằng cách xin lại IP.',
    note: 'Triệu chứng: máy nhận IP 169.254.87.12 (APIPA), không ra mạng.\nĐã kiểm tra: ipconfig /all, /release, /renew thất bại (không liên lạc được DHCP); đồng nghiệp bên cạnh bình thường.\nNguyên nhân: cổng mạng 3F-12 không cấp được DHCP (nghi sai VLAN/cổng lỗi).\nKhắc phục: chuyển máy sang cổng 3F-13, ipconfig /renew nhận 192.168.1.45, ping gateway OK.\nTheo dõi: đã báo Network kiểm tra cổng 3F-12. Đã xác nhận với user, đóng ticket.'
  });

  add({
    id: 'dns', cat: 'Mạng', lv: 1, pri: 3, title: 'Vào web không được, Zalo vẫn chạy', from: 'Trần Mai · Kinh doanh', subject: 'Chrome báo ERR_NAME_NOT_RESOLVED',
    ticket: '“Chrome không vào được trang nào hết, báo không tìm thấy máy chủ. Nhưng Zalo và Teams vẫn nhắn tin được.”',
    init: function () { return { down: ['192.168.1.10'] }; },
    cmds: [{
      re: /^netsh interface ip(v4)? (set|add) dns/, run: function (s, m, c) {
        var ip = c.raw.match(/(\d+\.\d+\.\d+\.\d+)/);
        if (/source=dhcp/.test(c.low)) { s.net.dns = ['192.168.1.10']; return 'Ok.'; }
        if (!ip) return 'The syntax supplied for this command is not valid. Check help for the correct syntax.';
        s.net.dns = [ip[1]]; return 'Ok.';
      }
    }],
    warn: function (s) { var d = s.net.dns[0]; return d && d !== '192.168.1.10' && d !== '192.168.1.11' ? 'Bạn đang dùng DNS công cộng: web chạy được nhưng tên nội bộ (corp.local) sẽ không phân giải. Chỉ là giải pháp tạm — nên dùng DNS phụ của công ty (192.168.1.11).' : ''; },
    solved: function (s) { return s.net.dns.indexOf('192.168.1.11') >= 0 && !!TERM.api.resolve(s, 'google.com').ip; },
    causes: ['Cáp mạng hoặc Wi-Fi bị hỏng', 'DNS server chính (192.168.1.10) không phản hồi nên không phân giải được tên; kết nối IP vẫn tốt', 'Default gateway bị hỏng', 'Chrome bị lỗi, cần cài lại'], ans: 1,
    why: 'Ping IP (8.8.8.8) được nhưng ping tên thì không ⇒ <b>lỗi phân giải DNS</b>. <code>ping 192.168.1.10</code> timeout cho thấy DNS server chính không phản hồi. Zalo/Teams dùng kết nối đã mở sẵn nên vẫn chạy. Chuyển sang DNS phụ (192.168.1.11) → nslookup hoạt động lại.',
    hints: ['Thử <code>ping 8.8.8.8</code> rồi <code>ping google.com</code> — kết quả khác nhau nói lên điều gì?', '<code>ipconfig /all</code> xem DNS Servers là máy nào, rồi <code>ping</code> thẳng máy đó.', 'Thử hỏi một DNS khác: <code>nslookup google.com 192.168.1.11</code>.', 'Đặt DNS phụ: <code>netsh interface ip set dns "Ethernet" static 192.168.1.11</code>.'],
    after: 'Phân biệt lỗi DNS với lỗi kết nối bằng ping IP vs ping tên; xác định đúng server DNS đang hỏng thay vì sửa trên máy user.',
    note: 'Triệu chứng: không vào được web (ERR_NAME_NOT_RESOLVED), ứng dụng đã kết nối sẵn vẫn chạy.\nKiểm tra: ping 8.8.8.8 OK, ping google.com thất bại; DNS 192.168.1.10 không phản hồi (ping timeout); nslookup google.com 192.168.1.11 OK.\nNguyên nhân: DNS server chính (DC01) không phản hồi.\nKhắc phục tạm: đặt DNS phụ 192.168.1.11 cho adapter. Đã báo Sysadmin kiểm tra DC01 (DNS service). Web vào lại bình thường.'
  });

  add({
    id: 'gateway', cat: 'Mạng', lv: 2, pri: 2, title: 'Cả phòng mất Internet', from: 'Lê Hùng · Kinh doanh', subject: 'Không ra Internet, nội bộ vẫn vào được',
    ticket: '“Từ 8:40 em không vào được web nào, email thì không gửi được. Nhưng mở thư mục chung trên file server vẫn bình thường.”',
    init: function () { return { down: ['192.168.1.1'], extDown: true }; },
    actions: { neighbor: { label: '🙋 Hỏi đồng nghiệp cùng phòng', run: function () { return 'Cả phòng Kinh doanh (12 người) mất Internet từ 8:40. Máy in và file server vẫn dùng được.'; } } },
    noFix: true,
    causes: ['Card mạng của máy user hỏng', 'Sự cố từ default gateway/router hoặc đường ra Internet: ảnh hưởng nhiều người, cần báo Network (L2) ngay', 'User đặt sai DNS', 'Windows Firewall chặn trình duyệt'], ans: 1,
    why: '<code>ping 192.168.1.20</code> (file server) được, <code>ping 192.168.1.1</code> (gateway) timeout ⇒ máy <b>vẫn có mạng LAN nhưng không tới gateway</b>. <code>nslookup google.com</code> trả “Server failed” vì DC không ra Internet để hỏi tiếp. Nhiều người cùng bị ⇒ không sửa trên từng máy mà báo Network.',
    hints: ['<code>ipconfig /all</code> để biết gateway là IP nào; sau đó <code>ping</code> gateway.', 'So sánh: <code>ping 192.168.1.20</code> (nội bộ) với <code>ping 8.8.8.8</code> (Internet).', '<code>tracert 8.8.8.8</code> dừng ngay hop 1 nói lên điều gì? Hãy hỏi thêm người xung quanh.', 'Gateway/đường ra Internet bị sự cố — báo Network.'],
    after: 'Lỗi ngay hop đầu tiên của đường đi và ảnh hưởng nhiều người ⇒ nằm ngoài máy user. L1 xác nhận phạm vi, thu thập bằng chứng và chuyển Network với mức ưu tiên cao thay vì thử mọi thứ trên máy user.',
    note: 'Triệu chứng: mất Internet từ 8:40; nội bộ (file server, máy in) vẫn OK. Phạm vi: toàn bộ phòng Kinh doanh (12 người).\nKiểm tra: IP hợp lệ 192.168.1.45; ping 192.168.1.20 OK; ping gateway 192.168.1.1 timeout; tracert 8.8.8.8 timeout ngay hop 1; nslookup google.com: Server failed.\nKết luận: sự cố gateway/router ra Internet. Đã chuyển Network team (P2), đính kèm kết quả lệnh. Báo user chờ cập nhật.'
  });

  add({
    id: 'wrongip', cat: 'Mạng', lv: 2, pri: 3, title: 'Laptop mang từ nhà vào, không vào được gì', from: 'Phạm Dũng · Nhân sự', subject: 'Cắm dây rồi mà vẫn không có mạng',
    ticket: '“Em dùng laptop này ở nhà bình thường, hôm nay mang vào công ty cắm dây mạng thì báo kết nối nhưng không vào được gì.”',
    init: function () { return { net: { ip: '192.168.100.50', mask: '255.255.255.0', gw: '192.168.100.1', dns: ['192.168.100.1'], dhcp: false, dhcpServer: '', suffix: '' }, down: ['192.168.100.1'], arpFail: true, goodNet: Object.assign({}, CORP), canRenew: true }; },
    cmds: [
      { re: /^netsh interface ip(v4)? set address/, run: function (s, m, c) { if (!/source=dhcp|dhcp/.test(c.low)) return 'Ok.'; var d = s.net.dns; Object.assign(s.net, s.goodNet); s.net.dns = d; s.net.dhcp = true; return 'Ok.'; } },
      { re: /^netsh interface ip(v4)? set dns/, run: function (s, m, c) { if (/source=dhcp/.test(c.low)) { s.net.dns = ['192.168.1.10']; return 'Ok.'; } var ip = c.raw.match(/(\d+\.\d+\.\d+\.\d+)/); if (ip) s.net.dns = [ip[1]]; return 'Ok.'; } }
    ],
    solved: function (s) { return s.net.dhcp && s.net.ip.indexOf('192.168.1.') === 0 && s.net.dns[0] === '192.168.1.10'; },
    causes: ['DHCP server của công ty bị hỏng', 'Máy còn cấu hình IP tĩnh của mạng ở nhà (192.168.100.x), không cùng dải với mạng công ty — cần chuyển về nhận IP tự động (DHCP)', 'Cáp mạng đứt', 'Tài khoản domain bị khoá'], ans: 1,
    why: '<code>ipconfig /all</code> cho thấy <b>DHCP Enabled: No</b> và IP 192.168.100.50 — dải mạng ở nhà. Gateway 192.168.100.1 không tồn tại ở công ty nên ping “Destination host unreachable”. <code>ipconfig /renew</code> báo “no adapter is in the state permissible” vì DHCP đang tắt. Phải bật DHCP cho cả IP <u>và</u> DNS.',
    hints: ['<code>ipconfig /all</code>: để ý dòng “DHCP Enabled”, IP và DNS.', 'Thử <code>ipconfig /renew</code> — thông báo lỗi nói gì? Đồng thời ping gateway 192.168.100.1.', 'Bật DHCP: <code>netsh interface ip set address name="Ethernet" source=dhcp</code>', 'Đừng quên DNS: <code>netsh interface ip set dns name="Ethernet" source=dhcp</code> (DNS tĩnh vẫn còn).'],
    after: 'IP tĩnh còn sót từ nơi khác là nguyên nhân kinh điển khi laptop đổi mạng. Phải chuyển cả IP lẫn DNS về DHCP, sau đó kiểm tra lại bằng ipconfig /all và ping gateway.',
    note: 'Triệu chứng: laptop mang từ nhà vào không có mạng.\nNguyên nhân: adapter dùng IP tĩnh 192.168.100.50/24, gateway 192.168.100.1, DNS 192.168.100.1 (mạng nhà).\nKhắc phục: chuyển IP và DNS sang DHCP (netsh ... source=dhcp). Máy nhận 192.168.1.x, ping gateway/DNS OK, truy cập web & file server OK.\nĐã hướng dẫn user: khi đổi mạng nên để IP tự động.'
  });

  add({
    id: 'vpndns', cat: 'Mạng', lv: 2, pri: 3, title: 'VPN: Teams chạy, file server không vào được', from: 'Võ Lan · Marketing', subject: '\\\\fileserver báo không tìm thấy đường dẫn',
    ticket: '“Em làm việc ở nhà qua VPN. Web và Teams chạy tốt nhưng mở \\\\fileserver\\data thì báo Windows cannot find the network path.”',
    init: function () { return { net: { ip: '10.8.0.14', mask: '255.255.255.0', gw: '10.8.0.1', dns: ['8.8.8.8'], dhcpServer: '10.8.0.1', suffix: '', adapter: 'VPN (Corp)' } }; },
    cmds: [{ re: /^netsh interface ip(v4)? set dns/, run: function (s, m, c) { var ip = c.raw.match(/(\d+\.\d+\.\d+\.\d+)/); s.net.dns = ip ? [ip[1]] : ['192.168.1.10']; if (ip && ip[1] === '192.168.1.10') s.net.suffix = 'corp.local'; return 'Ok.'; } }],
    actions: { vpn: { label: '🔁 Ngắt rồi kết nối lại VPN', run: function (s) { s.net.dns = ['192.168.1.10', '192.168.1.11']; s.net.suffix = 'corp.local'; return 'VPN kết nối lại, máy nhận DNS nội bộ 192.168.1.10, 192.168.1.11 từ VPN server.'; } } },
    solved: function (s) { return !!TERM.api.resolve(s, 'fileserver').ip; },
    causes: ['File server bị tắt', 'VPN không đẩy DNS nội bộ xuống nên máy dùng DNS công cộng (8.8.8.8), không phân giải được tên nội bộ', 'Tài khoản của user bị khoá', 'Gateway của VPN bị hỏng'], ans: 1,
    why: 'Ping thẳng IP <code>192.168.1.20</code> được nhưng <code>ping fileserver</code> không phân giải ⇒ lỗi <b>DNS</b>. <code>ipconfig /all</code> cho thấy DNS = 8.8.8.8: DNS công cộng không biết tên nội bộ (<i>corp.local</i>). Kết nối lại VPN (hoặc đặt DNS nội bộ cho adapter VPN) để máy nhận DNS công ty.',
    hints: ['<code>ping fileserver</code> và <code>ping 192.168.1.20</code> — khác nhau thế nào?', '<code>ipconfig /all</code>: DNS của adapter VPN là máy nào?', '<code>nslookup fileserver.corp.local 192.168.1.10</code> hoạt động không? Từ đó rút ra gì?', 'Dùng nút “Ngắt rồi kết nối lại VPN” hoặc đặt lại DNS về 192.168.1.10.'],
    after: 'Truy cập được bằng IP nhưng không bằng tên là dấu hiệu rõ nhất của lỗi DNS. Với VPN, cần kiểm tra DNS được cấp bởi VPN chứ không chỉ kết nối.',
    note: 'Triệu chứng: qua VPN vẫn vào web/Teams, nhưng \\\\fileserver báo không tìm thấy đường dẫn.\nKiểm tra: ping 192.168.1.20 OK, ping fileserver không phân giải; DNS adapter VPN = 8.8.8.8.\nNguyên nhân: VPN không cấp DNS nội bộ.\nKhắc phục: ngắt/kết nối lại VPN, nhận DNS 192.168.1.10/11; truy cập \\\\fileserver\\data OK. Nếu tái diễn: báo Network kiểm tra cấu hình DNS push trên VPN.'
  });

  add({
    id: 'rogue', cat: 'Mạng', lv: 3, pri: 2, title: 'IP lạ 192.168.0.x, không thấy server nội bộ', from: 'Đỗ Thảo · Thiết kế', subject: 'Có mạng nhưng không vào được phần mềm nội bộ',
    ticket: '“Em vào web được nhưng không mở được intranet và thư mục chung. Từ sáng nay thôi, hôm qua vẫn bình thường.”',
    init: function () {
      return {
        net: { ip: '192.168.0.103', mask: '255.255.255.0', gw: '192.168.0.1', dns: ['192.168.0.1'], dhcpServer: '192.168.0.1', suffix: '' }, internalNx: true,
        arpOut: 'Interface: 192.168.0.103 --- 0x7\n  Internet Address      Physical Address      Type\n  192.168.0.1           c0-4a-00-3e-91-d2     dynamic\n  192.168.0.255         ff-ff-ff-ff-ff-ff     static',
        reach: function (ip) { return /^192\.168\.1\./.test(ip) ? 'timeout' : undefined; }
      };
    },
    actions: {
      neighbor: { label: '🙋 Hỏi đồng nghiệp cùng dãy bàn', run: function () { return 'Hai người cạnh bàn cũng nhận IP 192.168.0.x từ sáng nay. Có người vừa cắm một “router wifi mini” mang từ nhà vào dưới gầm bàn 3F-14.'; } },
      replug: { label: '🔌 Rút/cắm lại cáp', run: function () { return 'Cắm lại cáp, máy lại nhận đúng IP 192.168.0.x từ cùng DHCP server lạ.'; } }
    },
    noFix: true,
    causes: ['DNS server của công ty bị hỏng', 'Có thiết bị DHCP lạ (rogue DHCP, ví dụ router cá nhân) trong mạng văn phòng đang cấp IP 192.168.0.x — cần báo Network/Security truy tìm và gỡ', 'Máy user bị nhiễm virus', 'Gateway công ty bị hỏng'], ans: 1,
    why: 'Mạng công ty dùng <b>192.168.1.0/24</b>, DHCP đúng là 192.168.1.10. Máy lại nhận IP 192.168.0.103 từ <b>DHCP server 192.168.0.1</b> (MAC hãng TP-Link) — một router lạ cắm vào mạng văn phòng ⇒ <i>rogue DHCP</i>. Nhiều người cùng bị, không tự khắc phục trên máy.',
    hints: ['<code>ipconfig /all</code>: so sánh IP và dòng “DHCP Server” với dải mạng công ty (192.168.1.x).', 'Thử <code>ping 192.168.1.10</code> và <code>arp -a</code> (xem MAC của gateway).', 'Hỏi những người xung quanh xem có ai bị tương tự.', 'Có một DHCP server lạ (192.168.0.1) đang cấp IP trong mạng văn phòng.'],
    after: 'Rogue DHCP làm nhiều máy mất kết nối nội bộ. L1 thu thập bằng chứng (IP, DHCP server, MAC, vị trí bàn) và chuyển Network/Security để tìm thiết bị qua switch (DHCP snooping, MAC table) — không tự rút dây của người khác.',
    note: 'Triệu chứng: vào web được, không vào intranet/file server.\nBằng chứng: IP 192.168.0.103, gateway & DNS & DHCP server = 192.168.0.1 (MAC c0-4a-00-3e-91-d2), khác dải công ty 192.168.1.0/24; ping 192.168.1.10 timeout.\nPhạm vi: ít nhất 3 máy dãy bàn 3F-12..14; nghi router cá nhân dưới bàn 3F-14.\nĐã chuyển Network/Security (P2) kèm bằng chứng. Hướng dẫn user tạm thời dùng Wi-Fi công ty trong lúc chờ.'
  });

  add({
    id: 'smbperm', cat: 'Tài khoản', lv: 2, pri: 3, title: 'Thư mục chung báo “Access is denied”', from: 'Nguyễn An · Kế toán', subject: 'Không mở được \\\\fileserver\\ketoan',
    ticket: '“Em mới được điều chuyển sang phòng Kế toán tuần trước. Mở \\\\fileserver\\ketoan thì báo Access is denied. Mạng thì vẫn bình thường.”',
    init: function () { return { groups: ['Domain Users', 'GG_All_Staff', 'VPN_Users'] }; },
    cmds: [
      { re: /^net use \\\\fileserver(\.corp\.local)?\\ketoan/, run: function (s) { return s.added && s.tokenFresh ? 'The command completed successfully.' : 'System error 5 has occurred.\n\nAccess is denied.'; } },
      { re: /^get-adprincipalgroupmembership nguyen\.an|^get-aduser nguyen\.an.*memberof/, run: function (s) { var g = ['Domain Users', 'GG_All_Staff', 'VPN_Users'].concat(s.added ? ['GG_KeToan_Share'] : []); return 'distinguishedName                                 name\n-----------------                                 ----\n' + g.map(function (x) { return 'CN=' + x + ',OU=Groups,DC=corp,DC=local   ' + x; }).join('\n'); } },
      { re: /^get-adgroupmember (-identity )?gg_ketoan_share/, run: function (s) { return 'name         SamAccountName\n----         --------------\nLê Thị Hạnh  le.hanh\nVũ Minh      vu.minh' + (s.added ? '\nNguyễn An    nguyen.an' : ''); } },
      { re: /^(add-adgroupmember|net group)\b.*domain admins/, run: function (s) { s.violation = true; return ''; } },
      { re: /^add-adgroupmember\b.*(gg_ketoan_share)|^net group gg_ketoan_share.*\/add/, run: function (s) { if (!s.approved) s.violation = true; s.added = true; return ''; } }
    ],
    actions: {
      approve: { label: '📨 Xin phê duyệt (Trưởng phòng Kế toán)', run: function (s) { s.approved = true; return 'Chị Hạnh (Trưởng phòng Kế toán) trả lời trong ticket: “Đồng ý cấp quyền thư mục Kế toán cho An.” — đã đính kèm vào ticket.'; } },
      relogin: { label: '🔓 Nhờ user đăng xuất / đăng nhập lại', run: function (s) { if (s.added) { s.tokenFresh = true; if (s.groups.indexOf('GG_KeToan_Share') < 0) s.groups.push('GG_KeToan_Share'); return 'User đăng nhập lại: token mới đã chứa nhóm GG_KeToan_Share.'; } return 'User đăng nhập lại — nhóm quyền vẫn như cũ vì chưa ai thêm vào nhóm.'; } }
    },
    warn: function (s) { return s.violation ? 'Bạn đã cấp quyền khi chưa có phê duyệt của chủ dữ liệu (hoặc cấp nhóm quá rộng). Vi phạm nguyên tắc least privilege & quy trình — bấm “Làm lại” để thử lại đúng quy trình.' : ''; },
    solved: function (s) { return !!(s.approved && s.added && s.tokenFresh && !s.violation); },
    causes: ['File server bị lỗi mạng', 'User chưa nằm trong nhóm bảo mật được cấp quyền thư mục (lỗi phân quyền — không phải lỗi mạng)', 'DNS không phân giải được tên fileserver', 'Ổ đĩa của file server đã đầy'], ans: 1,
    why: 'Lỗi <b>5 “Access is denied”</b> khác lỗi 53 “network path not found”: mạng/DNS đã thông, server trả lời nhưng từ chối quyền. <code>whoami /groups</code> không có <i>GG_KeToan_Share</i>. Cấp quyền cần <b>phê duyệt của chủ dữ liệu</b>, thêm user vào nhóm (không cấp quyền trực tiếp), rồi user phải đăng xuất/đăng nhập để nhận token nhóm mới.',
    hints: ['Phân biệt lỗi: <code>Test-NetConnection fileserver.corp.local -Port 445</code> (mạng) với <code>net use \\\\fileserver.corp.local\\ketoan</code> (quyền).', '<code>whoami /groups</code> — user thuộc nhóm nào? So với <code>Get-ADGroupMember GG_KeToan_Share</code>.', 'Trước khi sửa: xin phê duyệt của Trưởng phòng/chủ dữ liệu (nút hành động).', 'Thêm vào nhóm: <code>Add-ADGroupMember -Identity GG_KeToan_Share -Members nguyen.an</code>, rồi nhờ user đăng nhập lại.'],
    after: 'Phân quyền theo nhóm, có phê duyệt, ghi vào ticket. Thay đổi nhóm chỉ có hiệu lực sau khi user đăng nhập lại (Kerberos token).',
    note: 'Yêu cầu/sự cố: user mới chuyển sang Kế toán không mở được \\\\fileserver\\ketoan (Access denied, lỗi 5).\nKiểm tra: mạng/DNS/port 445 OK; whoami /groups thiếu GG_KeToan_Share.\nPhê duyệt: Trưởng phòng Kế toán (Lê Thị Hạnh) đồng ý trong ticket.\nThực hiện: thêm nguyen.an vào nhóm GG_KeToan_Share; user đăng xuất/đăng nhập lại; net use thành công.'
  });

  add({
    id: 'malware', cat: 'Windows', lv: 3, pri: 2, title: 'Máy chậm, quạt kêu to bất thường', from: 'Hoàng Nam · Kế toán', subject: 'Laptop rất chậm từ hôm qua',
    ticket: '“Máy chậm khủng khiếp, quạt kêu suốt, pin tụt nhanh. Em có tải một phần mềm vẽ miễn phí hôm qua nhưng không nhớ rõ.”',
    init: function () {
      return {
        user: 'hoang.nam', host: 'PC-ACC-021', pid: 5120,
        procs: [['System Idle Process', 0, 8], ['System', 4, 144, 12], ['explorer.exe', 4120, 142300, 40], ['chrome.exe', 8812, 256400, 220], ['OUTLOOK.EXE', 6212, 198700, 90], ['svchost.exe', 1012, 28500, 14], ['svch0st.exe', 5120, 88400, 5400], ['MsMpEng.exe', 3321, 224100, 55]]
      };
    },
    cmds: [
      { re: /svch0st.*(path|executablepath)|(path|executablepath).*svch0st/, run: function () { return 'ExecutablePath\nC:\\Users\\hoang.nam\\AppData\\Roaming\\Microsoft\\svch0st.exe\n\n(svchost thật nằm ở C:\\Windows\\System32\\svchost.exe)'; } },
      { re: /^netstat/, run: function (s) { var p = s.pid; return 'Active Connections\n\n  Proto  Local Address          Foreign Address        State           PID\n  TCP    192.168.1.61:50712     203.0.113.77:3333      ESTABLISHED     ' + p + '\n  TCP    192.168.1.61:50321     142.250.199.14:443     ESTABLISHED     8812\n  TCP    192.168.1.61:50400     192.168.1.20:445       ESTABLISHED     4'; } },
      { re: /^schtasks/, run: function () { return 'TaskName                                 Next Run Time          Status\n======================================== ====================== ===============\nMicrosoft Edge Update                    28/10/2026 9:00:00 AM  Ready\nOneDriveUpdateHelper                     28/10/2026 8:55:00 AM  Ready   <- chạy C:\\Users\\hoang.nam\\AppData\\Roaming\\Microsoft\\svch0st.exe\nGoogleUpdateTaskMachineCore              28/10/2026 10:30:00 AM Ready'; } },
      { re: /^taskkill .*(svch0st|5120)/, run: function (s) { s.respawned = true; s.pid = 6244; s.procs.forEach(function (p) { if (p[0] === 'svch0st.exe') p[1] = 6244; }); return 'SUCCESS: The process "svch0st.exe" with PID 5120 has been terminated.\n(10 giây sau, tiến trình tự xuất hiện lại với PID 6244 — có cơ chế tự khởi động lại.)'; } },
      { re: /^(del|erase|remove-item)\b.*svch0st/, run: function (s) { s.tampered = true; return ''; } }
    ],
    actions: {
      ask: { label: '❓ Hỏi user đã cài gì hôm qua', run: function () { return 'User: “Em tải bản crack phần mềm vẽ từ một trang web lạ, chạy file setup xong thì không thấy gì xảy ra.”'; } },
      isolate: { label: '🔌 Cô lập: rút cáp/tắt Wi-Fi (giữ máy bật)', run: function (s) { s.isolated = true; return 'Đã ngắt mạng máy này nhưng vẫn giữ nguyên máy đang bật để Security điều tra. Ghi lại thời điểm và báo ticket.'; } }
    },
    warn: function (s) { return s.tampered ? 'Bạn đã xoá file khả nghi — làm mất bằng chứng điều tra. Quy trình đúng: cô lập và giữ nguyên hiện trạng cho Security.' : ''; },
    solved: function (s) { return !!s.isolated && !s.tampered; },
    causes: ['Windows cần cài lại vì hệ điều hành bị lỗi nặng', 'Nghi nhiễm mã độc (miner): tiến trình giả mạo svchost (svch0st) chạy từ thư mục AppData, kết nối ra ngoài — phải cô lập máy và chuyển Security, không tự xoá', 'RAM không đủ, chỉ cần thêm RAM', 'Chrome mở quá nhiều tab'], ans: 1,
    why: 'Tên <b>svch0st.exe</b> (số 0 thay chữ o) ngốn CPU 5400 giây, chạy từ <i>AppData\\Roaming</i> thay vì <i>System32</i>, kết nối tới 203.0.113.77:3333 (cổng pool đào tiền) và có scheduled task duy trì. Diệt tiến trình thì nó tự sống lại. Đây là sự cố bảo mật: cô lập máy, giữ bằng chứng, chuyển Security.',
    hints: ['<code>tasklist</code> hoặc <code>Get-Process</code>: tiến trình nào ăn CPU nhiều nhất? Tên có gì lạ?', 'Kiểm tra đường dẫn thật: <code>wmic process where "name=\'svch0st.exe\'" get executablepath</code> và kết nối: <code>netstat -ano</code>.', 'Thử <code>taskkill /pid 5120 /f</code> rồi kiểm tra lại — chuyện gì xảy ra? Xem <code>schtasks</code>.', 'Đừng xoá file. Cô lập máy khỏi mạng và chuyển Security.'],
    after: 'Với dấu hiệu mã độc: ưu tiên ngăn lây lan (cô lập), giữ nguyên bằng chứng, báo Security. Không tự xoá file hay “dọn” khi chưa có chỉ đạo.',
    note: 'Triệu chứng: máy chậm, quạt kêu, pin tụt sau khi user chạy file setup crack hôm qua.\nBằng chứng: tiến trình svch0st.exe (PID 5120) CPU rất cao, chạy từ %AppData%\\Roaming\\Microsoft, kết nối 203.0.113.77:3333, có scheduled task OneDriveUpdateHelper; taskkill xong tự khởi động lại.\nHành động: đã ngắt mạng máy (giữ nguyên trạng), không xoá file. Chuyển Security (P2) kèm bằng chứng; user không dùng máy cho đến khi có thông báo, và đổi mật khẩu từ thiết bị khác.'
  });

  add({
    id: 'diskfull', cat: 'Windows', lv: 1, pri: 3, title: 'Ổ C: đầy, không lưu được file', from: 'Bùi Quân · Kế hoạch', subject: 'Windows báo hết dung lượng',
    ticket: '“Em lưu file Excel thì báo Not enough disk space, Outlook cũng báo lỗi. Em không biết cái gì chiếm chỗ.”',
    init: function () {
      return {
        user: 'bui.quan', host: 'PC-PLN-009', disk: { c: { total: 237, free: 0.4 } },
        fs: {
          'c:\\users\\bui.quan\\downloads': ' Volume in drive C is OS\n Directory of C:\\Users\\bui.quan\\Downloads\n\n12/09/2026  09:12 AM     6,676,000,000 Win11_23H2_English_x64.iso\n02/03/2026  04:40 PM    22,975,000,000 backup_2023.zip\n20/10/2026  11:02 AM        84,000,000 setup_old.exe\n               3 File(s) 29,735,000,000 bytes',
          'c:\\users\\bui.quan\\appdata\\local\\temp': ' Directory of C:\\Users\\bui.quan\\AppData\\Local\\Temp\n\n            4,812 File(s)  3,328,000,000 bytes (rác tạm, có thể xoá)',
          'c:\\windows\\temp': ' Directory of C:\\Windows\\Temp\n\n              311 File(s)    860,000,000 bytes'
        }
      };
    },
    cmds: [
      { re: /^(del|erase|remove-item)\b/, run: function (s, m, c) {
        var d = s.disk.c, l = c.low;
        if (/system32|winsxs|\\windows\\(?!temp)/.test(l)) return 'Access is denied.';
        if (/win11_23h2/.test(l)) { if (!s.iso) { s.iso = 1; d.free += 6.2; } return ''; }
        if (/backup_2023/.test(l)) { if (!s.asked) s.violation = true; if (!s.zip) { s.zip = 1; d.free += 21.4; } return ''; }
        if (/setup_old/.test(l)) { if (!s.setup) { s.setup = 1; d.free += 0.08; } return ''; }
        if (/%temp%|appdata\\local\\temp/.test(l)) { if (!s.temp) { s.temp = 1; d.free += 3.1; } return ''; }
        if (/windows\\temp/.test(l)) { if (!s.wtemp) { s.wtemp = 1; d.free += 0.8; } return ''; }
        return 'Could Not Find ' + c.raw.replace(/^\S+\s+(\/\w\s+)*/, '');
      } },
      { re: /^cleanmgr/, run: function (s) { if (!s.clean) { s.clean = 1; s.disk.c.free += 1.2; } return 'Disk Cleanup: đã dọn 1,2 GB (Windows Update cache, thùng rác).'; } },
      { re: /^clear-recyclebin/, run: function (s) { if (!s.bin) { s.bin = 1; s.disk.c.free += 0.6; } return ''; } }
    ],
    actions: { ask: { label: '💬 Hỏi user có cần file lớn trong Downloads không', run: function (s) { s.asked = true; return 'User: “File ISO Windows thì xoá được. Còn backup_2023.zip là bản sao lưu DUY NHẤT dữ liệu năm ngoái, đừng xoá — chuyển lên file server giúp em.”'; } } },
    warn: function (s) { return s.violation ? 'Bạn đã xoá backup_2023.zip khi user chưa đồng ý — đó là bản sao lưu duy nhất. Bấm “Làm lại” để thử đúng quy trình (hỏi user trước khi xoá dữ liệu cá nhân).' : ''; },
    solved: function (s) { return s.disk.c.free >= 10 && !s.violation; },
    causes: ['Ổ cứng bị hỏng, cần thay', 'Ổ C: đầy do file rác tạm và file tải về dung lượng lớn; dọn đúng chỗ, hỏi user trước khi xoá dữ liệu cá nhân', 'Windows Update bị lỗi', 'Máy nhiễm virus làm đầy ổ đĩa'], ans: 1,
    why: 'Còn trống chỉ 0,4 GB trên 237 GB. Lớn nhất là thư mục Downloads (ISO, file zip) và thư mục Temp. Rác tạm (Temp, Windows\\Temp, Disk Cleanup) xoá an toàn; file cá nhân (đặc biệt bản sao lưu duy nhất) <b>phải hỏi user</b> trước khi xoá hoặc chuyển.',
    hints: ['<code>fsutil volume diskfree c:</code> xem còn bao nhiêu.', 'Xem thư mục nào lớn: <code>dir C:\\Users\\bui.quan\\Downloads</code>, <code>dir C:\\Windows\\Temp</code>, <code>dir %temp%</code>.', 'Rác tạm xoá an toàn: <code>del /q /f /s %temp%\\*</code>. File cá nhân: dùng nút “Hỏi user” trước.', 'Cần có ít nhất 10 GB trống: dọn Temp + ISO + Windows\\Temp; không động tới System32.'],
    after: 'Dọn từ an toàn nhất (rác tạm) đến cần xin phép (dữ liệu cá nhân). Không bao giờ xoá trong System32/WinSxS để “lấy chỗ”. Với bản sao lưu duy nhất: chuyển lên nơi lưu trữ thay vì xoá.',
    note: 'Triệu chứng: không lưu được file, ổ C: còn 0,4 GB.\nPhân tích: Temp ~3,1 GB, Windows\\Temp ~0,8 GB, Downloads: ISO Windows 6,2 GB + backup_2023.zip 21,4 GB.\nThực hiện: xoá Temp/Windows\\Temp và ISO (user đồng ý); giữ backup_2023.zip, hẹn chuyển lên file server. Ổ C: còn ~10,5 GB.\nKhuyến nghị: thiết lập Storage Sense, hướng dẫn user không để file lớn trong Downloads.'
  });

  add({
    id: 'spooler', cat: 'In ấn', lv: 2, pri: 3, title: 'Lệnh in treo, máy in không in', from: 'Mai Hương · Nhân sự', subject: 'In hợp đồng mãi không ra',
    ticket: '“Em in từ sáng, trong hàng đợi có 3 lệnh in báo Error - Printing, xoá cũng không được. Người khác in máy HP-F2 vẫn ra bình thường.”',
    init: function () { return { user: 'mai.huong', host: 'PC-HR-004', queue: 3, cleared: false }; },
    cmds: [
      { re: /^get-printjob/, run: function (s) { if (s.svc.spooler !== 'RUNNING') return 'Get-PrintJob : The Print Spooler service is not running.'; if (!s.queue) return ''; return 'Id  JobStatus         DocumentName         Size  Submitted\n--  ---------         ------------         ----  ---------\n17  Error - Printing  HopDong_Q4.docx       412K  8:21:07 AM\n18  Error - Printing  HopDong_Q4.docx       412K  8:23:40 AM\n19  Error - Printing  HopDong_Q4_final.pdf  1.2M  8:30:12 AM'; } },
      { re: /^get-printer/, run: function (s) { if (s.svc.spooler !== 'RUNNING') return 'Get-Printer : The Print Spooler service is not running.'; return 'Name                 ComputerName       Type    DriverName               PrinterStatus  JobCount\n----                 ------------       ----    ----------               -------------  --------\nHP-F2                \\\\printserver      Connection  HP Universal Printing PCL 6  Normal     ' + s.queue; } },
      { re: /^(dir|ls|get-childitem)\b.*spool\\printers/, run: function (s) { return s.queue ? ' Directory of C:\\Windows\\System32\\spool\\PRINTERS\n\n00017.SPL   00017.SHD   00018.SPL   00018.SHD   00019.SPL   00019.SHD\n               6 File(s)  3,208,964 bytes' : 'File Not Found'; } },
      { re: /^(del|erase|remove-item)\b.*spool\\printers/, run: function (s) { if (s.svc.spooler === 'RUNNING') return 'The process cannot access the file because it is being used by another process.'; s.queue = 0; s.cleared = true; return ''; } }
    ],
    actions: {
      neighbor: { label: '🙋 Hỏi đồng nghiệp in thử HP-F2', run: function () { return 'Đồng nghiệp in trang thử qua HP-F2 từ máy của họ: in ra bình thường. Máy in có giấy, mực, không báo lỗi.'; } },
      testprint: { label: '🖨️ In thử trang test', run: function (s) { return s.svc.spooler === 'RUNNING' && s.cleared ? 'Trang thử in ra ngay lập tức. ✔' : 'Lệnh in thử cũng treo ở trạng thái “Error - Printing”.'; } }
    },
    solved: function (s) { return s.svc.spooler === 'RUNNING' && s.cleared; },
    causes: ['Máy in HP-F2 hết mực hoặc kẹt giấy', 'Hàng đợi in cục bộ trên máy user bị kẹt (Print Spooler giữ job lỗi) — dừng spooler, xoá file trong thư mục PRINTERS, bật lại', 'Print server (\\\\printserver) bị sập', 'Driver máy in sai phiên bản'], ans: 1,
    why: 'Người khác in được ⇒ máy in và print server ổn; chỉ máy user có job lỗi. Không thể xoá job khi spooler đang giữ file, nên quy trình chuẩn: <code>net stop spooler</code> → xoá file trong <code>%systemroot%\\System32\\spool\\PRINTERS</code> → <code>net start spooler</code>. Chỉ restart service mà không xoá file thì job lỗi vẫn còn.',
    hints: ['<code>Get-Printer</code> và <code>Get-PrintJob -PrinterName "HP-F2"</code> cho thấy gì? Hỏi đồng nghiệp xem họ in được không.', 'Thử xoá file hàng đợi: <code>dir C:\\Windows\\System32\\spool\\PRINTERS</code>, rồi <code>del /q /f C:\\Windows\\System32\\spool\\PRINTERS\\*</code> — vì sao bị chặn?', 'Phải dừng spooler trước: <code>net stop spooler</code>.', 'Thứ tự: net stop spooler → del … PRINTERS\\* → net start spooler → in thử.'],
    after: 'Fix kinh điển ở helpdesk: dừng spooler, dọn thư mục PRINTERS, bật lại. Luôn xác định phạm vi trước (chỉ 1 máy hay cả phòng) để biết lỗi ở máy, print server hay máy in.',
    note: 'Triệu chứng: 3 lệnh in treo “Error - Printing” trên HP-F2; người khác in bình thường.\nKiểm tra: Get-PrintJob thấy 3 job lỗi; xoá không được khi spooler chạy.\nKhắc phục: net stop spooler → xoá file trong spool\\PRINTERS → net start spooler. In trang thử thành công.\nNguyên nhân: hàng đợi in cục bộ bị kẹt (file spool lỗi). Đã đóng ticket sau khi user xác nhận.'
  });

  add({
    id: 'acctlock', cat: 'Tài khoản', lv: 2, pri: 3, title: 'Tài khoản bị khoá hoài dù đã mở khoá', from: 'Nguyễn An · Kế toán', subject: 'Cứ vài phút lại bị khoá tài khoản',
    ticket: '“Hôm qua em đổi mật khẩu theo thông báo. Sáng nay đăng nhập báo tài khoản bị khoá. IT mở khoá rồi, được 10 phút lại khoá.”',
    init: function () { return { locked: true, bad: 7 }; },
    cmds: [
      { re: /^get-aduser nguyen\.an/, run: function (s) { return 'BadLogonCount          : ' + s.bad + '\nLastBadPasswordAttempt : 28/10/2026 8:44:10 AM\nLockedOut              : ' + (s.locked ? 'True' : 'False') + '\nName                   : Nguyễn An\nSamAccountName         : nguyen.an\nPasswordLastSet        : 27/10/2026 5:12:09 PM'; } },
      { re: /^search-adaccount -lockedout/, run: function (s) { return s.locked ? 'Name       SamAccountName  Enabled\n----       --------------  -------\nNguyễn An  nguyen.an       True' : ''; } },
      { re: /^unlock-adaccount\b/, run: function (s, m, c) { if (c.low.indexOf('nguyen.an') < 0) return "Unlock-ADAccount : Cannot find an object with identity: '" + c.raw.split(' ').pop() + "'."; s.locked = false; return ''; } },
      { re: /get-winevent.*4740|wevtutil.*4740/, run: function () { return 'TimeCreated  : 28/10/2026 8:44:10 AM\nId           : 4740\nMessage      : A user account was locked out.\n               Account That Was Locked Out: nguyen.an\n               Additional Information:\n               Caller Computer Name: MAIL01\n\n(MAIL01 = Exchange/mail server; khoá phát sinh từ dịch vụ email chứ không phải máy tính của user)'; } },
      { re: /^net user nguyen\.an \/domain/, run: function (s) { return 'User name                    nguyen.an\nFull Name                    Nguyễn An\nAccount active               Yes\nPassword last set            27/10/2026 5:12:09 PM\nPassword expires             25/01/2027 5:12:09 PM\nLast logon                   28/10/2026 8:44:02 AM\nGlobal Group memberships     *Domain Users  *GG_All_Staff'; } }
    ],
    actions: {
      ask: { label: '❓ Hỏi user: thiết bị nào khác đang dùng tài khoản?', run: function () { return 'User: “À, điện thoại em có cài Outlook để xem mail công ty. Hôm qua em đổi mật khẩu trên máy tính nhưng chưa đổi trên điện thoại.”'; } },
      wait: { label: '⏱ Chờ 5 phút rồi kiểm tra lại', run: function (s) { if (!s.phoneFixed && !s.locked) { s.locked = true; s.bad += 5; return 'Sau 5 phút: tài khoản lại bị khoá (BadLogonCount tăng) — có thứ gì đó vẫn đăng nhập sai mật khẩu liên tục.'; } return s.locked ? 'Tài khoản vẫn đang bị khoá.' : 'Sau 5 phút: tài khoản vẫn ổn định, không khoá lại. ✔'; } },
      phone: { label: '📱 Hướng dẫn user đổi mật khẩu trên điện thoại', run: function (s) { s.phoneFixed = true; return 'User xoá tài khoản mail cũ trên điện thoại và đăng nhập lại bằng mật khẩu mới.'; } }
    },
    solved: function (s) { return !s.locked && !!s.phoneFixed; },
    causes: ['Mật khẩu mới chưa đủ phức tạp nên bị từ chối', 'Thiết bị khác (điện thoại/app mail) còn lưu mật khẩu cũ và liên tục đăng nhập sai nên khoá lại; mở khoá chưa đủ, phải cập nhật mật khẩu trên thiết bị đó', 'Tài khoản bị hacker tấn công brute force', 'Máy tính của user bị hỏng'], ans: 1,
    why: 'Sự kiện <b>4740</b> ghi “Caller Computer Name: <b>MAIL01</b>” — nguồn khoá là server mail (ActiveSync) chứ không phải PC của user: một thiết bị di động giữ mật khẩu cũ. Chỉ unlock thì vài phút sau lại khoá. Phải xử lý nguồn: cập nhật mật khẩu trên điện thoại.',
    hints: ['<code>Get-ADUser nguyen.an -Properties LockedOut,BadLogonCount</code> — và <code>Search-ADAccount -LockedOut</code>.', 'Mở khoá: <code>Unlock-ADAccount nguyen.an</code>. Nhưng hãy chờ 5 phút xem có khoá lại không.', 'Tìm nguồn gây khoá: <code>Get-WinEvent -FilterHashtable @{LogName="Security";Id=4740} -MaxEvents 1</code> → Caller Computer Name là máy nào?', 'Nguồn là MAIL01 (mail). Hỏi user về điện thoại/thiết bị phụ rồi cập nhật mật khẩu ở đó.'],
    after: 'Khoá lặp lại luôn có “nguồn”: tìm Caller Computer Name trong event 4740 rồi xử lý nguồn (thiết bị cũ, ổ mạng đã map, dịch vụ chạy bằng tài khoản user…).',
    note: 'Sự cố: tài khoản nguyen.an liên tục bị khoá sau khi đổi mật khẩu.\nPhân tích: event 4740 – Caller Computer Name = MAIL01 (Exchange); điện thoại user còn lưu mật khẩu cũ.\nKhắc phục: Unlock-ADAccount nguyen.an; hướng dẫn user xoá và thêm lại tài khoản mail trên điện thoại với mật khẩu mới. Theo dõi 15 phút: không khoá lại.\nPhòng ngừa: nhắc user cập nhật mật khẩu trên mọi thiết bị khi đổi.'
  });

  add({
    id: 'trust', cat: 'Tài khoản', lv: 3, pri: 2, title: '“The trust relationship … failed”', from: 'Trần Đức · Phòng Pháp chế', subject: 'Không đăng nhập được bằng tài khoản công ty',
    ticket: '“Máy báo The trust relationship between this workstation and the primary domain failed. Máy này mới khôi phục từ bản sao lưu (snapshot) hôm qua. Em đang đăng nhập bằng tài khoản Administrator cục bộ.”',
    init: function () { return { user: 'administrator', host: 'PC-LEG-003', whoami: 'pc-leg-003\\administrator' }; },
    cmds: [
      { re: /^test-computersecurechannel\b(?!.*-repair)/, run: function (s) { return s.fixed ? 'True' : 'False'; } },
      { re: /^test-computersecurechannel\b.*-repair/, run: function (s, m, c) { if (c.low.indexOf('-credential') < 0) return 'cmdlet Test-ComputerSecureChannel at command pipeline position 1\nSupply values for the following parameters:\nCredential\n(Cần thông tin đăng nhập có quyền trên domain, vd: -Credential corp\\adm-helpdesk)'; s.fixed = true; return 'True'; } },
      { re: /^netdom resetpwd/, run: function (s) { s.fixed = true; return 'The machine account password for the local machine has been successfully reset.\n\nThe command completed successfully.'; } },
      { re: /^nltest \/sc_verify:corp\.local/, run: function (s) { return s.fixed ? 'Flags: b0 HAS_IP  HAS_TIMESERV\nTrusted DC Name \\\\dc01.corp.local\nTrusted DC Connection Status Status = 0 0x0 NERR_Success\nTrust Verification Status = 0 0x0 NERR_Success\nThe command completed successfully' : 'Flags: 0\nTrusted DC Name \nTrusted DC Connection Status Status = 1786 0x6fa ERROR_NO_TRUST_LSA_SECRET\nTrust Verification Status = 1786 0x6fa ERROR_NO_TRUST_LSA_SECRET\nThe command completed successfully'; } },
      { re: /^nltest \/dsgetdc/, run: function () { return '           DC: \\\\dc01.corp.local\n      Address: \\\\192.168.1.10\n     Dom Name: CORP\nThe command completed successfully'; } },
      { re: /^w32tm \/query \/status/, run: function () { return 'Leap Indicator: 0(no warning)\nStratum: 3 (secondary reference - syncd by (S)NTP)\nLast Successful Sync Time: 28/10/2026 8:00:12 AM\nSource: dc01.corp.local\n(Giờ đồng bộ bình thường — không phải lỗi lệch giờ)'; } }
    ],
    chips: ['nltest /sc_verify:corp.local', 'Test-ComputerSecureChannel', 'w32tm /query /status', 'ping dc01.corp.local'],
    solved: function (s) { return !!s.fixed; },
    causes: ['Mất kết nối mạng tới domain controller', 'Giờ hệ thống của máy lệch quá 5 phút so với DC', 'Mật khẩu của tài khoản máy (computer account) không còn khớp với AD do khôi phục snapshot — cần sửa secure channel hoặc rejoin domain', 'User nhập sai mật khẩu domain'], ans: 2,
    why: 'Mạng, DNS và DC đều ổn (<code>ping dc01</code>, <code>nltest /dsgetdc</code>), đồng hồ đồng bộ. Nhưng <code>Test-ComputerSecureChannel</code> trả <b>False</b> và <code>nltest /sc_verify</code> báo <i>ERROR_NO_TRUST_LSA_SECRET</i>: mật khẩu máy (tự đổi định kỳ 30 ngày) cũ hơn bản trên AD sau khi restore snapshot. Sửa bằng <code>Test-ComputerSecureChannel -Repair -Credential …</code> hoặc rejoin domain.',
    hints: ['Loại trừ trước: <code>ping dc01.corp.local</code>, <code>nltest /dsgetdc:corp.local</code>, <code>w32tm /query /status</code>.', '<code>Test-ComputerSecureChannel</code> trả về gì? Kèm <code>nltest /sc_verify:corp.local</code>.', 'Sửa: <code>Test-ComputerSecureChannel -Repair -Credential corp\\adm-helpdesk</code> (cần tài khoản có quyền).', 'Nguyên nhân: tài khoản máy lệch mật khẩu với AD sau khi restore snapshot.'],
    after: 'Lỗi “trust relationship” sau khi restore/clone VM gần như luôn do mật khẩu tài khoản máy lệch. Loại trừ mạng/DNS/giờ rồi mới sửa secure channel; không reset tài khoản user.',
    note: 'Sự cố: “trust relationship failed” sau khi restore snapshot máy PC-LEG-003; đăng nhập bằng local admin.\nKiểm tra: ping/nltest DC OK, đồng bộ giờ OK; Test-ComputerSecureChannel = False; nltest /sc_verify: ERROR_NO_TRUST_LSA_SECRET.\nKhắc phục: Test-ComputerSecureChannel -Repair -Credential corp\\adm-helpdesk → True. Khởi động lại, đăng nhập domain thành công.\nGhi chú: tránh restore snapshot quá 30 ngày với máy join domain.'
  });

  add({
    id: 'linuxdisk', cat: 'Linux', lv: 3, pri: 2, shell: 'linux', title: 'Server web báo lỗi 500: đầy ổ đĩa', from: 'Dev team · Ứng dụng nội bộ', subject: 'Web nội bộ báo 500, dịch vụ app không chạy',
    ticket: '“Trang quản lý nội bộ trả lỗi 500 từ 8:50. Bên dev nói service app chết vì “No space left on device”. Nhờ IT kiểm tra giúp server web01 (Ubuntu), chỉ có quyền helpdesk với sudo.”',
    chips: ['df -h', 'systemctl status app', 'du -sh /var/log/*', 'ls -lh /var/log/app'],
    init: function () { return { user: 'helpdesk', host: 'web01', free: 0, deletedOpen: false, appUp: false, dfOut: function (s) { var used = 50 - s.free, pct = Math.min(100, Math.round(used / 50 * 100)); return 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda2        50G   ' + pad(Math.round(used) + 'G', 4) + ' ' + pad(s.free < 0.05 ? '0' : (Math.round(s.free * 10) / 10) + 'G', 4) + ' ' + pad(pct + '%', 4) + ' /\ntmpfs           3.9G     0  3.9G   0% /dev/shm'; } }; },
    cmds: [
      { re: /^du -sh \/var\/log\/\*/, run: function (s) { return '4.0K\t/var/log/alternatives.log\n12M\t/var/log/syslog\n120M\t/var/log/journal\n300M\t/var/log/nginx\n' + (s.logGone ? '' : '18G\t/var/log/app'); } },
      { re: /^du -sh \/(var\/)?\*/, run: function () { return '1.2G\t/usr\n2.1G\t/var/lib\n18G\t/var/log\n(các thư mục còn lại nhỏ)'; } },
      { re: /^ls -lh? \/var\/log\/app/, run: function (s) { return s.logGone ? 'total 0' : 'total 18G\n-rw-r----- 1 app app 18G Oct 28 08:52 app.log\n-rw-r----- 1 app app 41M Oct 21 00:00 app.log.1.gz'; } },
      { re: /^systemctl status app/, run: function (s) { return s.appUp ? '● app.service - Internal app\n     Active: active (running) since Wed 2026-10-28 09:14:03 UTC; 2s ago\n   Main PID: 3321 (app)' : '● app.service - Internal app\n     Active: failed (Result: exit-code) since Wed 2026-10-28 08:50:21 UTC\n    Process: 2210 ExecStart=/opt/app/bin/app (code=exited, status=1/FAILURE)\nOct 28 08:50:21 web01 app[2210]: ERROR write /var/log/app/app.log: no space left on device'; } },
      { re: /^journalctl -u app/, run: function () { return 'Oct 28 08:50:20 web01 app[2210]: ERROR write /var/log/app/app.log: no space left on device\nOct 28 08:50:21 web01 systemd[1]: app.service: Main process exited, code=exited, status=1/FAILURE'; } },
      { re: /^journalctl --vacuum/, run: function (s, m, c) { if (!c.sudo) return 'Failed to vacuum: Permission denied'; s.free += 0.12; return 'Vacuuming done, freed 120.0M of archived journals from /var/log/journal.'; } },
      { re: /^truncate -s 0 \/var\/log\/app\/app\.log/, run: function (s, m, c) { if (!c.sudo) return 'truncate: cannot open \'/var/log/app/app.log\' for writing: Permission denied'; if (!s.logGone) { s.logGone = true; s.free += 18; } return ''; } },
      { re: /^rm (-f )?\/var\/log\/app\/app\.log$/, run: function (s, m, c) { if (!c.sudo) return "rm: cannot remove '/var/log/app/app.log': Permission denied"; s.deletedOpen = true; s.logGone = true; return ''; } },
      { re: /^lsof \+l1|^lsof.*deleted/, run: function (s, m, c) { return s.deletedOpen ? 'COMMAND PID USER FD TYPE DEVICE SIZE/OFF NLINK NODE NAME\napp     2210 app  4w  REG  8,2 19327352832  0  1048 /var/log/app/app.log (deleted)' : ''; } },
      { re: /^systemctl restart app/, run: function (s, m, c) { if (!c.sudo) return 'Failed to restart app.service: Interactive authentication required.'; if (s.deletedOpen) { s.free += 18; s.deletedOpen = false; } s.appUp = s.free > 5; return ''; } },
      { re: /^rm -rf? .*(\/var\/lib|\/etc|\/var\/log\/?\*?$|\s\/$)/, run: function (s) { s.violation = true; return '(đã xoá — 💥 bạn vừa xoá dữ liệu/cấu hình hệ thống. Trong thực tế, đây là sự cố nghiêm trọng hơn lỗi ban đầu.)'; } }
    ],
    warn: function (s) { return s.violation ? 'Bạn vừa chạy lệnh xoá nguy hiểm trên dữ liệu hệ thống. Bấm “Làm lại” và chỉ dọn đúng tập tin gây đầy ổ.' : s.deletedOpen ? 'Đã xoá file log nhưng dịch vụ app vẫn giữ file mở nên dung lượng chưa được giải phóng (xem df -h, lsof +L1).' : ''; },
    solved: function (s) { return s.free >= 10 && s.appUp && !s.violation; },
    causes: ['Ổ cứng vật lý bị hỏng', 'File log của ứng dụng (/var/log/app/app.log, 18 GB) phình to làm đầy ổ gốc; dọn đúng file đó rồi khởi động lại dịch vụ', 'Nginx cấu hình sai', 'Server bị tấn công DDoS'], ans: 1,
    why: '<code>df -h</code> cho thấy / đầy 100%, <code>du -sh /var/log/*</code> lộ ra <b>app.log 18 GB</b>. Cách sạch nhất là <code>sudo truncate -s 0</code> (giải phóng ngay, giữ nguyên file). Nếu <code>rm</code> file đang mở thì dung lượng <u>chưa</u> được trả cho tới khi dịch vụ đóng file (<code>lsof +L1</code>) — phải restart service. Tuyệt đối không xoá lung tung trong /var/lib, /etc.',
    hints: ['<code>df -h</code> để xác nhận phân vùng nào đầy, rồi <code>du -sh /var/log/*</code> tìm thủ phạm.', 'Có 2 cách: <code>sudo truncate -s 0 /var/log/app/app.log</code> hoặc <code>sudo rm</code> (khi đó cần kiểm tra thêm <code>df -h</code> và <code>sudo lsof +L1</code>).', 'Sau khi có chỗ trống: <code>sudo systemctl restart app</code> rồi <code>systemctl status app</code>.', 'Nguyên nhân: file log app.log 18 GB làm đầy ổ.'],
    after: 'Tìm đúng thủ phạm bằng df/du, giải phóng bằng cách an toàn (truncate), khởi động lại dịch vụ và báo dev bật logrotate để tránh tái diễn.',
    note: 'Sự cố: web01 trả lỗi 500; service app failed “no space left on device”.\nPhân tích: / đầy 100%; /var/log/app/app.log = 18 GB.\nKhắc phục: sudo truncate -s 0 /var/log/app/app.log (giải phóng 18 GB); sudo systemctl restart app → active (running). df -h: còn ~36% sử dụng.\nĐề xuất: cấu hình logrotate cho /var/log/app, cảnh báo khi dung lượng > 80%.'
  });

  add({
    id: 'linux403', cat: 'Linux', lv: 2, pri: 3, shell: 'linux', title: 'Web trả 403 Forbidden sau khi upload file', from: 'Dev team · Website', subject: 'index.html mới upload bị 403',
    ticket: '“Dev vừa upload bản mới của index.html lên web01 thì truy cập trả 403 Forbidden. Trước đó trang hoạt động bình thường. Bạn có sudo trên web01.”',
    chips: ['curl -I localhost', 'ls -l /var/www/html', 'tail /var/log/nginx/error.log', 'ps aux | grep nginx'],
    init: function () { return { user: 'helpdesk', host: 'web01', mode: '600', owner: 'dev', group: 'dev' }; },
    cmds: [
      { re: /^ls -l[a-z]* \/var\/www\/html/, run: function (s) { var bits = function (m) { return m.split('').map(function (d) { return ['---', '--x', '-w-', '-wx', 'r--', 'r-x', 'rw-', 'rwx'][+d]; }).join(''); }; return 'total 8\n-' + bits(s.mode) + ' 1 ' + pad(s.owner, 8) + ' ' + pad(s.group, 8) + ' 1024 Oct 28 09:02 index.html\n-rw-r--r-- 1 www-data www-data  512 Oct 20 10:11 about.html'; } },
      { re: /^curl -i? ?localhost|^curl -i localhost/, run: function (s) { var rd = (s.owner === 'www-data' && +s.mode[0] >= 4) || (s.group === 'www-data' && +s.mode[1] >= 4) || +s.mode[2] >= 4; return rd ? 'HTTP/1.1 200 OK\nServer: nginx/1.18.0 (Ubuntu)\nContent-Type: text/html' : 'HTTP/1.1 403 Forbidden\nServer: nginx/1.18.0 (Ubuntu)\nContent-Type: text/html'; } },
      { re: /^tail .*\/var\/log\/nginx\/error\.log|^cat \/var\/log\/nginx\/error\.log/, run: function (s) { return s.mode === '600' && s.owner === 'dev' ? '2026/10/28 09:03:11 [error] 812#812: *41 open() "/var/www/html/index.html" failed (13: Permission denied), client: 127.0.0.1, request: "GET / HTTP/1.1"' : '(không có lỗi mới)'; } },
      { re: /^ps aux/, run: function () { return 'root       812  0.0  0.1  55240  4812 ?   Ss  Oct20  0:00 nginx: master process /usr/sbin/nginx\nwww-data   813  0.0  0.2  56012  6120 ?   S   Oct20  0:03 nginx: worker process'; } },
      { re: /^chmod /, run: function (s, m, c) {
        if (!c.sudo) return "chmod: changing permissions of '/var/www/html/index.html': Operation not permitted";
        var md = c.low.match(/chmod (\d{3})/); if (!md) return '';
        s.mode = md[1]; if (md[1] === '777') s.violation = true; return '';
      } },
      { re: /^chown /, run: function (s, m, c) { if (!c.sudo) return "chown: changing ownership of '/var/www/html/index.html': Operation not permitted"; var o = c.low.match(/chown ([\w-]+)(?::([\w-]+))?/); if (o) { s.owner = o[1]; if (o[2]) s.group = o[2]; } return ''; } },
      { re: /^cat \/var\/www\/html\/index\.html/, run: function (s, m, c) { return s.owner === 'dev' && !c.sudo ? 'cat: /var/www/html/index.html: Permission denied' : '<html>…trang chủ…</html>'; } }
    ],
    warn: function (s) { return s.violation ? 'chmod 777 cho phép mọi người ghi vào file web — trang chạy được nhưng vi phạm nguyên tắc tối thiểu quyền (nguy cơ bị chèn mã độc). Bấm “Làm lại” và dùng 644.' : ''; },
    solved: function (s) { var rd = (s.owner === 'www-data' && +s.mode[0] >= 4) || (s.group === 'www-data' && +s.mode[1] >= 4) || +s.mode[2] >= 4; return rd && !s.violation; },
    causes: ['Nginx đã ngừng chạy', 'File index.html mới có quyền 600 và thuộc user dev nên tiến trình nginx (www-data) không đọc được — cần sửa quyền hợp lý (644) hoặc đổi chủ', 'Tường lửa chặn cổng 80', 'Ổ đĩa đầy'], ans: 1,
    why: 'Nginx chạy bằng <b>www-data</b>. File mới do <i>dev</i> upload có quyền <code>-rw-------</code> (600) ⇒ www-data không đọc được ⇒ 403 và log ghi “13: Permission denied”. Sửa: <code>sudo chmod 644 /var/www/html/index.html</code> (hoặc chown cho www-data). <b>Không</b> dùng 777.',
    hints: ['<code>curl -I localhost</code> xác nhận 403; <code>tail /var/log/nginx/error.log</code> nói gì? (13: Permission denied)', '<code>ls -l /var/www/html</code> — so sánh quyền và chủ sở hữu của index.html với about.html (đang chạy tốt). Nginx chạy bằng user nào? (<code>ps aux | grep nginx</code>)', 'Cần sudo vì bạn không phải chủ file. Quyền hợp lý cho file web: 644.', '<code>sudo chmod 644 /var/www/html/index.html</code> rồi <code>curl -I localhost</code>.'],
    after: '403 + “Permission denied” trong error.log = vấn đề quyền file, không phải nginx hỏng. Cấp quyền tối thiểu cần thiết (644), không bao giờ 777.',
    note: 'Sự cố: index.html mới upload trả 403.\nNguyên nhân: file có quyền 600, chủ dev; nginx (www-data) không đọc được (error.log: 13 Permission denied).\nKhắc phục: sudo chmod 644 /var/www/html/index.html; curl -I localhost → 200 OK.\nKhuyến nghị dev: đặt umask/quy trình deploy để file mới có quyền 644 và đúng nhóm.'
  });

  function pad(str, n) { str = String(str); while (str.length < n) str += ' '; return str; }
})();
