// WKW - Client Side JS Wrapper for WaniKani API
var WKW = (function() {

    // Constructor for all other object prototypes.
    // Contains basic state and functionality (e.g., expiration and emptiness)
    // @time (Number) - the expiration time for this data type
    // @isEmpty (Boolean) - whether or not this object is "empty"
    // @apiResourceLoc (String) - the location of this data type from the API's URL
    // @userResourceLoc (String) - the name of this data type's key in the user object
    // @expiration (Number) - unix timestamp for account creation
    // @isExpired (fn) - returns whether or not this data has expired
    var Proto = function(expirationTime, apiResourceLoc, userResourceLoc) {
        this.time = expirationTime;
        this.isEmpty = true;
        this.apiResourceLoc = apiResourceLoc;
        this.userResourceLoc = userResourceLoc;
        this.expiration = new Date();
    };
    Proto.prototype.isExpired = function() { return new Date() - this.expiration > this.time; };

    // User Information Prototype (user.user_information)
    // @username (String) - username
    // @gravatar (String) - md5 gravatar
    // @level (Number) - user's level
    // @title (String) - user's title
    // @about (String) - user's about me
    // @website (String) - link to user's website
    // @twitter (String) - user's twitter handle
    // @topics_count (Number) - number of topics on message board
    // @posts_count (Number) - number of posts made by user
    // @creation_date (Number) - unix timestamp for account creation
    // @vacation_date (Number or null) - unix timestamp for vacation setting


    // Study Queue Prototype (user.study_queue)
    // @lessons_available (Number) - number of lessons currently available
    // @reviews_available (Number) - number of reviews currently available
    // @next_review_date (Number or null) - unix timestamp for next review (or null if vacation mode)
    // @reviews_available_next_hour (Number) - number of reviews available within the next hour
    // @reviews_available_next_day (Number) - number of reviews available within the next day


    // Level Progression Prototype (user.level_progression)
    // @radicals_progress (Number) - number of radicals completed for the current level
    // @radicals_total (Number) - total number of radicals for this level
    // @kanji_progress (Number) - number of kanji completed for the current level
    // @kanji_total (Number) - total number of kanji for this level


    // SRS Distribution Prototype (user.srs_distribution)
    // @apprentice (Object) - items at apprentice level
    // --@radicals (Number) - the number of radicals
    // --@kanji (Number) - the number of kanji
    // --@vocabulary (Number) - the number of vocabulary
    // --@total (Number) - the total number of items
    // @guru (Object) - items at guru level (same structure as apprentice)
    // @master (Object) - items at master level (same structure as apprentice)
    // @enlighten (Object) - items at enlighten level (same structure as apprentice)
    // @burned (Object) - items at burned level (same structure as apprentice)


    // Recent Unlocks List Prototype (user.recent_unlocks)
    // 3 different types of objects in here
    // --Common attributes--
    // @type (String) - type of item in list
    // @character (String) - the character(s) for this item
    // @meaning (String) - comma separated string of meanings
    // @level (Number) - the level at which this item was unlocked
    // @unlocked_date (Number) - unix timestamp for when this item was unlocked
    // --Vocabulary--
    // @kana (String) - the katakana or hiragana representation for this word
    // --Radical--
    // @image (String or null) - the URL of the image, if any (otherwise null)
    // --Kanji--
    // @onyomi (String) - the on'yomi reading for this kanji
    // @kunyomi (String) - the kun'yomi reading for this kanji
    // @nanori (String or null) - the nanori reading for this kanji
    // @important_reading (String) - which reading is important (onyomi, kunyomi, or nanori)


    // Critical Items List Prototype (user.critical_items)
    // 3 different types of objects in here
    // --Common attributes--
    // @type (String) - type of item in list
    // @character (String) - the character(s) for this item
    // @meaning (String) - comma separated string of meanings
    // @level (Number) - the level at which this item was unlocked
    // @percentage (Number) - what percentage this item has been reviewed correctly
    // --Vocabulary--
    // @kana (String) - the katakana or hiragana for this item
    // --Radical--
    // @image (String) - the url for this item
    // --Kanji--
    // @onyomi (String) - the on'yomi reading for this kanji
    // @kunyomi (String) - the kun'yomi reading for this kanji
    // @nanori (String or null) - the nanori reading for this kanji
    // @important_reading (String) - which reading is important (onyomi, kunyomi, or nanori)


    // Radicals List Prototype (user.radicals)
    // @character (String or null) - the character for this radical
    // @meaning (String) - the meaning of this radical
    // @image (String) - url for the image of this radical
    // @level (Number) - the level at which this radical was unlocked
    // @user_specific (Object) - user specific information
    // -- @srs (String) - the group this item is in (apprentice, guru, etc.)
    // -- @srs_numeric (Number) - tbd
    // -- @unlocked_date (Number) - unix timestamp for when this item was unlocked
    // -- @available_date (Number) - unix timestamp for when this item will be reviewed again
    // -- @burned (Boolean) - whether or not this item is burned
    // -- @burned_date (Number) - unix timestamp for when this item was burned (0 if not)
    // -- @meaning_correct (Number) - number of times meaning was answered correctly
    // -- @meaning_incorrect (Number) - number of times meaning was answered incorrectly
    // -- @meaning_max_streak (Number) - highest number of times meaning was answered correctly consecutively
    // -- @meaning_current_streak (Number) - current streak of consecutively correct answers
    // -- @reading_correct (Number or null) - number of times reading was answered correctly
    // -- @reading_incorrect (Number or null) - number of times reading was answered incorrectly
    // -- @reading_max_streak (Number or null) - highest number of times meaning was answered correctly consecutively
    // -- @reading_current_streak (Number or null) - current number of times meaning was answered correctly consecutively
    // -- @meaning_note (String or null) - user-created notes for meaning
    // -- @user_synonyms (Array or null) - user-created synonyms for this item

    // Kanji List Prototype (user.kanji)
    // @character (String) - character for this kanji
    // @meaning (String) - meaning(s) of this kanji
    // @onyomi (String) - on'yomi reading for this kanji
    // @kunyomi (String) - kun'yomi reading for this kanji
    // @nanori (String) - nanori reading for this kanji
    // @important_reading (String) - which reading is important (onyomi, kunyomi, or nanori)
    // @level (Number) - level at which this kanji was unlocked
    // @user_specific (Object) - user specific information (see user.radicals.user_specific)


    // Vocabulary List Prototype (user.vocabulary)
    // @character (String) - character for this word
    // @kana (String) - hiragana or katakana for this word
    // @meaning (String) - meaning(s) of this word
    // @level (Number) - level at which this item was unlocked
    // @user_specific (Object) - user specific information (see user.radicals.user_specific)


    // Retrieves data for given object.
    // @user (object) - the user object
    // @obj (object) - the object whose data needs to be retrieved
    // @callback (fn) - the callback function
    // @param (Number) - optional parameter
    var retrieveObjectData = function(user, obj, callback, param) {
        if (!isExpiredOrEmpty(obj) && typeof param === "undefined") { callback(); }
        var wk_url = "https://www.wanikani.com/api/user/" + user.key + "/" + obj.apiResourceLoc;
        if (typeof param !== "undefined") { wk_url += "/" + param; }
        $.getJSON(wk_url + "?callback=?", function(data) {
            var d;
            if (data.error) {
                callback(data);
            } else {
                if (obj.userResourceLoc === "user_information") {
                    for (d in data.user_information) {
                        user["user_information"][d] = data.user_information[d];
                    }
                } else {
                    for (d in data.requested_information) {
                        user[obj.userResourceLoc][d] = data.requested_information[d];
                    }
                }
                obj.isEmpty = false;
                obj.expiration = new Date();
                callback();
            }
        });
    };

    // Checks if an object is expired or empty.
    // @obj (Object) - object to check
    var isExpiredOrEmpty = function(obj) {
        return obj.isExpired() || obj.isEmpty;
    };

    // Checks if given numbers are valid for
    // certain parameters. E.g., levels, percentages, etc.
    // @numbers (String or Number) - numbers requested
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


    // Constructor for user objects.
    // @key (Number) - user's WK API key
    var User = function(api_key) {
        this.key = api_key,
        this.user_information = new Proto(21600000, "", "user_information");
        this.study_queue = new Proto(900000, "study-queue", "study_queue");
        this.level_progression = new Proto(900000, "level-progression", "level_progression");
        this.srs_distribution = new Proto(900000, "srs-distribution", "srs_distribution");
        this.recent_unlocks = new Proto(900000, "recent-unlocks", "recent_unlocks");
        this.critical_items = new Proto(900000, "critical-items", "critical_items");
        this.radicals = new Proto(900000, "radicals", "radicals");
        this.kanji = new Proto(900000, "kanji", "kanji");
        this.vocabulary = new Proto(900000, "vocabulary", "vocabulary");
    };

    // Retrieves the user's information.
    // @callback (fn) - callback function
    User.prototype.getUserInformation = function getUserInformation(callback) { retrieveObjectData(this, this.user_information, callback); };

    // Retrieves the user's study queue.
    // @callback (fn) - callback function
    User.prototype.getStudyQueue = function getStudyQueue(callback) { retrieveObjectData(this, this.study_queue, callback); };

    // Retrieves the user's level progression.
    // @callback (fn) - callback function.
    User.prototype.getLevelProgression = function getLevelProgression(callback) { retrieveObjectData(this, this.level_progression, callback); };

    // Retrieves the user's SRS distribution.
    // @callback (fn) - callback function.
    User.prototype.getSRSDistribution = function getSRSDistribution(callback) { retrieveObjectData(this, this.srs_distribution, callback); };

    // Retrieves the user's recent unlocks list.
    // @limit (Number) - limit for number of items returned
    // @callback (fn) - callback function.
    User.prototype.getRecentUnlocksList = function getRecentUnlocksList() {
        var args = Array.prototype.slice.call(arguments),
            // callback is always the last argument
            callback = args.pop(),
            limit = (args[0] && typeof args[0] === "string") ? args[0] : null;
        if (numbersAreValid(limit, 1, 100)) {
            retrieveObjectData(this, this.recent_unlocks, callback, limit);
        } else {
            retrieveObjectData(this, this.recent_unlocks, callback);
        }
    };

    // Retrieves the user's critical items list.
    // @percentage (Number) - percentage correct
    // @callback (fn) - callback function.
    User.prototype.getCriticalItemsList = function getCriticalItemsList() {
        var args = Array.prototype.slice.call(arguments),
            callback = args.pop(),
            percentage = (args[0] && typeof args[0] === "string") ? args[0] : null;
        if (numbersAreValid(percentage, 0, 100)) {
            retrieveObjectData(this, this.critical_items, callback, percentage);
        } else {
            retrieveObjectData(this, this.critical_items, callback);
        }
    };

    // Retrieves the user's radicals list.
    // @levels (String or Number) - radicals of given level(s)
    // @callback (fn) - callback function.
    User.prototype.getRadicalsList = function getRadicalsList() {
        var args = Array.prototype.slice.call(arguments),
            callback = args.pop(),
            levels = (args[0] && typeof args[0] === "string") ? args[0] : null;
        if (numbersAreValid(levels, 1, 60)) {
            retrieveObjectData(this, this.radicals, callback, levels);
        } else {
            retrieveObjectData(this, this.radicals, callback);
        }
    };

    // Retrieves the user's kanji list.
    // @levels (String or Number) - kanji of given level(s)
    // @callback (fn) - callback function.
    User.prototype.getKanjiList = function getKanjiList() {
        var args = Array.prototype.slice.call(arguments),
            callback = args.pop(),
            levels = (args[0] && typeof args[0] === "string") ? args[0] : null;
        if (numbersAreValid(levels, 1, 60)) {
            retrieveObjectData(this, this.kanji, callback, levels);
        } else {
            retrieveObjectData(this, this.kanji, callback);
        }
    };

    // Retrieves the user's voabulary list.
    // @levels (String or Number) - vocabulary of given level(s)
    // @callback (fn) - callback function.
    User.prototype.getVocabularyList = function getVocabularyList() {
        var args = Array.prototype.slice.call(arguments),
            callback = args.pop(),
            levels = (args[0] && typeof args[0] === "string") ? args[0] : null;
        if (numbersAreValid(levels, 1, 60)) {
            retrieveObjectData(this, this.vocabulary, callback, levels);
        } else {
            retrieveObjectData(this, this.vocabulary, callback);
        }
    };

    return {
        getUser: function(key) { return new User(key); }
    };

}());