import { nanoid } from "nanoid";
import { Server, Socket } from "socket.io";
import uniqBy from "lodash/uniqBy";

// const rooms: Record<string, { name: string; id: string }> = {};
const connectedUsers = new Map();

const socket = ({ io }: { io: Server }) => {
	io.on("connection", async (socket: Socket) => {
		function joinToRoom(room: string, user: any) {
			// create users array, if key not exists
			if (!connectedUsers.has(room)) {
				connectedUsers.set(room, []);
			}
			// add user to room array
			connectedUsers.get(room).push(user);

			// call update function
			updateUsersList(room);
		}

		function leaveRoom(room: string, user: any) {
			let userList = connectedUsers.get(room);
			// delete user
			userList = userList.filter((u: any) => u.id !== user.id);
			// update user list
			if (!userList.length) {
				// delete key if no more users in room
				connectedUsers.delete(room);
			} else {
				connectedUsers.set(room, userList);
				// call update function
				updateUsersList(room);
			}
		}

		function updateUsersList(room: string) {
			// console.log("xxx", connectedUsers.get(room));
			let userList = connectedUsers.get(room);
			userList = uniqBy(userList, "id");

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
	});
};

export default socket;
