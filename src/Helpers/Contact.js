
//helper for add private chat 
{// const participantIds = [currentUserId, targetUserId];
// const existPrivateChat = await privateModel.find({
// 	participants: { $all: participantIds },
// });
// console.log(!existPrivateChat[0]);
// if (!existPrivateChat[0]) {
// 	const privateChat = await privateModel.create({
// 		participants: participantIds,
// 	});
// 	currentUserContact.chatList.push({
// 		type: "Private",
// 		chat: privateChat._id,
// 	});
// 	targetUserContact.chatList.push({
// 		type: "Private",
// 		chat: privateChat._id,
// 	});
// }
// console.log(currentUserContact);
// await Promise.all([currentUserContact.save(), targetUserContact.save()]);
}

	// helper for update the follow status
	{	// console.log(currentUserContact.followings.includes(targetUserId));
		// if (currentUserContact.followings.includes(targetUserId)) {
		// 	const updatedStatus = currentUserContact.followings.filter(
		// 		(id) => !id.equals(targetUserId)
		// 	);
		// 	currentUserContact.followings = updatedStatus;
		// } else currentUserContact.followings.push(targetUserId);

		// console.log(targetUserContact.followers.includes(currentUserId));
		// if (targetUserContact.followers.includes(currentUserId)) {
		// 	const updatedStatus = targetUserContact.followers.filter(
		// 		(id) => !id.equals(currentUserId)
		// 	);
		// 	targetUserContact.followers = updatedStatus;
		// } else targetUserContact.followers.push(currentUserId);
}