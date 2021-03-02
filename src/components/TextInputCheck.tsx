
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';

export default function TextInputCheck(props: Record<string, unknown>) {
    var validation: any = props["validation"] || ((text: any): boolean => true);
    var [shouldShow, setShouldShow] = useState(false);
    var onChangeText = (text: any) => {setShouldShow(validation(text))};

    return (
        <View style={styles.container}>
            <TextInput
            style={styles.textInput}
            placeholder="Placeholder"
            placeholderTextColor="#bdbdbd"
            onChangeText={onChangeText}
            />
            <Text style={styles.check}>
                {shouldShow && (
                    <Text>&#10003;</Text>
                )}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderBottomColor: "#e6e7e8",
        borderBottomWidth: 1.8,
        width: 328,
        marginBottom: 36,
        flexDirection: "row"
    },
    textInput: {
        fontSize: 14,
        fontFamily: "Roboto Regular",
        padding: 0,
        width: 328-20,
        flexGrow: 1
    },
    check: {
        width: 20,
        fontFamily: "Roboto Regular",
        color: "#434343",
        paddingLeft: 5,
    }
})