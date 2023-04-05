install_backend_dependencies:
	pip3 install -r requirements.txt

migrate_project_database:
	python3 manage.py migrate

setup_backend: install_backend_dependencies migrate_project_database

install_frontend_dependencies:
	cd frontend && yarn install

setup_frontend: install_frontend_dependencies

start_backend:
	python3 manage.py runserver 0.0.0.0:${API_PORT}
start_worker:
	python3 manage.py rqworker critical high default low
start_redis:
	redis-server &> redis.log

setup: setup_backend setup_frontend

start: start_frontend start_backend start_redis start_worker
