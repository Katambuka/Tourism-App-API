const isAuthenticated = (req, res, next) => {
   if(req.session.user === undefined){
      return res.status(401).json({error: 'You must be authenticated to view this resource.'});
   }
   next();
}

module.exports = {
   isAuthenticated
}