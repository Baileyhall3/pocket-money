exports.getUser = (req, res, next) => {
    const user = {
        id: 1,
        firstName: 'Bailey',
        lastName: 'Hall',
        email: 'baileyhall271001@gmail.com'
    };
    
    // Attach user data to the response locals (to be accessed in views)
    req.user = user;
    
    // Call next middleware (which could be your route handler)
    next();
};