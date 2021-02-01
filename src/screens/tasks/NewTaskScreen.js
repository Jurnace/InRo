import React from "react";

import { StyleSheet, Modal, Alert, KeyboardAvoidingView, ScrollView, View, TouchableWithoutFeedback, PixelRatio, FlatList, ToastAndroid, TouchableNativeFeedback, Image } from "react-native";
import { Container, Header, Left, Body, Button, Icon, Title, Content, Spinner, Item, Input, Textarea, Picker, DatePicker, Text } from "native-base";

import { connect } from "react-redux";

import { IP, GOOGLE_API_KEY } from "../../Constants";
import axios from "axios";

class NewTaskScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            category: 0,
            date: null,
            title: "",
            description: "",
            time: "",
            price: "",
            looking: "",
            enableButton: false,
            locationVisible: false,
            locationInput: "",
            location: "",
            address: "",
            locationData: []
        };

        this.refDescription = React.createRef();
        this.refPrice = React.createRef();
        this.refLooking = React.createRef();

        const date = new Date();
        date.setDate(date.getDate() + 1);
        this.date = date;

        this.sessionToken = String(this.props.userId) + Date.now();
        this.isSearching = false;
    }

    onPressBack = () => {
        this.props.navigation.goBack();
    };

    onPressSubmit = async () => {
        if(!this.state.title.trim()) {
            Alert.alert("Error", "Please enter the title of the task");
            return;
        }

        if(!this.state.description.trim()) {
            Alert.alert("Error", "Please enter the description");
            return;
        }

        if(!this.state.location) {
            Alert.alert("Error", "Please enter the location");
            return;
        }

        if(!this.state.time.trim()) {
            Alert.alert("Error", "Please enter the time");
            return;
        }

        if(!this.state.price.trim()) {
            Alert.alert("Error", "Please enter the price");
            return;
        }

        if(!this.state.looking.trim()) {
            Alert.alert("Error", "Please enter the number of person");
            return;
        }

        if(!/^\d+$/.test(this.state.looking)) {
            Alert.alert("Error", "Please enter the number of person correctly");
            return;
        }

        if(parseInt(this.state.looking) < 1) {
            Alert.alert("Error", "Please enter the number of person correctly");
            return;
        }

        if(this.state.category === 0) {
            Alert.alert("Error", "Please choose the category");
            return;
        }

        if(!this.state.date){
            Alert.alert("Error", "Please choose the date of expiry");
            return;
        }

        this.setState({ loading: true });

        try {
            const response = await axios.post(IP + "/task/new", {
                category: this.state.category,
                title: this.state.title.trim(),
                description: this.state.description.trim(),
                location: this.state.location.trim(),
                address: this.state.address,
                time: this.state.time.trim(),
                price: this.state.price.trim(),
                expire: this.state.date.toUTCString(),
                looking: parseInt(this.state.looking),
                ownerId: this.props.userId
            }, {
                headers: { Authorization: this.props.token }
            });

            if(response.status === 200) {
                Alert.alert("Success!", "You have created a new task");
                this.props.navigation.goBack();
            } else {
                Alert.alert("Error", "Unable to create a new task.");
                this.setState({ loading: false });
            }
        } catch(err) {
            Alert.alert("Error", "Unable to create a new task. Check your internet connection and try again later.");
            this.setState({ loading: false });
        }
    };

    onPressLocation = () => {
        this.setState({ locationVisible: true });
    };

    onPressLocationItem = (item) => {
        this.setState({
            locationVisible: false,
            locationInput: item.structured_formatting.main_text,
            location: item.structured_formatting.main_text,
            address: item.structured_formatting.secondary_text,
            enableButton: this.state.title && this.state.description && this.state.time && this.state.price && this.state.looking && this.state.date && this.state.category
        });
    };

    onPressClose = () => {
        this.setState({ locationVisible: false });
    }

    onChangeCategory = value => {
        if(value !== 0) {
            this.setState({
                category: value,
                enableButton: this.state.title && this.state.description && this.state.location && this.state.time && this.state.price && this.state.looking && this.state.date
            });
        }
    }

    setDate = newDate => {
        newDate.setHours(0, 0, 0, 0);

        if(newDate >= this.date) {
            this.setState({
                date: newDate,
                enableButton: this.state.title && this.state.description && this.state.location && this.state.time && this.state.price && this.state.looking && newDate && this.state.category
            });
        }
    };

    onChangeTitle = (text) => {
        this.setState({
            title: text,
            enableButton: text && this.state.description && this.state.location && this.state.time && this.state.price && this.state.looking && this.state.date && this.state.category
        });
    };

    onChangeDescription = (text) => {
        this.setState({
            description: text,
            enableButton: this.state.title && text && this.state.location && this.state.time && this.state.price && this.state.looking && this.state.date && this.state.category
        });
    };

    onChangeTime = (text) => {
        this.setState({
            time: text,
            enableButton: this.state.title && this.state.description && this.state.location && text && this.state.price && this.state.looking && this.state.date && this.state.category
        });
    };

    onChangePrice = (text) => {
        this.setState({
            price: text,
            enableButton: this.state.title && this.state.description && this.state.location && this.state.time && text && this.state.looking && this.state.date && this.state.category
        });
    }

    onChangeLooking = (text) => {
        this.setState({
            looking: text,
            enableButton: this.state.title && this.state.description && this.state.location && this.state.time && this.state.price && text && this.state.date && this.state.category
        });
    }

    onChangeLocation = (text) => {
        if(!text.trim()) {
            this.sessionToken = String(this.props.userId) + Date.now();
            this.setState({
                locationInput: text.trim(),
                locationData: []
            });
        } else {
            this.setState({ locationInput: text });

            if(this.isSearching) {
                this.cancelToken.cancel();
            }

            this.cancelToken = axios.CancelToken.source();
            this.isSearching = true;

            axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${GOOGLE_API_KEY}&sessiontoken=${this.sessionToken}&location=2.9299759,101.613733&radius=50000&strictbounds`, { cancelToken: this.cancelToken.token }).then((response) => {
                this.isSearching = false;

                if(this.state.locationInput) {
                    this.setState({ locationData: response.data.predictions.filter((item) => item.structured_formatting.secondary_text.includes("Cyberjaya")) });
                }
            }).catch((err) => {
                this.isSearching = false;
                if(!axios.isCancel(err)) {
                    ToastAndroid.show("Error retrieving locations", ToastAndroid.SHORT);
                }
            });
        }
    };

    onSubmitTitle = () => {
        this.refDescription.current._root.focus();
    };

    onSubmitTime = () => {
        this.refPrice.current._root.focus();
    };

    onSubmitPrice = () => {
        this.refLooking.current._root.focus();
    };

    renderLocations = (item) => {
        return (
            <TouchableNativeFeedback onPress={() => this.onPressLocationItem(item.item)}>
                <View style={styles.locationItemList}>
                    <Text numberOfLines={1}>{item.item.structured_formatting.main_text}</Text>
                    <Text note>{item.item.structured_formatting.secondary_text}</Text>
                </View>
            </TouchableNativeFeedback>
        );
    };

    renderFooter = () => {
        return (
            <View style={styles.imgView}>
                <Image style={styles.img} source={require("../../assets/powered_by_google_on_white.png")} />
            </View>
        );
    };

    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <Button onPress={this.onPressBack} transparent rounded>
                            <Icon name="md-arrow-back" />
                        </Button>
                    </Left>
                    <Body style={styles.body}>
                        <Title>Create a new task</Title>
                    </Body>
                </Header>
                <Content contentContainerStyle={styles.content}>
                    <Modal visible={this.state.loading} transparent animationType="fade">
                        <Spinner style={styles.loading} size="large" color="blue" />
                    </Modal>
                    <Modal visible={this.state.locationVisible} animationType="slide" onRequestClose={this.onPressClose}>
                        <View>
                            <Header>
                                <Left>
                                    <Button onPress={this.onPressClose} transparent rounded>
                                        <Icon name="md-arrow-back" />
                                    </Button>
                                </Left>
                                <Body style={styles.body}>
                                    <Title>Location</Title>
                                </Body>
                            </Header>
                            <View style={styles.locationModal}>
                                <Item fixedLabel>
                                    <Icon style={styles.icon} name="md-pin" active />
                                    <Input placeholder="Type to search" autoFocus autoCapitalize="none" returnKeyType="search" value={this.state.locationInput} onChangeText={this.onChangeLocation} />
                                </Item>
                                <FlatList keyboardShouldPersistTaps="always" data={this.state.locationData} renderItem={this.renderLocations} ListFooterComponent={this.renderFooter} />
                            </View>
                        </View>
                    </Modal>
                    <ScrollView>
                        <KeyboardAvoidingView>
                            <Item fixedLabel>
                                <Input placeholder="Title (Maximum 30 characters)" maxLength={30} value={this.state.title} returnKeyType="next" onChangeText={this.onChangeTitle} onSubmitEditing={this.onSubmitTitle} blurOnSubmit={false} />
                            </Item>
                            <Textarea style={styles.textarea} placeholder="Description" rowSpan={7} ref={this.refDescription} value={this.state.description} onChangeText={this.onChangeDescription} />
                            <Item picker>
                                <Picker mode="dropdown" selectedValue={this.state.category} onValueChange={this.onChangeCategory}>
                                    <Picker.Item label="Select category:" value={0} />
                                    <Picker.Item label="Dispatch" value={1} />
                                    <Picker.Item label="Food/Shopping" value={2} />
                                    <Picker.Item label="Event Crew" value={3} />
                                    <Picker.Item label="Flyering" value={4} />
                                    <Picker.Item label="Promoter" value={5} />
                                    <Picker.Item label="Academic" value={6} />
                                    <Picker.Item label="Daycare" value={7} />
                                    <Picker.Item label="Housekeeping" value={8} />
                                    <Picker.Item label="Cooking" value={9} />
                                </Picker>
                            </Item>
                            <TouchableWithoutFeedback onPress={this.onPressLocation}>
                                <View style={styles.locationItem}>
                                    <Icon style={styles.icon} name="md-pin" active />
                                    <Text style={this.state.location ? styles.locationText : styles.locationTextPlaceholder} numberOfLines={1}>{this.state.location ? this.state.location + ", " + this.state.address : "Location"}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <Item fixedLabel>
                                <Icon style={styles.icon} name="md-time" active />
                                <Input style={styles.textIcon} placeholder="Time" value={this.state.time} onChangeText={this.onChangeTime} returnKeyType="next" onSubmitEditing={this.onSubmitTime} blurOnSubmit={false} />
                            </Item>
                            <Item fixedLabel>
                                <Icon style={styles.icon} type="MaterialCommunityIcons" name="cash-usd" active />
                                <Input style={styles.textIcon} placeholder="Price" ref={this.refPrice} value={this.state.price} onChangeText={this.onChangePrice} returnKeyType="next" onSubmitEditing={this.onSubmitPrice} blurOnSubmit={false} />
                            </Item>
                            <Item fixedLabel>
                                <Icon style={styles.icon} name="md-person" active />
                                <Input style={styles.textIcon} placeholder="Number of person required" keyboardType="numeric" maxLength={3} ref={this.refLooking} value={this.state.looking} onChangeText={this.onChangeLooking} />
                            </Item>
                            <View style={styles.datepickeri}>
                                <DatePicker placeHolderTextStyle={styles.datepickerph} textStyle={styles.datepicker} placeHolderText="Select expiry date" minimumDate={this.date} onDateChange={this.setDate} formatChosenDate={date => { return "Expiry date: " + date.toLocaleDateString("en-US")}} />
                            </View>
                            <Button style={styles.btn} block onPress={this.onPressSubmit} success disabled={!this.state.enableButton}><Text>Submit</Text></Button>
                        </KeyboardAvoidingView>
                    </ScrollView>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        paddingLeft: 8,
        paddingRight: 8,
        paddingBottom: 8,
        paddingTop: 5
    },
    loading: {
        flex: 1,
        alignSelf: "center",
        justifyContent: "space-around"
    },
    btn: {
        marginTop: 10
    },
    textarea: {
        paddingLeft: 4,
        paddingRight: 4,
    },
    icon: {
        width: 28,
        textAlign: "center",
    },
    textIcon: {
        paddingLeft: -3
    },
    datepickerph: {
        fontSize: 17,
        marginLeft: -4,
        color: "#535C69"
    },
    datepicker: {
        fontSize: 17,
        marginLeft: -4
    },
    datepickeri: {
        paddingTop: 4,
        paddingBottom: 4,
        borderBottomWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1) * 2,
        borderColor: "#D9D5DC"
    },
    body: {
        flex: 2
    },
    locationItem: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1) * 2,
        borderColor: "#D9D5DC"
    },
    locationText: {
        fontSize: 17,
        marginLeft: 3,
        height: 50,
        textAlignVertical: "center"
    },
    locationTextPlaceholder: {
        fontSize: 17,
        marginLeft: 3,
        height: 50,
        textAlignVertical: "center",
        color: "#575757"
    },
    locationModal: {
        marginLeft: 5,
        marginRight: 5
    },
    img: {
        marginTop: 15,
        width: 160,
        height: 20,
    },
    imgView: {
        flex: 1,
        alignItems: "center"
    },
    locationItemList: {
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 35,
        paddingRight: 10,
        borderBottomWidth: 0.5,
        borderColor: "#DDD"
    }
});

const mapStateToProps = state => {
    return {
        token: state.authReducer.token,
        userId: state.userIdReducer.userId
    };
};

export default connect(mapStateToProps)(NewTaskScreen);