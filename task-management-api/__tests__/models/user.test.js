const { User } = require("../../models");

describe("User Model", () => {
  let userData;
  beforeEach(() => {
    userData = {
      fullame: "Basant Bareth",
      email: "basant@gmail.com",
      password: "1234",
    };
  });
  const userMock = jest.fn();
  const mockInstance = jest.fn();
  User.init = jest.fn();
  User.sequelize = { define: userMock };
  User.build = mockInstance;
  User.create = mockInstance;

  it(`should be defined`, () => {
    expect(User).toBeDefined();
  });

  it(`should crate a User instance`, () => {
    User.build(userData);
    expect(mockInstance).toHaveBeenCalledWith(userData);
  });

  it(`should create a user in the database`, async () => {
    await User.create(userData);
    expect(mockInstance).toHaveBeenCalledWith(userData);
  });
});
