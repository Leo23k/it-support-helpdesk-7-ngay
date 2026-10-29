COURSE.days.push({
  n: 6, short: 'Bảo mật, Linux, Cloud, ITIL', title: 'Bảo mật, backup, Linux/macOS, ảo hoá/cloud, scripting và vận hành dịch vụ',
  tagline: 'Những mảng “mở rộng” giúp bạn vượt mặt đa số ứng viên fresher.',
  hours: '7 giờ',
  intro: 'Ngày 6 mở rộng nền tảng: bảo mật cơ bản cho người ở tuyến đầu, sao lưu &amp; khôi phục, làm quen Linux/macOS, ảo hoá &amp; đám mây, tự động hoá bằng script, và cách vận hành dịch vụ theo ITIL (KPI, Knowledge Base, change). Đây là phần giúp bạn trả lời tự tin các câu “nâng cao” trong phỏng vấn.',
  outcomes: [
    'Nhận diện phishing/malware và biết quy trình xử lý ban đầu của helpdesk',
    'Hiểu 3-2-1 backup, RAID, RPO/RTO; khôi phục file bị xoá/ransomware ở mức cơ bản',
    'Dùng được 25 lệnh Linux, biết macOS căn bản',
    'Giải thích VM, hypervisor, snapshot, IaaS/PaaS/SaaS và điện toán đám mây',
    'Viết script PowerShell/Bash nhỏ, dùng Git/GitHub cho portfolio',
    'Hiểu KPI service desk (FCR, MTTR, CSAT, SLA), viết bài Knowledge Base'
  ],
  plan: ['<b>2h</b> Bài 1–2 (bảo mật, backup)', '<b>1.5h</b> Bài 3 (Linux/macOS)', '<b>1h</b> Bài 4 (ảo hoá/cloud)', '<b>1h</b> Bài 5 (script, Git)', '<b>1h</b> Bài 6 (ITIL, KB)', '<b>1h</b> Lab + Quiz'],
  lessons: [
    {
      id: 'd6-l1', title: 'Bảo mật cho người ở tuyến đầu: phishing, malware, social engineering', min: 60,
      html: `
<h3>Bộ ba CIA</h3>
<ul><li><b>Confidentiality – Bảo mật:</b> chỉ người có quyền mới xem được (mã hoá, phân quyền, MFA).</li><li><b>Integrity – Toàn vẹn:</b> dữ liệu không bị sửa trái phép (hash, chữ ký số, kiểm soát thay đổi).</li><li><b>Availability – Sẵn sàng:</b> hệ thống dùng được khi cần (backup, dự phòng, chống DDoS).</li></ul>
<h3>Các mối đe doạ thường gặp</h3>
<table><thead><tr><th>Loại</th><th>Là gì</th><th>Dấu hiệu / Ví dụ</th></tr></thead><tbody>
<tr><td><b>Phishing</b></td><td>Email/SMS giả mạo để lừa lấy mật khẩu hoặc cài mã độc</td><td>“Tài khoản của bạn sắp bị khoá, đăng nhập tại đây”, link lạ, lỗi chính tả, tạo cảm giác gấp</td></tr>
<tr><td><b>Spear phishing / BEC</b></td><td>Nhắm đích danh người, giả mạo sếp/đối tác để chuyển tiền hoặc gửi dữ liệu</td><td>“Anh đang họp, em chuyển gấp 50 triệu vào TK này”</td></tr>
<tr><td><b>Malware</b></td><td>Virus, trojan, spyware, keylogger</td><td>Máy chậm, popup lạ, trình duyệt bị đổi trang chủ</td></tr>
<tr><td><b>Ransomware</b></td><td>Mã hoá dữ liệu, đòi tiền chuộc</td><td>File đổi đuôi lạ, có file “README” đòi tiền</td></tr>
<tr><td><b>Social engineering</b></td><td>Lừa con người, không phải máy (gọi điện giả IT, đi theo người vào cửa – tailgating)</td><td>“Anh là IT đúng không? cho em xin mật khẩu để sửa lỗi”</td></tr>
<tr><td><b>Brute force / credential stuffing</b></td><td>Thử hàng loạt mật khẩu / dùng mật khẩu lộ từ nơi khác</td><td>Nhiều tài khoản bị khoá cùng lúc, đăng nhập thất bại từ IP lạ</td></tr>
<tr><td><b>Mối đe doạ nội bộ</b></td><td>Nhân viên vô tình hoặc cố ý làm lộ dữ liệu</td><td>Sao chép dữ liệu lớn ra USB, chia sẻ link công khai</td></tr>
</tbody></table>
<h3>Quy trình xử lý khi người dùng báo “nghi phishing” / “lỡ bấm link”</h3>
<ol class="steps">
<li><b>Bình tĩnh, hỏi nhanh:</b> bấm link chưa? nhập mật khẩu chưa? mở file đính kèm chưa? lúc mấy giờ? máy nào?</li>
<li><b>Cô lập:</b> nếu nghi nhiễm mã độc → ngắt mạng máy (rút cáp/tắt Wi-Fi), <b>không tắt nguồn</b> nếu có thể (giữ bằng chứng), báo Security.</li>
<li><b>Nếu đã nhập mật khẩu:</b> reset mật khẩu ngay, thu hồi phiên (Revoke sessions), bật/kiểm tra MFA, kiểm tra luật chuyển tiếp thư lạ và đăng nhập đáng ngờ trong Sign-in logs.</li>
<li><b>Báo cáo &amp; thu hồi mail phishing</b> khỏi các hộp thư khác (Security/Exchange admin làm: search &amp; purge).</li>
<li><b>Ghi ticket</b> đầy đủ, chuyển đội Security (SOC) xử lý sâu; nhắc người dùng đừng tự xoá bằng chứng.</li>
<li><b>Phòng ngừa:</b> đào tạo, nút “Report phishing”, bộ lọc mail, MFA.</li>
</ol>
<aside class="tip"><p>Cách nhận biết phishing nhanh: <b>(1)</b> địa chỉ người gửi thật sự là gì (rê chuột, không nhìn tên hiển thị)? <b>(2)</b> link dẫn tới đâu (rê chuột, domain giống nhưng sai: <code>micr0soft-login.com</code>)? <b>(3)</b> có tạo áp lực khẩn cấp/đe doạ? <b>(4)</b> file đính kèm lạ (.html, .iso, .exe, macro)? Nghi ngờ thì <i>không bấm, báo cáo</i>.</p></aside>
<h3>Biện pháp bảo vệ nền tảng</h3>
<p>Một số JD nhắc tới <b>ISO 27001 / ISMS</b> (hệ thống quản lý an toàn thông tin) như điểm cộng. Bạn chỉ cần hiểu khái niệm: chính sách bảo mật, kiểm soát truy cập, nhật ký sự cố và hồ sơ phục vụ kiểm toán. Không cần chứng chỉ.</p>
<table><thead><tr><th>Lớp</th><th>Công cụ / thực hành</th></tr></thead><tbody>
<tr><td>Danh tính</td><td>MFA, mật khẩu mạnh/ passphrase, trình quản lý mật khẩu, least privilege, SSPR</td></tr>
<tr><td>Thiết bị</td><td>Antivirus/EDR (Microsoft Defender, CrowdStrike…), BitLocker, cập nhật bản vá, tường lửa, khoá màn hình</td></tr>
<tr><td>Mạng</td><td>Firewall, VPN, phân đoạn VLAN, Wi-Fi WPA2/3-Enterprise, lọc web</td></tr>
<tr><td>Email</td><td>SPF/DKIM/DMARC, lọc spam/phishing, chặn file nguy hiểm</td></tr>
<tr><td>Dữ liệu</td><td>Backup 3-2-1, phân loại dữ liệu, DLP, mã hoá</td></tr>
<tr><td>Con người</td><td>Đào tạo nhận thức, quy trình xác minh, chính sách sử dụng chấp nhận được (AUP)</td></tr>
</tbody></table>
<h3>Antivirus: bạn làm gì khi có cảnh báo?</h3>
<ul><li>Xem tên mối đe doạ & đường dẫn file; Defender: <i>Windows Security → Protection history</i>.</li><li>Chạy Full scan / Microsoft Defender Offline scan; cách ly/xoá; nếu tái diễn hoặc có dấu hiệu lan → báo Security, cô lập máy.</li><li>Không “thêm ngoại lệ” (exclusion) theo yêu cầu miệng; cần phê duyệt.</li></ul>
<aside class="job"><p>Nhắc lại hai thói quen mà nhà tuyển dụng rất thích: (1) <b>luôn xác minh danh tính</b> trước khi thao tác tài khoản, (2) <b>luôn báo Security</b> khi thấy dấu hiệu bất thường thay vì tự “xử lý cho nhanh”.</p></aside>`
    },
    {
      id: 'd6-l2', title: 'Sao lưu (Backup), RAID và khôi phục dữ liệu', min: 40,
      html: `
<h3>Quy tắc 3-2-1</h3>
<p><b>3</b> bản dữ liệu (1 gốc + 2 sao lưu) · <b>2</b> loại phương tiện khác nhau (đĩa, NAS, cloud) · <b>1</b> bản nằm ngoài địa điểm (offsite/cloud). Nhiều tổ chức thêm <b>1 bản immutable/offline</b> chống ransomware (3-2-1-1-0).</p>
<table><thead><tr><th>Kiểu backup</th><th>Đặc điểm</th></tr></thead><tbody>
<tr><td><b>Full</b></td><td>Sao lưu toàn bộ — chậm, tốn chỗ, khôi phục đơn giản</td></tr>
<tr><td><b>Incremental</b></td><td>Chỉ phần thay đổi từ lần backup <i>bất kỳ</i> gần nhất — nhanh, nhỏ; khôi phục cần chuỗi</td></tr>
<tr><td><b>Differential</b></td><td>Thay đổi từ lần Full gần nhất — cân bằng</td></tr>
</tbody></table>
<ul>
<li><b>RPO</b> (Recovery Point Objective): chấp nhận mất tối đa bao nhiêu dữ liệu (vd 4 giờ).</li>
<li><b>RTO</b> (Recovery Time Objective): chấp nhận mất bao lâu để khôi phục (vd 2 giờ).</li>
<li><b>Backup chưa kiểm tra khôi phục thì chưa phải backup.</b> Cần test restore định kỳ.</li>
</ul>
<h3>Công cụ sao lưu bạn gặp</h3>
<ul><li>Máy người dùng: <b>OneDrive Known Folder Move</b>, File History, Windows Backup.</li><li>Server: Windows Server Backup, Veeam, Acronis, Azure Backup, Synology/QNAP NAS.</li><li>M365: bản sao riêng (Veeam for M365…) vì Microsoft không thay thế backup của bạn.</li><li>Khôi phục file xoá nhầm trên file server: <b>Previous Versions</b> (Shadow Copy).</li></ul>
<h3>RAID — dự phòng ổ cứng (không phải backup!)</h3>
<table><thead><tr><th>RAID</th><th>Cách hoạt động</th><th>Chịu được</th><th>Ghi chú</th></tr></thead><tbody>
<tr><td><b>0</b></td><td>Chia dữ liệu (striping)</td><td>0 ổ hỏng</td><td>Nhanh, không an toàn</td></tr>
<tr><td><b>1</b></td><td>Nhân bản (mirror), ≥2 ổ</td><td>1 ổ</td><td>Dung lượng còn 50%</td></tr>
<tr><td><b>5</b></td><td>Striping + parity, ≥3 ổ</td><td>1 ổ</td><td>Cân bằng; rebuild lâu</td></tr>
<tr><td><b>6</b></td><td>2 parity, ≥4 ổ</td><td>2 ổ</td><td>An toàn hơn cho ổ lớn</td></tr>
<tr><td><b>10</b></td><td>Mirror + stripe, ≥4 ổ</td><td>≥1 ổ mỗi mirror</td><td>Nhanh + an toàn, tốn ổ</td></tr>
</tbody></table>
<aside class="warn"><p>RAID bảo vệ khi <b>ổ cứng hỏng</b>, không bảo vệ khi xoá nhầm, ransomware, hay hỏng RAID controller. Vẫn phải có backup riêng. Đây là câu hỏi phỏng vấn kinh điển: “RAID có thay thế backup không?” → <b>Không</b>.</p></aside>
<h3>Khôi phục dữ liệu thường gặp</h3>
<table><thead><tr><th>Tình huống</th><th>Hướng xử lý</th></tr></thead><tbody>
<tr><td>Xoá nhầm file trên PC</td><td>Recycle Bin → File History/Previous Versions → OneDrive version history</td></tr>
<tr><td>Xoá nhầm trên file server</td><td>Previous Versions hoặc khôi phục từ backup (tạo ticket Change/Request)</td></tr>
<tr><td>Ổ cứng bị hỏng, máy không boot</td><td>Lấy ổ ra gắn qua docking (USB-SATA) vào máy khác để chép dữ liệu; nếu ổ có tiếng kêu click → <b>tắt ngay</b>, đưa dịch vụ phục hồi dữ liệu</td></tr>
<tr><td>Ransomware</td><td>Cô lập máy, báo Security, <b>không trả tiền</b> theo quyết định của quản lý, khôi phục từ backup sạch</td></tr>
</tbody></table>`
    },
    {
      id: 'd6-l3', title: 'Linux & macOS cho người làm IT Support', min: 70,
      html: `
<h3>Tại sao phải biết Linux?</h3>
<p>Phần lớn server, thiết bị mạng, container và cloud chạy Linux. Fresher helpdesk không cần giỏi nhưng cần <b>không sợ</b> terminal. Cách luyện nhanh: cài <b>Ubuntu Server/Desktop trong VirtualBox</b> hoặc bật <b>WSL</b> (<code>wsl --install</code>).</p>
<h3>25 lệnh Linux cần nhớ</h3>
<table><thead><tr><th>Nhóm</th><th>Lệnh</th><th>Ý nghĩa</th></tr></thead><tbody>
<tr><td>Điều hướng</td><td><code>pwd</code> · <code>ls -la</code> · <code>cd /var/log</code></td><td>Thư mục hiện tại · liệt kê (cả file ẩn, quyền) · đổi thư mục</td></tr>
<tr><td>Tệp</td><td><code>cat</code> · <code>less</code> · <code>head</code>/<code>tail -f</code> · <code>cp</code> · <code>mv</code> · <code>rm</code> · <code>mkdir</code> · <code>nano</code></td><td>Đọc, xem log trực tiếp, chép, đổi tên/di chuyển, xoá, tạo thư mục, soạn file</td></tr>
<tr><td>Tìm kiếm</td><td><code>grep -i "error" file</code> · <code>find / -name "*.log"</code></td><td>Tìm chuỗi trong file · tìm file</td></tr>
<tr><td>Quyền</td><td><code>chmod 644 file</code> · <code>chown user:group file</code> · <code>sudo</code></td><td>Đổi quyền · đổi chủ · chạy với quyền root</td></tr>
<tr><td>Tiến trình</td><td><code>ps aux</code> · <code>top</code>/<code>htop</code> · <code>kill -9 PID</code></td><td>Liệt kê tiến trình · theo dõi tài nguyên · dừng tiến trình</td></tr>
<tr><td>Dịch vụ</td><td><code>systemctl status|start|restart sshd</code> · <code>journalctl -u sshd -n 50</code></td><td>Quản lý dịch vụ · xem log</td></tr>
<tr><td>Đĩa</td><td><code>df -h</code> · <code>du -sh *</code> · <code>lsblk</code></td><td>Dung lượng ổ · dung lượng thư mục · ổ đĩa</td></tr>
<tr><td>Mạng</td><td><code>ip a</code> · <code>ping</code> · <code>ss -tulpn</code> · <code>curl -I url</code> · <code>ssh user@host</code> · <code>dig</code>/<code>nslookup</code></td><td>IP · kiểm tra · cổng đang nghe · gọi HTTP · kết nối từ xa · DNS</td></tr>
<tr><td>Gói</td><td><code>sudo apt update &amp;&amp; sudo apt install nginx</code> (Debian/Ubuntu) · <code>dnf install</code> (RHEL)</td><td>Cập nhật · cài gói</td></tr>
<tr><td>Người dùng</td><td><code>whoami</code> · <code>id</code> · <code>sudo adduser an</code> · <code>passwd an</code></td><td>Thông tin user · tạo user · đặt mật khẩu</td></tr>
</tbody></table>
<h3>Quyền file Linux</h3>
<p><code>-rwxr-xr--</code>: ký tự đầu là loại (- file, d thư mục), sau đó 3 nhóm <b>owner / group / others</b>, mỗi nhóm <code>r</code> (4) <code>w</code> (2) <code>x</code> (1). <code>chmod 754 file</code> = owner rwx (7), group r-x (5), others r-- (4). Cấu trúc: <code>/etc</code> (cấu hình) · <code>/var/log</code> (log) · <code>/home</code> (thư mục user) · <code>/usr</code>, <code>/bin</code> (chương trình).</p>
<aside class="ex"><p>Bài tập: web server Ubuntu báo hết dung lượng. Chạy <code>df -h</code> thấy <code>/</code> 100%. <code>sudo du -ah /var | sort -rh | head -20</code> thấy log lớn trong <code>/var/log</code>. Xoay vòng/xoá log cũ (<code>sudo journalctl --vacuum-time=7d</code>) rồi kiểm tra lại <code>df -h</code>.</p></aside>
<h3>macOS — những điều cần biết</h3>
<ul>
<li>Công cụ: <b>Finder</b> (quản lý file), <b>System Settings</b> (cài đặt), <b>Activity Monitor</b> (như Task Manager), <b>Terminal</b> (zsh), <b>Disk Utility</b>, <b>Console</b> (log).</li>
<li>Bảo mật: <b>FileVault</b> (mã hoá, như BitLocker), Gatekeeper, SIP; <b>Time Machine</b> (backup).</li>
<li>Quản lý doanh nghiệp: <b>Jamf</b> / Intune + <b>Apple Business Manager</b> + <b>ADE</b> (Automated Device Enrollment). Tài khoản <b>Apple ID</b> (cá nhân) vs <b>Managed Apple ID</b> (công ty).</li>
<li>Lệnh hữu ích: <code>sw_vers</code>, <code>diskutil list</code>, <code>ifconfig</code>, <code>networksetup -listallhardwareports</code>, <code>softwareupdate -l</code>, <code>sudo dscacheutil -flushcache</code>.</li>
<li>Khác biệt khi chia sẻ file với Windows: định dạng ổ ngoài <b>exFAT</b>; phím <kbd>Cmd</kbd> thay <kbd>Ctrl</kbd>; không có “Registry”.</li>
</ul>`
    },
    {
      id: 'd6-l4', title: 'Ảo hoá & Điện toán đám mây (Azure/AWS) cho người mới', min: 40,
      html: `
<h3>Ảo hoá</h3>
<aside class="def"><p><b>Ảo hoá</b> cho phép chạy nhiều máy tính “ảo” (VM) trên một máy vật lý. <b>Hypervisor</b> là phần mềm tạo và quản lý VM. <b>Type 1</b> (chạy trực tiếp trên phần cứng – VMware ESXi, Hyper-V, Proxmox, KVM) dùng cho server; <b>Type 2</b> (chạy trên hệ điều hành – VirtualBox, VMware Workstation) dùng cho lab/desktop.</p></aside>
<ul>
<li><b>Snapshot:</b> chụp trạng thái VM để quay lại (rất hữu ích khi lab và trước khi cập nhật). Không thay thế backup.</li>
<li><b>Lợi ích:</b> tiết kiệm phần cứng, dựng nhanh, cô lập, dễ sao lưu/di chuyển (vMotion/Live Migration).</li>
<li>Cần bật <b>VT-x/AMD-V</b> trong BIOS. Hyper-V và VirtualBox đôi khi xung đột nhau (tắt “Windows Hypervisor Platform”/“Hyper-V” khi cần).</li>
<li><b>Container</b> (Docker): đóng gói ứng dụng nhẹ hơn VM, dùng chung kernel — hiểu khái niệm là đủ.</li>
<li><b>VDI</b> (Citrix, Azure Virtual Desktop, Windows 365): máy tính ảo cho nhân viên làm từ xa — helpdesk hay gặp lỗi kết nối/profile/peripheral redirect.</li>
</ul>
<h3>Điện toán đám mây</h3>
<table><thead><tr><th>Mô hình</th><th>Bạn quản lý</th><th>Nhà cung cấp quản lý</th><th>Ví dụ</th></tr></thead><tbody>
<tr><td><b>IaaS</b></td><td>Hệ điều hành, ứng dụng, dữ liệu</td><td>Phần cứng, ảo hoá, mạng</td><td>Azure VM, AWS EC2</td></tr>
<tr><td><b>PaaS</b></td><td>Ứng dụng, dữ liệu</td><td>Cả nền tảng chạy</td><td>Azure App Service, AWS RDS</td></tr>
<tr><td><b>SaaS</b></td><td>Dữ liệu &amp; cấu hình người dùng</td><td>Mọi thứ khác</td><td>Microsoft 365, Google Workspace, Salesforce</td></tr>
</tbody></table>
<ul>
<li><b>Public / Private / Hybrid cloud</b>.</li>
<li><b>Mô hình trách nhiệm chung (Shared Responsibility):</b> nhà cung cấp bảo vệ hạ tầng; <b>bạn chịu trách nhiệm tài khoản, dữ liệu, cấu hình</b>.</li>
<li>Khái niệm Azure: Subscription, Resource group, VM, Virtual Network, Storage account, Entra ID. AWS: Account, EC2, S3, VPC, IAM.</li>
<li>Chứng chỉ vào cửa: <b>AZ-900</b> (Azure Fundamentals), <b>AWS Cloud Practitioner</b>.</li>
</ul>
<aside class="job"><p>Fresher helpdesk hiếm khi tạo hạ tầng cloud, nhưng dùng SaaS hằng ngày (M365). Việc bạn sẽ gặp: reset tài khoản cloud, cấp license, đổi quyền SharePoint, kiểm tra sign-in log, hỗ trợ VDI. Biết mô hình IaaS/PaaS/SaaS và shared responsibility là đủ cho phỏng vấn.</p></aside>`
    },
    {
      id: 'd6-l5', title: 'Tự động hoá bằng script & dùng Git/GitHub cho portfolio', min: 45,
      html: `
<h3>Vì sao nên có vài script?</h3>
<p>Script chứng minh bạn có tư duy tự động hoá — điểm cộng lớn ở mọi JD helpdesk hiện đại. Bắt đầu bằng <b>PowerShell</b> (Windows/M365) và một ít <b>Bash</b>. 3 nguyên tắc: <b>(1)</b> đơn giản & có chú thích, <b>(2)</b> an toàn (có <code>-WhatIf</code>, log), <b>(3)</b> không chứa mật khẩu.</p>
<h3>Ví dụ 1 — Dọn thư mục tạm &amp; báo cáo</h3>
<pre><code># Clean-Temp.ps1
param([switch]$WhatIf)
$paths = @("$env:TEMP", "C:\\Windows\\Temp")
$before = (Get-PSDrive C).Free
foreach ($p in $paths) {
  Get-ChildItem $p -Recurse -Force -ErrorAction SilentlyContinue |
    Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } |
    Remove-Item -Force -Recurse -ErrorAction SilentlyContinue -WhatIf:$WhatIf
}
$freed = [math]::Round(((Get-PSDrive C).Free - $before)/1MB,1)
"Da giai phong khoang $freed MB" | Tee-Object -FilePath "$env:TEMP\\clean-log.txt" -Append</code></pre>
<h3>Ví dụ 2 — Báo cáo tài khoản AD sắp hết hạn mật khẩu</h3>
<pre><code>Import-Module ActiveDirectory
$maxAge = (Get-ADDefaultDomainPasswordPolicy).MaxPasswordAge
Get-ADUser -Filter {Enabled -eq $true -and PasswordNeverExpires -eq $false} -Properties PasswordLastSet |
  Select-Object Name, SamAccountName, @{n='HetHan';e={$_.PasswordLastSet + $maxAge}} |
  Where-Object { $_.HetHan -lt (Get-Date).AddDays(7) } |
  Sort-Object HetHan | Export-Csv .\\sap-het-han.csv -NoTypeInformation -Encoding UTF8</code></pre>
<h3>Ví dụ 3 — Bash: kiểm tra dung lượng và dịch vụ</h3>
<pre><code>#!/bin/bash
# health.sh
echo "== Disk =="; df -h | awk 'NR==1 || $5+0 > 80'
echo "== Dich vu =="
for s in sshd cron; do
  systemctl is-active --quiet "$s" &amp;&amp; echo "$s: OK" || echo "$s: DOWN"
done</code></pre>
<h3>Git &amp; GitHub trong 10 phút</h3>
<pre><code>git config --global user.name "Ten Ban"
git config --global user.email "ban@example.com"
git init                      # tạo repo
git add .                     # đưa file vào vùng chờ
git commit -m "Them script disk-report"
git branch -M main
git remote add origin https://github.com/&lt;ten-ban&gt;/it-support-portfolio.git
git push -u origin main</code></pre>
<aside class="tip"><p>Cấu trúc repo gợi ý: <code>/01-home-lab-ad</code>, <code>/02-ticketing-glpi</code>, <code>/03-network-packet-tracer</code>, <code>/04-powershell-scripts</code>, <code>/05-m365-admin</code>, <code>/06-knowledge-base</code> — mỗi thư mục một README ngắn. Không commit mật khẩu, key, thông tin công ty thật.</p></aside>`
    },
    {
      id: 'd6-l6', title: 'Vận hành dịch vụ theo ITIL: KPI, Change, Knowledge Base', min: 40,
      html: `
<h3>ITIL 4 tóm tắt</h3>
<p><b>ITIL</b> là bộ thực hành tốt nhất để quản lý dịch vụ IT. Với helpdesk, các “practice” liên quan trực tiếp: <b>Service Desk, Incident Management, Service Request Management, Problem Management, Change Enablement, Knowledge Management, Service Level Management, Asset &amp; Configuration Management</b>. Chứng chỉ <b>ITIL 4 Foundation</b> được nhiều công ty ưa thích.</p>
<h3>KPI của Service Desk</h3>
<table><thead><tr><th>Chỉ số</th><th>Ý nghĩa</th><th>Ví dụ mục tiêu</th></tr></thead><tbody>
<tr><td><b>FCR</b> – First Contact Resolution</td><td>% ticket giải quyết ngay ở lần liên hệ đầu</td><td>≥ 70%</td></tr>
<tr><td><b>MTTR</b> – Mean Time To Resolve</td><td>Thời gian trung bình để giải quyết</td><td>P3 &lt; 8 giờ làm việc</td></tr>
<tr><td><b>SLA compliance</b></td><td>% ticket đạt SLA</td><td>≥ 95%</td></tr>
<tr><td><b>CSAT</b></td><td>Điểm hài lòng của người dùng</td><td>≥ 90%</td></tr>
<tr><td><b>Backlog / Ticket aging</b></td><td>Ticket tồn đọng, lâu ngày</td><td>Ít ticket quá hạn</td></tr>
<tr><td><b>Reopen rate</b></td><td>Ticket bị mở lại</td><td>Thấp</td></tr>
</tbody></table>
<aside class="job"><p>Hiểu KPI nghĩa là hiểu <b>vì sao quản lý đòi bạn ghi ticket đầy đủ, đóng ticket đúng hạn, và không chỉ “xong thì thôi”</b>. Trong phỏng vấn, nói “em ưu tiên FCR cao nhưng không đánh đổi chất lượng, em kiểm tra user xác nhận trước khi đóng” là câu trả lời ăn điểm.</p></aside>
<h3>Change Enablement</h3>
<p>Mọi thay đổi hạ tầng cần: <b>mô tả, lý do, đánh giá rủi ro, kế hoạch thực hiện, kế hoạch rollback, thời gian, người phê duyệt</b> (CAB – Change Advisory Board). Loại: <b>Standard</b> (rủi ro thấp, đã duyệt trước – vd cấp quyền thư mục), <b>Normal</b> (cần duyệt), <b>Emergency</b> (khẩn cấp). Helpdesk thường thực hiện Standard Change và <i>không</i> tự ý thay đổi hạ tầng.</p>
<h3>Major Incident</h3>
<p>Sự cố nghiêm trọng (vd cả công ty mất email): lập <b>bridge call</b>, chỉ định Incident Manager, giao tiếp định kỳ cho người dùng (15–30 phút/lần), ghi timeline, sau đó họp <b>Post-Incident Review</b> và tạo Problem record.</p>
<h3>Viết Knowledge Base (KB) chuẩn</h3>
<pre><code>Tiêu đề:     [Outlook] Không gửi được mail - lỗi 0x800CCC0E
Áp dụng:     Outlook 365 trên Windows 10/11
Triệu chứng: Gửi mail báo "Sending reported error 0x800CCC0E"
Nguyên nhân: Profile hỏng / chặn kết nối SMTP
Các bước:    1. Kiểm tra OWA -> OK/Không OK
             2. Chạy outlook.exe /safe ...
             3. Tạo profile mới ...
Kiểm tra:    Gửi mail thử tới chính mình + 1 địa chỉ ngoài
Nếu vẫn lỗi: Chuyển L2 kèm log/ảnh chụp
Tác giả/Ngày: An - 2025-xx-xx    Tag: outlook, smtp, profile</code></pre>
<p>KB tốt giúp người sau (và chính bạn) giải quyết nhanh, giảm ticket lặp, cho phép <b>self-service</b>. Viết ngắn, đánh số bước, có ảnh chụp, kiểm chứng trước khi đăng.</p>`
    }
  ],
  lab: {
    title: 'Bảo mật + Linux + Script + GitHub: tạo portfolio kỹ thuật',
    html: `
<p><b>Thời gian:</b> ~1.5–2 giờ.</p>
<ol class="steps">
<li><b>Phishing quiz thực chiến:</b> làm bài kiểm tra phishing miễn phí của Google (<i>phishingquiz.withgoogle.com</i>) và OpenDNS. Ghi 5 dấu hiệu bạn nhận ra.</li>
<li><b>Kiểm tra URL/file đáng ngờ:</b> dùng VirusTotal (không tải file nhạy cảm của công ty). Xem một email header mẫu và tìm <code>Authentication-Results</code>.</li>
<li><b>BitLocker / Windows Security:</b> trên VM Windows Pro, bật BitLocker (cần TPM ảo hoặc bật chính sách cho phép không có TPM), lưu recovery key, thử khôi phục. Xem Protection history của Defender.</li>
<li><b>Backup:</b> đặt File History hoặc robocopy đồng bộ thư mục <code>Documents</code> sang ổ khác: <code>robocopy C:\\Users\\labadmin\\Documents D:\\Backup /MIR /R:2 /W:2</code>. Xoá file cố ý và khôi phục.</li>
<li><b>Linux:</b> dựng VM Ubuntu Server; cài <code>openssh-server</code>, SSH từ Windows (<code>ssh user@ip</code>); tạo user, đổi quyền thư mục (<code>chmod</code>/<code>chown</code>); thử 25 lệnh Bài 3; cài nginx và mở trang web từ máy Windows.</li>
<li><b>Script:</b> chạy 2 script PowerShell ở Bài 5 trong VM (dùng <code>-WhatIf</code> trước); thêm comment & ghi log; viết thêm 1 script tuỳ ý (ví dụ liệt kê phần mềm đã cài ra CSV: <code>Get-Package</code>).</li>
<li><b>GitHub:</b> tạo repo <code>it-support-portfolio</code>, đẩy các script/ảnh/README các ngày trước lên. Viết README tổng quan 10 dòng.</li>
<li><b>Viết 2 bài KB</b> từ những lỗi đã sửa trong tuần. Chia sẻ lên repo (thư mục <code>06-knowledge-base</code>).</li>
</ol>`
  },
  quiz: [
    { q: 'Quy tắc backup 3-2-1 nghĩa là?', o: ['3 ổ, 2 server, 1 người', '3 bản dữ liệu, 2 loại phương tiện, 1 bản nằm ngoài địa điểm', '3 ngày, 2 tuần, 1 tháng', '3 máy, 2 NAS, 1 cloud'], a: 1, e: 'Đây là chuẩn sao lưu căn bản chống mất dữ liệu cục bộ và thiên tai/ransomware.' },
    { q: 'RAID 1 cho phép chịu lỗi bao nhiêu ổ (với 2 ổ)?', o: ['0', '1', '2', 'Không giới hạn'], a: 1, e: 'RAID 1 là mirror; mất 1 ổ vẫn đủ dữ liệu. Nhưng RAID không thay thế backup.' },
    { q: 'User báo đã nhập mật khẩu vào trang đăng nhập giả mạo. Hành động ưu tiên?', o: ['Không làm gì', 'Reset mật khẩu, thu hồi session/token, kiểm tra MFA & sign-in logs & luật chuyển tiếp email, báo Security', 'Chỉ nhắc user cẩn thận', 'Xoá mail'], a: 1, e: 'Giả định tài khoản đã bị lộ: khoá lại, xem dấu vết, thông báo Security để điều tra.' },
    { q: 'SaaS là mô hình mà bạn quản lý…', o: ['Hệ điều hành & ứng dụng', 'Chủ yếu dữ liệu và cấu hình người dùng', 'Phần cứng', 'Mạng vật lý'], a: 1, e: 'Microsoft 365 là ví dụ SaaS điển hình.' },
    { q: 'Lệnh Linux nào xem dung lượng ổ đĩa dạng dễ đọc?', o: ['ls -la', 'df -h', 'ps aux', 'chmod'], a: 1, e: 'df -h hiển thị mức sử dụng các filesystem. du -sh tính dung lượng thư mục.' },
    { q: 'chmod 754 file có ý nghĩa gì?', o: ['Owner rwx, group r-x, others r--', 'Owner r--, group r-x, others rwx', 'Mọi người rwx', 'Chỉ owner đọc'], a: 0, e: '7=rwx, 5=r-x, 4=r--.' },
    { q: 'FCR trong service desk là gì?', o: ['Tỷ lệ ticket giải quyết ngay lần liên hệ đầu tiên', 'Thời gian trung bình giải quyết', 'Số ticket hằng ngày', 'Điểm hài lòng'], a: 0, e: 'First Contact Resolution.' },
    { q: 'Snapshot VM có thay thế backup không?', o: ['Có, hoàn toàn', 'Không — snapshot nằm cùng kho lưu trữ, chỉ để quay lại nhanh tạm thời', 'Có nếu dùng RAID', 'Chỉ thay thế trên cloud'], a: 1, e: 'Snapshot không bảo vệ khi mất kho lưu trữ hoặc ransomware.' },
    { q: 'Khi nghi máy nhiễm ransomware, bước đầu tiên là?', o: ['Cắm USB để chép dữ liệu', 'Cô lập máy khỏi mạng và báo Security', 'Trả tiền chuộc', 'Xoá file mã hoá'], a: 1, e: 'Ngăn lây lan trước, giữ bằng chứng và báo đội Security.' }
  ],
  scenarios: [
    { q: '<b>Tình huống:</b> Kế toán trưởng nhận mail từ “giám đốc”: “Chuyển gấp 80 triệu cho đối tác, tôi đang họp, đừng gọi”. Cô gọi helpdesk hỏi mail có thật không. Bạn nên?', o: ['Nói “chắc thật vì tên giám đốc”', 'Xem header/địa chỉ người gửi, khuyên cô xác minh qua điện thoại với giám đốc bằng số đã biết, không chuyển tiền; báo Security & thu hồi mail khỏi các hộp thư khác', 'Reply mail xác nhận', 'Xoá mail rồi thôi'], a: 1, e: 'Dấu hiệu điển hình của BEC. Xác minh kênh độc lập và báo cáo.' },
    { q: '<b>Tình huống:</b> Ổ C: của file server Linux/Windows cạnh đầy, ứng dụng bắt đầu lỗi. Bạn?', o: ['Xoá thư mục ngẫu nhiên', 'Tìm thư mục chiếm nhiều dung lượng (TreeSize/du -sh), xác định log/backup cũ, dọn theo quy định, báo owner & đề xuất tăng dung lượng/giám sát; ghi ticket (Change nếu mở rộng ổ)', 'Khởi động lại server', 'Cài lại server'], a: 1, e: 'Chẩn đoán → hành động an toàn → phòng ngừa (monitoring/capacity).' },
    { q: '<b>Tình huống:</b> Sếp yêu cầu bạn cài thêm một tool crack (miễn phí) cho phòng Thiết kế vì “đỡ tốn license”. Bạn…', o: ['Cài ngay', 'Giải thích rủi ro pháp lý và malware; đề xuất phương án hợp pháp (bản miễn phí/mã nguồn mở/gói giá thấp/Education) và chuyển yêu cầu đúng quy trình mua sắm', 'Cài nhưng không nói ai biết', 'Từ chối và không giải thích'], a: 1, e: 'Giữ chuẩn mực nghề nghiệp, đưa phương án thay thế thay vì chỉ từ chối.' }
  ]
});
