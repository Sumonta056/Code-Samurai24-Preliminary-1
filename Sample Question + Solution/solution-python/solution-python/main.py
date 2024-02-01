import sqlite3

from flask import Flask, request

app = Flask(__name__)


@app.route("/p1", methods=["PUT"])
def route_p1():
    """Simple API for storing 2 dimensional coordinates"""

    data = request.get_json()

    db = sqlite3.connect("sqlite.db")
    db.cursor().execute("INSERT INTO coords (x, y) VALUES (?, ?)", (data["x"], data["y"]))
    db.commit()
    db.close()

    return {"added": {"x": data["x"], "y": data["y"]}}, 201


@app.route("/p2", methods=["GET"])
def route_p2():
    """Simple API for finding center of gravity from the coordinate space"""
    
    db = sqlite3.connect("sqlite.db")
    coords = db.cursor().execute("SELECT * FROM coords").fetchall()
    db.close()

    s_x, s_y, n = 0, 0, 0
    for (_, x, y) in coords:
        s_x += x
        s_y += y
        n += 1
    if n:
        a_x, a_y = int(s_x / float(n)), int(s_y / float(n))
    else:
        a_x, a_y = 0, 0

    return {"avg": {"x": a_x, "y": a_y}}


if __name__ == "__main__":
    app.run()
