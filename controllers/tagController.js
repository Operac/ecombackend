const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// CREATE
exports.createTag = async (req, res) => {
  const { name } = req.body;

  try {
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Missing Name Field!" });
    }

    const existingTag = await prisma.tag.findUnique({
      where: { name },
    });

    if (existingTag) {
      return res
        .status(400)
        .json({ success: false, message: "Tag already exists!" });
    }

    const newTag = await prisma.tag.create({
      data: {
        name,
      },
    });

    if (!newTag) {
      return res
        .status(400)
        .json({ success: false, message: "Unable to create tag!" });
    }

    return res
      .status(201)
      .json({ success: true, message: "Tag created successfully!", data: newTag });
  } catch (error) {
    console.log("error", error.message);
    return res.status(500).json({ success: false, message: "Internal server error, please try again later!" });
  }
};

// GET ALL
exports.getAllTags = async (req, res) => {
  try {
    const allTags = await prisma.tag.findMany();
    if (!allTags) {
      return res
        .status(400)
        .json({ success: false, message: "Unable to get Tags!" });
    }
    return res.status(200).json({ success: true, message: "Tags fetched successfully!", data: allTags });
  } catch (error) {
    console.log("error", error.message);
    return res.status(500).json({ success: false, message: "Internal server error, please try again later!" });
  }
};

// DELETE
exports.deleteTag = async (req, res) => {
  const { id } = req.params;
  const parsedId = parseInt(id);

  try {
    const existingTag = await prisma.tag.findUnique({
      where: { id: parsedId },
    });

    if (!existingTag) {
      return res.status(400).json({
        success: false,
        message: "Tag does not exist in database!",
      });
    }

    const deletedTag = await prisma.tag.delete({
      where: { id: parsedId },
    });

    if (!deletedTag) {
      return res.status(400).json({
        success: false,
        message: "Unable to Delete!",
      });
    }
    return res
      .status(200)
      .json({ success: true, message: "Tag deleted successfully!" });
  } catch (error) {
    console.error("error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};
