import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import React from 'react';
import {
    ActivityIndicator, Dimensions,
    Image, ScrollView, StyleSheet,

    Text, TouchableOpacity, View
} from 'react-native';

class MainScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isConnected: true
        };
    }

    componentDidMount = async () => {
        const state = await NetInfo.fetch()
        if (state.isConnected) {
            fetch('https://jsonplaceholder.typicode.com/photos', {
                method: "GET",
            }).then((res) => res.json())
                .then(async (result) => {
                    await AsyncStorage.setItem('@my_data', JSON.stringify(result))
                    this.setState({ data: result })
                })
                .catch((e) => {
                    console.log('error', e)
                })
        } else {
            let data = []
            const localData = await AsyncStorage.getItem('@my_data')
            data = JSON.parse(localData)
            return this.setState({ data: data });
        }
    }
    render() {
        const { data } = this.state;
        return (
            <View style={style.parentView}>
                {
                    data.length > 0 ?

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
                                            <Image source={{ uri: item.url }} style={style.mainImageView} />
                                            <View style={style.innerCircle}>
                                                <Image source={{ uri: item.thumbnailUrl }} style={style.thumbnailImage} />
                                            </View>
                                            <Text style={style.textView}>{item.title}</Text>
                                        </View>
                                    )
                                })
                            }
                        </ScrollView>
                        :
                        <ActivityIndicator size="large" color="#00ff00" />
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
