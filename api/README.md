# YEP Lucky Draw - Backend API

Backend API để điều khiển kết quả vòng quay.

## Cài đặt

```bash
pip install fastapi uvicorn
```

## Chạy Server

```bash
# Từ thư mục api/
python main.py

# Hoặc
uvicorn main:app --reload --port 8000
```

Server sẽ chạy tại: http://127.0.0.1:8000

## API Endpoints

### 1. GET /api/cheat
Lấy số cho lượt quay tiếp theo.

**Response:**
```json
{
  "number": 42
}
```

Hoặc `{}` nếu không có số được set (sẽ random).

### 2. POST /api/set-number/{num}
Set số cho lượt quay tiếp theo.

**Example:**
```bash
curl -X POST http://127.0.0.1:8000/api/set-number/42
```

**Response:**
```json
{
  "status": "ok",
  "message": "Next spin will be 42",
  "number": 42
}
```

### 3. GET /api/status
Kiểm tra số hiện tại được set.

**Response:**
```json
{
  "next_number": 42
}
```

## Sử dụng

1. Chạy backend API
2. Chạy frontend Lucky Draw
3. Để can thiệp kết quả:
   - Call POST `/api/set-number/42` để set số 42 cho lượt tiếp theo
   - Lượt quay hiện tại kết thúc, app sẽ tự gọi GET `/api/cheat`
   - Lượt quay tiếp theo sẽ ra số 42

## Lưu ý

- API chỉ ảnh hưởng đến **lượt quay tiếp theo**, không can thiệp lượt đang quay
- Sau khi trả số, API tự động reset về None (random)
- Nếu API không chạy, frontend vẫn hoạt động bình thường (random)
