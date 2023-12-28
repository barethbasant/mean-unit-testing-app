const supertest = require("supertest");
const { app } = require("../app");
const request = supertest(app);
const { sequelize, User } = require("../models");
const { registerUser, loginUser } = require("../services/userService");
const {
  generateAccessToken,

  dataForAccessToken,
  verifyToken,
  generateRefreshToken,
} = require("../utils/authJWT");
let userData = {};
describe("User API", () => {
  beforeAll(() => {
    User.destroy({
      where: {},
      truncate: true,
    });
  });
  beforeEach(() => {
    userData = {
      email: "basant@gmail.com",
      password: "1234",
      fullName: "bsant bareth",
    };
  });
  it("should register a new user", async () => {
    const user = await registerUser(userData);
    expect(user.email).toBe(userData.email);

    const savedUser = await User.findOne({ where: { email: userData.email } });
    expect(savedUser).toBeDefined();
  });

  it("should login a registered user with valid credentials", async () => {
    userData.email = "test@test.com";
    userData.password = "testuser";
    await registerUser(userData);

    const loggedInUser = await loginUser(userData.email, userData.password);

    expect(loggedInUser.email).toBe(userData.email);
  });

  it("should not login a user with invalid credentials", async () => {
    email = "test@test.com";
    password = "password";

    await expect(loginUser(email, password)).rejects.toThrow(
      "Invalid Password"
    );
  });

  it("should not login a nonexistent user", async () => {
    email = "invaid-user";
    password = "password";

    await expect(loginUser(email, password)).rejects.toThrow("Email Not Found");
  });

  it("should generate an access token", async () => {
    email = "basant@gmail.com";
    password = "1234";

    const user = await loginUser(email, password);
    const userDataForToken = dataForAccessToken(user);
    const accessToken = await generateAccessToken(userDataForToken);
    const decodedToken = await verifyToken(accessToken);
    expect(decodedToken.userId).toBe(user.id);
  });

  it("should generate a refresh token", async () => {
    const user = await loginUser(userData.email, userData.password);
    const userDataForToken = dataForAccessToken(user);
    const refreshToken = await generateRefreshToken(userDataForToken);
    const decodedToken = await verifyToken(refreshToken);
    expect(decodedToken.userId).toBe(user.id);
  });

  it(`POST /register should return 200 and create a new User`, async () => {
    userData.email = "basant@test.com";
    const response = await request.post("/register").send(userData);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.email).toBe(userData.email);
    expect(response.body.message).toBe("User Registration Done");
  });

  //duplicate user
  it(`POST /register should return 401 and throw an Error when user already registered`, async () => {
    userData.email = "basant@test.com";
    const response = await request.post("/register").send(userData);
    expect(response.status).toBe(401);
    expect(response.body.error).toBe("User Already Exists");
    // console.log(response.body);
  });

  it(`POST /login should return 200 and login should be success with access and refreshToken`, async () => {
    userData.email = "basant@test.com";
    const response = await request.post("/login").send(userData);
    // console.log(response.header);
    // console.log(response.header['set-cookie']);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    expect(response.body.data.email).toBe(userData.email);
    expect(response.body.message).toBe("Login Successfully");
  });
});
