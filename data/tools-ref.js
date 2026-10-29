// Dữ liệu tra cứu cho công cụ: mã lỗi / Event ID (window.TREF.errors) và cây chẩn đoán (window.TREF.flows).
window.TREF = { errors: [], flows: [] };
(function () {
  var E = window.TREF.errors;
  function add(cat, rows) { rows.forEach(function (r) { E.push({ cat: cat, code: r[0], name: r[1], meaning: r[2], todo: r[3] }); }); }

  add('Event ID', [
    ['4624', 'Đăng nhập thành công (Security)', 'Logon Type cho biết cách đăng nhập: 2 = tại máy, 3 = qua mạng (mở share), 4 = batch, 5 = service, 7 = mở khoá màn hình, 10 = Remote Desktop, 11 = dùng thông tin cache.', 'Xác minh “ai đăng nhập khi nào, từ đâu”. Nhiều Type 10 từ IP lạ = nghi RDP bị dò mật khẩu.'],
    ['4625', 'Đăng nhập thất bại (Security)', 'Xem Status/Sub Status: 0xC000006A sai mật khẩu · 0xC0000064 user không tồn tại · 0xC0000234 tài khoản bị khoá · 0xC0000072 tài khoản bị vô hiệu · 0xC0000071 mật khẩu hết hạn.', 'Nhiều 4625 liên tiếp từ cùng IP = brute force. Lấy Source Network Address để chặn/báo Security.'],
    ['4634 / 4647', 'Đăng xuất', '4634 = phiên kết thúc, 4647 = user chủ động đăng xuất.', 'Ghép với 4624 để tính thời lượng phiên.'],
    ['4648', 'Đăng nhập bằng thông tin chỉ định rõ', 'Ai đó dùng thông tin khác để chạy chương trình/map ổ đĩa (runas, net use /user).', 'Thường bình thường với admin; đáng ngờ nếu từ tài khoản/máy lạ.'],
    ['4672', 'Đặc quyền đặc biệt được gán', 'Phiên đăng nhập có quyền quản trị (SeDebugPrivilege…).', 'Dùng để biết admin nào vừa đăng nhập máy này.'],
    ['4720', 'Tạo tài khoản người dùng', 'Một user mới được tạo trong AD hoặc máy local.', 'Đối chiếu với yêu cầu onboarding; tài khoản lạ = báo Security.'],
    ['4722 / 4725', 'Tài khoản được bật / bị vô hiệu hoá', '4722 = enable, 4725 = disable.', 'Kiểm tra ai thao tác & khi nào khi user hỏi “sao tài khoản của tôi bị tắt”.'],
    ['4723 / 4724', 'Đổi mật khẩu / Admin đặt lại mật khẩu', '4723 = user tự đổi, 4724 = người khác reset.', 'Xác minh ai đã reset mật khẩu (audit nội bộ).'],
    ['4726', 'Xoá tài khoản', 'Tài khoản đã bị xoá.', 'Khôi phục từ AD Recycle Bin nếu bật.'],
    ['4728 / 4732 / 4756', 'Thêm thành viên vào nhóm', '4728 = nhóm global, 4732 = nhóm local, 4756 = nhóm universal.', 'Theo dõi cấp quyền; thêm vào Domain Admins ngoài quy trình = sự cố bảo mật.'],
    ['4740', 'Tài khoản bị khoá (lockout)', 'Có trường “Caller Computer Name” cho biết máy/dịch vụ gây ra các lần đăng nhập sai.', 'Tìm nguồn thật sự: thiết bị di động, ổ mạng cũ, dịch vụ chạy bằng tài khoản user.'],
    ['4767', 'Tài khoản được mở khoá', 'Ai đó đã unlock tài khoản.', 'Ghi nhận trong ticket: ai mở khoá và lúc nào.'],
    ['4768 / 4769', 'Kerberos: cấp TGT / service ticket', 'Hoạt động xác thực Kerberos bình thường trên DC.', 'Dùng khi điều tra đăng nhập domain / truy cập dịch vụ.'],
    ['4771', 'Kerberos: pre-authentication thất bại', 'Thường do sai mật khẩu domain hoặc lệch giờ.', 'Kiểm tra mật khẩu và đồng bộ giờ (lệch > 5 phút gây lỗi Kerberos).'],
    ['1102', 'Nhật ký Security bị xoá', 'Ai đó đã xoá audit log.', 'Hành vi đáng ngờ — báo Security ngay.'],
    ['41', 'Kernel-Power: tắt máy bất thường', 'Máy khởi động lại mà không tắt sạch (mất điện, treo, BSOD, nhấn giữ nút nguồn).', 'Xem thêm Event 1001 (BugCheck). Kiểm tra nguồn điện, nhiệt độ, driver.'],
    ['1074', 'Tắt/khởi động lại do tiến trình hoặc user', 'Cho biết tiến trình/người dùng khởi tạo shutdown và lý do.', 'Trả lời câu hỏi “ai/cái gì làm máy tự khởi động lại” (Windows Update, user…).'],
    ['6005 / 6006 / 6008', 'Event Log bắt đầu / dừng / tắt bất thường', '6005 = máy lên, 6006 = tắt sạch, 6008 = lần tắt trước không bình thường.', 'Dựng timeline các lần boot/tắt máy.'],
    ['7036', 'Dịch vụ đổi trạng thái', 'Ghi “service entered the running/stopped state”.', 'Dò xem dịch vụ nào dừng đúng lúc có sự cố.'],
    ['7034 / 7031', 'Dịch vụ dừng đột ngột', 'Service Control Manager: dịch vụ tự dừng ngoài ý muốn.', 'Xem log ứng dụng liên quan, cấu hình Recovery (tự khởi động lại).'],
    ['7000 / 7001', 'Dịch vụ không khởi động được / lỗi phụ thuộc', '7001 = dịch vụ phụ thuộc vào dịch vụ khác đã lỗi.', 'Mở Services → Dependencies, khởi động dịch vụ gốc trước.'],
    ['7045', 'Dịch vụ mới được cài đặt', 'Một service mới vừa xuất hiện trên máy.', 'Kẻ tấn công thường tạo service để duy trì quyền — kiểm tra tên/đường dẫn lạ.'],
    ['7 / 11 / 51 (Disk)', 'Lỗi đĩa: bad block / lỗi controller / lỗi khi paging', 'Ổ cứng hoặc cáp có vấn đề.', 'Sao lưu ngay, kiểm tra SMART (CrystalDiskInfo), thay ổ nếu cần.'],
    ['55 (Ntfs)', 'Cấu trúc hệ thống tệp bị hỏng', 'NTFS phát hiện lỗi.', 'Chạy chkdsk /f (sau khi sao lưu), kiểm tra ổ cứng.'],
    ['1000 / 1001', 'Ứng dụng bị crash / Windows Error Reporting', '1000 ghi tên ứng dụng, module gây lỗi và mã ngoại lệ.', 'Ghi lại “Faulting module”; cập nhật/sửa/cài lại ứng dụng.'],
    ['1026', '.NET Runtime: lỗi chưa xử lý', 'Ứng dụng .NET bị crash kèm stack trace.', 'Gửi nguyên văn cho dev / cài lại .NET runtime.'],
    ['1014 (DNS Client)', 'Phân giải tên bị timeout', 'Không DNS server nào phản hồi kịp.', 'Kiểm tra DNS server (ping, nslookup), cáp/Wi-Fi, VPN.'],
    ['4199 (Tcpip)', 'Xung đột địa chỉ IP', 'Hai thiết bị cùng một IP.', 'Đổi sang DHCP; tìm thiết bị đặt IP tĩnh trùng bằng arp -a.'],
    ['5719 (Netlogon)', 'Không có domain controller phục vụ', 'Máy không thiết lập được phiên bảo mật với DC.', 'Kiểm tra mạng/DNS tới DC, giờ hệ thống, secure channel.'],
    ['1129 / 1058 (GroupPolicy)', 'Xử lý Group Policy thất bại', '1129 = không có kết nối mạng tới DC; 1058 = không đọc được gpt.ini trong SYSVOL.', 'Kiểm tra DNS/kết nối tới DC và quyền SYSVOL; gpupdate /force.'],
    ['19 / 20 (WindowsUpdateClient)', 'Cài đặt bản cập nhật thành công / thất bại', '20 ghi mã lỗi (vd 0x80070005, 0x800F0922).', 'Tra mã lỗi trong tab “Mã lỗi Windows”; chạy troubleshooter, DISM.'],
    ['6161 (Print)', 'Tài liệu in thất bại', 'Hàng đợi báo không in được tài liệu.', 'Xoá hàng đợi, khởi động lại spooler, kiểm tra driver/kết nối.']
  ]);

  add('BSOD', [
    ['0x0000000A', 'IRQL_NOT_LESS_OR_EQUAL', 'Driver hoặc phần mềm truy cập bộ nhớ sai mức ưu tiên; hay do driver lỗi hoặc RAM.', 'Gỡ/cập nhật driver mới cài, chạy Windows Memory Diagnostic.'],
    ['0x000000D1', 'DRIVER_IRQL_NOT_LESS_OR_EQUAL', 'Driver (thường card mạng, âm thanh, đồ hoạ) lỗi.', 'Xem tên file .sys trong màn hình xanh; cập nhật/roll back driver đó.'],
    ['0x00000050', 'PAGE_FAULT_IN_NONPAGED_AREA', 'Truy cập vùng nhớ không hợp lệ: RAM hỏng, driver, antivirus.', 'Memtest/Memory Diagnostic, gỡ phần mềm bảo mật bên thứ ba thử.'],
    ['0x0000001E', 'KMODE_EXCEPTION_NOT_HANDLED', 'Driver/kernel ném ngoại lệ không xử lý.', 'Xác định driver trong dump; cập nhật hoặc gỡ.'],
    ['0x0000003B', 'SYSTEM_SERVICE_EXCEPTION', 'Lỗi khi chuyển từ user mode sang kernel mode — thường driver (đồ hoạ).', 'Cập nhật driver đồ hoạ, chạy sfc /scannow.'],
    ['0x0000007E', 'SYSTEM_THREAD_EXCEPTION_NOT_HANDLED', 'Một thread hệ thống lỗi — hay gặp sau khi cập nhật driver.', 'Vào Safe Mode, roll back driver (tên file hiển thị trên màn hình).'],
    ['0x0000007B', 'INACCESSIBLE_BOOT_DEVICE', 'Windows không truy cập được ổ khởi động: sai chế độ SATA/AHCI, ổ lỗi, driver lưu trữ.', 'Kiểm tra BIOS (AHCI/RAID), cáp/ổ cứng, Startup Repair.'],
    ['0x000000ED', 'UNMOUNTABLE_BOOT_VOLUME', 'Volume hệ thống không mount được: hệ tệp hỏng.', 'Windows RE: chkdsk /r, bootrec; sao lưu dữ liệu.'],
    ['0x000000EF', 'CRITICAL_PROCESS_DIED', 'Một tiến trình hệ thống thiết yếu bị chết.', 'Safe Mode, sfc/DISM, gỡ cập nhật/driver gần đây.'],
    ['0x0000001A', 'MEMORY_MANAGEMENT', 'Lỗi quản lý bộ nhớ: RAM hỏng là nghi phạm hàng đầu.', 'Memory Diagnostic/MemTest86, thử từng thanh RAM.'],
    ['0x00000019', 'BAD_POOL_HEADER', 'Vùng nhớ pool bị hỏng, thường do driver.', 'Cập nhật driver, kiểm tra RAM.'],
    ['0x00000139', 'KERNEL_SECURITY_CHECK_FAILURE', 'Kernel phát hiện cấu trúc dữ liệu bị hỏng: driver, RAM hoặc ổ.', 'Cập nhật driver/BIOS, kiểm tra RAM và ổ đĩa.'],
    ['0x00000133', 'DPC_WATCHDOG_VIOLATION', 'Một DPC chạy quá lâu — driver (hay gặp với SSD firmware, card mạng).', 'Cập nhật firmware SSD & driver chipset/lưu trữ.'],
    ['0x00000116', 'VIDEO_TDR_FAILURE', 'Driver đồ hoạ không phản hồi.', 'Cài sạch driver GPU, kiểm tra nhiệt độ GPU.'],
    ['0x00000124', 'WHEA_UNCORRECTABLE_ERROR', 'Lỗi phần cứng (CPU, RAM, mainboard, quá nhiệt, ép xung).', 'Tắt ép xung, vệ sinh/kiểm tra nhiệt, thử phần cứng thay thế; báo L2 phần cứng.'],
    ['0x00000024', 'NTFS_FILE_SYSTEM', 'Lỗi hệ tệp NTFS hoặc ổ đĩa hỏng.', 'Sao lưu, chkdsk /f, kiểm tra SMART.'],
    ['0x00000101', 'CLOCK_WATCHDOG_TIMEOUT', 'Một core CPU không phản hồi.', 'Cập nhật BIOS, kiểm tra nhiệt/CPU, tắt ép xung.'],
    ['0x0000004E', 'PFN_LIST_CORRUPT', 'Danh sách khung trang bộ nhớ bị hỏng: driver hoặc RAM.', 'Memory Diagnostic, cập nhật driver.'],
    ['0xC000021A', 'STATUS_SYSTEM_PROCESS_TERMINATED', 'Tiến trình Winlogon/CSRSS chết lúc khởi động — file hệ thống hỏng.', 'Windows RE: sfc /scannow offline, System Restore, rồi mới tính tới cài lại.']
  ]);

  add('Mã lỗi Windows', [
    ['5 / 0x80070005', 'Access is denied', 'Không đủ quyền truy cập file/thư mục/khoá registry hoặc dịch vụ.', 'Kiểm tra NTFS/share permission và nhóm của user; chạy bằng quyền Admin; kiểm tra antivirus.'],
    ['2 / 0x80070002', 'File not found', 'Hệ thống không tìm thấy file chỉ định.', 'Kiểm tra đường dẫn, shortcut hỏng, file bị xoá bởi antivirus.'],
    ['3 / 0x80070003', 'Path not found', 'Đường dẫn không tồn tại.', 'Kiểm tra ổ/ thư mục mạng còn tồn tại, ổ map bị đứt.'],
    ['32 / 0x80070020', 'Sharing violation', 'File đang được tiến trình khác dùng.', 'Đóng ứng dụng đang mở file; Resource Monitor → Associated Handles.'],
    ['53 / 0x80070035', 'The network path was not found', 'Không tới được máy/đường dẫn mạng: DNS, mạng, firewall, SMB tắt.', 'ping IP & tên, Test-NetConnection -Port 445, kiểm tra share còn tồn tại.'],
    ['64', 'The specified network name is no longer available', 'Kết nối SMB bị ngắt giữa chừng.', 'Kiểm tra mạng chập chờn, file server, timeout; kết nối lại.'],
    ['67', 'The network name cannot be found', 'Tên share sai hoặc không tồn tại trên server.', 'Kiểm tra tên share bằng net view \\\\server.'],
    ['85', 'The local device name is already in use', 'Ký tự ổ đĩa (Z:) đã được dùng.', 'net use Z: /delete rồi map lại hoặc đổi ký tự.'],
    ['112 / 0x80070070', 'There is not enough space on the disk', 'Ổ đĩa đầy.', 'Dọn dung lượng (Temp, Downloads, Disk Cleanup) rồi thử lại.'],
    ['1219', 'Multiple connections to a server with different credentials', 'Đã có kết nối tới server đó bằng user khác.', 'net use * /delete rồi kết nối lại bằng một thông tin duy nhất.'],
    ['1326', 'The user name or password is incorrect', 'Sai thông tin xác thực (hoặc tài khoản không tồn tại trên server).', 'Kiểm tra user/mật khẩu, định dạng DOMAIN\\user, tài khoản có bị khoá.'],
    ['1311 / 1355', 'Không có domain controller phục vụ / domain không tìm thấy', 'Máy không liên lạc được DC.', 'Kiểm tra DNS trỏ đúng DC, mạng/VPN, ping DC.'],
    ['1907', 'Password must be changed before logging on', 'Mật khẩu bị đánh dấu bắt đổi ở lần đăng nhập tiếp theo.', 'Đổi mật khẩu tại màn hình đăng nhập (Ctrl+Alt+Del) hoặc theo quy trình self-service.'],
    ['1909', 'The referenced account is currently locked out', 'Tài khoản bị khoá do sai mật khẩu nhiều lần.', 'Unlock-ADAccount, tìm nguồn khoá (event 4740).'],
    ['0x80004005', 'Unspecified error', 'Lỗi chung chung: quyền, antivirus, file hỏng, mạng, đăng ký DLL…', 'Xem Event Viewer lấy thêm ngữ cảnh; thử bằng tài khoản/máy khác để khoanh vùng.'],
    ['0x80070057', 'The parameter is incorrect', 'Tham số không hợp lệ: thường gặp khi cập nhật, backup, định dạng ổ.', 'Chạy DISM /RestoreHealth, sfc /scannow; kiểm tra ổ đĩa.'],
    ['0x800F0922', 'Cập nhật/cài đặt tính năng thất bại', 'Thường do không đủ chỗ ở phân vùng System Reserved, hoặc kết nối tới update server thất bại (VPN).', 'Tắt VPN, giải phóng dung lượng, chạy Windows Update troubleshooter, DISM.'],
    ['0x80073712', 'Component store bị hỏng / thiếu file', 'Kho thành phần Windows (WinSxS) hỏng khi cập nhật.', 'DISM /Online /Cleanup-Image /RestoreHealth rồi sfc /scannow.'],
    ['0x800705B4', 'Hết thời gian chờ cập nhật', 'Thao tác Windows Update bị timeout.', 'Chạy troubleshooter, reset thành phần Windows Update (BITS, wuauserv), thử lại.'],
    ['0x80070422', 'Dịch vụ bị vô hiệu hoá', 'Dịch vụ cần thiết (Windows Update…) đang Disabled.', 'services.msc → đặt Startup type = Manual/Automatic và Start.'],
    ['0x80070643', 'Lỗi nghiêm trọng khi cài đặt', 'Thường gặp với cập nhật .NET/Defender hoặc bộ cài MSI hỏng.', 'Gỡ bản cũ, tải lại bộ cài, chạy Microsoft Program Install and Uninstall troubleshooter.'],
    ['0x80072EE7 / 0x80072EFD / 0x80072EE2', 'Không kết nối được máy chủ (WinHTTP)', 'EE7 = không phân giải tên; EFD = không thiết lập được kết nối; EE2 = hết thời gian.', 'Kiểm tra Internet/DNS/proxy/tường lửa, đồng hồ hệ thống (ngày giờ sai cũng gây lỗi).'],
    ['0x800704CF', 'Network location cannot be reached', 'Không tới được vị trí mạng.', 'Kiểm tra kết nối, DNS, VPN, thư mục chia sẻ.'],
    ['0xC000006A', 'STATUS_WRONG_PASSWORD', 'Tên đúng nhưng sai mật khẩu.', 'Hướng dẫn nhập lại; nếu quên → reset sau khi xác minh danh tính.'],
    ['0xC0000133', 'STATUS_TIME_DIFFERENCE_AT_DC', 'Giờ máy lệch quá nhiều so với domain controller.', 'Đồng bộ giờ: w32tm /resync, kiểm tra múi giờ/pin CMOS.'],
    ['0xC0000234', 'STATUS_ACCOUNT_LOCKED_OUT', 'Tài khoản bị khoá.', 'Unlock-ADAccount và xử lý nguồn khoá.']
  ]);

  add('Outlook & M365', [
    ['0x800CCC0D', 'Outlook: không tìm thấy máy chủ', 'Không phân giải được tên máy chủ mail (DNS/mạng).', 'Kiểm tra mạng, DNS, VPN; tạo lại profile nếu cấu hình sai.'],
    ['0x800CCC0E', 'Outlook: không kết nối được máy chủ', 'Máy chủ không phản hồi: mạng, firewall, sai cổng/SSL.', 'Kiểm tra mạng, thử webmail; xác nhận cổng 993/587/443 không bị chặn.'],
    ['0x800CCC0F', 'Outlook: kết nối bị ngắt', 'Kết nối tới server bị gián đoạn khi gửi/nhận.', 'Mạng chập chờn, antivirus quét email, file đính kèm quá lớn.'],
    ['0x80040115', 'Outlook: sự cố mạng khi kết nối Exchange', 'Không liên lạc được với Exchange.', 'Kiểm tra mạng/VPN, Autodiscover, trạng thái dịch vụ M365.'],
    ['0x8004010F', 'Outlook: không truy cập được file dữ liệu (OST/OAB)', 'File dữ liệu hỏng hoặc profile lỗi.', 'Tạo profile mới, đổi tên OST để Outlook tải lại, Repair Office.'],
    ['AADSTS50126', 'Sai tên người dùng hoặc mật khẩu', 'Đăng nhập Entra ID/M365 bị từ chối.', 'Xác nhận mật khẩu; nếu hash đồng bộ chưa kịp sau khi reset, chờ vài phút.'],
    ['AADSTS50076', 'Yêu cầu MFA theo chính sách', 'Chính sách bắt xác thực đa yếu tố.', 'Hướng dẫn đăng ký/dùng MFA; nếu mất điện thoại → quy trình reset MFA có xác minh.'],
    ['AADSTS50053', 'Tài khoản bị khoá (smart lockout)', 'Quá nhiều lần đăng nhập sai.', 'Chờ hết thời gian khoá hoặc reset; tìm nguồn đăng nhập sai (thiết bị cũ).'],
    ['AADSTS50034', 'Tài khoản không tồn tại trong tenant', 'Sai địa chỉ UPN hoặc tài khoản chưa được tạo/đồng bộ.', 'Kiểm tra UPN, trạng thái đồng bộ, license.'],
    ['AADSTS53003', 'Bị chặn bởi Conditional Access', 'Chính sách truy cập có điều kiện (thiết bị, vị trí, ứng dụng) từ chối.', 'Xem Sign-in logs để biết chính sách nào; thiết bị cần compliant/join; báo Identity team.'],
    ['AADSTS50105', 'User chưa được gán vào ứng dụng', 'Ứng dụng yêu cầu gán người dùng/nhóm.', 'Gán user/nhóm trong Enterprise application (cần phê duyệt).']
  ]);

  add('HTTP', [
    ['200', 'OK', 'Thành công.', ''], ['301 / 302', 'Chuyển hướng vĩnh viễn / tạm thời', 'Trang đã chuyển sang địa chỉ khác.', 'Vòng lặp chuyển hướng → xoá cookie/cache hoặc báo dev.'],
    ['400', 'Bad Request', 'Yêu cầu sai cú pháp; cookie quá lớn/hỏng.', 'Xoá cookie của trang, thử trình duyệt ẩn danh.'],
    ['401', 'Unauthorized', 'Cần đăng nhập hoặc thông tin xác thực sai.', 'Đăng nhập lại; kiểm tra mật khẩu/token hết hạn.'],
    ['403', 'Forbidden', 'Đã xác thực nhưng không có quyền, hoặc server chặn.', 'Kiểm tra nhóm quyền, ACL, quyền file trên server.'],
    ['404', 'Not Found', 'Không có tài nguyên tại URL này.', 'Kiểm tra URL, trang đã bị xoá/đổi.'],
    ['408', 'Request Timeout', 'Server chờ yêu cầu quá lâu.', 'Kiểm tra mạng, thử lại.'],
    ['429', 'Too Many Requests', 'Gửi quá nhiều yêu cầu (rate limit).', 'Chờ rồi thử lại, kiểm tra script/app gọi lặp.'],
    ['500', 'Internal Server Error', 'Lỗi phía server/ứng dụng.', 'Không phải lỗi máy user: báo L2/dev kèm thời điểm và URL.'],
    ['502', 'Bad Gateway', 'Proxy/gateway nhận phản hồi không hợp lệ từ server phía sau.', 'Dịch vụ phía sau (app server) có thể đã sập — báo L2.'],
    ['503', 'Service Unavailable', 'Server quá tải hoặc đang bảo trì.', 'Kiểm tra trạng thái dịch vụ, thông báo bảo trì; báo L2.'],
    ['504', 'Gateway Timeout', 'Proxy chờ server phía sau quá lâu.', 'Server chậm/sập hoặc mạng giữa các tầng bị nghẽn — báo L2.']
  ]);

  add('Email (NDR)', [
    ['550 5.1.1', 'Recipient not found', 'Địa chỉ người nhận không tồn tại (gõ sai, tài khoản đã xoá).', 'Kiểm tra chính tả; xoá gợi ý tự điền cũ (nickname cache) của Outlook.'],
    ['550 5.7.1', 'Từ chối: không có quyền gửi / relay bị chặn', 'Người gửi không được phép gửi tới nhóm/người nhận đó, hoặc chính sách chặn.', 'Kiểm tra cài đặt nhóm (cho phép người ngoài?), chính sách mail flow.'],
    ['552 5.2.2', 'Mailbox full', 'Hộp thư người nhận đầy.', 'Báo người gửi liên hệ người nhận; với hộp thư của mình: dọn/archive.'],
    ['554 5.7.x', 'Bị chặn do spam/IP trong blacklist', 'Máy chủ nhận từ chối vì danh tiếng.', 'Kiểm tra IP trên blacklist, SPF/DKIM/DMARC; báo Mail admin.'],
    ['550 5.4.1', 'Recipient address rejected: Access denied', 'Exchange Online không tìm thấy người nhận trong thư mục.', 'Xác nhận địa chỉ tồn tại; báo admin nếu domain/tài khoản vừa tạo.'],
    ['5.7.509', 'DMARC không đạt', 'Domain gửi không vượt qua kiểm tra DMARC.', 'Sửa bản ghi SPF/DKIM/DMARC của domain gửi.'],
    ['4.4.7', 'Message expired', 'Thư nằm trong hàng đợi quá lâu mà không giao được.', 'Kiểm tra máy chủ nhận có đang lỗi/ DNS của domain đích.'],
    ['5.2.3 / 5.3.4', 'Thư quá lớn', 'Vượt giới hạn kích thước gửi/nhận.', 'Dùng liên kết OneDrive/SharePoint thay vì đính kèm trực tiếp.']
  ]);

  add('Cổng', [
    ['161', 'SNMP', 'UDP · giám sát thiết bị mạng (switch, router, máy in).', ''], ['69', 'TFTP', 'UDP · cập nhật firmware/cấu hình thiết bị, không mã hoá.', ''],
    ['514', 'Syslog', 'UDP · gửi log từ thiết bị về server log.', ''], ['636', 'LDAPS', 'TCP · LDAP mã hoá (xác thực ứng dụng với AD).', ''],
    ['3268', 'Global Catalog', 'TCP · tìm kiếm trên toàn forest AD.', ''], ['5900', 'VNC', 'TCP · điều khiển máy từ xa, nên đi qua VPN.', ''],
    ['8080', 'HTTP thay thế / proxy', 'TCP · web proxy hoặc ứng dụng web nội bộ.', '']
  ]);

  /* ---------- Cây chẩn đoán ---------- */
  var F = window.TREF.flows;
  function Q(q, o) { return { q: q, o: o }; }
  function X(kind, t, d) { return { e: kind, t: t, d: d }; }
  var fix = 'fix', esc = 'esc', info = 'info';

  F.push({
    id: 'nopower', icon: '🔌', title: 'Máy không lên nguồn', start: 'a',
    n: {
      a: Q('Thiết bị là laptop hay PC để bàn?', [['Laptop', 'l1'], ['PC để bàn', 'd1']]),
      l1: Q('Đã cắm adapter chưa? Đèn sạc/đèn báo trên laptop có sáng không?', [['Đèn sạc sáng', 'l2'], ['Không sáng hoặc chưa cắm', 'l1b']]),
      l1b: Q('Thử ổ điện khác và adapter khác (nếu có). Máy lên chưa?', [['Đã lên', 'adapter'], ['Vẫn không', 'l2']]),
      l2: Q('Giữ nút nguồn 15–30 giây để xả điện dư; rút adapter (và pin nếu tháo được), cắm lại rồi bật. Máy lên chưa?', [['Đã lên', 'flush'], ['Vẫn không', 'l3']]),
      l3: Q('Khi bấm nguồn có nghe quạt/ổ cứng hoặc thấy đèn trạng thái nháy không?', [['Có phản ứng nhưng không có hình', 'nodisp'], ['Hoàn toàn không phản ứng', 'hw']]),
      d1: Q('Dây nguồn cắm chắc chưa? Ổ cắm có điện (thử cắm thiết bị khác, kiểm tra aptomat)?', [['Ổ cắm không có điện', 'outlet'], ['Có điện', 'd2']]),
      d2: Q('Công tắc phía sau bộ nguồn (PSU) đang ON? Đèn standby trên mainboard có sáng?', [['Công tắc đang OFF', 'psusw'], ['ON nhưng không sáng', 'd3']]),
      d3: Q('Thử dây nguồn khác và kiểm tra dây nút Power ở case. Máy lên chưa?', [['Đã lên', 'cable'], ['Vẫn không', 'psuhw']]),
      adapter: X(fix, 'Do adapter/ổ điện', 'Thay adapter hoặc ổ cắm, kiểm tra chân sạc. Nếu adapter nóng bất thường hoặc đầu cắm lỏng thì thay mới (đúng công suất W và đầu cắm).'),
      flush: X(fix, 'Đã xả điện dư / reset phần cứng', 'Thủ thuật “hard reset” khắc phục lỗi nguồn tạm thời. Ghi chú vào ticket; nếu tái diễn nhiều lần, kiểm tra pin/mainboard.'),
      nodisp: X(info, 'Máy có nguồn nhưng không có hình', 'Chuyển sang cây chẩn đoán <b>“Có nguồn nhưng không có hình”</b> (kiểm tra màn hình, RAM, đồ hoạ).'),
      hw: X(esc, 'Nghi hỏng phần cứng nguồn / mainboard / pin', 'Báo L2 phần cứng. Thông tin cần ghi: model, serial, các bước đã thử (xả điện, đổi adapter), tình trạng bảo hành. Tư vấn user dùng máy dự phòng nếu có.'),
      outlet: X(fix, 'Ổ cắm hoặc aptomat không có điện', 'Chuyển sang ổ cắm khác; nếu cả khu vực mất điện báo Tổng vụ/Facility. Không tự sửa điện.'),
      psusw: X(fix, 'Công tắc PSU đang tắt', 'Bật công tắc sau PSU. Ghi chú: nhắc nhẹ user không tắt công tắc này.'),
      cable: X(fix, 'Do dây nguồn / dây nút Power', 'Thay dây nguồn hỏng; kiểm tra lại đầu cắm nút Power trên mainboard.'),
      psuhw: X(esc, 'Nghi hỏng bộ nguồn (PSU) hoặc mainboard', 'Báo L2 phần cứng. Nếu có PSU/dây dự phòng, thử thay để loại trừ.')
    }
  });

  F.push({
    id: 'nodisplay', icon: '🖥️', title: 'Có nguồn nhưng không có hình', start: 'a',
    n: {
      a: Q('Máy có phản ứng khi bật (quạt quay, đèn nguồn, ổ cứng nháy)?', [['Có', 'b'], ['Không phản ứng gì', 'nopower']]),
      b: Q('Màn hình đang ở trạng thái nào?', [['Không sáng đèn nào', 'c'], ['Hiện “No signal”', 'd'], ['Có hình nhưng mờ/sọc/nhấp nháy', 'e']]),
      c: Q('Kiểm tra dây nguồn màn hình, nút nguồn màn hình; thử ổ cắm khác. Màn hình sáng chưa?', [['Đã sáng', 'cable'], ['Vẫn không', 'monitor']]),
      d: Q('Cắm chắc dây HDMI/DisplayPort, chọn đúng Input Source; thử dây/cổng khác. Có hình chưa?', [['Có hình', 'cable'], ['Chưa', 'd2']]),
      d2: Q('PC có card đồ hoạ rời? Hãy cắm dây vào card rời (không cắm vào cổng mainboard). Tháo/cắm lại RAM và card. Có hình chưa?', [['Có hình', 'reseat'], ['Chưa', 'd3']]),
      d3: Q('Khi bật máy có nghe tiếng bíp (beep code)?', [['Có tiếng bíp', 'beep'], ['Không có', 'hw']]),
      e: Q('Thử màn hình khác (hoặc màn hình này với máy khác) bằng cùng dây. Lỗi đi theo màn hình hay theo máy?', [['Theo màn hình', 'monitor'], ['Theo máy', 'e2']]),
      e2: Q('Khởi động Safe Mode, gỡ và cài sạch driver card đồ hoạ; thử độ phân giải/tần số quét thấp hơn. Hết lỗi?', [['Hết lỗi', 'driver'], ['Vẫn lỗi', 'gpu']]),
      nopower: X(info, 'Chuyển sang “Máy không lên nguồn”', 'Máy không phản ứng là lỗi nguồn, hãy dùng cây chẩn đoán <b>“Máy không lên nguồn”</b>.'),
      cable: X(fix, 'Do dây / nguồn màn hình / chọn sai nguồn vào', 'Thay dây hoặc chọn đúng input; ghi lại loại dây và cổng đã dùng.'),
      reseat: X(fix, 'Do tiếp xúc kém RAM / card đồ hoạ', 'Đã cắm lại linh kiện. Vệ sinh chân tiếp xúc nhẹ nhàng (chống tĩnh điện). Nếu tái diễn, thay RAM/card.'),
      beep: X(esc, 'Beep code — tra mã theo hãng BIOS', 'Thường: 1 dài + vài ngắn = lỗi RAM/GPU. Ghi hãng BIOS (AMI/Award/Dell…) và mẫu tiếng bíp rồi báo L2; thử từng thanh RAM trước nếu được phép.'),
      hw: X(esc, 'Nghi mainboard / CPU / nguồn', 'Báo L2 phần cứng kèm các bước đã làm và dùng máy dự phòng cho user.'),
      monitor: X(fix, 'Hỏng màn hình hoặc cáp nội bộ', 'Thay màn hình/dây. Cấp màn hình mượn trong lúc chờ.'),
      driver: X(fix, 'Do driver đồ hoạ', 'Cài sạch driver chính thức từ hãng/Windows Update. Ghi lại phiên bản driver ổn định.'),
      gpu: X(esc, 'Nghi hỏng card đồ hoạ / màn hình laptop', 'Báo L2 phần cứng (bảo hành/sửa chữa).')
    }
  });

  F.push({
    id: 'slow', icon: '🐢', title: 'Máy chạy chậm', start: 'a',
    n: {
      a: Q('Máy chậm như thế nào?', [['Đột ngột hôm nay / sau cập nhật', 'b'], ['Chậm dần trong nhiều tuần', 'c'], ['Chỉ chậm với 1 ứng dụng / 1 website', 'app']]),
      b: Q('Mở Task Manager (Ctrl+Shift+Esc). Cái gì đang chiếm CPU / RAM / Disk 90–100%?', [['Tiến trình lạ / tên giống svchost nhưng chạy từ AppData', 'sec'], ['Windows Update / Defender đang quét', 'wait'], ['Disk 100% trên ổ HDD', 'd'], ['Không có gì bất thường', 'c']]),
      c: Q('Ổ C: còn bao nhiêu % trống?', [['Dưới 10%', 'cleanup'], ['Còn nhiều', 'c2']]),
      c2: Q('Máy dùng ổ HDD hay SSD? RAM bao nhiêu?', [['HDD hoặc RAM ≤ 4 GB', 'upgrade'], ['SSD và RAM đủ (≥ 8 GB)', 'c3']]),
      c3: Q('Task Manager → Startup: có nhiều ứng dụng khởi động cùng Windows không?', [['Nhiều', 'startup'], ['Ít', 'sfc']]),
      d: Q('Kiểm tra SMART của ổ (CrystalDiskInfo). Tình trạng?', [['Caution / Bad', 'disk'], ['Good', 'ssd']]),
      app: Q('Ứng dụng/website đó chậm trên máy khác không?', [['Máy khác cũng chậm', 'server'], ['Chỉ máy này', 'apprepair']]),
      sec: X(esc, 'Nghi mã độc — cô lập và báo Security', 'Không tự xoá. Ngắt mạng máy, giữ nguyên hiện trạng, ghi lại tên tiến trình/đường dẫn/kết nối (netstat -ano), chuyển Security. (Thử bài “Máy chậm, quạt kêu” trong Terminal giả lập.)'),
      wait: X(info, 'Chờ tác vụ nền hoàn tất', 'Giải thích cho user: Windows Update/Defender có thể chiếm tài nguyên 15–60 phút. Đặt giờ hoạt động (Active hours), hẹn kiểm tra lại. Nếu kéo dài > 2 giờ → kiểm tra Windows Update bị kẹt.'),
      cleanup: X(fix, 'Ổ đĩa gần đầy — dọn dung lượng', 'Disk Cleanup/Storage Sense, xoá Temp, Downloads cũ (hỏi user), gỡ phần mềm không dùng. Mục tiêu còn trống ≥ 15–20%.'),
      upgrade: X(fix, 'Cấu hình yếu — nâng cấp SSD/RAM', 'Đề xuất nâng cấp (SSD, lên 8–16 GB RAM) kèm lý do và chi phí; trong lúc chờ tắt ứng dụng nền, giảm startup.'),
      startup: X(fix, 'Quá nhiều ứng dụng khởi động cùng Windows', 'Tắt bớt trong Task Manager → Startup (giữ antivirus, driver quan trọng). Ghi rõ danh sách đã tắt.'),
      sfc: X(info, 'Kiểm tra toàn vẹn Windows', 'Chạy <code>sfc /scannow</code> và <code>DISM /Online /Cleanup-Image /RestoreHealth</code>, kiểm tra driver, nhiệt độ; nếu vẫn chậm cân nhắc Reset this PC sau khi sao lưu dữ liệu.'),
      disk: X(esc, 'Ổ cứng sắp hỏng — sao lưu ngay', 'Sao lưu dữ liệu khẩn cấp, báo L2 phần cứng thay ổ. Không chạy chkdsk /r trên ổ đang hỏng nặng trước khi sao lưu.'),
      ssd: X(fix, 'HDD chậm — dọn dịch vụ nền, nên chuyển SSD', 'Tạm thời tắt SysMain/Search Indexing nếu cần; đề xuất thay SSD (hiệu quả cao nhất).'),
      server: X(esc, 'Lỗi phía server / mạng', 'Không phải do máy user: thu thập thời điểm, URL/ứng dụng, số người bị ảnh hưởng, báo L2 hoặc Network.'),
      apprepair: X(fix, 'Lỗi cục bộ của ứng dụng', 'Xoá cache/profile, Repair/cài lại ứng dụng, thử trình duyệt khác, tắt tiện ích mở rộng.')
    }
  });

  F.push({
    id: 'nonet', icon: '🌐', title: 'Không có mạng / Internet', start: 'a',
    n: {
      a: Q('Máy có đang kết nối vật lý không (cáp cắm, đèn link, hoặc Wi-Fi bật)?', [['Không (cáp rút / Wi-Fi tắt / máy bay)', 'phys'], ['Có', 'b']]),
      b: Q('ipconfig: địa chỉ IPv4 của máy là gì?', [['169.254.x.x', 'c'], ['Không có IP / Media disconnected', 'c'], ['IP hợp lệ (vd 192.168.x.x)', 'd']]),
      c: Q('ipconfig /release rồi ipconfig /renew. Máy nhận được IP chưa?', [['Chưa', 'dhcp'], ['Đã nhận IP', 'd']]),
      d: Q('Ping default gateway được không?', [['Không', 'gw'], ['Được', 'e']]),
      e: Q('ping 8.8.8.8 (IP Internet) được không?', [['Không', 'wan'], ['Được', 'f']]),
      f: Q('ping google.com (tên) được không?', [['Không', 'dns'], ['Được', 'g']]),
      g: Q('Vẫn không vào được một ứng dụng / website cụ thể?', [['Có', 'app'], ['Không, đã vào được', 'ok']]),
      phys: X(fix, 'Lỗi lớp vật lý', 'Cắm lại cáp, bật Wi-Fi, tắt chế độ máy bay, kiểm tra công tắc Wi-Fi/phím Fn. Thử cáp/cổng khác.'),
      dhcp: X(esc, 'Không xin được IP từ DHCP', 'Đổi cổng/cáp, thử Wi-Fi. Nếu nhiều người cùng bị → báo Network/Sysadmin kiểm tra DHCP. Xem bài “Cắm dây nhưng mất mạng” trong Terminal giả lập.'),
      gw: X(esc, 'Không tới được gateway', 'Kiểm tra cáp/cổng/VLAN; hỏi người xung quanh. Nhiều người cùng bị → Network (P2). Chỉ một máy → thử cổng khác, kiểm tra IP tĩnh sai dải.'),
      wan: X(esc, 'Lỗi đường ra Internet', 'LAN ổn nhưng ra Internet lỗi → báo Network/ISP, đính kèm kết quả ping/tracert.'),
      dns: X(fix, 'Lỗi phân giải DNS', 'Kiểm tra DNS được cấp (ipconfig /all), ipconfig /flushdns, nslookup tới DNS khác; sửa DNS hoặc báo Sysadmin nếu DNS server lỗi.'),
      app: X(info, 'Mạng tốt, lỗi riêng ứng dụng', 'Kiểm tra proxy/VPN, tường lửa, chứng chỉ (giờ hệ thống!), thử trình duyệt khác hoặc mạng khác. Nếu chỉ một dịch vụ → báo chủ hệ thống.'),
      ok: X(fix, 'Đã khôi phục', 'Ghi lại nguyên nhân & cách xử lý vào ticket, xác nhận lại với user rồi đóng.')
    }
  });

  F.push({
    id: 'printer', icon: '🖨️', title: 'Máy in không in được', start: 'a',
    n: {
      a: Q('Máy in có báo lỗi (hết giấy / mực / kẹt giấy / nắp mở) hay đèn cảnh báo?', [['Có', 'consumable'], ['Không, trạng thái sẵn sàng', 'b']]),
      b: Q('In trang test trực tiếp từ màn hình máy in. In được không?', [['Không', 'hw'], ['Được', 'c']]),
      c: Q('Máy in mạng: ping được IP/tên máy in?', [['Không', 'net'], ['Được', 'd']]),
      d: Q('Người khác in được không?', [['Không ai in được', 'server'], ['Chỉ một máy bị', 'e']]),
      e: Q('Hàng đợi in của máy này có lệnh kẹt (Error / Deleting)?', [['Có', 'spooler'], ['Không', 'f']]),
      f: Q('Máy in mặc định đúng chưa? Xoá máy in và cài lại đúng driver. Hết lỗi?', [['Hết lỗi', 'ok'], ['Vẫn lỗi', 'driver']]),
      consumable: X(fix, 'Hết vật tư / kẹt giấy', 'Thay giấy, mực/toner hoặc gỡ giấy kẹt theo hướng dẫn trên màn hình máy in. Ghi nhận số lần để đặt vật tư.'),
      hw: X(esc, 'Lỗi phần cứng máy in', 'Báo L2 / nhà cung cấp bảo hành; hướng dẫn user dùng máy in dự phòng.'),
      net: X(fix, 'Máy in mất kết nối mạng', 'Kiểm tra cáp/Wi-Fi của máy in và IP (đặt IP tĩnh hoặc DHCP reservation để không đổi). In trang cấu hình mạng để đối chiếu.'),
      server: X(esc, 'Sự cố print server hoặc máy in', 'Nhiều người cùng bị → kiểm tra dịch vụ Print Spooler trên print server, báo Sysadmin (L2).'),
      spooler: X(fix, 'Hàng đợi in cục bộ kẹt', 'net stop spooler → xoá file trong C:\\Windows\\System32\\spool\\PRINTERS → net start spooler. (Luyện ở Terminal giả lập: “Lệnh in treo”.)'),
      driver: X(esc, 'Driver / cấu hình máy in', 'Thử driver chung (PCL6/Universal) hoặc driver mới nhất; báo L2 nếu cần triển khai driver tập trung bằng GPO.'),
      ok: X(fix, 'Đã in được', 'Ghi cách xử lý (cài lại máy in/driver) vào ticket.')
    }
  });

  F.push({
    id: 'outlook', icon: '📧', title: 'Outlook không gửi/nhận mail', start: 'a',
    n: {
      a: Q('Outlook báo gì ở thanh trạng thái / màn hình?', [['Disconnected / Trying to connect', 'b'], ['Need Password / yêu cầu đăng nhập liên tục', 'c'], ['Gửi được nhưng không nhận (hoặc ngược lại)', 'd'], ['Treo / Not Responding', 'e']]),
      b: Q('Vào Outlook trên web (outlook.office.com) được không?', [['Không', 'svc'], ['Được', 'b2']]),
      b2: Q('Kiểm tra Send/Receive → Work Offline đang tắt, mạng ổn. Hết Disconnected?', [['Hết', 'ok'], ['Vẫn lỗi', 'profile']]),
      c: Q('Mật khẩu có vừa đổi gần đây, hoặc tài khoản có thể bị khoá?', [['Vừa đổi mật khẩu', 'cred'], ['Không / không rõ', 'c2']]),
      c2: Q('Đăng nhập office.com bằng tài khoản đó được không?', [['Không (lỗi AADSTS / MFA)', 'aad'], ['Được', 'cred']]),
      d: Q('Thử gửi/nhận bằng webmail. Kết quả?', [['Webmail cũng lỗi', 'mailbox'], ['Webmail bình thường', 'ost']]),
      e: Q('Mở Outlook ở chế độ an toàn (Win+R → outlook.exe /safe). Chạy ổn?', [['Ổn', 'addin'], ['Vẫn treo', 'pst']]),
      svc: X(esc, 'Kiểm tra tài khoản / dịch vụ M365', 'Xem trạng thái dịch vụ M365 (Service health), tài khoản có bị khoá/license; nếu nhiều người cùng lỗi → báo Admin M365.'),
      profile: X(fix, 'Hồ sơ Outlook (profile) bị lỗi', 'Control Panel → Mail → tạo profile mới, Repair Office, xoá thông tin cũ trong Credential Manager. Thời gian đồng bộ lại hộp thư có thể lâu — báo trước cho user.'),
      cred: X(fix, 'Thông tin đăng nhập cũ bị lưu', 'Xoá mục Office/Outlook/MicrosoftOffice16 trong Credential Manager, đăng nhập lại với mật khẩu mới.'),
      aad: X(info, 'Tra mã lỗi đăng nhập', 'Ghi nguyên văn mã (vd AADSTS50126, 50076, 50053, 53003) và tra trong công cụ <a href="#/tools/lookup">Tra mã lỗi</a>; tuỳ mã: reset mật khẩu, MFA, Conditional Access.'),
      mailbox: X(esc, 'Hộp thư / luật / giới hạn', 'Kiểm tra dung lượng hộp thư, luật chuyển tiếp, message trace trong Exchange admin; báo Admin M365 nếu cần.'),
      ost: X(fix, 'Tệp OST cục bộ bị lỗi', 'Đóng Outlook, đổi tên file OST rồi mở lại để đồng bộ lại; hoặc tạo profile mới.'),
      addin: X(fix, 'Add-in gây treo', 'Tắt dần add-in (File → Options → Add-ins → COM Add-ins) để tìm thủ phạm; cập nhật hoặc gỡ add-in đó.'),
      pst: X(fix, 'File dữ liệu lớn / hỏng hoặc Office lỗi', 'Chạy scanpst.exe, Repair Office (Online repair), giảm kích thước PST/OST, kiểm tra ổ đĩa còn trống.'),
      ok: X(fix, 'Đã kết nối lại', 'Ghi cách xử lý và xác nhận gửi/nhận thử với user.')
    }
  });

  F.push({
    id: 'login', icon: '🔐', title: 'Không đăng nhập được Windows / domain', start: 'a',
    n: {
      a: Q('Thông báo lỗi chính xác là gì?', [['Sai tên người dùng / mật khẩu', 'b'], ['Tài khoản đã bị khoá', 'c'], ['“Trust relationship failed” / không liên lạc được domain', 'd'], ['Tài khoản bị vô hiệu hoá / hết hạn', 'e'], ['Đăng nhập xong nhưng treo hoặc profile lỗi', 'f']]),
      b: Q('Đã kiểm tra Caps Lock, bàn phím (Telex/ngôn ngữ), mật khẩu vừa đổi? User nhớ mật khẩu?', [['Quên mật khẩu', 'reset'], ['Nhập đúng nhưng vẫn lỗi', 'b2']]),
      b2: Q('User đăng nhập được trên máy khác không?', [['Máy khác được', 'cached'], ['Máy khác cũng lỗi', 'account']]),
      c: Q('Sau khi mở khoá, tài khoản có bị khoá lại?', [['Không', 'unlock'], ['Có, bị khoá lại', 'source']]),
      d: Q('Máy có mạng/VPN, ping được domain controller? Giờ hệ thống đúng?', [['Mất mạng / không ping được DC', 'net'], ['Giờ lệch', 'time'], ['Mạng và giờ đều tốt', 'trust']]),
      e: Q('Xác nhận với HR/quản lý: nhân viên còn làm việc và được kích hoạt tài khoản?', [['Còn làm việc', 'enable'], ['Đã nghỉ việc', 'offboard']]),
      f: Q('Thử đăng nhập tài khoản khác trên cùng máy. Kết quả?', [['Tài khoản khác bình thường (profile user lỗi)', 'profile'], ['Tài khoản nào cũng lỗi', 'os']]),
      reset: X(fix, 'Đặt lại mật khẩu (sau khi xác minh)', '1) Xác minh danh tính (callback số đã đăng ký / người quản lý / câu hỏi bảo mật theo quy định). 2) Reset, đặt mật khẩu tạm đạt chính sách, bắt đổi ở lần đăng nhập đầu. 3) Gửi mật khẩu tạm qua kênh an toàn. 4) Ghi ticket (ai, khi nào). Không đọc mật khẩu qua chat công khai.'),
      cached: X(info, 'Máy mất kết nối DC hoặc cache lỗi', 'Kiểm tra mạng/VPN và DNS của máy đó; đăng nhập lại khi có mạng. Nếu mật khẩu mới đổi, máy dùng cache cũ — kết nối mạng công ty rồi đăng nhập một lần.'),
      account: X(fix, 'Kiểm tra tài khoản trong AD', 'Xem tài khoản có bị khoá/disable/hết hạn mật khẩu/Account expires; mở khoá hoặc reset theo trường hợp.'),
      unlock: X(fix, 'Mở khoá tài khoản', 'Unlock-ADAccount (hoặc ADUC → Unlock). Nhắc user cập nhật mật khẩu trên các thiết bị khác. Ghi ticket.'),
      source: X(esc, 'Khoá lặp lại — tìm nguồn', 'Kiểm tra event 4740 để biết Caller Computer Name (điện thoại, ổ mạng, dịch vụ). Xử lý nguồn rồi mới mở khoá. (Luyện ở Terminal: “Tài khoản bị khoá hoài”.)'),
      net: X(fix, 'Khôi phục kết nối tới domain', 'Kiểm tra cáp/Wi-Fi/VPN, DNS của máy trỏ đúng DC; ping dc01; thử lại.'),
      time: X(fix, 'Đồng bộ lại giờ', 'Đặt đúng múi giờ, w32tm /resync. Giờ lệch > 5 phút làm Kerberos từ chối. Nếu giờ hay sai: pin CMOS yếu.'),
      trust: X(fix, 'Sửa quan hệ tin cậy (secure channel)', 'Đăng nhập bằng local admin: <code>Test-ComputerSecureChannel -Repair -Credential …</code>; không được thì rejoin domain. (Terminal: “trust relationship”.)'),
      enable: X(fix, 'Bật lại tài khoản', 'Enable account theo yêu cầu có phê duyệt; reset mật khẩu nếu cần; ghi ticket.'),
      offboard: X(esc, 'Không bật lại — chuyển quản lý/Security', 'Tài khoản nghỉ việc bị vô hiệu hoá theo chính sách. Không tự bật lại; báo quản lý/HR/Security nếu có yêu cầu bất thường.'),
      profile: X(fix, 'Profile người dùng bị hỏng', 'Sao lưu dữ liệu, tạo lại profile (đổi tên thư mục C:\\Users\\<user> và đăng nhập lại), copy dữ liệu về.'),
      os: X(esc, 'Lỗi hệ điều hành', 'Safe Mode, Startup Repair, System Restore; nếu không được → báo L2 để cài lại sau khi sao lưu.')
    }
  });

  F.push({
    id: 'bsod', icon: '💥', title: 'Màn hình xanh (BSOD) / tự khởi động lại', start: 'a',
    n: {
      a: Q('Có ghi lại được mã dừng (stop code) trên màn hình xanh không?', [['Có mã', 'b'], ['Không kịp đọc', 'a2']]),
      a2: X(info, 'Lấy mã lỗi', 'Tắt “Automatically restart” (Advanced system settings → Startup and Recovery), hoặc xem Reliability Monitor / Event Viewer (Event 41, 1001) / file C:\\Windows\\Minidump rồi quay lại cây này.'),
      b: Q('Lỗi xảy ra khi nào? (tra mã trong công cụ “Tra mã lỗi” để biết nghi phạm)', [['Sau khi cài driver / cập nhật', 'c'], ['Ngẫu nhiên', 'd'], ['Lặp lại ngay lúc khởi động, không vào được Windows', 'e']]),
      c: Q('Vào Safe Mode, gỡ cập nhật / roll back driver mới nhất. Hết lỗi?', [['Hết lỗi', 'rollback'], ['Vẫn lỗi', 'd']]),
      d: Q('Chạy Windows Memory Diagnostic và kiểm tra SMART ổ đĩa, nhiệt độ. Có lỗi?', [['Có lỗi RAM / ổ', 'hw'], ['Không có lỗi', 'd2']]),
      d2: Q('Chạy sfc /scannow + DISM /RestoreHealth, cập nhật BIOS và driver chính hãng. Hết lỗi?', [['Hết lỗi', 'okfix'], ['Vẫn lỗi', 'reinstall']]),
      e: Q('Vào Windows RE (bật/tắt nguồn 3 lần liên tiếp): Startup Repair / Safe Mode / System Restore. Vào được?', [['Vào được Windows', 'c'], ['Không vào được', 'disk']]),
      rollback: X(fix, 'Do driver/bản cập nhật mới', 'Giữ nguyên bản ổn định, tạm hoãn cập nhật lỗi (Pause updates), ghi lại phiên bản driver/KB gây lỗi để báo cho nhóm quản trị.'),
      hw: X(esc, 'Phần cứng lỗi — RAM / ổ đĩa', 'Sao lưu dữ liệu rồi báo L2 phần cứng thay RAM/ổ. Ghi kết quả chẩn đoán.'),
      okfix: X(fix, 'Đã khắc phục bằng sửa hệ thống/driver', 'Ghi lại các bước đã làm; theo dõi 3–5 ngày.'),
      reinstall: X(esc, 'Cần phân tích dump hoặc cài lại', 'Thu thập minidump, báo L2; sao lưu dữ liệu rồi lên kế hoạch cài lại Windows.'),
      disk: X(esc, 'Không khởi động được — nghi ổ đĩa / hệ thống tệp', 'Dùng USB boot để sao lưu dữ liệu, kiểm tra ổ; thay ổ và cài lại nếu cần. Báo L2.')
    }
  });

  F.push({
    id: 'wifi', icon: '📶', title: 'Wi-Fi chập chờn / chậm', start: 'a',
    n: {
      a: Q('Có nhiều người cùng khu vực bị chập chờn, hay chỉ một thiết bị?', [['Nhiều người cùng bị', 'ap'], ['Chỉ một thiết bị', 'b']]),
      b: Q('Cùng máy này ở chỗ khác có ổn không? Thiết bị khác cùng chỗ có ổn không?', [['Chỗ khác ổn', 'c'], ['Chỗ nào cũng lỗi', 'd']]),
      c: Q('Vị trí có xa AP / nhiều vật cản? Đang dùng băng tần nào?', [['Xa AP / 2.4 GHz nhiễu', 'signal'], ['Gần AP, vẫn chập chờn', 'ap']]),
      d: Q('Cập nhật driver Wi-Fi, tắt “Allow the computer to turn off this device to save power”, Forget network rồi kết nối lại. Hết lỗi?', [['Hết lỗi', 'ok'], ['Vẫn lỗi', 'hw']]),
      ap: X(esc, 'Nghi AP quá tải / nhiễu / lỗi cấu hình', 'Báo Network (L2): tên AP, số người, giờ bắt đầu, vị trí. Kiểm tra kênh, số client trên AP, roaming.'),
      signal: X(fix, 'Tín hiệu yếu', 'Chuyển sang 5 GHz, lại gần AP; đề xuất bổ sung AP nếu khu vực luôn yếu.'),
      ok: X(fix, 'Do driver / tiết kiệm điện', 'Ghi phiên bản driver; theo dõi thêm.'),
      hw: X(esc, 'Nghi card Wi-Fi hỏng', 'Thử USB Wi-Fi tạm thời; báo L2 phần cứng thay card.')
    }
  });

  F.push({
    id: 'meeting', icon: '🎧', title: 'Teams: không nghe / không có mic / camera', start: 'a',
    n: {
      a: Q('Vấn đề là gì?', [['Không nghe thấy người khác', 'b'], ['Người khác không nghe thấy mình', 'c'], ['Camera không lên', 'd']]),
      b: Q('Teams → Settings → Devices: loa đã chọn đúng thiết bị? Âm lượng Windows / tai nghe không bị tắt?', [['Chọn sai thiết bị / bị tắt tiếng', 'dev'], ['Đúng nhưng vẫn không nghe', 'b2']]),
      b2: Q('Phát thử âm thanh trong Windows (Sound → Test). Có tiếng không?', [['Có tiếng Windows nhưng Teams không', 'teams'], ['Không có tiếng ở đâu cả', 'drv']]),
      c: Q('Mic có bị mute (nút trên tai nghe / phím tắt)? Windows → Privacy → Microphone cho phép ứng dụng?', [['Bị mute hoặc chặn quyền', 'mute'], ['Không', 'c2']]),
      c2: Q('Windows Sound → Input: thanh mức mic có nhảy khi nói?', [['Có nhảy nhưng Teams không nhận', 'teams'], ['Không nhảy', 'mic']]),
      d: Q('Windows → Privacy → Camera cho phép app? Ứng dụng khác (Zoom, Camera) đang chiếm camera?', [['Bị chặn / đang bị chiếm', 'campriv'], ['Không', 'd2']]),
      d2: Q('Mở ứng dụng Camera của Windows: có hình không?', [['Có hình', 'teams'], ['Không có hình', 'camhw']]),
      dev: X(fix, 'Chọn sai thiết bị / tắt tiếng', 'Chọn đúng loa/mic trong Teams; kiểm tra Volume Mixer. Hướng dẫn user làm “Make a test call”.'),
      teams: X(fix, 'Lỗi riêng ứng dụng Teams', 'Thoát hẳn Teams, xoá cache (%appdata%\\Microsoft\\Teams hoặc phiên bản mới), cập nhật Teams, thử Teams web.'),
      drv: X(esc, 'Driver âm thanh / thiết bị phát', 'Kiểm tra Playback devices, gỡ và cài lại driver audio; thử loa khác. Báo L2 nếu lỗi phần cứng.'),
      mute: X(fix, 'Mic bị mute / bị chặn quyền', 'Bỏ mute (nút vật lý hoặc phím), cấp quyền Microphone cho Teams ở Windows Privacy.'),
      mic: X(esc, 'Mic hỏng hoặc driver', 'Thử mic/tai nghe khác cùng cổng; cập nhật driver; thay thiết bị.'),
      campriv: X(fix, 'Quyền camera / xung đột ứng dụng', 'Bật Camera access, đóng ứng dụng đang dùng camera (Zoom, Camera…), khởi động lại Teams.'),
      camhw: X(esc, 'Camera hoặc driver', 'Kiểm tra Device Manager → Cameras, cáp USB, nút gạt vật lý; cài lại driver; báo L2 nếu cần thay.')
    }
  });
})();
