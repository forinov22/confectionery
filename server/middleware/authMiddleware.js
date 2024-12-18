const isAuthenticated = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    return next();
};

const hasRole = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        if (!req.user.roles.some((user_role, index, array) => user_role.name === role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        return next();
    };
};

const hasOneOfRoles = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const hasRole = roles.some(role =>
            req.user.roles.some(user_role => user_role.name === role)
        );

        if (hasRole) {
            return next();
        }

        return res.status(403).json({ message: 'Forbidden' });
    };
};

module.exports = {
    isAuthenticated,
    hasRole,
    hasOneOfRoles
};
