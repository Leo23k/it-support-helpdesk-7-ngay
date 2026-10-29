COURSE.days.push({
  n: 3, short: 'Mạng máy tính', title: 'Mạng máy tính: TCP/IP, DHCP, DNS, Wi-Fi, VPN và chẩn đoán “mất mạng”',
  tagline: 'Chủ đề bị hỏi nhiều nhất khi phỏng vấn — và gây ra nhiều ticket nhất.',
  hours: '7–8 giờ',
  intro: 'Gần như mọi lỗi “không vào được X” đều đi qua mạng. Hôm nay bạn học mạng theo hướng của người hỗ trợ: hiểu các khái niệm đủ để <b>suy luận</b> được lỗi nằm ở đâu, và có quy trình từng bước để chẩn đoán “mất mạng”.',
  outcomes: [
    'Giải thích được LAN/WAN, switch/router/AP/firewall, cáp, Wi-Fi 2.4/5GHz',
    'Hiểu OSI/TCP-IP và dùng nó để khoanh vùng lỗi',
    'Đọc và tính subnet cơ bản (/24, /26, /30…), phân biệt IP private/public/APIPA',
    'Giải thích DHCP (DORA), DNS, NAT, ARP và các lỗi điển hình',
    'Dùng ipconfig, ping, tracert, nslookup, netstat… và chẩn đoán “không có internet” trong 5 phút'
  ],
  plan: ['<b>2h</b> Bài 1–3', '<b>1.5h</b> Bài 4–5', '<b>1h</b> Bài 6 (VLAN/VPN/Wi-Fi/firewall)', '<b>2h</b> Lab Packet Tracer + Terminal mô phỏng', '<b>30p</b> Quiz'],
  lessons: [
    {
      id: 'd3-l1', title: 'Thiết bị mạng, cáp và Wi-Fi', min: 40,
      html: `
<p>Mạng máy tính = các thiết bị kết nối để chia sẻ dữ liệu. <b>LAN</b> (mạng cục bộ – trong văn phòng), <b>WAN</b> (mạng diện rộng – nối các chi nhánh/Internet), <b>WLAN</b> (LAN không dây).</p>
<table><thead><tr><th>Thiết bị</th><th>Vai trò</th><th>Hình dung</th></tr></thead><tbody>
<tr><td><b>Switch</b></td><td>Nối các thiết bị trong cùng LAN, chuyển khung dữ liệu theo địa chỉ MAC (Layer 2). Có thể có PoE cấp điện cho camera/điện thoại IP/AP.</td><td>Bảng phân phối điện thoại nội bộ</td></tr>
<tr><td><b>Router</b></td><td>Nối <i>các mạng khác nhau</i> (LAN ↔ Internet), định tuyến theo địa chỉ IP (Layer 3). Thường làm DHCP, NAT.</td><td>Cổng ra bưu điện</td></tr>
<tr><td><b>Access Point (AP)</b></td><td>Phát Wi-Fi, nối thiết bị không dây vào mạng có dây.</td><td>Trạm phát sóng</td></tr>
<tr><td><b>Modem/ONT</b></td><td>Chuyển tín hiệu nhà mạng (cáp quang/ADSL) thành tín hiệu mạng.</td><td>Bộ chuyển đổi đường truyền</td></tr>
<tr><td><b>Firewall</b></td><td>Lọc lưu lượng theo luật (cho/chặn IP, cổng, ứng dụng).</td><td>Bảo vệ cổng công ty</td></tr>
<tr><td><b>Hub</b></td><td>Cũ, phát tới mọi cổng — đã bị switch thay thế.</td><td>—</td></tr>
</tbody></table>
<h3>Cáp mạng</h3>
<ul>
<li><b>Cáp đồng xoắn đôi (UTP):</b> Cat5e (1Gbps, ≤100m), Cat6 (1–10Gbps tuỳ chiều dài), Cat6a (10Gbps 100m). Đầu <b>RJ45</b>.</li>
<li>Chuẩn bấm cáp <b>T568B</b>: Trắng-cam, Cam, Trắng-lục, Xanh dương, Trắng-xanh dương, Lục, Trắng-nâu, Nâu. Cáp thẳng (cùng chuẩn 2 đầu) nối PC–switch; hiện nay switch có Auto-MDIX nên ít khi cần cáp chéo.</li>
<li><b>Cáp quang:</b> đường dài, tốc độ cao (single-mode đường dài, multi-mode ngắn).</li>
<li>Giới hạn UTP: <b>100 mét</b>/đoạn.</li>
</ul>
<aside class="tip"><p>Đèn LED cổng mạng cho biết rất nhiều: không sáng = không có link (cáp/cổng/NIC hỏng hoặc thiết bị đầu kia tắt); xanh/cam nhấp nháy = có lưu lượng. Dùng <b>máy test cáp</b> khi nghi ngờ cáp bấm sai/đứt.</p></aside>
<h3>Wi-Fi</h3>
<table><thead><tr><th>Chuẩn</th><th>Tên</th><th>Băng tần</th><th>Tốc độ lý thuyết</th></tr></thead><tbody>
<tr><td>802.11n</td><td>Wi-Fi 4</td><td>2.4 / 5 GHz</td><td>~600 Mbps</td></tr>
<tr><td>802.11ac</td><td>Wi-Fi 5</td><td>5 GHz</td><td>~3.5 Gbps</td></tr>
<tr><td>802.11ax</td><td>Wi-Fi 6/6E</td><td>2.4 / 5 / (6) GHz</td><td>~9.6 Gbps</td></tr>
</tbody></table>
<ul>
<li><b>2.4GHz:</b> xa, xuyên tường tốt, nhưng chậm &amp; nhiễu (lò vi sóng, Bluetooth). <b>5GHz:</b> nhanh, phạm vi ngắn hơn.</li>
<li>Bảo mật: <b>WPA2/WPA3</b>. <b>WPA2-Enterprise (802.1X)</b> dùng tài khoản domain thay vì mật khẩu chung — phổ biến ở công ty. Tránh WEP/Open.</li>
<li><b>SSID</b> = tên mạng. <b>Captive portal</b> = trang đăng nhập Wi-Fi khách.</li>
<li>Lỗi hay gặp: tín hiệu yếu (xa AP, vật cản), nhiễu kênh, DHCP hết địa chỉ, sai mật khẩu/đã đổi mật khẩu domain, driver Wi-Fi cũ, chế độ máy bay/ nút Wi-Fi tắt.</li>
</ul>`
    },
    {
      id: 'd3-l2', title: 'Mô hình OSI & TCP/IP, TCP vs UDP, cổng (port)', min: 35,
      html: `
<p>Mô hình OSI chia việc truyền dữ liệu thành 7 tầng. Bạn không cần thuộc lòng lý thuyết, mà cần dùng nó để <b>khoanh vùng lỗi</b>.</p>
<table><thead><tr><th>#</th><th>Tầng</th><th>Làm gì</th><th>Ví dụ / Thiết bị</th><th>Lỗi điển hình</th></tr></thead><tbody>
<tr><td>7</td><td>Application</td><td>Dịch vụ cho người dùng</td><td>HTTP, DNS, SMTP, RDP</td><td>Trang web lỗi, app báo lỗi</td></tr>
<tr><td>6</td><td>Presentation</td><td>Mã hoá, định dạng</td><td>TLS, JPEG</td><td>Lỗi chứng chỉ SSL</td></tr>
<tr><td>5</td><td>Session</td><td>Quản lý phiên</td><td>Thiết lập/kết thúc phiên</td><td>Rớt phiên VPN</td></tr>
<tr><td>4</td><td>Transport</td><td>Truyền tin cậy/nhanh, cổng</td><td>TCP, UDP</td><td>Firewall chặn cổng</td></tr>
<tr><td>3</td><td>Network</td><td>Địa chỉ IP, định tuyến</td><td>Router, IP, ICMP</td><td>Sai IP/gateway, không ping được</td></tr>
<tr><td>2</td><td>Data Link</td><td>MAC, khung, switch</td><td>Switch, Wi-Fi AP, VLAN</td><td>Xung đột IP/MAC, lỗi VLAN, loop</td></tr>
<tr><td>1</td><td>Physical</td><td>Tín hiệu, cáp</td><td>Cáp, cổng, NIC</td><td>Cáp đứt, đèn link tắt</td></tr>
</tbody></table>
<aside class="tip"><p>Ghi nhớ khi troubleshoot: <b>bottom-up</b> (từ cáp lên ứng dụng) khi nghi phần cứng; <b>top-down</b> khi chỉ một ứng dụng lỗi; <b>divide &amp; conquer</b> (bắt đầu từ tầng 3: ping) là cách nhanh nhất. Câu mnemonic: “<i>Please Do Not Throw Sausage Pizza Away</i>” (Physical → Application).</p></aside>
<h3>TCP/IP (4 tầng thực tế)</h3>
<p>Application (7-6-5) · Transport (4) · Internet (3) · Network Access (2-1). Khi dữ liệu đi xuống, mỗi tầng thêm “phong bì” (header) — <b>đóng gói (encapsulation)</b>: Data → Segment (TCP/UDP) → Packet (IP) → Frame (Ethernet) → Bits.</p>
<h3>TCP vs UDP</h3>
<table><thead><tr><th></th><th>TCP</th><th>UDP</th></tr></thead><tbody>
<tr><td>Kết nối</td><td>Có (bắt tay 3 bước SYN, SYN-ACK, ACK)</td><td>Không</td></tr>
<tr><td>Độ tin cậy</td><td>Đảm bảo, có truyền lại</td><td>Không đảm bảo</td></tr>
<tr><td>Dùng cho</td><td>Web, email, file, RDP</td><td>DNS, video call, VoIP, DHCP</td></tr>
</tbody></table>
<h3>Cổng (port) — số “cửa” của dịch vụ</h3>
<p>Cổng giúp một máy có IP duy nhất chạy nhiều dịch vụ. Xem bảng đầy đủ ở trang <a href="#/tools">Công cụ</a>. Cần nhớ trước: <b>80 HTTP · 443 HTTPS · 22 SSH · 3389 RDP · 53 DNS · 67/68 DHCP · 25/587 SMTP · 445 SMB (file share) · 143/993 IMAP · 110/995 POP3 · 21 FTP · 23 Telnet · 389/636 LDAP</b>.</p>
<aside class="ex"><p>User RDP vào máy chủ báo lỗi. Bạn chạy <code>Test-NetConnection server01 -Port 3389</code> → <code>TcpTestSucceeded : False</code> → firewall/dịch vụ RDP chưa mở ở tầng 4. Nếu <code>True</code> thì lỗi nằm ở tài khoản/quyền, không phải mạng.</p></aside>`
    },
    {
      id: 'd3-l3', title: 'Địa chỉ IP & Subnet — tính tay được', min: 55,
      html: `
<h3>IPv4</h3>
<p>Địa chỉ IPv4 gồm 32 bit, viết 4 số thập phân (0–255), ví dụ <code>192.168.1.45</code>. Mỗi địa chỉ có hai phần: <b>phần mạng (network)</b> và <b>phần máy (host)</b>, tách bởi <b>subnet mask</b> (vd <code>255.255.255.0</code> = <code>/24</code> — 24 bit đầu là phần mạng).</p>
<h3>Dải địa chỉ đặc biệt cần thuộc</h3>
<table><thead><tr><th>Dải</th><th>Ý nghĩa</th></tr></thead><tbody>
<tr><td><code>10.0.0.0/8</code> · <code>172.16.0.0/12</code> (172.16–172.31) · <code>192.168.0.0/16</code></td><td><b>Private</b> (RFC1918): dùng trong mạng nội bộ, không định tuyến trên Internet</td></tr>
<tr><td><code>169.254.x.x</code></td><td><b>APIPA</b>: máy tự gán khi <b>không lấy được IP từ DHCP</b> → dấu hiệu DHCP/kết nối lỗi</td></tr>
<tr><td><code>127.0.0.1</code></td><td><b>Loopback</b>: chính máy này (kiểm tra TCP/IP stack)</td></tr>
<tr><td>Còn lại</td><td><b>Public</b>: định tuyến được trên Internet</td></tr>
</tbody></table>
<h3>Default gateway</h3>
<p>Địa chỉ router mà máy gửi gói tin tới khi đích <b>không</b> nằm trong cùng subnet. Gateway sai / không liên lạc được ⇒ vào được LAN nhưng không ra Internet.</p>
<h3>Subnet — cách tính nhanh</h3>
<p>Prefix <code>/n</code> nghĩa là n bit mạng, <code>32−n</code> bit host. Số host dùng được = <code>2^(32−n) − 2</code> (trừ địa chỉ mạng và broadcast). Đáp án thuộc lòng:</p>
<table><thead><tr><th>Prefix</th><th>Mask</th><th>Số host</th><th>Bước nhảy octet cuối</th></tr></thead><tbody>
<tr><td>/24</td><td>255.255.255.0</td><td>254</td><td>256</td></tr>
<tr><td>/25</td><td>255.255.255.128</td><td>126</td><td>128</td></tr>
<tr><td>/26</td><td>255.255.255.192</td><td>62</td><td>64</td></tr>
<tr><td>/27</td><td>255.255.255.224</td><td>30</td><td>32</td></tr>
<tr><td>/28</td><td>255.255.255.240</td><td>14</td><td>16</td></tr>
<tr><td>/29</td><td>255.255.255.248</td><td>6</td><td>8</td></tr>
<tr><td>/30</td><td>255.255.255.252</td><td>2</td><td>4</td></tr>
</tbody></table>
<aside class="ex"><h4>Ví dụ: 192.168.10.77/26</h4>
<p>Mask /26 → bước nhảy 64 ở octet cuối. Các mạng: .0, .64, .128, .192. Số 77 nằm trong khối .64 → <b>Network = 192.168.10.64</b>; <b>Broadcast = .127</b> (khối kế tiếp trừ 1); host dùng được <b>.65 → .126</b> (62 host). Thử lại bằng <a href="#/tools">máy tính subnet</a>.</p></aside>
<aside class="ex"><h4>Ví dụ lỗi “khác subnet”</h4>
<p>PC A: 192.168.1.10/24, PC B: 192.168.<b>2</b>.20/24. Không ping được nhau vì khác mạng (cần router). Hoặc: PC A có mask 255.255.255.<b>128</b> (/25) và gateway .1; PC B .200 nằm ngoài /25 → máy A gửi nó qua gateway thay vì trực tiếp. Sai mask là lỗi rất “ngầm”.</p></aside>
<h3>Địa chỉ MAC &amp; IPv6 (nắm sơ lược)</h3>
<ul><li><b>MAC</b>: địa chỉ vật lý 48-bit của card mạng (vd <code>8C-16-45-A2-3F-1B</code>), dùng trong LAN. <b>ARP</b> dịch IP ↔ MAC (<code>arp -a</code>).</li><li><b>IPv6</b>: 128 bit, dạng <code>2001:db8::1</code>; có SLAAC, link-local <code>fe80::</code>. Nhiều doanh nghiệp vẫn chủ yếu dùng IPv4 nên bạn chỉ cần nhận biết.</li></ul>
<aside class="job"><p>IP tĩnh vs động: PC người dùng thường lấy IP động (DHCP); máy in, server, camera thường dùng IP tĩnh hoặc <b>DHCP reservation</b> (gắn IP cố định theo MAC). Tránh tự đặt IP tĩnh trên máy người dùng, dễ gây xung đột IP.</p></aside>`
    },
    {
      id: 'd3-l4', title: 'DHCP, DNS, NAT, ARP — bốn dịch vụ “sống còn”', min: 45,
      html: `
<h3>DHCP — tự cấp địa chỉ</h3>
<p>DHCP server cấp cho máy: <b>IP, subnet mask, default gateway, DNS server, thời gian thuê (lease)</b>. Quy trình <b>DORA</b>:</p>
<ol class="steps"><li><b>Discover:</b> máy mới “la lên” (broadcast): ai là DHCP server?</li><li><b>Offer:</b> server đề xuất 1 IP.</li><li><b>Request:</b> máy xác nhận chọn IP đó.</li><li><b>Acknowledge:</b> server đồng ý, ghi nhận lease.</li></ol>
<ul><li>Không nhận được trả lời ⇒ máy tự gán <code>169.254.x.x</code>. Nguyên nhân: không có link, DHCP server tắt, <b>hết dải địa chỉ (scope exhausted)</b>, VLAN sai, rogue DHCP (router lạ cắm vào mạng cấp IP sai).</li><li>Xử lý: <code>ipconfig /release</code> rồi <code>ipconfig /renew</code>; kiểm tra cáp/Wi-Fi; kiểm tra DHCP scope.</li></ul>
<h3>DNS — “danh bạ” của Internet</h3>
<p>DNS dịch tên (<code>google.com</code>) thành IP. Nếu bạn ping được <code>8.8.8.8</code> nhưng không ping được <code>google.com</code> ⇒ <b>lỗi DNS</b> (một câu trả lời phỏng vấn kinh điển!).</p>
<table><thead><tr><th>Bản ghi</th><th>Chức năng</th><th>Ví dụ</th></tr></thead><tbody>
<tr><td><b>A</b></td><td>Tên → IPv4</td><td>www.corp.com → 203.0.113.10</td></tr>
<tr><td><b>AAAA</b></td><td>Tên → IPv6</td><td></td></tr>
<tr><td><b>CNAME</b></td><td>Bí danh (tên trỏ tên)</td><td>mail → outlook.office365.com</td></tr>
<tr><td><b>MX</b></td><td>Máy chủ nhận email của domain</td><td>corp.com → mail server</td></tr>
<tr><td><b>TXT</b></td><td>Văn bản: SPF, DKIM, DMARC, xác minh domain</td><td>v=spf1 include:spf.protection.outlook.com -all</td></tr>
<tr><td><b>PTR</b></td><td>IP → tên (ngược)</td><td></td></tr>
<tr><td><b>NS</b></td><td>DNS server có thẩm quyền của domain</td><td></td></tr>
</tbody></table>
<p>Quy trình phân giải: máy → <b>cache cục bộ</b> → DNS server của công ty (hoặc ISP) → root → TLD (.com) → authoritative. Trong công ty dùng AD, <b>DNS nội bộ là bắt buộc</b> (domain controller cũng là DNS) — nếu máy trỏ DNS 8.8.8.8 thì không tìm thấy domain.</p>
<aside class="warn"><p>Cache DNS cũ gây lỗi “trang web đổi IP nhưng máy vẫn vào IP cũ”. Xoá: <code>ipconfig /flushdns</code>. File <code>C:\\Windows\\System32\\drivers\\etc\\hosts</code> có thể ghi đè DNS (cũng là chỗ malware hay sửa).</p></aside>
<h3>NAT — nhiều máy dùng chung 1 IP public</h3>
<p>Router thay IP private của máy bằng IP public khi ra Internet (<b>PAT</b> dùng thêm số cổng để phân biệt). Nhờ đó 200 máy dùng chung 1 IP công cộng. Hệ quả: từ Internet không “gọi vào” thẳng máy trong LAN được, trừ khi cấu hình <b>port forwarding</b>.</p>
<h3>ARP</h3>
<p>Khi máy biết IP đích trong cùng LAN nhưng chưa biết MAC, nó hỏi ARP: “ai có IP này?”. <code>arp -a</code> xem bảng. Xung đột IP (hai máy cùng IP) hiện cảnh báo “IP address conflict” → tìm máy kia bằng <code>arp -a</code> hoặc xem MAC trên switch.</p>`
    },
    {
      id: 'd3-l5', title: 'Lệnh mạng & quy trình “không có Internet” trong 5 phút', min: 55,
      html: `
<h3>Bộ lệnh nên gõ không cần nghĩ</h3>
<table><thead><tr><th>Lệnh</th><th>Dùng để</th></tr></thead><tbody>
<tr><td><code>ipconfig</code> / <code>ipconfig /all</code></td><td>Xem IP, mask, gateway, DNS, MAC, DHCP server, thời hạn lease</td></tr>
<tr><td><code>ipconfig /release</code> + <code>/renew</code></td><td>Xin IP mới từ DHCP</td></tr>
<tr><td><code>ipconfig /flushdns</code></td><td>Xoá cache DNS</td></tr>
<tr><td><code>ping &lt;ip|tên&gt;</code> (<code>-t</code> liên tục)</td><td>Kiểm tra thông mạng + độ trễ + mất gói</td></tr>
<tr><td><code>tracert &lt;đích&gt;</code></td><td>Liệt kê các chặng (hop) tới đích, tìm chỗ nghẽn/đứt</td></tr>
<tr><td><code>nslookup &lt;tên&gt; [dns-server]</code></td><td>Hỏi trực tiếp DNS; kiểm tra bản ghi MX/TXT: <code>nslookup -type=mx corp.com</code></td></tr>
<tr><td><code>netstat -ano</code></td><td>Kết nối và cổng đang mở, PID của tiến trình</td></tr>
<tr><td><code>arp -a</code></td><td>Bảng IP ↔ MAC</td></tr>
<tr><td><code>pathping</code></td><td>Kết hợp ping + tracert, thống kê mất gói từng chặng</td></tr>
<tr><td><code>route print</code></td><td>Bảng định tuyến máy</td></tr>
<tr><td><code>netsh wlan show profiles</code> / <code>netsh winsock reset</code> / <code>netsh int ip reset</code></td><td>Quản lý Wi-Fi; reset ngăn xếp mạng (cần restart)</td></tr>
<tr><td><code>Test-NetConnection host -Port 443</code> (PowerShell)</td><td>Kiểm tra mở cổng TCP</td></tr>
</tbody></table>
<h3>Quy trình chẩn đoán: “Tôi không vào được Internet”</h3>
<pre><code>Bước 1  Vật lý:    Cáp cắm chưa? Đèn cổng sáng? Wi-Fi bật chưa, có đúng SSID? Chế độ máy bay?
Bước 2  ipconfig:  Có IP hợp lệ không?
                   - 169.254.x.x  -> lỗi DHCP / kết nối   (ipconfig /renew, kiểm tra cáp, DHCP)
                   - IP lạ/khác dải -> sai VLAN / rogue DHCP
Bước 3  ping 127.0.0.1           -> OK: card mạng/TCP-IP ổn
Bước 4  ping &lt;default gateway&gt;   -> Fail: lỗi LAN (cáp, switch, AP, VLAN, gateway tắt)
Bước 5  ping 8.8.8.8             -> Fail: lỗi từ router ra ISP (router/modem/đường truyền)
Bước 6  ping google.com          -> Fail (nhưng 8.8.8.8 OK): LỖI DNS (kiểm tra DNS server, flushdns, nslookup)
Bước 7  Chỉ 1 website lỗi?       -> Website/proxy/firewall/cổng 80,443; thử trình duyệt khác, tắt VPN/proxy</code></pre>
<aside class="ex"><p>User: “Tôi vào được Teams nhưng không vào được web nội bộ intranet.corp.local”. <code>ping intranet.corp.local</code> → “could not find host”. <code>ipconfig /all</code> thấy DNS = 8.8.8.8 (do VPN cấu hình sai). Đổi sang DNS nội bộ/kết nối lại VPN → hết lỗi. Đây chính là mô phỏng <b>Sự cố D</b> trong <a href="#/tools">terminal mô phỏng</a>.</p></aside>
<h3>Đọc kết quả ping</h3>
<ul>
<li><code>Reply from … time=14ms TTL=117</code>: thông. Time cao (&gt;150ms) liên tục: nghẽn/Wi-Fi yếu.</li>
<li><code>Request timed out</code>: gói không có phản hồi (đích tắt, bị firewall chặn ICMP, hoặc đứt giữa đường). <i>Lưu ý: nhiều máy chặn ping nên “timed out” chưa chắc mất mạng.</i></li>
<li><code>Destination host unreachable</code>: router/hệ thống báo không có đường tới đích.</li>
<li><code>General failure</code>: thường card mạng chưa có IP/driver.</li>
<li><code>Could not find host</code>: lỗi DNS.</li>
</ul>
<aside class="tip"><p>Nếu có thể chỉ mất mạng ở <b>một</b> máy, so sánh với máy bên cạnh cùng cổng/Wi-Fi: khác ⇒ lỗi máy; giống ⇒ lỗi hạ tầng (chuyển L2/mạng với bằng chứng).</p></aside>
<h3>Một số sự cố mạng thường gặp</h3>
<table><thead><tr><th>Hiện tượng</th><th>Nguyên nhân thường gặp</th></tr></thead><tbody>
<tr><td>Wi-Fi “connected, no internet”</td><td>Gateway/DNS lỗi, captive portal chưa đăng nhập, DHCP hết IP</td></tr>
<tr><td>Wi-Fi chập chờn</td><td>Tín hiệu yếu, nhiễu kênh, quá nhiều client, driver cũ, chế độ tiết kiệm điện NIC</td></tr>
<tr><td>Chậm toàn mạng</td><td>Băng thông bị chiếm (download/backup), loop mạng, switch lỗi, DNS chậm</td></tr>
<tr><td>Chỉ đi được vài trang</td><td>Proxy/firewall/web filter, DNS lọc, MTU</td></tr>
<tr><td>Không thấy máy in mạng</td><td>Khác VLAN/subnet, IP máy in đổi (dùng reservation), firewall chặn cổng 9100/631</td></tr>
</tbody></table>`
    },
    {
      id: 'd3-l6', title: 'VLAN, VPN, Firewall, Proxy — những thứ bạn sẽ gặp ở công ty', min: 40,
      html: `
<h3>VLAN</h3>
<p>VLAN chia một switch vật lý thành nhiều mạng logic (vd VLAN 10 Kế toán, VLAN 20 Sales, VLAN 30 Wi-Fi khách). Lợi ích: bảo mật, giảm broadcast, quản lý dễ. Các VLAN muốn nói chuyện cần qua router/Layer-3 switch.</p>
<ul><li><b>Access port:</b> cổng gắn vào PC, thuộc 1 VLAN.</li><li><b>Trunk port:</b> cổng nối giữa switch/router, mang nhiều VLAN (802.1Q tag).</li><li>Dấu hiệu sai VLAN: máy nhận IP ở dải lạ, không thấy máy in/file server dù cùng văn phòng.</li></ul>
<h3>VPN</h3>
<p>VPN tạo “đường hầm” mã hoá qua Internet để nhân viên làm từ xa truy cập tài nguyên nội bộ. Gồm VPN client (GlobalProtect, FortiClient, Cisco AnyConnect, OpenVPN, WireGuard, Always On VPN…) và VPN gateway ở firewall. Lỗi thường gặp:</p>
<ul>
<li>Sai mật khẩu / tài khoản bị khoá / hết hạn mật khẩu / chưa MFA.</li>
<li>Mạng nhà chặn cổng VPN (UDP 500/4500, 443). Thử mạng 4G.</li>
<li>Kết nối được nhưng không vào được tài nguyên nội bộ → DNS/route (split tunnel), IP nhà trùng dải IP công ty (192.168.1.x).</li>
<li>Chứng chỉ máy hết hạn; client cũ; thời gian máy sai.</li>
</ul>
<h3>Firewall &amp; Proxy</h3>
<ul>
<li><b>Firewall</b> chặn/cho theo luật (nguồn, đích, cổng). Windows Defender Firewall có luật inbound/outbound trên từng máy; firewall mạng (Fortinet, Palo Alto, pfSense…) bảo vệ biên.</li>
<li><b>Proxy / Web filter</b> kiểm soát truy cập web. Lỗi “trang bị chặn” → kiểm tra category; yêu cầu mở qua quy trình duyệt.</li>
<li><b>Zero Trust:</b> xu hướng mới — không tin tưởng mặc định, xác minh mỗi truy cập (MFA, tình trạng thiết bị).</li>
</ul>
<h3>Cisco / thiết bị mạng — nhập môn</h3>
<p>Helpdesk không cấu hình thiết bị nhưng hay phải “đọc” chúng. Vài lệnh Cisco cơ bản:</p>
<pre><code>show ip interface brief       # trạng thái các cổng (up/down)
show vlan brief               # cổng nào thuộc VLAN nào
show mac address-table        # MAC nào ở cổng nào
show running-config           # cấu hình hiện tại
interface g0/1
 switchport mode access
 switchport access vlan 10
 no shutdown</code></pre>
<aside class="job"><p>Khi gặp “1 PC mất mạng”: nhờ team mạng xem cổng switch của PC đó: <i>up/down? VLAN đúng? port-security khoá cổng vì đổi thiết bị? PoE có cấp điện?</i> Bạn nói đúng thuật ngữ → được phục vụ nhanh hơn.</p></aside>`
    }
  ],
  lab: {
    title: 'Dựng mạng văn phòng nhỏ bằng Cisco Packet Tracer + luyện terminal mô phỏng',
    html: `
<p><b>Thời gian:</b> ~2 giờ. <b>Công cụ:</b> Cisco Packet Tracer (miễn phí, đăng ký tài khoản Cisco Networking Academy “Introduction to Packet Tracer” để tải) hoặc GNS3. Nếu chưa tải được, dùng terminal ở trang <a href="#/tools">Công cụ</a> làm phần 4.</p>
<ol class="steps">
<li><b>Sơ đồ:</b> 1 Router (2911) – 1 Switch (2960) – 4 PC; 1 Server làm DHCP/DNS/Web; 1 máy in. Đặt IP router LAN <code>192.168.10.1/24</code>.</li>
<li><b>DHCP:</b> trên Server bật DHCP, pool <code>192.168.10.100–200</code>, gateway <code>192.168.10.1</code>, DNS <code>192.168.10.5</code>. Đặt PC sang DHCP và kiểm tra nhận IP bằng <code>ipconfig</code>.</li>
<li><b>DNS:</b> trên Server tạo bản ghi A: <code>intranet.lab → 192.168.10.5</code>. Từ PC: <code>nslookup intranet.lab</code>, mở trình duyệt vào <code>http://intranet.lab</code>.</li>
<li><b>VLAN (nâng cao):</b> tạo VLAN 10 (Kế toán) và VLAN 20 (Sales) trên switch; PC1–2 VLAN10, PC3–4 VLAN20; router-on-a-stick (sub-interface) để các VLAN liên lạc. Kiểm tra bằng ping.</li>
<li><b>Tự phá rồi sửa (quan trọng nhất):</b> lần lượt gây 5 lỗi và chẩn đoán theo quy trình Bài 5, ghi lại trong bảng “triệu chứng → lệnh dùng → nguyên nhân → cách sửa”: <ol type="a"><li>Rút cáp PC1 (hoặc shutdown cổng switch).</li><li>Đặt sai gateway cho PC2.</li><li>Đặt sai subnet mask cho PC3.</li><li>Xoá bản ghi DNS hoặc đặt DNS sai.</li><li>Tắt DHCP server → PC mới nhận APIPA.</li></ol></li>
<li><b>Terminal mô phỏng:</b> vào trang Công cụ, chọn lần lượt Sự cố A, B, C, D và tìm nguyên nhân chỉ bằng lệnh. Sau đó bấm “Xem đáp án” đối chiếu.</li>
<li><b>Subnet:</b> tự tính tay 10 bài (ví dụ 172.16.5.200/27, 10.1.1.130/25, 192.168.50.17/29…), rồi kiểm tra bằng công cụ.</li>
</ol>
<p><b>Sản phẩm để lưu:</b> file <code>.pkt</code>, ảnh sơ đồ, bảng 5 lỗi đã chẩn đoán. Đây là “Dự án 3” trong mục dự án CV.</p>`
  },
  quiz: [
    { q: 'Máy tính có IP 169.254.37.8. Điều này nghĩa là gì?', o: ['Đang dùng IP public', 'Không nhận được IP từ DHCP (APIPA)', 'Đang kết nối VPN', 'Máy bị nhiễm virus'], a: 1, e: 'Dải 169.254.0.0/16 là APIPA — máy tự gán khi không liên lạc được DHCP server.' },
    { q: 'Ping 8.8.8.8 thành công nhưng ping google.com báo “could not find host”. Lỗi nằm ở đâu?', o: ['Cáp mạng', 'Default gateway', 'DNS', 'DHCP lease'], a: 2, e: 'Có kết nối IP nhưng không phân giải được tên → DNS.' },
    { q: 'Thiết bị nào chuyển gói tin giữa HAI mạng IP khác nhau?', o: ['Hub', 'Switch layer 2', 'Router', 'Access Point'], a: 2, e: 'Router (Layer 3) định tuyến giữa các mạng khác nhau.' },
    { q: 'Số host dùng được trong mạng /26 là?', o: ['64', '62', '30', '126'], a: 1, e: '2^6 − 2 = 62.' },
    { q: 'Quy trình DHCP đúng là?', o: ['Offer – Discover – Request – Ack', 'Discover – Offer – Request – Acknowledge', 'Request – Offer – Ack – Discover', 'Discover – Request – Offer – Ack'], a: 1, e: 'DORA: Discover, Offer, Request, Acknowledge.' },
    { q: 'Cổng mặc định của RDP (Remote Desktop) là?', o: ['22', '80', '443', '3389'], a: 3, e: 'RDP dùng TCP 3389. SSH là 22.' },
    { q: 'Giao thức nào ưu tiên tốc độ hơn độ tin cậy, dùng cho DNS và video call?', o: ['TCP', 'UDP', 'ICMP', 'ARP'], a: 1, e: 'UDP không kết nối, ít overhead — phù hợp truy vấn DNS, VoIP, streaming.' },
    { q: 'Lệnh nào xem hết các “chặng” mà gói tin đi qua tới đích?', o: ['ipconfig', 'nslookup', 'tracert', 'netstat'], a: 2, e: 'tracert (Windows) / traceroute (Linux).' },
    { q: 'Hai PC cùng cắm vào một switch nhưng PC A là 192.168.1.10/24 còn PC B là 192.168.2.20/24 không ping được nhau. Vì sao?', o: ['Cáp hỏng', 'Khác subnet, cần router để liên lạc', 'DNS lỗi', 'Switch tắt'], a: 1, e: 'Hai địa chỉ thuộc hai mạng /24 khác nhau; muốn giao tiếp cần định tuyến.' }
  ],
  scenarios: [
    { q: '<b>Tình huống:</b> “Cả phòng Kế toán 12 người mất mạng lúc 14h, phòng khác bình thường.” PC của bạn thử: IP hợp lệ nhận từ DHCP, ping gateway bị timeout. Bước tiếp theo?', o: ['Cài lại Windows từng máy', 'Khoanh vùng: cắm thử PC vào ổ mạng khác / cáp khác, kiểm tra switch tầng phòng Kế toán (đèn, nguồn), báo team mạng kèm bằng chứng; coi là P2 do ảnh hưởng cả phòng', 'Đổi DNS từng máy', 'Chờ người dùng tự hết lỗi'], a: 1, e: 'Nhiều máy cùng lỗi + ping gateway fail ⇒ hạ tầng LAN (switch/uplink/VLAN). Khoanh vùng nhanh rồi escalate với thông tin cụ thể.' },
    { q: '<b>Tình huống:</b> Nhân viên làm việc tại nhà: VPN kết nối thành công nhưng mở \\\\fileserver không được, trong khi Teams và Outlook dùng bình thường. Bạn kiểm tra gì?', o: ['Cài lại Office', 'ping/nslookup fileserver qua VPN → xem DNS nào đang dùng (ipconfig /all), có phải split-tunnel/thiếu route tới mạng nội bộ không; thử ping bằng IP; xem IP mạng nhà có trùng dải nội bộ không', 'Đổi mật khẩu Wi-Fi nhà', 'Format máy'], a: 1, e: 'Teams/Outlook là dịch vụ cloud (không cần VPN); file server nội bộ cần DNS/route qua VPN.' },
    { q: '<b>Tình huống:</b> Sau khi cắm một router Wi-Fi cá nhân vào ổ mạng văn phòng, nhiều máy nhận IP 192.168.0.x và không vào được hệ thống. Nguyên nhân?', o: ['Windows Update', 'Rogue DHCP — router lạ cấp IP sai', 'Hết RAM', 'DNS cache'], a: 1, e: 'Router lạ chạy DHCP làm cấp IP/gateway sai. Gỡ thiết bị, bật DHCP snooping ở switch, thu hồi và xin lại IP trên máy bị ảnh hưởng.' }
  ]
});
