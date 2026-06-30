from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from passlib.context import CryptContext
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

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(password: str, hashed_password: str):
    return pwd_context.verify(password, hashed_password)


def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS journals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS habits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            journal_id INTEGER,
            name TEXT NOT NULL,
            goal TEXT NOT NULL,
            FOREIGN KEY(journal_id) REFERENCES journals(id) ON DELETE CASCADE
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

    cursor.execute("PRAGMA table_info(habits)")
    columns = [column["name"] for column in cursor.fetchall()]

    if "journal_id" not in columns:
        cursor.execute("ALTER TABLE habits ADD COLUMN journal_id INTEGER")

    cursor.execute("SELECT COUNT(*) AS count FROM users")
    user_count = cursor.fetchone()["count"]

    if user_count == 0:
        cursor.execute(
            "INSERT INTO users (username, password_hash) VALUES (?, ?)",
            ("demo", hash_password("demo123"))
        )

        demo_user_id = cursor.lastrowid

        cursor.execute(
            "INSERT INTO journals (user_id, name) VALUES (?, ?)",
            (demo_user_id, "Main Journal")
        )

        demo_journal_id = cursor.lastrowid

        cursor.execute(
            "INSERT INTO habits (journal_id, name, goal) VALUES (?, ?, ?)",
            (demo_journal_id, "Exercise", "Run 3 miles every day")
        )

        cursor.execute(
            "INSERT INTO habits (journal_id, name, goal) VALUES (?, ?, ?)",
            (demo_journal_id, "Reading", "Read 30 minutes")
        )

    cursor.execute("SELECT id FROM journals ORDER BY id LIMIT 1")
    first_journal = cursor.fetchone()

    if first_journal:
        cursor.execute(
            "UPDATE habits SET journal_id = ? WHERE journal_id IS NULL",
            (first_journal["id"],)
        )

    conn.commit()
    conn.close()


init_db()


class UserCreate(BaseModel):
    username: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class JournalCreate(BaseModel):
    user_id: int
    name: str


class HabitCreate(BaseModel):
    name: str
    goal: str = "No goal set"
    journal_id: int | None = None


class HabitUpdate(BaseModel):
    name: str | None = None
    goal: str | None = None


class EntryUpdate(BaseModel):
    value: float

class UsernameUpdate(BaseModel):
    username: str


class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str


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


def format_habit(cursor, habit):
    return {
        "id": habit["id"],
        "journal_id": habit["journal_id"],
        "name": habit["name"],
        "goal": habit["goal"],
        "entries": get_entries_for_habit(cursor, habit["id"])
    }


@app.get("/")
def home():
    return {"message": "Habit Tracker API with users and journals is working"}


@app.post("/auth/register")
def register_user(user: UserCreate):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE username = ?",
        (user.username,)
    )

    existing_user = cursor.fetchone()

    if existing_user:
        conn.close()
        raise HTTPException(status_code=400, detail="Username already exists")

    cursor.execute(
        "INSERT INTO users (username, password_hash) VALUES (?, ?)",
        (user.username, hash_password(user.password))
    )

    user_id = cursor.lastrowid

    cursor.execute(
        "INSERT INTO journals (user_id, name) VALUES (?, ?)",
        (user_id, "Main Journal")
    )

    journal_id = cursor.lastrowid

    conn.commit()
    conn.close()

    return {
        "id": user_id,
        "username": user.username,
        "default_journal_id": journal_id
    }


@app.post("/auth/login")
def login_user(user: UserLogin):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE username = ?",
        (user.username,)
    )

    existing_user = cursor.fetchone()

    if not existing_user:
        conn.close()
        raise HTTPException(status_code=401, detail="Invalid username or password")

    if not verify_password(user.password, existing_user["password_hash"]):
        conn.close()
        raise HTTPException(status_code=401, detail="Invalid username or password")

    conn.close()

    return {
        "id": existing_user["id"],
        "username": existing_user["username"]
    }

@app.put("/users/{user_id}/username")
def update_username(user_id: int, updates: UsernameUpdate):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()

    if not user:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")

    cursor.execute(
        "SELECT * FROM users WHERE username = ? AND id != ?",
        (updates.username, user_id)
    )

    existing_user = cursor.fetchone()

    if existing_user:
        conn.close()
        raise HTTPException(status_code=400, detail="Username already exists")

    cursor.execute(
        "UPDATE users SET username = ? WHERE id = ?",
        (updates.username, user_id)
    )

    conn.commit()
    conn.close()

    return {
        "id": user_id,
        "username": updates.username
    }


@app.put("/users/{user_id}/password")
def update_password(user_id: int, updates: PasswordUpdate):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()

    if not user:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(updates.current_password, user["password_hash"]):
        conn.close()
        raise HTTPException(status_code=401, detail="Current password is incorrect")

    cursor.execute(
        "UPDATE users SET password_hash = ? WHERE id = ?",
        (hash_password(updates.new_password), user_id)
    )

    conn.commit()
    conn.close()

    return {
        "message": "Password updated successfully"
    }

@app.get("/users/{user_id}/journals")
def get_journals(user_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM journals WHERE user_id = ? ORDER BY id",
        (user_id,)
    )

    journals = cursor.fetchall()
    conn.close()

    return [
        {
            "id": journal["id"],
            "user_id": journal["user_id"],
            "name": journal["name"]
        }
        for journal in journals
    ]


@app.post("/journals")
def create_journal(journal: JournalCreate):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE id = ?",
        (journal.user_id,)
    )

    user = cursor.fetchone()

    if not user:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")

    cursor.execute(
        "INSERT INTO journals (user_id, name) VALUES (?, ?)",
        (journal.user_id, journal.name)
    )

    journal_id = cursor.lastrowid

    conn.commit()
    conn.close()

    return {
        "id": journal_id,
        "user_id": journal.user_id,
        "name": journal.name
    }


@app.get("/journals/{journal_id}/habits")
def get_habits_for_journal(journal_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM journals WHERE id = ?",
        (journal_id,)
    )

    journal = cursor.fetchone()

    if not journal:
        conn.close()
        raise HTTPException(status_code=404, detail="Journal not found")

    cursor.execute(
        "SELECT * FROM habits WHERE journal_id = ? ORDER BY id",
        (journal_id,)
    )

    habits = cursor.fetchall()

    result = [format_habit(cursor, habit) for habit in habits]

    conn.close()
    return result

@app.delete("/journals/{journal_id}")
def delete_journal(journal_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM journals WHERE id = ?", (journal_id,))
    journal = cursor.fetchone()

    if not journal:
        conn.close()
        raise HTTPException(status_code=404, detail="Journal not found")

    cursor.execute(
        "SELECT COUNT(*) AS count FROM journals WHERE user_id = ?",
        (journal["user_id"],)
    )

    journal_count = cursor.fetchone()["count"]

    if journal_count <= 1:
        conn.close()
        raise HTTPException(
            status_code=400,
            detail="You must have at least one journal"
        )

    cursor.execute(
        "SELECT id FROM habits WHERE journal_id = ?",
        (journal_id,)
    )

    habits = cursor.fetchall()

    for habit in habits:
        cursor.execute(
            "DELETE FROM habit_entries WHERE habit_id = ?",
            (habit["id"],)
        )

    cursor.execute("DELETE FROM habits WHERE journal_id = ?", (journal_id,))
    cursor.execute("DELETE FROM journals WHERE id = ?", (journal_id,))

    conn.commit()
    conn.close()

    return {"message": "Journal deleted"}

@app.get("/habits")
def get_habits():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM habits ORDER BY id")
    habits = cursor.fetchall()

    result = [format_habit(cursor, habit) for habit in habits]

    conn.close()
    return result


@app.post("/habits")
def create_habit(habit: HabitCreate):
    conn = get_connection()
    cursor = conn.cursor()

    journal_id = habit.journal_id

    if journal_id is None:
        cursor.execute("SELECT id FROM journals ORDER BY id LIMIT 1")
        journal = cursor.fetchone()

        if not journal:
            conn.close()
            raise HTTPException(status_code=400, detail="No journal exists")

        journal_id = journal["id"]

    cursor.execute(
        "INSERT INTO habits (journal_id, name, goal) VALUES (?, ?, ?)",
        (journal_id, habit.name, habit.goal)
    )

    habit_id = cursor.lastrowid
    conn.commit()

    cursor.execute("SELECT * FROM habits WHERE id = ?", (habit_id,))
    saved_habit = cursor.fetchone()

    result = format_habit(cursor, saved_habit)

    conn.close()
    return result


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

    cursor.execute("SELECT * FROM habits WHERE id = ?", (habit_id,))
    updated_habit = cursor.fetchone()

    result = format_habit(cursor, updated_habit)

    conn.close()
    return result


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

    cursor.execute("SELECT * FROM habits WHERE id = ?", (habit_id,))
    updated_habit = cursor.fetchone()

    result = format_habit(cursor, updated_habit)

    conn.close()
    return result