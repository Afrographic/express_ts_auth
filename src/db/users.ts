import mongoose from "mongoose";

const User_Schema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, select: false },
        session_token: { type: String, select: false }
    }
})


export const User_Model = mongoose.model('User', User_Schema);

export const get_users = () => User_Model.find();
export const get_user_by_email = (email: string) => User_Model.findOne({ email });
export const get_user_by_session_token = (session_token: string) => User_Model.findOne({
    'authentication.session_token': session_token
})
export const get_user_by_id = (id: string) => User_Model.findById(id);
export const create_user = (values: Record<string, any>) => new User_Model(values).save().then((user) => user.toObject());
export const delete_user_by_id = (id: string) => User_Model.findOneAndDelete({ _id: id });
export const update_user_by_id = (id: string, values: Record<string, any>) => User_Model.findByIdAndUpdate(id, values);