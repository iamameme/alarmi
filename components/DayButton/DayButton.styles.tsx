var repeatButtonSize = 35;

export default {
    circularContainer: {
        backgroundColor: 'darkblue',
        height: repeatButtonSize,
        width: repeatButtonSize,
        borderRadius: repeatButtonSize / 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: repeatButtonSize / 4,
    },
    active: {
        backgroundColor: 'lightblue',
        borderColor: 'blue',
        borderWidth: 1,
    },
    margin: {
        marginRight: repeatButtonSize / 4,
    },
    hitSlop: {
        top: repeatButtonSize / 4,
        left: repeatButtonSize / 4,
        bottom: repeatButtonSize / 4,
        right: repeatButtonSize / 4,
    },
}
