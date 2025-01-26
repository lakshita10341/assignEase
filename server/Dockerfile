FROM  python:3.12.3

ENV PYTHONUNBUFFERED=1

WORKDIR /server

COPY requirements.txt /server/

RUN pip install --no-cache-dir -r requirements.txt


COPY . /server 
# RUN python3 manage.py makemigrations
# RUN python3 manage.py migrate

EXPOSE 8000
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "server.asgi:application"]

