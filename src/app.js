import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import exphbs from "express-handlebars";
const app = express(); 
const PORT = 8080; 
import "./database.js";
import sessionsRouter from "./routes/sessions.router.js";
import viewsRouter from "./routes/views.router.js";

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const secretPassword = "Firulais";
app.use(cookieParser(secretPassword));
app.use(express.static("./src/public"));
//Le paso la palabra secreta al middleware de Cookie Parser. 

//Express-Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Middleware de Session: 
app.use(session({
    secret:"secretCoder",
    resave: true,
    //Esta configuración me permite mantener activa la sesion frente a la inactividad del usuario. 

    saveUninitialized: true,
    //Me permite guardar cualquier sesión aun cuando el objeto de sesion no tenga nada para contener.  

    //Utilizo Mongo Store
    store: MongoStore.create({
        mongoUrl:"mongodb+srv://juanivangonz15:mongodbcoder@cluster0.e2dhfiu.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0", ttl: 100
    })
}))

//Rutas

app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);

//Listen
app.listen(PORT, ()=> {
    console.log(`Escuchando en http://localhost:${PORT}`);
})

