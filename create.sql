DROP SCHEMA IF EXISTS tasktracker CASCADE;

CREATE SCHEMA tasktracker;

CREATE TYPE task_status AS ENUM ('todo', 'in-progress', 'done');

CREATE TABLE tasktracker.tasks (
    id SERIAL PRIMARY KEY,
    description VARCHAR(100) NOT NULL,
    status task_status NOT NULL DEFAULT 'todo',
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);