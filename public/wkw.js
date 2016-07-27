/**
* WKW - Client Side JS Wrapper for WaniKani API
* @property {function} getUser - takes an api key and returns a user object
*/
var WKW = (function(global) {
    var users = {},
        debug_mode = false;
    if (global.wkw_debug) { debug_mode = true; }

    /**
    * Prototype for user's data objects.
    * Contains basic state and functionality (e.g., expiration and emptiness).
    * @property {number}    time            - the expiration time for this data type
    * @property {boolean}   isEmpty         - whether or not this object is "empty"
    * @property {string}    apiResourceLoc  - the location of this data type from the API's URL
    * @property {string}    userResourceLoc - the name of this data type's key in the user object
    * @property {number}    expiration      - unix timestamp for when this object was created
    * @property {function}  isExpired       - returns whether or not this data has expired
    */
    var proto = {
        time: 900000,
        isEmpty: true,
        apiResourceLoc: "",
        userResourceLoc: "",
        expiration: new Date(),
        isExpired: function() { return new Date() - this.expiration > this.time; }
    };

    /**
    * Factory function for objects that have proto as their prototype.
    * @param {object} overrides - properties to overwrite in this object's prototype
    * @returns {object} an object whose prototype is proto
    */
    var makeProto = function(overrides) {
        var key, result, spec = {};
        for (key in overrides) {
            spec[key] = { value: overrides[key] };
        }
        result = Object.create(proto, spec);
        return result;
    };

    /**
    * User information prototype (user.user_information)
    * @property {string} username - user's username
    * @property {string} gravatar - md5 gravatar hash for user's avatar
    * @property {number} level - user's level
    * @property {string} title - user's title
    * @property {string} about - user's about me
    * @property {string} website - user's website URL
    * @property {string} twitter - user's twitter handle
    * @property {number} topics_count - number of topics on message board
    * @property {number} posts_count - number of posts made by user
    * @property {number} creation_date - unix timestamp for account creation
    * @property {number | null} vacation_date - unix timestamp for vacation setting
    */
    var userInformationProto = makeProto({ apiResourceLoc: "", userResourceLoc: "user_information" });
    userInformationProto.getAvatar = function() {
        return "https://gravatar.com/avatar/" + this.gravatar;
    };

    /**
    * Study queue prototype (user.study_queue)
    * @property {number} lessons_available - number of lessons currently available
    * @property {number} reviews_available - number of reviews currently available
    * @property {number | null} next_review_date - unix timestamp for next review (or null if vacation mode)
    * @property {number} reviews_available_next_hour - number of reviews available within the next hour
    * @property {number} reviews_available_next_day - number of reviews available within the next day
    */
    var studyQueueProto = makeProto({ apiResourceLoc: "study-queue", userResourceLoc: "study_queue" });

    /**
    * Level progression prototype (user.level_progression)
    * @property {number} radicals_progress - number of radicals completed for the current level
    * @property {number} radicals_total - total number of radicals for this level
    * @property {number} kanji_progress - number of kanji completed for the current level
    * @property {number} kanji_total - total number of kanji for this level
    */
    var levelProgressionProto = makeProto({ apiResourceLoc: "level-progression", userResourceLoc: "level_progression" });

    /**
    * SRS distribution prototype (user.srs_distribution)
    * @property {object} apprentice - items at apprentice level
    * @property {number} apprentice.radicals - the number of radicals
    * @property {number} apprentice.kanji - the number of kanji
    * @property {number} apprentice.vocabulary - the number of vocabulary
    * @property {number} apprentice.total - the total number of items
    * @property {object} guru - items at guru level (same structure as apprentice)
    * @property {object} master - items at master level (same structure as apprentice)
    * @property {object} enlighten - items at enlighten level (same structure as apprentice)
    * @property {object} burned - items at burned level (same structure as apprentice)
    */
    var srsDistributionProto = makeProto({ apiResourceLoc: "srs-distribution", userResourceLoc: "srs_distribution" });
    var sumByItem = function(item) {
        var type, sum = 0;
        for (type in this) {
            if (this.hasOwnProperty(type) && typeof this[type] === "object") {
                if (this[type][item]) {
                    sum += this[type][item];
                }
            }
        }
        return sum;
    };
    // need to overwrite the function, can't bind the prototype object here
    // TODO: refactor this
    srsDistributionProto.totalRadicals = function() { 
        this.totalRadicals = sumByItem.bind(this, "radicals");
        return sumByItem.call(this, "radicals");
    };
    srsDistributionProto.totalKanji = function() {
        this.totalKanji = sumByItem.bind(this, "kanji");
        return sumByItem.call(this, "kanji");
    };
    srsDistributionProto.totalVocabulary = function() {
        this.totalVocabulary = sumByItem.bind(this, "vocabulary");
        return sumByItem.call(this, "vocabulary");
    };
    srsDistributionProto.totalItems = function() {
        this.totalItems = sumByItem.bind(this, "total");
        return sumByItem.call(this, "total");
    };

    /** 
    * Simple list interface object that provides useful functionality
    * to list data objects.
    */
    var listInterface = {
        /** 
        * Returns an array of objects whose specified properties
        * have the specified value.
        * @param {string} prop - the property of each object to look under
        * @param {string} value - the value to look for of said property
        * @returns {array} contains objects whose `prop` are `value`
        */
        getBy: function(prop, value) {
            var item, result = [];
            for (item in this) {
                if (this.hasOwnProperty(item) && typeof this[item] === "object") {
                    if (this[item][prop] && this[item][prop] === value) {
                        result.push(this[item]);
                    }
                }
            }
            return result;
        }
    };

    /**
    * Recent unlocks list prototype (user.recent_unlocks)
    * 3 different types of objects in here
    * For an example of the objects stored, please see the {@link http://wanikani.com/api|WaniKani API}.
    */
    var recentUnlocksProto = makeProto({ apiResourceLoc: "recent-unlocks", userResourceLoc: "recent_unlocks" });
    /** 
    * See {@link listInterface}
    */
    recentUnlocksProto.getBy = listInterface.getBy;
    /** 
    * @returns {array} containing all radicals in this
    */
    recentUnlocksProto.getRadicals = function() { return this.getBy("type", "radical"); };
    /** 
    * @returns {array} containing all kanji in this
    */
    recentUnlocksProto.getKanji = function() { return this.getBy("type", "kanji"); };
    /** 
    * @returns {array} containing all vocabulary in this
    */
    recentUnlocksProto.getVocabulary = function() { return this.getBy("type", "vocabulary"); };
    /**
    * @param {string} character - desired character
    * @returns {array} containing all items in this with the given character
    */
    recentUnlocksProto.getByCharacter = function(character) { return this.getBy("character", character); };
    /**
    * @param {string} meaning - desired meaning
    * @returns {array} containing all items in this with the given meaning
    */
    recentUnlocksProto.getByMeaning = function(meaning) { return this.getBy("meaning", meaning); };
    /**
    * @param {number} level - desired level
    * @returns {array} containing all items in this with the given level
    */
    recentUnlocksProto.getByLevel = function(level) { return this.getBy("level", level); };
    /**
    * @param {number} unlocked_date - desired unlocked_date
    * @returns {array} containing all items in this with the given unlocked date
    */
    recentUnlocksProto.getByUnlockedDate = function(unlocked_date) { return this.getBy("unlocked_date", unlocked_date); };

    /**
    * Critical items list prototype (user.critical_items)
    * 3 different types of objects in here
    * For an example of the objects stored, please see the {@link http://wanikani.com/api|WaniKani API}.
    */
    var criticalItemsProto = makeProto({ apiResourceLoc: "critical-items", userResourceLoc: "critical_items" });
    /** 
    * See {@link listInterface}
    */
    criticalItemsProto.getBy = listInterface.getBy;
    /** 
    * @returns {array} containing all radicals in this
    */
    criticalItemsProto.getRadicals = function() { return this.getBy("type", "radical"); };
    /** 
    * @returns {array} containing all kanji in this
    */
    criticalItemsProto.getKanji = function() { return this.getBy("type", "kanji"); };
    /** 
    * @returns {array} containing all vocabulary in this
    */
    criticalItemsProto.getVocabulary = function() { return this.getBy("type", "vocabulary"); };
    /**
    * @param {string} character - desired character
    * @returns {array} containing all items in this with the given character
    */
    criticalItemsProto.getByCharacter = function(character) { return this.getBy("character", character); };
    /**
    * @param {string} meaning - desired meaning
    * @returns {array} containing all items in this with the given meaning
    */
    criticalItemsProto.getByMeaning = function(meaning) { return this.getBy("meaning", meaning); };
    /**
    * @param {number} level - desired level
    * @returns {array} containing all items in this with the given level
    */
    criticalItemsProto.getByLevel = function(level) { return this.getBy("level", level); };
    /**
    * @param {number} percentage - desired percentage
    * @returns {array} containing all items in this with the given percentage
    */
    criticalItemsProto.getByPercentage = function(percentage) { return this.getBy("percentage", percentage); };

    /**
    * Radicals list prototype (user.radicals)
    * For an example of the objects stored, please see the {@link http://wanikani.com/api|WaniKani API}.
    */
    var radicalsProto = makeProto({ apiResourceLoc: "radicals", userResourceLoc: "radicals" });
    /** 
    * See {@link listInterface}
    */
    radicalsProto.getBy = listInterface.getBy;
    /**
    * @param {string} character - desired character
    * @returns {array} containing all items in this with the given character
    */
    radicalsProto.getByCharacter = function(character) { return this.getBy("character", character); };
    /**
    * @param {string} meaning - desired meaning
    * @returns {array} containing all items in this with the given meaning
    */
    radicalsProto.getByMeaning = function(meaning) { return this.getBy("meaning", meaning); };
    /**
    * @param {string} image - desired image URL
    * @returns {array} containing all items in this with the given image url
    */
    radicalsProto.getByImage = function(image) { return this.getBy("image", image); };
    /**
    * @param {number} level - desired level
    * @returns {array} containing all items in this with the given level
    */
    radicalsProto.getByLevel = function(level) { return this.getBy("level", level); };

    /**
    * Kanji list prototype (user.kanji)
    * For an example of the objects stored, please see the {@link http://wanikani.com/api|WaniKani API}.
    */
    var kanjiProto = makeProto({ apiResourceLoc: "kanji", userResourceLoc: "kanji" });
    /** 
    * See {@link listInterface}
    */
    kanjiProto.getBy = listInterface.getBy;
    /**
    * @param {string} character - desired character
    * @returns {array} containing all items in this with the given character
    */
    kanjiProto.getByCharacter = function(character) { return this.getBy("character", character); };
    /**
    * @param {string} meaning - desired meaning
    * @returns {array} containing all items in this with the given meaning
    */
    kanjiProto.getByMeaning = function(meaning) { return this.getBy("meaning", meaning); };
    /**
    * @param {string} important_reading - desired important reading
    * @returns {array} containing all items in this with given reading
    */
    kanjiProto.getByImportantReading = function(important_reading) { return this.getBy("important_reading", important_reading); };
    /**
    * @param {number} level - desired level
    * @returns {array} containing all items in this with the given level
    */
    kanjiProto.getByLevel = function(level) { return this.getBy("level", level); };

    /**
    * Vocabulary list prototype (user.vocabulary)
    * For an example of the objects stored, please see the {@link http://wanikani.com/api|WaniKani API}.
    */
    var vocabularyProto = makeProto({ apiResourceLoc: "vocabulary", userResourceLoc: "vocabulary" });
    /** 
    * See {@link listInterface}
    */
    vocabularyProto.getBy = listInterface.getBy;
    /**
    * @param {string} character - desired character
    * @returns {array} containing all items in this with the given character
    */
    vocabularyProto.getByCharacter = function(character) { return this.getBy("character", character); };
    /**
    * @param {string} kana - desired hiragana or katakana
    * @returns {array} containing all items in this with the given kana
    */
    vocabularyProto.getByKana = function(kana) { return this.getBy("kana", kana); };
    /**
    * @param {string} meaning - desired meaning
    * @returns {array} containing all items in this with the given meaning
    */
    vocabularyProto.getByMeaning = function(meaning) { return this.getBy("meaning", meaning); };
    /**
    * @param {number} level - desired level
    * @returns {array} containing all items in this with the given level
    */
    vocabularyProto.getByLevel = function(level) { return this.getBy("level", level); };

    /**
    * Performs a deep copy on parent over to child.
    * Catches objects / arrays.
    * @param {object} parent - the object to be copied from
    * @param {object} child - the object to copy to
    */
    var deepCopy = function(parent, child) {
        var i,
            toStr = Object.prototype.toString,
            astr = "[object Array]";

        child = child || {};

        for (i in parent) {
            if (parent.hasOwnProperty(i)) {
                if (typeof parent[i] === "object") {
                    child[i] = (toStr.call(parent[i]) === astr) ? [] : {};
                    deepCopy(parent[i], child[i]);
                } else {
                    child[i] = parent[i];
                }
            }
        }
    };

    /**
    * Updates rate limiting information
    * before making a request to the API.
    * @param {object} user - the user object
    */
    var updateRateLimiting = function updateRateLimiting(user) {
        if (new Date() - user.first_request_date >= 3600000) { // past an hour, so reset
            user.first_request_date = new Date();
            user.num_requests_made = 1;
        } else {
            user.num_requests_made += 1;
        }
    };

    /**
    * Retrieves data for given object.
    * Takes a spec object with the following
    * attributes:
    * @param {object} spec - spec object for passing params
    * @param {object} spec.user - the user object
    * @param {object} spec.obj - the object whose data needs to be retrieved
    * @param {number} spec.param - optional parameter (e.g., percentages, levels, etc.)
    * @param {boolean} spec.force - optional param to force the api call regardless of rate limiting
    * @return {object} a Promise object
    */
    var retrieveObjectData = function(spec) {
        return new Promise(function(resolve, reject) {
            // no need to refresh so callback
            if (!isExpiredOrEmpty(spec.obj) && typeof spec.param === "undefined" && !spec.force) { resolve(); }
            // callback if rate limited
            if (spec.user.isRateLimited() && !spec.force) {
                var error = {
                    "error": {
                        "code": "rate_limited",
                        "message": "403 Forbidden (Rate Limit Exceeded)"
                    }
                };
                reject(error);
            }
            updateRateLimiting(spec.user);
            var wk_url = "https://www.wanikani.com/api/user/" + spec.user.key + "/" + spec.obj.apiResourceLoc;
            if (typeof spec.param !== "undefined") { wk_url += "/" + spec.param; }
            $.getJSON(wk_url + (debug_mode ? "" : "?callback=?"), function(data) {
                var d;
                if (data.error) {
                    reject(data);
                } else {
                    if (spec.obj.userResourceLoc === "user_information") {
                        deepCopy(data.user_information, spec.user.user_information);
                    } else if (spec.obj.userResourceLoc === "vocabulary") {
                        deepCopy(data.requested_information.general, spec.user[spec.obj.userResourceLoc]);
                    } else {
                        deepCopy(data.requested_information, spec.user[spec.obj.userResourceLoc]);
                    }
                    spec.obj.isEmpty = false;
                    spec.obj.expiration = new Date();
                    saveUsers();
                    resolve();
                }
            });
        });
    };

    /**
    * Checks if an object is expired or empty.
    * @param {object} obj - object to check
    * @returns {boolean} whether or not the object is expired or empty
    */
    var isExpiredOrEmpty = function(obj) {
        return obj.isExpired() || obj.isEmpty;
    };

    /**
    * Checks if given numbers are valid for
    * certain parameters. (e.g., levels, percentages, etc.)
    * @param {string|number} numbers - numbers requested
    * @param {number} min - the min the numbers can be
    * @param {number} max - the max the numbers can be
    * @returns {boolean} whether or not the given numbers are valid
    */
    var numbersAreValid = function(numbers, min, max) {
        var givenNumbers,
            numsAreValid,
            num;
        if (typeof numbers === "number" && numbers >= min && numbers <= max) {
            return true;
        } else if (typeof numbers === "string") {
            givenNumbers = numbers.split(",");
            numsAreValid = true;
            for (num in givenNumbers) {
                if (givenNumbers[num] < min || givenNumbers[num] > max) {
                    numsAreValid = false;
                    break;
                }
            }
            return numsAreValid;
        }
        return false;
    };

    /**
    * @returns {object} a spec object for any given getter method
    * which should be handed over to retrieveObjectData.
    */
    var getSpecObject = function getSpecObject() {
        var args = Array.prototype.slice.call(arguments),
            // data type is always the last argument
            type = args.pop(),
            param = (args[0] && typeof args[0] === "string") ? args[0] : null,
            force,
            spec;
        if (param) {
            force = (args[1] && typeof args[1] === "boolean") ? args[1] : null;
        } else {
            force = (args[0] && typeof args[0] === "boolean") ? args[0] : null;
        }
        spec = {
            "user": this,
            "obj": this[type],
            "force": force
        };
        // add optional param if valid
        switch (type) {
        case "recent_unlocks":
            if (numbersAreValid(param, 1, 100)) { spec.param = param; }
            break;
        case "critical_items":
            if (numbersAreValid(param, 0, 100)) { spec.param = param; }
            break;
        case "radicals":
            if (numbersAreValid(param, 1, 60)) { spec.param = param; }
            break;
        case "kanji":
            if (numbersAreValid(param, 1, 60)) { spec.param = param; }
            break;
        case "vocabulary":
            if (numbersAreValid(param, 1, 60)) { spec.param = param; }
            break;
        default:
            break;
        }
        return spec;
    };

    /**
    * prototype object for users
    */
    var user = {
        /**
        * @returns {boolean} true if the user is rate limited, false otherwise.
        */
        isRateLimited: function isRateLimited() {
            if (this.first_request_date === 0) { return false; } // never made a request
            if (this.num_requests_made >= 100) { return true; } // over the limit
        },

        /**
        * Retrieves the user's information.
        * @param {boolean} force - whether or not to force the call to the api
        * @returns {object} a Promise object
        */
        getUserInformation: function getUserInformation() {
            // add type to arguments before getting spec
            [].push.call(arguments, "user_information");
            var spec = getSpecObject.apply(this, arguments);
            return retrieveObjectData(spec);
        },

        /**
        * Retrieves the user's study queue.
        * @param {boolean} force - whether or not to force the call to the api
        * @returns {object} a Promise object
        */
        getStudyQueue: function getStudyQueue() {
            // add type to arguments before getting spec
            [].push.call(arguments, "study_queue");
            var spec = getSpecObject.apply(this, arguments);
            return retrieveObjectData(spec);
        },

        /**
        * Retrieves the user's level progression.
        * @param {boolean} force - whether or not to force the call to the api
        * @returns {object} a Promise object
        */
        getLevelProgression: function getLevelProgression() {
            // add type to arguments before getting spec
            [].push.call(arguments, "level_progression");
            var spec = getSpecObject.apply(this, arguments);
            return retrieveObjectData(spec);
        },

        /**
        * Retrieves the user's SRS distribution.
        * @param {boolean} force - whether or not to force the call to the api
        * @returns {object} a Promise object
        */
        getSRSDistribution: function getSRSDistribution() {
            // add type to arguments before getting spec
            [].push.call(arguments, "srs_distribution");
            var spec = getSpecObject.apply(this, arguments);
            return retrieveObjectData(spec);
        },

        /**
        * Retrieves the user's recent unlocks list.
        * @param {string} limit - limit for number of items returned
        * @param {boolean} force - whether or not to force the call to the api
        * @returns {object} a Promise object
        */
        getRecentUnlocksList: function getRecentUnlocksList() {
            // add type to arguments before getting spec
            [].push.call(arguments, "recent_unlocks");
            var spec = getSpecObject.apply(this, arguments);
            return retrieveObjectData(spec);
        },

        /**
        * Retrieves the user's critical items list.
        * @param {string} percentage - percentage correct
        * @param {boolean} force - whether or not to force the call to the api
        * @returns {object} a Promise object
        */
        getCriticalItemsList: function getCriticalItemsList() {
            // add type to arguments before getting spec
            [].push.call(arguments, "critical_items");
            var spec = getSpecObject.apply(this, arguments);
            return retrieveObjectData(spec);
        },

        /**
        * Retrieves the user's radicals list.
        * @param {string} levels - radicals of given level(s)
        * @param {boolean} force - whether or not to force the call to the api
        * @returns {object} a Promise object
        */
        getRadicalsList: function getRadicalsList() {
            // add type to arguments before getting spec
            [].push.call(arguments, "radicals");
            var spec = getSpecObject.apply(this, arguments);
            return retrieveObjectData(spec);
        },

        /**
        * Retrieves the user's kanji list.
        * @param {string} levels - kanji of given level(s)
        * @param {boolean} force - whether or not to force the call to the api
        * @returns {object} a Promise object
        */
        getKanjiList: function getKanjiList() {
            // add type to arguments before getting spec
            [].push.call(arguments, "kanji");
            var spec = getSpecObject.apply(this, arguments);
            return retrieveObjectData(spec);
        },

        /**
        * Retrieves the user's voabulary list.
        * @param {string | number} levels - vocabulary of given level(s)
        * @param {boolean} force - whether or not to force the call to the api
        * @returns {object} a Promise object
        */
        getVocabularyList: function getVocabularyList() {
            // add type to arguments before getting spec
            [].push.call(arguments, "vocabulary");
            var spec = getSpecObject.apply(this, arguments);
            return retrieveObjectData(spec);
        },

        /**
        * Retrieves all data for the user.
        * @returns {object} a Promise object
        */
        getAllData: function getAllData() {
            var name,
                errors = [],
                success = true,
                callsFinished = 0,
                arrayOfPromises = [],
                funcNames = ["getUserInformation", "getStudyQueue",
                            "getLevelProgression", "getSRSDistribution", 
                            "getRecentUnlocksList", "getCriticalItemsList", 
                            "getRadicalsList", "getKanjiList", "getVocabularyList"];
            for (name in funcNames) {
                arrayOfPromises.push(this[funcNames[name]]());
            }
            return Promise.all(arrayOfPromises);
        }
    };


    /**
    * Factory for user objects.
    * @param {number} api_key - user's WK API key
    * @returns {object} a User object
    */
    var getUser = function(api_key) {
        if (users[api_key]) { return users[api_key]; }
        var result = Object.create(user);
        result.key = api_key;
        result.first_request_date = 0;
        result.num_requests_made = 0;
        result.user_information = Object.create(userInformationProto);
        result.study_queue = Object.create(studyQueueProto);
        result.level_progression = Object.create(levelProgressionProto);
        result.srs_distribution = Object.create(srsDistributionProto);
        result.recent_unlocks = Object.create(recentUnlocksProto);
        result.critical_items = Object.create(criticalItemsProto);
        result.radicals = Object.create(radicalsProto);
        result.kanji = Object.create(kanjiProto);
        result.vocabulary = Object.create(vocabularyProto);
        users[api_key] = result;
        return result;
    };

    /**
    * Tests whether or not browser supports local storage.
    * @returns {boolean} true if supported, false otherwise
    */
    var storageAvailable = function(type) {
        try {
            var storage = window[type],
                x = "__storage_test__";
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch(e) {
            return false;
        }
    };

    /**
    * Retrieves any data from localStorage and
    * keeps a local cache inside the users object.
    * Called on initializing WKW and available in debug.
    */
    var getStoredData = function() {
        var user,
            item,
            tempUser,
            storedUser,
            wkwStorage;
        if (storageAvailable("localStorage")) {
            wkwStorage = localStorage.getItem("WKW");
            if (wkwStorage) {
                wkwStorage = JSON.parse(wkwStorage);
                // stored users have no functionality from the get-go
                // so we need to make one with the same api key
                // and perform a deep copy from the stored data
                for (user in wkwStorage) {
                    tempUser = getUser(user);
                    storedUser = wkwStorage[user];
                    // if we deep copied the users the data objects
                    // would lose their prototypes
                    for (item in storedUser) {
                        deepCopy(storedUser[item], tempUser[item]);
                    }
                    users[tempUser.key] = tempUser;
                }
            }
        }
    };

    /**
    * Saves the local cache of users (the users object)
    * in localStorage. Called after any data is updated.
    */
    var saveUsers = function() {
        var user,
            wkwStorage = {};
        if (storageAvailable("localStorage")) {
            localStorage.removeItem("WKW");
            // build up object to store
            for (user in users) {
                wkwStorage[users[user].key] = users[user];
            }
            localStorage.setItem("WKW", JSON.stringify(wkwStorage));
        }
    };

    getStoredData();

    if (debug_mode) {
        return {
            getUser: getUser,
            getStoredData: getStoredData
        };
    } else {
        return {
            getUser: getUser
        };
    }

}(this));