const config={
    MONGODB_URI:process.env.MONGODB_URI,
    PORT:process.env.PORT,
    JWT_SCERET:process.env.JWT_SCERET,
    JWT_EXPIRES_IN:process.env.JWT_EXPIRES_IN
}


if(!config.MONGODB_URI){
    throw new Error("Please provide MONGODB_URI in .env file");
}
if(!config.PORT){
    throw new Error("Please provide PORT in .env file");
}
if(!config.JWT_SCERET){
    throw new Error("Please provide JWT_SCERET in .env file");
}
if(!config.JWT_EXPIRES_IN){
    throw new Error("Please provide JWT_EXPIRES_IN in .env file");
}


export default config;