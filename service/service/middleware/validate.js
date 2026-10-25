// Validates req.body against a zod schema and replaces it with the parsed result.
// Fields the schema doesn't list are dropped, so handlers only see whitelisted fields
// (a client can't set createdBy, role, status or _id by adding them to the body).
export const validateBody = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body ?? {});
    if (!result.success) {
        const errors = result.error.issues.map((issue) => ({
            field: issue.path.join(".") || null,
            message: issue.message,
        }));
        return res.status(400).json({
            message: errors.map((error) => error.message).join(". "),
            errors,
        });
    }
    req.body = result.data;
    next();
};
