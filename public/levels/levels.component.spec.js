describe('levels', function() {

    // Load the module that contains the `home` component before each test
    beforeEach(function() {
        module('levels');
    });

    // Test the controller
    describe('LevelsController', function() {
        var ctrl, $routeParams;

        beforeEach(inject(function($componentController, _$routeParams_) {
            $routeParams = _$routeParams_;
            $routeParams.userKey = "bbf426d6937cbb77d9f908c08d90c3ce";
            ctrl = $componentController("levels");
            spyOn($, 'getJSON').and.callFake(function (url, success) {
                switch (url) {
                case "https://www.wanikani.com/api/user/bbf426d6937cbb77d9f908c08d90c3ce/":
                    success({
                        "user_information": {
                            "username": "TestUser",
                            "gravatar": "bbf426d6937cbb77d9f908c08d90c3ce",
                            "level": 30,
                            "title": "Turtles",
                            "about": "",
                            "website": null,
                            "twitter": null,
                            "topics_count": 0,
                            "posts_count": 0,
                            "creation_date": 1388623423,
                            "vacation_date": null
                        }
                    });
                    break;
                case "https://www.wanikani.com/api/user/bbf426d6937cbb77d9f908c08d90c3ce/radicals":
                    success({
                        "user_information": {
                            "username": "TestUser",
                            "gravatar": "bbf426d6937cbb77d9f908c08d90c3ce",
                            "level": 30,
                            "title": "Turtles",
                            "about": "",
                            "website": null,
                            "twitter": null,
                            "topics_count": 0,
                            "posts_count": 0,
                            "creation_date": 1388623423,
                            "vacation_date": null
                        },
                        "requested_information": [
                            {
                              "character": "大",
                              "meaning": "stick",
                              "image": "https://s3.amazonaws.com/s3.wanikani.com/images/radicals/802e9542627291d4282601ded41ad16ce915f60f.png",
                              "level": 1,
                              "user_specific": {
                                "srs": "burned",
                                "srs_numeric": 9,
                                "unlocked_date": 1388623423,
                                "available_date": 1415811600,
                                "burned": true,
                                "burned_date": 1415816017,
                                "meaning_correct": 8,
                                "meaning_incorrect": 0,
                                "meaning_max_streak": 8,
                                "meaning_current_streak": 8,
                                "reading_correct": null,
                                "reading_incorrect": null,
                                "reading_max_streak": null,
                                "reading_current_streak": null,
                                "meaning_note": null,
                                "user_synonyms": null
                              }
                            },
                            {
                              "character": null,
                              "meaning": "gun",
                              "image": "https://s3.amazonaws.com/s3.wanikani.com/images/radicals/80fff71b321c8cee57db7224f5fe1daa331128b5.png",
                              "level": 1,
                              "user_specific": {
                                "srs": "burned",
                                "srs_numeric": 9,
                                "unlocked_date": 1388623423,
                                "available_date": 1416249900,
                                "burned": true,
                                "burned_date": 1416254179,
                                "meaning_correct": 8,
                                "meaning_incorrect": 0,
                                "meaning_max_streak": 8,
                                "meaning_current_streak": 8,
                                "reading_correct": null,
                                "reading_incorrect": null,
                                "reading_max_streak": null,
                                "reading_current_streak": null,
                                "meaning_note": null,
                                "user_synonyms": null
                              }
                            }
                        ]
                    });
                    break;
                case "https://www.wanikani.com/api/user/bbf426d6937cbb77d9f908c08d90c3ce/kanji":
                    success({
                        "user_information": {
                            "username": "TestUser",
                            "gravatar": "bbf426d6937cbb77d9f908c08d90c3ce",
                            "level": 30,
                            "title": "Turtles",
                            "about": "",
                            "website": null,
                            "twitter": null,
                            "topics_count": 0,
                            "posts_count": 0,
                            "creation_date": 1388623423,
                            "vacation_date": null
                        },
                        "requested_information": [
                            {
                              "character": "口",
                              "meaning": "mouth",
                              "onyomi": "こう, く",
                              "kunyomi": "くち",
                              "nanori": null,
                              "important_reading": "onyomi",
                              "level": 1,
                              "user_specific": {
                                "srs": "burned",
                                "srs_numeric": 9,
                                "unlocked_date": 1389199901,
                                "available_date": 1428127200,
                                "burned": true,
                                "burned_date": 1428131059,
                                "meaning_correct": 14,
                                "meaning_incorrect": 0,
                                "meaning_max_streak": 14,
                                "meaning_current_streak": 14,
                                "reading_correct": 14,
                                "reading_incorrect": 3,
                                "reading_max_streak": 7,
                                "reading_current_streak": 7,
                                "meaning_note": null,
                                "user_synonyms": null,
                                "reading_note": null
                              }
                            },
                            {
                              "character": "上",
                              "meaning": "above, up, over",
                              "onyomi": "じょう",
                              "kunyomi": "うえ, あ, のぼ, うわ",
                              "nanori": null,
                              "important_reading": "onyomi",
                              "level": 1,
                              "user_specific": {
                                "srs": "burned",
                                "srs_numeric": 9,
                                "unlocked_date": 1389199891,
                                "available_date": 1443235500,
                                "burned": true,
                                "burned_date": 1443239479,
                                "meaning_correct": 25,
                                "meaning_incorrect": 0,
                                "meaning_max_streak": 25,
                                "meaning_current_streak": 25,
                                "reading_correct": 25,
                                "reading_incorrect": 8,
                                "reading_max_streak": 6,
                                "reading_current_streak": 4,
                                "meaning_note": null,
                                "user_synonyms": null,
                                "reading_note": null
                              }
                            }
                        ]
                    });
                    break;
                case "https://www.wanikani.com/api/user/bbf426d6937cbb77d9f908c08d90c3ce/vocabulary":
                    success({
                        "user_information": {
                            "username": "TestUser",
                            "gravatar": "bbf426d6937cbb77d9f908c08d90c3ce",
                            "level": 30,
                            "title": "Turtles",
                            "about": "",
                            "website": null,
                            "twitter": null,
                            "topics_count": 0,
                            "posts_count": 0,
                            "creation_date": 1388623423,
                            "vacation_date": null
                        },
                        "requested_information": [
                            {
                              "character": "二",
                              "kana": "に",
                              "meaning": "two",
                              "level": 1,
                              "user_specific": {
                                "srs": "burned",
                                "srs_numeric": 9,
                                "unlocked_date": 1389657096,
                                "available_date": 1428974100,
                                "burned": true,
                                "burned_date": 1428977926,
                                "meaning_correct": 8,
                                "meaning_incorrect": 0,
                                "meaning_max_streak": 8,
                                "meaning_current_streak": 8,
                                "reading_correct": 8,
                                "reading_incorrect": 0,
                                "reading_max_streak": 8,
                                "reading_current_streak": 8,
                                "meaning_note": null,
                                "user_synonyms": null,
                                "reading_note": null
                              }
                            },
                            {
                              "character": "十",
                              "kana": "じゅう",
                              "meaning": "ten",
                              "level": 1,
                              "user_specific": {
                                "srs": "burned",
                                "srs_numeric": 9,
                                "unlocked_date": 1389657099,
                                "available_date": 1415812500,
                                "burned": true,
                                "burned_date": 1415816187,
                                "meaning_correct": 8,
                                "meaning_incorrect": 0,
                                "meaning_max_streak": 8,
                                "meaning_current_streak": 8,
                                "reading_correct": 8,
                                "reading_incorrect": 0,
                                "reading_max_streak": 8,
                                "reading_current_streak": 8,
                                "meaning_note": null,
                                "user_synonyms": null,
                                "reading_note": null
                              }
                            }
                        ]
                    });
                    break;
                default:
                    break;
                }
            });
        }));

        it("should load user information from the API automatically", function() {
            expect(ctrl.earliestRadicals).toEqual([]);
            expect(ctrl.levels).toEqual({});
            expect(ctrl.items).toEqual({});
            expect(ctrl.shown).toEqual("");
            expect(ctrl.itemsToShow).toEqual([]);
            setTimeout(() => {
                expect(ctrl.selected.level).toBe(1);
            });
        });

        it("should load radicals when the radical button is clicked", function() {
            setTimeout(() => {
                ctrl.showRadicals();
                expect(ctrl.itemsToShow.length).toBe(3);
                expect(ctrl.itemsToShow[0].type).toBe("radical");
            });
        });

        it("should load kanji when the kanji button is clicked", function() {
            setTimeout(() => {
                ctrl.showKanji();
                expect(ctrl.itemsToShow.length).toBe(3);
                expect(ctrl.itemsToShow[0].type).toBe("kanji");
            });
        });

        it("should load vocabulary when the vocabulary button is clicked", function() {
            setTimeout(() => {
                ctrl.showKanji();
                expect(ctrl.itemsToShow.length).toBe(3);
                expect(ctrl.itemsToShow[0].type).toBe("vocabulary");
            });
        });
    });
});