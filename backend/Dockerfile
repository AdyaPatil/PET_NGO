FROM python:3.9-slim as petback

WORKDIR /app/petback

COPY requirements.txt /app/petback/requirements.txt

RUN pip install -r requirements.txt 

COPY . /app/petback  

EXPOSE 8000 

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]