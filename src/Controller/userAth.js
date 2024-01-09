export const createUser = (req, res) => {
    console.log(req.body);
    try {
  
    } catch (error) {
      res.status(500).json({ message: error.message || "somthing went wrong" });
    }
  };
   