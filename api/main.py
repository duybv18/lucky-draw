from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Cấu hình CORS để cho phép frontend gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Trong production nên chỉ định domain cụ thể
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Biến lưu số mong muốn cho lượt tiếp theo
next_number = None

@app.get("/")
async def root():
    return {"message": "YEP Lucky Draw API Server"}

@app.get("/api/cheat")
async def get_cheat():
    """
    API trả về số cho lượt quay tiếp theo.
    Nếu có số được set, trả về số đó và reset về None.
    Nếu không có, trả về object rỗng (random).
    """
    global next_number
    if next_number and 1 <= next_number <= 80:
        result = {"number": next_number}
        next_number = None  # Reset sau khi trả về
        return result
    return {}

@app.post("/api/set-number/{num}")
async def set_number(num: int):
    """
    API để set số cho lượt quay tiếp theo.
    Ví dụ: POST http://127.0.0.1:8000/api/set-number/42
    """
    global next_number
    if 1 <= num <= 80:
        next_number = num
        return {"status": "ok", "message": f"Next spin will be {num}", "number": num}
    return {"status": "error", "message": "Number must be between 1-80"}

@app.get("/api/status")
async def get_status():
    """
    Kiểm tra số hiện tại được set cho lượt tiếp theo
    """
    global next_number
    if next_number:
        return {"next_number": next_number}
    return {"next_number": None, "message": "No number set, will be random"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
