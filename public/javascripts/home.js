// Home page for WKStats
$(document).ready(function() {
    var submitButton = $("#submit"),
        keyInput = $("#key"),
        validKeyRegex = /^([a-fA-F0-9]){32}$/,
        validKey = false,
        apiKey,
        wkUser;

    var retrieveData = function retrieveData() {
        var keyValue = keyInput.val(),
            userDataKeys;
        validKey = validKeyRegex.exec(keyValue);

        if (typeof wkUser === "undefined" && validKey) {
            wkUser = WKW.getUser(keyValue);
        }

        if (wkUser) { // key was valid and we have a user
            wkUser.getRadicalsList().then(function(error) {
                var displayTag = $("#userInformation"),
                    userInfo,
                    key;
                if (error && error.error && error.error.message) {
                    displayTag.html(error.error.message);
                } else {
                    if (wkUser.radicals) {
                        var rad,
                            frag = document.createDocumentFragment(),
                            radicalCharacter,
                            radicalImage,
                            radicalLevel,
                            radicalMeaning;
                        for (rad in wkUser.radicals) {
                            radicalCharacter = "character: " + wkUser.radicals[rad].character;
                            radicalImage = "image: " + (wkUser.radicals[rad].image ? wkUser.radicals[rad].image : "");
                            radicalLevel = "level: " + wkUser.radicals[rad].level;
                            radicalMeaning = "meaning: " + wkUser.radicals[rad].meaning;
                            frag.appendChild(document.createTextNode("{"));
                            frag.appendChild(document.createElement("br"));
                            frag.appendChild(document.createTextNode(radicalCharacter));
                            frag.appendChild(document.createElement("br"));
                            frag.appendChild(document.createTextNode(radicalImage));
                            frag.appendChild(document.createElement("br"));
                            frag.appendChild(document.createTextNode(radicalLevel));
                            frag.appendChild(document.createElement("br"));
                            frag.appendChild(document.createTextNode(radicalMeaning));
                            frag.appendChild(document.createElement("br"));
                            frag.appendChild(document.createTextNode("}"));
                        }
                        displayTag.append(frag);
                        displayTag.removeClass('hidden');
                    }
                }
            });
        }
    };

    submitButton.click(retrieveData);
});