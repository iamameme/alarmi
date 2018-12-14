export interface AlarmViewProps {

}

export interface AlarmViewState {
    alarms: Alarm[];
    alarmCount: number;
    showTimePicker: boolean;
    nextTime: Moment;
    indexToMutate: number;
    registerToken?: any;
    backgroundURI?: string;
}

export interface Alarm {
    id: number;
    active: boolean;
    time: Moment;
    doesRepeat: boolean;
    minutesBeforeAlarm: number;
    days?: DayMap;
    extraText?: string;
    ringtone?: string;
}

export interface DayMap {
    Sun: boolean;
    Mon: boolean;
    Tue: boolean;
    Wed: boolean;
    Thu: boolean;
    Fri: boolean;
    Sat: boolean;
}