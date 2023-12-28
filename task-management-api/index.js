const { app } = require("./app");

const PORT = process.env.PORT || 8090;
const server = app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
