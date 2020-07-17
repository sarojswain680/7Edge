/* eslint-disable prettier/prettier */
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainView from '../App/Component/main';
import MapScreen from '../App/Component/map';
import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { connect } from 'react-redux';


const Stack = createStackNavigator();

class AppRouter extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName="MainView">
                    <Stack.Screen
                        name="MainView"
                        component={MainView}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="MapScreen"
                        component={MapScreen}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}
const mapStateToProps = ({ Auth }) => {
    const { token } = Auth;
    return { token };
};
export default connect(mapStateToProps, {})(AppRouter);