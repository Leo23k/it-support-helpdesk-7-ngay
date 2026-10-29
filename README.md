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
- 6 dự án làm CV, 65 câu hỏi phỏng vấn, cheatsheet lệnh, máy tính subnet, terminal mô phỏng

Tiến độ học được lưu trong localStorage của trình duyệt.

## Cấu trúc

```
index.html        khung trang
assets/style.css  giao diện (sáng/tối, responsive)
assets/app.js     router, quiz, tiến độ, công cụ
data/dayN.js      nội dung từng ngày (HTML trong template literal)
data/projects.js  dự án CV
data/interview.js câu hỏi phỏng vấn
data/cheats.js    cheatsheet và bảng cổng
```

Sửa/thêm nội dung: chỉnh các file trong `data/`. Cẩn thận ký tự backtick và `${` trong template literal.
