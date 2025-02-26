import { createError } from "../errors/errors.js";
import mongoConnection from "../db/MongoConnection.js";
import config from "config";
import bcrypt from "bcrypt";
import JwtUtils from "../security/JwtUtils.js"; 

const userRole = config.get("accounting.user_role");
const adminRole = config.get("accounting.admin_role");
const time_units = {
    "d": 1000 * 60 * 60 * 24,
    "h": 1000 * 60 * 60,
    "m": 1000 * 60,
    "s": 1000
}

class AccountsService {
    #accounts

    constructor() {
        this.#accounts = mongoConnection.getCollection(config.get("db.accounts_collection"));
    }

    async addAccount(account) {
        return this.#addAccountRole(account, userRole);
    }

    async addAdminAccount(account) {
        return this.#addAccountRole(account, adminRole);
    }

    async #addAccountRole(account, role) {
        if (account.email === process.env.SUPERUSER_NAME) {
            throw createError(409, `cann't create user with e-mail ${account.email}`);
        }
        const serviceAccount = this.#toServiceAccount(account, role);
        try {
            await this.#accounts.insertOne(serviceAccount);
            return serviceAccount;
        } catch (error) {
            throw createError(409, `user with e-mail ${account.email} already exists`);
        }
    }

    async getAccount(email) {
        const resAccount = await this.#accounts.findOne({ email });
        this.#throwNotFound(resAccount, email);
        return resAccount;
    }

    #throwNotFound(resAccount, email) {
        if (!resAccount) {
            throw createError(404, `user with e-mail ${email} doesn't exist`);
        }
    }

    async setRole(email, role) {
        const resAccount = await this.#accounts.findOneAndUpdate(
            { email: email },
            { $set: { role } },
            { returnDocument: "after" }
        );
        this.#throwNotFound(resAccount, email);
        return resAccount;
    }

    async updatePassword(email, password) {
        const serviceAccount = await this.getAccount(email);
        if (bcrypt.compareSync(password, serviceAccount.hashPassword)) {
            throw createError(400, `the new password should be diffenet from the existing one`);
        }
        serviceAccount.hashPassword = bcrypt.hashSync(password, config.get("accounting.salt_rounds"));
        serviceAccount.expiration = getExpiration();
        const resAccount = await this.#accounts.findOneAndUpdate(
            { email: email },
            { $set: serviceAccount },
            { returnDocument: "after" }
        );
        if (!resAccount) {
            createError(400, `the password hasn't changed`);
        }
    }

    async #blockUnblockAccount(email, block) {
        const resAccount = await this.#accounts.findOneAndUpdate(
            { email: email },
            { $set: { blocked: block} },
            { returnDocument: "after" }
        );
        this.#throwNotFound(resAccount, email);
    }

    async blockAccount(email) {
        this.#blockUnblockAccount(email, true);
    }

    async unblockAccount(email) {
        this.#blockUnblockAccount(email, false);
    }

    async deleteAccount(email) {
        const resAccount = await this.#accounts.findOneAndDelete({ email });
        this.#throwNotFound(resAccount, email);
    }

    async login(email, password) {
        const serviceAccount = await this.getAccount(email);
        await this.checkLogin(serviceAccount, password);
        return JwtUtils.getJwt(serviceAccount);
    }

    async checkLogin(serviceAccount, password) {
        if (!serviceAccount || ! await bcrypt.compare(password, serviceAccount.hashPassword)) {
            throw createError(400, "wrong credential");
        }
        if (new Date().getTime() > serviceAccount.expiration) {
            throw createError(400, "password expired");
        }
    }

    #toServiceAccount(account, role) {
        const hashPassword = bcrypt.hashSync(account.password, config.get("accounting.salt_rounds"));
        const expiration = getExpiration();
        const serviceAccount = { email: account.email, name: account.name ,role, hashPassword, expiration };
        return serviceAccount;
    }
}

function getExpiration() {
    const expiresIn = getExpiresIn();
    return new Date().getTime() + expiresIn;
}

export function getExpiresIn() {
    const expiredInStr = config.get("accounting.expired_in");
    const amount = expiredInStr.split(/\D/)[0];
    const parseArray = expiredInStr.split(/\d/);
    const index = parseArray.findIndex(e => !!e.trim());
    const unit = parseArray[index];
    const unitValue = time_units[unit];
    if (unitValue == undefined) {
        throw createError(500, `wrong configation: unit ${unit} doesn't exist`);
    }
    return amount * unitValue;
}

const accountsService = new AccountsService();
export default accountsService;