import { useState } from "react";
import {StyleSheet, View} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface CheckerProps {
    color: string,
    xp: number,
    yp: number,
}

const Checkers: React.FC<CheckerProps> =  ({color,xp,yp}) => {
    const [pos,setPos] = useState({x: xp, y:yp})
    return (
        <TouchableOpacity style={[color==='w' ? styles.checkerLight : styles.checkerDark,
        {
            left: xp,
            top: yp,
            position: "absolute",
        }
    ]}
    onPress={() => {console.log("I'M clickable")}}>
            
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    checkerLight: {
        height: 30,
        width: 30,
        borderRadius: 30,
        backgroundColor: "#FFF",
        position: 'absolute',
    },
    checkerDark: {
        height: 30,
        width: 30,
        borderRadius: 30,
        backgroundColor: "#000",
        position: 'absolute',
    },
})

export default Checkers;