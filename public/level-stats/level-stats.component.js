'use strict';

angular
    .module('levelStats')
    .component('levelStats', {
        templateUrl: 'level-stats/level-stats.template.html',
        controller: ['$routeParams', '$q', 'daysFilter',
            function LevelStatsController($routeParams, $q, daysFilter) {
                var self = this,
                    user = WKW.getUser($routeParams.userKey),
                    level;

                // loading state for progress bar
                self.loading = true;
                self.loadingProgress = 0;
                // dates of earliest unlocked kanji for each level
                self.timestamps = [];
                self.dates = [];

                // gathers data from the API and prepares it for display
                $q.when(user.getUserInformation()).then(function(error) {
                    level = user.user_information.level;
                    self.loadingProgress = 50;
                    return $q.when(user.getKanjiList());
                }).then(function() {
                    var i, j, kanji, earliest, currentDate;

                    for (i = 1; i <= level; i += 1) {
                        kanji = user.kanji.getByLevel(i);
                        earliest = Infinity;
                        for (j = 0; j < kanji.length; j += 1) {
                            if (kanji[j].user_specific && 
                                kanji[j].user_specific.unlocked_date < earliest) {
                                earliest = kanji[j].user_specific.unlocked_date;
                            }
                        }
                        self.timestamps.push(earliest);
                    }

                    // have all of the dates, now compute time
                    for (i = 0; i < self.timestamps.length; i += 1) {
                        if ((i + 1) === self.timestamps.length) { break; }
                        self.dates.push(self.timestamps[i+1] - self.timestamps[i]);
                    }
                    self.dates.push(self.timestamps[self.timestamps.length] - new Date());
                });
            }
        ]
    });