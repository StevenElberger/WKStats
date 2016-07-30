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
				// stores items on a level-by-level basis
				self.items = {};
				// which items are being shown
				self.shown = "";
				//
				self.itemsToShow = [];

				self.showRadicals = function showRadicals() {
					self.itemsToShow = self.items[self.selected.level]["radicals"];
				};

				self.showKanji = function showKanji() {
					self.itemsToShow = self.items[self.selected.level]["kanji"];
				};

				self.showVocab = function showVocab() {
					self.itemsToShow = self.items[self.selected.level]["vocabulary"];
				};

				$q.when(user.getUserInformation()).then(function(error) {
					level = user.user_information.level;
				}).then(user.getRadicalsList()).then(function(error) {
					var i, j, radicals, earliest, currentDate;
					
					// tally radicals per level
					for (i = 1; i <= level; i += 1) {
						radicals = user.radicals.getByLevel(i);
						self.levels[i] = {
							"level": i,
							"apprentice": 0,
							"guru": 0,
							"master": 0,
							"enlighten": 0,
							"burned": 0,
							"radicals": 0,
							"kanji": 0,
							"vocabulary": 0
						};
						for (j = 0; j < radicals.length; j += 1) {
							if (Object.keys(radicals[j].character).length === 0 
								&& radicals[j].character.constructor === Object) {
								radicals[j].hasCharacter = false;
							} else {
								radicals[j].hasCharacter = true;
							}
						}
						self.items[i] = {
							"radicals": radicals,
							"kanji": [],
							"vocabulary": []
						};
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
								self.levels[i]["apprentice"] += 1;
								break;
							case "guru":
								self.levels[i]["guru"] += 1;
								break;
							case "master":
								self.levels[i]["master"] += 1;
								break;
							case "enlighten":
								self.levels[i]["enlighten"] += 1;
								break;
							case "burned":
								self.levels[i]["burned"] += 1;
								break;
							default:
								break;
							}
							self.levels[i]["radicals"] += 1;
						}
						self.earliestRadicals.push(earliest);
					}
				}).then(user.getKanjiList()).then(function(error) {
					// tally kanji per level
					var i, j, kanji;
					for (i = 1; i <= level; i += 1) {
						kanji = user.kanji.getByLevel(i);
						self.items[i]["kanji"] = kanji;
						for (j = 0; j < kanji.length; j += 1) {
							kanji[j].hasCharacter = true;
							switch(kanji[j].user_specific.srs) {
							case "apprentice":
								self.levels[i]["apprentice"] += 1;
								break;
							case "guru":
								self.levels[i]["guru"] += 1;
								break;
							case "master":
								self.levels[i]["master"] += 1;
								break;
							case "enlighten":
								self.levels[i]["enlighten"] += 1;
								break;
							case "burned":
								self.levels[i]["burned"] += 1;
								break;
							default:
								break;
							}
							self.levels[i]["kanji"] += 1;
						}
					}
				}).then(user.getVocabularyList()).then(function(error) {
					// tally vocab per level
					var i, j, vocab;
					for (i = 1; i <= level; i += 1) {
						vocab = user.vocabulary.getByLevel(i);
						self.items[i]["vocabulary"] = vocab;
						for (j = 0; j < vocab.length; j += 1) {
							vocab[j].hasCharacter = true;
							switch(vocab[j].user_specific.srs) {
							case "apprentice":
								self.levels[i]["apprentice"] += 1;
								break;
							case "guru":
								self.levels[i]["guru"] += 1;
								break;
							case "master":
								self.levels[i]["master"] += 1;
								break;
							case "enlighten":
								self.levels[i]["enlighten"] += 1;
								break;
							case "burned":
								self.levels[i]["burned"] += 1;
								break;
							default:
								break;
							}
							self.levels[i]["vocabulary"] += 1;
						}
					}
				}).then(function() {
					// tally totals and select default level
					var i;
					for (i = 1; i <= level; i += 1) {
						self.levels[i]["total"] = self.levels[i]["apprentice"] +
													self.levels[i]["guru"] +
													self.levels[i]["master"] +
													self.levels[i]["enlighten"] +
													self.levels[i]["burned"];
					}
					self.selected = self.levels["1"];
				});
			}
		]
	});