COURSE.days.push({
  n: 5, short: 'Microsoft 365 & Thiết bị', title: 'Microsoft 365, Email, máy in, hỗ trợ từ xa, quản lý thiết bị',
  tagline: 'Những ticket “nóng” nhất mỗi ngày: Outlook, Teams, OneDrive, máy in, cài phần mềm, hỗ trợ từ xa.',
  hours: '7 giờ',
  intro: 'Hôm nay bạn học các dịch vụ người dùng dùng nhiều nhất: Microsoft 365 (Outlook/Exchange, Teams, OneDrive/SharePoint), máy in &amp; thiết bị ngoại vi, kỹ thuật hỗ trợ từ xa và cách công ty quản lý, cài đặt phần mềm hàng loạt.',
  outcomes: [
    'Quản lý user, license, MFA, shared mailbox trong Microsoft 365 admin center',
    'Chẩn đoán Outlook (profile, OST, cache, quota), tìm thư qua message trace, hiểu SPF/DKIM/DMARC',
    'Xử lý sự cố Teams, OneDrive/SharePoint thường gặp',
    'Sửa 90% lỗi máy in (spooler, driver, port, queue) và thiết bị ngoại vi',
    'Hỗ trợ từ xa an toàn (Quick Assist, RDP, AnyDesk), cài phần mềm hàng loạt (winget, silent install, Intune)'
  ],
  plan: ['<b>2h</b> Bài 1–2', '<b>1h</b> Bài 3', '<b>1h</b> Bài 4 (máy in, ngoại vi)', '<b>1h</b> Bài 5–6', '<b>1.5h</b> Lab', '<b>30p</b> Quiz'],
  lessons: [
    {
      id: 'd5-l1', title: 'Microsoft 365 admin: user, license, nhóm, MFA, vai trò', min: 45,
      html: `
<p><b>Microsoft 365 (M365)</b> = bộ dịch vụ: Exchange Online (email), Teams, SharePoint/OneDrive, Office apps, Entra ID, Intune, Defender… Hầu hết công ty vừa và nhỏ ở Việt Nam đang dùng M365 hoặc Google Workspace. Admin center: <code>admin.microsoft.com</code>.</p>
<h3>Cấu trúc cơ bản</h3>
<ul>
<li><b>Tenant:</b> “không gian” của công ty, gắn với domain (<code>corp.com</code>).</li>
<li><b>License:</b> gói cấp cho từng user (Business Basic/Standard/Premium, E3, E5…). Không có license → không có hộp thư/Teams/Office. <i>Lỗi hay gặp của user mới: quên gán license.</i></li>
<li><b>Admin roles:</b> Global Admin (toàn quyền – rất hạn chế dùng), User Admin, Helpdesk Admin (reset mật khẩu), Exchange Admin, Teams Admin… Dùng role <b>tối thiểu cần thiết</b>.</li>
<li><b>Groups:</b> Microsoft 365 Group (gắn Teams/SharePoint/mailbox chung), Security group, Distribution list, Mail-enabled security group.</li>
</ul>
<h3>Các tác vụ helpdesk điển hình</h3>
<table><thead><tr><th>Yêu cầu</th><th>Làm ở đâu</th></tr></thead><tbody>
<tr><td>Tạo user + gán license</td><td>Admin center → Users → Active users → Add a user (hoặc đồng bộ từ AD)</td></tr>
<tr><td>Reset mật khẩu</td><td>Active users → chọn user → Reset password (tuỳ chọn bắt đổi); nếu hybrid, reset ở AD để đồng bộ</td></tr>
<tr><td>Reset MFA (user đổi điện thoại)</td><td>Entra admin center → Users → Authentication methods → Require re-register MFA (sau khi xác minh danh tính)</td></tr>
<tr><td>Shared mailbox (hộp thư dùng chung, vd support@)</td><td>Teams &amp; groups → Shared mailboxes → Add; gán quyền Full Access / Send As cho user</td></tr>
<tr><td>Tạo distribution list / M365 group</td><td>Teams &amp; groups hoặc Exchange admin center</td></tr>
<tr><td>Xem sức khoẻ dịch vụ</td><td>Health → Service health (khi cả công ty đều lỗi, kiểm tra đây trước!)</td></tr>
<tr><td>Xem lịch sử đăng nhập đáng ngờ</td><td>Entra admin center → Sign-in logs</td></tr>
<tr><td>Chuyển tiếp email/auto-reply nghỉ phép</td><td>Exchange admin center → Mailboxes → Manage mail flow settings; hoặc user tự đặt Automatic replies</td></tr>
</tbody></table>
<aside class="tip"><p>Khi “nhiều người cùng báo lỗi Outlook/Teams/OneDrive” hãy kiểm tra <b>Service health</b> và <code>status.office.com</code> trước khi tốn thời gian debug từng máy. Nếu Microsoft đang sự cố, ghi vào ticket, thông báo cho người dùng và theo dõi.</p></aside>
<h3>Google Workspace (so sánh nhanh)</h3>
<p>Gmail ↔ Exchange Online · Google Drive ↔ OneDrive/SharePoint · Google Meet ↔ Teams · Admin console <code>admin.google.com</code>. Khái niệm tương tự (user, OU, nhóm, 2-Step Verification, license). Nếu JD ghi Google Workspace, kỹ năng bạn học ở đây chuyển sang gần như nguyên vẹn.</p>`
    },
    {
      id: 'd5-l2', title: 'Outlook/Exchange: sự cố, quyền hộp thư, message trace, SPF/DKIM/DMARC', min: 60,
      html: `
<h3>Cách Outlook kết nối</h3>
<p>Outlook dùng <b>profile</b> (cấu hình tài khoản) + file dữ liệu cache <b>.OST</b> (bản sao hộp thư online; nằm ở <code>%LOCALAPPDATA%\\Microsoft\\Outlook</code>) ; <b>.PST</b> là file lưu trữ offline (archive). <b>Autodiscover</b> là cơ chế tự tìm cấu hình máy chủ từ địa chỉ email.</p>
<h3>Bảng lỗi Outlook hay gặp</h3>
<table><thead><tr><th>Triệu chứng</th><th>Nguyên nhân thường gặp</th><th>Cách xử lý</th></tr></thead><tbody>
<tr><td>Cứ hỏi mật khẩu / “Need password”</td><td>Đổi mật khẩu, token cũ trong Credential Manager, MFA, hybrid auth</td><td>Xoá credential “MicrosoftOffice16_*” trong Credential Manager; đăng xuất/đăng nhập Office; kiểm tra mật khẩu/MFA</td></tr>
<tr><td>“Disconnected” / “Trying to connect”</td><td>Mạng/VPN, proxy, Microsoft đang sự cố, profile hỏng</td><td>Kiểm tra mạng, thử OWA (outlook.office.com); nếu web OK → Outlook/profile lỗi</td></tr>
<tr><td>Không mở được Outlook / treo / “Cannot start”</td><td>Add-in lỗi, profile hỏng, update</td><td>Chạy <code>outlook.exe /safe</code>; tắt add-in; tạo profile mới (Control Panel → Mail)</td></tr>
<tr><td>Hộp thư đầy (mailbox full)</td><td>Vượt quota (50GB/100GB tuỳ license)</td><td>Dọn Deleted Items, Archive, Online Archive, xoá file đính kèm lớn; tăng giới hạn/đổi license nếu cần</td></tr>
<tr><td>Thiếu thư mới / thư đến chậm</td><td>Quy tắc (rules), thư rác (Junk), bộ lọc, Focused Inbox, lỗi đồng bộ</td><td>Kiểm tra Junk, Rules, Message trace; Update Folder; tạo lại OST</td></tr>
<tr><td>Gửi mail bị trả lại (NDR)</td><td>Địa chỉ sai, mailbox người nhận đầy, bị chặn spam, SPF/DKIM</td><td>Đọc mã NDR (vd 5.1.1 không có người nhận; 5.7.1 bị từ chối/không có quyền; 5.2.2 mailbox đầy)</td></tr>
<tr><td>Không thấy lịch/hộp thư chung</td><td>Chưa có quyền hoặc chưa tự add</td><td>Gán Full Access (auto-mapping), hoặc Add Account/Open Another Mailbox</td></tr>
<tr><td>Gửi “Send As / Send on Behalf”</td><td>Quyền chưa gán</td><td>Gán trong Exchange admin center → Delegation</td></tr>
</tbody></table>
<aside class="ex"><h4>Sửa Outlook bị treo — quy trình chuẩn</h4>
<ol><li>Hỏi: chỉ Outlook hay cả Teams/web? Mở <code>outlook.office.com</code>: nếu OK, hộp thư bình thường.</li><li><code>outlook.exe /safe</code> mở được? → lỗi add-in. Tắt dần add-in.</li><li>Control Panel → Mail → Show Profiles → Add profile mới → đặt làm mặc định.</li><li>Nếu vẫn lỗi: xoá file OST (sau khi đóng Outlook) để tạo lại; chạy Office Repair (Quick → Online).</li><li>Ghi lại nguyên nhân & cách xử lý.</li></ol></aside>
<h3>Message Trace — “thư tôi gửi đi đâu rồi?”</h3>
<p>Exchange admin center → Mail flow → <b>Message trace</b>: nhập người gửi/nhận + khoảng thời gian → xem trạng thái <b>Delivered / Pending / Failed / Quarantined (cách ly) / Filtered as spam</b> cùng chi tiết lý do. Đây là công cụ cứu rất nhiều ticket “khách không nhận được mail”.</p>
<h3>SPF, DKIM, DMARC — vì sao mail bị vào Spam?</h3>
<table><thead><tr><th>Cơ chế</th><th>Làm gì</th><th>Lưu ở đâu</th></tr></thead><tbody>
<tr><td><b>SPF</b></td><td>Liệt kê máy chủ được phép gửi mail thay mặt domain</td><td>TXT record: <code>v=spf1 include:spf.protection.outlook.com -all</code></td></tr>
<tr><td><b>DKIM</b></td><td>Ký số email để chứng minh không bị sửa</td><td>CNAME/TXT selector trong DNS</td></tr>
<tr><td><b>DMARC</b></td><td>Quy định phải làm gì nếu SPF/DKIM thất bại (none/quarantine/reject) + gửi báo cáo</td><td>TXT <code>_dmarc.corp.com</code></td></tr>
</tbody></table>
<p>Kiểm tra bằng: <code>nslookup -type=txt corp.com</code>. Thiếu/sai SPF hoặc DMARC ⇒ mail của công ty dễ vào Spam hoặc bị giả mạo (spoofing).</p>
<h3>Đọc email header (nhận diện phishing)</h3>
<p>Mở Message → Properties/“View message source”: tìm <code>Authentication-Results</code> (spf=pass/fail, dkim, dmarc), <code>Received</code> (đường đi), <code>Reply-To</code>/<code>Return-Path</code> khác người gửi hiển thị là dấu hiệu giả mạo.</p>`
    },
    {
      id: 'd5-l3', title: 'Teams, OneDrive, SharePoint — sự cố thường gặp', min: 40,
      html: `
<h3>Microsoft Teams</h3>
<table><thead><tr><th>Triệu chứng</th><th>Xử lý</th></tr></thead><tbody>
<tr><td>Không đăng nhập được / vòng lặp đăng nhập</td><td>Đăng xuất hoàn toàn, xoá cache Teams (đóng Teams → xoá nội dung thư mục cache trong <code>%LOCALAPPDATA%\\Packages\\MSTeams_*</code> hoặc <code>%APPDATA%\\Microsoft\\Teams</code> cho bản cũ), đăng nhập lại; kiểm tra license &amp; MFA</td></tr>
<tr><td>Không nghe/nói trong họp</td><td>Settings → Devices chọn đúng micro/loa; Windows Privacy → Microphone cho phép app; thử headset khác; kiểm tra app khác đang chiếm micro</td></tr>
<tr><td>Camera không lên</td><td>Quyền camera, driver, app khác đang dùng, tắt/bật lại; chặn bởi chính sách</td></tr>
<tr><td>Không thấy kênh/nhóm</td><td>Chưa là thành viên team (xin owner thêm); kiểm tra tài khoản đăng nhập đúng tenant</td></tr>
<tr><td>Chất lượng họp kém</td><td>Mạng Wi-Fi yếu, VPN full tunnel; dùng dây; xem Call quality dashboard</td></tr>
<tr><td>Không tạo được cuộc họp</td><td>Thiếu license, chính sách họp (Teams admin), lỗi Outlook add-in</td></tr>
</tbody></table>
<h3>OneDrive &amp; SharePoint</h3>
<ul>
<li><b>OneDrive:</b> lưu file cá nhân trên cloud, đồng bộ về máy (<i>Files On-Demand</i> chỉ tải khi mở). <b>Known Folder Move</b> tự đồng bộ Desktop/Documents/Pictures — giúp sao lưu & thay máy dễ.</li>
<li><b>SharePoint:</b> site/thư viện tài liệu dùng chung của nhóm/phòng ban; Teams lưu file vào SharePoint.</li>
<li>Biểu tượng lỗi đồng bộ: đám mây có dấu ❌ / vòng xoay → mở menu OneDrive xem file nào lỗi. Nguyên nhân hay gặp: <b>tên file chứa ký tự cấm</b> (&lt; &gt; : " / \\ | ? *), <b>đường dẫn quá dài (&gt;400 ký tự)</b>, file đang mở, đầy dung lượng, xung đột phiên bản, hết quyền.</li>
<li>Cách sửa: Pause/Resume sync → đăng xuất rồi đăng nhập lại → <code>%localappdata%\\Microsoft\\OneDrive\\onedrive.exe /reset</code> (xem dữ liệu không mất vì nằm trên cloud) → đổi tên file lỗi.</li>
<li><b>Khôi phục file:</b> Recycle Bin (OneDrive web, 93 ngày), <i>Version history</i> (khôi phục phiên bản cũ), <i>Restore your OneDrive</i> (khôi phục toàn bộ về thời điểm trước — dùng khi ransomware).</li>
<li><b>Chia sẻ:</b> link “Anyone/Specific people/People in your org”; tuân thủ chính sách chia sẻ ngoài tổ chức.</li>
</ul>
<aside class="job"><p>Khi user nói “file biến mất”: kiểm tra Recycle Bin → Version History → ai đã sửa/xoá (SharePoint audit) → có phải đang xem sai thư viện/tài khoản. 90% là nằm đâu đó chứ không mất.</p></aside>`
    },
    {
      id: 'd5-l4', title: 'Máy in, thiết bị ngoại vi và màn hình/dock', min: 45,
      html: `
<h3>Cách máy in hoạt động trên Windows</h3>
<p>Quy trình: Ứng dụng → <b>Driver máy in</b> → <b>Print Spooler</b> (hàng đợi, dịch vụ <code>spooler</code>) → <b>Cổng</b> (USB / TCP-IP port / WSD) → máy in. Máy in mạng thường có IP và dùng cổng TCP/IP chuẩn (RAW 9100 hoặc LPR 515) hoặc IPP (631).</p>
<h3>Quy trình xử lý “không in được”</h3>
<ol class="steps">
<li><b>Máy in có hoạt động không?</b> bật nguồn, giấy, mực, đèn lỗi, kẹt giấy; in trang test từ chính máy in (nút Menu → Print config).</li>
<li><b>Có kết nối mạng không?</b> <code>ping &lt;IP máy in&gt;</code>. Máy in đổi IP (DHCP) là nguyên nhân phổ biến → đặt <b>DHCP reservation</b>.</li>
<li><b>Hàng đợi bị kẹt?</b> mở Printers &amp; scanners → Open queue → huỷ job. Nếu không huỷ được: <pre><code>net stop spooler
del /Q /F /S "%systemroot%\\System32\\Spool\\Printers\\*.*"
net start spooler</code></pre></li>
<li><b>Chọn đúng máy in?</b> (người dùng hay in nhầm sang “Microsoft Print to PDF” / máy in cũ). Kiểm tra “Set as default”.</li>
<li><b>Driver:</b> gỡ máy in + gỡ driver trong <code>printmanagement.msc</code>/Print Server Properties → Drivers, cài lại đúng driver (tải từ hãng, bản 64-bit).</li>
<li><b>Port:</b> Printer Properties → Ports: cổng TCP/IP có đúng IP không? Bật/tắt SNMP nếu bị kẹt “Offline”.</li>
<li><b>Quyền in</b> (nếu máy in qua print server): user có trong nhóm được phép in không?</li>
</ol>
<table><thead><tr><th>Hiện tượng</th><th>Gợi ý</th></tr></thead><tbody>
<tr><td>Trạng thái “Offline”</td><td>Máy in tắt/mất mạng/IP đổi; tắt “Use Printer Offline”; kiểm tra cổng</td></tr>
<tr><td>In ra ký tự lạ / trang trắng</td><td>Sai driver; thử driver Universal (PCL6); cáp USB; tập tin lỗi</td></tr>
<tr><td>Lỗi 0x0000011b, 0x00000709, 0x00000bcb khi kết nối máy in chia sẻ</td><td>Thường sau bản cập nhật bảo mật Windows: kiểm tra chính sách RPC/“PointAndPrint”, cập nhật driver/print server (tra theo mã lỗi cụ thể của bản cập nhật)</td></tr>
<tr><td>Chỉ 1 người không in được</td><td>Quyền, driver cá nhân, hàng đợi trên máy đó</td></tr>
<tr><td>Scan to email/folder không hoạt động</td><td>Cấu hình SMTP (thường cần SMTP relay hoặc tài khoản dịch vụ), quyền ghi vào share, SMB phiên bản</td></tr>
</tbody></table>
<h3>Ngoại vi, màn hình, dock</h3>
<ul>
<li><b>Chuột/phím không dùng được:</b> pin, receiver, cổng, thử thiết bị khác, Device Manager.</li>
<li><b>Màn hình không nhận:</b> chọn đúng input, cáp HDMI/DP, <kbd>Win</kbd>+<kbd>P</kbd> (Duplicate/Extend), độ phân giải/tần số quét, driver.</li>
<li><b>Dock (Thunderbolt/USB-C) lỗi:</b> cập nhật firmware/driver dock, thử cáp/cổng khác, rút nguồn dock 30 giây, cập nhật BIOS laptop.</li>
<li><b>Headset/micro:</b> Settings → Sound; mặc định input/output; chế độ độc quyền; Bluetooth ghép đôi lại.</li>
<li><b>USB không nhận:</b> Device Manager → Uninstall device → Scan; kiểm tra cấp nguồn (USB selective suspend); chính sách chặn USB do GPO/DLP.</li>
</ul>`
    },
    {
      id: 'd5-l5', title: 'Hỗ trợ từ xa & triển khai phần mềm', min: 45,
      html: `
<h3>Công cụ hỗ trợ từ xa</h3>
<table><thead><tr><th>Công cụ</th><th>Đặc điểm</th><th>Khi dùng</th></tr></thead><tbody>
<tr><td><b>Quick Assist</b> (có sẵn Windows)</td><td>Người dùng đọc mã 6 số cho bạn; hỗ trợ xem/điều khiển; cần đăng nhập Microsoft</td><td>Hỗ trợ nhanh, user ở bất cứ đâu</td></tr>
<tr><td><b>Remote Desktop (RDP, mstsc)</b></td><td>Kết nối vào máy/server trong mạng nội bộ hoặc qua VPN; cổng 3389. <i>Sẽ khoá màn hình người đang dùng</i> (máy trạm) → không phù hợp để “xem cùng user”</td><td>Quản trị server, máy trạm không có người dùng</td></tr>
<tr><td><b>Remote Assistance (msra)</b></td><td>Dùng chung phiên với user</td><td>Mạng nội bộ</td></tr>
<tr><td><b>AnyDesk, TeamViewer, ScreenConnect, BeyondTrust, Splashtop</b></td><td>Cài agent, hỗ trợ cả unattended; có log phiên, chuyển file</td><td>Công cụ chính của nhiều đội helpdesk</td></tr>
<tr><td><b>PowerShell remoting, PsExec</b></td><td>Chạy lệnh từ xa không cần giao diện</td><td>Tác vụ hàng loạt</td></tr>
</tbody></table>
<aside class="warn"><p><b>Đạo đức &amp; bảo mật khi remote:</b> luôn xin phép người dùng, nói rõ bạn sẽ làm gì; không mở thư/tài liệu cá nhân; không lưu mật khẩu người dùng; kết thúc phiên đúng cách và ghi vào ticket. Dùng công cụ được công ty phê duyệt — không dùng công cụ cá nhân không kiểm soát.</p></aside>
<h3>Cài đặt phần mềm</h3>
<ul>
<li><b>Thủ công:</b> chạy installer — chỉ phù hợp 1–2 máy.</li>
<li><b>Silent install</b> (không hiện hộp thoại): MSI → <code>msiexec /i app.msi /qn /norestart</code>; EXE → thường <code>/S</code>, <code>/silent</code>, <code>/quiet</code> (tra tài liệu từng phần mềm).</li>
<li><b>winget</b> (có sẵn Windows 10/11): <pre><code>winget search 7zip
winget install --id 7zip.7zip -e --silent
winget upgrade --all
winget list</code></pre></li>
<li><b>Chocolatey</b> (<code>choco install googlechrome -y</code>), <b>Scoop</b>.</li>
<li><b>Doanh nghiệp:</b> <b>Microsoft Intune</b> (Win32 apps, Company Portal), <b>SCCM / MECM</b>, <b>PDQ Deploy</b>, GPO Software Installation. Phần mềm được đóng gói, kiểm thử, rồi triển khai theo nhóm máy.</li>
</ul>
<h3>Bản quyền &amp; chuẩn phần mềm</h3>
<p>Doanh nghiệp quản lý <b>bản quyền</b> (không dùng crack — rủi ro pháp lý và malware), phần mềm theo <b>danh mục chuẩn</b>; yêu cầu cài phần mềm lạ phải qua <b>phê duyệt</b> (Service Request → quản lý + IT/Security). Bạn nên biết: phần mềm cần admin hay không, phiên bản, cách gỡ, tương thích.</p>
<h3>Khi cài phần mềm lỗi</h3>
<ol class="steps"><li>Đọc thông báo/mã lỗi (MSI log: <code>msiexec /i app.msi /l*v install.log</code>).</li><li>Kiểm tra quyền admin, dung lượng, phiên bản Windows/ .NET/ VC++ runtime.</li><li>Tắt tạm antivirus chỉ khi được phép và có lý do (không nên).</li><li>Gỡ sạch bản cũ (Programs and Features, thư mục còn sót), khởi động lại, cài lại.</li><li>Dùng <b>Microsoft Program Install and Uninstall troubleshooter</b> nếu không gỡ được.</li></ol>`
    },
    {
      id: 'd5-l6', title: 'Quản lý thiết bị: Intune, MDM, di động, tài sản & vá lỗi', min: 40,
      html: `
<h3>Endpoint management</h3>
<p>Công ty có hàng trăm laptop/điện thoại nên không thể cấu hình tay. <b>Endpoint management</b> giúp: cấu hình đồng loạt, cài ứng dụng, bắt buộc bảo mật (mã hoá, PIN, antivirus), vá lỗi, xoá dữ liệu từ xa khi mất thiết bị.</p>
<table><thead><tr><th>Công cụ</th><th>Cho</th></tr></thead><tbody>
<tr><td><b>Microsoft Intune</b> (MDM/MAM)</td><td>Windows, macOS, iOS, Android — cloud-first</td></tr>
<tr><td><b>SCCM/MECM</b></td><td>Windows tại chỗ, triển khai phần mềm &amp; patch quy mô lớn</td></tr>
<tr><td><b>Jamf</b></td><td>macOS/iOS</td></tr>
<tr><td><b>WSUS / Windows Update for Business</b></td><td>Quản lý cập nhật Windows</td></tr>
</tbody></table>
<h3>Điện thoại, tablet</h3>
<ul>
<li><b>Cài email công ty</b>: Outlook mobile (khuyên dùng) với tài khoản M365; chính sách MDM có thể bắt đặt PIN, mã hoá.</li>
<li><b>BYOD</b> (thiết bị cá nhân): dùng MAM (App Protection) để tách dữ liệu công ty, có thể xoá riêng dữ liệu công ty.</li>
<li><b>Mất thiết bị:</b> báo ngay → khoá/wipe từ xa (Intune → Devices → Wipe/Retire), đổi mật khẩu, thu hồi phiên, báo Security. Ghi vào ticket thời gian và hành động.</li>
<li><b>iOS/Android:</b> sao lưu, cập nhật hệ điều hành, MFA app, Wi-Fi cấu hình sẵn (profile), VPN.</li>
</ul>
<h3>Quản lý tài sản (Asset Management)</h3>
<ul>
<li>Mỗi thiết bị có <b>asset tag</b> (mã tài sản), serial, người dùng, vị trí, ngày mua/bảo hành, tình trạng. Lưu ở CMDB hoặc hệ thống tài sản (Snipe-IT, GLPI, ServiceNow).</li>
<li><b>Vòng đời:</b> Mua → Cấp phát → Sử dụng → Sửa chữa/nâng cấp → Thu hồi → Thanh lý/huỷ dữ liệu (wipe/degauss).</li>
<li>Khi cấp/thu hồi thiết bị: ký biên bản bàn giao, cập nhật CMDB.</li>
</ul>
<h3>Quản lý bản vá (Patch Management)</h3>
<p>Cập nhật Windows/Office/phần mềm định kỳ (Patch Tuesday – thứ Ba thứ hai hàng tháng). Quy trình: thử nghiệm nhóm nhỏ → triển khai theo vòng (ring) → báo cáo tuân thủ. Máy lâu không patch là rủi ro bảo mật lớn. Helpdesk thường nhận ticket “máy tự restart / lỗi sau update” — biết cách gỡ update tạm (<code>wusa /uninstall /kb:xxxx</code>) và báo để team patch xử lý.</p>
<h3>Mã hoá ổ đĩa — BitLocker</h3>
<p>Mã hoá toàn bộ ổ để dữ liệu không bị đọc nếu mất laptop. Khoá khôi phục (recovery key, 48 số) được lưu trong AD/Entra ID. Khi user bị đòi key: <b>xác minh danh tính</b> → lấy key (Entra admin → Device → BitLocker keys, hoặc ADUC → thuộc tính Computer) → hướng dẫn nhập.</p>`
    }
  ],
  lab: {
    title: 'Dựng tenant Microsoft 365 thử nghiệm & xử lý 6 ticket thực tế',
    html: `
<p><b>Thời gian:</b> ~1.5–2 giờ. Dùng <b>Microsoft 365 Business Premium / E5 trial</b> (thường 1 tháng, cần thẻ xác minh — nếu không muốn, dùng <b>Microsoft 365 Developer Program</b> nếu bạn đủ điều kiện, hoặc <b>Google Workspace trial</b>, hoặc chỉ dùng Entra ID miễn phí và đọc tài liệu ở phần thực hành thay thế). Đừng dùng tài khoản công ty thật của bạn.</p>
<ol class="steps">
<li><b>Tạo tenant</b> và domain mặc định <code>xxx.onmicrosoft.com</code>. Tạo 5 user, gán license.</li>
<li><b>Bật MFA</b> (Security defaults) và đăng ký Microsoft Authenticator cho 1 user. Sau đó mô phỏng “đổi điện thoại”: yêu cầu đăng ký lại MFA từ phía admin.</li>
<li><b>Shared mailbox</b> <code>support@</code>: gán Full Access + Send As cho 2 user. Đăng nhập bằng 1 user vào Outlook Web và kiểm tra thấy hộp thư; gửi email từ <code>support@</code>.</li>
<li><b>Message trace:</b> gửi email giữa 2 user và 1 email tới địa chỉ ngoài; vào Exchange admin center tìm trace, xem trạng thái.</li>
<li><b>Nhóm &amp; Teams:</b> tạo Microsoft 365 Group “Kế toán”, một Team có 2 kênh; thêm file lên SharePoint; thử phân quyền thành viên.</li>
<li><b>OneDrive:</b> cài OneDrive trên VM, bật Known Folder Move, tạo file tên chứa ký tự lỗi để xem thông báo; khôi phục file đã xoá từ Recycle Bin.</li>
<li><b>Máy in ảo:</b> trên VM, cài một máy in giả (Add printer → Microsoft PDF, hoặc cài driver generic với cổng TCP/IP 192.168.x.x), thử gây “hàng đợi kẹt” rồi xoá bằng <code>net stop spooler</code>; ghi lại các bước.</li>
<li><b>winget:</b> dùng <code>winget install</code> để cài 7-Zip, Notepad++ , VLC; viết script <code>install-apps.ps1</code> cài hàng loạt.</li>
<li><b>Viết 6 ticket mẫu có kết quả giải quyết</b> (Outlook không nhận mail, reset MFA, thêm quyền shared mailbox, OneDrive không đồng bộ, máy in kẹt, cài phần mềm).</li>
</ol>
<p><b>Sản phẩm để lưu:</b> ảnh admin center (che thông tin nhạy cảm), script <code>install-apps.ps1</code>, 6 ticket mẫu — đưa vào “Dự án 5”.</p>`
  },
  quiz: [
    { q: 'User mới đăng nhập được M365 nhưng không có hộp thư Outlook. Nguyên nhân thường gặp nhất?', o: ['Chưa được gán license có Exchange Online', 'Hỏng card mạng', 'Lệch múi giờ', 'Quá nhiều RAM'], a: 0, e: 'Không có license thì không có dịch vụ tương ứng (mailbox, Teams, Office).' },
    { q: 'Outlook treo khi mở. Lệnh nào mở Outlook ở chế độ an toàn?', o: ['outlook.exe /safe', 'outlook.exe /reset', 'outlook --debug', 'outlook /fix'], a: 0, e: 'Safe mode tắt add-in để xác định nguyên nhân.' },
    { q: 'Công cụ nào dùng để biết một email có được gửi tới người nhận hay bị chặn/cách ly?', o: ['Message trace', 'Task Manager', 'Disk Cleanup', 'Device Manager'], a: 0, e: 'Message trace trong Exchange admin center.' },
    { q: 'SPF record là gì?', o: ['Chữ ký số của email', 'Danh sách máy chủ được phép gửi email thay mặt domain', 'Chính sách xử lý email giả mạo', 'Phần mở rộng file'], a: 1, e: 'SPF (TXT trong DNS). DKIM là chữ ký; DMARC là chính sách + báo cáo.' },
    { q: 'Cách nhanh nhất để xoá job in bị kẹt không huỷ được là?', o: ['Cài lại Windows', 'Stop Print Spooler, xoá file trong thư mục spool\\PRINTERS, start lại', 'Thay máy in', 'Tắt router'], a: 1, e: 'Dừng spooler, xoá các file hàng đợi, bật lại dịch vụ.' },
    { q: 'RDP vào một PC đang có người dùng làm việc sẽ…', o: ['Chia sẻ màn hình cùng người dùng', 'Thường khoá phiên của người đang dùng tại máy', 'Không bao giờ gây ảnh hưởng', 'Luôn bị chặn'], a: 1, e: 'RDP trên máy trạm Windows dùng phiên riêng, ngắt phiên đăng nhập tại chỗ. Để xem cùng user, dùng Quick Assist/Remote Assistance/AnyDesk.' },
    { q: 'Điện thoại công ty bị mất. Hành động ưu tiên?', o: ['Chờ tìm thấy', 'Khoá/wipe từ xa qua MDM, đổi mật khẩu/thu hồi phiên, báo Security và ghi ticket', 'Chỉ gửi email thông báo', 'Mua điện thoại mới'], a: 1, e: 'Giảm thiểu rủi ro rò rỉ dữ liệu ngay lập tức.' },
    { q: 'Tên file nào có thể gây lỗi đồng bộ OneDrive?', o: ['baocao_2025.xlsx', 'doanh thu: Q1/Q2.xlsx', 'hop dong.docx', 'plan-final.pptx'], a: 1, e: 'Ký tự như : / \\ * ? " < > | không hợp lệ.' },
    { q: 'Winget lệnh nào cài silent 7-Zip theo ID?', o: ['winget install --id 7zip.7zip -e --silent', 'winget get 7zip', 'winget open 7zip', 'install winget 7zip'], a: 0, e: 'winget install --id <id> -e --silent' }
  ],
  scenarios: [
    { q: '<b>Tình huống:</b> 9h sáng thứ Hai, 15 người báo “Outlook không gửi/nhận được mail”. Bạn làm gì trước?', o: ['Cài lại Outlook cho từng người', 'Kiểm tra Service health trong M365 admin center / status.office.com, thử Outlook Web, xem có thay đổi DNS/mail flow cuối tuần; tạo ticket cha gom các ticket con; thông báo người dùng', 'Bảo mọi người khởi động lại máy', 'Xoá profile Outlook của tất cả'], a: 1, e: 'Nhiều người cùng lỗi → khả năng là dịch vụ/hạ tầng. Kiểm tra trạng thái dịch vụ, gom ticket (major incident) và truyền thông.' },
    { q: '<b>Tình huống:</b> Khách hàng báo không nhận được hợp đồng bạn gửi hôm qua. Bạn xử lý thế nào?', o: ['Bảo khách kiểm tra lại', 'Dùng Message trace theo người gửi/người nhận → xem trạng thái (Delivered/Failed/Spam/Quarantine), đọc mã NDR; nếu bị spam ở phía khách, kiểm tra SPF/DKIM/DMARC của domain', 'Gửi lại 10 lần', 'Tắt antivirus'], a: 1, e: 'Message trace cho biết thư đã đi tới đâu; SPF/DKIM/DMARC ảnh hưởng khả năng vào hộp thư đến của bên nhận.' },
    { q: '<b>Tình huống:</b> Anh Quang gọi: “Mình đổi điện thoại mới và không đăng nhập được Outlook vì Authenticator không có.” Cách xử lý đúng?', o: ['Reset luôn MFA cho anh Quang', 'Xác minh danh tính theo quy trình (kênh độc lập/quản lý xác nhận), sau đó yêu cầu đăng ký lại MFA trong Entra, hướng dẫn cài Authenticator và đăng ký lại; ghi chú trong ticket', 'Tắt MFA toàn công ty', 'Bảo anh ấy mượn tài khoản người khác'], a: 1, e: 'Reset MFA là thao tác nhạy cảm (kẻ tấn công rất hay yêu cầu): luôn xác minh trước.' }
  ]
});
