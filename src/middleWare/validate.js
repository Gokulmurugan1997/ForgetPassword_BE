import auth from "../utils/auth.js"


const validate = async(req,res,next)=>{
    try {
        const token = await req?.headers?.authorization?.split(" ")[1]
        if(token)
        {
            const payload = await auth.decodeToken(token)
            if(Math.round(+new Date()/1000)< payload.exp) 
              {
                next()
              }
              else{
                res.status(402).send({
                    message:"Token Expired"
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
export default validate