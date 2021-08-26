import React, {useState, useRef, useEffect} from "react"
import { 
  Animated, 
  ImageBackground, 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard
 } from "react-native"
import { Dispatch } from 'redux'
import { useSelector, useDispatch } from 'react-redux'
import { useDispatchWebAction } from '../../hooks/useWebAction'
import { MessageType } from '../../message'

import RadialGradient from 'react-native-radial-gradient'
import backgImage from '../../assets/images/2-DJ-4-3.jpg'
import audiusLogoHorizontal from '../../assets/images/Horizontal-Logo-Full-Color.png'
import signupCTA from '../../assets/images/signUpCTA.png'
import IconArrow from '../../assets/images/iconArrow.svg'
import LottieView from 'lottie-react-native'
import  * as SignOnActions from '../../store/signon/actions'
import { getIsSigninError } from '../../store/signon/selectors'
import { getIsSignedIn } from '../../store/lifecycle/selectors'

const image = backgImage;

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    zIndex: 2,
    backgroundColor: 'white',
    justifyContent: 'space-evenly'
  },
  containerForm: {
    left: 0,
    width: '100%',
    zIndex: 4,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 40,
    padding: 38
  },
  
  containerCTA: {
    left: 0,
    width: '100%',
    zIndex: 4,
    alignItems: 'center'
  },
  containerBack: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: '40%',
    bottom: 0,
    width: '100%',
    zIndex: 3,
    backgroundColor: 'white'
  },
  image: {
    flex: 1,
    height: '100%'
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 5
  },
  title: {
    color: '#7E1BCC',
    fontSize: 18,
    fontFamily: 'AvenirNextLTPro-Bold',
    lineHeight: 22,
    textAlign: 'center',
    paddingTop: 32,
    paddingBottom: 6
  },
  header: {
    color: '#7E1BCC',
    fontSize: 14,
    lineHeight: 16,
    fontFamily: 'AvenirNextLTPro-regular',
    textAlign: 'center',
    paddingTop: 3,
    paddingBottom: 3
  },
  audiusLogoHorizontal:{
    width: 194,
    height: 51
  },
  signupCTA:{
    marginTop: 32,
    width: 316,
    height: 222
  },
  input: {
    height: 40,
    width: '100%',
    marginTop: 32,
    paddingLeft: 16,
    paddingRight: 16,
    borderWidth: 1,
    borderColor: '#F7F7F9',
    backgroundColor: '#FCFCFC',
    borderRadius: 4,
    padding: 10,
    color: '#858199'
  },
  inputPass: {
    height: 40,
    width: '100%',
    paddingLeft: 16,
    paddingRight: 16,
    borderWidth: 1,
    borderColor: '#F7F7F9',
    backgroundColor: '#FCFCFC',
    borderRadius: 4,
    marginTop: 16,
    padding: 10,
    color: '#858199'
  },
  formBtn: {
    flexDirection: 'row',
    marginTop: 35,
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
  switchFormBtn: {
    height: 32,
    width: '100%',
    alignItems: 'center',
    margin: 38
  },
  switchFormBtnTitle: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'AvenirNextLTPro-regular',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    fontFamily: 'AvenirNextLTPro-regular',
  }
});

const messages = {
  title: 'Sign Up For Audius',
  header1: 'Stream the music you love.',
  header2: 'Support the artists you care about.',
  signinDescription: 'Sign Into Your Audius Account',
  signUp: 'Sign Up',
  signIn: 'Sign In',
  newUser: 'New to Audius? Create an Account',
  oldUser: 'Already have an account? Sign In'
}

const errorMessages = {
  characters: 'Please enter a valid email',
  inUse: 'Email is already in use, please sign-in'
}

const signInErrorMessages = {
  inUse: 'Invalid password',
  default: 'Invalid Credentials'
}

var fadeInDuration = 200
var fadeInDelay = 3000

const FadeInView = (props: { style: any; children: any }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
   
  React.useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: fadeInDuration,
        delay: fadeInDelay,
        useNativeDriver: true
      }
    ).start();
  }, [fadeAnim])

  return (
    <Animated.View
      style={{
        ...props.style,
        opacity: fadeAnim,
      }}
    >
      {props.children}
    </Animated.View>
  );
}

var lastIsSignin = false
const MainBtnTitle = ({isSignin, isWorking}: {isSignin: boolean, isWorking: boolean}) => {
  var opacity = new Animated.Value(1);

  if (lastIsSignin != isSignin) {
    opacity = new Animated.Value(0);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start(({ finished }) => {
      lastIsSignin = isSignin
    });
  }   
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
      <Animated.View style={[styles.formButtonTitleContainer, { opacity }]}>
        <Text style={styles.formButtonTitle}> { isSignin ? messages.signIn:messages.signUp } </Text>
        <IconArrow style={styles.arrow} fill='white' />
      </Animated.View>
    )
  }
}

const FormTitle = ({isSignin}: {isSignin: boolean}) => {
  var opacity = new Animated.Value(1);
  
  if (lastIsSignin != isSignin) {
    //Alert.alert("cambio")
    opacity = new Animated.Value(0);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start(({ finished }) => {
      lastIsSignin = isSignin
    });
  }
  if (isSignin) {
    return (
      <Animated.Text style={[styles.title, { opacity }]} >{messages.signinDescription}</Animated.Text>
    )
  } else {
    return (
      <Animated.View  style={{ opacity }}>
      <Text style={styles.title}>{messages.title}</Text>
      <Text style={styles.header}>{messages.header1}</Text>
      <Text style={styles.header}>{messages.header2}</Text>
      </Animated.View>
    )
  }
}

const SignOn = () => {
  
  const [isWorking, setisWorking] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignin, setisSignIn] = useState(false);
  const [emailBorderColor, setEmailBorderColor] = useState('#F7F7F9');
  const [passBorderColor, setPassBorderColor] = useState('#F7F7F9')

  const isSigninError = useSelector(getIsSigninError);
  const signedIn = useSelector(getIsSignedIn);

  useEffect(() => {
    if (isSigninError) {
      if (isWorking) {
        setisWorking(false)
      }
    }
  }, [isSigninError])

  useEffect(() => {
    if (signedIn) {
      setisWorking(false)
    }
  }, [signedIn])
  
  const errorView = ({isSigninError, isWorking}: {isSigninError: boolean, isWorking: boolean}) => {
    if (isSigninError) {
      return (
      <Text style={styles.errorText}> {signInErrorMessages.default} </Text>
      )
    } else {
      return (
        <Text></Text>
        )
    }
  }
  
  const formSwitchBtnTitle = () => {
    if (isSignin) {
      return (
        <Text style={styles.switchFormBtnTitle}> {messages.newUser} </Text>
      )
    } else {
      return (
        <Text style={styles.switchFormBtnTitle}> {messages.oldUser} </Text>
      )
    }
  }

  const passField = () => {
    if (isSignin) {
      return (
        <TextInput
          style={[styles.inputPass, {borderColor: passBorderColor}]}
          placeholderTextColor= '#C2C0CC'
          underlineColorAndroid='transparent'
          placeholder="Password"
          autoCompleteType="off"
          autoCorrect={false}
          autoCapitalize='none'
          //clearTextOnFocus={true}
          enablesReturnKeyAutomatically={true}
          maxLength={100}
          textContentType="password"
          secureTextEntry={true}
          onChangeText={(newText) => {
            setPassword(newText)
          }}
          onFocus={() => {setPassBorderColor('#7E1BCC')}}
          onBlur={() => {setPassBorderColor('#F7F7F9')}}
        />
      )
    }
  }

  const dispatchWeb = useDispatchWebAction()
  const dispatch = useDispatch()

  // console.log('signedIn:' + signedIn)

  if (signedIn) {
    return null
  } else {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.containerBack}>
          <RadialGradient style={styles.gradient}
                            colors={['rgba(91, 35, 225, 0.8)','rgba(113, 41, 230, 0.640269)','rgba(162, 47, 235, 0.5)']}
                            stops={[0.1,0.67,1]}
                            radius={Dimensions.get('window').width/1.3}>
          </RadialGradient>
          <ImageBackground source={image} resizeMode="cover" style={styles.image} />
        </View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.containerForm}>
            <Image source={audiusLogoHorizontal} style={styles.audiusLogoHorizontal} />
            <FormTitle isSignin={isSignin}></FormTitle>
            <TextInput
            style={[styles.input, {borderColor: emailBorderColor}]}
            placeholderTextColor= '#C2C0CC'
            underlineColorAndroid='transparent'
            placeholder="Email"
            keyboardType="email-address"
            autoCompleteType="off"
            autoCorrect={false}
            autoCapitalize='none'
            enablesReturnKeyAutomatically={true}
            maxLength={100}
            textContentType="username"
            onChangeText={(newText) => {
              setUsername(newText)
            }}
            onFocus={() => {setEmailBorderColor('#7E1BCC')}}
            onBlur={() => {setEmailBorderColor('#F7F7F9')}}
            />

            {passField()}

            {errorView({isSigninError, isWorking})}

            <TouchableOpacity
            style={styles.formBtn}
            onPress={() => {
              Keyboard.dismiss()
              if (!isWorking && username!='' && ((isSignin && password!='') || !isSignin)) {
                setisWorking(true);
                dispatch(SignOnActions.signinFailedReset());
                if (isSignin) {
                  //console.log('Signin: sending message to client')
                  dispatchWeb({
                    type: MessageType.SUBMIT_SIGNIN,
                    username: username,
                    password: password,
                    isAction: true
                  })
                } else {
                  console.log('Sign Up')
                  setisWorking(false);
                }
              }
            }}
            >
              <MainBtnTitle isWorking={isWorking} isSignin={isSignin}></MainBtnTitle>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
        <FadeInView style={styles.containerCTA}>
        {Dimensions.get('window').height < 790 ? <Text></Text> : <Image source={signupCTA} style={styles.signupCTA} />}
          
          <TouchableOpacity
            style={styles.switchFormBtn}
            onPress={() => {
              if (!isWorking) {
                setisSignIn(!isSignin)
                dispatch(SignOnActions.signinFailedReset())
                Keyboard.dismiss()
              }
            }}
            >
            {formSwitchBtnTitle()}
          </TouchableOpacity>
        </FadeInView>
      </View>
      </TouchableWithoutFeedback>
    )
  }
};

export default SignOn;