# YEP Lucky Draw - Vòng Quay May Mắn

Ứng dụng Lucky Draw dạng gameshow cho sự kiện Year End Party.

## 🎯 Tính năng

- ✨ **Vòng quay dọc (Vertical Wheel)** kiểu gameshow với 80 số
- 🎉 **Hiệu ứng đặc biệt**: Confetti, icon vỗ tay, âm thanh khi trúng
- 🎮 **Phím tắt**: Space (Start/Stop), R (Reset), M (Mute/Unmute)
- 🎲 **Cơ chế can thiệp**: Tích hợp API để điều khiển kết quả lượt tiếp theo
- 🎨 **Thiết kế sân khấu**: Màu sắc rực rỡ, hiệu ứng kim loại, ánh sáng bulb

## 🚀 Cài đặt & Chạy

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build
```

## 🎮 Cách sử dụng

### Phím tắt
- **Space**: Bắt đầu quay / Dừng quay
- **R**: Reset về trạng thái ban đầu
- **M**: Bật/Tắt âm thanh

### Quy trình quay
1. Bấm **BẮT ĐẦU QUAY** hoặc phím **Space**
2. Trụ quay tăng tốc và quay liên tục
3. Bấm **DỪNG** hoặc phím **Space** lần nữa
4. Trụ giảm tốc mượt mà và dừng chính xác tại 1 số
5. Hiệu ứng confetti + icon vỗ tay + âm thanh xuất hiện
6. Số trúng thưởng hiển thị phóng to ở giữa màn hình

## 🔧 Cơ chế Can thiệp (Cheat API)

Ứng dụng hỗ trợ can thiệp kết quả qua API:

### Endpoint
```
GET http://127.0.0.1:8000/api/cheat
```

### Response mẫu
```json
{
  "number": 42
}
```

### Cách hoạt động
1. **Sau mỗi lượt quay kết thúc**, ứng dụng tự động gọi API
2. Nếu API trả về số hợp lệ (1-80), số đó sẽ được dùng cho **lượt quay tiếp theo**
3. Nếu API không phản hồi hoặc trả rỗng, lượt sau sẽ random bình thường
4. **Không can thiệp lượt đang quay** - chỉ áp dụng cho lượt tiếp theo

### Ví dụ Backend API (Python FastAPI)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Số mong muốn cho lượt tiếp theo (có thể thay đổi)
next_number = None

@app.get("/api/cheat")
async def get_cheat():
    global next_number
    if next_number and 1 <= next_number <= 80:
        result = {"number": next_number}
        next_number = None  # Reset sau khi trả
        return result
    return {}

@app.post("/api/set-number/{num}")
async def set_number(num: int):
    global next_number
    if 1 <= num <= 80:
        next_number = num
        return {"status": "ok", "number": num}
    return {"status": "error", "message": "Number must be between 1-80"}
```

Chạy API:
```bash
pip install fastapi uvicorn
uvicorn main:app --reload --port 8000
```

## 🎨 Cấu hình

Có thể chỉnh sửa trong [LuckyDraw.jsx](src/components/LuckyDraw.jsx):

```javascript
const TOTAL_NUMBERS = 80;      // Số lượng ô
const CELL_HEIGHT = 120;        // Chiều cao mỗi ô
const VISIBLE_CELLS = 5;        // Số ô hiển thị cùng lúc
```

## 🛠 Công nghệ sử dụng

- **React 18** - UI Framework
- **Vite** - Build tool
- **GSAP** - Animation library (tăng/giảm tốc mượt)
- **canvas-confetti** - Hiệu ứng pháo hoa

## 📋 Tiêu chí nghiệm thu

- ✅ Vòng quay đúng kiểu Vertical Wheel
- ✅ Kim chỉ chính xác vào giữa ô số
- ✅ Hiệu ứng trúng thưởng đầy đủ (Confetti + Icon + Âm thanh)
- ✅ Không giật/lag khi quay liên tục
- ✅ Phím tắt hoạt động tốt
- ✅ Tích hợp API can thiệp kết quả
- ✅ Hiển thị fullscreen, phù hợp màn hình LED lớn

## 📝 Ghi chú

- Hệ thống thiết kế như **công cụ sân khấu**, ưu tiên mượt – chắc – chủ động
- Không phụ thuộc network, API chết vẫn chạy bình thường
- Random mặc định, chỉ can thiệp khi cần

---

🎉 **Chúc Year End Party thành công!**

