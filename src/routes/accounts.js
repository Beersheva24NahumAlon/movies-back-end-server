import express from "express";
import accountsService from "../service/AccountsService.js";
import asyncHandler from "express-async-handler";
import { valitator } from "../middleware/validation.js";
import { schemaEmail, schemaEmailPassword, schemaEmailRole, schemaEmailNamePassword } from "../validation/accountsSchemas.js";


const accountsRouter = express.Router();

accountsRouter.post("/admin", valitator(schemaEmailNamePassword, "body") ,asyncHandler(async (req, res) => {
    await accountsService.addAdminAccount(req.body);
    res.status(201).send("admin account added");
}));
accountsRouter.post("/user", valitator(schemaEmailNamePassword, "body"), asyncHandler(async (req, res) => {
    await accountsService.addAccount(req.body);
    res.status(201).send("user account added");
}));
accountsRouter.put("/role", valitator(schemaEmailRole, "body"), asyncHandler(async (req, res) => {
    const account = await accountsService.setRole(req.body.email, req.body.role);
    res.send(account);
}));
accountsRouter.put("/password", valitator(schemaEmailPassword, "body"), asyncHandler(async (req, res) => {
    await accountsService.updatePassword(req.body.email, req.body.password);
    res.send("password updated");
}));
accountsRouter.get("/:email", valitator(schemaEmail, "params"), asyncHandler(async (req, res) => {
    const account = await accountsService.getAccount(req.params.email);
    res.send(account);
}));
accountsRouter.put("/block/:email", valitator(schemaEmail, "params"), asyncHandler(async (req, res) => {
    await accountsService.blockAccount(req.params.email);
    res.send("account blocked");
}));
accountsRouter.put("/unblock/:email", valitator(schemaEmail, "params"), asyncHandler(async (req, res) => {
    await accountsService.unblockAccount(req.params.email);
    res.send("account unblocked");
}));
accountsRouter.post("/login", asyncHandler(async (req, res) => {
    const token = await accountsService.login(req.body.email, req.body.password);
    res.send(token);
}));
accountsRouter.delete("/:email", valitator(schemaEmail, "params"), asyncHandler(async (req, res) => {
    await accountsService.deleteAccount(req.params.email);
    res.send("account deleted");
}));

export default accountsRouter;