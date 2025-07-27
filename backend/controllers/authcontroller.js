const home = async (req, res) => {
    try{
        res.status(200).send("Welcome to VendorStreet");

    }catch(error){
        console.log(error);

    }
};

const register = async (req, res) =>{
    try{
        res.status(200).send("welcome to registration page");
    }catch(error){
        res.status(400).send("Registration failed");
    }
}

export { home, register };