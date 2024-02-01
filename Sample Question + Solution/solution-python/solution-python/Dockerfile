# syntax=docker/dockerfile:1
FROM python:3.11.5-slim-bookworm

ENV FLASK_APP=main:app

WORKDIR /app

COPY . .

RUN bash -c "pip install --upgrade pip"
RUN bash -c "pip install -r requirements.txt"

RUN bash -c "python init_db.py"

EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
