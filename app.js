var name = process.argv[2];
console.log(name);
var file = process.argv[3];
var OpenSubtitles = require('opensubtitles-api');
var OS = new OpenSubtitles('OSTestUserAgent');
OS.search({
    query: name,
//    imdbid: 'tt0314979',
//    sublanguageid: 'fre',
    gzip: true
}).then(function (subtitles) {
    if (subtitles.en) {
        console.log('Subtitle found:', subtitles);
        require('request')({
            url: subtitles.en.url,
            encoding: null
        }, function (error, response, data) {
            if (error) throw error;
            require('zlib').unzip(data, function (error, buffer) {
                if (error) throw error;
                var subtitle_content = buffer.toString(subtitles.en.encoding).replace(/[\u200B-\u200D\uFEFF]/g, '');
                console.log('Subtitle content:', subtitle_content);
                var fs = require('fs');
                fs.writeFile(file, subtitle_content , function (err) {
                  console.log(err);
                });
            });
        });
    } else {
        throw 'no subtitle found';
    }
}).catch(function (error) {
    console.error(error);
});
// var OS = require('opensubtitles-api');
// var OpenSubtitles = new OS({
//     useragent:'OSTestUserAgent',
//     ssl: true
// });
// OpenSubtitles.login()
//     .then(function(res){
//         console.log(res.token);
//         console.log(res.userinfo);
//
//     OpenSubtitles.search({
//     sublanguageid: 'fre',       // Can be an array.join, 'all', or be omitted.
//     //hash: '8e245d9679d31e12',   // Size + 64bit checksum of the first and last 64k
//     //filesize: '129994823',      // Total size, in bytes.
//     //path: 'foo/bar.mp4',        // Complete path to the video file, it allows
//                                 //   to automatically calculate 'hash'.
//     //filename: 'bar.mp4',        // The video file name. Better if extension
//                                 //   is included.
//     //season: '2',
//     //episode: '3',
//     extensions: ['srt'], // Accepted extensions, defaults to 'srt'.
//     limit: '3',                 // Can be 'best', 'all' or an
//                                 // arbitrary nb. Defaults to 'best'
//     //imdbid: '528809',           // 'tt528809' is fine too.
//     //fps: '23.96',               // Number of frames per sec in the video.
//     query: 'Charlie Chaplin',   // Text-based query, this is not recommended.
//     gzip: false                  // returns url to gzipped subtitles, defaults to false
// }).then(function (subtitles) {
//     // an array of objects, no duplicates (ordered by
//     // matching + uploader, with total downloads as fallback)
//     console.log(subtitles);
// });
//     })
//     .catch(function(err){
//         console.log(err);
//     });
