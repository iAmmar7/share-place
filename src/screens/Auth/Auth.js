import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';

import DefaultInput from '../../components/UI/DefaultInput/DefaultInput';
import HeadingText from '../../components/UI/HeadingText/HeadingText';
import MainText from '../../components/UI/MainText/MainText';
import ButtonWithBackground from '../../components/UI/ButtonWithBackground/ButtonWithBackground';
import backgroundImage from '../../assets/background.jpg';
import validate from '../../utility/validation';
import { tryAuth } from '../../store/actions/index';

class AuthScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewMode: Dimensions.get('window').height > 500 ? 'portrait' : 'landscape',
      authMode: 'login',
      controls: {
        email: {
          value: 'test@test.com',
          valid: false,
          validationRules: {
            isEmail: true,
          },
          touched: false,
        },
        password: {
          value: '123456',
          valid: false,
          validationRules: {
            minLength: 6,
          },
          touched: false,
        },
        confirmPassword: {
          value: '',
          valid: false,
          validationRules: {
            equalTo: 'password',
          },
          touched: false,
        },
      },
    };
  }

  componentDidMount() {
    Dimensions.addEventListener('change', this.updatStyles);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.updatStyles);
  }

  switchAuthModeHandler = () => {
    this.setState((prevState) => ({
      authMode: prevState.authMode === 'login' ? 'signup' : 'login',
    }));
  };

  updatStyles = (dims) => {
    this.setState({
      viewMode: dims.window.height > 500 ? 'portrait' : 'landscape',
    });
  };

  authHandler = () => {
    Keyboard.dismiss();
    const authData = {
      email: this.state.controls.email.value,
      password: this.state.controls.password.value,
    };
    this.props.tryAuth(authData, this.state.authMode);
  };

  updateInputState = (key, val) => {
    let connectedValue = {};
    if (this.state.controls[key].validationRules.equalTo) {
      const equalControl = this.state.controls[key].validationRules.equalTo;
      const eqalValue = this.state.controls[equalControl].value;
      connectedValue = {
        ...connectedValue,
        equalTo: eqalValue,
      };
    }
    if (key === 'password') {
      connectedValue = {
        ...connectedValue,
        equalTo: val,
      };
    }
    this.setState((prevState) => {
      return {
        controls: {
          ...prevState.controls,
          confirmPassword: {
            ...prevState.controls.confirmPassword,
            valid:
              key === 'password'
                ? validate(
                    prevState.controls.confirmPassword.value,
                    prevState.controls.confirmPassword.validationRules,
                    connectedValue,
                  )
                : prevState.controls.confirmPassword.valid,
          },
          [key]: {
            ...prevState.controls[key],
            value: val,
            valid: validate(val, prevState.controls[key].validationRules, connectedValue),
            touched: true,
          },
        },
      };
    });
  };

  render() {
    const {
      viewMode,
      authMode,
      controls: { email, password, confirmPassword },
    } = this.state;
    let headingText = null;
    let confirmPasswordControl = null;

    if (authMode === 'signup') {
      confirmPasswordControl = (
        <View
          style={
            viewMode === 'portrait'
              ? styles.portraitPasswordWrapper
              : styles.landscapePasswordWrapper
          }>
          <DefaultInput
            placeholder='Confirm Password'
            style={styles.input}
            value={confirmPassword.value}
            onChangeText={(val) => this.updateInputState('confirmPassword', val)}
            valid={confirmPassword.valid}
            touched={confirmPassword.touched}
            autoCapitalize='none'
            secureTextEntry
          />
        </View>
      );
    }

    if (Dimensions.get('window').height > 500) {
      headingText = (
        <MainText>
          <HeadingText>Please Log In</HeadingText>
        </MainText>
      );
    }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
          <View style={styles.container}>
            {headingText}
            <ButtonWithBackground color='#29aaf4' onPress={this.switchAuthModeHandler}>
              Switch to {authMode === 'login' ? 'Sign Up' : 'Login'}
            </ButtonWithBackground>
            <View style={styles.inputContainer}>
              <DefaultInput
                placeholder='Your E-Mail Address'
                style={styles.input}
                value={email.value}
                onChangeText={(val) => this.updateInputState('email', val)}
                valid={email.valid}
                touched={email.touched}
                autoCapitalize='none'
                autoCorrect={false}
                keyboardType='email-address'
              />
              <View
                style={
                  viewMode === 'portrait'
                    ? styles.portraitPasswordContainer
                    : styles.landScapePasswordContainer
                }>
                <View
                  style={
                    viewMode === 'portrait' || authMode === 'login'
                      ? styles.portraitPasswordWrapper
                      : styles.landscapePasswordWrapper
                  }>
                  <DefaultInput
                    placeholder='Password'
                    style={styles.input}
                    value={password.value}
                    onChangeText={(val) => this.updateInputState('password', val)}
                    valid={password.valid}
                    touched={password.touched}
                    autoCapitalize='none'
                    secureTextEntry
                  />
                </View>
                {confirmPasswordControl}
              </View>
            </View>
            {this.props.isLoading ? (
              <ActivityIndicator size='large' color='black' />
            ) : this.state.authMode === 'login' ? (
              <ButtonWithBackground
                color='#29aaf4'
                onPress={this.authHandler}
                // disabled={
                //   !email.valid ||
                //   !password.valid ||
                //   (!confirmPassword.valid && authMode === 'signup')
                // }
              >
                Log In
              </ButtonWithBackground>
            ) : (
              <ButtonWithBackground
                color='#29aaf4'
                onPress={this.authHandler}
                // disabled={
                //   !email.valid ||
                //   !password.valid ||
                //   (!confirmPassword.valid && authMode === 'signup')
                // }
              >
                Sign Up
              </ButtonWithBackground>
            )}
          </View>
        </ImageBackground>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
    flex: 1,
  },
  textHeading: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '85%',
  },
  input: {
    backgroundColor: '#eee',
    borderColor: '#bbb',
  },
  landScapePasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  portraitPasswordContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  landscapePasswordWrapper: {
    width: '45%',
  },
  portraitPasswordWrapper: {
    width: '100%',
  },
});

const mapStateToProps = (state) => ({
  isLoading: state.ui.isLoading,
});

export default connect(mapStateToProps, { tryAuth })(AuthScreen);
