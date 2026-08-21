"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const zod_1 = require("zod");
const errorHandler = (err, req, res, next) => {
    logger_1.default.error(err.stack || err.message);
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let code = 'INTERNAL_SERVER_ERROR';
    let message = err.message || 'An unexpected error occurred';
    let details = null;
    if (err instanceof zod_1.ZodError) {
        statusCode = 400;
        code = 'VALIDATION_ERROR';
        message = 'Invalid input data';
        details = err.errors;
    }
    else if (err.name === 'UnauthorizedError' || statusCode === 401) {
        code = 'UNAUTHORIZED';
    }
    else if (statusCode === 403) {
        code = 'FORBIDDEN';
    }
    else if (statusCode === 404) {
        code = 'NOT_FOUND';
    }
    res.status(statusCode).json({
        error: {
            code,
            message,
            details,
            stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
        }
    });
};
exports.errorHandler = errorHandler;
