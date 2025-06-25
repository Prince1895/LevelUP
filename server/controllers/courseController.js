export const getAllCourses = async (req, res) => {
    try{
        const courses = await Course.find();
        return res.status(200).json({ message: "Get all courses successfully", courses });

    }catch(error){
        console.error("Get all courses error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}


export const getCourseById = async (req, res) => {
    try{
        const course = await Course.findById(req.params.id);
        return res.status(200).json({ message: "Get course by id successfully", course });

    }catch(error){
        console.error("Get course by id error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    
    }
}