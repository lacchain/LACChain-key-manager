CREATE USER docker WITH PASSWORD 'password' CREATEDB;

CREATE DATABASE laccpass_key_manager_development
WITH OWNER = docker
CONNECTION LIMIT = -1;


CREATE DATABASE laccpass_key_manager
WITH OWNER = docker
CONNECTION LIMIT = -1;

CREATE DATABASE express_api_base_test
WITH OWNER = docker
CONNECTION LIMIT = -1;

