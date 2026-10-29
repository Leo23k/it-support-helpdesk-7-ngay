# IT Support Fresher trong 7 ngày

Trang web tĩnh (không cần build, không cần Internet) để học IT Support / Helpdesk đạt trình độ fresher.

## Chạy

Cách đơn giản nhất: mở `index.html` bằng trình duyệt (Chrome/Edge).
Hoặc chạy server cục bộ:

```bash
python -m http.server 5173
```

rồi mở http://localhost:5173

## Nội dung

- 7 ngày học: phần cứng và quy trình xử lý sự cố, Windows và PowerShell, mạng, Active Directory và Entra ID, Microsoft 365 và thiết bị, bảo mật/Linux/cloud/ITIL, CV và phỏng vấn
- Mỗi ngày có bài học, lab, quiz và tình huống thực tế
- 6 dự án làm CV, 65 câu hỏi phỏng vấn, cheatsheet lệnh
- **12 công cụ luyện tập** (trang Công cụ): subnet/VLSM, luyện nhị phân, terminal giả lập 14 tình huống ticket thật (mạng, Windows, AD, máy in, Linux), AD Users mô phỏng 10 bài, tra mã lỗi/Event ID, 10 cây chẩn đoán, máy tính chmod/RAID, phân loại ticket + SLA, giao tiếp với user, nhận diện phishing, thẻ ghi nhớ, thử thách gõ lệnh

- Ghi chú theo từng ngày (nhiều ghi chú, sửa/xoá được), trang tổng hợp ghi chú và xuất ra Markdown
- Chuỗi ngày học liên tiếp, cảnh báo khi mất chuỗi, nhắc ôn tập sau 1/3/7/14 ngày

Tiến độ, ghi chú, chuỗi học được lưu trong localStorage của trình duyệt (không gửi đi đâu). Dùng nút "Tải file .md" ở trang Ghi chú để sao lưu.

## Cấu trúc

```
index.html        khung trang
assets/style.css  giao diện (sáng/tối, responsive)
assets/app.js     router, quiz, tiến độ, ghi chú
assets/tools-*.js  công cụ luyện tập (core = hub/khung, net, terminal, sys, work)
assets/tools.css  giao diện trang công cụ
data/dayN.js      nội dung từng ngày (HTML trong template literal)
data/projects.js  dự án CV
data/interview.js câu hỏi phỏng vấn
data/cheats.js    cheatsheet và bảng cổng
data/term-scenarios.js  kịch bản terminal giả lập (máy “hỏng” có trạng thái)
data/tools-ref.js       mã lỗi/Event ID và cây chẩn đoán
data/tools-practice.js  ticket, giao tiếp, phishing, thẻ ghi nhớ, gõ lệnh
```

Sửa/thêm nội dung: chỉnh các file trong `data/`. Cẩn thận ký tự backtick và `${` trong template literal.
