# Use official lightweight Python image
FROM python:3.11-slim

# Set environment vars for Python
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (for caching layers)
COPY requirements.txt /app/

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app
COPY . /app/

# Expose Flask/Gunicorn port
EXPOSE 5000

# Start the application with Gunicorn (production server)
# "wsgi:app" means file `wsgi.py` with variable `app`
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "wsgi:app", "--workers=4", "--threads=2", "--timeout=120"]