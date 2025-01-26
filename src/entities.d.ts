interface IRoom {
    id: number;
    name: string;
    users: IUser[];
}
interface IMessage {
    id: number;
    text: string;
    user: IUser;
    room: IRoom;
    createdAt: Date;
    replyTo?: IMessage;
}

export { IRoom, IMessage };