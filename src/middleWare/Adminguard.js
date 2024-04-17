import auth from "../utils/auth.js"


const AdminGuard = async(req,res,next)=>{
    try {
        const token = await req?.headers?.authorization?.split(" ")[1]
        if(token)
        {
            const payload = await auth.decodeToken(token)
            if(payload.role==="admin") 
              {
                next()
              }
              else{
                res.status(402).send({
                    message:"permission denied"
                })
              }
            
        }
        else{
            res.status(402).send({
                message:"token not found"
            })
        }
    } catch (error) {
        res.status(500).send({
            message:error.message||"internal error"
        })
    }
}
export default AdminGuard