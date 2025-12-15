const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// CREATE
exports.createSubcategory = async (req, res) => {
  const { name, categoryId } = req.body;
  const parsedCategoryId = parseInt(categoryId);

  try {
    if (!name || !parsedCategoryId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing Name or Category ID Field!" });
    }

    // Check for existing subcategory in this category
    const existingSubcategory = await prisma.subcategory.findFirst({
        where: { name: name, categoryId: parsedCategoryId }
    });

    if (existingSubcategory) {
      return res
        .status(400)
        .json({ success: false, message: "Subcategory already exists in this category!" });
    }

    const newSubcategory = await prisma.subcategory.create({
      data: {
        name,
        categoryId: parsedCategoryId,
      },
    });

    if (!newSubcategory) {
      return res
        .status(400)
        .json({ success: false, message: "Unable to create subcategory!" });
    }

    return res
      .status(201)
      .json({ success: true, message: "Subcategory created successfully!", data: newSubcategory });
  } catch (error) {
    console.log("error", error.message);
    return res.status(500).json({ success: false, message: "Internal server error, please try again later!" });
  }
};

// GET ALL
exports.getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await prisma.subcategory.findMany({
        include: {
            category: true
        }
    });
    if (!subcategories) {
      return res
        .status(400)
        .json({ success: false, message: "Unable to get Subcategories!" });
    }
    return res.status(200).json({ success: true, message: "Subcategories fetched successfully!", data: subcategories });
  } catch (error) {
    console.log("error", error.message);
    return res.status(500).json({ success: false, message: "Internal server error, please try again later!" });
  }
};

// DELETE
exports.deleteSubcategory = async (req, res) => {
  const { id } = req.params;
  const parsedId = parseInt(id);

  try {
    const existingSubcategory = await prisma.subcategory.findUnique({
      where: { id: parsedId },
    });

    if (!existingSubcategory) {
      return res.status(400).json({
        success: false,
        message: "Subcategory does not exist in database!",
      });
    }

    const deletedSubcategory = await prisma.subcategory.delete({
      where: { id: parsedId },
    });

    if (!deletedSubcategory) {
      return res.status(400).json({
        success: false,
        message: "Unable to Delete!",
      });
    }
    return res
      .status(200)
      .json({ success: true, message: "Subcategory deleted successfully!" });
  } catch (error) {
    console.error("error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};
