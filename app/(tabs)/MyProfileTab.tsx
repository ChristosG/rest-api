import { useSignUpContext } from '../SignUpContext';
import { useNavigation } from '@react-navigation/native';
import {
  ScrollView, Image, FlatList, Modal,
  TouchableWithoutFeedback, TouchableOpacity, Pressable, useColorScheme,
  StyleSheet, Dimensions, Button, TextInput
} from 'react-native';
import { View, Text } from '../../components/Themed';
import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { useAppContext } from '../AppContext';
import axios from 'axios';
import { useTranslation, Translation, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import enTranslation from '../../assets/en.json';
import deTranslation from '../../assets/de.json';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Entypo } from '@expo/vector-icons';
import DatePickerComponent from '../DatePickerComponent';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      de: {
        translation: deTranslation,
      },
    },
    lng: 'en', // Set the default language
    fallbackLng: 'en', // Fallback language if translation doesn't exist in the selected language
  });



const MyProfileTab: React.FC = () => {
  const { t, i18n } = useTranslation();

  const { updateDayPH, updateMonthPH, updateYearPlaceholder, updateSomeValue, language } = useAppContext();
  const { isSignedUp, someValue, updateSignedUser } = useSignUpContext();
  const navigation = useNavigation();

  const [usernameRepeat, setUsernameRepeat] = useState<string>('');
  const [passwordRepeat, setPasswordRepeat] = useState<string>('');
  const [passwordNew, setPasswordNew] = useState<string>('');
  const [usernameContent, setUsernameContent] = useState<string>('');
  const [passwordContent, setPasswordContent] = useState<string>('');
  const [addressLine1, setAddressLine1] = useState<string>('');
  const [addressLine2, setAddressLine2] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [tk, setTK] = useState<string>('');
  const [notifications, setNotifications] = useState<string[]>([]);

  const handleNavigation = () => {
    if (isSignedUp) {
      navigation.navigate('MyProfileTab', { profileData: someValue });
    } else {
      navigation.navigate('LoginButton');
    }
  };

  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const colorScheme = useColorScheme();
  const responseData = someValue;

  useEffect(() => {
    i18n.changeLanguage(language);
    console.log(language);
  }, [language]);


  const handleNewAccount = () => {
    navigation.navigate('SignupScreen');

  };

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [changePassMsg, setChangePassMsg] = useState<string>('');


  const categories = [
    { id: 'AccountDetails', label: 'Account details' },
    { id: 'ChangeUsername', label: 'Change Username' },
    { id: 'ChangePassword', label: 'Change Password' },
    { id: 'AddAddress', label: 'Add an address' },
    { id: 'Notifications', label: 'Notifications' },

  ];

  const renderCategory = ({ item }: { item: { id: string; label: string } }) => (
    <TouchableOpacity
      onMouseEnter={() => handleMouseEnterCategory(item.id)}
      onMouseLeave={handleMouseLeaveCategory}
      onPress={() => {
        setSelectedCategory(item.id);
        setPasswordContent('');
        setPasswordNew('');
        setPasswordRepeat('');
        setChangePassMsg('');
        setShowEditProfile(false);
      }}
      style={[
        styles.categoryItem,
        {

          borderLeftWidth: (item.id === selectedCategory) ? 10 : 0,
          borderColor: 'rgba(50, 220, 73, 1)',
          backgroundColor: item.id === selectedCategory ? 'rgba(10, 91, 233, 0.4)' : 'transparent',

        }, (hoveredCategory === item.id) && styles.highlightedCategory

      ]}
    >
      <Text style={[
        {
          color: (item.id === selectedCategory) ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.5)',
          fontWeight: (item.id === selectedCategory) ? 'bold' : 'normal',
        }, (hoveredCategory === item.id) && { fontWeight: 'bold' }]}>

        {t(`${item.label}`)}</Text>
    </TouchableOpacity >
  );
  const handleMouseEnterCategory = (meti: any) => {
    setHoveredCategory(meti);

  };

  const handleMouseLeaveCategory = () => {
    setHoveredCategory(null);
  };

  const handlePasswordChange = async () => {

    const getUserEntry = await axios.post('http://localhost:9191/getUser', {
      name: someValue.username,
      password: passwordContent,

    });


    if (getUserEntry.data === 'Login successful') {
      if (passwordNew === passwordRepeat) {
        const updateStatus = await axios.put(`http://localhost:9191/updatePassword`, {
          id: someValue.id,
          name: someValue.username,
          password: passwordNew,
        });
        // console.log('succss?', updateStatus);
        setChangePassMsg('Successful');

      } else {
        setChangePassMsg('Passwords must match');
      }
    } else {
      setChangePassMsg('Wrong password entered');
    }

  };


  const handleAddAddress = async () => {

    const updateAddress = await axios.put('http://localhost:9191/addAddress', {
      userId: someValue.id,
      address1: addressLine1,
      address2: addressLine2,
      city: city,
      tk: tk,
    });


    if (updateAddress.data === 'Success') {

      setChangePassMsg('Successful');

    } else {
      setChangePassMsg(updateAddress.data);
      //console.log(updateAddress.data);
    }
  };

  const editProfile = () => {
    setShowEditProfile(true);

    if (hasBirthdate !== undefined && hasBirthdate !== null) {
      updateYearPlaceholder(Number(hasBirthdate[0]));
      updateDayPH(Number(hasBirthdate[2]));
      updateMonthPH(Number(hasBirthdate[1]));
    } else {
      updateYearPlaceholder('Year');
      updateDayPH('Day');
      updateMonthPH('Month');
    }

  };

  const saveProfile = async () => {

    //console.log(selectedDate);
    //console.log(emailContent);
    const formData = new FormData();
    formData.append('userId', someValue.id);
    formData.append('email', emailContent);
    formData.append('date', selectedDate);
    try {
      const response = await axios.post('http://localhost:9191/addRestDetails', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

    } catch (error) {
      console.error('Error changing profile data:', error);
    }
    checkDetails();
    setShowEditProfile(false);
    try {
      if (hasBirthdate !== undefined && hasBirthdate !== null) {
        updateYearPlaceholder(Number(hasBirthdate[0]));
        updateDayPH(Number(hasBirthdate[2]));
        updateMonthPH(Number(hasBirthdate[1]));
      } else {
        updateYearPlaceholder('Year');
        updateDayPH('Day');
        updateMonthPH('Month');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [hasEmail, setHasEmail] = useState('');
  const [hasBirthdate, setHasBirthdate] = useState([]);


  const checkDetails = async () => {
    if (someValue.id > 0) {
      const getDetails = await axios.get(`http://localhost:9191/getUserDetailsByUserId/${Number(someValue.id)}`);

      setHasBirthdate(getDetails.data.birthdate);
      setHasEmail(getDetails.data.email);
    }
  };

  useEffect(() => {
    checkDetails();

  }, [someValue.id]);

  const handleDateSelection = (date: string) => {
    setSelectedDate(date);
    //console.log(date);
  };

  const renderContent = () => {
    if (selectedCategory === 'AccountDetails') {
      //console.log(someValue);
      const updatedSomeValue = { ...someValue };
      delete updatedSomeValue.username;

      //if get birthday == null && get email===null else

      updatedSomeValue.email = hasEmail;



      const emailPlaceholder = hasEmail === undefined ? 'Enter your email' : hasEmail;

      updatedSomeValue.birthday = (hasBirthdate === undefined || hasBirthdate === null) ? ''
        : hasBirthdate.map(num => (num < 10 ? `0${num}` : `${num}`)).join('-');


      return (
        <View style={{ flex: 1, backgroundColor: 'transparent', width: '80%', marginTop: '5%', }}>
          <FlatList
            style={{ backgroundColor: 'transparent', }}
            data={Object.entries(updatedSomeValue).map(([key, value]) => ({ key, value }))}
            renderItem={renderNotificationItem}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <View style={styles.separatorProf} />}

          />
          {!showEditProfile ?
            <View style={{ alignSelf: 'flex-end', alignItems: 'flex-end', width: '40%', backgroundColor: 'transparent', marginBottom: '30%' }}>

              <TouchableOpacity onPress={() => editProfile()}
                style={{
                  alignItems: 'center', backgroundColor: 'rgba(50, 220, 73, 0.8)', borderRadius: 18, justifyContent: 'center',
                  height: 40, width: '60%',
                }}
              >
                <Text style={{
                  color: `url(../../assets/ProfileBackGTop.png)`, fontSize: 18
                }}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
            : (
              <View style={{
                alignSelf: 'flex-end', alignItems: 'flex-end', width: '40%',
                backgroundColor: 'transparent', marginBottom: '25%',

              }}>
                <TextInput
                  placeholder={emailPlaceholder}
                  value={emailContent}
                  onChangeText={(text) => setEmailContent(text)}
                  style={{
                    borderWidth: 2,
                    borderColor: 'rgba(50, 220, 73, 0.4)',
                    padding: 7,
                    marginTop: '-50%',
                    marginLeft: '-50%',
                    width: '150%',
                    position: 'absolute',
                    alignSelf: 'flex-start',
                    backgroundImage: `url(../../assets/ProfileBackGTop.png)`,
                    color: 'rgba(255,255,255,0.2)',
                    borderRadius: 8
                  }}
                />
                <View style={{
                  marginTop: '-35%', position: 'absolute', backgroundColor: 'transparent',
                  marginRight: '-2.3%'
                }}>
                  <DatePickerComponent onDateSelected={handleDateSelection}></DatePickerComponent></View>


                <TouchableOpacity onPress={() => saveProfile()}
                  style={{
                    alignItems: 'center', backgroundColor: 'rgba(50, 220, 73, 0.8)', borderRadius: 18, justifyContent: 'center',
                    height: 40, width: '60%',
                  }}
                >
                  <Text style={{
                    color: `url(../../assets/ProfileBackGTop.png)`, fontSize: 18
                  }}>Save changes</Text>
                </TouchableOpacity>
              </View>)

          }

        </View>
      );
    } else if (selectedCategory === 'ChangeUsername') {
      //console.log(usernameContent);
      return (
        <View style={{ backgroundColor: 'transparent' }}>

          <Text style={styles.label}>New username:</Text>
          <TextInput
            placeholder="New username"
            value={usernameContent}
            onChangeText={(text) => setUsernameContent(text)}
            style={styles.input}
          />

          <Text style={styles.label}>Repeat new username:</Text>
          <TextInput
            placeholder="Repeat new username"
            value={usernameRepeat}
            onChangeText={(text) => setUsernameRepeat(text)}
            style={styles.input}

          />

        </View>
      );
    } else if (selectedCategory === 'ChangePassword') {

      return (

        <View style={{ backgroundColor: 'transparent' }}>
          <Text style={{
            color: changePassMsg === 'Successful' ? 'rgba(0,255,0,0.8)' : 'rgba(255,0,20,0.8)',
            marginBottom: '7%', alignSelf: 'center'
          }}
          > {changePassMsg} </Text>
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Current password"
              value={passwordContent}
              onChangeText={(text) => setPasswordContent(text)}
              style={[styles.passwordInput,
              { borderColor: changePassMsg === 'Wrong password entered' ? 'red' : 'rgba(50, 220, 73, 0.4)', }]}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}
              style={styles.togglePasswordButton}>
              {!showPassword ?
                <FontAwesome
                  name="eye"
                  size={20}
                  style={[{ color: 'rgba(50, 220, 73, 0.3)', }]}
                />
                : <Entypo
                  name="eye-with-line"
                  size={20}
                  style={[{ color: 'rgba(50, 220, 73, 0.3)', }]}
                />}
            </TouchableOpacity>
          </View>
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="New password"
              value={passwordNew}
              onChangeText={(text) => setPasswordNew(text)}
              style={[styles.passwordInput,
              { borderColor: changePassMsg === 'Passwords must match' ? 'red' : 'rgba(50, 220, 73, 0.4)', }]}
              secureTextEntry={!showPassword2}
            />
            <TouchableOpacity onPress={() => setShowPassword2(!showPassword2)}
              style={styles.togglePasswordButton}>
              {!showPassword2 ?
                <FontAwesome
                  name="eye"
                  size={20}
                  style={[{ color: 'rgba(50, 220, 73, 0.3)', }]}
                />
                : <Entypo
                  name="eye-with-line"
                  size={20}
                  style={[{ color: 'rgba(50, 220, 73, 0.3)', }]}
                />}
            </TouchableOpacity>
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Repeat new password"
              value={passwordRepeat}
              onChangeText={(text) => setPasswordRepeat(text)}
              style={[styles.passwordInput,
              { borderColor: changePassMsg === 'Passwords must match' ? 'red' : 'rgba(50, 220, 73, 0.4)', }]}
              secureTextEntry={!showPassword3}
            />
            <TouchableOpacity onPress={() => setShowPassword3(!showPassword3)}
              style={styles.togglePasswordButton}>
              {!showPassword3 ?
                <FontAwesome
                  name="eye"
                  size={20}
                  style={[{ color: 'rgba(50, 220, 73, 0.3)', }]}
                />
                : <Entypo
                  name="eye-with-line"
                  size={20}
                  style={[{ color: 'rgba(50, 220, 73, 0.3)', }]}
                />}
            </TouchableOpacity>
          </View>
          <View style={{ alignContent: 'flex-end', alignItems: 'flex-end', width: '180%', backgroundColor: 'transparent' }}>
            <TouchableOpacity onPress={() => handlePasswordChange()}
              style={{
                alignItems: 'center', backgroundColor: 'rgba(50, 220, 73, 0.8)', borderRadius: 18, justifyContent: 'center',
                marginTop: '10%', height: 40, width: '60%', marginRight: '20%'
              }}
            >
              <Text style={{
                color: `url(../../assets/ProfileBackGTop.png)`, fontSize: 18
              }}>Set new password</Text>
            </TouchableOpacity>
          </View>
        </View >
      );

    } else if (selectedCategory === 'AddAddress') {
      return (

        <View style={{ backgroundColor: 'transparent', width: '34%' }}>
          <Text style={{
            color: changePassMsg === 'Successful' ? 'rgba(0,255,0,0.8)' : 'rgba(255,0,20,0.8)',
            marginBottom: '7%', alignSelf: 'center'
          }}
          > {changePassMsg} </Text>
          <TextInput
            placeholder="Address Line 1"
            value={addressLine1}
            onChangeText={(text) => setAddressLine1(text)}
            style={[styles.input,
            { borderColor: changePassMsg === 'Empty Address1' ? 'red' : 'rgba(50, 220, 73, 0.4)', }
            ]}
          />
          <TextInput
            placeholder="Address Line 2"
            value={addressLine2}
            onChangeText={(text) => setAddressLine2(text)}
            style={[styles.input,
            { borderColor: changePassMsg === 'Empty Address2' ? 'red' : 'rgba(50, 220, 73, 0.4)', }]}
          />
          <TextInput
            placeholder="City"
            value={city}
            onChangeText={(text) => setCity(text)}
            style={[styles.input,
            { borderColor: changePassMsg === 'Empty city' ? 'red' : 'rgba(50, 220, 73, 0.4)', }]}
          />
          <TextInput
            placeholder="Postal code"
            value={tk}
            onChangeText={(text) => setTK(text)}
            style={[styles.input,
            { borderColor: changePassMsg === 'Empty tk' ? 'red' : 'rgba(50, 220, 73, 0.4)', }]}
          />


          <View style={{ alignContent: 'flex-end', alignItems: 'center', width: '180%', backgroundColor: 'transparent' }}>
            <TouchableOpacity onPress={() => handleAddAddress()}
              style={{
                alignItems: 'center', backgroundColor: 'rgba(50, 220, 73, 0.8)', borderRadius: 18, justifyContent: 'center',
                marginTop: '10%', height: 40, width: '35%', marginRight: '20%'
              }}
            >
              <Text style={{
                color: `url(../../assets/ProfileBackGTop.png)`, fontSize: 18
              }}>Add an address</Text>
            </TouchableOpacity>
          </View></View>
      );
    } else if (selectedCategory === 'Notifications') {

      const updatedSomeValue = { ...someValue };
      delete updatedSomeValue.username;

      return (
        <View style={{ flex: 1, backgroundColor: 'transparent', width: '80%', marginTop: '5%' }}>
          <FlatList
            style={{ backgroundColor: 'transparent', }}
            data={Object.entries(updatedSomeValue).map(([key, value]) => ({ key, value }))}
            renderItem={renderNotificationItem}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <View style={styles.separatorProf} />}

          /></View>
      );
    }
    return null;
  };

  const nots = { id: 1, username: 'user1', password: 'password1' };
  const notificationValues = Object.values(nots);


  const renderNotificationItem = ({ item }: { item: { key: string; value: string } }) => (
    <View style={styles.notificationItem}>
      <Text style={{ color: 'rgba(0,0,0,0.5)', alignSelf: 'flex-start', }}>{item.key === 'id' ? 'ID' :
        item.key === 'name' ? 'Username' : item.key === 'password' ? 'Password' : item.key === 'email' ? 'Email' :
          item.key === 'birthday' ? 'Date of birth' : ''}
        : </Text> <Text style={{ color: `url(../../assets/ProfileBackGTop.png)`, alignSelf: 'flex-end' }}>{item.value}</Text>

    </View>
  );

  return (
    <View style={{ flex: 1 }}>

      {!isSignedUp ? (
        <View style={styles.container2}>
          <Text style={styles.title}>{t('You need to sign in to see this page!')}</Text>
          <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.3)" />

          <Pressable style={styles.buttons}
            onPress={handleNavigation}>
            <Text style={styles.buttonText}>{t('Sign in')}</Text>
          </Pressable>

          <Text style={styles.orStyle}>{t('or')}</Text>

          <Pressable
            style={[styles.buttons, { width: '15%' }]}
            onPress={handleNewAccount}>
            <Text style={styles.buttonText}>{t('Create an account')}</Text>
          </Pressable>

        </View>

      ) : (

        <View style={{ flex: 1, backgroundImage: `url(../../assets/profileBackgroundSide.png)`, }}>

          <View style={{
            backgroundImage: `url(../../assets/ProfileBackGTop.png)`,
            flex: 1, width: '70%', alignSelf: 'center', marginTop: '0%',
          }}>
            <Text style={{
              color: 'black',
              backgroundColor: 'rgba(50, 220, 73, 1)',
              borderRadius: 30,
              padding: 10,
              fontSize: '180%', alignSelf: 'center', marginTop: '5%'
            }}> {t('Profile Overview')}
            </Text>
          </View>
          <View style={styles.containerProf}>

            <View style={styles.sidebar}>
              <FlatList

                data={categories}
                renderItem={renderCategory}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => <View style={styles.separatorProf} />}
              />
            </View>

            <View style={styles.content} >
              {renderContent()}
            </View>

          </View>
        </View>

      )}
    </View>
  );
};

const styles = StyleSheet.create({
  highlightedCategory: {
    borderLeftWidth: 10,
    borderColor: 'rgba(50, 220, 73, 1)',
    fontWeight: 'bold'
    //backgroundColor: 'rgba(50, 220, 73, 1)',
    //color: 'rgba(255, 192, 14, 1)',
  },
  containerProf: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '70%',
    marginTop: '-25%',

  },
  sidebar: {
    flex: 1,
    //backgroundColor: 'rgba(255, 192, 14, 0.7)',
    backgroundImage: `url(../../assets/sidelist.png)`,

  },
  categoryItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',


  },
  separatorProf: {
    height: 0.5,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  content: {
    flex: 4,
    padding: 16,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: '3%'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  hoveredGridItem: {
    transform: [{ scale: 1.1 }],
    shadowColor: 'rgba(255, 240, 23, 0.8)',
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 5,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  introText: {
    fontSize: 18,
    marginBottom: 10,
  },

  gridItem: {
    width: '30%',
    height: '70%',
    padding: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 240, 23, 0.8)',
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: 'rgba(64, 84, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',

  },
  itemText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgba(243, 108, 11, 0.9)',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  heads: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttons: {
    backgroundColor: 'rgba(10, 91, 233, 1)',
    color: "black",
    borderRadius: 5,
    height: '6%',
    width: '6%',
    textAlign: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'rgba(255, 192, 14, 1)',
    fontSize: 16,
    justifyContent: 'center',
    fontWeight: 'bold'
  },
  orStyle: {
    fontSize: 20,
    margin: '1%',
    color: 'lightblue'
  },
  input: {
    borderWidth: 2,
    borderColor: 'rgba(50, 220, 73, 0.4)',
    padding: 8,
    marginBottom: 16,
    backgroundImage: `url(../../assets/ProfileBackGTop.png)`,
    color: 'rgba(255,255,255,0.2)',
    borderRadius: 8
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: `url(../../assets/ProfileBackGTop.png)`,
    fontWeight: 'bold'

  },
  passwordContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: '180%'
  },
  passwordInput: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 2,
    // borderColor: 'rgba(50, 220, 73, 0.4)',
    backgroundImage: `url(../../assets/ProfileBackGTop.png)`,
    color: 'rgba(255,255,255,0.2)',
    padding: 8,
    marginBottom: 16,
  },
  togglePasswordButton: {
    //padding: 8,
    marginTop: -15,
    marginLeft: -30,
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 5,

  },
  notificationItem: {
    padding: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderBottomColor: 'rgba(255,255,255,0.2)',
    marginBottom: 8,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between'

  },

});

export default MyProfileTab;
