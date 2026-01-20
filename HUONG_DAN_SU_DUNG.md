# 🎉 HƯỚNG DẪN SỬ DỤNG YEP LUCKY DRAW

## 📦 Chuẩn bị

### Frontend (Lucky Draw App)
```bash
cd lucky-draw
npm install
```

### Backend API (Tùy chọn - để can thiệp kết quả)
```bash
cd lucky-draw/api
pip install -r requirements.txt
```

---

## 🚀 Chạy Ứng dụng

### Cách 1: Chỉ Frontend (Random hoàn toàn)
```bash
cd lucky-draw
npm run dev
```

Mở trình duyệt: http://localhost:5173

### Cách 2: Frontend + Backend (Có thể can thiệp)

**Terminal 1 - Backend:**
```bash
cd lucky-draw/api
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd lucky-draw
npm run dev
```

Mở trình duyệt: http://localhost:5173

---

## 🎮 Hướng dẫn MC sử dụng

### Phím tắt
- **Space** (Phím cách): Bắt đầu / Dừng quay
- **R**: Reset về ban đầu
- **M**: Bật/Tắt âm thanh

### Quy trình quay số

1. **Bắt đầu:**
   - Bấm **Space** hoặc nút **"BẮT ĐẦU QUAY"**
   - Trụ quay sẽ tăng tốc và quay liên tục
   - Các số chạy nhanh qua kim chỉ bên phải

2. **Dừng quay:**
   - Bấm **Space** lần nữa hoặc nút **"DỪNG"**
   - Trụ giảm tốc mượt mà
   - Dừng chính xác tại 1 số

3. **Công bố kết quả:**
   - Confetti bắn từ 2 bên
   - Icon vỗ tay xuất hiện
   - Âm thanh vang lên
   - Số trúng thưởng hiển thị lớn giữa màn hình

4. **Tiếp tục:**
   - Bấm **Space** để quay lượt tiếp theo
   - Hoặc bấm **R** để reset

---

## 🎯 Can thiệp kết quả (Chỉ dành cho BTC)

### Cách 1: Dùng API (Khuyến nghị)

Sau khi backend đang chạy:

```bash
# Set số 42 cho lượt quay TIẾP THEO
curl -X POST http://127.0.0.1:8000/api/set-number/42

# Kiểm tra số đã set
curl http://127.0.0.1:8000/api/status
```

### Cách 2: Dùng trình duyệt

Mở tab mới, paste vào thanh địa chỉ:
```
http://127.0.0.1:8000/api/set-number/42
```

### ⚠️ Lưu ý QUAN TRỌNG

- **KHÔNG can thiệp lượt đang quay**
- Chỉ set số **TRƯỚC KHI** bắt đầu lượt mới
- Số phải từ **1 đến 80**
- Mỗi số chỉ dùng 1 lần, sau đó reset về random

### Quy trình can thiệp

```
1. Lượt hiện tại kết thúc (random)
2. Set số cho lượt sau: POST /api/set-number/42
3. MC bấm Space để quay lượt mới
4. Kết quả sẽ ra số 42
5. Lượt tiếp theo lại random (trừ khi set lại)
```

---

## 🎨 Hiển thị trên màn hình LED

### Chuẩn bị
- Mở trình duyệt **Fullscreen** (F11)
- Kết nối máy tính với màn LED
- Chỉnh độ phân giải phù hợp
- Test âm thanh trước

### Tips
- Dùng Chrome hoặc Edge cho hiệu suất tốt nhất
- Tắt các tab khác để tránh lag
- Kiểm tra âm thanh trước khi bắt đầu
- Có thể bấm M để tắt âm thanh nếu cần

---

## 🔧 Troubleshooting

### Ứng dụng không chạy
```bash
# Xóa node_modules và cài lại
cd lucky-draw
rm -rf node_modules
npm install
npm run dev
```

### API không hoạt động
- Frontend vẫn chạy bình thường (random)
- Kiểm tra backend có đang chạy không
- Kiểm tra port 8000 có bị chiếm không

### Trụ quay bị giật
- Đóng các ứng dụng khác đang chạy
- Dùng trình duyệt Chrome/Edge
- Kiểm tra CPU/RAM

### Âm thanh không có
- Bấm M để kiểm tra đã unmute chưa
- Kiểm tra loa/volume hệ thống
- Refresh trang và cho phép autoplay

---

## 📋 Checklist trước sự kiện

- [ ] Test frontend chạy mượt
- [ ] Test phím tắt Space, R, M
- [ ] Test âm thanh
- [ ] Test confetti effect
- [ ] Test kết nối màn LED
- [ ] Test fullscreen (F11)
- [ ] (Optional) Test backend API
- [ ] (Optional) Test can thiệp kết quả
- [ ] Chuẩn bị danh sách 80 số (1-80)

---

## 📞 Hỗ trợ

Nếu gặp vấn đề trong sự kiện:
1. Refresh trang (F5)
2. Bấm R để reset
3. Khởi động lại trình duyệt
4. Chạy lại `npm run dev`

---

🎉 **Chúc Year End Party thành công rực rỡ!**
