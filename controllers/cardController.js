const Response = require("../helpers/response")
const Card = require("../models/Card")

const AddCard=async(req,res,next)=>{
    const {cardOwaner,cardNumber,expiry,cvv}=req.body
    const {image} = req.files;

    const files=[]
    if(req.files){
        image.forEach(element => {
            const publicFileUrl = `/images/users/${element.filename}`;

            files.push({
                publicFileUrl,
                path: element.filename,
              });
        });
       
    }
    try {

        const cardData={
            image:files[0],
            cardNumber,
            cardOwaner,
            expiry,
            cvv
        }
        const createCard=await Card.create(cardData)
        res.status(200).json(Response({statusCode:200,status:"ok",message:"card created successfully",data:createCard
        }))
        
    } catch (error) {
        res.status(500).json(Response({status:"failed",statusCode:500,message:error.message}))
        
    }

}

const showCard=async(req,res,nextt)=>{
    try {
        const allCards=await Card.find()
        res.status(200).json(Response({statusCode:200,status:"ok",message:"card showed successfully",data:allCards
    }))
        
    } catch (error) {
        res.status(500).json(Response({statusCode:500,message:error.message,status:"failed"}))
        
    }
}
module.exports={
    AddCard,
    showCard
}