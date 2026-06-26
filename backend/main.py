from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

habits = []
id_counter = 1

class Habit(BaseModel):
    name: str

@app.get("/habits")
def get_habits():
    return habits

@app.post("/habits")
def add_habit(habit: Habit):
    global id_counter
    new_habit = {
        "id": id_counter,
        "name": habit.name,
        "completed": False
    }
    habits.append(new_habit)
    id_counter += 1
    return new_habit

@app.put("/habits/{habit_id}")
def toggle_habit(habit_id: int):
    for h in habits:
        if h["id"] == habit_id:
            h["completed"] = not h["completed"]
            return h
    return {"error": "not found"}

@app.delete("/habits/{habit_id}")
def delete_habit(habit_id: int):
    global habits
    habits = [h for h in habits if h["id"] != habit_id]
    return {"status": "deleted"}