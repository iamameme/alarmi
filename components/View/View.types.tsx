import { API, Post, FullPost } from "../../utils/Utils.types";

export interface ViewProps {
    name: string;
}

export enum ModalType {
    IMAGE = "IMAGE",
    WEBVIEW = "WEBVIEW",
    VIDEO = "VIDEO",
    YOUTUBE = "YOUTUBE"
}

interface ModalContent {
    type: ModalType;
    url: string;
    extraData?: string;
}

export interface ItemProps {
    item: Post;
    showModal: Function;
}

export interface ItemState {
    clicked: boolean;
    thumbnail: string;
    fullData: FullPost;
    score: number;
    modalType: string;
    modalUrl: string;
    extraData: any;
    extraThumbnail: string;
}

export interface State {
    isLoading: boolean;
    frontPage: any;
    showModal: boolean;
    modalContent: ModalContent;
}
