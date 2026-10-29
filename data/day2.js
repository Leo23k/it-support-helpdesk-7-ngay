COURSE.days.push({
  n: 2, short: 'Windows & PowerShell', title: 'Windows: cài đặt, công cụ quản trị, CMD/PowerShell và xử lý sự cố',
  tagline: 'Thành thạo hệ điều hành bạn sẽ hỗ trợ nhiều nhất mỗi ngày.',
  hours: '7–8 giờ',
  intro: 'Phần lớn ticket helpdesk là về Windows. Hôm nay bạn học cài đặt, công cụ quản trị có sẵn, người dùng &amp; quyền, dòng lệnh CMD/PowerShell, và quy trình xử lý các lỗi hay gặp nhất: máy chậm, không boot, BSOD, cập nhật lỗi.',
  outcomes: [
    'Cài Windows 10/11 bằng USB, hiểu phân vùng, UEFI/GPT, TPM',
    'Dùng thành thạo Task Manager, Event Viewer, Device Manager, Disk Management, Services, Registry (an toàn)',
    'Phân biệt tài khoản local/domain, quyền NTFS vs Share, UAC',
    'Dùng được 30+ lệnh CMD/PowerShell phục vụ chẩn đoán và sửa lỗi',
    'Có quy trình chuẩn cho: máy chậm, không boot, BSOD, profile lỗi, đầy ổ đĩa'
  ],
  plan: ['<b>2.5h</b> Bài 1–3', '<b>1.5h</b> Bài 4 (CMD/PowerShell – gõ lệnh thật)', '<b>1h</b> Bài 5 (xử lý sự cố)', '<b>2h</b> Lab', '<b>30p</b> Quiz'],
  lessons: [
    {
      id: 'd2-l1', title: 'Phiên bản, cài đặt Windows và phân vùng ổ đĩa', min: 45,
      html: `
<h3>Các phiên bản Windows trong doanh nghiệp</h3>
<table><thead><tr><th>Edition</th><th>Dùng cho</th><th>Điểm khác</th></tr></thead><tbody>
<tr><td><b>Home</b></td><td>Cá nhân</td><td>Không join domain, không BitLocker đầy đủ, không Group Policy, không Remote Desktop host</td></tr>
<tr><td><b>Pro</b></td><td>Doanh nghiệp nhỏ</td><td>Join domain/Entra ID, BitLocker, Remote Desktop host, Hyper-V, gpedit</td></tr>
<tr><td><b>Enterprise / Education</b></td><td>Doanh nghiệp lớn</td><td>Quản lý nâng cao, AppLocker, Credential Guard, cấp phép khối</td></tr>
</tbody></table>
<p>Hiện tại thị trường dùng Windows 10 (đã hết hỗ trợ phổ thông, nhiều công ty đang chuyển lên) và Windows 11 — bạn cần biết cả hai. <b>Windows 11</b> yêu cầu: CPU đời mới được hỗ trợ, 4GB RAM, 64GB ổ, <b>UEFI + Secure Boot</b>, <b>TPM 2.0</b>.</p>
<h3>MBR vs GPT, BIOS vs UEFI</h3>
<table><thead><tr><th></th><th>MBR + BIOS (Legacy)</th><th>GPT + UEFI</th></tr></thead><tbody>
<tr><td>Dung lượng ổ</td><td>Tối đa 2TB</td><td>Rất lớn (>2TB)</td></tr>
<tr><td>Số phân vùng chính</td><td>4</td><td>128</td></tr>
<tr><td>Secure Boot</td><td>Không</td><td>Có</td></tr>
<tr><td>Windows 11</td><td>Không hỗ trợ</td><td>Bắt buộc</td></tr>
</tbody></table>
<p>Khi cài Windows, chế độ BIOS (UEFI/Legacy) và kiểu bảng phân vùng (GPT/MBR) phải khớp nhau; sai là lỗi “Windows cannot be installed to this disk”.</p>
<h3>Cài Windows bằng USB — quy trình</h3>
<ol class="steps">
<li>Tải ISO chính thức từ Microsoft (Media Creation Tool hoặc trang tải). Tạo USB boot bằng <b>Rufus</b> hoặc Media Creation Tool (USB ≥ 8GB, <b>sẽ xoá dữ liệu USB</b>).</li>
<li>Sao lưu dữ liệu máy cần cài (Desktop, Documents, trình duyệt, ghi chú phần mềm có bản quyền).</li>
<li>Cắm USB, bật máy, bấm phím boot menu (<kbd>F12</kbd>/<kbd>Esc</kbd>/<kbd>F9</kbd>…), chọn USB (UEFI).</li>
<li>Chọn ngôn ngữ → Install now → bỏ qua key nếu dùng bản quyền kỹ thuật số → chọn edition (Pro) → <b>Custom install</b>.</li>
<li>Chọn ổ: xoá các phân vùng cũ của ổ hệ thống (nếu cài sạch) → <i>New</i> → Windows tự tạo các phân vùng cần thiết → Next.</li>
<li>OOBE: vùng, bàn phím, tài khoản, mạng. Với doanh nghiệp: đặt tên máy theo quy ước (vd <code>HCM-KT-017</code>), join domain, cài driver, Windows Update, phần mềm chuẩn, antivirus, BitLocker.</li>
</ol>
<aside class="job"><p>Doanh nghiệp rất ít cài từng máy bằng tay. Họ dùng <b>image chuẩn</b> (MDT/SCCM) hoặc <b>Windows Autopilot + Intune</b> để tự cấu hình. Bạn cần hiểu quy trình thủ công để hiểu bên dưới họ tự động hoá cái gì.</p></aside>
<h3>Driver &amp; kích hoạt</h3>
<ul><li>Driver: tải từ trang hãng (Dell, HP, Lenovo) theo <b>Service Tag/Serial</b>; Windows Update thường cài sẵn driver cơ bản.</li><li>Kích hoạt: key bản quyền kỹ thuật số gắn máy, KMS (doanh nghiệp), hoặc Volume License. Kiểm tra bằng <code>slmgr /xpr</code>.</li></ul>`
    },
    {
      id: 'd2-l2', title: 'Bộ công cụ quản trị tích hợp của Windows', min: 50,
      html: `
<p>Biết “công cụ nào cho việc nào” giúp bạn chẩn đoán nhanh hơn rất nhiều. Mở nhanh bằng <kbd>Win</kbd>+<kbd>R</kbd> rồi gõ lệnh.</p>
<table><thead><tr><th>Công cụ</th><th>Lệnh</th><th>Dùng khi</th></tr></thead><tbody>
<tr><td><b>Task Manager</b></td><td><kbd>Ctrl+Shift+Esc</kbd></td><td>Xem CPU/RAM/Disk/Network, tắt ứng dụng treo, tab Startup, Users, Details</td></tr>
<tr><td><b>Device Manager</b></td><td><code>devmgmt.msc</code></td><td>Thiết bị có dấu chấm than vàng, cập nhật/rollback driver</td></tr>
<tr><td><b>Disk Management</b></td><td><code>diskmgmt.msc</code></td><td>Khởi tạo ổ mới, extend/shrink partition, đổi ký tự ổ</td></tr>
<tr><td><b>Event Viewer</b></td><td><code>eventvwr.msc</code></td><td>Tìm nguyên nhân lỗi qua log hệ thống/ứng dụng</td></tr>
<tr><td><b>Services</b></td><td><code>services.msc</code></td><td>Khởi động lại dịch vụ (Print Spooler, Windows Update…)</td></tr>
<tr><td><b>Computer Management</b></td><td><code>compmgmt.msc</code></td><td>Tổng hợp: user local, shared folders, event, disk</td></tr>
<tr><td><b>Local Users &amp; Groups</b></td><td><code>lusrmgr.msc</code></td><td>Quản lý user/group cục bộ (Pro trở lên)</td></tr>
<tr><td><b>Programs and Features</b></td><td><code>appwiz.cpl</code></td><td>Gỡ phần mềm</td></tr>
<tr><td><b>Network Connections</b></td><td><code>ncpa.cpl</code></td><td>Cấu hình card mạng, đặt IP tĩnh</td></tr>
<tr><td><b>System Properties</b></td><td><code>sysdm.cpl</code></td><td>Tên máy, join domain, System Restore, biến môi trường</td></tr>
<tr><td><b>System Information</b></td><td><code>msinfo32</code></td><td>Thông tin phần cứng/phần mềm chi tiết</td></tr>
<tr><td><b>System Configuration</b></td><td><code>msconfig</code></td><td>Safe mode, tắt dịch vụ không MS khi chẩn đoán</td></tr>
<tr><td><b>Task Scheduler</b></td><td><code>taskschd.msc</code></td><td>Tác vụ tự chạy (backup, script)</td></tr>
<tr><td><b>Group Policy Editor</b></td><td><code>gpedit.msc</code></td><td>Chính sách cục bộ (Pro)</td></tr>
<tr><td><b>Registry Editor</b></td><td><code>regedit</code></td><td>Cấu hình sâu — <b>luôn export key trước khi sửa</b></td></tr>
<tr><td><b>Resource / Performance Monitor</b></td><td><code>resmon</code> / <code>perfmon</code></td><td>Tìm tiến trình nào dùng đĩa/mạng nhiều nhất</td></tr>
<tr><td><b>Remote Desktop</b></td><td><code>mstsc</code></td><td>Kết nối máy từ xa</td></tr>
<tr><td><b>Windows Memory Diagnostic</b></td><td><code>mdsched</code></td><td>Kiểm tra RAM</td></tr>
</tbody></table>
<h3>Đọc Event Viewer — kỹ năng “phân biệt” người biết và người không</h3>
<p>Vào <i>Windows Logs → System</i> (hệ thống/driver/dịch vụ), <i>Application</i> (ứng dụng), <i>Security</i> (đăng nhập, cần quyền admin). Lọc theo mức <b>Critical/Error</b> quanh thời điểm xảy ra lỗi. Một số Event ID hay gặp:</p>
<table><thead><tr><th>Event ID</th><th>Nguồn</th><th>Ý nghĩa</th></tr></thead><tbody>
<tr><td>41</td><td>Kernel-Power</td><td>Máy tắt đột ngột (mất điện, treo cứng, PSU)</td></tr>
<tr><td>6005 / 6006</td><td>EventLog</td><td>Dịch vụ log bắt đầu / dừng (≈ bật / tắt máy)</td></tr>
<tr><td>6008</td><td>EventLog</td><td>Lần tắt máy trước là bất thường</td></tr>
<tr><td>1074</td><td>User32</td><td>Ai/cái gì yêu cầu restart/shutdown</td></tr>
<tr><td>7034 / 7031</td><td>Service Control</td><td>Dịch vụ dừng bất ngờ</td></tr>
<tr><td>4624 / 4625</td><td>Security</td><td>Đăng nhập thành công / thất bại (có mã lý do)</td></tr>
<tr><td>4740</td><td>Security</td><td>Tài khoản bị khoá (trên DC)</td></tr>
<tr><td>1000</td><td>Application Error</td><td>Ứng dụng crash (xem module lỗi)</td></tr>
</tbody></table>
<aside class="tip"><p>Quy trình: hỏi user lỗi xảy ra lúc mấy giờ → mở Event Viewer → Filter Current Log → chọn Critical + Error → xem sự kiện sát giờ đó → copy mã lỗi/tên module → tìm kiếm cùng với tên sản phẩm.</p></aside>
<h3>Registry — biết đủ để không phá máy</h3>
<p>Registry là cơ sở dữ liệu cấu hình, gồm các hive: <code>HKEY_LOCAL_MACHINE (HKLM)</code> (toàn máy) và <code>HKEY_CURRENT_USER (HKCU)</code> (người dùng hiện tại). Trước khi sửa: <i>File → Export</i> key đó. Đừng bao giờ sửa theo hướng dẫn mà bạn không hiểu.</p>`
    },
    {
      id: 'd2-l3', title: 'Người dùng, quyền và hệ thống tệp (NTFS, Share)', min: 40,
      html: `
<h3>Loại tài khoản</h3>
<ul>
<li><b>Local account:</b> chỉ tồn tại trên một máy. Có thể là Administrator hoặc Standard User.</li>
<li><b>Domain account:</b> tài khoản trong Active Directory (Ngày 4), đăng nhập được trên mọi máy join domain.</li>
<li><b>Microsoft account / Entra ID account:</b> tài khoản đám mây (công ty dùng Microsoft 365).</li>
</ul>
<p>Nguyên tắc <b>Least Privilege</b>: người dùng thường dùng Standard User; chỉ khi cần cài đặt hệ thống mới nâng quyền. <b>UAC</b> (User Account Control) hiện hộp thoại xác nhận khi chương trình cần quyền admin.</p>
<h3>Hệ thống tệp: NTFS vs FAT32 vs exFAT</h3>
<table><thead><tr><th></th><th>NTFS</th><th>FAT32</th><th>exFAT</th></tr></thead><tbody>
<tr><td>Dung lượng 1 file</td><td>Rất lớn</td><td>Tối đa 4GB</td><td>Rất lớn</td></tr>
<tr><td>Phân quyền, mã hoá</td><td>Có</td><td>Không</td><td>Không</td></tr>
<tr><td>Dùng cho</td><td>Ổ hệ thống, server</td><td>USB cũ, thiết bị nhúng</td><td>USB/ổ ngoài dùng chung Windows–Mac</td></tr>
</tbody></table>
<h3>Quyền NTFS vs quyền Share</h3>
<p>Khi một thư mục được chia sẻ qua mạng (<code>\\\\fileserver\\KeToan</code>), có <b>hai lớp quyền</b>; quyền hiệu lực là <b>quyền chặt hơn</b> trong hai lớp:</p>
<table><thead><tr><th>Quyền NTFS</th><th>Ý nghĩa</th></tr></thead><tbody>
<tr><td>Read</td><td>Xem nội dung, mở file</td></tr>
<tr><td>Read &amp; Execute</td><td>Đọc + chạy chương trình</td></tr>
<tr><td>Write / Modify</td><td>Tạo, sửa, xoá file</td></tr>
<tr><td>Full Control</td><td>Mọi thứ, bao gồm đổi quyền và chiếm quyền sở hữu</td></tr>
</tbody></table>
<aside class="ex"><p>Share cho “Everyone: Full Control”, NTFS cho nhóm <code>KeToan</code>: Modify, các nhóm khác: không có. → Chỉ nhóm KeToan sửa được; người khác bị từ chối. <b>Best practice:</b> đặt share rộng (Authenticated Users/Everyone Full) và quản lý quyền chi tiết bằng NTFS, gán quyền cho <b>nhóm</b>, không gán cho từng người.</p></aside>
<h3>Thủ thuật hay gặp</h3>
<ul>
<li><b>Access Denied:</b> kiểm tra Properties → Security → Advanced → <i>Effective Access</i> để xem user có quyền gì.</li>
<li><b>Đường dẫn:</b> <code>C:\\Users\\An\\Documents</code> (local) · <code>\\\\server\\share</code> (UNC). <code>%USERPROFILE%</code>, <code>%APPDATA%</code>, <code>%TEMP%</code> là biến môi trường hay dùng.</li>
<li><b>Ổ ánh xạ (mapped drive):</b> <code>net use Z: \\\\fileserver\\KeToan /persistent:yes</code></li>
<li><b>Thư mục ẩn:</b> bật “Hidden items” trong View; thư mục <code>C:\\Users\\&lt;user&gt;\\AppData</code> chứa cấu hình ứng dụng (Outlook, Chrome, Teams…).</li>
<li><b>Profile người dùng:</b> mỗi người có <code>C:\\Users\\&lt;tên&gt;</code>. Hỏng profile → đăng nhập “temporary profile”, mất cài đặt.</li>
</ul>`
    },
    {
      id: 'd2-l4', title: 'CMD & PowerShell cho helpdesk (30+ lệnh thiết yếu)', min: 60,
      html: `
<p>Giao diện đồ hoạ để làm một máy; dòng lệnh để làm <b>100 máy</b>, từ xa, và để chẩn đoán sâu. Mở CMD/PowerShell bằng <i>Run as administrator</i> khi cần quyền cao (chuột phải → Run as administrator).</p>
<h3>1. CMD — nhóm điều hướng &amp; tệp</h3>
<pre><code>cd C:\\Users          # đổi thư mục
dir                   # liệt kê (dir /a hiện cả file ẩn)
mkdir Test            # tạo thư mục
copy a.txt D:\\       # sao chép;  robocopy = sao chép nâng cao
del a.txt             # xoá file
type a.txt            # đọc file
cls                   # xoá màn hình
echo %USERNAME% %COMPUTERNAME%   # xem biến môi trường</code></pre>
<h3>2. CMD — nhóm hệ thống &amp; sửa lỗi</h3>
<pre><code>systeminfo                    # cấu hình máy, bản Windows, ngày cài, hotfix
hostname                      # tên máy
whoami /groups                # tôi là ai, thuộc nhóm nào
tasklist | findstr chrome     # liệt kê tiến trình, lọc "chrome"
taskkill /IM chrome.exe /F    # tắt cưỡng bức tiến trình
sfc /scannow                  # quét &amp; sửa file hệ thống hỏng (cần admin)
DISM /Online /Cleanup-Image /RestoreHealth   # sửa kho ảnh Windows (chạy khi sfc báo lỗi)
chkdsk C: /f /r               # quét lỗi ổ đĩa (cần restart)
gpupdate /force               # áp dụng lại Group Policy
gpresult /r                   # xem GPO nào đang áp dụng cho máy/user
shutdown /r /t 0              # restart ngay (/s = tắt, /a = huỷ)
slmgr /xpr                    # xem trạng thái kích hoạt Windows
wmic bios get serialnumber    # lấy serial (nếu có wmic)
net user                      # liệt kê user local
net user an Pass@123 /add     # tạo user (chỉ lab!)
net localgroup administrators # xem nhóm Admin cục bộ</code></pre>
<h3>3. PowerShell — tư duy khác</h3>
<p>PowerShell dùng <b>cmdlet</b> dạng <code>Động-từ-Danh-từ</code> và <b>đường ống (pipeline)</b> truyền <i>đối tượng</i>, không chỉ chữ. 3 lệnh đầu tiên cần nhớ: <code>Get-Command</code> (tìm lệnh), <code>Get-Help &lt;lệnh&gt; -Examples</code> (xem ví dụ), <code>Get-Member</code> (xem đối tượng có thuộc tính gì).</p>
<pre><code>Get-Process | Sort-Object CPU -Descending | Select-Object -First 10 Name,CPU,Id
Get-Service | Where-Object {$_.Status -eq 'Running'} | Measure-Object
Restart-Service -Name Spooler
Get-Volume                                          # dung lượng các ổ
Get-ComputerInfo | Select WindowsProductName,OsVersion,CsTotalPhysicalMemory
Get-HotFix | Sort InstalledOn -Descending | Select -First 5
Get-WinEvent -FilterHashtable @{LogName='System';Level=1,2;StartTime=(Get-Date).AddDays(-1)} | Select -First 10 TimeCreated,Id,Message
Test-NetConnection 8.8.8.8 -Port 53                 # ping + kiểm tra cổng
Get-NetIPConfiguration                              # IP hiện tại
Get-LocalUser ; Get-LocalGroupMember Administrators
Get-ChildItem C:\\Users -Recurse -File -ErrorAction SilentlyContinue | Sort Length -Descending | Select -First 10 FullName,Length   # tìm file lớn
Get-Process | Export-Csv C:\\Temp\\proc.csv -NoTypeInformation   # xuất ra CSV</code></pre>
<aside class="def"><p><b>Execution Policy</b>: chính sách cho phép chạy script <code>.ps1</code>. Mặc định trên Windows client là <code>Restricted</code>. Đặt cho phiên làm việc: <code>Set-ExecutionPolicy -Scope Process RemoteSigned</code>. Không tắt hẳn chính sách này trên máy người dùng.</p></aside>
<h3>Viết script nhỏ đầu tiên</h3>
<pre><code># Báo cáo dung lượng ổ đĩa — lưu thành disk-report.ps1
$report = Get-Volume | Where-Object DriveLetter |
  Select-Object DriveLetter,
                @{n='SizeGB';e={[math]::Round($_.Size/1GB,1)}},
                @{n='FreeGB';e={[math]::Round($_.SizeRemaining/1GB,1)}},
                @{n='Free%'; e={[math]::Round($_.SizeRemaining/$_.Size*100,0)}}
$report | Format-Table -AutoSize
$report | Where-Object {$_.'Free%' -lt 15} | ForEach-Object { Write-Warning "Ổ $($_.DriveLetter) sắp đầy ($($_.'Free%')% trống)" }</code></pre>
<aside class="tip"><p>Với PowerShell từ xa: <code>Enter-PSSession -ComputerName PC01</code> hoặc <code>Invoke-Command -ComputerName PC01,PC02 -ScriptBlock { Get-Service Spooler }</code> (yêu cầu WinRM bật, thường do GPO). Trong thực tế đây là cách sửa hàng loạt máy.</p></aside>`
    },
    {
      id: 'd2-l5', title: 'Xử lý sự cố Windows: máy chậm, không boot, BSOD, cập nhật lỗi…', min: 60,
      html: `
<h3>A. “Máy chậm” — quy trình 8 bước</h3>
<ol class="steps">
<li>Hỏi: chậm từ khi nào? mọi lúc hay chỉ khi mở ứng dụng X? Mới cài gì/cập nhật gì?</li>
<li><b>Task Manager</b>: tiến trình nào đang chiếm CPU/RAM/Disk cao? Tab Startup: tắt chương trình khởi động không cần.</li>
<li>Còn bao nhiêu dung lượng ổ C:? (&lt;10–15% trống thì chậm). Dọn: Disk Cleanup, <code>%TEMP%</code>, Storage Sense.</li>
<li>RAM có đủ không? (8GB mà mở nhiều Chrome/Teams → thiếu).</li>
<li>Ổ là HDD hay SSD? HDD ở 100% = nên thay SSD (nâng cấp hiệu quả nhất).</li>
<li>Quét malware/antivirus, kiểm tra Windows Update đang chạy ngầm.</li>
<li><code>sfc /scannow</code> và <code>DISM … /RestoreHealth</code>.</li>
<li>Nếu vẫn tệ: backup → Reset this PC / cài lại, hoặc đề xuất đổi máy.</li>
</ol>
<h3>B. Máy không vào được Windows (boot lỗi)</h3>
<table><thead><tr><th>Thông báo / hiện tượng</th><th>Hướng xử lý</th></tr></thead><tbody>
<tr><td>Boot vào <b>Automatic Repair</b> loop</td><td>Advanced options → Startup Repair; Command Prompt: <code>bootrec /fixmbr</code>, <code>bootrec /fixboot</code>, <code>bootrec /rebuildbcd</code>; <code>chkdsk C: /f</code>; System Restore</td></tr>
<tr><td>“Operating system not found / No boot device”</td><td>Vào BIOS: ổ có được nhận? Boot order? UEFI/Legacy đúng? Ổ hỏng → sao lưu bằng WinPE/USB Linux</td></tr>
<tr><td>Màn hình đen có con trỏ chuột</td><td>Ctrl+Alt+Del → Task Manager → chạy <code>explorer.exe</code>; cập nhật/gỡ driver đồ hoạ trong Safe Mode</td></tr>
<tr><td>Treo ở logo Windows</td><td>Safe Mode (giữ Shift khi Restart) → gỡ bản cập nhật gần nhất / driver mới</td></tr>
<tr><td>BitLocker đòi recovery key</td><td>Lấy key từ AD/Entra ID/tài khoản Microsoft của user (hỏi xác minh!), nhập; tìm nguyên nhân thay đổi (BIOS update, đổi phần cứng)</td></tr>
</tbody></table>
<p><b>Safe Mode:</b> Shift + Restart → Troubleshoot → Advanced options → Startup Settings → F4/F5. Chỉ tải driver/dịch vụ tối thiểu, dùng để gỡ phần mềm/driver gây lỗi.</p>
<h3>C. BSOD (màn hình xanh)</h3>
<p>Ghi lại <b>Stop code</b> (vd <code>IRQL_NOT_LESS_OR_EQUAL</code>, <code>PAGE_FAULT_IN_NONPAGED_AREA</code>, <code>CRITICAL_PROCESS_DIED</code>, <code>INACCESSIBLE_BOOT_DEVICE</code>) và tên file nếu có (vd <code>nvlddmkm.sys</code> = driver NVIDIA). Hướng xử lý chung: (1) có thay đổi gần đây không (driver, update, phần cứng mới)? → gỡ/rollback; (2) kiểm tra RAM (<code>mdsched</code>) và ổ (<code>chkdsk</code>, SMART); (3) <code>sfc</code>/<code>DISM</code>; (4) kiểm tra nhiệt độ; (5) đọc dump file (<code>C:\\Windows\\Minidump</code>) bằng WinDbg/BlueScreenView.</p>
<h3>D. Windows Update lỗi</h3>
<ul><li>Chạy <b>Windows Update Troubleshooter</b>.</li><li>Dừng dịch vụ <code>wuauserv</code>, <code>bits</code>; đổi tên <code>C:\\Windows\\SoftwareDistribution</code> thành <code>.old</code>; khởi động lại dịch vụ.</li><li><code>sfc /scannow</code> + <code>DISM /Online /Cleanup-Image /RestoreHealth</code>.</li><li>Kiểm tra dung lượng ổ C: và thời gian/múi giờ máy.</li><li>Trong doanh nghiệp, xem máy có đang trỏ WSUS/Intune sai hay không (<code>gpresult</code>).</li></ul>
<h3>E. Các lỗi hay gặp khác</h3>
<table><thead><tr><th>Lỗi</th><th>Gợi ý</th></tr></thead><tbody>
<tr><td>Ứng dụng treo</td><td>Task Manager → End task; xem Event Viewer (Event 1000); sửa/cài lại; xoá cache; chạy compatibility mode</td></tr>
<tr><td>Đăng nhập “temporary profile”</td><td>Profile hỏng (khoá <code>.bak</code> trong <code>HKLM\\...\\ProfileList</code>) → khôi phục dữ liệu từ <code>C:\\Users\\&lt;tên&gt;</code> sang profile mới</td></tr>
<tr><td>Không có âm thanh</td><td>Chọn đúng Output device; tắt mute; Services <i>Windows Audio</i>; cập nhật driver</td></tr>
<tr><td>Phím/chuột lạ, sai ngôn ngữ</td><td>Settings → Time &amp; Language; kiểm tra Sticky Keys; Win+Space đổi bộ gõ</td></tr>
<tr><td>Hết dung lượng ổ C:</td><td>WinDirStat/TreeSize tìm thư mục lớn; dọn Temp, Downloads, Recycle Bin, dọn Windows Update (cleanmgr), OneDrive Files On-Demand</td></tr>
<tr><td>Quên mật khẩu local</td><td>Đừng dùng thủ thuật vượt quyền trên máy công ty; dùng admin khác để reset; domain: reset từ AD</td></tr>
</tbody></table>
<aside class="warn"><p>Trước khi “Reset this PC” hoặc cài lại: sao lưu dữ liệu <b>và</b> xác nhận user đồng ý, ghi chú danh sách phần mềm, key BitLocker, máy in đã cài. Nhiều sự cố “mất dữ liệu” trong nghề bắt nguồn từ bước này.</p></aside>`
    }
  ],
  lab: {
    title: 'Quản trị Windows bằng GUI và PowerShell trên máy ảo',
    html: `
<p><b>Thời gian:</b> ~2 giờ. Dùng VM Windows ở Ngày 1; chụp snapshot trước khi làm (VirtualBox → Machine → Take Snapshot) để có thể quay lại.</p>
<ol class="steps">
<li><b>Tạo user:</b> mở <code>lusrmgr.msc</code> hoặc PowerShell (admin): <pre><code>$pw = Read-Host -AsSecureString "Mat khau"
New-LocalUser -Name "nhanvien1" -Password $pw -FullName "Nhan Vien 1"
Add-LocalGroupMember -Group "Users" -Member "nhanvien1"</code></pre> Đăng nhập thử bằng <code>nhanvien1</code>, thử cài phần mềm → quan sát UAC đòi quyền admin.</li>
<li><b>Chia sẻ thư mục + NTFS:</b> tạo <code>C:\\Share\\KeToan</code>, share qua Properties → Sharing (Everyone: Read/Write), rồi chỉnh tab Security: chỉ nhóm <code>KeToan</code> (tự tạo nhóm local) được Modify, xoá quyền Users. Đăng nhập <code>nhanvien1</code> truy cập <code>\\\\localhost\\KeToan</code> → phải bị từ chối. Thêm user vào nhóm và thử lại.</li>
<li><b>Event Viewer:</b> tìm sự kiện Event ID 6005/6006 hoặc 1074 lần khởi động gần nhất. Restart VM, tìm lại sự kiện mới. Ghi lại giờ và nguyên nhân.</li>
<li><b>Tự gây lỗi rồi sửa:</b> (a) chạy <code>net stop spooler</code> rồi mở Services xem trạng thái, bật lại; (b) vào <code>msconfig</code> → bật Safe Boot, restart, quan sát khác biệt, rồi tắt lại; (c) cố ý lấp đầy ổ (tạo file lớn bằng <code>fsutil file createnew C:\\big.dat 5000000000</code>), dùng PowerShell tìm file lớn rồi xoá.</li>
<li><b>Script PowerShell:</b> chép script báo cáo ổ đĩa ở Bài 4, chạy, rồi mở rộng: xuất kết quả ra <code>C:\\Temp\\disk-report.csv</code> và thêm <code>Get-Date</code> vào tên file.</li>
<li><b>Sửa hệ thống:</b> chạy <code>sfc /scannow</code> và đọc kết quả; chạy <code>DISM /Online /Cleanup-Image /CheckHealth</code>.</li>
<li><b>Viết KB:</b> chọn 1 lỗi bạn vừa tự sửa và viết bài KB 10 dòng theo mẫu (Triệu chứng / Nguyên nhân / Các bước / Kiểm tra / Lưu ý).</li>
</ol>
<p><b>Sản phẩm để lưu:</b> script <code>disk-report.ps1</code>, ảnh chụp Event Viewer + quyền NTFS, 1 bài KB. Đây là “Dự án 4” trong mục dự án CV.</p>`
  },
  quiz: [
    { q: 'Windows 11 yêu cầu ổ đĩa và chế độ khởi động nào?', o: ['MBR + Legacy BIOS', 'GPT + UEFI (Secure Boot, TPM 2.0)', 'FAT32 + BIOS', 'Bất kỳ'], a: 1, e: 'Windows 11 chỉ hỗ trợ chính thức UEFI/GPT với Secure Boot và TPM 2.0.' },
    { q: 'Thư mục được share với Everyone: Full Control (Share) nhưng NTFS chỉ cho nhóm KeToan quyền Modify. Một nhân viên Sales truy cập qua mạng sẽ…', o: ['Sửa được file', 'Chỉ đọc được', 'Bị từ chối truy cập', 'Xoá được thư mục'], a: 2, e: 'Quyền hiệu lực là phần giao (chặt hơn) của Share và NTFS. NTFS không cấp gì cho Sales → từ chối.' },
    { q: 'Lệnh nào dùng để quét và sửa file hệ thống Windows bị hỏng?', o: ['ipconfig /all', 'sfc /scannow', 'net use', 'gpresult /r'], a: 1, e: 'System File Checker. Nếu sfc lỗi, chạy DISM /Online /Cleanup-Image /RestoreHealth rồi sfc lại.' },
    { q: 'Công cụ nào dùng để xem dịch vụ Print Spooler và restart nó bằng GUI?', o: ['devmgmt.msc', 'services.msc', 'diskmgmt.msc', 'regedit'], a: 1, e: 'services.msc quản lý các dịch vụ Windows.' },
    { q: 'Event ID 41 (Kernel-Power) thường cho biết điều gì?', o: ['Người dùng đăng nhập', 'Máy tắt bất ngờ không sạch (mất điện, treo cứng, lỗi nguồn)', 'Ổ đĩa đầy', 'Đã cài bản cập nhật'], a: 1, e: 'Event 41 là dấu hiệu máy khởi động lại mà không tắt đúng cách.' },
    { q: 'Cmdlet PowerShell nào liệt kê các dịch vụ?', o: ['Show-Services', 'Get-Service', 'List-Service', 'ps -services'], a: 1, e: 'Get-Service. Cấu trúc cmdlet là Động-từ-Danh-từ: Get-, Set-, Restart-, Stop-…' },
    { q: 'Máy khởi động vào Automatic Repair loop. Bước nào hợp lý trước?', o: ['Cài lại Windows ngay', 'Vào Advanced options: Startup Repair / Command Prompt (chkdsk, bootrec) / System Restore', 'Đổi mainboard', 'Xoá Registry'], a: 1, e: 'Dùng công cụ phục hồi tích hợp trước khi tính đến cài lại.' },
    { q: 'Trước khi sửa Registry bạn nên…', o: ['Sửa luôn cho nhanh', 'Export key liên quan để dự phòng', 'Xoá cả hive', 'Tắt antivirus'], a: 1, e: 'Registry sửa sai có thể làm hỏng hệ điều hành; luôn export (hoặc tạo restore point) trước.' },
    { q: 'Người dùng đăng nhập thấy desktop trống, báo “temporary profile”. Nguyên nhân thường là…', o: ['Hỏng card mạng', 'Profile người dùng bị hỏng hoặc không tải được', 'Hết RAM', 'Chưa cập nhật BIOS'], a: 1, e: 'Windows tạo profile tạm khi không tải được profile gốc; cần sửa profile (khóa ProfileList) hoặc tạo profile mới và chuyển dữ liệu.' }
  ],
  scenarios: [
    { q: '<b>Tình huống:</b> “Laptop của em mở lên rất chậm, quạt kêu to, em chỉ mở Excel.” Bạn mở Task Manager thấy CPU 100% bởi tiến trình “Antimalware Service Executable” và ổ đĩa HDD 100%. Hướng xử lý hợp lý?', o: ['Tắt hẳn Windows Defender vĩnh viễn', 'Đợi quét xong / hẹn lịch quét ngoài giờ, kiểm tra tình trạng ổ HDD, đề xuất nâng cấp SSD + RAM, dọn startup', 'Cài lại Windows ngay', 'Tăng độ sáng màn hình'], a: 1, e: 'Không tắt bảo mật. Nguyên nhân gốc thường là HDD chậm + quá nhiều chương trình khởi động; giải pháp bền vững là SSD.' },
    { q: '<b>Tình huống:</b> Sau bản cập nhật tối qua, máy của user hiện BSOD “INACCESSIBLE_BOOT_DEVICE” lặp lại. Bạn thử gì?', o: ['Đoán và đổi RAM', 'Vào WinRE: gỡ bản cập nhật chất lượng gần nhất (Uninstall Updates) hoặc System Restore; kiểm tra chế độ SATA/NVMe trong BIOS có bị đổi không; chkdsk', 'Cài lại phần mềm văn phòng', 'Đổi chuột'], a: 1, e: 'Lỗi này thường do driver lưu trữ/update hoặc thay đổi chế độ điều khiển ổ đĩa trong BIOS.' },
    { q: '<b>Tình huống:</b> User không mở được thư mục \\\\fileserver\\HR, báo “Access is denied”, nhưng đồng nghiệp cùng phòng thì mở được. Kiểm tra gì trước?', o: ['Reinstall Windows', 'User có thuộc nhóm HR trong AD không? (kiểm tra membership, đăng xuất/đăng nhập lại để cập nhật token), kiểm tra Effective Access', 'Đổi cáp mạng', 'Format file server'], a: 1, e: 'Chỉ 1 người bị → vấn đề tài khoản/quyền. Thành viên nhóm mới chỉ có hiệu lực sau khi đăng nhập lại (token).' }
  ]
});
