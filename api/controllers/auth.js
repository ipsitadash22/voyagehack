import User from "../models/User.js"; // Import the User model for interacting with the database.
import bcrypt from "bcryptjs"; // Library for hashing passwords to enhance security.
import { createError } from "../utils/error.js"; // Utility for standardized error handling.
import jwt from "jsonwebtoken"; // Library for creating JSON Web Tokens (JWT) for user authentication.

export const register = async (req, res, next) => {
    try {
        // Generate a salt for hashing the password.
        //salt tab use hota hai when we have user adds same password and u want to keep the password unique

        const salt = bcrypt.genSaltSync(10); // Adds randomness to prevent dictionary attacks.

        // Hash the user's password using the generated salt.
        const hash = bcrypt.hashSync(req.body.password, salt);

        // Debugging logs to verify password handling during registration.
        console.log("Original Password:", req.body.password); // The plain-text password from the request.
        console.log("Hashed Password:", hash); // The hashed password that will be stored in the database.

        // Create a new user instance with hashed password and other details.
        const newUser = new User({
            ...req.body, // Spread operator to include all request fields like username and email.
            password: hash, // Replace plain-text password with its hashed version.
        });

        // Save the new user to the database.
        await newUser.save();

        // Respond to the client with a success message.
        res.status(200).send("User has been created.");
    } catch (err) {
        // Forward any errors to the error-handling middleware.
        next(err);
    }
};

export const login = async (req, res, next) => {
  try {
    // Find the user in the database by their username.
    const user = await User.findOne({ username: req.body.username });

    // If the user is not found, send a 404 error.
    if (!user) return next(createError(404, "User not found!"));

    // Compare the entered password with the hashed password.
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    // If the password is incorrect, send a 400 error.
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username!"));

    // Temporarily hardcoded secret for testing
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      "s3bXOmb+H80Ujg2/cEgsrtJHz364vm62g9JEEyr5XB8="
    );

    // Destructure sensitive details to exclude them from the response.
    const { password, isAdmin, ...otherDetails } = user._doc;

    // Set the token in an HTTP-only cookie and send the response.
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ details: { ...otherDetails }, isAdmin });
  } catch (err) {
    // Pass any errors to the error-handling middleware.
    next(err);
  }
};

