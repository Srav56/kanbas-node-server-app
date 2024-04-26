import * as dao from "./dao.js";
let currentUser = null;
export default function UserRoutes(app) {
  const createUser = async (req, res) => {
    const user = await dao.createUser(req.body);
    res.json(user);
  };  
  const deleteUser = async (req, res) => {
    const status = await dao.deleteUser(req.params.userId);
    res.json(status);
  };
  const findAllUsers = async (req, res) => {
    const { role } = req.query;
    if (role) {
      const users = await dao.findUsersByRole(role);
      res.json(users);
      return;
    }
    const users = await dao.findAllUsers();
    res.json(users);
    return;
  };
  const findUserById = async (req, res) => {
    const user = await dao.findUserById(req.params.userId);
    res.json(user);
  };
  const updateUser = async (req, res) => {
    const { userId } = req.params;
    const status = await dao.updateUser(userId, req.body);
    currentUser = await dao.findUserById(userId);
    res.json(status);
  };
  const signup = async (req, res) => {
    console.log("[1] register");
        const { username, password } = req.body;
        console.log("[2] username, password", username, password);

        const user = await dao.findUserByUsername(req.body.username);
        if (user) {
            res.status(400).json({ message: "Username already taken" });
            return;
        }

        const existingUser = await dao.findUserByCredentials(username, password);
        console.log("[3] existingUser", existingUser);

        if (existingUser) {
            res.status(400).send("User already exists");
            return;
        }
        
        try {
            const _id = uuidv4();
            const newUser = await dao.createUser({ _id, username, password });
            console.log("[4] newUser", newUser);
            req.session["currentUser"] = newUser;
            console.log("[5] req.session", req.session);
            res.send(newUser);
        } catch (e) {
            console.log("Error creating user: " + e);
            res.status(400).send("Error creating user");
        }

  };
  const signin = async (req, res) => {
    const { username, password } = req.body;
    const currentUser = await dao.findUserByCredentials(username, password);
    if (currentUser) {
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } else {
      res.sendStatus(401);
    }
  };  
  const signout = (req, res) => {
    //currentUser = null;
    req.session.destroy();
    res.sendStatus(200);
  };

  const profile = async (req, res) => {
    const currentUser = req.session["currentUser"];
    console.log("profile -- current user", currentUser);
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.send(currentUser);
  };
  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
}	//