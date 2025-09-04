// src/utils/errors.js
class NotFoundError extends Error {
  constructor(entity = 'Entity', query = {}) {
    super(`${entity} not found`);
    this.name = 'NotFoundError';
    this.entity = entity;
    this.query = query;
    this.status = 404;
  }
}

class ValidationError extends Error {
  constructor(message = 'Validation failed', details = {}) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
    this.status = 400;
  }
}

class ConflictError extends Error {
  constructor(message = 'Conflict') {
    super(message);
    this.name = 'ConflictError';
    this.status = 409;
  }
}

export { NotFoundError, ValidationError, ConflictError };
