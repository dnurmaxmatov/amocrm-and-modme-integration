import mongoose from "mongoose";

mongoose.connect('mongodb://localhost:27017', { dbName: 'notion_modme_finance' }).then(() => {
    console.log('Mongodb connected successfully')
}).catch((error) => {
    console.log('Error connecting mongodb')
})


export default mongoose