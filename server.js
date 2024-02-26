const express = require("express")
const mongoose = require("mongoose")
const {checkSchema, validationResult} = require("express-validator")
const app = express()
const PORT = 5000

mongoose.connect("mongodb://127.0.0.1:27017/todo-app")
    .then(()=>{console.log('Connected to db')})
    .catch(()=>{console.log('Error in connection')})

const {Schema,model} = mongoose

const taskSchema = new Schema({
    title: String,
    description: String,
    status: String
},{timestamps:true})
const Task = model("task", taskSchema)

const validationSchema = {
    title:{
        in: ['body'],
        exists:{
            errorMessage: "Title should be present"
        },
        notEmpty:{
            errorMessage: "Title should not be empty"
        },
        custom:{
            options: function(value){
                return Task.findOne({title:value})
                    .then((obj)=>{
                        if(obj){
                            throw new Error("Title name already there")
                        }
                        return true
                    })
            }
        }
    },
    description:{
        in: ['body'],
        exists:{
            errorMessage: "Title should be present"
        },
        notEmpty:{
            errorMessage: "Title should not be empty"
        }
    },
    status:{
        in: ['body'],
        exists:{
            errorMessage: "Title should be present"
        },
        notEmpty:{
            errorMessage: "Title should not be empty"
        },
        isIn:{
            options: [['Pending','in Progress', 'Completed']],
            errorMessage: 'Status shuld be there'
        }
    }
}
const validationUpdateSchema = {
    title:{
        in: ['body'],
        exists:{
            errorMessage: "Title should be present"
        },
        notEmpty:{
            errorMessage: "Title should not be empty"
        },
    },
    description:{
        in: ['body'],
        exists:{
            errorMessage: "Title should be present"
        },
        notEmpty:{
            errorMessage: "Title should not be empty"
        }
    },
    status:{
        in: ['body'],
        exists:{
            errorMessage: "Title should be present"
        },
        notEmpty:{
            errorMessage: "Title should not be empty"
        },
        isIn:{
            options: [['Pending','in Progress', 'Completed']],
            errorMessage: 'Status shuld be there'
        }
    }
}


const idValidationSchema = {
    id:{
        in:['params'],
        isMongoId:{
            errorMessage: "Id Should be valid mondoID"
        }
    }
}

app.use(express.json())

app.post('/tasks', checkSchema(validationSchema), (req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const body = req.body
    Task.create(body)
        .then((obj)=>{
            res.json(obj)
        })
        .catch((err)=>{
            res.status(500).json({error: "internal server error"})
        })
})
app.get('/tasks',(req,res)=>{
    Task.find()
        .then((data)=>{
            res.json(data)
        })
        .catch((err)=>{
            res.status(500).json({error: "internal server error"})
        })
})
app.put('/tasks/:id', checkSchema(idValidationSchema), checkSchema(validationUpdateSchema), (req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const id =req.params.id
    const body = req.body
    Task.findByIdAndUpdate(id,body,{new:true})
        .then((obj)=>{
            res.json(obj)
        })
        .catch((err)=>{
            res.status(500).json({error: "internal server error"})
        })
})
app.delete('/tasks/:id', checkSchema(idValidationSchema),(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.satus(400).json({errors: errors.array()})
    }
    const id = req.params.id
    Task.findByIdAndDelete(id)
        .then((obj)=>{
            res.json(obj)
        })
        .catch((err)=>{
            res.status(500).json({error:"internal server error"})
        })
})

app.listen(PORT,()=>{
    console.log("server running on port",PORT)
})