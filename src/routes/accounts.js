import express from "express";
import accountsService from "../service/AccountsService.js";
import asyncHandler from "express-async-handler";
import { valitator } from "../middleware/validation.js";
import { schemaEmail, schemaUpdatePassword } from "../validation/accountsSchemas.js";


const accountsRouter = express.Router();

accountsRouter.post("/admin", asyncHandler(async (req, res) => {
    await accountsService.addAdminAccount(req.body);
    res.status(201).send("admin account added");
}));
accountsRouter.post("/user", asyncHandler(async (req, res) => {
    await accountsService.addAccount(req.body);
    res.status(201).send("user account added");
}));
accountsRouter.put("/role", asyncHandler(async (req, res) => {
    const account = await accountsService.setRole(req.body.email, req.body.role);
    res.send(account);
}));
accountsRouter.put("/password", asyncHandler(async (req, res) => {
    await accountsService.updatePassword(req.body.email, req.body.password);
    res.send("password updated");
}));
accountsRouter.get("/:email", valitator(schemaEmail), asyncHandler(async (req, res) => {
    const account = await accountsService.getAccount(req.params.email);
    res.send(account);
}));
accountsRouter.put("/block/:email", asyncHandler(async (req, res) => {
    await accountsService.blockAccount(req.params.email);
    res.send("account blocked");
}));
accountsRouter.put("/unblock/:email", asyncHandler(async (req, res) => {
    await accountsService.unblockAccount(req.params.email);
    res.send("account unblocked");
}));
accountsRouter.post("/login", asyncHandler(async (req, res) => {
    const token = await accountsService.login(req.body.email, req.body.password);
    res.send(token);
}));
accountsRouter.delete("/:email", asyncHandler(async (req, res) => {
    await accountsService.deleteAccount(req.params.email);
    res.send("account deleted");
}));

export default accountsRouter;