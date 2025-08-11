import mongoose from "mongoose";


type ConnectionObject = {
    isConnecte?: number;
};

const connection : ConnectionObject = {};

export async function dbConnect() : Promise<void> {
    if (connection.isConnecte) {
        console.log("Already connected to database");
        return;
    }


    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
        connection.isConnecte = db.connections[0].readyState;
        console.log("Connected to database successfully ✅");
        
    } catch (error) {
        console.log("Error connecting to database: ❌", error);

        process.exit(1);
    }
   
}

export default dbConnect;




