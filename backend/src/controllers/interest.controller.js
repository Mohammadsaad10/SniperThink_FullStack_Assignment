import prisma from "../config/prisma.js";

export const submitInterest = async (req, res) => {
  try {
    const { name, email, step } = req.body;

    if (!name || !email || !step) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const interest = await prisma.interest.create({
      data: {
        name,
        email,
        step,
      },
    });

    res.json({
      success: true,
      message: "Interest submitted successfully",
      data: interest,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
