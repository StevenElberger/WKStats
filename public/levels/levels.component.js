'use strict'

angular.
    module('levels').
    component('levels', {
        templateUrl: 'levels/levels.template.html',
        controller: ['$scope', '$q', '$routeParams',
            function LevelsController($scope, $q, $routeParams) {
                var self = this,
                    user = WKW.getUser($routeParams.userKey),
                    level;
                // stores earliest unlocked dates for each level
                self.earliestRadicals = [];
                // stores information about each level
                self.levels = {};
                // which level is being shown
                self.selectedLevel = "1";
                // which type is being shown
                self.selectedType = "radicalsItems";

                self.showRadicals = function showRadicals() {
                    self.selectedType = "radicalsItems";
                };

                self.showKanji = function showKanji() {
                    self.selectedType = "kanjiItems";
                };

                self.showVocab = function showVocab() {
                    self.selectedType = "vocabularyItems";
                };

                // gathers data from the API and prepares it for display
                $q.when(user.getUserInformation()).then(function(error) {
                    level = user.user_information.level;
                }).then(user.getRadicalsList()).then(function(error) {
                    var i, j, radicals, earliest, currentDate;
                    
                    // tally radicals per level
                    for (i = 1; i <= level; i += 1) {
                        radicals = user.radicals.getByLevel(i);
                        self.levels[i] = {
                            "level": i,
                            "apprenticeCount": 0,
                            "apprenticeItems": [],
                            "guruCount": 0,
                            "guruItems": [],
                            "masterCount": 0,
                            "masterItems": [],
                            "enlightenCount": 0,
                            "enlightenItems": [],
                            "burnedCount": 0,
                            "burnedItems": [],
                            "radicalsCount": 0,
                            "radicalsItems": [],
                            "kanjiCount": 0,
                            "kanjiItems": [],
                            "vocabularyCount": 0,
                            "vocabularyItems": []
                        };
                        // adds necessary property for presenting characters correctly
                        for (j = 0; j < radicals.length; j += 1) {
                            if (Object.keys(radicals[j].character).length === 0 
                                && radicals[j].character.constructor === Object) {
                                radicals[j].hasCharacter = false;
                            } else {
                                radicals[j].hasCharacter = true;
                            }
                        }
                        self.levels[i]["radicalsItems"] = radicals;
                        earliest = Infinity;
                        // identify earliest radical at that level
                        for (j = 0; j < radicals.length; j += 1) {
                            currentDate = radicals[j].user_specific.unlocked_date;
                            if (currentDate < earliest
                                && !(self.earliestRadicals.indexOf(currentDate) > -1)) {
                                earliest = radicals[j].user_specific.unlocked_date;
                            }
                            switch(radicals[j].user_specific.srs) {
                            case "apprentice":
                                self.levels[i]["apprenticeCount"] += 1;
                                break;
                            case "guru":
                                self.levels[i]["guruCount"] += 1;
                                break;
                            case "master":
                                self.levels[i]["masterCount"] += 1;
                                break;
                            case "enlighten":
                                self.levels[i]["enlightenCount"] += 1;
                                break;
                            case "burned":
                                self.levels[i]["burnedCount"] += 1;
                                break;
                            default:
                                break;
                            }
                            self.levels[i]["radicalsCount"] += 1;
                        }
                        self.earliestRadicals.push(earliest);
                    }
                }).then(user.getKanjiList()).then(function(error) {
                    // tally kanji per level
                    var i, j, kanji;
                    for (i = 1; i <= level; i += 1) {
                        kanji = user.kanji.getByLevel(i);
                        self.levels[i]["kanjiItems"] = kanji;
                        for (j = 0; j < kanji.length; j += 1) {
                            kanji[j].hasCharacter = true;
                            switch(kanji[j].user_specific.srs) {
                            case "apprentice":
                                self.levels[i]["apprenticeCount"] += 1;
                                break;
                            case "guru":
                                self.levels[i]["guruCount"] += 1;
                                break;
                            case "master":
                                self.levels[i]["masterCount"] += 1;
                                break;
                            case "enlighten":
                                self.levels[i]["enlightenCount"] += 1;
                                break;
                            case "burned":
                                self.levels[i]["burnedCount"] += 1;
                                break;
                            default:
                                break;
                            }
                            self.levels[i]["kanjiCount"] += 1;
                        }
                    }
                }).then(user.getVocabularyList()).then(function(error) {
                    // tally vocab per level
                    var i, j, vocab;
                    for (i = 1; i <= level; i += 1) {
                        vocab = user.vocabulary.getByLevel(i);
                        self.levels[i]["vocabularyItems"] = vocab;
                        for (j = 0; j < vocab.length; j += 1) {
                            vocab[j].hasCharacter = true;
                            switch(vocab[j].user_specific.srs) {
                            case "apprentice":
                                self.levels[i]["apprenticeCount"] += 1;
                                break;
                            case "guru":
                                self.levels[i]["guruCount"] += 1;
                                break;
                            case "master":
                                self.levels[i]["masterCount"] += 1;
                                break;
                            case "enlighten":
                                self.levels[i]["enlightenCount"] += 1;
                                break;
                            case "burned":
                                self.levels[i]["burnedCount"] += 1;
                                break;
                            default:
                                break;
                            }
                            self.levels[i]["vocabularyCount"] += 1;
                        }
                    }
                }).then(function() {
                    // tally totals and select default level
                    var i;
                    for (i = 1; i <= level; i += 1) {
                        self.levels[i]["totalCount"] = self.levels[i]["apprenticeCount"] +
                                                    self.levels[i]["guruCount"] +
                                                    self.levels[i]["masterCount"] +
                                                    self.levels[i]["enlightenCount"] +
                                                    self.levels[i]["burnedCount"];
                    }
                });
            }
        ]
    });