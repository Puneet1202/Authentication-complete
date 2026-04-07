import crypto from "crypto";

// 🔧 SIMPLE HASH FUNCTION (simulate bcrypt)
function hashFunction(password, salt) {
  return crypto
    .createHash("sha256")
    .update(password + salt)
    .digest("hex");
}

// 🔐 REGISTER FUNCTION
function register(password) {
  const salt = crypto.randomBytes(4).toString("hex"); // random salt
  const hash = hashFunction(password, salt);

  const storedHash = `${salt}:${hash}`; // store both
  return storedHash;
}

// 🔍 COMPARE FUNCTION (IMPORTANT)
function compare(inputPassword, storedHash) {
  console.log("\n--- 🔎 COMPARE START ---");

  // STEP 1: split stored data
  const [salt, originalHash] = storedHash.split(":");

  console.log("👉 Extracted Salt:", salt);
  console.log("👉 Stored Hash:", originalHash);

  // STEP 2: re-hash input password with SAME salt
  const newHash = hashFunction(inputPassword, salt);

  console.log("👉 New Hash from input:", newHash);

  // STEP 3: compare
  const isMatch = newHash === originalHash;

  console.log("👉 Match Result:", isMatch);

  return isMatch;
}

// 🚀 RUN DEMO

const password = "punit";

// Register
const stored = register(password);
console.log("🟢 Stored in DB:", stored);

// Login
compare("punit", stored);