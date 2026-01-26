import admin from '../config/firebase.js'

const verifyToken = async (req, res, next)=>{
    try{
        const authHeader = req.headers.authorization;
        const idToken = authHeader.split(' ')[1];
        if(!idToken){
            res.status(401).json({"message":"unauthorized"});
        }
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.uid = decodedToken.uid;
        next();
    }
    catch(err){
        console.log(err);
        res.status(500).json({'success':false,'error':'invalid or expired token!'});
    }
}

export default verifyToken;