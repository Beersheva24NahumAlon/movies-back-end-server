import express from "express";
import accountsService from "../service/AccountsService.js";
import asyncHandler from "express-async-handler";
import { valitator } from "../middleware/validation.js";
import { schemaEmail, schemaEmailPassword, schemaEmailRole, schemaEmailNamePassword } from "../validation/accountsSchemas.js";
import { checkAuthentication } from "../middleware/auth.js";
import accountsPaths from "../paths/accountsPaths.js";

const accountsRouter = express.Router();

accountsRouter.post("/admin", valitator(schemaEmailNamePassword, "body"), checkAuthentication(accountsPaths), asyncHandler(async (req, res) => {
    await accountsService.addAdminAccount(req.body);
    res.status(201).send("admin account added");
}));
accountsRouter.post("/user", valitator(schemaEmailNamePassword, "body"), checkAuthentication(accountsPaths), asyncHandler(async (req, res) => {
    await accountsService.addAccount(req.body);
    res.status(201).send("user account added");
}));
accountsRouter.put("/role", valitator(schemaEmailRole, "body"), checkAuthentication(accountsPaths), asyncHandler(async (req, res) => {
    res.send(await accountsService.setRole(req.body.email, req.body.role));
}));
accountsRouter.put("/password", valitator(schemaEmailPassword, "body"), checkAuthentication(accountsPaths), asyncHandler(async (req, res) => {
    await accountsService.updatePassword(req.body.email, req.body.password);
    res.send("password updated");
}));
accountsRouter.get("/:email", valitator(schemaEmail, "params"), checkAuthentication(accountsPaths), asyncHandler(async (req, res) => {
    res.send(await accountsService.getAccount(req.params.email));
}));
accountsRouter.put("/block/:email", valitator(schemaEmail, "params"), checkAuthentication(accountsPaths), asyncHandler(async (req, res) => {
    await accountsService.blockAccount(req.params.email);
    res.send("account blocked");
}));
accountsRouter.put("/unblock/:email", valitator(schemaEmail, "params"), checkAuthentication(accountsPaths), asyncHandler(async (req, res) => {
    await accountsService.unblockAccount(req.params.email);
    res.send("account unblocked");
}));
accountsRouter.post("/login", asyncHandler(async (req, res) => { 
    res.send(await accountsService.login(req.body.email, req.body.password));
}));
accountsRouter.delete("/:email", valitator(schemaEmail, "params"), checkAuthentication(accountsPaths), asyncHandler(async (req, res) => {
    await accountsService.deleteAccount(req.params.email);
    res.send("account deleted");
}));

export default accountsRouter;