
WMU.controller('DirectoryViewCtrl', function ($scope, $rootScope, $state, $stateParams, $filter, Directory, Player, EventNames, Socket, SafeApply) {

    //region Init
    init(this);

    function init(self) {
        $scope.audioPlaylist = {};
        $scope.localPlaylist = {};
        $scope.localPlaylist.name = "local";

        $scope.player = Player.getAudioPlayer();
        $scope.player.isPlaylistVisible = false;
        $scope.onClickDir = onClickDir;
        $scope.onClickSong = onClickSong;
        $scope.addToPlaylist = addToPlaylist;
        $scope.isPreview = true;

        //Init Dir
        Directory.getContent("./public/musique/").then(function (data) {
            updateDir(data);
            $scope.rootDir = data;
        });

        //Update the player.
        $rootScope.$on(EventNames.master.player.update, function (event, value) {
            $scope.player = value;
            $scope.audioPlaylist = Player.getPlaylist();
        })

        $rootScope.$on(EventNames.master.panels.togglePlaylist, function (event, value) {
            $scope.player.isPlaylistVisible = value;
        })


        $rootScope.$watch("isBroadcaster", function (newValue, oldValue) {
            bindBroadcaster();
        })
        $rootScope.$watch("isListener", function (newValue, oldValue) {
            bindListener()
        })
    }

    function bindListener() {
        //reinit listeners
        Socket.removeAllListeners('music:changeDir');
        Socket.removeAllListeners('music:playSong');
        if ($rootScope.isListener) {
            Socket.on('music:changeDir', function (dir) {
                if(!$rootScope.isBroadcaster) {
                    updateDir(dir);
                }
            });

            Socket.on('music:playSong', function (data) {
                if(!$rootScope.isBroadcaster) {
                    playSong(data);
                }
            });
        }
    }

    function bindBroadcaster() {
        if ($rootScope.isBroadcaster) {

        }
    }

    function addToPlaylist(e, song) {
        e.preventDefault();
        e.stopPropagation();
        Player.add(song);
    }

    function onClickDir(dir) {
        changeDir(dir);
        if ($rootScope.isBroadcaster) {
            Socket.emit('music:changeDir', dir);
        }
    }

    function changeDir(dir) {
        //TODO : update the scope with rootDir not calling ws
        Directory.getContent(dir).then(function (data) {
            updateDir(data);
        });
    }

    function updateDir(data) {
        $scope.directories = data.files;
        $scope.curDir = data;

        if ($scope.curDir.containSong) {
            var playlist = $filter('filter')($scope.directories, function (value) {
                return value.dir == false;
            });

            var newPlaylist = {};

            newPlaylist.playlist = playlist;
            newPlaylist.name = $scope.curDir.name;
            $scope.localPlaylist = newPlaylist;
        }
        $scope.newDir = true;
    }

    function onClickSong (index) {
        playSong(index);
    }

    function playSong(index) {
        Player.play(index, $scope.localPlaylist);
        $scope.player = Player.getAudioPlayer();
        $scope.audioPlaylist = Player.getPlaylist();
    }

});
