import express from "express";
const router = express.Router(); 
import UserModel from "../models/user.model.js";

//Registro: 

router.post("/", async (req, res) => {
    const {first_name, last_name, email, password, age} = req.body; 

    try {
        //Verifico si el correo que recibo ya esta en la bd. 
        const userExists = await UserModel.findOne({email:email});
        if(userExists) {
            return res.status(400).send("El correo electronico ya esta registrado");
        }
        const role = email === "admincoder@coder.com" ? "admin" : "user"
        //Creo un nuevo usuario: 
        const newUser = await UserModel.create({first_name, last_name, email, password, age, role});

        //Armo la session: 
        req.session.login = true;
        req.session.user = {...newUser._doc}

        res.redirect("/profile");

    } catch (error) {
        res.status(500).send("Error interno del servidor")
    }
})

//Login: 

router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await UserModel.findOne({email:email}); 
        if(user) {
            if(user.password === password) {
                req.session.login = true;
                req.session.user = {
                    email: user.email, 
                    age: user.age,
                    first_name: user.first_name, 
                    last_name: user.last_name
                }
                res.redirect("/profile");
            } else {
                res.status(401).send("Contraseña no valida, moriras!");
            }

        } else {
            res.status(404).send("Usuario no encontrado");
        }
        
    } catch (error) {
        res.status(500).send("Error interno del servidor")
    }

})

//Logout

router.get("/logout", (req, res) => {
    if(req.session.login) {
        req.session.destroy();
    }
    res.redirect("/login");
})


export default router; 