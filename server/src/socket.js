"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uniqBy_1 = __importDefault(require("lodash/uniqBy"));
// const rooms: Record<string, { name: string; id: string }> = {};
const connectedUsers = new Map();
const socket = ({ io }) => {
    io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
        function joinToRoom(room, user) {
            // create users array, if key not exists
            if (!connectedUsers.has(room)) {
                connectedUsers.set(room, []);
            }
            // add user to room array
            connectedUsers.get(room).push(user);
            // call update function
            updateUsersList(room);
        }
        function leaveRoom(room, user) {
            let userList = connectedUsers.get(room);
            // delete user
            userList = userList.filter((u) => u.id !== user.id);
            // update user list
            if (!userList.length) {
                // delete key if no more users in room
                connectedUsers.delete(room);
            }
            else {
                connectedUsers.set(room, userList);
                // call update function
                updateUsersList(room);
            }
        }
        function updateUsersList(room) {
            // console.log("xxx", connectedUsers.get(room));
            let userList = connectedUsers.get(room);
            userList = (0, uniqBy_1.default)(userList, "id");
            io.to(room).emit("send_user_list", userList);
        }
        socket.on("join_room", (data) => {
            socket.join(data.room);
            joinToRoom(data.room, data.user);
        });
        socket.on("send_topic", (data) => {
            console.log("send_topic");
            io.to(data.room).emit("receive_topic");
        });
        socket.on("send_answer", (data) => {
            io.to(data.room).emit("receive_answer", data);
        });
        socket.on("send_result", (data) => {
            console.log("send_result");
            io.to(data.room).emit("receive_result", data);
        });
        // console.log("a user connected");
        // console.log(rooms);
        // socket.on("CREATE_ROOM", ({ roomName }) => {
        // 	// console.log({ roomName });
        // 	// create a roomId
        // 	const roomId = nanoid();
        // 	// add a new room to the rooms object
        // 	rooms[roomId] = {
        // 		name: roomName,
        // 		id: roomId,
        // 	};
        // 	// emit back to the room creator with all the rooms
        // 	socket.emit("ROOMS", rooms);
        // 	// emit event back the room creator saying they have joined a room
        // 	// socket.emit("JOINED_ROOM", roomId);
        // });
        // /*
        //  * When a user joins a room
        //  */
        // socket.on("JOIN_ROOM", (roomId) => {
        // 		// if (!answers.has(data.room)) {
        // 	answers.set(data.room, []);
        // }
        // const ifExists = answers
        // 	.get(data.room)
        // 	.some(
        // 		(a: { userId: string; topicId: number }) =>
        // 			a.userId === data.userId && a.topicId == Number(data.topicId)
        // 	);
        // if (!ifExists) {
        // 	answers.get(data.room).push(data);
        // } else {
        // 	answers
        // 		.get(data.room)
        // 		.map((obj: { userId: string }) =>
        // 			obj.userId === data.userId ? { ...obj, answer: data.answer } : obj
        // 		);
        // }
        // io.to(data.room).emit("receive_answer", answers.get(data.room));
        // });
    }));
};
exports.default = socket;
