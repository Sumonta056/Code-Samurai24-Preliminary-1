import sqlite3

from flask import Flask, request

app = Flask(__name__)


@app.route("/api/books", methods=["POST"])
def add_book():
    data = request.get_json()

    db = sqlite3.connect("sqlite.db")
    db.cursor().execute(
        "INSERT INTO books (id, title, author, genre, price) VALUES (?, ?, ?, ?, ?)",
        (data["id"], data["title"], data["author"], data["genre"], data["price"]),
    )
    db.commit()
    db.close()

    return data, 201


@app.route("/api/books/<int:book_id>", methods=["GET"])
def get_book_by_id(book_id: int):
    db = sqlite3.connect("sqlite.db")
    book = db.cursor().execute("SELECT * FROM books WHERE id=?", (book_id,)).fetchone()
    db.close()

    if not book:
        return {"message": f"book with id: {book_id} was not found"}, 404

    return {"id": book[0], "title": book[1], "author": book[2], "genre": book[3], "price": book[4]}, 200


@app.route("/api/books/<int:book_id>", methods=["PUT"])
def update_book(book_id: int):
    data = request.get_json()

    db = sqlite3.connect("sqlite.db")
    book = db.cursor().execute("SELECT * FROM books WHERE id=?", (book_id,)).fetchone()
    if not book:
        db.close()
        return {"message": f"book with id: {book_id} was not found"}, 404
    
    db.cursor().execute(
        "UPDATE books SET title=?, author=?, genre=?, price=? WHERE id=?",
        (data["title"], data["author"], data["genre"], data["price"], book_id),
    )
    db.commit()
    db.close()

    data.update({"id": book_id})

    return data, 200


@app.route("/api/books", methods=["GET"])
def get_books():
    args = request.args

    if "title" in args:
        search_key, search_val = "title", args["title"]
    elif "author" in args:
        search_key, search_val = "author", args["author"]
    elif "genre" in args:
        search_key, search_val = "genre", args["genre"]
    else:
        search_key, search_val = None, None
    
    if "sort" in args:
        sort_key = args["sort"]
    else:
        sort_key = "id"
    
    if "order" in args:
        sort_order = args["order"]
    else:
        sort_order = "ASC"
    
    if search_key:
        where_clause = f"WHERE {search_key}='{search_val}'"
    else:
        where_clause = ""
    
    if sort_key != "id":
        order_clause = f"{sort_key} {sort_order}, id ASC"
    else:
        order_clause = f"id {sort_order}"
    
    query = "SELECT * FROM books {} ORDER BY {}".format(where_clause, order_clause)

    db = sqlite3.connect("sqlite.db")
    books = [
        {"id": book[0], "title": book[1], "author": book[2], "genre": book[3], "price": book[4]}
        for book in db.cursor().execute(query).fetchall()
    ]
    db.close()

    return {"books": books}, 200


if __name__ == "__main__":
    app.run()
