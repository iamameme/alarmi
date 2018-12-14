export default {
    horizontalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'stretch',
        height: 80,
    },
    // When displaying the time we could encounter that the first row is bigger than the device width onPress
    // small devices. Make the calendarText shrink then.
    textShrink: {
        flexShrink: 1,
    },
    card: {
        alignSelf: 'stretch',
        backgroundColor: 'grey',
        borderColor: 'darkgrey',
    },
    container: {
        alignItems: 'flex-start',
    },
    timeText: {
        fontSize: 50,
        fontWeight: '200'
    },
    timeContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flexDirection: 'row'
    }
}