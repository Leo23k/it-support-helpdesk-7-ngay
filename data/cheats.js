(function () {
  var C = COURSE.cheats;
  function add(cat, c, d) { C.push({ cat: cat, c: c, d: d }); }

  /* Mở nhanh công cụ (Win+R) */
  add('Mở công cụ (Win+R)', 'devmgmt.msc', 'Device Manager — thiết bị &amp; driver');
  add('Mở công cụ (Win+R)', 'diskmgmt.msc', 'Disk Management — phân vùng, ổ mới');
  add('Mở công cụ (Win+R)', 'eventvwr.msc', 'Event Viewer — nhật ký sự kiện');
  add('Mở công cụ (Win+R)', 'services.msc', 'Services — dịch vụ Windows');
  add('Mở công cụ (Win+R)', 'compmgmt.msc', 'Computer Management');
  add('Mở công cụ (Win+R)', 'lusrmgr.msc', 'Local Users and Groups');
  add('Mở công cụ (Win+R)', 'gpedit.msc', 'Local Group Policy Editor (Pro+)');
  add('Mở công cụ (Win+R)', 'taskschd.msc', 'Task Scheduler');
  add('Mở công cụ (Win+R)', 'appwiz.cpl', 'Programs and Features — gỡ phần mềm');
  add('Mở công cụ (Win+R)', 'ncpa.cpl', 'Network Connections — đặt IP');
  add('Mở công cụ (Win+R)', 'sysdm.cpl', 'System Properties — tên máy, domain, restore');
  add('Mở công cụ (Win+R)', 'msinfo32', 'System Information');
  add('Mở công cụ (Win+R)', 'msconfig', 'System Configuration — safe boot, startup');
  add('Mở công cụ (Win+R)', 'regedit', 'Registry Editor (export trước khi sửa)');
  add('Mở công cụ (Win+R)', 'mstsc', 'Remote Desktop Connection');
  add('Mở công cụ (Win+R)', 'mdsched', 'Windows Memory Diagnostic');
  add('Mở công cụ (Win+R)', 'dsa.msc', 'Active Directory Users and Computers');
  add('Mở công cụ (Win+R)', 'gpmc.msc', 'Group Policy Management');
  add('Mở công cụ (Win+R)', 'printmanagement.msc', 'Print Management');
  add('Mở công cụ (Win+R)', 'resmon', 'Resource Monitor');

  /* CMD hệ thống */
  add('CMD – Hệ thống', 'systeminfo', 'Cấu hình máy, ngày cài, hotfix');
  add('CMD – Hệ thống', 'sfc /scannow', 'Quét &amp; sửa file hệ thống (admin)');
  add('CMD – Hệ thống', 'DISM /Online /Cleanup-Image /RestoreHealth', 'Sửa kho ảnh Windows, rồi chạy lại sfc');
  add('CMD – Hệ thống', 'chkdsk C: /f /r', 'Quét lỗi ổ đĩa (cần restart)');
  add('CMD – Hệ thống', 'tasklist | findstr chrome', 'Liệt kê tiến trình, lọc theo tên');
  add('CMD – Hệ thống', 'taskkill /IM chrome.exe /F', 'Tắt cưỡng bức tiến trình');
  add('CMD – Hệ thống', 'shutdown /r /t 0', 'Restart ngay (/s tắt, /a huỷ)');
  add('CMD – Hệ thống', 'whoami /groups', 'Tôi là ai, thuộc nhóm nào');
  add('CMD – Hệ thống', 'wmic bios get serialnumber', 'Lấy serial máy (nếu có wmic)');
  add('CMD – Hệ thống', 'slmgr /xpr', 'Trạng thái kích hoạt Windows');
  add('CMD – Hệ thống', 'robocopy C:\\Data D:\\Backup /MIR /R:2 /W:2', 'Đồng bộ thư mục (cẩn thận /MIR sẽ xoá file thừa ở đích)');
  add('CMD – Hệ thống', 'bootrec /rebuildbcd', 'Sửa Boot Configuration Data (trong WinRE)');
  add('CMD – Hệ thống', 'wusa /uninstall /kb:5000000', 'Gỡ bản cập nhật theo mã KB');
  add('CMD – Hệ thống', 'winget upgrade --all', 'Cập nhật hàng loạt phần mềm');

  /* Mạng */
  add('Mạng', 'ipconfig /all', 'IP, mask, gateway, DNS, MAC, DHCP server');
  add('Mạng', 'ipconfig /release && ipconfig /renew', 'Xin IP mới từ DHCP');
  add('Mạng', 'ipconfig /flushdns', 'Xoá cache DNS');
  add('Mạng', 'ipconfig /displaydns', 'Xem cache DNS');
  add('Mạng', 'ping -t 8.8.8.8', 'Ping liên tục (Ctrl+C dừng)');
  add('Mạng', 'tracert google.com', 'Liệt kê các chặng tới đích');
  add('Mạng', 'pathping google.com', 'Ping + tracert, thống kê mất gói từng chặng');
  add('Mạng', 'nslookup -type=mx corp.com', 'Tra bản ghi MX (txt, a, cname…)');
  add('Mạng', 'netstat -ano', 'Kết nối &amp; cổng đang mở kèm PID');
  add('Mạng', 'arp -a', 'Bảng IP ↔ MAC');
  add('Mạng', 'route print', 'Bảng định tuyến');
  add('Mạng', 'netsh winsock reset', 'Reset Winsock (cần restart)');
  add('Mạng', 'netsh int ip reset', 'Reset TCP/IP stack (cần restart)');
  add('Mạng', 'netsh wlan show profiles', 'Danh sách Wi-Fi đã lưu');
  add('Mạng', 'netsh advfirewall set allprofiles state off', 'Tắt Windows Firewall (CHỈ để test, bật lại ngay)');
  add('Mạng', 'net use K: \\\\fileserver\\share /persistent:yes', 'Map ổ mạng');
  add('Mạng', 'net use * /delete', 'Xoá mọi ổ mạng đang kết nối');

  /* Domain / GPO */
  add('Domain / GPO', 'gpupdate /force', 'Áp dụng lại Group Policy');
  add('Domain / GPO', 'gpresult /r', 'Tóm tắt GPO đã áp dụng');
  add('Domain / GPO', 'gpresult /h C:\\Temp\\gp.html', 'Báo cáo HTML chi tiết');
  add('Domain / GPO', 'nltest /dsgetdc:corp.local', 'Tìm Domain Controller đang dùng');
  add('Domain / GPO', 'nltest /sc_verify:corp.local', 'Kiểm tra secure channel máy-domain');
  add('Domain / GPO', 'klist purge', 'Xoá Kerberos ticket (sau khi đổi nhóm)');
  add('Domain / GPO', 'dcdiag /v', 'Kiểm tra sức khoẻ DC (chạy trên DC)');
  add('Domain / GPO', 'repadmin /replsummary', 'Tóm tắt replication AD');
  add('Domain / GPO', 'net user an.nguyen /domain', 'Thông tin tài khoản domain (hết hạn mật khẩu, nhóm…)');
  add('Domain / GPO', 'w32tm /query /status', 'Trạng thái đồng bộ giờ (Kerberos nhạy cảm giờ)');

  /* PowerShell */
  add('PowerShell', 'Get-Help Get-Service -Examples', 'Xem ví dụ của cmdlet');
  add('PowerShell', 'Get-Process | Sort CPU -Descending | Select -First 10', 'Top 10 tiến trình CPU');
  add('PowerShell', 'Get-Service | Where Status -eq Running', 'Dịch vụ đang chạy');
  add('PowerShell', 'Restart-Service Spooler', 'Khởi động lại dịch vụ in');
  add('PowerShell', 'Get-Volume', 'Dung lượng các ổ');
  add('PowerShell', 'Get-NetIPConfiguration', 'Cấu hình mạng');
  add('PowerShell', 'Test-NetConnection server01 -Port 3389', 'Kiểm tra cổng TCP');
  add('PowerShell', 'Get-WinEvent -LogName System -MaxEvents 50 | ? LevelDisplayName -in "Error","Critical"', 'Lỗi gần đây trong log System');
  add('PowerShell', 'Get-HotFix | Sort InstalledOn -Desc | Select -First 5', '5 bản cập nhật mới nhất');
  add('PowerShell', 'Get-LocalGroupMember Administrators', 'Thành viên nhóm Administrators');
  add('PowerShell', 'Get-ComputerInfo | Select OsName,OsVersion,CsName', 'Thông tin Windows');
  add('PowerShell', 'Set-ExecutionPolicy -Scope Process RemoteSigned', 'Cho phép chạy script trong phiên hiện tại');
  add('PowerShell', 'Enter-PSSession -ComputerName PC01', 'Phiên PowerShell từ xa');
  add('PowerShell', 'Get-ChildItem C:\\ -Recurse -File -EA 0 | Sort Length -Desc | Select -First 10 FullName,Length', 'Tìm 10 file lớn nhất');

  /* AD PowerShell */
  add('Active Directory PS', 'Get-ADUser an.nguyen -Properties LockedOut,PasswordLastSet,Enabled', 'Trạng thái tài khoản');
  add('Active Directory PS', 'Unlock-ADAccount -Identity an.nguyen', 'Mở khoá tài khoản');
  add('Active Directory PS', 'Set-ADAccountPassword an.nguyen -Reset -NewPassword (Read-Host -AsSecureString)', 'Reset mật khẩu');
  add('Active Directory PS', 'Set-ADUser an.nguyen -ChangePasswordAtLogon $true', 'Bắt đổi mật khẩu khi đăng nhập');
  add('Active Directory PS', 'Disable-ADAccount an.nguyen', 'Vô hiệu hoá tài khoản');
  add('Active Directory PS', 'Add-ADGroupMember G_KeToan -Members an.nguyen', 'Thêm user vào nhóm');
  add('Active Directory PS', 'Get-ADPrincipalGroupMembership an.nguyen | Select Name', 'User thuộc nhóm nào');
  add('Active Directory PS', 'Search-ADAccount -LockedOut | Select Name,SamAccountName', 'Danh sách tài khoản đang bị khoá');
  add('Active Directory PS', 'Test-ComputerSecureChannel -Repair -Credential (Get-Credential)', 'Sửa lỗi trust relationship');

  /* Linux */
  add('Linux', 'ls -la', 'Liệt kê file kèm quyền, file ẩn');
  add('Linux', 'df -h', 'Dung lượng ổ đĩa');
  add('Linux', 'du -sh * | sort -rh | head', 'Thư mục chiếm nhiều dung lượng');
  add('Linux', 'ps aux | grep nginx', 'Tìm tiến trình');
  add('Linux', 'systemctl status sshd', 'Trạng thái dịch vụ');
  add('Linux', 'journalctl -u sshd -n 50', 'Log của dịch vụ');
  add('Linux', 'tail -f /var/log/syslog', 'Xem log trực tiếp');
  add('Linux', 'ip a', 'Địa chỉ IP');
  add('Linux', 'ss -tulpn', 'Cổng đang lắng nghe');
  add('Linux', 'chmod 644 file && chown user:group file', 'Đổi quyền / chủ sở hữu');
  add('Linux', 'sudo apt update && sudo apt upgrade -y', 'Cập nhật gói (Debian/Ubuntu)');
  add('Linux', 'grep -ri "error" /var/log | head', 'Tìm chuỗi trong log');

  /* Ports */
  var P = COURSE.ports;
  [
    ['20/21', 'TCP', 'FTP', 'Truyền file (không mã hoá)'],
    ['22', 'TCP', 'SSH / SFTP', 'Quản trị Linux, thiết bị mạng'],
    ['23', 'TCP', 'Telnet', 'Cũ, không mã hoá — nên tắt'],
    ['25', 'TCP', 'SMTP', 'Gửi mail giữa server'],
    ['53', 'TCP/UDP', 'DNS', 'Phân giải tên'],
    ['67/68', 'UDP', 'DHCP', 'Cấp IP tự động'],
    ['80', 'TCP', 'HTTP', 'Web không mã hoá'],
    ['88', 'TCP/UDP', 'Kerberos', 'Xác thực AD'],
    ['110', 'TCP', 'POP3', 'Nhận mail (cũ)'],
    ['123', 'UDP', 'NTP', 'Đồng bộ giờ'],
    ['135/139', 'TCP', 'RPC / NetBIOS', 'Dịch vụ Windows cũ'],
    ['143', 'TCP', 'IMAP', 'Nhận mail'],
    ['389', 'TCP/UDP', 'LDAP', 'Truy vấn AD (636 = LDAPS)'],
    ['443', 'TCP', 'HTTPS', 'Web mã hoá, M365, API'],
    ['445', 'TCP', 'SMB', 'File share Windows'],
    ['587', 'TCP', 'SMTP (submission)', 'Gửi mail từ client'],
    ['993 / 995', 'TCP', 'IMAPS / POP3S', 'Nhận mail mã hoá'],
    ['1433', 'TCP', 'SQL Server', 'Cơ sở dữ liệu'],
    ['3306', 'TCP', 'MySQL', 'Cơ sở dữ liệu'],
    ['3389', 'TCP/UDP', 'RDP', 'Remote Desktop'],
    ['5985/5986', 'TCP', 'WinRM', 'PowerShell Remoting (HTTP/HTTPS)'],
    ['9100', 'TCP', 'RAW / JetDirect', 'In mạng (máy in)']
  ].forEach(function (r) { P.push(r); });
})();
