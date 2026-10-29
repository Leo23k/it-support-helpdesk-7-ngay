// Dữ liệu cho các công cụ luyện tập: ticket, giao tiếp, phishing, thẻ ghi nhớ, thử thách gõ lệnh.
window.TPRAC = { tickets: [], comm: [], phish: [], decks: [], cmds: [] };
(function () {
  var P = window.TPRAC;

  /* ---------- Phân loại ticket ---------- */
  // type: Incident | Service Request | Problem | Change · pri: 1..4 · route: l1 | sys | net | sec | appr | info
  function tk(from, subj, body, type, pri, route, why) { P.tickets.push({ from: from, subj: subj, body: body, type: type, pri: pri, route: route, why: why }); }
  tk('Hà · Marketing', 'Máy in không in', 'Máy in tầng 2 không in được. Em cần in 1 bản hợp đồng để ký trong 30 phút nữa.', 'Incident', 3, 'l1', '<b>Sự cố</b> (dịch vụ đang hỏng). Ảnh hưởng thấp (1 người, có thể dùng máy in khác) nhưng gấp ⇒ P3. L1 xử lý ngay theo quy trình máy in.');
  tk('Trưởng phòng Vận hành', 'Mất mạng toàn tầng 3', 'Cả tầng 3 (khoảng 80 người) không vào được mạng từ 9h, không ai làm việc được.', 'Incident', 1, 'net', 'Ảnh hưởng <b>cao</b> (80 người) + khẩn <b>cao</b> (không làm việc được) ⇒ <b>P1</b>. Lỗi hạ tầng mạng ⇒ chuyển L2 Mạng ngay.');
  tk('Linh · Thiết kế', 'Xin cài Photoshop', 'Cho em cài Adobe Photoshop để làm banner tuần sau.', 'Service Request', 4, 'appr', '<b>Yêu cầu dịch vụ</b> (không phải sự cố). Phần mềm có bản quyền/chi phí ⇒ cần <b>phê duyệt</b> của quản lý trước khi cài. Không khẩn ⇒ P4.');
  tk('Trang · Kế toán', 'Email lạ, đã bấm link', 'Em nhận mail “xác nhận tài khoản ngân hàng”, lỡ bấm vào link và nhập mật khẩu email rồi.', 'Incident', 2, 'sec', '<b>Sự cố bảo mật</b>: thông tin đăng nhập có thể đã lộ. Ảnh hưởng 1 tài khoản nhưng rủi ro lan rộng và cần xử lý nhanh ⇒ <b>P2</b>. Chuyển Security (đổi mật khẩu, thu hồi phiên, kiểm tra).');
  tk('Dũng · Nhân sự', 'Quên mật khẩu', 'Em quên mật khẩu Windows nên không đăng nhập được.', 'Service Request', 3, 'l1', '<b>Yêu cầu dịch vụ</b> chuẩn (reset mật khẩu). L1 xử lý <u>sau khi xác minh danh tính</u>. 1 người không làm việc được nhưng có thể dùng thiết bị khác ⇒ P3.');
  tk('Giám đốc điều hành', 'PowerPoint không mở, họp 14h', 'Laptop của tôi mở file PowerPoint báo lỗi. 14h tôi họp với đối tác, cần gấp.', 'Incident', 2, 'l1', 'Sự cố, ảnh hưởng thấp về số người nhưng người dùng <b>VIP</b> và có <b>hạn chót</b> ⇒ nhiều tổ chức nâng lên <b>P2</b>. L1 xử lý ngay (sửa Office, mở bản web/ máy khác).');
  tk('Phòng Nhân sự', 'Máy mới cho nhân viên vào thứ Hai', 'Nhân viên mới vào làm thứ Hai (Phòng Kế toán). Nhờ IT chuẩn bị laptop và tài khoản. Đã có duyệt của trưởng phòng.', 'Service Request', 3, 'l1', '<b>Yêu cầu dịch vụ</b> (onboarding) đã có phê duyệt. Có thời hạn nhưng đủ thời gian chuẩn bị ⇒ P3. L1 làm theo checklist onboarding.');
  tk('Cả công ty', 'Phần mềm HRM báo lỗi 503', 'Hệ thống HRM báo “503 Service Unavailable” với tất cả mọi người, không chấm công được.', 'Incident', 1, 'sys', 'Dịch vụ dùng chung ngừng hoạt động, ảnh hưởng cả công ty ⇒ <b>P1</b>. Lỗi phía ứng dụng/server ⇒ chuyển L2 Hệ thống.');
  tk('Nam · Kinh doanh', 'Chuột không hoạt động', 'Chuột của em bị liệt. Em vẫn dùng được touchpad, không gấp.', 'Incident', 4, 'l1', 'Sự cố nhỏ, có cách thay thế (touchpad), 1 người, không gấp ⇒ <b>P4</b>. L1 cấp chuột mới/ kiểm tra pin, cổng USB.');
  tk('Quản lý phòng họp', 'Wi-Fi phòng họp chậm', 'Từ hôm qua Wi-Fi ở phòng họp lớn rất giật, các buổi họp online bị ảnh hưởng (mỗi buổi khoảng 20 người).', 'Incident', 3, 'net', 'Ảnh hưởng <b>trung bình</b> (một khu vực), không có sự kiện đặc biệt ngay lúc này ⇒ <b>P3</b>. Cần kiểm tra AP/kênh sóng ⇒ L2 Mạng.');
  tk('Trưởng phòng Kế toán', 'Không vào được file server, đang đóng sổ', 'Cả phòng Kế toán không mở được thư mục chung trên file server từ sáng. Hôm nay là hạn chót đóng sổ.', 'Incident', 2, 'sys', 'Ảnh hưởng một phòng (<b>trung bình</b>) + hạn chót (<b>khẩn cao</b>) ⇒ <b>P2</b>. Lỗi file server ⇒ L2 Hệ thống.');
  tk('Mai · Kế toán', 'Xin quyền thư mục Lương', 'Cho em xin quyền đọc thư mục “Lương” trên file server để làm báo cáo.', 'Service Request', 3, 'appr', '<b>Yêu cầu dịch vụ</b> truy cập dữ liệu nhạy cảm ⇒ phải có <b>phê duyệt của chủ dữ liệu</b> (và quản lý) trước khi cấp. Không tự cấp.');
  tk('Quản lý Kinh doanh', 'Laptop bị mất ở sân bay', 'Tôi vừa làm mất laptop công ty ở sân bay, trong máy có dữ liệu khách hàng.', 'Incident', 1, 'sec', 'Nguy cơ <b>lộ dữ liệu khách hàng</b> ⇒ ảnh hưởng cao + cần hành động ngay (khoá/xoá từ xa, đổi mật khẩu) ⇒ <b>P1</b>. Chuyển Security và làm theo quy trình mất thiết bị.');
  tk('Đức · Kế hoạch', 'Máy chậm sau khi cập nhật', 'Sau khi Windows cập nhật tối qua, máy em chạy chậm hơn nhiều nhưng vẫn làm việc được.', 'Incident', 3, 'l1', 'Sự cố một người, vẫn làm việc được ⇒ <b>P3</b>. L1 kiểm tra tài nguyên, khởi động, driver, dung lượng.');
  tk('Hồng · Hành chính', 'Màn hình nhấp nháy', 'Màn hình của em thỉnh thoảng nhấp nháy, hơi khó chịu nhưng vẫn làm việc được.', 'Incident', 4, 'l1', 'Ảnh hưởng thấp, mức khẩn thấp ⇒ <b>P4</b>. L1 thử cáp, tần số quét, driver, màn hình khác.');
  tk('Khoa · Nhân viên mới', 'Cách kết nối VPN từ nhà', 'Em mới vào, cần hướng dẫn cách kết nối VPN để làm việc ở nhà tuần sau.', 'Service Request', 4, 'l1', 'Câu hỏi/yêu cầu hướng dẫn (không phải sự cố), không gấp ⇒ <b>P4</b>. L1 gửi tài liệu KB hoặc hướng dẫn trực tiếp.');
  tk('Cảnh báo tự động', 'Antivirus phát hiện trojan trên máy Kế toán', 'Endpoint protection cảnh báo đã phát hiện Trojan.GenericKD trên PC-ACC-021 và đang cách ly tệp.', 'Incident', 2, 'sec', 'Sự cố bảo mật, một máy nhưng có nguy cơ lan rộng, cần xử lý nhanh ⇒ <b>P2</b>. Chuyển Security điều tra, cô lập máy.');
  tk('Vy · Kinh doanh', 'Camera Teams không lên, họp 5 phút nữa', 'Camera trên Teams không hoạt động, 5 phút nữa em họp với khách hàng lớn.', 'Incident', 2, 'l1', 'Một người nhưng <b>khẩn cực cao</b> (5 phút) và liên quan khách hàng lớn ⇒ <b>P2</b>. L1 xử lý ngay (quyền camera, ứng dụng khác chiếm, thử Teams web).');
  tk('Trưởng nhóm Dev', 'Mở cổng RDP 3389 ra Internet', 'Cần mở cổng 3389 trên firewall ra Internet cho server UAT để dev làm việc từ xa tiện hơn.', 'Change', 3, 'appr', 'Đây là <b>yêu cầu thay đổi (Change)</b> hạ tầng. RDP mở ra Internet là rủi ro rất cao (ransomware) ⇒ phải qua <b>đánh giá rủi ro và phê duyệt CAB/Security</b>; gợi ý giải pháp thay thế (VPN, bastion). Không tự thực hiện.');
  tk('Nhiều người dùng (15 ticket / 2 tuần)', 'Outlook treo lặp đi lặp lại', 'Trong 2 tuần qua có 15 ticket giống nhau: Outlook bị Not Responding khi mở file đính kèm. Mỗi lần L1 khởi động lại thì tạm ổn.', 'Problem', 3, 'sys', 'Nhiều sự cố giống nhau chưa rõ gốc rễ ⇒ mở <b>Problem</b> để tìm nguyên nhân gốc (root cause), không chỉ xử lý từng sự cố. Chuyển L2 Hệ thống phân tích (bản cập nhật, add-in, server).');
  tk('Bình · Kinh doanh', 'Máy bị lỗi', 'Máy em bị lỗi, nhờ IT xem giúp.', 'Incident', 3, 'info', 'Thông tin <b>quá mơ hồ</b>: chưa biết lỗi gì, ở máy nào, từ khi nào. L1 cần <b>hỏi thêm</b> (thông báo lỗi, ảnh chụp, thời điểm, đã thử gì) trước khi phân loại chính xác; tạm P3.');

  /* ---------- Giao tiếp ---------- */
  function cm(kind, sit, opts) { P.comm.push({ kind: kind, sit: sit, opts: opts }); }
  cm('reply', 'Người dùng bực bội: “Đây là lần thứ 3 tôi báo máy chậm mà không ai sửa! Các anh làm ăn kiểu gì vậy?!” Bạn nhận ticket này.', [
    { t: '“Tôi rất tiếc vì bạn phải chờ lâu — hai lần trước chưa giải quyết được là phía IT chưa làm tốt. Tôi sẽ nhận ticket này đến cùng: kiểm tra ngay bây giờ và cập nhật cho bạn trước 11h. Bạn cho tôi mượn máy 10 phút được không?”', s: 2, w: 'Đồng cảm, nhận trách nhiệm, cam kết thời hạn cụ thể và hành động ngay. Không đổ lỗi.' },
    { t: '“Bạn bình tĩnh, tôi đang kiểm tra đây. Mỗi ticket đều có quy trình riêng, bạn đợi tôi một chút.”', s: 1, w: 'Không sai nhưng “bình tĩnh” dễ làm người đang bực thêm bực; không thừa nhận vấn đề và không có cam kết.' },
    { t: '“Hai ticket trước không phải của tôi nên tôi không biết. Bạn liên hệ lại người xử lý đó đi.”', s: 0, w: 'Đẩy trách nhiệm. Với user, “IT” là một; hãy tiếp nhận và giải quyết.' }
  ]);
  cm('reply', 'Giám đốc nhắn: “Cho anh mật khẩu admin của server file để anh tự vào xem, đỡ phải nhờ em.”', [
    { t: '“Dạ anh, em không thể chia sẻ mật khẩu admin theo quy định bảo mật (cả công ty đều áp dụng). Anh cho em biết cần xem gì, em xem giúp ngay; hoặc em tạo yêu cầu xin quyền xem đúng phạm vi để Security duyệt cho anh ạ.”', s: 2, w: 'Từ chối đúng nguyên tắc, nêu lý do, đưa giải pháp thay thế đúng quy trình, giữ thái độ tôn trọng.' },
    { t: '“Dạ không được đâu anh, quy định không cho phép.”', s: 1, w: 'Đúng nguyên tắc nhưng cộc và không đưa ra hướng giúp đỡ.' },
    { t: '“Dạ đây anh, mật khẩu là …”', s: 0, w: 'Chia sẻ mật khẩu admin phá vỡ kiểm soát truy cập. Dù là sếp vẫn phải theo quy trình.' }
  ]);
  cm('reply', 'Người dùng không rành kỹ thuật hỏi: “Máy tôi báo lỗi DNS gì đó, nghĩa là sao?” Bạn đã tìm ra DNS server đang lỗi.', [
    { t: '“DNS giống như danh bạ điện thoại: nó đổi tên trang web thành địa chỉ số để máy tìm đường. Hiện danh bạ chính không trả lời nên máy không tìm được trang. Tôi sẽ chuyển sang danh bạ dự phòng, khoảng 2 phút là xong.”', s: 2, w: 'Dùng ví dụ đời thường, ngắn gọn, nói rõ việc sẽ làm và thời gian.' },
    { t: '“DNS là Domain Name System, phân giải FQDN sang địa chỉ IP qua UDP cổng 53; DNS server chính của ta bị timeout nên resolver không trả về bản ghi A.”', s: 1, w: 'Chính xác nhưng quá thuật ngữ với người không chuyên.' },
    { t: '“Cái đó bạn không cần biết đâu, để tôi lo là được.”', s: 0, w: 'Thiếu tôn trọng, không giúp user hiểu và tự tin hơn.' }
  ]);
  cm('reply', 'Ổ SSD của laptop user hỏng, linh kiện phải đặt, dự kiến 3 ngày làm việc. Bạn báo user thế nào?', [
    { t: '“Ổ SSD cần thay và phải đặt hàng, dự kiến 3 ngày làm việc. Trong thời gian đó tôi cấp laptop mượn, đã đăng nhập sẵn OneDrive để bạn làm việc bình thường. Hàng về tôi báo ngay; nếu trễ tôi cũng sẽ cập nhật bạn.”', s: 2, w: 'Trung thực về thời gian, có giải pháp tạm, cam kết cập nhật chủ động.' },
    { t: '“Sẽ sửa sớm nhất có thể.”', s: 1, w: 'Mơ hồ, không thời hạn, không giải pháp tạm — user không biết phải làm gì.' },
    { t: '“Chưa biết khi nào có, bạn cứ chờ nhé.”', s: 0, w: 'Không chủ động, không hỗ trợ trong thời gian chờ.' }
  ]);
  cm('reply', 'Bạn vừa sửa xong lỗi máy in cho chị Lan. Hãy chọn cách đóng ticket tốt nhất.', [
    { t: '“Tôi đã xử lý và máy in hoạt động lại. Chị in thử giúp tôi 1 trang; nếu ổn tôi sẽ đóng ticket, nếu chị chưa phản hồi trong 2 ngày làm việc ticket sẽ tự đóng và chị có thể mở lại bất cứ lúc nào.”', s: 2, w: 'Xác nhận với user trước khi đóng, nêu quy tắc tự đóng và cho phép mở lại.' },
    { t: '“Đã sửa xong, tôi đóng ticket nhé.”', s: 1, w: 'Đóng nhanh nhưng chưa xác nhận kết quả với user.' },
    { t: '(Đóng ticket mà không báo gì cho user.)', s: 0, w: 'User có thể vẫn lỗi mà không biết ai xử lý; gây mất tin tưởng.' }
  ]);
  cm('reply', 'Bạn cần điều khiển từ xa vào máy của một nhân viên để xử lý lỗi.', [
    { t: '“Tôi có thể điều khiển máy bạn từ xa để xử lý lỗi không ạ? Tôi chỉ làm những việc liên quan đến lỗi, bạn nhìn thấy mọi thao tác và có thể dừng bất cứ lúc nào.”', s: 2, w: 'Xin phép trước, nêu phạm vi, minh bạch và tôn trọng quyền kiểm soát của user.' },
    { t: '“Tôi sẽ remote vào máy bạn bây giờ nhé.”', s: 1, w: 'Có báo trước nhưng thiếu xin phép và giải thích phạm vi.' },
    { t: '“Bạn cho tôi mật khẩu để tôi đăng nhập vào máy xem.”', s: 0, w: 'Không bao giờ xin mật khẩu người dùng; dùng công cụ remote có xin phép.' }
  ]);
  cm('reply', 'Bạn đang xử lý ticket P3 của chị Lan thì có cảnh báo P1: toàn công ty mất email. Bạn nói gì với chị Lan?', [
    { t: '“Chị Lan ơi, em vừa nhận sự cố khẩn ảnh hưởng toàn công ty nên cần tạm dừng việc của chị khoảng 30 phút. Em ghi lại tiến độ và sẽ gọi chị ngay khi quay lại; nếu cần gấp em nhờ đồng nghiệp tiếp nhận.”', s: 2, w: 'Ưu tiên theo mức độ ảnh hưởng, nhưng báo trước, có thời gian và phương án thay thế.' },
    { t: '(Bỏ ticket của chị Lan đi xử lý P1 mà không báo gì.)', s: 1, w: 'Ưu tiên đúng nhưng im lặng khiến user thấy bị bỏ rơi.' },
    { t: '“Em đã hứa với chị rồi nên làm xong việc này đã, sự cố kia để đồng nghiệp lo.”', s: 0, w: 'Sai thứ tự ưu tiên: P1 ảnh hưởng cả công ty phải được xử lý trước.' }
  ]);
  cm('reply', 'Một đồng nghiệp nhờ: “Tắt giúp tôi cảnh báo antivirus đi, nó cứ chặn file này, tôi cần dùng gấp.”', [
    { t: '“Mình hiểu là bạn cần gấp. Antivirus đang chặn nên mình cần kiểm tra file trước (nguồn gốc, quét thêm). Nếu an toàn mình sẽ xin ngoại lệ theo quy trình. Bạn cho mình biết file lấy ở đâu nhé.”', s: 2, w: 'Hiểu nhu cầu, giải thích rủi ro, đưa quy trình hợp lệ và hỏi thêm thông tin.' },
    { t: '“Không được, tôi không thể tắt antivirus.”', s: 1, w: 'Đúng nguyên tắc nhưng thiếu hỗ trợ thay thế.' },
    { t: '“OK, tôi tắt cho bạn đây.”', s: 0, w: 'Tắt bảo vệ vì lời nhờ là rủi ro lớn (file có thể là mã độc).' }
  ]);
  cm('reply', 'Nhân viên lỡ xoá thư mục quan trọng và nói: “Sao IT không có bản sao lưu?!”', [
    { t: '“Mình hiểu bạn đang lo. Bạn đừng lưu thêm gì vào thư mục đó nhé. Mình kiểm tra thùng rác, Previous Versions và bản sao lưu ngay bây giờ, 20 phút nữa mình báo kết quả.”', s: 2, w: 'Trấn an, hướng dẫn bảo toàn dữ liệu, hành động ngay với thời hạn cụ thể.' },
    { t: '“Mình sẽ thử khôi phục nhưng không đảm bảo được đâu.”', s: 1, w: 'Trung thực nhưng thiếu trấn an và thiếu hướng dẫn bảo toàn dữ liệu.' },
    { t: '“Bạn tự xoá chứ ai xoá, lần sau cẩn thận hơn nhé.”', s: 0, w: 'Đổ lỗi làm tình huống tệ hơn; ưu tiên trước hết là khôi phục.' }
  ]);
  cm('note', 'Bạn vừa sửa lỗi “Outlook báo Need Password” bằng cách xoá thông tin đăng nhập cũ. Chọn <b>ghi chú đóng ticket</b> tốt nhất.', [
    { t: 'Triệu chứng: Outlook liên tục yêu cầu mật khẩu sau khi user đổi mật khẩu hôm qua. Nguyên nhân: credential cũ lưu trong Credential Manager. Khắc phục: xoá các mục MicrosoftOffice16_* trong Credential Manager, mở lại Outlook, đăng nhập bằng mật khẩu mới → kết nối thành công. Đã xác nhận với user lúc 10:20.', s: 2, w: 'Đủ: triệu chứng – nguyên nhân – cách khắc phục – xác nhận. Người sau đọc có thể tự làm lại.' },
    { t: 'Đã xoá credential, Outlook chạy OK.', s: 1, w: 'Có kết quả nhưng thiếu triệu chứng, nguyên nhân và bước cụ thể để tái sử dụng.' },
    { t: 'Fix xong.', s: 0, w: 'Không có thông tin — ticket vô giá trị cho lần sau và cho audit.' }
  ]);
  cm('note', 'Bạn cần <b>leo thang</b> sự cố mất Internet của cả phòng Kinh doanh cho L2 Mạng. Chọn nội dung chuyển ticket tốt nhất.', [
    { t: '[P2] Mất Internet toàn phòng Kinh doanh (12 người) từ 8:40; LAN nội bộ vẫn OK. Kết quả: ping gateway 192.168.1.1 timeout, tracert 8.8.8.8 dừng ở hop 1, nslookup google.com: Server failed. Đã thử: khởi động lại máy, đổi cáp — không đổi. Cần: kiểm tra router/firewall/ISP. Liên hệ: Hùng 090x.', s: 2, w: 'Mức ưu tiên, phạm vi, thời điểm, bằng chứng kỹ thuật, việc đã thử, yêu cầu cụ thể, liên hệ — L2 không phải hỏi lại.' },
    { t: 'Mất mạng, nhờ L2 xem giúp.', s: 1, w: 'Quá ít thông tin; L2 sẽ phải hỏi lại và mất thời gian.' },
    { t: 'Không biết lỗi gì, chuyển L2.', s: 0, w: 'Không nêu triệu chứng, không bằng chứng — leo thang kém chuyên nghiệp.' }
  ]);
  cm('reply', 'Một nhân viên nước ngoài nhắn: “My laptop cannot connect to Wi-Fi.” Chọn câu trả lời tốt nhất bằng tiếng Anh.', [
    { t: '“Sorry to hear that. Could you tell me whether other devices can connect and what message you see? I’ll check and update you within 30 minutes.”', s: 2, w: 'Lịch sự, hỏi đúng thông tin cần thiết, cam kết thời gian phản hồi.' },
    { t: '“Wifi problem? Restart it.”', s: 1, w: 'Có gợi ý nhưng cộc lốc, thiếu đồng cảm và không thu thập thông tin.' },
    { t: '“Not my job. Ask other team.”', s: 0, w: 'Từ chối trách nhiệm — không chấp nhận trong dịch vụ khách hàng.' }
  ]);

  /* ---------- Email lừa đảo ---------- */
  // flags: sender link urgency creds attach generic money
  function ph(o) { P.phish.push(o); }
  ph({ name: 'Microsoft 365 Support', addr: 'no-reply@m1crosoft-support.com', subj: '[Hành động bắt buộc] Mật khẩu của bạn sẽ hết hạn trong 24 giờ', body: '<p>Kính gửi người dùng,</p><p>Mật khẩu email của bạn sẽ <b>hết hạn trong 24 giờ</b>. Nếu bạn không xác nhận, tài khoản sẽ bị <b>khoá vĩnh viễn</b> và toàn bộ dữ liệu sẽ bị xoá.</p><p>{L0}</p><p>Trân trọng,<br>Microsoft 365 Support Team</p>', links: [{ t: 'Giữ mật khẩu hiện tại', h: 'http://login.microsoftonline.com.verify-account-secure.xyz/session?id=8821' }], phish: true, flags: ['sender', 'link', 'urgency', 'creds', 'generic'], why: 'Domain gửi “m1crosoft” (số 1 thay chữ i). Link thực chất dẫn tới <i>verify-account-secure.xyz</i>, chỉ <u>chứa</u> “microsoftonline.com” ở đầu để đánh lừa. Doạ khoá tài khoản, chào chung chung, đòi đăng nhập.' });
  ph({ name: 'IT Helpdesk', addr: 'helpdesk@corp.example', subj: 'Bảo trì hệ thống email tối thứ Bảy 22:00–23:00', body: '<p>Chào các bạn,</p><p>Hệ thống email sẽ được bảo trì vào <b>tối thứ Bảy, 22:00–23:00</b>. Trong thời gian này, bạn có thể không gửi/nhận được mail. Không cần thực hiện thao tác gì.</p><p>Chi tiết xem trên cổng nội bộ: {L0}</p><p>IT Helpdesk – nội tuyến 1000</p>', links: [{ t: 'intranet.corp.example/it/maintenance', h: 'https://intranet.corp.example/it/maintenance' }], phish: false, flags: [], why: 'Gửi từ domain nội bộ đúng, thông tin cụ thể, <b>không yêu cầu hành động hay thông tin nhạy cảm</b>, liên kết trỏ đúng cổng nội bộ. (Nếu còn nghi ngờ vẫn có thể tự gõ địa chỉ intranet.)' });
  ph({ name: 'Nguyễn Văn Hùng – Giám đốc', addr: 'nguyenvanhung.ceo@gmail.com', subj: 'Việc gấp – chuyển khoản trước 15h', body: '<p>Chị làm giúp tôi một giao dịch chuyển khoản <b>250.000.000đ</b> cho đối tác mới <b>trước 15h chiều nay</b>. Tôi đang họp nên không nghe máy được. Thông tin tài khoản bên dưới.</p><p>NH: ACB – STK: 1234567890 – CTK: Cty TNHH Thanh Phát</p><p>Giữ kín giúp tôi, sẽ giải thích sau.<br>Hùng</p>', links: [], phish: true, flags: ['sender', 'urgency', 'money'], why: '<b>BEC / CEO fraud</b>: tên hiển thị là sếp nhưng địa chỉ là Gmail cá nhân. Ép thời hạn, “giữ kín”, không nghe máy được để tránh xác minh. Luôn xác minh bằng kênh khác (gọi số đã lưu) trước khi chuyển tiền.' });
  ph({ name: 'DHL Express', addr: 'tracking@dhl-delivery-notice.top', subj: 'Bưu kiện của bạn đang bị giữ – thiếu phí 15.000đ', body: '<p>Bạn có 1 bưu kiện đang chờ giao nhưng bị giữ vì <b>thiếu phí vận chuyển 15.000đ</b>.</p><p>Vui lòng thanh toán tại: {L0}</p><p>Nếu không thanh toán, bưu kiện sẽ bị hoàn.</p>', links: [{ t: 'Thanh toán phí ngay', h: 'https://bit.ly/3xYz-dhl-pay' }], phish: true, flags: ['sender', 'link', 'money', 'generic'], why: 'Tên miền <i>.top</i> không phải của DHL, link rút gọn che đích đến, đòi thanh toán nhỏ để lấy thông tin thẻ, không có tên người nhận hay mã vận đơn.' });
  ph({ name: 'Lê Hùng', addr: 'le.hung@corp.example', subj: 'Họp kế hoạch Q4 – Thứ Năm 10:00', body: '<p>Chào An,</p><p>Mình đặt lịch họp kế hoạch Q4 vào <b>thứ Năm 10:00–11:00</b>, phòng họp B (hoặc online). Chương trình đã đính kèm trong lời mời.</p><p>{L0}</p><p>Hùng</p>', links: [{ t: 'Tham gia cuộc họp Microsoft Teams', h: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_ZDk2NTc3' }], phish: false, flags: [], why: 'Người gửi nội bộ quen thuộc, nội dung khớp công việc, link đúng tên miền <i>teams.microsoft.com</i>, không đòi thông tin hay tạo áp lực.' });
  ph({ name: 'Kế toán Hoàng Gia Trading', addr: 'ketoan@hoanggia-trading.biz', subj: 'Hoá đơn tháng 10 – vui lòng thanh toán', body: '<p>Kính gửi quý khách,</p><p>Đính kèm là hoá đơn tháng 10. Vui lòng mở tệp để xem chi tiết và thanh toán sớm.</p><p>Trân trọng.</p>', links: [], att: 'HoaDon_T10.pdf.exe', phish: true, flags: ['attach', 'generic'], why: 'Tệp có <b>đuôi kép “.pdf.exe”</b> — thực chất là chương trình chạy được. Lời chào chung chung (“quý khách”), nhà cung cấp không quen. Không bao giờ mở tệp .exe/.scr/.js trong email.' });
  ph({ name: 'Phòng Nhân sự', addr: 'hr@corp.example', subj: 'Phiếu lương tháng 10 đã sẵn sàng', body: '<p>Xin chào Nguyễn An,</p><p>Phiếu lương tháng 10 của bạn đã được cập nhật. Vui lòng đăng nhập cổng nhân sự (bằng tài khoản công ty, có xác thực MFA) để xem: {L0}</p><p>Nếu cần hỗ trợ, liên hệ HR qua nội tuyến 2000.</p>', links: [{ t: 'hr.corp.example/payslip', h: 'https://hr.corp.example/payslip' }], phish: false, flags: [], why: 'Gọi đúng tên, tên miền nội bộ đúng, thông lệ hàng tháng, không đính kèm file, không đòi gửi mật khẩu qua mail.' });
  ph({ name: 'IT Helpdesk', addr: 'it-helpdesk@corp-example.com', subj: 'Cài đặt bản vá bảo mật bắt buộc trong hôm nay', body: '<p>Chào bạn,</p><p>Phát hiện lỗ hổng nghiêm trọng. <b>Tất cả nhân viên phải cài bản vá trong hôm nay</b>, nếu không tài khoản sẽ bị khoá vào 17h.</p><p>Tải bản vá tại: {L0}</p><p>IT Helpdesk</p>', links: [{ t: 'Tải bản vá bảo mật', h: 'http://corp-example.com/update/SecurityPatch.exe' }], phish: true, flags: ['sender', 'link', 'urgency'], why: 'Domain giả <i>corp-example.com</i> (gạch ngang) thay vì <i>corp.example</i>. Link tải file .exe từ ngoài, doạ khoá tài khoản. IT thật triển khai vá qua công cụ quản lý, không bắt tải file từ email.' });
  ph({ name: 'Phạm Thị Mai (Trưởng phòng)', addr: 'mai.pham.work@outlook.com', subj: 'Nhờ giúp gấp', body: '<p>Em có đang ở văn phòng không? Chị đang họp, cần <b>mua gấp 5 thẻ Google Play 500k</b> tặng khách. Em mua giúp chị rồi chụp ảnh mã thẻ gửi lại nhé, chị hoàn tiền sau. Đừng gọi điện, chị đang họp.</p>', links: [], phish: true, flags: ['sender', 'urgency', 'money'], why: '<b>Gift card scam</b>: mạo danh sếp bằng email ngoài công ty, nhờ mua thẻ quà tặng và gửi mã, không cho gọi xác minh. Luôn xác minh qua kênh khác.' });
  ph({ name: 'OneDrive', addr: 'sharepoint-noreply@onedrive-docs-share.ru', subj: 'Nguyễn Văn B đã chia sẻ tài liệu “Luong_2024.xlsx” với bạn', body: '<p>Nguyễn Văn B đã chia sẻ một tài liệu với bạn.</p><p>{L0}</p><p>Tài liệu sẽ hết hạn truy cập sau 48 giờ.</p>', links: [{ t: 'Mở tài liệu', h: 'https://onedrive.live.com.docs-share-view.ru/open?f=Luong_2024' }], phish: true, flags: ['sender', 'link'], why: 'Địa chỉ gửi đuôi <i>.ru</i> không phải của Microsoft; link thật dẫn tới <i>docs-share-view.ru</i> dù có chữ “onedrive.live.com” ở đầu. Mồi nhử “bảng lương” để nạn nhân tò mò và nhập tài khoản.' });

  /* ---------- Thẻ ghi nhớ ---------- */
  function deck(id, icon, title, cards) { P.decks.push({ id: id, icon: icon, title: title, cards: cards }); }
  deck('run', '⌨️', 'Lệnh Win+R & công cụ MMC', [
    ['ncpa.cpl', 'Network Connections — cấu hình card mạng'], ['services.msc', 'Services — bật/tắt/khởi động lại dịch vụ'], ['devmgmt.msc', 'Device Manager — driver và thiết bị'], ['diskmgmt.msc', 'Disk Management — phân vùng, ổ đĩa'],
    ['compmgmt.msc', 'Computer Management — gộp nhiều công cụ quản trị'], ['eventvwr.msc', 'Event Viewer — nhật ký hệ thống'], ['taskmgr', 'Task Manager — tiến trình, hiệu năng'], ['msinfo32', 'System Information — thông tin hệ thống chi tiết'],
    ['appwiz.cpl', 'Programs and Features — gỡ cài đặt phần mềm'], ['sysdm.cpl', 'System Properties — tên máy, domain, biến môi trường'], ['gpedit.msc', 'Local Group Policy Editor (bản Pro trở lên)'], ['secpol.msc', 'Local Security Policy'],
    ['lusrmgr.msc', 'Local Users and Groups'], ['regedit', 'Registry Editor — cẩn thận khi sửa'], ['mstsc', 'Remote Desktop Connection'], ['winver', 'Hiện phiên bản Windows đang dùng'],
    ['perfmon', 'Performance Monitor'], ['resmon', 'Resource Monitor — CPU/RAM/Disk/Network chi tiết'], ['dxdiag', 'DirectX Diagnostic — thông tin đồ hoạ, âm thanh'], ['cleanmgr', 'Disk Cleanup — dọn ổ đĩa'],
    ['firewall.cpl', 'Windows Defender Firewall'], ['wf.msc', 'Windows Firewall with Advanced Security'], ['taskschd.msc', 'Task Scheduler — tác vụ theo lịch'], ['certmgr.msc', 'Certificates (người dùng hiện tại)'],
    ['netplwiz', 'User Accounts — quản lý đăng nhập, thêm tài khoản'], ['msconfig', 'System Configuration — startup, boot'], ['%temp%', 'Mở thư mục tạm của người dùng (xoá rác)'], ['%appdata%', 'Thư mục dữ liệu ứng dụng (Roaming) của user'],
    ['shell:startup', 'Thư mục chương trình khởi động cùng user'], ['\\\\server\\share', 'Mở nhanh thư mục chia sẻ trên mạng'], ['control printers', 'Devices and Printers — quản lý máy in'], ['mmc', 'Microsoft Management Console trống — tự thêm snap-in']
  ]);
  deck('keys', '⚡', 'Phím tắt Windows cần biết', [
    ['Win + L', 'Khoá màn hình'], ['Win + D', 'Hiện/ẩn desktop'], ['Win + E', 'Mở File Explorer'], ['Win + R', 'Mở hộp thoại Run'], ['Win + X', 'Menu quản trị nhanh (Device Manager, Terminal…)'],
    ['Win + V', 'Lịch sử Clipboard'], ['Win + Shift + S', 'Chụp màn hình một vùng (Snipping)'], ['Ctrl + Shift + Esc', 'Mở Task Manager trực tiếp'], ['Ctrl + Alt + Del', 'Màn hình bảo mật: khoá, đổi mật khẩu, Task Manager'],
    ['Alt + Tab', 'Chuyển giữa cửa sổ'], ['Win + Tab', 'Task View và desktop ảo'], ['Win + P', 'Chọn chế độ chiếu màn hình (Duplicate/Extend)'], ['Win + I', 'Mở Settings'], ['Win + Ctrl + Shift + B', 'Khởi động lại driver card đồ hoạ (khi màn hình đen/lag)'],
    ['Shift + F10 (khi cài Windows)', 'Mở Command Prompt trong màn hình cài đặt'], ['Ctrl + Shift + Enter (trong ô tìm kiếm/Run)', 'Chạy chương trình với quyền Administrator'], ['F2 / Del lúc bật máy', 'Vào BIOS/UEFI (tuỳ hãng; Dell F2/F12, HP Esc/F10…)'], ['Win + Ctrl + D', 'Tạo desktop ảo mới'], ['Alt + F4', 'Đóng cửa sổ đang chọn (trên desktop: menu tắt máy)'], ['Ctrl + Shift + N (File Explorer)', 'Tạo thư mục mới']
  ]);
  deck('net', '🌐', 'Thuật ngữ mạng', [
    ['DHCP', 'Dịch vụ tự cấp IP, mask, gateway, DNS cho máy (UDP 67/68)'], ['DNS', 'Đổi tên miền thành địa chỉ IP (UDP/TCP 53)'], ['NAT', 'Chuyển đổi địa chỉ riêng ↔ công cộng để nhiều máy chung 1 IP ra Internet'], ['ARP', 'Tìm địa chỉ MAC ứng với một IP trong cùng mạng LAN'],
    ['Default gateway', 'Địa chỉ router mà máy gửi gói tin tới khi đích nằm ngoài mạng của mình'], ['Subnet mask', 'Cho biết phần mạng và phần host của địa chỉ IP (vd 255.255.255.0 = /24)'], ['APIPA 169.254.x.x', 'IP tự gán khi máy không xin được DHCP'], ['MAC address', 'Địa chỉ vật lý 48-bit gắn với card mạng'],
    ['VLAN', 'Chia một switch thành nhiều mạng logic tách biệt'], ['VPN', 'Đường hầm mã hoá để truy cập mạng công ty từ xa qua Internet'], ['Firewall', 'Lọc lưu lượng theo quy tắc (IP, cổng, ứng dụng)'], ['Proxy', 'Máy chủ trung gian giữa client và Internet (lọc, cache, kiểm soát)'],
    ['TCP', 'Giao thức hướng kết nối, tin cậy (web, mail, file)'], ['UDP', 'Giao thức không kết nối, nhanh, không đảm bảo (DNS, VoIP, video)'], ['ICMP', 'Giao thức dùng bởi ping và tracert để kiểm tra/ báo lỗi'], ['TTL', 'Số bước nhảy tối đa của gói tin; tracert dùng nó để dò đường'],
    ['Switch', 'Thiết bị nối các máy trong LAN, chuyển khung theo MAC (Lớp 2)'], ['Router', 'Nối các mạng khác nhau, chuyển gói theo IP (Lớp 3)'], ['Access Point', 'Thiết bị phát Wi-Fi nối vào mạng có dây'], ['SSID', 'Tên mạng Wi-Fi'],
    ['PoE', 'Cấp điện qua cáp mạng (camera IP, AP, điện thoại IP)'], ['Broadcast', 'Gói tin gửi tới tất cả máy trong cùng mạng (IP cuối của dải)'], ['Lớp 1 OSI', 'Physical — cáp, tín hiệu, bit'], ['Lớp 2 OSI', 'Data Link — MAC, switch, khung (frame)'],
    ['Lớp 3 OSI', 'Network — IP, router, gói (packet)'], ['Lớp 4 OSI', 'Transport — TCP/UDP, cổng, đoạn (segment)'], ['Lớp 7 OSI', 'Application — HTTP, DNS, SMTP…'], ['DMZ', 'Vùng mạng đệm đặt máy chủ công khai, tách khỏi mạng nội bộ']
  ]);
  deck('ad', '🏢', 'Active Directory & Microsoft 365', [
    ['Domain Controller (DC)', 'Máy chủ chạy AD, xác thực người dùng/máy trong domain'], ['OU (Organizational Unit)', 'Thư mục trong AD để nhóm đối tượng và áp GPO/uỷ quyền quản trị'], ['GPO', 'Group Policy Object — chính sách cấu hình áp cho user/máy hàng loạt'], ['SYSVOL', 'Thư mục chia sẻ trên DC chứa GPO và script đăng nhập'],
    ['Kerberos', 'Giao thức xác thực vé (ticket) của AD, cổng 88; nhạy cảm với lệch giờ > 5 phút'], ['LDAP', 'Giao thức truy vấn thư mục (389; 636 = LDAPS)'], ['Security Group', 'Nhóm dùng để cấp quyền truy cập tài nguyên'], ['Distribution Group', 'Nhóm chỉ dùng để gửi email, không cấp quyền'],
    ['AGDLP', 'Mô hình: Account → Global group → Domain Local group → Permission'], ['Trust relationship failed', 'Mật khẩu tài khoản máy lệch AD; sửa bằng Test-ComputerSecureChannel -Repair hoặc rejoin domain'], ['Event 4740', 'Tài khoản bị khoá — xem Caller Computer Name để tìm nguồn'], ['Unlock-ADAccount', 'Lệnh PowerShell mở khoá tài khoản AD'],
    ['Entra ID (Azure AD)', 'Dịch vụ danh tính đám mây của Microsoft cho M365/ứng dụng SaaS'], ['SSO', 'Đăng nhập một lần dùng cho nhiều ứng dụng'], ['MFA', 'Xác thực đa yếu tố: mật khẩu + yếu tố khác (app, SMS, khoá FIDO)'], ['Conditional Access', 'Chính sách “nếu… thì…” kiểm soát truy cập theo người dùng, thiết bị, vị trí, rủi ro'],
    ['Intune', 'Quản lý thiết bị di động/ máy tính (MDM/MAM) trên đám mây'], ['Autopilot', 'Triển khai máy mới tự động theo cấu hình công ty khi người dùng mở máy'], ['Hybrid join', 'Máy vừa join AD tại chỗ vừa đăng ký với Entra ID'], ['Entra Connect', 'Công cụ đồng bộ danh tính AD tại chỗ lên Entra ID'],
    ['Exchange Online', 'Dịch vụ email/lịch của M365'], ['OneDrive Known Folder Move', 'Tự đồng bộ Desktop/Documents/Pictures lên OneDrive — bảo vệ dữ liệu người dùng'], ['BitLocker', 'Mã hoá ổ đĩa của Windows; cần lưu recovery key an toàn'], ['LAPS', 'Tự đổi và lưu mật khẩu admin cục bộ duy nhất cho từng máy'], ['RBAC', 'Phân quyền theo vai trò thay vì từng người']
  ]);
  deck('itil', '🎫', 'ITIL & quy trình Helpdesk', [
    ['Incident', 'Sự cố làm gián đoạn hoặc giảm chất lượng dịch vụ — mục tiêu: khôi phục nhanh'], ['Service Request', 'Yêu cầu chuẩn (reset mật khẩu, cài phần mềm, máy mới) — không phải sự cố'], ['Problem', 'Nguyên nhân gốc của một hoặc nhiều sự cố — mục tiêu: loại bỏ gốc rễ'], ['Change', 'Thay đổi hạ tầng/dịch vụ có kiểm soát (đánh giá rủi ro, phê duyệt)'],
    ['SLA', 'Thoả thuận mức dịch vụ với khách hàng (thời gian phản hồi/xử lý)'], ['OLA', 'Thoả thuận nội bộ giữa các nhóm hỗ trợ để đáp ứng SLA'], ['Impact', 'Mức ảnh hưởng của sự cố tới nghiệp vụ/số người'], ['Urgency', 'Mức độ cần xử lý gấp theo thời gian'],
    ['Priority', 'Kết hợp Impact × Urgency (P1 cao nhất)'], ['Workaround', 'Giải pháp tạm để khôi phục dịch vụ khi chưa sửa được gốc'], ['Root Cause Analysis (RCA)', 'Phân tích tìm nguyên nhân gốc của sự cố/Problem'], ['KEDB', 'Known Error Database — lỗi đã biết kèm workaround'],
    ['CMDB', 'Cơ sở dữ liệu cấu hình: tài sản IT và quan hệ giữa chúng'], ['L1 / L2 / L3', 'Các tầng hỗ trợ: tiếp nhận & xử lý cơ bản → chuyên sâu → chuyên gia/ nhà cung cấp'], ['Functional escalation', 'Chuyển sự cố sang nhóm chuyên môn cao hơn'], ['Hierarchical escalation', 'Báo lên cấp quản lý khi sắp vi phạm SLA hoặc sự cố lớn'],
    ['Major incident', 'Sự cố nghiêm trọng, ảnh hưởng rộng, cần quy trình và nhóm xử lý riêng'], ['CAB', 'Change Advisory Board — hội đồng duyệt thay đổi'], ['Standard change', 'Thay đổi rủi ro thấp, lặp lại, đã được duyệt trước'], ['FCR', 'First Contact Resolution — tỷ lệ giải quyết ngay lần liên hệ đầu'],
    ['MTTR', 'Mean Time To Restore/Repair — thời gian trung bình khôi phục'], ['CSAT', 'Customer Satisfaction — điểm hài lòng của khách hàng'], ['Knowledge Base (KB)', 'Kho bài viết hướng dẫn xử lý để tái sử dụng và tự phục vụ'], ['6 bước xử lý sự cố', 'Xác định vấn đề → giả thuyết → kiểm chứng → kế hoạch → thực hiện/ xác nhận → ghi tài liệu']
  ]);
  deck('sec', '🛡️', 'Bảo mật căn bản', [
    ['Phishing', 'Lừa đảo qua email giả mạo để lấy thông tin hoặc cài mã độc'], ['Spear phishing', 'Phishing nhắm vào một cá nhân/ tổ chức cụ thể, nội dung cá nhân hoá'], ['Vishing / Smishing', 'Lừa đảo qua điện thoại / qua tin nhắn SMS'], ['BEC', 'Business Email Compromise — giả mạo sếp/đối tác để chuyển tiền'],
    ['Ransomware', 'Mã độc mã hoá dữ liệu rồi đòi tiền chuộc'], ['Social engineering', 'Thao túng tâm lý để lấy thông tin hoặc quyền truy cập'], ['Least privilege', 'Chỉ cấp quyền tối thiểu cần thiết cho công việc'], ['CIA triad', 'Confidentiality (bí mật), Integrity (toàn vẹn), Availability (sẵn sàng)'],
    ['Quy tắc 3-2-1', '3 bản sao dữ liệu, 2 loại phương tiện, 1 bản lưu ngoài địa điểm'], ['Brute force', 'Thử rất nhiều mật khẩu cho một tài khoản'], ['Password spraying', 'Thử vài mật khẩu phổ biến trên rất nhiều tài khoản để tránh khoá'], ['EDR', 'Endpoint Detection & Response — phát hiện/ phản ứng mối đe doạ trên thiết bị'],
    ['Zero Trust', 'Không mặc định tin ai/thiết bị nào; luôn xác minh mọi yêu cầu truy cập'], ['Patch management', 'Quy trình cập nhật bản vá đều đặn, ưu tiên lỗ hổng nghiêm trọng'], ['Yếu tố MFA', 'Biết (mật khẩu) · Có (điện thoại/khoá) · Là (sinh trắc học)'], ['Cô lập thiết bị nghi nhiễm', 'Ngắt mạng nhưng giữ máy bật để bảo toàn bằng chứng, rồi báo Security']
  ]);
  deck('linux', '🐧', 'Lệnh Linux cho helpdesk', [
    ['Xem dung lượng ổ đĩa dễ đọc', 'df -h'], ['Dung lượng một thư mục', 'du -sh /var/log'], ['Xem tiến trình đang chạy', 'ps aux'], ['Tìm chữ trong file', 'grep -i "error" file.log'],
    ['Theo dõi file log thời gian thực', 'tail -f /var/log/syslog'], ['Trạng thái một dịch vụ', 'systemctl status nginx'], ['Khởi động lại dịch vụ', 'sudo systemctl restart nginx'], ['Xem log của dịch vụ', 'journalctl -u sshd -n 50'],
    ['Xem địa chỉ IP', 'ip a'], ['Cổng đang lắng nghe', 'ss -tulpn'], ['Đặt quyền rw-r--r-- cho file', 'chmod 644 file'], ['Đổi chủ sở hữu file', 'chown user:group file'],
    ['Chạy lệnh với quyền root', 'sudo <lệnh>'], ['Cập nhật danh sách gói (Debian/Ubuntu)', 'sudo apt update'], ['Xem 10 dòng cuối file', 'tail -n 10 file'], ['Kiểm tra bộ nhớ RAM', 'free -h'],
    ['Xem thời gian chạy và tải hệ thống', 'uptime'], ['Xem user hiện tại và nhóm', 'id'], ['Kết nối SSH tới server', 'ssh user@host'], ['Kiểm tra HTTP header của web local', 'curl -I localhost']
  ]);

  /* ---------- Thử thách gõ lệnh ---------- */
  function cc(cat, q, ex) { P.cmds.push({ cat: cat, q: q, ex: ex, alt: [].slice.call(arguments, 3) }); }
  cc('Mạng', 'Xem đầy đủ IP, subnet mask, gateway, DNS, MAC của card mạng', 'ipconfig /all');
  cc('Mạng', 'Xin lại địa chỉ IP từ DHCP server', 'ipconfig /renew');
  cc('Mạng', 'Trả lại (giải phóng) địa chỉ IP hiện tại', 'ipconfig /release');
  cc('Mạng', 'Xoá bộ nhớ đệm DNS của máy', 'ipconfig /flushdns');
  cc('Mạng', 'Kiểm tra kết nối tới 8.8.8.8', 'ping 8.8.8.8');
  cc('Mạng', 'Ping liên tục (cho đến khi dừng) tới 192.168.1.1', 'ping -t 192.168.1.1');
  cc('Mạng', 'Xem đường đi các hop tới google.com', 'tracert google.com');
  cc('Mạng', 'Tra địa chỉ IP của tên miền microsoft.com', 'nslookup microsoft.com');
  cc('Mạng', 'Xem bảng ARP (IP ↔ MAC)', 'arp -a');
  cc('Mạng', 'Liệt kê mọi kết nối và cổng đang lắng nghe kèm PID', 'netstat -ano');
  cc('Mạng', 'Kiểm tra cổng TCP 445 của fileserver bằng PowerShell', 'Test-NetConnection fileserver -Port 445', 'tnc fileserver -port 445', 'Test-NetConnection -ComputerName fileserver -Port 445');
  cc('Mạng', 'Xem bảng định tuyến của máy', 'route print');
  cc('Mạng', 'Map ổ đĩa Z: tới \\\\fileserver\\data', 'net use Z: \\\\fileserver\\data');
  cc('Mạng', 'Xoá toàn bộ ổ đĩa mạng đang map', 'net use * /delete');
  cc('Windows', 'Xem thông tin hệ thống: tên máy, thời gian khởi động, RAM, domain', 'systeminfo');
  cc('Windows', 'Liệt kê các tiến trình đang chạy', 'tasklist');
  cc('Windows', 'Buộc kết thúc tiến trình có PID 1234', 'taskkill /pid 1234 /f');
  cc('Windows', 'Buộc kết thúc mọi tiến trình chrome.exe', 'taskkill /im chrome.exe /f');
  cc('Windows', 'Quét và sửa file hệ thống Windows bị hỏng', 'sfc /scannow');
  cc('Windows', 'Sửa chữa image Windows đang chạy (RestoreHealth)', 'DISM /Online /Cleanup-Image /RestoreHealth');
  cc('Windows', 'Kiểm tra và sửa lỗi ổ C: (chạy khi khởi động lại)', 'chkdsk C: /f');
  cc('Windows', 'Áp dụng Group Policy ngay lập tức', 'gpupdate /force');
  cc('Windows', 'Xem GPO đã áp dụng cho máy và user (tóm tắt)', 'gpresult /r');
  cc('Windows', 'Khởi động lại máy ngay lập tức', 'shutdown /r /t 0', 'shutdown -r -t 0');
  cc('Windows', 'Dừng dịch vụ Print Spooler', 'net stop spooler');
  cc('Windows', 'Khởi động dịch vụ Print Spooler', 'net start spooler');
  cc('Windows', 'Xem tên máy tính', 'hostname');
  cc('Windows', 'Xem các nhóm mà user hiện tại thuộc về', 'whoami /groups');
  cc('Hộp Run', 'Mở Services để quản lý dịch vụ', 'services.msc');
  cc('Hộp Run', 'Mở Device Manager', 'devmgmt.msc');
  cc('Hộp Run', 'Mở Network Connections (card mạng)', 'ncpa.cpl');
  cc('Hộp Run', 'Mở Event Viewer', 'eventvwr.msc', 'eventvwr');
  cc('Hộp Run', 'Mở Disk Management', 'diskmgmt.msc');
  cc('Hộp Run', 'Mở Remote Desktop Connection', 'mstsc');
  cc('PowerShell / AD', 'Mở khoá tài khoản AD của nguyen.an', 'Unlock-ADAccount nguyen.an', 'Unlock-ADAccount -Identity nguyen.an');
  cc('PowerShell / AD', 'Xem thông tin user nguyen.an kèm thuộc tính LockedOut', 'Get-ADUser nguyen.an -Properties LockedOut', 'Get-ADUser -Identity nguyen.an -Properties LockedOut');
  cc('PowerShell / AD', 'Liệt kê các tài khoản AD đang bị khoá', 'Search-ADAccount -LockedOut');
  cc('PowerShell / AD', 'Lấy 5 tiến trình dùng CPU nhiều nhất', 'Get-Process | Sort-Object CPU -Descending | Select-Object -First 5', 'Get-Process | sort cpu -descending | select -first 5', 'Get-Process | Sort-Object CPU -Descending | Select -First 5', 'Get-Process | sort cpu -desc | select -first 5');
  cc('PowerShell / AD', 'Khởi động lại dịch vụ spooler bằng PowerShell', 'Restart-Service spooler');
  cc('PowerShell / AD', 'Liệt kê các bản cập nhật (hotfix) đã cài', 'Get-HotFix');
  cc('PowerShell / AD', 'Sửa quan hệ tin cậy của máy với domain (secure channel)', 'Test-ComputerSecureChannel -Repair');
  cc('Linux', 'Xem dung lượng các phân vùng ở dạng dễ đọc', 'df -h');
  cc('Linux', 'Xem tổng dung lượng thư mục /var/log', 'du -sh /var/log');
  cc('Linux', 'Kiểm tra trạng thái dịch vụ nginx', 'systemctl status nginx');
  cc('Linux', 'Khởi động lại dịch vụ nginx với quyền root', 'sudo systemctl restart nginx');
  cc('Linux', 'Xem 50 dòng log gần nhất của dịch vụ sshd', 'journalctl -u sshd -n 50');
  cc('Linux', 'Theo dõi file /var/log/syslog theo thời gian thực', 'tail -f /var/log/syslog');
  cc('Linux', 'Đặt quyền 644 cho file a.txt', 'chmod 644 a.txt');
  cc('Linux', 'Đổi chủ sở hữu file a.txt thành www-data', 'chown www-data a.txt', 'chown www-data: a.txt');
  cc('Linux', 'Xem địa chỉ IP của máy Linux', 'ip a', 'ip addr', 'ip address');
  cc('Linux', 'Liệt kê các cổng TCP/UDP đang lắng nghe kèm tiến trình', 'ss -tulpn', 'netstat -tulpn');
  cc('Linux', 'Tìm chuỗi “error” trong /var/log/syslog', 'grep error /var/log/syslog', 'grep "error" /var/log/syslog');
  cc('Linux', 'Cập nhật danh sách gói trên Ubuntu', 'sudo apt update');
})();
