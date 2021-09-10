import React, { useState, useEffect } from "react"
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  Linking,
  KeyboardAvoidingView,
  Platform
} from "react-native"
import { useSelector, useDispatch } from 'react-redux'
import SignupHeader from "./SignupHeader"
declare module 'fxa-common-password-list'
import commonPasswordList from 'fxa-common-password-list'
import LottieView from 'lottie-react-native'
import { useDispatchWebAction } from '../../hooks/useWebAction'
import { MessageType } from '../../message'

import IconArrow from '../../assets/images/iconArrow.svg'
import IconCheck from '../../assets/images/iconValidationCheck.svg'
import ValidationIconX from '../../assets/images/iconValidationX.svg'

import * as LifecycleActions from '../../store/lifecycle/actions'
import { getOnSignUp } from '../../store/lifecycle/selectors'

const styles = StyleSheet.create({
  container: {
    top: -47,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    justifyContent: 'space-evenly'
  },
  containerForm: {
    left: 0,
    width: '100%',
    alignItems: 'center',
    padding: 38
  },
  title: {
    color: '#7E1BCC',
    fontSize: 18,
    fontFamily: 'AvenirNextLTPro-Bold',
    lineHeight: 26,
    textAlign: 'center',
    paddingBottom: 6,
  },
  header: {
    color: '#858199',
    fontSize: 14,
    lineHeight: 21,
    fontFamily: 'AvenirNextLTPro-regular',
    textAlign: 'center',
    paddingTop: 16,
    paddingBottom: 3
  },
  input: {
    height: 40,
    width: '100%',
    marginTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
    borderWidth: 1,
    borderColor: '#F7F7F9',
    backgroundColor: '#FCFCFC',
    borderRadius: 4,
    padding: 10,
    color: '#858199',
    fontFamily: 'AvenirNextLTPro-regular',
    fontSize: 16
  },
  formBtn: {
    flexDirection: 'row',
    marginTop: 26,
    height: 48,
    width: '100%',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'center',
    backgroundColor: '#CC0FE0',
    borderRadius: 4,
  },
  formButtonTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  formButtonTitle: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'AvenirNextLTPro-Bold'
  },
  arrow: {
    height: 20,
    width: 20
  },
  loadingIcon: {
    width: 24,
    height: 24
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignContent: 'flex-start',
    marginTop: 16,
    width: '100%'
  },
  unchecked: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: '#858199',
    borderRadius: 12,
    marginRight: 13,
  },
  iconCheck: {
    position: "absolute",
    width: 16,
    height: 16,
    zIndex: 2
  },
  errorIcon: {
    position: "absolute",
    width: 16,
    height: 16,
    zIndex: 2
  },
  uncheckedDescription: {
    color: '#858199',
    fontSize: 14,
    fontFamily: 'AvenirNextLTPro-regular'
  },
  terms: {
    color: '#858199',
    fontSize: 12,
    lineHeight: 21,
    fontFamily: 'AvenirNextLTPro-regular',
    textAlign: 'left',
    paddingTop: 26,
    width: '100%'
  }
});

const messages = {
  header: 'Create A Password That Is Secure And Easy To Remember!',
  warning:
    'We can’t reset your password if you forget it. Write it down or use a password manager.',
  checks: [
    'Must contain numbers',
    'Length must be at least 8 characters',
    'Passwords match',
    'Hard to guess'
  ],
  commonPwd: 'Please choose a less common password',
  termsAndPrivacy:
    'By clicking continue, you state you have read and agree to Audius',
  terms: 'Terms of Use',
  and: 'and',
  privacy: 'Privacy Policy.',
  buttonTitle: 'Continue'
}

var didAnimation = false
const FormTitle = () => {
  var opacity = new Animated.Value(1);
  if (!didAnimation) {
    opacity = new Animated.Value(0);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start(({ finished }) => {
      didAnimation = true
    });
  }
  return (
    <Animated.View style={{ opacity }}>
      <Text style={styles.title}>{messages.header}</Text>
      {Dimensions.get('window').height < 650 ? <View></View> : <Text style={styles.header}>{messages.warning}</Text>}
    </Animated.View>
  )
}

const MainBtnTitle = ({isWorking}: {isWorking: boolean}) => {
  if (isWorking) {
    return (
      <View style={styles.loadingIcon}>
        <LottieView
          source={require('../../assets/animations/loadingSpinner.json')}
          autoPlay
          loop
        />
      </View>
    )
  } else {
    return (
      <View style={styles.formButtonTitleContainer}>
        <Text style={styles.formButtonTitle}> { messages.buttonTitle } </Text>
        <IconArrow style={styles.arrow} fill={'white'} />
      </View>
    )
  }
}

var opacity1 = new Animated.Value(0);
var opacity2 = new Animated.Value(0);
var opacity3 = new Animated.Value(0);
var opacity4 = new Animated.Value(0);
var opacity1r = new Animated.Value(0);
var opacity2r = new Animated.Value(0);
var opacity3r = new Animated.Value(0);
var opacity4r = new Animated.Value(0);

const Checkbox = ({i, meetsReq, shouldShowRedErrors}: {
  i: number,
  meetsReq: boolean,
  shouldShowRedErrors: boolean}) => {
  const opacityArr = [ opacity1, opacity2, opacity3, opacity4 ]
  const opacityArrR = [ opacity1r, opacity2r, opacity3r, opacity4r ]
  const opacity = opacityArr[i]
  const opacityRed = opacityArrR[i]

  if (meetsReq) {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 700,
      easing: Easing.in(Easing.bounce),
      useNativeDriver: true
    }).start(({ finished }) => {
      //
    });
  } else if (shouldShowRedErrors) {
    Animated.timing(opacityRed, {
      toValue: 1,
      duration: 700,
      easing: Easing.in(Easing.bounce),
      useNativeDriver: true
    }).start(({ finished }) => {
      //
    });
  }

  const animatedStyles = [
    styles.iconCheck,
    {
      opacity: opacity,
      transform: [{
        scale: opacity.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1]
        })
      }]
    }
  ];
  const animatedStylesR = [
    styles.iconCheck,
    {
      opacity: opacityRed,
      transform: [{
        scale: opacityRed.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1]
        })
      }]
    }
  ];
  
  if (meetsReq) {
    return (
      <View style={styles.checkboxContainer}>
        <Animated.View style={ animatedStyles }>
          <IconCheck style={styles.iconCheck}></IconCheck>
        </Animated.View>
        <View style={styles.unchecked}></View>
        <Text style={[styles.uncheckedDescription, {alignSelf: 'center'}]}>{messages.checks[i]}</Text>
      </View>
    )
  } else {
    if (shouldShowRedErrors) {
      return (
      <View style={styles.checkboxContainer}>
        <Animated.View style={ animatedStylesR }>
          <ValidationIconX style={styles.iconCheck}></ValidationIconX>
        </Animated.View>
        <View style={styles.unchecked}></View>
        <Text style={[styles.uncheckedDescription, {alignSelf: 'center', color: '#E03D51'}]}>{messages.checks[i]}</Text>
      </View>
      )
    } else {
      return (
      <View style={styles.checkboxContainer}>
        <View style={styles.unchecked}></View>
        <Text style={[styles.uncheckedDescription, {alignSelf: 'center'}]}>{messages.checks[i]}</Text>
      </View>
      )
    }
  }
}

const MIN_PASSWORD_LEN = 8

const CreatePassword = ({ navigation, route }: { navigation: any, route: any }) => {

  const [passBorderColor, setPassBorderColor] = useState('#F7F7F9');
  const [passBorderColor2, setPassBorderColor2] = useState('#F7F7F9');

  const [isWorking, setisWorking] = useState(false);
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const [meetsNumberReq, setMeetsNumberReq] = useState(false);
  const [meetsLengthReq, setMeetsLengthReq] = useState(false);
  const [meetsMatchReq, setMeetsMatchReq] = useState(false);
  const [meetsCommonReq, setMeetsCommonReq] = useState(false);
  const [shouldShowRedErrors, setShouldShowRedErrors] = useState(false);
  const [shouldShowRedMatchError, setShowRedMatchError] = useState(false);
  const [focusedField, setFocusedField] = useState (0)

  const dispatch = useDispatch()
  // Set Lifecycle onSignUp(true) so signup flow isn't hidden even if signed-in.
  const onSignOn = useSelector(getOnSignUp);
  const setOnSignOn = () => {
    if (!onSignOn) {
    dispatch(LifecycleActions.onSignUp(true))
    }
  }

  const dispatchWeb = useDispatchWebAction()
  const getSuggestedFollowArtists = () => {
    dispatchWeb({
      type: MessageType.FETCH_ALL_FOLLOW_ARTISTS,
      isAction: true
    })
  }
  const [didFetchArtists, setDidFetchArtists] = useState(false);
  if (!didFetchArtists) {
    setDidFetchArtists(true)
    getSuggestedFollowArtists()
  }

  useEffect(() => {
    if (password.length >= MIN_PASSWORD_LEN) {
      setMeetsLengthReq(true)
    } else if (meetsLengthReq) {
      setMeetsLengthReq(false)
    }
    if (password.length > 0 && password == password2) {
      setMeetsMatchReq(true)
      if (focusedField == 1) {
        setPassBorderColor2('#F7F7F9')
      }
    } else if (meetsMatchReq) {
      setMeetsMatchReq(false)
    }
    if (/\d/.test(password)) {
      setMeetsNumberReq(true)
    } else if (meetsNumberReq) {
      setMeetsNumberReq(false)
    }
    if (!commonPasswordList.test(password) && password.length >= MIN_PASSWORD_LEN) {
      setMeetsCommonReq(true)
    } else {
      setMeetsCommonReq(false)
    }
    if (focusedField == 2 && password2 == '' && meetsCommonReq && meetsLengthReq && meetsNumberReq) {
      setPassBorderColor('#F7F7F9')
    } 
  }, [password, password2])

  useEffect(() => {
    if (focusedField == 2 && meetsCommonReq && meetsLengthReq && meetsMatchReq && meetsNumberReq && password2 != '' && password != '') {
      setPassBorderColor('#F7F7F9')
    }
  }, [meetsMatchReq])

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? 'padding' : 'height'}>
      <SignupHeader></SignupHeader>
    <SafeAreaView style={{ backgroundColor: 'white' }} > 
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={styles.containerForm}>
            <FormTitle></FormTitle>
            <TextInput
              style={[styles.input, { borderColor: passBorderColor }]}
              placeholderTextColor='#C2C0CC'
              underlineColorAndroid='transparent'
              placeholder="Password"
              autoCompleteType="off"
              autoCorrect={false}
              autoCapitalize='none'
              //clearTextOnFocus={true}
              enablesReturnKeyAutomatically={true}
              maxLength={100}
              textContentType='newPassword'
              secureTextEntry={true}
              onChangeText={(newText) => {
                setPassword(newText)
                if (newText == '') {
                  setShouldShowRedErrors(false)
                }
              }}
              onFocus={() => { 
                setFocusedField(1)
                setPassBorderColor('#7E1BCC')
              }}
              onBlur={() => { 
                setPassBorderColor('#F7F7F9')
                if (password == '') {
                  setShouldShowRedErrors(false)
                } else {
                  setShouldShowRedErrors(true)
                  if (password != '' && (!meetsCommonReq || !meetsLengthReq || !meetsNumberReq )) {
                    setPassBorderColor('#E03D51')
                  }
                  if (password != '' && password2 != '' && !meetsMatchReq) {
                    setPassBorderColor('#E03D51')
                    setPassBorderColor2('#E03D51')
                  }
                }
              }}
              keyboardAppearance='dark'
            />
            <TextInput
              style={[styles.input, { borderColor: passBorderColor2, marginBottom: 10 }]}
              placeholderTextColor='#C2C0CC'
              underlineColorAndroid='transparent'
              placeholder="Confirm Password"
              autoCompleteType="off"
              autoCorrect={false}
              autoCapitalize='none'
              //clearTextOnFocus={true}
              enablesReturnKeyAutomatically={true}
              maxLength={100}
              textContentType='newPassword'
              secureTextEntry={true}
              onChangeText={(newText) => {
                setPassword2(newText)
              }}
              onFocus={() => { 
                setFocusedField(2)
                setPassBorderColor2('#7E1BCC')
                setShowRedMatchError(false)
              }}
              onBlur={() => { 
                setPassBorderColor2('#F7F7F9')
                
                if (password == '') {
                  setShouldShowRedErrors(false)
                } else {
                  setShouldShowRedErrors(true)
                  setShowRedMatchError(true)
                }
                if (password2 != '' && password != '' && !meetsMatchReq) {
                  setPassBorderColor2('#E03D51')
                  setPassBorderColor('#E03D51')
                }
                if (meetsMatchReq && meetsCommonReq && meetsLengthReq && meetsNumberReq) {
                  setPassBorderColor('#F7F7F9')
                }
              }}
              keyboardAppearance='dark'
            />
            {Checkbox({i:0, meetsReq: meetsNumberReq, shouldShowRedErrors: shouldShowRedErrors})}
            {Checkbox({i:1, meetsReq: meetsLengthReq, shouldShowRedErrors: shouldShowRedErrors})}
            {Checkbox({i:3, meetsReq: meetsCommonReq, shouldShowRedErrors: shouldShowRedErrors})}
            {Checkbox({i:2, meetsReq: meetsMatchReq, shouldShowRedErrors: (password2.length >= password.length || shouldShowRedMatchError) ? shouldShowRedErrors: false})}
            <Text style={styles.terms}>{messages.termsAndPrivacy}
            <Text
              style={{color:'#CC0FE0'}}
              onPress={() => {
                Linking.openURL('https://audius.co/legal/privacy-policy').catch((err) => console.error('An error occurred', err))
              }}
              > {messages.terms}</Text>
            <Text> {messages.and}</Text>
            <Text style={{color:'#CC0FE0'}}
            onPress={() => {
              Linking.openURL('https://audius.co/legal/privacy-policy').catch((err) => console.error('An error occurred', err))
            }}
            > {messages.privacy}</Text>
            </Text>
            <TouchableOpacity
            style={styles.formBtn}
            disabled={isWorking}
            activeOpacity={0.6}
            onPress={() => {
              Keyboard.dismiss()
              if (!isWorking && meetsLengthReq && meetsNumberReq && meetsMatchReq && meetsCommonReq) {
                setOnSignOn()
                console.log(route.params.email)
                navigation.push('ProfileAuto', { email: route.params.email, password: password })
              }
            }}
            >
              <MainBtnTitle isWorking={isWorking}></MainBtnTitle>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
    </KeyboardAvoidingView>
  )
};

export default CreatePassword;