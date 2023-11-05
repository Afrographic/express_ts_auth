import { delete_user_by_id, get_user_by_id, get_users } from './../db/users';
import express from 'express';


export const get_all_users = async (req: express.Request, res: express.Response) => {
    try {
        let users = await get_users();
        return res.status(200).json(users).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const delete_user = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const deleted_user = await delete_user_by_id(id);
        console.log(deleted_user);
        return res.json(deleted_user);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const update_user = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { username } = req.body;
        if (!username) return res.sendStatus(400);

        const user = await get_user_by_id(id);

        user.username = username;
        await user.save();

        return res.sendStatus(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}