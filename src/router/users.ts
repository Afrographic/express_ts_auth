import { is_authenticated, is_owner } from './../middlewares';
import { delete_user, get_all_users, update_user } from './../controllers/users';
import express from 'express';

export default (router: express.Router) => {
    router.get("/users", is_authenticated, get_all_users);
    router.delete("/users/:id", is_authenticated, is_owner, delete_user),
        router.patch("/users/:id", is_authenticated, is_owner, update_user)
}