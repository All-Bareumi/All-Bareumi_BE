const Sentence = require('../schemas/sentences.js')

exports.getSentences = async(req,res)=>{
    try{
        const category = req.params.category
        let sentences
        if(category){ 
            sentences= await Sentence.find({'info.category': category}).select('info.content');
        }
        else{
            sentences = await Sentence.find({});
        }
        const contents =sentences.map((sentence)=>sentence.info.content)
        res.status(200).json(contents)
    } catch(error){
        console.error(error);
        res.status(500).json({message:'Server Error'})
    }
}

exports.getTypeEnum = async(req,res)=>{
    const schema = req.params.schema
    try{
        const enumValues = await Sentence.schema.path(`info.${schema}`);
        res.status(200).send(enumValues.enumValues);
    }catch(error){
        console.error(error);
        res.status(500).json({message:'Server Error'})
    }
}

