
import express from "express";
import { get, merge } from 'lodash';

import { get_user_by_session_token } from "./../db/users";

export const is_authenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const session_token = req.cookies["TOKEN"];
        if (!session_token) return res.sendStatus(403);

        const existing_user = await get_user_by_session_token(session_token);
        if (!existing_user) return res.sendStatus(403);

        merge(req, { identity: existing_user });
        
        return next();

    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
}

export const is_owner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { id } = req.params;
        const current_user_id = get(req, 'identity._id') as string;

        if (!current_user_id) {
            return res.sendStatus(403);
        }

        if (current_user_id.toString() != id) {
            return res.sendStatus(403);
        }

        return next();

    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
}
