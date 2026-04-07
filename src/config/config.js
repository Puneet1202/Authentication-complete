const config={
    MONGODB_URI:process.env.MONGODB_URI,
    PORT:process.env.PORT,
    JWT_SCERET:process.env.JWT_SCERET,
    JWT_EXPIRES_IN:process.env.JWT_EXPIRES_IN,
    REFRESH_TOKEN:process.env.REFRESH_TOKEN_SECRET,
    REFRESH_EXPIRES:process.env.REFRESH_TOKEN_EXPIRES_IN,
    ACCESS_TOKEN:process.env.ACCESS_TOKEN_SCERET,
    ACCESS_EXPIRES:process.env.ACCESS_TOKEN_EXPIRES_IN,
    SESSION_EXPIRES_IN_MS:process.env.SESSION_EXPIRES_IN_MS,
    GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_USER_EMAIL_ID:process.env.GOOGLE_USER_EMAIL_ID,
    GOOGLE_REFRESH_TOKEN:process.env.GOOGLE_REFRESH_TOKEN
}


// if(!config.MONGODB_URI){
//     throw new Error("Please provide MONGODB_URI in .env file");
// }
// if(!config.PORT){
//     throw new Error("Please provide PORT in .env file");
// }
// if(!config.JWT_SCERET){
//     throw new Error("Please provide JWT_SCERET in .env file");
// }
// if(!config.JWT_EXPIRES_IN){
//     throw new Error("Please provide JWT_EXPIRES_IN in .env file");
// }
// if(!config.REFRESH_TOKEN){
//     throw new Error("Please provide REFRESH_TOKEN_SECRET in .env file");
// }
// if(!config.REFRESH_EXPIRES){
//     throw new Error("Please provide REFRESH_TOKEN_EXPIRES_IN in .env file");
// }
// if(!config.ACCESS_TOKEN){
//     throw new Error("Please provide ACCESS_TOKEN_SCERET in .env file");
// }
// if(!config.ACCESS_EXPIRES){
//     throw new Error("Please provide ACCESS_TOKEN_EXPIRES_IN in .env file");
// }
// if(!config.SESSION_EXPIRES_IN_MS){
//     throw new Error("Please provide SESSION_EXPIRES_IN_MS in .env file");
// }

Object.entries(config).forEach(([key, value]) => {
    if (!value) throw new Error(`Please provide ${key} in .env file`);
});
export default config;