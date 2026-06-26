from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import date

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
        "completed": False,
        "streak": 0,
        "lastCompleted": None
    }

    habits.append(new_habit)
    id_counter += 1

    return new_habit


@app.put("/habits/{habit_id}")
def toggle_habit(habit_id: int):
    today = str(date.today())

    for habit in habits:
        if habit["id"] == habit_id:

            # If marking complete
            if not habit["completed"]:
                if habit["lastCompleted"] == today:
                    pass
                else:
                    habit["streak"] += 1
                    habit["lastCompleted"] = today

                habit["completed"] = True

            else:
                # unchecking does NOT reduce streak (simple version)
                habit["completed"] = False

            return habit

    return {"error": "not found"}


@app.delete("/habits/{habit_id}")
def delete_habit(habit_id: int):
    global habits
    habits = [h for h in habits if h["id"] != habit_id]
    return {"status": "deleted"}