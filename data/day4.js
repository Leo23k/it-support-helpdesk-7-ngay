COURSE.days.push({
  n: 4, short: 'Active Directory & Identity', title: 'Active Directory, Group Policy, File/Print server và danh tính đám mây (Entra ID)',
  tagline: 'Kỹ năng phân biệt fresher “biết” với fresher “bình thường”: quản lý tài khoản & máy tính ở quy mô công ty.',
  hours: '7–8 giờ',
  intro: 'Gần như mọi công ty trên 30 nhân viên đều dùng <b>Active Directory (AD)</b> và/hoặc <b>Microsoft Entra ID</b> (trước đây là Azure AD). Các tác vụ hằng ngày của helpdesk — reset mật khẩu, mở khoá tài khoản, thêm vào nhóm, cấp quyền thư mục, onboarding/offboarding — đều xoay quanh chúng. Đây là ngày có giá trị CV cao nhất.',
  outcomes: [
    'Giải thích AD, domain, domain controller, OU, user/group/computer và vì sao công ty cần chúng',
    'Thực hiện thành thạo: reset mật khẩu, mở khoá, tạo/vô hiệu hoá user, thêm vào nhóm (GUI + PowerShell)',
    'Hiểu Group Policy, kiểm tra GPO áp dụng bằng gpupdate/gpresult',
    'Cấp quyền thư mục dùng nhóm (AGDLP), map ổ, cài máy in qua print server',
    'Phân biệt AD – Entra ID – Hybrid; hiểu SSO, MFA, Intune ở mức nhập môn',
    'Có quy trình onboarding / offboarding chuẩn'
  ],
  plan: ['<b>2h</b> Bài 1–2', '<b>1.5h</b> Bài 3–4', '<b>1h</b> Bài 5–6', '<b>2.5h</b> Lab dựng domain (rất đáng đầu tư)', '<b>30p</b> Quiz'],
  lessons: [
    {
      id: 'd4-l1', title: 'Active Directory là gì? Vì sao công ty cần?', min: 40,
      html: `
<aside class="def"><p><b>Active Directory Domain Services (AD DS)</b> là dịch vụ thư mục của Microsoft: một cơ sở dữ liệu trung tâm chứa <b>danh tính</b> (người dùng, nhóm, máy tính, máy in…) và cho phép <b>xác thực + phân quyền tập trung</b>. Máy chủ chạy AD gọi là <b>Domain Controller (DC)</b>.</p></aside>
<aside class="ex"><p>Công ty 200 nhân viên. Không có AD: mỗi máy có user riêng, đổi mật khẩu phải đi từng máy, nhân viên nghỉ việc phải xoá tài khoản ở hàng trăm nơi. Có AD: nhân viên đăng nhập <b>cùng một tài khoản</b> trên bất kỳ máy nào; IT tạo/khoá/phân quyền ở một chỗ duy nhất; áp dụng chính sách (mật khẩu, wallpaper, chặn USB…) cho toàn bộ máy bằng Group Policy.</p></aside>
<h3>Các khái niệm cốt lõi</h3>
<table><thead><tr><th>Khái niệm</th><th>Ý nghĩa</th><th>Ví dụ</th></tr></thead><tbody>
<tr><td><b>Domain</b></td><td>Ranh giới quản lý: tập hợp user, computer, policy dùng chung</td><td><code>corp.local</code> hoặc <code>corp.com.vn</code></td></tr>
<tr><td><b>Domain Controller (DC)</b></td><td>Server lưu AD, xác thực đăng nhập. Công ty thường có ≥ 2 DC để dự phòng; DC cũng chạy DNS</td><td>DC01, DC02</td></tr>
<tr><td><b>Forest / Tree</b></td><td>Cấu trúc lớn gồm nhiều domain</td><td>Công ty lớn nhiều chi nhánh</td></tr>
<tr><td><b>OU (Organizational Unit)</b></td><td>“Thư mục” tổ chức đối tượng; là đơn vị để áp GPO và uỷ quyền</td><td>OU=HCM → OU=KeToan</td></tr>
<tr><td><b>User / Computer / Group</b></td><td>Đối tượng cơ bản. Máy tính cũng có tài khoản trong AD</td><td>nguyen.an, PC-KT-017, G_KeToan</td></tr>
<tr><td><b>Group</b></td><td>Tập hợp để cấp quyền. <i>Security group</i> dùng để phân quyền; <i>Distribution group</i> chỉ để gửi email</td><td>G_KeToan_RW</td></tr>
<tr><td><b>Kerberos</b></td><td>Giao thức xác thực chính (vé/ticket, nhạy cảm với <b>lệch giờ &gt; 5 phút</b>)</td><td>Lỗi đăng nhập khi giờ máy lệch</td></tr>
<tr><td><b>Domain join</b></td><td>Đưa máy vào domain để user domain đăng nhập được</td><td>sysdm.cpl → Change → Domain</td></tr>
</tbody></table>
<h3>Quy trình đăng nhập domain (đơn giản)</h3>
<ol class="steps"><li>User nhập <code>CORP\\nguyen.an</code> (hoặc <code>nguyen.an@corp.local</code>) + mật khẩu.</li><li>Máy tìm DC qua <b>DNS</b> (bản ghi SRV) → gửi yêu cầu xác thực Kerberos.</li><li>DC xác nhận → cấp vé → máy tải profile, <b>áp dụng GPO</b>, map ổ mạng.</li></ol>
<aside class="warn"><p><b>Quy tắc vàng:</b> máy join domain phải dùng <b>DNS của DC</b> (không phải 8.8.8.8). Đa số lỗi “không tìm thấy domain / trust relationship” bắt nguồn từ DNS hoặc giờ hệ thống.</p></aside>
<h3>Công cụ quản trị</h3>
<ul><li><b>Active Directory Users and Computers (ADUC)</b> — <code>dsa.msc</code>: GUI quản lý user/group/computer. Cài trên máy admin qua <i>RSAT</i> (Remote Server Administration Tools).</li><li><b>Group Policy Management</b> — <code>gpmc.msc</code>.</li><li><b>DNS Manager</b>, <b>DHCP</b>, <b>AD Sites and Services</b>.</li><li><b>PowerShell module ActiveDirectory</b>.</li></ul>`
    },
    {
      id: 'd4-l2', title: 'Việc hằng ngày của helpdesk trên AD (GUI + PowerShell)', min: 60,
      html: `
<h3>Top 8 tác vụ</h3>
<table><thead><tr><th>Tác vụ</th><th>ADUC (GUI)</th><th>PowerShell</th></tr></thead><tbody>
<tr><td>Reset mật khẩu</td><td>Chuột phải user → Reset Password → tick “User must change password at next logon”</td><td><code>Set-ADAccountPassword -Identity an.nguyen -Reset -NewPassword (Read-Host -AsSecureString)</code> rồi <code>Set-ADUser an.nguyen -ChangePasswordAtLogon $true</code></td></tr>
<tr><td>Mở khoá tài khoản</td><td>Properties → Account → Unlock account</td><td><code>Unlock-ADAccount -Identity an.nguyen</code></td></tr>
<tr><td>Tìm nguyên do bị khoá</td><td>Event Viewer trên DC: Event 4740 (cho biết máy nguồn gây khoá)</td><td><code>Get-ADUser an.nguyen -Properties LockedOut,BadLogonCount,LastBadPasswordAttempt,PasswordLastSet</code></td></tr>
<tr><td>Vô hiệu hoá (nhân viên nghỉ)</td><td>Chuột phải → Disable Account</td><td><code>Disable-ADAccount -Identity an.nguyen</code></td></tr>
<tr><td>Thêm vào nhóm</td><td>Properties → Member Of → Add</td><td><code>Add-ADGroupMember -Identity G_KeToan -Members an.nguyen</code></td></tr>
<tr><td>Xem user thuộc nhóm nào</td><td>Member Of</td><td><code>Get-ADPrincipalGroupMembership an.nguyen | select Name</code></td></tr>
<tr><td>Tạo user mới</td><td>New → User trong OU đúng</td><td><code>New-ADUser -Name "Nguyen An" -SamAccountName an.nguyen -UserPrincipalName an.nguyen@corp.local -Path "OU=KeToan,OU=HCM,DC=corp,DC=local" -AccountPassword (Read-Host -AsSecureString) -Enabled $true</code></td></tr>
<tr><td>Chuyển máy/user giữa OU</td><td>Kéo-thả hoặc Move…</td><td><code>Move-ADObject</code></td></tr>
</tbody></table>
<h3>Tạo hàng loạt từ CSV (kỹ năng tạo ấn tượng trong phỏng vấn)</h3>
<pre><code># users.csv: Name,Sam,OU,Dept
Import-Csv .\\users.csv | ForEach-Object {
  New-ADUser -Name $_.Name -SamAccountName $_.Sam -UserPrincipalName "$($_.Sam)@corp.local" \`
    -Department $_.Dept -Path $_.OU -Enabled $true -ChangePasswordAtLogon $true \`
    -AccountPassword (ConvertTo-SecureString "Tam@Pass2025!" -AsPlainText -Force)
}</code></pre>
<aside class="warn"><p>Mật khẩu viết cứng trong script chỉ dùng trong lab. Thực tế: sinh mật khẩu ngẫu nhiên, ép đổi khi đăng nhập, và gửi bằng kênh an toàn.</p></aside>
<h3>Vì sao tài khoản hay bị khoá?</h3>
<ul>
<li>User đổi mật khẩu nhưng <b>điện thoại</b> (email/Wi-Fi) vẫn dùng mật khẩu cũ → thử sai liên tục.</li>
<li><b>Ổ mạng ánh xạ, tác vụ định kỳ, dịch vụ (service)</b> chạy bằng tài khoản user với mật khẩu cũ.</li>
<li>Phiên RDP/Teams/Outlook cũ trên máy khác; credential cũ trong Credential Manager.</li>
<li>Tấn công dò mật khẩu (brute force) — nếu nhiều tài khoản cùng bị khoá, báo Security ngay.</li>
</ul>
<aside class="job"><p>Chính sách điển hình: mật khẩu tối thiểu 8–12 ký tự, hết hạn 60–90 ngày (nhiều nơi bỏ hết hạn nhưng bắt MFA), khoá 5–10 lần sai trong 15–30 phút. Hãy biết chính sách của công ty bạn để giải thích cho user.</p></aside>
<h3>Phân biệt: Security group vs Distribution group; phạm vi (scope)</h3>
<ul><li><b>Security group</b>: cấp quyền (thư mục, máy in, ứng dụng) và cũng dùng gửi mail. <b>Distribution group</b>: chỉ gửi email (mailing list).</li><li>Scope: <b>Global</b> (chứa user của domain), <b>Domain Local</b> (gán quyền trong domain), <b>Universal</b> (nhiều domain). Nguyên tắc <b>AGDLP</b>: Account → Global group → Domain Local group → Permission.</li></ul>`
    },
    {
      id: 'd4-l3', title: 'Group Policy (GPO) — quản lý hàng trăm máy bằng chính sách', min: 45,
      html: `
<aside class="def"><p><b>Group Policy</b> là cơ chế áp dụng cấu hình tự động cho user/máy trong AD: bảo mật, phần mềm, wallpaper, map ổ đĩa, máy in, chặn USB, cập nhật Windows, chính sách mật khẩu…</p></aside>
<h3>Cách GPO hoạt động</h3>
<ul>
<li>GPO được <b>liên kết (link)</b> vào Site / Domain / OU.</li>
<li>Thứ tự áp dụng: <b>L</b>ocal → <b>S</b>ite → <b>D</b>omain → <b>OU</b> (LSDOU); GPO áp sau sẽ ghi đè trước. OU lồng nhau thì OU con áp cuối.</li>
<li>Hai phần: <b>Computer Configuration</b> (áp khi máy khởi động) và <b>User Configuration</b> (áp khi user đăng nhập).</li>
<li>Làm mới mỗi ~90 phút (+ ngẫu nhiên 0–30 phút) hoặc ngay: <code>gpupdate /force</code> (có thể cần đăng xuất/đăng nhập lại hoặc restart).</li>
<li><b>Security Filtering</b>: giới hạn GPO chỉ áp cho nhóm cụ thể. <b>Enforced</b>: không cho OU dưới ghi đè.</li>
</ul>
<aside class="ex"><p>Yêu cầu: “Phòng Kế toán cần ổ K: trỏ tới <code>\\\\fileserver\\KeToan</code> và chặn USB.” → Tạo GPO “KeToan-Drives-USB”, link vào OU KeToan, cấu hình <i>User Config → Preferences → Drive Maps</i> và <i>Computer Config → Admin Templates → System → Removable Storage Access: Deny all</i>. Máy kế toán nhận trong ≤ 90 phút.</p></aside>
<h3>Kiểm tra &amp; gỡ lỗi GPO</h3>
<pre><code>gpupdate /force          # ép áp dụng
gpresult /r              # tóm tắt GPO đã áp (Computer / User)
gpresult /h report.html  # báo cáo chi tiết dạng HTML (rất dễ đọc)
rsop.msc                 # Resultant Set of Policy (GUI)</code></pre>
<p><b>Khi GPO không áp dụng, kiểm tra theo thứ tự:</b></p>
<ol class="steps">
<li>Máy/user có nằm đúng <b>OU</b> mà GPO được link không?</li>
<li>Máy có liên lạc được DC, DNS đúng, giờ đúng không? (<code>nltest /dsgetdc:corp.local</code>)</li>
<li>Security filtering / WMI filter có loại trừ không?</li>
<li>GPO bị ghi đè bởi GPO khác (xem <code>gpresult</code> “Winning GPO”)? Có “Block inheritance”?</li>
<li>Cấu hình thuộc Computer hay User (đặt nhầm mục)?</li>
<li>Replication giữa các DC chưa xong (SYSVOL).</li>
</ol>
<aside class="tip"><p>Luôn thử GPO trên một OU thử nghiệm trước. Một GPO sai áp lên toàn domain có thể làm cả công ty không làm việc được — đó là lý do thay đổi GPO thuộc quy trình <b>Change Management</b>.</p></aside>`
    },
    {
      id: 'd4-l4', title: 'File server, Print server, DNS/DHCP trên Windows Server và lỗi “trust relationship”', min: 50,
      html: `
<h3>File server &amp; chia sẻ thư mục theo nhóm</h3>
<p>Mẫu chuẩn cho công ty: một thư mục gốc <code>D:\\Shares</code> trên file server, mỗi phòng 1 thư mục con, share ra mạng, quyền NTFS gán cho <b>nhóm AD</b>:</p>
<pre><code>Thư mục:   D:\\Shares\\KeToan  ->  \\\\fileserver\\KeToan
Nhóm:      G_KeToan_RW (Modify)   G_KeToan_RO (Read &amp; Execute)
Quy trình: cần cấp quyền cho nhân viên mới -> thêm user vào G_KeToan_RW -> user đăng xuất/đăng nhập lại</code></pre>
<ul>
<li><b>Map ổ đĩa</b>: bằng GPO (Drive Maps) hoặc <code>net use K: \\\\fileserver\\KeToan /persistent:yes</code>. Không map tay từng máy nếu đã có GPO.</li>
<li><b>Quota / FSRM</b> giới hạn dung lượng; <b>Previous Versions (Shadow Copy)</b> cho phép khôi phục file bị xoá/sửa nhầm — rất hữu ích: Properties → Previous Versions.</li>
<li><b>Access-based enumeration</b>: user chỉ thấy thư mục có quyền.</li>
<li><b>DFS</b>: gom nhiều server vào một đường dẫn thống nhất (<code>\\\\corp.local\\Shares</code>).</li>
</ul>
<h3>Print server</h3>
<p>Print server giúp cài driver/queue tập trung. Máy người dùng kết nối <code>\\\\printserver\\PRN-KT-02</code> (qua GPO hoặc Add printer). Lỗi thường gặp: <b>Print Spooler kẹt</b> (xoá <code>C:\\Windows\\System32\\spool\\PRINTERS</code> sau khi stop dịch vụ), driver không tương thích 32/64 bit, user không có quyền in, máy in đổi IP (dùng DHCP reservation/tên máy in). (Chi tiết ở Ngày 5.)</p>
<h3>DNS &amp; DHCP trên Windows Server</h3>
<ul>
<li><b>DNS:</b> DC chạy DNS có vùng (zone) <code>corp.local</code> với bản ghi A cho các máy, bản ghi SRV (<code>_ldap._tcp…</code>) để máy tìm DC. Kiểm tra bản ghi bằng <code>nslookup</code> hoặc DNS Manager. “Dọn bản ghi cũ” (scavenging) tránh trùng.</li>
<li><b>DHCP:</b> khai báo <b>scope</b> (dải IP), <b>exclusions</b>, <b>reservations</b>, các <b>options</b> (003 Router/gateway, 006 DNS, 015 domain name). Thông báo “scope đầy” → tăng dải/giảm lease.</li>
</ul>
<h3>Lỗi kinh điển: “The trust relationship between this workstation and the primary domain failed”</h3>
<p><b>Ý nghĩa:</b> mật khẩu tài khoản máy (computer account) và DC lệch nhau (máy dựng lại từ snapshot, máy lâu không bật, máy bị xoá trong AD, lệch giờ). <b>Cách xử lý:</b></p>
<ol class="steps">
<li>Đăng nhập bằng tài khoản <b>local admin</b>.</li>
<li>Kiểm tra giờ + DNS (trỏ về DC) và liên lạc được DC.</li>
<li>PowerShell (admin): <code>Test-ComputerSecureChannel -Repair -Credential (Get-Credential)</code>; hoặc <code>Reset-ComputerMachinePassword -Server DC01 -Credential (Get-Credential)</code>.</li>
<li>Không được: gỡ khỏi domain, đổi sang workgroup rồi join lại (rejoin) → cần quyền xoá/tạo computer account.</li>
</ol>
<h3>Các lỗi domain khác</h3>
<table><thead><tr><th>Lỗi</th><th>Gợi ý</th></tr></thead><tbody>
<tr><td>“Domain not available” khi đăng nhập</td><td>Mạng/VPN chưa có, DNS sai, DC tắt. User có thể đăng nhập bằng cached credentials nếu từng đăng nhập</td></tr>
<tr><td>Đổi mật khẩu mà máy cũ vẫn dùng mật khẩu cũ</td><td>Đăng nhập khi đang nối mạng công ty/VPN để cache mật khẩu mới</td></tr>
<tr><td>“Your account has been disabled / expired”</td><td>Kiểm tra trạng thái tài khoản/ngày hết hạn trong AD</td></tr>
<tr><td>Join domain thất bại</td><td>DNS không trỏ về DC; tên máy trùng; không đủ quyền; giờ lệch</td></tr>
</tbody></table>`
    },
    {
      id: 'd4-l5', title: 'Microsoft Entra ID (Azure AD), SSO, MFA và Intune — danh tính đám mây', min: 45,
      html: `
<p>Công ty hiện đại không chỉ dùng AD tại chỗ (on-prem) mà dùng <b>Microsoft Entra ID</b> — dịch vụ danh tính trên đám mây gắn với Microsoft 365. Nó là “AD cho thời đại cloud”, nhưng không hoàn toàn giống.</p>
<table><thead><tr><th></th><th>AD DS (on-prem)</th><th>Entra ID (cloud)</th></tr></thead><tbody>
<tr><td>Vị trí</td><td>Server tại công ty</td><td>Dịch vụ Microsoft trên cloud</td></tr>
<tr><td>Giao thức</td><td>Kerberos, NTLM, LDAP</td><td>OAuth2, OpenID Connect, SAML (REST/HTTPS)</td></tr>
<tr><td>Cấu trúc</td><td>OU, GPO</td><td>Groups, Conditional Access, không có OU/GPO truyền thống</td></tr>
<tr><td>Quản lý thiết bị</td><td>Group Policy</td><td>Intune (MDM)</td></tr>
<tr><td>Dùng cho</td><td>Máy tính &amp; server nội bộ, file server</td><td>Microsoft 365, ứng dụng SaaS, truy cập từ mọi nơi</td></tr>
</tbody></table>
<h3>Ba mô hình thiết bị</h3>
<ul>
<li><b>Domain-joined:</b> chỉ tham gia AD tại chỗ.</li>
<li><b>Entra ID joined:</b> chỉ cloud (không cần DC) — phổ biến ở công ty “cloud-first”.</li>
<li><b>Hybrid joined:</b> vừa AD vừa Entra ID; tài khoản được đồng bộ từ AD lên cloud bằng <b>Entra Connect</b>. Phổ biến nhất ở doanh nghiệp đã có AD lâu năm.</li>
</ul>
<h3>Khái niệm cần biết</h3>
<ul>
<li><b>SSO (Single Sign-On):</b> đăng nhập một lần, dùng nhiều ứng dụng (Outlook, Teams, SharePoint, Salesforce…).</li>
<li><b>MFA (Multi-Factor Authentication):</b> thêm lớp xác thực (Microsoft Authenticator, SMS, khoá FIDO2). Rất quan trọng: giảm >99% tấn công chiếm tài khoản. Helpdesk hay xử lý: <i>“đổi điện thoại mới, mất Authenticator”</i> → <b>xác minh danh tính kỹ</b> rồi mới xoá/đăng ký lại phương thức MFA.</li>
<li><b>Conditional Access:</b> luật “nếu…thì…” (vd chỉ cho đăng nhập từ máy tuân thủ, chặn từ nước ngoài, bắt MFA khi ngoài văn phòng). Lý do user bị chặn khi đi công tác.</li>
<li><b>SSPR (Self-Service Password Reset):</b> user tự đặt lại mật khẩu → giảm ticket reset.</li>
<li><b>Intune:</b> quản lý thiết bị (Windows, macOS, iOS, Android): cấu hình, cài app, bắt buộc mã hoá/PIN, xoá từ xa khi mất máy. <b>Autopilot</b>: nhân viên mới nhận máy nguyên hộp, đăng nhập là tự cấu hình xong.</li>
<li><b>Company Portal:</b> “cửa hàng ứng dụng” công ty để user tự cài phần mềm được phê duyệt.</li>
</ul>
<aside class="job"><p>Câu hỏi phỏng vấn rất hay gặp: <i>“User bị khoá tài khoản Microsoft 365, bạn làm gì?”</i> Trả lời: xác minh danh tính → xem Sign-in logs (lý do/vị trí IP/Conditional Access) → kiểm tra mật khẩu hết hạn/đổi, MFA → nếu nghi bị chiếm thì reset mật khẩu, thu hồi session (Revoke sessions), kiểm tra luật chuyển tiếp email lạ trong hộp thư, báo Security.</p></aside>
<h3>Lệnh PowerShell hữu ích (Microsoft Graph)</h3>
<pre><code>Connect-MgGraph -Scopes "User.ReadWrite.All"
Get-MgUser -Filter "startswith(displayName,'Nguyen')" | Select DisplayName,UserPrincipalName,AccountEnabled
Update-MgUser -UserId an.nguyen@corp.com -AccountEnabled:$false   # vô hiệu hoá
Revoke-MgUserSignInSession -UserId an.nguyen@corp.com            # thu hồi phiên đăng nhập</code></pre>`
    },
    {
      id: 'd4-l6', title: 'Onboarding / Offboarding và bảo mật tài khoản', min: 35,
      html: `
<p>Hai quy trình này chiếm một phần lớn Service Request và liên quan trực tiếp tới bảo mật. Mọi công ty có checklist riêng — hãy học mẫu này để hiểu logic.</p>
<h3>Onboarding (nhân viên mới)</h3>
<ol class="steps">
<li><b>Nhận yêu cầu</b> từ HR/quản lý qua ticket (họ tên, phòng ban, ngày bắt đầu, chức danh, quản lý trực tiếp, thiết bị &amp; phần mềm cần, ai được cấp quyền gì).</li>
<li><b>Tạo tài khoản AD</b> đúng OU, đặt theo quy ước (<code>ho.ten</code>), mật khẩu tạm + bắt đổi khi đăng nhập.</li>
<li><b>Thêm vào nhóm</b> theo phòng ban/chức danh (đừng sao chép nhóm của người khác một cách mù quáng — dễ cấp thừa quyền).</li>
<li><b>Cấp giấy phép Microsoft 365</b>, tạo hộp thư, thêm vào nhóm email/Teams.</li>
<li><b>Chuẩn bị thiết bị:</b> laptop (image/Autopilot), cài phần mềm chuẩn, đặt tên máy, BitLocker, gán tài sản trong CMDB/asset.</li>
<li><b>Hướng dẫn nhân viên:</b> đăng nhập lần đầu, đăng ký MFA, SSPR, quy định bảo mật, cách tạo ticket.</li>
<li><b>Đóng ticket</b> với danh sách đã cấp, xác nhận từ quản lý.</li>
</ol>
<h3>Offboarding (nhân viên nghỉ việc)</h3>
<ol class="steps">
<li>Nhận yêu cầu chính thức từ HR (kèm <b>thời điểm</b> có hiệu lực).</li>
<li><b>Vô hiệu hoá</b> tài khoản đúng giờ (<i>disable</i>, <b>không xoá ngay</b>); đổi mật khẩu ngẫu nhiên; thu hồi phiên Entra/MFA.</li>
<li><b>Chuyển dữ liệu:</b> chuyển hộp thư/OneDrive cho quản lý, thiết lập chuyển tiếp/auto-reply theo chính sách, sao lưu.</li>
<li><b>Gỡ khỏi nhóm</b>, thu hồi giấy phép, gỡ quyền ứng dụng/VPN/thiết bị di động (xoá dữ liệu công ty).</li>
<li><b>Thu hồi thiết bị</b> (laptop, thẻ, điện thoại), ghi nhận tình trạng; wipe và đưa vào kho.</li>
<li>Sau X ngày (vd 30–90 ngày) mới <b>xoá</b> tài khoản theo chính sách lưu trữ.</li>
</ol>
<aside class="warn"><p>Sai sót hay gặp: quên khoá tài khoản kịp thời (rủi ro lộ dữ liệu), xoá hộp thư luôn (mất dữ liệu cần lưu), quên thu hồi quyền VPN/ứng dụng SaaS. Ngược lại, <b>không bao giờ</b> làm offboarding theo yêu cầu miệng hoặc từ người không có thẩm quyền.</p></aside>
<h3>Bảo mật tài khoản — những quy tắc cho helpdesk</h3>
<ul>
<li><b>Xác minh danh tính trước khi reset</b> (hỏi thông tin chỉ chủ tài khoản biết, gọi lại số đã đăng ký, hoặc quản lý xác nhận). Ghi lại cách đã xác minh trong ticket.</li>
<li><b>Least privilege:</b> chỉ cấp quyền cần thiết; quyền tạm thời phải có ngày hết hạn; mọi cấp quyền nhạy cảm cần người phê duyệt (data owner).</li>
<li>Dùng <b>tài khoản admin riêng</b> (vd <code>adm.an</code>) cho tác vụ quản trị, không dùng tài khoản hằng ngày có quyền admin.</li>
<li>Không chia sẻ tài khoản; không gửi mật khẩu qua chat/email thường.</li>
<li>Định kỳ <b>rà soát quyền</b> (access review).</li>
</ul>`
    }
  ],
  lab: {
    title: 'Dựng domain corp.local: Windows Server 2022 + client Windows, OU, user, GPO, file share',
    html: `
<p><b>Thời gian:</b> 2.5–3 giờ. <b>Cũng là Dự án 1 trong mục dự án CV</b> — hãy chụp ảnh mọi bước. Yêu cầu: máy thật RAM ≥ 12GB (Server 3GB + Client 3GB). Windows Server 2022 Evaluation (180 ngày) tải miễn phí từ Microsoft Evaluation Center.</p>
<ol class="steps">
<li><b>Mạng:</b> trong VirtualBox, đặt cả 2 VM vào mạng <i>Internal Network</i> tên <code>labnet</code> (hoặc Host-only). Thêm card NAT cho Server nếu muốn ra Internet.</li>
<li><b>Server (DC01):</b> cài Windows Server 2022 (Desktop Experience). Đặt IP tĩnh <code>192.168.50.10/24</code>, DNS <code>127.0.0.1</code> (hoặc chính IP). Đổi tên máy <code>DC01</code>.</li>
<li><b>Cài AD DS + DNS:</b> Server Manager → Add roles → <i>Active Directory Domain Services</i> → Promote → <i>Add a new forest</i> <code>corp.local</code> → đặt mật khẩu DSRM. Hoặc PowerShell: <pre><code>Install-WindowsFeature AD-Domain-Services,DNS,DHCP -IncludeManagementTools
Install-ADDSForest -DomainName corp.local -InstallDns</code></pre></li>
<li><b>DHCP:</b> cấu hình scope <code>192.168.50.100–200</code>, gateway <code>192.168.50.1</code>, DNS <code>192.168.50.10</code>, authorize DHCP trong AD.</li>
<li><b>Cấu trúc OU &amp; user:</b> tạo OU <code>HCM</code> → <code>KeToan</code>, <code>NhanSu</code>, <code>IT</code>, <code>Computers</code>. Tạo 6 user (dùng CSV + PowerShell ở Bài 2), nhóm <code>G_KeToan_RW</code>, <code>G_NhanSu_RW</code>.</li>
<li><b>Client (PC01):</b> cài Windows 10/11 Pro, đặt DNS trỏ <code>192.168.50.10</code> (hoặc để DHCP cấp). Join domain: <code>sysdm.cpl</code> → Change → <code>corp.local</code>. Restart, đăng nhập bằng <code>CORP\\an.nguyen</code>.</li>
<li><b>File share:</b> trên DC01 tạo <code>C:\\Shares\\KeToan</code>, share <code>KeToan</code>, NTFS: <code>G_KeToan_RW</code> Modify, xoá quyền Users. Từ PC01 đăng nhập user thuộc / không thuộc nhóm để kiểm chứng quyền.</li>
<li><b>GPO 1:</b> tạo GPO “Drive-KeToan” link vào OU KeToan: map ổ K: tới <code>\\\\DC01\\KeToan</code>. Chạy <code>gpupdate /force</code> trên PC01, kiểm tra ổ K:.</li>
<li><b>GPO 2:</b> “Security-Baseline”: đặt wallpaper bắt buộc hoặc chặn truy cập Control Panel/USB cho OU NhanSu; <code>gpresult /r</code> để xác nhận GPO nào đang thắng.</li>
<li><b>Tình huống thực tế:</b> (a) khoá tài khoản bằng cách nhập sai mật khẩu 5 lần, rồi mở khoá bằng GUI và bằng PowerShell; xem Event 4740 trên DC01; (b) reset mật khẩu bắt đổi khi đăng nhập; (c) giả lập “trust relationship failed” (revert snapshot của PC01 cũ hơn) rồi sửa bằng <code>Test-ComputerSecureChannel -Repair</code>; (d) thực hiện onboarding + offboarding 1 user theo checklist, ghi vào ticket.</li>
</ol>
<p><b>Sản phẩm để lưu:</b> sơ đồ mạng, ảnh OU/GPO/gpresult, script <code>New-Users.ps1</code> + <code>users.csv</code>, checklist onboarding/offboarding. Mẫu mô tả CV có ở trang Dự án.</p>`
  },
  quiz: [
    { q: 'Cấu trúc nào dùng để tổ chức user/máy trong AD và là đơn vị phổ biến để áp Group Policy?', o: ['Forest', 'OU (Organizational Unit)', 'VLAN', 'Subnet'], a: 1, e: 'OU là “thư mục” để tổ chức đối tượng, áp GPO và uỷ quyền quản trị.' },
    { q: 'User bị khoá tài khoản (account lockout). Công cụ/lệnh nào mở khoá?', o: ['gpupdate /force', 'Unlock-ADAccount', 'ipconfig /renew', 'sfc /scannow'], a: 1, e: 'ADUC → Properties → Unlock account, hoặc Unlock-ADAccount. Đồng thời tìm nguyên nhân khoá (event 4740).' },
    { q: 'Thứ tự áp dụng GPO (từ trước đến sau) là?', o: ['OU → Domain → Site → Local', 'Local → Site → Domain → OU', 'Domain → Local → OU → Site', 'Site → OU → Local → Domain'], a: 1, e: 'LSDOU: Local, Site, Domain, OU. GPO áp sau ghi đè GPO áp trước (trừ khi Enforced).' },
    { q: 'Máy tính báo “trust relationship between this workstation and the primary domain failed”. Cách xử lý đúng, ít phá hoại nhất?', o: ['Cài lại Windows', 'Đăng nhập local admin và chạy Test-ComputerSecureChannel -Repair (hoặc Reset-ComputerMachinePassword)', 'Xoá user trong AD', 'Đổi cáp mạng'], a: 1, e: 'Sửa lại secure channel của computer account với DC, không cần cài lại máy.' },
    { q: 'Nguyên tắc cấp quyền thư mục tốt nhất trong doanh nghiệp là?', o: ['Gán trực tiếp cho từng user', 'Gán quyền cho nhóm (AGDLP), thêm user vào nhóm', 'Cho Everyone Full Control', 'Dùng mật khẩu thư mục'], a: 1, e: 'Quản lý theo nhóm dễ kiểm soát, onboarding/offboarding chỉ cần thêm/bớt nhóm.' },
    { q: 'Khác biệt chính giữa AD DS và Entra ID?', o: ['Không có khác biệt', 'AD DS là thư mục on-prem dùng Kerberos/LDAP + GPO; Entra ID là danh tính cloud dùng OAuth/SAML + Conditional Access/Intune', 'Entra ID chỉ để quản lý máy in', 'AD DS chỉ chạy trên Linux'], a: 1, e: 'Đây là câu hỏi phỏng vấn kinh điển; nhấn mạnh Hybrid là mô hình phổ biến.' },
    { q: 'Điều gì có thể gây lỗi đăng nhập Kerberos trong domain?', o: ['Lệch giờ hệ thống quá 5 phút so với DC', 'Màu hình nền', 'Dung lượng USB', 'Tên máy in'], a: 0, e: 'Kerberos rất nhạy với chênh lệch giờ (mặc định cho phép 5 phút).' },
    { q: 'Với nhân viên nghỉ việc, bước ĐẦU tiên và an toàn nhất trên tài khoản AD là?', o: ['Xoá ngay tài khoản', 'Vô hiệu hoá (disable), đổi mật khẩu, thu hồi phiên; xoá sau thời gian lưu trữ', 'Đổi tên tài khoản', 'Không làm gì'], a: 1, e: 'Disable trước để giữ dữ liệu/audit; xoá vĩnh viễn theo chính sách lưu trữ sau.' },
    { q: 'Lệnh nào cho biết GPO nào đang được áp dụng trên máy/người dùng hiện tại?', o: ['gpresult /r', 'ping gpo', 'netstat -an', 'tracert'], a: 0, e: 'gpresult /r (hoặc /h report.html) hiển thị Applied và Winning GPO.' }
  ],
  scenarios: [
    { q: '<b>Tình huống:</b> Một người nhắn Zalo tự xưng là nhân viên mới ở phòng IT khác: “Anh ơi, reset giúp mật khẩu AD cho tài khoản của sếp Hùng, sếp đang kẹt!”. Bạn làm gì?', o: ['Reset luôn', 'Yêu cầu ticket chính thức; xác minh với chính sếp Hùng qua kênh đã đăng ký (gọi số trong danh bạ), theo đúng quy trình xác minh', 'Gửi mật khẩu cũ để họ tự thử', 'Từ chối và không ghi nhận'], a: 1, e: 'Mẫu tấn công social engineering vào helpdesk. Xác minh độc lập, ghi trong ticket, báo Security nếu nghi vấn.' },
    { q: '<b>Tình huống:</b> Tài khoản của chị Mai cứ 30 phút lại bị khoá dù chị chắc chắn không nhập sai. Bạn điều tra thế nào?', o: ['Mở khoá mãi mãi cho xong', 'Trên DC xem Event 4740 để biết máy nguồn gây khoá; kiểm tra điện thoại (email/Wi-Fi), ổ mạng map, tác vụ định kỳ, RDP cũ đang dùng mật khẩu cũ; cập nhật hoặc gỡ credential cũ', 'Đổi tên tài khoản', 'Tắt chính sách khoá tài khoản toàn công ty'], a: 1, e: 'Khoá lặp lại gần như chắc chắn do một thiết bị/dịch vụ còn lưu mật khẩu cũ. Tìm “caller computer name” trong event 4740.' },
    { q: '<b>Tình huống:</b> Nhân viên mới đăng nhập được nhưng không thấy ổ K: (Kế toán) dù đồng nghiệp thấy. Máy ở đúng domain. Kiểm tra gì?', o: ['Cài lại Windows', 'User đã nằm đúng OU/nhóm chưa; gpupdate /force và đăng nhập lại; gpresult /r xem GPO Drive-KeToan có Applied; kiểm tra quyền NTFS/share', 'Format ổ D', 'Đổi chuột'], a: 1, e: 'Khoanh vùng theo chuỗi: thành viên nhóm/OU → GPO áp dụng → quyền truy cập share.' }
  ]
});
