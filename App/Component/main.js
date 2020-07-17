import React from 'react';
import {
    ActivityIndicator, Dimensions,
    ScrollView, StyleSheet,

    Text, TouchableOpacity, View
} from 'react-native';
import { CachedImage } from "react-native-cached-image";


class MainScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLoading: false
        };
    }

    componentDidMount = () => {
        fetch('https://jsonplaceholder.typicode.com/photos', {
            method: "GET",
        }).then((res) => res.json())
            .then(result => {
                this.setState({ data: result, isLoading: true })
            })
            .catch((e) => {
                this.setState({ isLoading: false })
                console.log('error', e)
            })
    }

    render() {
        const { data, isLoading } = this.state;
        return (
            <View style={style.parentView}>
                {
                    isLoading ? <ActivityIndicator size="large" color="#00ff00" />
                        :
                        // <ScrollView contentContainerStyle={style.containerStyle}>
                        <ScrollView
                            horizontal
                            pagingEnabled
                            decelerationRate={0}
                            snapToInterval={Dimensions.get('window').width * 0.8 + 10}
                            snapToAlignment='center'
                        >
                            {
                                data.map((item, index) => {
                                    return (
                                        <View key={index} style={style.mainCard}>
                                            <CachedImage source={{ uri: item.url }} style={style.mainImageView} />
                                            <View style={style.innerCircle}>
                                                <CachedImage source={{ uri: item.thumbnailUrl }} style={style.thumbnailImage} />
                                            </View>
                                            <Text style={style.textView}>{item.title}</Text>
                                        </View>
                                    )
                                })
                            }
                        </ScrollView>
                }
                <TouchableOpacity style={style.button} onPress={() => this.props.navigation.navigate("MapScreen")}>
                    <Text style={style.buttonText}>{"Map View"}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default MainScreen;


const style = StyleSheet.create({
    mainCard: {
        width: Dimensions.get('window').width * 0.8,
        height: Dimensions.get('window').height * 0.7,
        backgroundColor: '#FFFFFF',
        textAlign: 'center',
        marginHorizontal: 15,
        marginVertical: 25,
        borderRadius: 15
    },
    innerCircle: {
        height: 81,
        width: 81,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        position: 'absolute',
        bottom: 0,
        marginHorizontal: 10,
        marginVertical: 10,
        overflow: 'hidden'
    },
    parentView: {
        flex: 1,
        padding: 24
    },
    containerStyle: {
        height: 1000
    },
    mainImageView: {
        height: Dimensions.get('window').height * 0.7,
        width: Dimensions.get('window').width * 0.8,
    },
    textView: {
        fontSize: 22,
        textAlign: 'center',
        justifyContent: 'center',
        fontWeight: "bold",
        position: 'absolute',
        color: '#FFFFFF'
    },
    thumbnailImage: {
        height: 81,
        width: 81
    },
    button: {
        height: 45,
        width: 335,
        borderRadius: 30,
        borderColor: 'blue',
        backgroundColor: 'blue',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 22,
        fontWeight: '300',
        lineHeight: 33,
        color: '#FFFFFF'
    }
})
