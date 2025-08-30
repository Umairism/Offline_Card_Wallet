import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

export default class BiometricAuth {
  static async isAvailable() {
    try {
      const {available, biometryType} = await rnBiometrics.isSensorAvailable();
      return {available, biometryType};
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return {available: false, biometryType: null};
    }
  }

  static async authenticate() {
    try {
      const {available} = await this.isAvailable();
      
      if (!available) {
        return {
          success: false,
          error: 'Biometric authentication is not available on this device',
        };
      }

      const result = await rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate to access your wallet',
        cancelButtonText: 'Cancel',
      });

      return {
        success: result.success,
        error: result.error,
      };
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return {
        success: false,
        error: 'Authentication failed',
      };
    }
  }

  static async createKeys() {
    try {
      const {keysExist} = await rnBiometrics.biometricKeysExist();
      
      if (!keysExist) {
        const {publicKey} = await rnBiometrics.createKeys();
        return {success: true, publicKey};
      }
      
      return {success: true, publicKey: null};
    } catch (error) {
      console.error('Error creating biometric keys:', error);
      return {success: false, error: error.message};
    }
  }
}
