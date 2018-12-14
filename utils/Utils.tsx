import moment from 'moment';
import * as _ from 'lodash';
import { API, Post } from './Utils.types';
import subreddits from './Subreddits';

export enum ENDPOINT {
    COMMENT = "comment",
    SUBMISSION = "submission"
}

// example = pushshift(Endpoint.SUBMISSION, moment().subtract(7, 'days'), "hearthstone", 500);
export function pushshift(endpoint: ENDPOINT, subreddits: string | string[],
    day: Moment, range: number, limit?: number, sort_type?: string,
    num_comments?: number, stickied?: boolean) {
    var options = {};
    if (!limit) limit = 500;
    if (day) {
        var dayDifference = moment().diff(day, 'days');
        options["before"] = `${dayDifference}d`;
        options["after"] = `${dayDifference + range}d`;
    }
    if (Array.isArray(subreddits)) {
        options["subreddit"] = subreddits.toString();
    } else {
        options["subreddit"] = subreddits;
    }
    if (sort_type) options["sort_type"] = sort_type;
    if (num_comments) options["num_comments"] = `>${num_comments}`;

    options["limit"] = limit;
    options["sort"] = 'desc';
    options["stickied"] = (stickied) ? true : false;

    let optionString = '';
    _.transform(options, function (result, value, key) {
        optionString += `${key}=${value}&`;
    });
    optionString = optionString.slice(0, -1);

    var url = `https://api.pushshift.io/reddit/search/${endpoint}/?${optionString}`;
    return url;
}

async function getSubredditDay(subredditName: string, day: Moment) {
    try {
        let response = await fetch(pushshift(ENDPOINT.SUBMISSION, subredditName, day, 1, 50, 'num_comments'));
        let posts = await response.json();
        if (!posts) return undefined;
        if ((posts && !posts["data"]) || (posts && posts["data"].length === 0))
            return undefined;
        return posts;
    } catch (error) {
        return console.error(error);
    }
}

// Not needed?
async function getSubredditTopComments(subredditName: string, day: Moment, range: number) {
    try {
        var url = pushshift(ENDPOINT.SUBMISSION, subredditName, day, range, 1, 'num_comments');
        var response = await fetch(url);
        try {
            let responseJson = await response.json();
            let data: Post = responseJson.data;
            if (data[0]) {
                return data[0].num_comments;
            } else {
                // return getSubredditTopComments(subredditName, day, 5);
                console.error(responseJson)
            }
        } catch (error) {
            console.error(response);
        }

    } catch (error) {
        return console.error(error);
    }
}

export async function getSubredditDayInfo(subredditName: string, day: Moment) {
    return new Promise(async (resolve) => {
        try {
            let posts = await getSubredditDay(subredditName, day);
            return resolve(posts);
        } catch (error) {
            console.error(error);
        }
    });
}

function sortPosts(allPosts: Post[]) {
    let posts = {};
    if (allPosts.length > 490) console.error(allPosts.length);
    for (var i = 0; i < allPosts.length; i++) {
        if (!posts[allPosts[i].subreddit]) posts[allPosts[i].subreddit] = [];
        posts[allPosts[i].subreddit].push(allPosts[i]);
        // if (allPosts[i].subreddit === '') console.error(allPosts[i].subreddit)
    }
    const keys = Object.keys(posts);
    for (var k in keys) {
        posts[keys[k]] = posts[keys[k]].sort(function (a, b) {
            return a.real_score - b.real_score;
        });
    }
    return posts;
}

function addRealScore(post: Post) {
    const subreddit = post.subreddit;
    let topComment = subreddits.TopComments[subreddit];
    if (!topComment) topComment = 100;
    post.real_score = post.num_comments / topComment;
    return post;
}

export async function getDefaultFrontPage(day: Moment) {
    var defaultSubreddits = subreddits.DefaultSubreddits.slice(0);
    var final = await getFrontPage(defaultSubreddits, day);
    return final;
}

async function getFrontPage(subreddits: string[], day: Moment) {
    var promises = [],
        splitSubreddits = getSplitSubreddits(subreddits);

    for (var i = 0; i < splitSubreddits.length; i++) {
        while (splitSubreddits[i].length) {
            var num_comments = [150, 50, 10, 5, 0];
            promises.push(getMultipleSubredditPromises(splitSubreddits[i].splice(0, 70), day, num_comments[i]));
        }
    }

    return await Promise.all(promises).then((values) => {
        try {
            var allData: Post[] = [];
            for (var i = 0; i < values.length; i++) {
                for (var p in values[i].data) {
                    if (!values[i].data[p]) console.error(values[i])
                    let final = addRealScore(values[i].data[p]);
                    allData.push(final);
                }
            }
            return sortPosts(allData);
        } catch (error) {
            console.error(error);
        }
    });
}

function getSplitSubreddits(subredditArray: string[]) {
    var finalArr = [[], [], [], [], []];
    for (var s in subredditArray) {
        var index = subreddits.TopSubreddits.indexOf(subredditArray[s]);
        if (index > 800) {
            finalArr[4].push(subredditArray[s]);
        } else if (index > 500) {
            finalArr[3].push(subredditArray[s]);
        } else if (index > 200) {
            finalArr[2].push(subredditArray[s]);
        } else if (index > 100) {
            finalArr[1].push(subredditArray[s]);
        } else {
            finalArr[0].push(subredditArray[s]);
        }
    }
    return finalArr;
}

async function getMultipleSubredditPromises(subreddits: string[], day: Moment, num_comments?: number) {
    try {
        let response = await fetch(pushshift(ENDPOINT.SUBMISSION, subreddits, day, 1, 500, 'num_comments', num_comments));
        let posts = await response.json();
        if (!posts) return undefined;
        if ((posts && !posts["data"]) || (posts && posts["data"].length === 0))
            return undefined;
        return posts;
    } catch (error) {
        return console.error(error);
    }
}

export async function getTopCommentsTEMP(day: Moment) {
    var subredditList = subreddits.TopSubreddits.slice(0),
        promises = [];
    var store = { store: [], missed: [] };
    let urls = [];

    for (var i in subredditList) {
        var urlTopComments = pushshift(ENDPOINT.SUBMISSION, subredditList[i], day, 100, 1, 'num_comments');
        promises.push(urlTopComments);
    }
    for (var j = 0; j < promises.length; j += 7) {
        urls.push(promises.slice(j, j + 7));
    }

    function makeCall(index: number) {
        if (!urls[index]) console.error(store.store);
        return Promise.all(urls[index].map(url => fetch(url).then(resp => {
            if (resp.ok) return resp.json();
            if (!resp.ok) console.error(resp);
        }))).then((values) => {
            try {
                let response = values;
                let all = { findMe: 0 }; // _.compact(values); // Gets rid of null values
                for (var i = 0; i < response.length; i++) {
                    let scoredPosts: Post[] = response[i].data;
                    if (!scoredPosts) console.error(store.store)
                    if (scoredPosts && scoredPosts.length === 0) store.missed.push(urls[index][i])
                    if (scoredPosts[0]) {
                        all[scoredPosts[0].subreddit] = scoredPosts[0].num_comments;
                    }
                }
                // console.error(all);
                return all;
                //allPosts.data = sortPosts(scoredPosts, day);
                //return allPosts;
            } catch (error) {
                console.error(error);
            }
        });
    }

    function something(i) {
        Promise.all([makeCall(i)]).then(values => {
            if (i === urls.length) console.error(store);
            store.store.push(values);
            setTimeout(function () { something(i + 1) }, 4000);
        });
    }
    something(subreddits.TopSubreddits.indexOf('bloodborne'));

}