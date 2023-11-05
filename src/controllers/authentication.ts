
import { authentication, random } from '../helpers';
import { create_user, get_user_by_email } from './../db/users';
import express from 'express';

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.sendStatus(400);
        }

        const user = await get_user_by_email(email).select('+authentication.salt +authentication.password');

        if (!user) {
            return res.sendStatus(404);
        }

        const expected_hash = authentication(user.authentication.salt, password);

        if (user.authentication.password != expected_hash) {
            return res.sendStatus(404)
        }

        const salt = random();

        user.authentication.session_token = authentication(salt, user._id.toString());
        await user.save();

        res.cookie('TOKEN', user.authentication.session_token, { domain: 'localhost', path: "/" });

        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const register = async (req: express.Request, res: express.Response) => {
    try {

        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return res.sendStatus(400);
        }

        const existing_user = await get_user_by_email(email);
        if (existing_user) {
            return res.sendStatus(400);
        }

        const salt = random();
        const user = await create_user({
            email,
            username,  
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        });

        return res.status(200).json(user).end();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
} 