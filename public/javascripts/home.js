$(document).ready(function() {
	var submitButton = $("#submit"),
		keyInput = $("#key");
	submitButton.click(function() {
		var validKeyRegEx = /^([a-fA-F0-9]){32}$/,
			validKey = false,
			keyValue = keyInput.val(),
			wkUser;

		validKey = validKeyRegEx.exec(keyValue);
		if (validKey) {
			wkUser = WKW.getUser(keyValue);
		}
		if (wkUser) { // key was valid and we have a user
			wkUser.getUserInformation(function(error) {
				var displayTag = $("#userInformation"),
					userInfo,
					key;
				if (error && error.error && error.error.message) {
					displayTag.html(error.error.message);
				} else {
					displayTag.html("");
					// can safely assume we have the user information
					userInfo = wkUser.user_information;
					for (key in userInfo) {
						if (userInfo.hasOwnProperty(key)) {
							displayTag.append(key + ": " + userInfo[key] + "<br/>");
						}
					}
				}
			});
		}
	});
});