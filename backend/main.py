from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
from pathlib import Path

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_FILE = Path("habit_tracker.db")


def get_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS habits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            goal TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS habit_entries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            habit_id INTEGER NOT NULL,
            date TEXT NOT NULL,
            value REAL NOT NULL,
            UNIQUE(habit_id, date),
            FOREIGN KEY(habit_id) REFERENCES habits(id) ON DELETE CASCADE
        )
    """)

    cursor.execute("SELECT COUNT(*) AS count FROM habits")
    count = cursor.fetchone()["count"]

    if count == 0:
        cursor.execute(
            "INSERT INTO habits (name, goal) VALUES (?, ?)",
            ("Exercise", "Run 3 miles every day")
        )
        cursor.execute(
            "INSERT INTO habits (name, goal) VALUES (?, ?)",
            ("Reading", "Read 30 minutes")
        )

    conn.commit()
    conn.close()


init_db()


class HabitCreate(BaseModel):
    name: str
    goal: str = "No goal set"


class HabitUpdate(BaseModel):
    name: str | None = None
    goal: str | None = None


class EntryUpdate(BaseModel):
    value: float


def get_entries_for_habit(cursor, habit_id):
    cursor.execute(
        "SELECT date, value FROM habit_entries WHERE habit_id = ?",
        (habit_id,)
    )

    rows = cursor.fetchall()

    return {
        row["date"]: row["value"]
        for row in rows
    }


@app.get("/")
def home():
    return {"message": "Habit Tracker API with SQLite is working"}


@app.get("/habits")
def get_habits():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM habits ORDER BY id")
    habits = cursor.fetchall()

    result = []

    for habit in habits:
        result.append({
            "id": habit["id"],
            "name": habit["name"],
            "goal": habit["goal"],
            "entries": get_entries_for_habit(cursor, habit["id"])
        })

    conn.close()
    return result


@app.post("/habits")
def create_habit(habit: HabitCreate):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO habits (name, goal) VALUES (?, ?)",
        (habit.name, habit.goal)
    )

    habit_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return {
        "id": habit_id,
        "name": habit.name,
        "goal": habit.goal,
        "entries": {}
    }


@app.put("/habits/{habit_id}")
def update_habit(habit_id: int, updates: HabitUpdate):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM habits WHERE id = ?", (habit_id,))
    habit = cursor.fetchone()

    if not habit:
        conn.close()
        raise HTTPException(status_code=404, detail="Habit not found")

    new_name = updates.name if updates.name is not None else habit["name"]
    new_goal = updates.goal if updates.goal is not None else habit["goal"]

    cursor.execute(
        "UPDATE habits SET name = ?, goal = ? WHERE id = ?",
        (new_name, new_goal, habit_id)
    )

    conn.commit()

    entries = get_entries_for_habit(cursor, habit_id)
    conn.close()

    return {
        "id": habit_id,
        "name": new_name,
        "goal": new_goal,
        "entries": entries
    }


@app.delete("/habits/{habit_id}")
def delete_habit(habit_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM habits WHERE id = ?", (habit_id,))
    habit = cursor.fetchone()

    if not habit:
        conn.close()
        raise HTTPException(status_code=404, detail="Habit not found")

    cursor.execute("DELETE FROM habit_entries WHERE habit_id = ?", (habit_id,))
    cursor.execute("DELETE FROM habits WHERE id = ?", (habit_id,))

    conn.commit()
    conn.close()

    return {"message": "Habit deleted"}


@app.put("/habits/{habit_id}/entries/{date}")
def update_entry(habit_id: int, date: str, entry: EntryUpdate):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM habits WHERE id = ?", (habit_id,))
    habit = cursor.fetchone()

    if not habit:
        conn.close()
        raise HTTPException(status_code=404, detail="Habit not found")

    cursor.execute("""
        INSERT INTO habit_entries (habit_id, date, value)
        VALUES (?, ?, ?)
        ON CONFLICT(habit_id, date)
        DO UPDATE SET value = excluded.value
    """, (habit_id, date, entry.value))

    conn.commit()

    entries = get_entries_for_habit(cursor, habit_id)
    conn.close()

    return {
        "id": habit_id,
        "name": habit["name"],
        "goal": habit["goal"],
        "entries": entries
    }