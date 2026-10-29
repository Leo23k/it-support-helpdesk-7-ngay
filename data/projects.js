COURSE.projects.push(
{
  title: 'Home lab Active Directory (Windows Server 2022 + Client)', level: 'Bắt buộc', time: '3–4 giờ',
  html: `
<p><b>Vì sao quan trọng:</b> Active Directory xuất hiện trong phần lớn JD helpdesk/IT admin. Dự án này chứng minh bạn <i>thật sự</i> đã dựng và quản lý domain.</p>
<h3>Mục tiêu</h3>
<ul><li>Dựng domain <code>corp.local</code> trên 1 DC + 1–2 client.</li><li>Cấu trúc OU theo chi nhánh/phòng ban, user/nhóm theo AGDLP.</li><li>File server với quyền theo nhóm, ổ ánh xạ qua GPO, GPO bảo mật cơ bản.</li><li>Quy trình onboarding/offboarding, reset mật khẩu, mở khoá, xử lý trust relationship.</li></ul>
<h3>Thực hiện</h3>
<p>Làm đúng theo <a href="#/day/4">Lab Ngày 4</a>. Tuỳ chọn nâng cao: thêm DC thứ hai và kiểm tra replication; cấu hình DHCP failover; cài LAPS cho mật khẩu admin cục bộ; Windows Admin Center.</p>
<h3>Cần có trong repo (<code>01-home-lab-ad/</code>)</h3>
<ul><li><code>README.md</code>: sơ đồ (draw.io), mô tả IP/domain/OU, danh sách GPO và lý do.</li><li>Ảnh: ADUC (cấu trúc OU), GPMC (GPO), <code>gpresult</code>, join domain, quyền NTFS.</li><li><code>New-Users.ps1</code> + <code>users.csv</code> (không chứa mật khẩu thật).</li><li>Checklist onboarding/offboarding (markdown).</li><li>“Sự cố đã gặp &amp; cách xử lý” (ít nhất 5 mục).</li></ul>
<h3>Câu mô tả cho CV</h3>
<pre><code>Home Lab Active Directory - Windows Server 2022 (VirtualBox)
- Dựng domain corp.local gồm DC, DNS, DHCP và 2 client Windows 11; thiết kế 6 OU và 25 tài khoản người dùng bằng PowerShell/CSV
- Triển khai 3 GPO (map ổ, chặn USB, chính sách mật khẩu) và phân quyền file server theo nhóm AGDLP
- Mô phỏng & xử lý 8 sự cố: khoá tài khoản, trust relationship, GPO không áp dụng, DNS sai... Ghi lại thành bài KB</code></pre>
<aside class="tip"><p>Chuẩn bị trả lời khi phỏng vấn: “Vì sao DC phải trỏ DNS về chính nó?”, “LSDOU là gì?”, “Bạn debug GPO không áp dụng ra sao?”.</p></aside>`
},
{
  title: 'Hệ thống Ticket & Knowledge Base (GLPI / osTicket / Freshservice)', level: 'Bắt buộc', time: '3 giờ',
  html: `
<p><b>Vì sao quan trọng:</b> Mọi helpdesk đều làm việc qua ticket. Có kinh nghiệm cấu hình và vận hành một hệ thống ticket (dù là lab) làm bạn khác biệt ngay.</p>
<h3>Mục tiêu</h3>
<ul><li>Cài một hệ thống ticket miễn phí (GLPI hoặc osTicket) bằng Docker hoặc XAMPP; hoặc dùng bản dùng thử Jira Service Management (nhiều tin JD nhắc Jira), Freshservice hoặc Zendesk.</li><li>Thiết kế danh mục (category), mức ưu tiên P1–P4, SLA, mẫu trả lời, quy tắc phân công.</li><li>Tạo ≥ 30 ticket mô phỏng đa dạng (Windows, mạng, Outlook, in ấn, tài khoản) và giải quyết đầy đủ.</li><li>Viết ≥ 10 bài KB chất lượng.</li></ul>
<h3>Các bước</h3>
<ol class="steps">
<li>Cài đặt (ví dụ GLPI bằng Docker): <pre><code>docker compose up -d   # với file docker-compose của GLPI + MariaDB
# truy cập http://localhost:8080 và hoàn thành wizard</code></pre></li>
<li>Tạo nhóm hỗ trợ (L1, L2, Network), người dùng thử, thực thể/văn phòng.</li>
<li>Cấu hình SLA: P1 phản hồi 15 phút/giải quyết 4h; P2 30 phút/8h; P3 4h/3 ngày; P4 1 ngày/5 ngày. Bật quy tắc tự phân loại theo từ khoá.</li>
<li>Tạo 30 ticket dựa trên tình huống của khoá học (mỗi ngày 4–5 ticket). Ghi rõ triệu chứng, đã thử gì, nguyên nhân, cách xử lý, thời gian.</li>
<li>Viết KB (Outlook profile, reset máy in, VPN lỗi, Wi-Fi chập chờn, Teams không có tiếng, lỗi trust…).</li>
<li>Xuất báo cáo: số ticket theo loại, thời gian xử lý trung bình, % đạt SLA (ảnh chụp dashboard).</li>
</ol>
<h3>Cần có trong repo (<code>02-ticketing-kb/</code>)</h3>
<ul><li>Ảnh dashboard và danh sách ticket; file <code>tickets.csv</code> (đã ẩn thông tin nhạy cảm).</li><li>Thư mục <code>kb/</code> với các bài <code>.md</code>.</li><li><code>SLA-policy.md</code>, <code>priority-matrix.md</code>.</li></ul>
<h3>Câu mô tả cho CV</h3>
<pre><code>Hệ thống Ticketing &amp; Knowledge Base (GLPI, Docker)
- Triển khai GLPI, cấu hình danh mục, ma trận ưu tiên P1-P4 và SLA; xử lý 30+ ticket mô phỏng với thời gian giải quyết trung bình 25 phút
- Xây dựng 12 bài KB theo mẫu chuẩn (triệu chứng - nguyên nhân - các bước - kiểm tra), giảm lặp lại ticket cùng loại trong lab
- Báo cáo dashboard: số lượng theo loại, % đạt SLA</code></pre>`
},
{
  title: 'Mạng văn phòng nhỏ trên Cisco Packet Tracer + bảng chẩn đoán lỗi', level: 'Bắt buộc', time: '3 giờ',
  html: `
<p><b>Vì sao quan trọng:</b> chứng minh bạn hiểu IP, DHCP, DNS, VLAN và chẩn đoán lỗi mạng có hệ thống — câu hỏi phỏng vấn phổ biến nhất.</p>
<h3>Mục tiêu</h3>
<ul><li>Thiết kế sơ đồ mạng cho văn phòng 20 người, 2 VLAN (Văn phòng, Khách) + server DHCP/DNS/Web + máy in.</li><li>Cấu hình DHCP, DNS, inter-VLAN routing (router-on-a-stick).</li><li>Tạo 10 lỗi mạng, chẩn đoán bằng lệnh và ghi lại.</li></ul>
<h3>Các bước</h3>
<ol class="steps">
<li>Dùng <a href="#/day/3">Lab Ngày 3</a> làm nền. Địa chỉ: VLAN10 <code>192.168.10.0/24</code>, VLAN20 <code>192.168.20.0/24</code>, Server <code>192.168.10.5</code>.</li>
<li>Cấu hình switch (VLAN, trunk, access) và router sub-interface <code>192.168.10.1</code> / <code>192.168.20.1</code>.</li>
<li>Kiểm tra: PC nhận IP đúng VLAN, ping giữa VLAN, <code>nslookup</code> tới server, truy cập web.</li>
<li>Tạo <b>10 lỗi</b> (đặt sai gateway, sai VLAN, sai mask, tắt DHCP, xoá bản ghi DNS, shutdown cổng, sai trunk, trùng IP…) và điền bảng.</li>
</ol>
<table><thead><tr><th>#</th><th>Triệu chứng</th><th>Lệnh/chứng cứ</th><th>Nguyên nhân</th><th>Cách sửa</th></tr></thead><tbody>
<tr><td>1</td><td>PC1 IP 169.254.x.x</td><td>ipconfig</td><td>DHCP tắt/ cổng sai VLAN</td><td>Bật DHCP / sửa VLAN</td></tr>
<tr><td>2</td><td>…</td><td>…</td><td>…</td><td>…</td></tr>
</tbody></table>
<h3>Cần có trong repo (<code>03-network-packet-tracer/</code>)</h3>
<ul><li>File <code>.pkt</code>, ảnh sơ đồ, bảng địa chỉ IP, bảng 10 lỗi đã chẩn đoán, cấu hình router/switch (<code>show running-config</code>).</li></ul>
<h3>Câu mô tả cho CV</h3>
<pre><code>Thiết kế &amp; xử lý sự cố mạng văn phòng (Cisco Packet Tracer)
- Thiết kế mạng 2 VLAN, DHCP/DNS server, inter-VLAN routing; kiểm tra bằng ping/tracert/nslookup
- Chẩn đoán 10 sự cố mạng mô phỏng (DHCP, DNS, gateway, VLAN, subnet mask) theo quy trình tầng OSI và lập bảng triệu chứng - nguyên nhân - cách sửa</code></pre>`
},
{
  title: 'Bộ script PowerShell cho Helpdesk (đưa lên GitHub)', level: 'Nên làm', time: '3 giờ',
  html: `
<p><b>Vì sao quan trọng:</b> tự động hoá là điểm cộng rõ rệt. Vài script gọn, an toàn và có chú thích đủ gây ấn tượng.</p>
<h3>Danh sách script gợi ý</h3>
<table><thead><tr><th>Script</th><th>Chức năng</th></tr></thead><tbody>
<tr><td><code>Get-SystemInfo.ps1</code></td><td>Thu thập tên máy, OS, CPU, RAM, ổ đĩa, IP, serial → xuất CSV/HTML</td></tr>
<tr><td><code>Disk-Report.ps1</code></td><td>Báo cáo dung lượng, cảnh báo ổ &lt; 15%</td></tr>
<tr><td><code>Clean-Temp.ps1</code></td><td>Dọn Temp, Recycle Bin, cache; hỗ trợ <code>-WhatIf</code> và log</td></tr>
<tr><td><code>New-Users.ps1</code></td><td>Tạo user AD hàng loạt từ CSV, thêm nhóm, ghi log; mật khẩu ngẫu nhiên</td></tr>
<tr><td><code>Password-Expiry.ps1</code></td><td>Liệt kê tài khoản sắp hết hạn mật khẩu</td></tr>
<tr><td><code>Offboard-User.ps1</code></td><td>Disable tài khoản, đổi mật khẩu, gỡ nhóm, ghi log (có xác nhận)</td></tr>
<tr><td><code>Install-Apps.ps1</code></td><td>Cài phần mềm chuẩn bằng winget</td></tr>
<tr><td><code>Restart-Spooler.ps1</code></td><td>Dừng spooler, xoá hàng đợi, khởi động lại, kiểm tra</td></tr>
</tbody></table>
<h3>Tiêu chuẩn chất lượng</h3>
<ul>
<li>Có comment đầu file: mô tả, tham số, ví dụ, tác giả, phiên bản.</li>
<li>Dùng <code>param()</code>, kiểm tra lỗi (<code>try/catch</code>), log ra file, hỗ trợ <code>-WhatIf</code> với thao tác phá huỷ.</li>
<li><b>Không</b> viết cứng mật khẩu/ thông tin công ty. Dùng <code>Read-Host -AsSecureString</code> hoặc sinh ngẫu nhiên.</li>
<li>README mô tả cách chạy + ảnh minh hoạ kết quả.</li>
</ul>
<h3>Mẫu khung script</h3>
<pre><code>&lt;#
.SYNOPSIS  Báo cáo thông tin hệ thống máy cục bộ.
.EXAMPLE   .\\Get-SystemInfo.ps1 -OutFile C:\\Temp\\sysinfo.csv
#&gt;
param([string]$OutFile = "$env:TEMP\\sysinfo.csv")
try {
  $cs = Get-CimInstance Win32_ComputerSystem
  $os = Get-CimInstance Win32_OperatingSystem
  [pscustomobject]@{
    Computer = $env:COMPUTERNAME
    OS       = $os.Caption
    RAM_GB   = [math]::Round($cs.TotalPhysicalMemory/1GB,1)
    Serial   = (Get-CimInstance Win32_BIOS).SerialNumber
    IP       = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object IPAddress -notlike '169.*' | Select-Object -First 1).IPAddress
  } | Export-Csv $OutFile -NoTypeInformation
  Write-Host "Da xuat: $OutFile"
} catch { Write-Error $_ }</code></pre>
<h3>Câu mô tả cho CV</h3>
<pre><code>Bộ script PowerShell tự động hoá Helpdesk (GitHub)
- Viết 8 script (thu thập thông tin hệ thống, dọn dẹp, tạo user AD hàng loạt từ CSV, offboarding, cài phần mềm bằng winget) có log, tham số và -WhatIf
- Giảm thao tác thủ công tạo 25 user từ ~50 phút xuống 1 phút trong môi trường lab</code></pre>`
},
{
  title: 'Microsoft 365 / Entra ID admin lab + Intune cơ bản', level: 'Nên làm', time: '3 giờ',
  html: `
<p><b>Vì sao quan trọng:</b> phần lớn công ty hiện nay dùng M365. Chứng minh bạn đã admin tenant (dù thử nghiệm) là điểm cộng lớn.</p>
<h3>Mục tiêu</h3>
<ul><li>Tạo tenant thử nghiệm, 10 user, nhóm, license.</li><li>Bật MFA/ Security defaults, SSPR, thử Conditional Access (nếu license cho phép).</li><li>Shared mailbox, distribution list, Teams + SharePoint, OneDrive Known Folder Move.</li><li>(Nâng cao) Intune: đăng ký 1 VM Windows, tạo cấu hình (compliance, baseline), triển khai 1 app (7-Zip), thử Autopilot nếu có thể.</li></ul>
<h3>Thực hiện</h3>
<p>Bám theo <a href="#/day/5">Lab Ngày 5</a> rồi mở rộng với:</p>
<ol class="steps">
<li>Viết quy trình “Onboarding M365” và “Offboarding M365” (tạo user, gán license, thêm nhóm; sao lưu hộp thư, chuyển tiếp, thu hồi phiên).</li>
<li>Thực hành 6 ticket: Outlook không nhận mail, reset MFA, thêm quyền shared mailbox, OneDrive không đồng bộ, Teams không đăng nhập, message trace tìm mail biến mất.</li>
<li>Với PowerShell: <code>Connect-MgGraph</code> liệt kê user/ license; xuất danh sách user chưa MFA.</li>
</ol>
<h3>Cần có trong repo (<code>05-m365-admin/</code>)</h3>
<ul><li>Ảnh (che thông tin nhạy cảm), quy trình onboarding/offboarding, script Graph, 6 bài KB/ticket mẫu.</li></ul>
<h3>Câu mô tả cho CV</h3>
<pre><code>Microsoft 365 &amp; Entra ID Admin Lab
- Thiết lập tenant thử nghiệm: 10 user, license, nhóm, MFA, SSPR, shared mailbox, Teams/SharePoint/OneDrive
- Viết quy trình onboarding/offboarding và xử lý 6 sự cố điển hình (Outlook, MFA, OneDrive sync, message trace)
- Triển khai Intune cơ bản: compliance policy và deploy ứng dụng cho 1 thiết bị Windows (lab)</code></pre>
<aside class="warn"><p>Che hết email thật, tenant ID, tên miền công ty thật trong ảnh chụp. Không dùng tài khoản công ty hiện tại để làm lab.</p></aside>`
},
{
  title: 'Runbook & bộ tài liệu hỗ trợ (SOP / Troubleshooting guide)', level: 'Dễ làm – tạo khác biệt', time: '2 giờ',
  html: `
<p><b>Vì sao quan trọng:</b> viết tài liệu là kỹ năng được đánh giá thấp nhưng nhà tuyển dụng rất thích. Một bộ tài liệu gọn gàng cho thấy bạn có tư duy vận hành.</p>
<h3>Bộ tài liệu nên có</h3>
<ul>
<li><b>Troubleshooting guide</b> (10 lỗi phổ biến): máy chậm, không lên nguồn, không vào mạng, Outlook, máy in, BSOD, Wi-Fi, VPN, OneDrive, Teams.</li>
<li><b>SOP</b>: xử lý yêu cầu reset mật khẩu (kèm xác minh danh tính), onboarding, offboarding, bàn giao thiết bị.</li>
<li><b>Hướng dẫn người dùng cuối</b> (có ảnh chụp): kết nối VPN, đổi mật khẩu, cài MFA, thêm máy in.</li>
<li><b>Checklist</b>: cài máy mới, bảo trì định kỳ, kiểm tra backup.</li>
<li><b>Sơ đồ</b>: quy trình xử lý ticket (draw.io), luồng escalation.</li>
</ul>
<h3>Mẫu SOP nhanh</h3>
<pre><code>SOP-001: Reset mật khẩu tài khoản AD
Mục đích:   Đảm bảo reset đúng người, đúng quy trình
Phạm vi:    Tất cả nhân viên công ty
Bước:
  1. Xác minh danh tính: mã nhân viên + 2 thông tin (ngày vào làm, quản lý trực tiếp) hoặc gọi lại số đã đăng ký
  2. Mở ADUC -> chuột phải user -> Reset Password
  3. Đặt mật khẩu tạm đáp ứng chính sách; tick "User must change password at next logon"
  4. Nếu tài khoản bị khoá -> Unlock
  5. Hướng dẫn user đăng nhập và đổi mật khẩu; nhắc cập nhật điện thoại/Wi-Fi
  6. Ghi ticket: cách xác minh, thời gian
Ngoại lệ:   Tài khoản quản trị/ VIP -> chuyển L2 và xác nhận bằng quản lý</code></pre>
<h3>Cần có trong repo (<code>06-knowledge-base/</code>)</h3>
<ul><li>≥ 15 file markdown/PDF, có mục lục; một README tổng hợp danh sách tài liệu.</li></ul>
<h3>Câu mô tả cho CV</h3>
<pre><code>Tài liệu vận hành &amp; Knowledge Base
- Soạn 15+ tài liệu SOP/KB/hướng dẫn người dùng cuối (reset mật khẩu, onboarding, VPN, Outlook, in ấn) theo mẫu chuẩn, có ảnh minh hoạ
- Thiết kế sơ đồ quy trình xử lý ticket và escalation L1-L2-L3</code></pre>`
}
);
