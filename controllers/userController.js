// const { PrismaClient } = require("@prisma/client")
// const prisma = new PrismaClient()
// const bcrypt = require('bcrypt');
// const { uploadToCloudinary } = require('../utility/uploadtoCloudinary');
// const { sendVerification } = require("../utility/emailVerification");
// const { sendVerification } = require("../utility/emailVerification");



// exports.registerUser = async (req, res) => {
//     const { firstName, lastName, email, phone, address, password, confirmpassword } = req.body
//     console.log("body:", req.body);
    
//     try {
//         if (!firstName) {
//             return res.status(400).json({ success: false, message: "First name is required!" })
//         }
//         if (!lastName) {
//             return res.status(400).json({ success: false, message: "Last name is required!" })
//         }
//         if (!email) {
//             return res.status(400).json({ success: false, message: "Missing email field!" })
//         }
//         if (!phone) {
//             return res.status(400).json({ success: false, message: "Missing phone number field!" })
//         }
//         if (!address) {
//             return res.status(400).json({ success: false, message: "Missing address field!" })
//         }
//         if (!password) {
//             return res.status(400).json({ success: false, message: "Missing password field!" })
//         }
//         if (!confirmpassword) {
//             return res.status(400).json({ success: false, message: "Missing confirm password field!" })
//         }


//         //validate email format
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//         if (!emailRegex.test(email)) {
//             return res.status(400).json({ success: false, message: "Invalid email format!" });
//         }



//         // Validate password (must start with uppercase and include a special character)
//         const passwordRegex = /^[A-Z](?=.*[\W_])/;

//         if (!passwordRegex.test(password)) {
//             return res.status(400).json({
//                 success: false,
//                 message:
//                     "Password must start with an uppercase letter and include at least one special character.",
//             });
//         }

//         if (password !== confirmpassword) {
//             return res.status(400).json({ success: false, message: "Password and confirm password do not match!" });
//         }
//         const salt = await bcrypt.genSalt(12);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         let imageUrl

//         if (req.file) {
//             imageUrl = await uploadToCloudinary(req.file.buffer, "image", "Users");
//         }

//         //check if user already exists

//         const existingUser = await prisma.user.findUnique({
//             where: { email }
//         });
//         if (existingUser) {
//             return res.status(400).json({ success: false, message: "User with this email already exists!" });
//         }

//         const newUser = await prisma.user.create({
//             data: {
//                 firstName,
//                 lastName,
//                 email,
//                 phone,
//                 address,
//                 password: hashedPassword,
//                 image: imageUrl || null,
//             }
//         });
//         if (!newUser) {
//             return res.status(400).json({ success: true, message: "User creation failed!", data: newUser });
//         }

//         const verificationLink = "https://www.google.com/";
//         // await sendVerification(newUser.email, verificationLink);

//         return res.status(201).json({ success: true, message: "User created successfully!", data: newUser });

//     } catch (error) {
//         return res.status(500).json({ success: false, message: "Internal server error, please try again later!", error: error.message });
//     }
// };


// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     //check all feilds are being passed
//     if (!email) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Email feild is not provided!" });
//     }
//     if (!password) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Password feild is not provided!" });
//     }

//     //check for user
//     const user = await prisma.user.findUnique({ where: { email } });

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "User with this email does not exist in database!",
//       });
//     }

//     //validate password
//     const validatePassword = await bcrypt.compare(password, user.password);

//     if (!validatePassword) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Password is incorrect!" });
//     }

//     //generate token
//     const token = generateToken(user);
//     if (!token) {
//       return res.status(400).json({
//         success: false,
//         message: "invalid or no token!",
//       });
//     }
//     res.setHeader('Authorization', `Bearer ${token}`)
  

//     return res
//       .status(200)
//       .json({ 
//         success: true, 
//         message: "Login successful", 
//         token,
//         data: {
//           userid: user.id,
//           email: user.email,
//           firstName: user.firstName,
//           lastName: user.lastName,
//           phone: user.phone,
//           address: user.address,
//           image: user.image,
//           role: user.role
//         }
//       });
//   } catch (error) {
//     console.log("error", error.message);

//     return res.status(500).json({
//       success: false,
//       message: "internal server error please try later!",
//     });
//   }
// };

const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');
const { uploadToCloudinary } = require('../utility/uploadtoCloudinary');
const { sendVerification } = require("../utility/emailVerification");
const { generateToken } = require("../utility/generateToken");
const crypto = require("crypto");

exports.registerUser = async (req, res) => {
    const { firstName, lastName, email, phone, address, password, confirmpassword } = req.body
    
    try {
        if (!firstName || !lastName || !email || !phone || !address || !password || !confirmpassword) {
            return res.status(400).json({ success: false, message: "All fields are required!" })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return res.status(400).json({ success: false, message: "Invalid email format!" });

        const passwordRegex = /^[A-Z](?=.*[\W_])/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ success: false, message: "Password must start with Uppercase and include special char." });
        }

        if (password !== confirmpassword) return res.status(400).json({ success: false, message: "Passwords do not match!" });
        
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ success: false, message: "User already exists!" });

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        let imageUrl = null;
        if (req.file) {
            imageUrl = await uploadToCloudinary(req.file.buffer, "image", "Users");
        }

        const verificationToken = crypto.randomBytes(32).toString("hex");

        const newUser = await prisma.user.create({
            data: { 
                firstName, 
                lastName, 
                email, 
                phone, 
                address, 
                password: hashedPassword, 
                image: imageUrl,
                verificationToken 
            }
        });

        const verificationLink = `https://ecommerce-fashion-delta.vercel.app/verify-email?token=${verificationToken}`;
        console.log("Verification Link:", verificationLink);
        try {
            await sendVerification(newUser.email, verificationLink);
        } catch (emailError) {
            console.error("Failed to send verification email:", emailError.message);
            // Don't fail the registration, just log it. Link is already logged above.
        }

        return res.status(201).json({ success: true, message: "User created successfully! Please check your email to verify your account.", data: newUser });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password, guestCart } = req.body;
    
    try {
        if (!email || !password) return res.status(400).json({ success: false, message: "Email and Password required!" });

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ success: false, message: "User not found!" });

        const validatePassword = await bcrypt.compare(password, user.password);
        if (!validatePassword) return res.status(400).json({ success: false, message: "Incorrect password!" });

        // ⭐ MERGE GUEST CART LOGIC
        if (guestCart && Array.isArray(guestCart) && guestCart.length > 0) {
            try {
                const userCart = await prisma.cart.upsert({
                    where: { userId: user.id },
                    update: {},
                    create: { userId: user.id },
                });

                for (const item of guestCart) {
                    const productId = Number(item.id);
                    if (!productId) continue; 

                    const existingItem = await prisma.productCart.findUnique({
                        where: { ProductId_CartId: { ProductId: productId, CartId: userCart.id } },
                    });

                    if (existingItem) {
                        await prisma.productCart.update({
                            where: { ProductId_CartId: { ProductId: productId, CartId: userCart.id } },
                            data: { quantity: existingItem.quantity + (item.quantity || 1) },
                        });
                    } else {
                        await prisma.productCart.create({
                            data: {
                                CartId: userCart.id,
                                ProductId: productId,
                                selectedcolor: item.color || null,
                                selectedsize: item.size || null,
                                quantity: item.quantity || 1,
                            },
                        });
                    }
                }
            } catch (e) { console.error("Cart merge error:", e); }
        }

        const token = generateToken(user);
        res.setHeader('Authorization', `Bearer ${token}`);

        // Fetch final cart to return
        let finalCart = [];
        const dbCart = await prisma.cart.findUnique({
            where: { userId: user.id },
            include: { ProductCart: { include: { Product: true } } }
        });
        
        if (dbCart?.ProductCart) {
            finalCart = dbCart.ProductCart.map(item => ({
                ...item.Product,
                quantity: item.quantity,
                size: item.selectedsize,
                color: item.selectedcolor
            }));
        }

        return res.status(200).json({ 
            success: true, 
            message: "Login successful", 
            token,
            cart: finalCart, // Return the merged cart
            data: {
                userid: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                address: user.address,
                image: user.image,
                role: user.role
            }
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.verifyEmail = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ success: false, message: "Token is required" });
    }

    try {
        const user = await prisma.user.findFirst({
            where: { verificationToken: token }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification token" });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                verificationToken: null
            }
        });

        return res.status(200).json({ success: true, message: "Email verified successfully" });
    } catch (error) {
        console.error("Verification error:", error);
        return res.status(500).json({ success: false, message: "Server error during verification" });
    }
};