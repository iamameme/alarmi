export interface API {
    data: Post[];
}

export interface Post {
    real_score: number;
    author: string;
    author_flair_css_class: string;
    author_flair_richtext: any;
    author_flair_text: string;
    author_flair_type: string;
    author_fullname: string;
    created_utc: number;
    domain: string;
    full_link: string;
    id: string;
    is_video: boolean;
    link_flair_text: string;
    link_flair_text_color: string;
    link_flair_type: string;
    num_comments: number;
    num_crossposts: number;
    score: number;
    selftext: string;
    send_replies: boolean;
    subreddit: string;
    subreddit_id: string;
    subreddit_subscribers: number;
    subreddit_type: string;
    thumbnail: string;
    title: string;
    wls: number;
    preview: Preview;
    url: string;
    is_self: boolean;
}

interface Preview {
    enabled: boolean;
    images: Image[]
}

interface Resolution {
    height: number;
    url: string;
    width: number;
}

interface Image {
    id: string;
    resolutions: Resolution[];
    source: Resolution;
    variants: any;
}

export interface FullPost {
    details: PostDetails;
    comments: CommentBase;
}

export interface PostComment {
    data: CommentHash;
    kind: string;
}

export interface ReplyComment {
    data: ReplyHash;
    kind: string;
}

export interface CommentBase {
    data: CommentHash;
    kind: string;
}

export interface CommentHash {
    after: any;
    before: any;
    children: CommentData[];
    dist: any;
    modhash: string;
}

export interface ReplyHash {
    after: any;
    before: any;
    children: ReplyHashChildren;
    dist: any;
    modhash: string;
}

export interface ReplyHashChildren {
    data: CommentData[];
    kind: string;
}

export interface CommentData {
    archived: boolean;
    author: string
    author_flair_background_color: string;
    author_flair_css_class: string;
    author_flair_text: string;
    author_flair_text_color: string;
    author_flair_type: string;
    author_fullname: string;
    body: string;
    body_html: string;
    can_gild: boolean
    collapsed: boolean;
    collapsed_reason: any;
    controversiality: number;
    created: number;
    created_utc: number;
    depth: number;
    distinguished: any;
    downs: number;
    edited: boolean;
    gilded: number;
    id: string;
    is_submitter: boolean;
    link_id: string;
    mod_note: any;
    mod_reason_by: any;
    mod_reason_title: any;
    name: string;
    parent_id: string;
    removal_reason: any;
    replies: ReplyComment;
    saved: boolean;
    score: number;
    score_hidden: boolean;
    send_replies: boolean;
    stickied: boolean;
    ups: number;
}

export interface PostDetails {
    archived: boolean;
    author: string;
    author_flair_background_color: string;
    author_flair_css_class: string;
    author_flair_text: string;
    author_flair_text_color: string;
    author_flair_type: string;
    author_fullname: string;
    clicked: boolean;
    created: number;
    created_utc: number;
    domain: string;
    downs: number;
    edited: boolean;
    gilded: number;
    hidden: boolean;
    id: string;
    is_self: boolean
    is_video: boolean;
    link_flair_background_color: string;
    link_flair_css_class: string;
    link_flair_text: string;
    link_flair_type: string;
    locked: boolean;
    num_comments: number;
    over_18: boolean;
    pinned: boolean;
    post_hint: string;
    saved: boolean;
    score: number;
    selftext: string;
    send_replies: boolean;
    spoiler: boolean;
    stickied: boolean;
    subreddit: string;
    thumbnail: string;
    title: string;
    ups: number;
    upvote_ratio: number;
    url: string;
    visited: boolean;
}