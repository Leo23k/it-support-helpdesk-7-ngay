/* Terminal mô phỏng theo tình huống: máy "hỏng" thật, gõ lệnh thật, chốt nguyên nhân và khắc phục.
   Kịch bản nằm ở data/term-scenarios.js (window.TERM). Động cơ lệnh chung ở file này. */
(function () {
  'use strict';
  var T = TOOLS, esc = T.esc;

  /* ---------- mô hình mạng ---------- */
  var INTERNAL = /(^|\.)corp\.local$/;
  var SRV_NAME = { '192.168.1.10': 'dc01.corp.local', '192.168.1.11': 'dc02.corp.local', '8.8.8.8': 'dns.google', '1.1.1.1': 'one.one.one.one' };
  function isIp(h) { return /^\d+\.\d+\.\d+\.\d+$/.test(h); }
  function toN(ip) { var p = ip.split('.'); return ((+p[0] * 256 + +p[1]) * 256 + +p[2]) * 256 + +p[3]; }
  function maskN(m) { return toN(m); }
  function sameNet(s, ip) { var n = s.net; if (!n.ip || !n.mask || !isIp(ip) || !isIp(n.ip)) return false; var m = maskN(n.mask); return ((toN(ip) & m) >>> 0) === ((toN(n.ip) & m) >>> 0); }
  function isPublic(ip) { return !/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|127\.|169\.254\.)/.test(ip); }
  // Kết quả ping tới 1 IP: ok | timeout | unreach (Destination host unreachable) | general (General failure)
  function kind(s, ip) {
    var n = s.net;
    if (ip === '127.0.0.1' || ip === n.ip) return 'ok';
    if (!n.linkUp || n.apipa || !n.ip || n.ip === '0.0.0.0') return 'general';
    if (s.reach) { var r = s.reach(ip); if (r) return r; }
    var on = sameNet(s, ip), down = s.down.indexOf(ip) >= 0;
    if (!on) {
      if (!n.gw || !sameNet(s, n.gw)) return 'general';
      if (s.down.indexOf(n.gw) >= 0) return s.arpFail ? 'unreach' : 'timeout';
    }
    if (down) return on && s.arpFail ? 'unreach' : 'timeout';
    if (!on && s.extDown && isPublic(ip)) return 'timeout';
    return 'ok';
  }
  function lookupVia(s, srv, host) {
    host = host.toLowerCase();
    var pub = isPublic(srv);
    if (INTERNAL.test(host) && (pub || s.internalNx)) return { err: 'nx' };
    if (!INTERNAL.test(host) && !pub && s.extDown) return { err: 'servfail' };
    var ip = s.names[host];
    if (!ip && host.indexOf('.') < 0 && s.net.suffix) ip = s.names[host + '.' + s.net.suffix];
    return ip ? { ip: ip } : { err: 'nx' };
  }
  function resolve(s, host) {
    host = host.toLowerCase();
    if (isIp(host)) return { ip: host };
    if (host === 'localhost') return { ip: '127.0.0.1' };
    if (host === s.host.toLowerCase()) return { ip: s.net.ip };
    var list = s.net.dns || [];
    if (!s.net.linkUp || s.net.apipa || !list.length) return { err: 'timeout' };
    for (var i = 0; i < list.length; i++) if (kind(s, list[i]) === 'ok') return lookupVia(s, list[i], host);
    return { err: 'timeout' };
  }

  /* ---------- định dạng ---------- */
  function row(label, val) { var l = ('   ' + label + ' ' + new Array(30).join('. ')).slice(0, 36); if (l.charAt(35) === '.') l = l.slice(0, 35) + ' '; return l + ': ' + val; }
  function adapter(s, full) {
    var n = s.net, o = ['Ethernet adapter ' + (n.adapter || 'Ethernet') + ':', ''];
    if (!n.linkUp) return o.concat([row('Media State', 'Media disconnected'), row('Connection-specific DNS Suffix', '')]).join('\n');
    o.push(row('Connection-specific DNS Suffix', n.apipa ? '' : n.suffix || ''));
    if (full) {
      o.push(row('Description', 'Intel(R) Ethernet Connection I219-LM'), row('Physical Address', n.mac), row('DHCP Enabled', n.dhcp ? 'Yes' : 'No'), row('Autoconfiguration Enabled', 'Yes'));
    }
    o.push(row(n.apipa ? 'Autoconfiguration IPv4 Address' : 'IPv4 Address', (n.ip || '') + (n.ip && n.ip !== '0.0.0.0' ? '(Preferred)' : '')));
    o.push(row('Subnet Mask', n.mask || ''), row('Default Gateway', n.gw || ''));
    if (full) {
      if (n.dhcp && !n.apipa && n.dhcpServer) o.push(row('Lease Obtained', 'Wednesday, 8:02:11 AM'), row('Lease Expires', 'Thursday, 8:02:11 AM'), row('DHCP Server', n.dhcpServer));
      o.push(row('DNS Servers', (n.dns || []).join('\n' + new Array(39).join(' '))), row('NetBIOS over Tcpip', 'Enabled'));
    }
    return o.join('\n');
  }
  function pad(str, n) { str = String(str); while (str.length < n) str += ' '; return str; }

  /* ---------- lệnh Windows ---------- */
  function cmdPing(s, a, linux) {
    var host = null, cnt = 4;
    for (var i = 1; i < a.length; i++) { if (a[i] === '-n' || a[i] === '-c') cnt = Math.min(+a[++i] || 4, 8); else if (a[i].charAt(0) !== '-' && a[i].charAt(0) !== '/') host = a[i]; }
    if (!host) return linux ? 'ping: usage error: Destination address required' : 'Usage: ping [-t] [-n count] target_name';
    var r = resolve(s, host);
    if (!r.ip) return linux ? 'ping: ' + host + ': Temporary failure in name resolution' : 'Ping request could not find host ' + host + '. Please check the name and try again.';
    var ip = r.ip, k = kind(s, ip), name = host !== ip ? host + ' [' + ip + ']' : ip, i2, o = [];
    if (linux) {
      o.push('PING ' + host + ' (' + ip + ') 56(84) bytes of data.');
      for (i2 = 0; i2 < cnt; i2++) o.push(k === 'ok' ? '64 bytes from ' + ip + ': icmp_seq=' + (i2 + 1) + ' ttl=117 time=' + (13 + i2) + '.' + (2 + i2) + ' ms' : k === 'unreach' ? 'From ' + s.net.ip + ' icmp_seq=' + (i2 + 1) + ' Destination Host Unreachable' : '');
      o.push('', '--- ' + host + ' ping statistics ---', cnt + ' packets transmitted, ' + (k === 'ok' ? cnt : 0) + ' received, ' + (k === 'ok' ? '0' : '100') + '% packet loss');
      return o.join('\n');
    }
    o.push('Pinging ' + name + ' with 32 bytes of data:');
    var gwHop = ip === s.net.gw || sameNet(s, ip);
    for (i2 = 0; i2 < cnt; i2++) o.push(k === 'ok' ? 'Reply from ' + ip + ': bytes=32 time=' + (gwHop ? '1' : 13 + i2 * 2) + 'ms TTL=' + (gwHop ? 64 : 117) : k === 'timeout' ? 'Request timed out.' : k === 'unreach' ? 'Reply from ' + s.net.ip + ': Destination host unreachable.' : 'PING: transmit failed. General failure.');
    var rec = k === 'ok' || k === 'unreach' ? cnt : 0;
    o.push('', 'Ping statistics for ' + ip + ':', '    Packets: Sent = ' + cnt + ', Received = ' + rec + ', Lost = ' + (cnt - rec) + ' (' + Math.round((cnt - rec) / cnt * 100) + '% loss),');
    if (k === 'ok') o.push('Approximate round trip times in milli-seconds:', '    Minimum = ' + (gwHop ? 1 : 13) + 'ms, Maximum = ' + (gwHop ? 1 : 13 + (cnt - 1) * 2) + 'ms, Average = ' + (gwHop ? 1 : 13 + cnt - 1) + 'ms');
    return o.join('\n');
  }
  function cmdNslookup(s, a) {
    var host = a[1], srv = a[2];
    if (!host) return 'Default Server:  ' + (SRV_NAME[(s.net.dns || [])[0]] || 'UnKnown') + '\n(Chế độ tương tác chưa giả lập — dùng: nslookup <tên> [máy-chủ-dns])';
    var list = srv ? [srv] : s.net.dns || [], first = list[0], sname = SRV_NAME[first] || 'UnKnown';
    var head = function (n, ad) { return 'Server:  ' + n + '\nAddress:  ' + ad + '\n\n'; };
    if (!first || kind(s, first) !== 'ok') return 'DNS request timed out.\n    timeout was 2 seconds.\n' + head('UnKnown', first || '::1') + 'DNS request timed out.\n    timeout was 2 seconds.\n*** Request to UnKnown timed out';
    var r = isIp(host) ? { err: 'nx' } : lookupVia(s, first, host);
    if (r.err === 'nx') return head(sname, first) + '*** ' + sname + " can't find " + host + ': Non-existent domain';
    if (r.err === 'servfail') return head(sname, first) + '*** ' + sname + " can't find " + host + ': Server failed';
    return head(sname, first) + (isPublic(first) ? 'Non-authoritative answer:\n' : '') + 'Name:    ' + host + '\nAddress:  ' + r.ip;
  }
  function cmdTracert(s, a) {
    var host = a[1]; if (!host) return 'Usage: tracert [-d] target_name';
    var r = resolve(s, host); if (!r.ip) return 'Unable to resolve target system name ' + host + '.';
    var k = kind(s, r.ip), tgt = host !== r.ip ? host + ' [' + r.ip + ']' : r.ip;
    if (k === 'general') return 'Unable to contact IP driver. Error code 1231.';
    var o = ['Tracing route to ' + tgt, 'over a maximum of 30 hops:', ''];
    if (k === 'unreach') return o.concat(['  1  ' + pad(s.net.ip, 15) + ' reports: Destination host unreachable.', '', 'Trace complete.']).join('\n');
    if (k === 'timeout') {
      var gwOk = !sameNet(s, r.ip) && s.net.gw && kind(s, s.net.gw) === 'ok';
      if (gwOk) o.push('  1    <1 ms    <1 ms    <1 ms  ' + s.net.gw, '  2     *        *        *     Request timed out.');
      else o.push('  1     *        *        *     Request timed out.', '  2     *        *        *     Request timed out.');
      return o.concat(['  3     *        *        *     Request timed out.', '  …  (tracert dừng sau vài hop vì không có phản hồi)']).join('\n');
    }
    if (sameNet(s, r.ip)) return o.concat(['  1    <1 ms    <1 ms    <1 ms  ' + r.ip, '', 'Trace complete.']).join('\n');
    return o.concat(['  1    <1 ms    <1 ms    <1 ms  ' + s.net.gw, '  2     5 ms     4 ms     5 ms  10.20.0.1', '  3    12 ms    11 ms    12 ms  203.0.113.9', '  4    14 ms    15 ms    14 ms  ' + r.ip, '', 'Trace complete.']).join('\n');
  }
  function cmdIpconfig(s, a) {
    var n = s.net, f = a[1];
    if (f === '/flushdns') return 'Windows IP Configuration\n\nSuccessfully flushed the DNS Resolver Cache.';
    if (f === '/registerdns') return 'Windows IP Configuration\n\nRegistration of the DNS resource records for all adapters of this computer has been initiated. Any errors will be reported in the Event Viewer in 15 minutes.';
    if (f === '/displaydns') return 'Windows IP Configuration\n\n    (Bộ nhớ đệm DNS: không có bản ghi liên quan đến bài này)';
    if (f === '/release') {
      if (!n.dhcp) return 'The operation failed as no adapter is in the state permissible for this operation.';
      if (!s.relNet) s.relNet = Object.assign({}, n);
      n.ip = '0.0.0.0'; n.gw = ''; n.apipa = false; n.mask = '';
      return 'Windows IP Configuration\n\n' + adapter(s, false);
    }
    if (f === '/renew') {
      if (!n.dhcp) return 'The operation failed as no adapter is in the state permissible for this operation.';
      if (s.canRenew === false) return 'Windows IP Configuration\n\nAn error occurred while renewing interface ' + (n.adapter || 'Ethernet') + ' : unable to contact your DHCP server. Request has timed out.';
      var good = s.goodNet || s.relNet; if (good) { Object.assign(n, good); n.apipa = false; s.renewed = true; }
      return 'Windows IP Configuration\n\n' + adapter(s, false);
    }
    return 'Windows IP Configuration\n\n' + (f === '/all' ? row('Host Name', s.host) + '\n' + row('Primary Dns Suffix', 'corp.local') + '\n' + row('Node Type', 'Hybrid') + '\n\n' : '') + adapter(s, f === '/all');
  }
  function svcState(s, name) { return s.svc[name]; }
  function svcOut(s, name) {
    var st = svcState(s, name); if (!st) return 'The specified service does not exist as an installed service.';
    var disp = (s.svcName && s.svcName[name]) || name;
    return 'SERVICE_NAME: ' + name + '\nDISPLAY_NAME: ' + disp + '\n        TYPE               : 20  WIN32_SHARE_PROCESS\n        STATE              : ' + (st === 'RUNNING' ? '4  RUNNING' : '1  STOPPED') + '\n        WIN32_EXIT_CODE    : 0  (0x0)';
  }
  function svcSet(s, name, run) {
    if (!s.svc[name]) return 'The service name is invalid.\n\nMore help is available by typing NET HELPMSG 2185.';
    var disp = (s.svcName && s.svcName[name]) || name;
    if (run) { if (s.svc[name] === 'RUNNING') return 'The requested service has already been started.\n\nMore help is available by typing NET HELPMSG 2182.'; s.svc[name] = 'RUNNING'; return 'The ' + disp + ' service is starting.\nThe ' + disp + ' service was started successfully.'; }
    if (s.svc[name] === 'STOPPED') return 'The ' + disp + ' service is not started.\n\nMore help is available by typing NET HELPMSG 3521.';
    s.svc[name] = 'STOPPED'; return 'The ' + disp + ' service is stopping.\nThe ' + disp + ' service was stopped successfully.';
  }
  function cmdTasklist(s) {
    var o = [pad('Image Name', 26) + pad('PID', 9) + pad('Session Name', 17) + pad('Session#', 12) + 'Mem Usage', new Array(26).join('=') + ' ' + '======== ================ =========== ============'];
    s.procs.forEach(function (p) { o.push(pad(p[0], 26) + pad(p[1], 9) + pad('Console', 17) + pad('1', 12) + (p[2] + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',').replace(/^/, '') + ' K'); });
    return o.join('\n');
  }
  function cmdGetProcess(s) {
    var o = ['Handles  NPM(K)    PM(K)      WS(K)     CPU(s)     Id  SI ProcessName', '-------  ------    -----      -----     ------     --  -- -----------'];
    s.procs.slice().sort(function (a, b) { return (b[3] || 0) - (a[3] || 0); }).slice(0, 8).forEach(function (p) { o.push(pad(300 + (p[1] % 700), 8) + pad(20 + (p[1] % 40), 9) + pad(Math.round(p[2] / 2), 11) + pad(p[2], 11) + pad((p[3] || 0).toFixed(2), 10) + pad(p[1], 7) + ' 1 ' + p[0].replace(/\.exe$/i, '')); });
    return o.join('\n');
  }
  function cmdTaskkill(s, a, raw) {
    var im = raw.match(/\/im\s+("?)([^"\s]+)\1/i), pid = raw.match(/\/pid\s+(\d+)/i), p;
    if (!im && !pid) return 'ERROR: Invalid syntax. Type "TASKKILL /?" for usage.';
    for (var i = 0; i < s.procs.length; i++) if ((im && s.procs[i][0].toLowerCase() === im[2].toLowerCase()) || (pid && s.procs[i][1] === +pid[1])) { p = s.procs[i]; break; }
    if (!p) return im ? 'ERROR: The process "' + im[2] + '" not found.' : 'ERROR: The process "' + pid[1] + '" not found.';
    if (/system|csrss|wininit/i.test(p[0])) return 'ERROR: The process "' + p[0] + '" with PID ' + p[1] + ' could not be terminated.\nReason: Access is denied.';
    if (!/\/f/i.test(raw) && /chrome|teams|outlook/i.test(p[0])) { /* không cần /f nhưng vẫn kết thúc */ }
    s.procs = s.procs.filter(function (x) { return x !== p; });
    return 'SUCCESS: The process "' + p[0] + '" with PID ' + p[1] + ' has been terminated.';
  }
  function diskInfo(s) { var d = s.disk || { c: { total: 237, free: 120 } }; return d.c; }
  function gb(n) { return (Math.round(n * 10) / 10).toString().replace('.', ','); }

  // trả về chuỗi, hoặc undefined nếu không biết lệnh
  function winCmd(s, c) {
    var a = c.a, raw = c.raw, n = s.net, o, r, k;
    switch (a[0]) {
      case 'help': case '?': return 'Lệnh giả lập (CMD + PowerShell):\n  Mạng      ipconfig [/all|/release|/renew|/flushdns] · ping · nslookup · tracert · arp -a · netstat -ano · route print · getmac · Test-NetConnection <host> -Port <n> · netsh interface ip set …\n  Hệ thống  hostname · whoami [/groups] · systeminfo · tasklist · Get-Process · taskkill · sc query <svc> · net start|stop <svc> · Get-Service · dir · del · fsutil volume diskfree c: · gpupdate /force · sfc /scannow · shutdown /r /t 0\n  Tài khoản net user <tên> /domain · net use · Get-ADUser · Unlock-ADAccount …\n  Khác      cls · help · lọc kết quả: lệnh | findstr từ-khoá\nGợi ý: bắt đầu từ ipconfig /all.';
      case 'hostname': return s.host;
      case 'ver': return 'Microsoft Windows [Version 10.0.22631.4890]';
      case 'whoami':
        if (a[1] === '/groups') return s.groups ? pad('GROUP INFORMATION', 0) + '\n' + [pad('Group Name', 38) + pad('Type', 18) + 'Attributes', new Array(38).join('=') + ' ' + new Array(18).join('=') + ' ==================================='].concat(s.groups.map(function (g) { return pad(g, 38) + pad('Group', 18) + 'Mandatory group, Enabled by default, Enabled group'; })).join('\n') : undefined;
        return s.whoami || 'corp\\' + s.user;
      case 'echo': return raw.replace(/^echo\s*/i, '');
      case 'ipconfig': return cmdIpconfig(s, a);
      case 'ping': return cmdPing(s, a);
      case 'nslookup': return cmdNslookup(s, a);
      case 'tracert': return cmdTracert(s, a);
      case 'getmac': return 'Physical Address    Transport Name\n=================== ==========================================================\n' + n.mac + '   \\Device\\Tcpip_{3F8A9C2E-61B4-4D0E-9A77-2B1D5C0E91AA}';
      case 'arp':
        if (!n.linkUp || n.apipa || !n.ip || n.ip === '0.0.0.0') return 'No ARP Entries Found.';
        if (s.arpOut) return s.arpOut;
        return 'Interface: ' + n.ip + ' --- 0x7\n  Internet Address      Physical Address      Type\n' + (n.gw && kind(s, n.gw) === 'ok' ? '  ' + pad(n.gw, 22) + 'b0-4e-26-1c-9d-02     dynamic\n' : '') + '  ' + pad(n.ip.replace(/\.\d+$/, '.255'), 22) + 'ff-ff-ff-ff-ff-ff     static\n  224.0.0.22            01-00-5e-00-00-16     static';
      case 'netstat':
        if (s.netstat) return s.netstat;
        return 'Active Connections\n\n  Proto  Local Address          Foreign Address        State           PID\n  TCP    ' + pad(n.ip + ':50321', 22) + '142.250.199.14:443     ESTABLISHED     8812\n  TCP    ' + pad(n.ip + ':50400', 22) + '192.168.1.20:445       ESTABLISHED     4\n  TCP    ' + pad('0.0.0.0:135', 22) + '0.0.0.0:0              LISTENING       1012\n  TCP    ' + pad('0.0.0.0:445', 22) + '0.0.0.0:0              LISTENING       4';
      case 'route': return 'IPv4 Route Table\n===========================================================================\nActive Routes:\nNetwork Destination        Netmask          Gateway       Interface  Metric\n' + (n.gw ? '          0.0.0.0          0.0.0.0  ' + pad(n.gw, 15) + pad(n.ip, 16) + '25\n' : '') + '        127.0.0.0        255.0.0.0         On-link         127.0.0.1    331\n' + (n.ip && n.ip !== '0.0.0.0' ? '  ' + pad(n.ip.replace(/\.\d+$/, '.0'), 17) + pad(n.mask, 17) + ' On-link  ' + pad(n.ip, 16) + '281' : '');
      case 'test-netconnection': case 'tnc':
        var h = a[1], pi = a.indexOf('-port'), port = pi > 0 ? +a[pi + 1] : 0;
        if (!h || h.charAt(0) === '-') return 'Test-NetConnection: cần tên máy, vd: Test-NetConnection fileserver.corp.local -Port 445';
        r = resolve(s, h); if (!r.ip) return "WARNING: Name resolution of " + h + " failed\n\nComputerName           : " + h + '\nRemoteAddress          : \nNameResolutionResults  : (không phân giải được)\nPingSucceeded          : False';
        k = kind(s, r.ip);
        var tcp = k === 'ok' && (!port || !(s.closedPorts || []).some(function (p) { return p === port && (r.ip === (s.closedHost || r.ip)); }));
        o = ['ComputerName     : ' + h, 'RemoteAddress    : ' + r.ip];
        if (port) o.push('RemotePort       : ' + port);
        o.push('InterfaceAlias   : ' + (n.adapter || 'Ethernet'), 'SourceAddress    : ' + n.ip, port ? 'TcpTestSucceeded : ' + (tcp ? 'True' : 'False') : 'PingSucceeded    : ' + (k === 'ok' ? 'True' : 'False'));
        return o.join('\n');
      case 'netsh': return s.netshDefault || 'The requested operation requires elevation (Run as administrator).';
      case 'systeminfo': return 'Host Name:                 ' + s.host + '\nOS Name:                   Microsoft Windows 11 Pro\nOS Version:                10.0.22631 N/A Build 22631\nSystem Boot Time:          ' + (s.boot || '27/10/2026, 8:01:42 AM') + '\nSystem Model:              Latitude 5540\nTotal Physical Memory:     16,214 MB\nAvailable Physical Memory: ' + (s.freeRam || '9,870') + ' MB\nDomain:                    corp.local\nLogon Server:              \\\\DC01\nNetwork Card(s):           1 NIC(s) Installed.\n                           [01]: Intel(R) Ethernet Connection I219-LM\n                                 DHCP Enabled:    ' + (n.dhcp ? 'Yes' : 'No') + '\n                                 IP address(es)\n                                 [01]: ' + n.ip;
      case 'tasklist': return cmdTasklist(s);
      case 'get-process': case 'gps': return cmdGetProcess(s);
      case 'taskkill': return cmdTaskkill(s, a, raw);
      case 'sc': if (a[1] === 'query' && a[2]) return svcOut(s, a[2]); return undefined;
      case 'get-service': if (a[1] && a[1].charAt(0) !== '-') { var st = s.svc[a[1]]; if (!st) return "Get-Service : Cannot find any service with service name '" + a[1] + "'."; return 'Status   Name               DisplayName\n------   ----               -----------\n' + pad(st === 'RUNNING' ? 'Running' : 'Stopped', 8) + ' ' + pad(a[1], 18) + ' ' + ((s.svcName && s.svcName[a[1]]) || a[1]); } return undefined;
      case 'start-service': return a[1] ? (s.svc[a[1]] ? (s.svc[a[1]] = 'RUNNING', '') : "Start-Service : Cannot find any service with service name '" + a[1] + "'.") : undefined;
      case 'stop-service': return a[1] ? (s.svc[a[1]] ? (s.svc[a[1]] = 'STOPPED', '') : "Stop-Service : Cannot find any service with service name '" + a[1] + "'.") : undefined;
      case 'restart-service': return a[1] ? (s.svc[a[1]] ? (s.svc[a[1]] = 'RUNNING', '') : "Restart-Service : Cannot find any service with service name '" + a[1] + "'.") : undefined;
      case 'net':
        if ((a[1] === 'start' || a[1] === 'stop') && a[2]) return svcSet(s, a[2], a[1] === 'start');
        if (a[1] === 'use' && !a[2]) return s.drives || 'There are no entries in the list.';
        if (a[1] === 'use' && a[2] && /^\\\\/.test(a[2])) {
          var srv = a[2].replace(/^\\\\/, '').split('\\')[0], rr = resolve(s, srv);
          if (!rr.ip || kind(s, rr.ip) !== 'ok') return 'System error 53 has occurred.\n\nThe network path was not found.';
          return 'The command completed successfully.';
        }
        return undefined;
      case 'gpupdate': return 'Updating policy...\n\nComputer Policy update has completed successfully.\nUser Policy update has completed successfully.';
      case 'sfc': return 'Beginning system scan.  This process will take some time.\n\nBeginning verification phase of system scan.\nVerification 100% complete.\n\nWindows Resource Protection did not find any integrity violations.';
      case 'chkdsk': return 'The type of the file system is NTFS.\nWARNING!  F parameter not specified.\nRunning CHKDSK in read-only mode.\n\nStage 1: Examining basic file system structure ...\nStage 2: Examining file name linkage ...\nStage 3: Examining security descriptors ...\nWindows has scanned the file system and found no problems.\nNo further action is required.';
      case 'dism': return 'Deployment Image Servicing and Management tool\nVersion: 10.0.22621.2792\n\n[==========================100.0%==========================] The restore operation completed successfully.';
      case 'shutdown': if (/\/r|-r/.test(raw)) return s.reboot ? s.reboot(s) : 'Đang khởi động lại… (giả lập)\nMáy đã khởi động lại. Không có gì thay đổi so với trước.'; return undefined;
      case 'w32tm': return undefined;
      case 'fsutil':
        if (/volume\s+diskfree/.test(raw.toLowerCase())) { var d = diskInfo(s); return 'Total free bytes        : ' + Math.round(d.free * 1073741824).toLocaleString('en-US') + ' (' + gb(d.free) + ' GB)\nTotal bytes             : ' + Math.round(d.total * 1073741824).toLocaleString('en-US') + ' (' + gb(d.total) + ' GB)\nTotal quota free bytes  : ' + Math.round(d.free * 1073741824).toLocaleString('en-US') + ' (' + gb(d.free) + ' GB)'; }
        return undefined;
      case 'get-psdrive': case 'wmic':
        if (a[0] === 'get-psdrive' || /logicaldisk/.test(raw.toLowerCase())) { var dd = diskInfo(s); return a[0] === 'wmic' ? 'Caption  FreeSpace    Size\nC:       ' + pad(Math.round(dd.free * 1073741824), 11) + ' ' + Math.round(dd.total * 1073741824) : 'Name           Used (GB)     Free (GB) Provider      Root\n----           ---------     --------- --------      ----\nC                 ' + pad(gb(dd.total - dd.free), 13) + pad(gb(dd.free), 10) + ' FileSystem    C:\\'; }
        return undefined;
      case 'dir': case 'ls': case 'get-childitem':
        var path = raw.replace(/^\S+\s*/, '').replace(/\/\w+\s*/g, '').replace(/"/g, '').trim().toLowerCase().replace(/\\+$/, '');
        if (!path) path = 'c:\\users\\' + s.user;
        if (s.fs && s.fs[path]) return s.fs[path];
        return /^[a-z]:\\/.test(path) ? 'File Not Found' : 'The system cannot find the path specified.';
      case 'cd': case 'cd..': return '';
      case 'cleanmgr': return undefined;
    }
    return undefined;
  }

  /* ---------- Linux ---------- */
  function linuxCmd(s, c) {
    var a = c.a;
    switch (a[0]) {
      case 'help': return 'Lệnh giả lập (Linux): whoami · id · hostname · pwd · uname -a · uptime · free -h · df -h · du -sh <đường dẫn> · ls -l[h] <đường dẫn> · cat · tail · systemctl status|restart <svc> · journalctl -u <svc> · ip a · ping · curl -I localhost · sudo … · lọc: lệnh | grep từ-khoá\nGợi ý: bắt đầu từ df -h hoặc systemctl status.';
      case 'whoami': return s.user;
      case 'id': return 'uid=1001(' + s.user + ') gid=1001(' + s.user + ') groups=1001(' + s.user + '),27(sudo)';
      case 'hostname': return s.host;
      case 'pwd': return '/home/' + s.user;
      case 'uname': return 'Linux ' + s.host + ' 5.15.0-91-generic #101-Ubuntu SMP x86_64 GNU/Linux';
      case 'uptime': return ' 09:12:41 up 41 days,  3:08,  1 user,  load average: 0.42, 0.51, 0.47';
      case 'free': return '               total        used        free      shared  buff/cache   available\nMem:           7.8Gi       2.1Gi       3.9Gi       0.1Gi       1.8Gi       5.4Gi\nSwap:          2.0Gi          0B       2.0Gi';
      case 'ip': return '2: ens160: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000\n    inet 192.168.1.50/24 brd 192.168.1.255 scope global ens160\n       valid_lft forever preferred_lft forever';
      case 'ping': return cmdPing(s, a, true);
      case 'df': return s.dfOut ? s.dfOut(s) : 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda2        50G   22G   26G  46% /\ntmpfs           3.9G     0  3.9G   0% /dev/shm';
      case 'clear': return undefined;
    }
    return undefined;
  }

  /* ---------- bộ lọc sau dấu | ---------- */
  function applyFilter(seg, text) {
    var t = seg.trim(), low = t.toLowerCase(), lines = text.split('\n'), m;
    if ((m = t.match(/^(?:findstr|find|grep|select-string|sls)\s+(.*)$/i))) {
      var args = m[1], inv = /(^|\s)(\/v|-v)\b/i.test(args), ci = true;
      var lit = args.match(/\/c:"([^"]*)"/i), pats = lit ? [lit[1]] : args.replace(/(^|\s)(\/\w|-\w+)(?=\s|$)/g, ' ').replace(/"/g, '').trim().split(/\s+/).filter(Boolean);
      if (!pats.length) return text;
      return lines.filter(function (l) { var hit = pats.some(function (p) { return l.toLowerCase().indexOf(p.toLowerCase()) >= 0; }); return inv ? !hit : hit; }).join('\n') || '';
    }
    if ((m = low.match(/^head(?:\s+-n?\s*(\d+))?/))) return lines.slice(0, +m[1] || 10).join('\n');
    if ((m = low.match(/^tail(?:\s+-n?\s*(\d+))?/))) return lines.slice(-(+m[1] || 10)).join('\n');
    if (/^wc\s+-l/.test(low)) return String(lines.length);
    if ((m = low.match(/^(?:select|select-object)\s.*-first\s+(\d+)/))) { var hd = lines.length > 2 && /^-+/.test(lines[1]) ? 2 : 0; return lines.slice(0, hd + +m[1]).join('\n'); }
    return text;
  }
  function splitPipes(line) {
    var out = [], cur = '', q = '';
    for (var i = 0; i < line.length; i++) { var ch = line.charAt(i); if (q) { if (ch === q) q = ''; cur += ch; } else if (ch === '"' || ch === "'") { q = ch; cur += ch; } else if (ch === '|') { out.push(cur); cur = ''; } else cur += ch; }
    out.push(cur); return out;
  }

  /* ---------- thực thi ---------- */
  function execLine(S, line) {
    var s = S.s, sc = S.sc, raw = line.trim(), sudo = false;
    if (sc.shell === 'linux' && /^sudo\s+/i.test(raw)) { sudo = true; raw = raw.replace(/^sudo\s+/i, ''); }
    var parts = splitPipes(raw), out, ctx;
    // Thử khớp kịch bản trên lệnh đầu của chuỗi pipe; nếu không có thì thử cả dòng (lệnh PowerShell nhiều tầng).
    function tryCmds(text) {
      var l = text.toLowerCase().replace(/\s+/g, ' '), c = { raw: text.replace(/\s+/g, ' '), low: l, a: l.split(' '), sudo: sudo };
      for (var i = 0; i < sc.cmds.length; i++) {
        var m = l.match(sc.cmds[i].re);
        if (m) { var o = sc.cmds[i].run(s, m, c); if (o !== undefined) return { out: o, c: c }; }
      }
      return { c: c };
    }
    var hit = tryCmds(parts[0].trim());
    if (hit.out === undefined && parts.length > 1) { var whole = tryCmds(raw); if (whole.out !== undefined) { hit = whole; parts = [raw]; } }
    out = hit.out; ctx = hit.c;
    if (out === undefined) out = sc.shell === 'linux' ? linuxCmd(s, ctx) : winCmd(s, ctx);
    var i;
    if (out === undefined) {
      var known = sc.shell === 'linux' ? /^(ls|cat|tail|head|grep|systemctl|journalctl|du|chmod|chown|curl|ps|top|kill|rm|mv|cp|nano|vi|df|truncate|lsof|find|apt|ss|netstat|tar|mkdir|touch|echo)$/ : /^(net|netsh|sc|wmic|get-\w+|set-\w+|start-\w+|stop-\w+|restart-\w+|unlock-adaccount|test-\w+|nltest|dsregcmd|gpresult|klist|type|copy|move|ren|del|erase|rd|md|mkdir|robocopy|cleanmgr|powershell|reg|schtasks|msinfo32|eventvwr|taskmgr|services\.msc|w32tm|printui|runas|where|set)$/;
      if (known.test(ctx.a[0])) return '(Lệnh “' + ctx.a[0] + '” hợp lệ nhưng không có kết quả đáng chú ý trong tình huống này. Hãy thử lệnh khác hoặc xem gợi ý.)';
      return sc.shell === 'linux' ? ctx.a[0] + ': command not found' : "'" + ctx.a[0] + "' is not recognized as an internal or external command,\noperable program or batch file.";
    }
    for (i = 1; i < parts.length; i++) out = applyFilter(parts[i], String(out));
    return out;
  }

  /* ---------- giao diện ---------- */
  var S = null, filterCat = 'Tất cả', histIdx = 0, pickOpen = false;
  var CHIPS_WIN = ['ipconfig /all', 'ping 8.8.8.8', 'ping google.com', 'nslookup google.com', 'tracert 8.8.8.8', 'arp -a', 'netstat -ano', 'tasklist', 'whoami /groups', 'systeminfo'];
  var CHIPS_LNX = ['df -h', 'systemctl status app', 'ls -l /var/www/html', 'free -h', 'uptime', 'ip a'];
  var DEFAULT_ACTIONS = { reboot: { label: '🔄 Khởi động lại máy', run: function (s) { return s.reboot ? s.reboot(s) : 'Máy khởi động lại (~2 phút). Sau khi lên lại, tình trạng vẫn như cũ — khởi động lại không phải lúc nào cũng là cách sửa.'; } } };

  function scDone() { var d = T.stat('terminal'); return d.done || (d.done = {}); }
  function newState(sc) {
    var s = sc.init();
    s.host = s.host || sc.host || 'PC-ACC-017'; s.user = s.user || sc.user || 'nguyen.an';
    s.net = Object.assign({ ip: '192.168.1.45', mask: '255.255.255.0', gw: '192.168.1.1', dns: ['192.168.1.10'], dhcp: true, dhcpServer: '192.168.1.10', suffix: 'corp.local', mac: '8C-16-45-A2-3F-1B', linkUp: true, apipa: false, adapter: 'Ethernet' }, s.net || {});
    s.names = Object.assign({ 'google.com': '142.250.199.14', 'www.google.com': '142.250.199.14', 'microsoft.com': '20.70.246.20', 'fileserver.corp.local': '192.168.1.20', 'dc01.corp.local': '192.168.1.10', 'dc02.corp.local': '192.168.1.11', 'corp.local': '192.168.1.10', 'printserver.corp.local': '192.168.1.30', 'intranet.corp.local': '192.168.1.25' }, s.names || {});
    s.down = s.down || []; s.svc = s.svc || { spooler: 'RUNNING', dhcp: 'RUNNING', dnscache: 'RUNNING', wuauserv: 'RUNNING' };
    s.svcName = Object.assign({ spooler: 'Print Spooler', dhcp: 'DHCP Client', dnscache: 'DNS Client', wuauserv: 'Windows Update' }, s.svcName || {});
    s.procs = s.procs || [['System Idle Process', 0, 8], ['System', 4, 144, 12], ['explorer.exe', 4120, 142300, 40], ['chrome.exe', 8812, 256400, 220], ['Teams.exe', 7340, 310200, 160], ['OUTLOOK.EXE', 6212, 198700, 90], ['svchost.exe', 1012, 28500, 14], ['MsMpEng.exe', 3321, 224100, 55]];
    return s;
  }
  function loadScenario(id) {
    var sc = TERM.scenarios.filter(function (x) { return x.id === id; })[0] || TERM.scenarios[0];
    var opts = T.shuffle(sc.causes.map(function (t, i) { return { t: t, ok: i === sc.ans }; }));
    S = { sc: sc, s: newState(sc), opts: opts, hist: [], hints: 0, tries: 0, picked: -1, diagnosed: false, finished: false, cmdCount: 0 };
    sc.cmds = sc.cmds || [];
    S.actions = {}; Object.keys(sc.shell === 'linux' ? {} : DEFAULT_ACTIONS).forEach(function (k) { S.actions[k] = DEFAULT_ACTIONS[k]; });
    Object.keys(sc.actions || {}).forEach(function (k) { S.actions[k] = sc.actions[k]; });
    histIdx = 0;
  }
  function solved() { return S.sc.noFix ? true : !!S.sc.solved(S.s); }
  function promptStr() { return S.sc.shell === 'linux' ? S.s.user + '@' + S.s.host + ':~$ ' : 'C:\\Users\\' + S.s.user + '>'; }

  function pickerHtml() {
    var cats = ['Tất cả'], done = scDone();
    TERM.scenarios.forEach(function (x) { if (cats.indexOf(x.cat) < 0) cats.push(x.cat); });
    var nDone = Object.keys(done).length, idx = TERM.scenarios.indexOf(S.sc) + 1;
    var h = '<details class="sc-det"' + (pickOpen ? ' open' : '') + '><summary><span class="sc-cur"><b>Tình huống ' + idx + '/' + TERM.scenarios.length + ':</b> ' + esc(S.sc.title) + '</span><span class="sc-sum">Đã xong ' + nDone + '/' + TERM.scenarios.length + ' · bấm để đổi tình huống ▾</span></summary>' +
      '<div class="chips">' + cats.map(function (c) { return '<button class="chip ' + (c === filterCat ? 'on' : '') + '" data-a="cat" data-v="' + esc(c) + '">' + esc(c) + '</button>'; }).join('') + '</div><div class="sc-picker">';
    TERM.scenarios.forEach(function (x, i) {
      if (filterCat !== 'Tất cả' && x.cat !== filterCat) return;
      h += '<button class="sc-card ' + (S.sc === x ? 'on' : '') + ' ' + (done[x.id] ? 'done' : '') + '" data-a="load" data-v="' + x.id + '"><span class="sc-n">' + (done[x.id] ? '✓' : i + 1) + '</span><span class="sc-t"><b>' + esc(x.title) + '</b><small>' + esc(x.cat) + ' · ' + ['', 'Dễ', 'Vừa', 'Khó'][x.lv] + '</small></span></button>';
    });
    return h + '</div></details>';
  }
  function ticketHtml() {
    var sc = S.sc;
    return '<div class="ticket"><div class="ticket-h"><span class="tk-id">' + sc.id.toUpperCase().slice(0, 4) + '-' + (1000 + TERM.scenarios.indexOf(sc) * 7 + 21) + '</span><span class="tk-pri p' + sc.pri + '">P' + sc.pri + '</span><span class="tk-from">' + esc(sc.from) + '</span></div><div class="ticket-b"><b>' + esc(sc.subject) + '</b><p>' + sc.ticket + '</p></div></div>';
  }
  function actionsHtml() {
    var ks = Object.keys(S.actions); if (!ks.length) return '';
    return '<div class="lab-actions"><span class="lbl">Hành động ngoài lệnh (như khi ra tận nơi / gọi điện):</span>' + ks.map(function (k) { return '<button class="markbtn" data-a="act" data-v="' + k + '">' + S.actions[k].label + '</button>'; }).join('') + '</div>';
  }
  function panelHtml() {
    var sc = S.sc, h = '';
    var fixTxt = sc.noFix ? '<span class="st n">Không cần (leo thang)</span>' : solved() ? '<span class="st ok">✔ Đã khắc phục</span>' : '<span class="st">⬜ Chưa</span>';
    h += '<div class="lab-status"><div><b>Chẩn đoán</b>' + (S.diagnosed ? '<span class="st ok">✔ Đúng</span>' : '<span class="st">⬜ Chưa chốt</span>') + '</div><div><b>Khắc phục</b>' + fixTxt + '</div><div><b>Lệnh đã gõ</b><span class="st n">' + S.cmdCount + '</span></div></div>';
    if (sc.warn) { var w = sc.warn(S.s); if (w) h += '<div class="verdict bad">⚠ ' + w + '</div>'; }
    h += '<h4>1. Chốt nguyên nhân gốc</h4><p class="hint">Chọn sau khi bạn đã thu thập đủ bằng chứng từ lệnh.</p><div class="opts">';
    S.opts.forEach(function (o, i) {
      var cls = S.diagnosed ? (o.ok ? 'right' : '') : S.picked === i ? 'wrong' : '';
      h += '<label class="opt-r ' + cls + '"><input type="radio" name="cause" data-a="pick" data-v="' + i + '" ' + (S.picked === i ? 'checked' : '') + (S.diagnosed ? ' disabled' : '') + '><span>' + esc(o.t) + '</span></label>';
    });
    h += '</div>';
    if (!S.diagnosed) {
      h += '<div class="field"><button class="btn" data-a="diag">Chốt nguyên nhân</button></div>';
      if (S.tries) h += '<div class="verdict bad">❌ Chưa đúng' + (S.tries >= 2 ? '. Gợi ý: ' + esc(sc.hints[sc.hints.length - 1]) : ' — xem lại kết quả lệnh rồi thử lại.') + '</div>';
    } else h += '<div class="verdict ok">✅ Chính xác.<span>' + sc.why + '</span></div>';
    h += '<h4>2. Gợi ý</h4>';
    if (S.hints) h += '<ol class="hint-list">' + sc.hints.slice(0, S.hints).map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol>';
    h += S.hints < sc.hints.length ? '<button class="markbtn" data-a="hint">💡 Cho tôi gợi ý' + (S.hints ? ' tiếp' : '') + ' (' + S.hints + '/' + sc.hints.length + ')</button>' : '<p class="hint">Đã mở hết gợi ý.</p>';
    if (S.finished) h += '<div class="verdict ok finish">🎉 Hoàn thành tình huống!<span>' + (sc.noFix ? 'Vì sao không tự sửa: ' : '') + sc.after + '</span></div><h4>Mẫu ghi chú đóng ticket</h4><pre class="note-pre">' + esc(sc.note) + '</pre><div class="field"><button class="markbtn" data-a="copynote">📋 Chép ghi chú</button><button class="btn" data-a="nextsc">Tình huống tiếp theo →</button></div>';
    return h;
  }
  function tprint(text, cls) {
    var o = document.getElementById('tout'); if (!o) return;
    var d = document.createElement('div'); d.className = 'l ' + (cls || ''); d.textContent = text; o.appendChild(d);
    var t = document.getElementById('term'); t.scrollTop = t.scrollHeight;
  }
  function renderPanel() { var p = document.getElementById('lab-panel'); if (p) p.innerHTML = panelHtml(); }
  function renderAll() {
    var chips = (S.sc.shell === 'linux' ? CHIPS_LNX : CHIPS_WIN).concat(S.sc.chips || []);
    var seen = {}; chips = chips.filter(function (x) { return seen[x] ? false : (seen[x] = 1); });
    document.getElementById('lab-pick').innerHTML = pickerHtml();
    document.getElementById('lab-main').innerHTML = ticketHtml() +
      '<div class="term-wrap"><div class="term-bar"><span class="dots"><i></i><i></i><i></i></span><span class="term-title">' + (S.sc.shell === 'linux' ? 'ssh ' + S.s.user + '@' + S.s.host : 'Command Prompt / PowerShell — ' + S.s.host) + '</span><button class="term-btn" data-a="reset" title="Làm lại tình huống từ đầu">↺ Làm lại</button><button class="term-btn" data-a="clear">Xoá màn hình</button></div>' +
      '<div class="term" id="term"><div id="tout"></div><div class="tline"><span class="prompt" id="tprompt"></span><input id="tin" autocomplete="off" spellcheck="false" autocapitalize="off" aria-label="Dòng lệnh"></div></div>' +
      '<div class="cmd-chips"><span>Lệnh hay dùng — bấm để chạy:</span>' + chips.map(function (c) { return '<button data-a="chip" data-v="' + esc(c) + '">' + esc(c) + '</button>'; }).join('') + '</div></div>' + actionsHtml();
    document.getElementById('tprompt').textContent = promptStr();
    tprint(S.sc.shell === 'linux' ? 'Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-91-generic x86_64)\nGõ "help" để xem lệnh. Gợi ý: bắt đầu từ df -h hoặc systemctl status.\n' : 'Microsoft Windows [Version 10.0.22631.4890]\n(c) Microsoft Corporation. Giả lập: nhận cả lệnh CMD lẫn PowerShell. Gõ "help" để xem lệnh.\n', 'sys');
    renderPanel();
  }
  function submit(line) {
    var inp = document.getElementById('tin');
    tprint(promptStr() + line, 'echo');
    if (line.trim()) { S.hist.push(line); histIdx = S.hist.length; S.cmdCount++; }
    if (/^(cls|clear)$/i.test(line.trim())) { document.getElementById('tout').innerHTML = ''; }
    else if (line.trim()) { var out = execLine(S, line); if (out !== '' && out != null) tprint(String(out)); }
    inp.value = ''; renderPanel(); checkFinish();
  }
  function checkFinish() {
    if (S.diagnosed && !S.finished && solved()) {
      S.finished = true; var d = scDone();
      if (!d[S.sc.id]) { d[S.sc.id] = 1; T.save(); }
      APP.markActive(); renderPanel(); document.getElementById('lab-pick').innerHTML = pickerHtml();
      var p = document.getElementById('lab-panel'); if (p && p.scrollIntoView && window.innerWidth < 1000) setTimeout(function () { p.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
    }
  }
  var COMPLETE = ['help', 'hostname', 'whoami', 'ipconfig', 'ping', 'nslookup', 'tracert', 'arp', 'netstat', 'tasklist', 'taskkill', 'systeminfo', 'getmac', 'route', 'net', 'sc', 'gpupdate', 'sfc', 'chkdsk', 'dir', 'del', 'netsh', 'shutdown', 'Test-NetConnection', 'Get-Service', 'Get-Process', 'Get-ADUser', 'Unlock-ADAccount', 'Get-Printer', 'Get-PrintJob', 'w32tm', 'nltest', 'cleanmgr', 'fsutil', 'cls'];
  var COMPLETE_L = ['help', 'whoami', 'id', 'hostname', 'pwd', 'uname', 'uptime', 'free', 'ip', 'ping', 'df', 'du', 'ls', 'cat', 'tail', 'systemctl', 'journalctl', 'chmod', 'chown', 'curl', 'truncate', 'lsof', 'sudo', 'clear'];

  TERM.api = { kind: kind, resolve: resolve };

  T.reg({
    id: 'terminal', group: 'net', icon: '💻', short: 'Terminal', title: 'Terminal giả lập — xử lý sự cố thật', lv: 3, min: '10′ / tình huống', days: [2, 3, 4],
    desc: '14 tình huống như ticket thật (mạng, Windows, tài khoản, máy in, Linux). Gõ lệnh trên máy “hỏng”, đọc kết quả, <b>chốt nguyên nhân</b> rồi khắc phục. Có gợi ý, mẫu ghi chú đóng ticket.',
    progress: function () { return [Object.keys(scDone()).length, TERM.scenarios.length]; },
    mount: function (root) {
      root.innerHTML = '<div id="lab-pick"></div><div class="lab"><div class="lab-left" id="lab-main"></div><aside class="lab-panel" id="lab-panel" aria-live="polite"></aside></div>';
      var st = T.stat('terminal'), first = TERM.scenarios.filter(function (x) { return !(st.done || {})[x.id]; })[0] || TERM.scenarios[0];
      pickOpen = !Object.keys(st.done || {}).length;   // lần đầu: mở sẵn danh sách tình huống
      loadScenario(first.id); renderAll();
    },
    ev: function (t, e) {
      if (t === 'keydown' && e.target.id === 'tin') {
        var inp = e.target;
        if (e.key === 'Enter') submit(inp.value);
        else if (e.key === 'ArrowUp') { e.preventDefault(); if (histIdx > 0) inp.value = S.hist[--histIdx] || ''; }
        else if (e.key === 'ArrowDown') { e.preventDefault(); histIdx = Math.min(histIdx + 1, S.hist.length); inp.value = S.hist[histIdx] || ''; }
        else if (e.key === 'Tab' && inp.value && inp.value.indexOf(' ') < 0) {
          e.preventDefault();
          var m = (S.sc.shell === 'linux' ? COMPLETE_L : COMPLETE).filter(function (c) { return c.toLowerCase().indexOf(inp.value.toLowerCase()) === 0; });
          if (m.length === 1) inp.value = m[0] + ' ';
        } else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); document.getElementById('tout').innerHTML = ''; }
        return;
      }
      if (t === 'click' && e.target.closest('.sc-det > summary')) { pickOpen = !e.target.closest('details').open; return; }
      var b = e.target.closest('[data-a]');
      if (!b) { if (t === 'click' && e.target.closest('#term') && !String(window.getSelection())) document.getElementById('tin').focus(); return; }
      var a = b.dataset.a;
      if (t === 'change' && a === 'pick') { S.picked = +b.dataset.v; renderPanel(); return; }
      if (t !== 'click') return;
      if (a === 'cat') { filterCat = b.dataset.v; pickOpen = true; document.getElementById('lab-pick').innerHTML = pickerHtml(); }
      else if (a === 'load') { pickOpen = false; loadScenario(b.dataset.v); renderAll(); document.getElementById('tin').focus(); }
      else if (a === 'reset') { loadScenario(S.sc.id); renderAll(); }
      else if (a === 'clear') { document.getElementById('tout').innerHTML = ''; document.getElementById('tin').focus(); }
      else if (a === 'chip') { submit(b.dataset.v); document.getElementById('tin').focus(); }
      else if (a === 'act') { var act = S.actions[b.dataset.v]; tprint('» ' + act.label.replace(/^\S+\s/, ''), 'act'); tprint(act.run(S.s), 'act'); renderPanel(); checkFinish(); }
      else if (a === 'hint') { S.hints++; renderPanel(); }
      else if (a === 'diag') {
        if (S.picked < 0) { T.toast('Hãy chọn một nguyên nhân trước'); return; }
        if (S.opts[S.picked].ok) { S.diagnosed = true; renderPanel(); checkFinish(); } else { S.tries++; S.picked = -1; renderPanel(); }
      }
      else if (a === 'copynote') T.copy(S.sc.note, b);
      else if (a === 'nextsc') { var i = TERM.scenarios.indexOf(S.sc); loadScenario(TERM.scenarios[(i + 1) % TERM.scenarios.length].id); renderAll(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    }
  });
})();
