import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { withDecay } from 'react-native-reanimated';
import { useAppContext } from './AppContext';

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());


const DatePickerComponent: React.FC<{ onDateSelected: (date: string) => void }> = ({ onDateSelected }) => {
    const [isMonthModalVisible, setMonthModalVisible] = useState(false);
    const [isDayModalVisible, setDayModalVisible] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const { dayPH, monthPH, yearPH } = useAppContext();
    const openMonthModal = () => setMonthModalVisible(true);
    const closeMonthModal = () => setMonthModalVisible(false);
    const openDayModal = () => setDayModalVisible(true);
    const closeDayModal = () => setDayModalVisible(false);

    const handleMonthSelection = (month: string) => {
        setSelectedMonth(month);
        closeMonthModal();
        onDateSelected(`${selectedYear}-${month}-${selectedDay}`);
    };

    const handleDaySelection = (day: string) => {
        setSelectedDay(day);
        closeDayModal();
        onDateSelected(`${selectedYear}-${selectedMonth}-${day}`);

    };

    useEffect(() => {
        onDateSelected(`${selectedYear}-${selectedMonth}-${selectedDay}`);
    }, [selectedYear]);

    return (
        <View style={styles.container6}>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder={monthPH !== undefined && monthPH !== null ? months[monthPH - 1] : monthPH}
                    value={selectedMonth}
                    onClick={openMonthModal}
                    onChangeText={(text) =>
                        (text === 'j' || text === 'J') ? setSelectedMonth('January') :
                            (text === 'f' || text === 'F') ? setSelectedMonth('February') :
                                (text === 'Mar' || text === 'mar') ? setSelectedMonth('March') :
                                    (text === 'may' || text === 'May') ? setSelectedMonth('May') :
                                        setSelectedMonth('')
                    }
                    style={[styles.input2, {}]}
                />
                <TextInput
                    placeholder={dayPH}
                    value={selectedDay}
                    onClick={openDayModal}
                    onChangeText={(text) => (Number(text) > 0 && Number(text) < 32) ? setSelectedDay(text) :
                        setSelectedDay('')}
                    style={[styles.input2, {}]}
                />
                <TextInput
                    placeholder={yearPH}
                    value={selectedYear}
                    onChangeText={(text) => setSelectedYear(text)}
                    //onFocus={openYearModal}
                    style={[styles.input2, {}]}
                />
            </View>

            <Modal
                visible={isMonthModalVisible}
                animationType="slide"
                transparent={true}

            >
                <View style={[styles.modalContainer, { marginLeft: '4.2%', marginTop: '29.1%', marginBottom: '6.4%' }]}>
                    <FlatList
                        data={months}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleMonthSelection(item)}>
                                <Text style={styles.modalItem}>{item}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item}
                        showsVerticalScrollIndicator={false}
                    />
                    <TouchableOpacity onPress={closeMonthModal}>
                        <Text style={styles.modalItem}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <Modal
                visible={isDayModalVisible}
                animationType="slide"
                transparent={true}
            >
                <View style={[styles.modalContainer, { marginLeft: '25.6%', marginTop: '29.1%', marginBottom: '6.4%' }]}>
                    <FlatList
                        data={days}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleDaySelection(item)}>
                                <Text style={styles.modalItem}>{item}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item}
                        showsVerticalScrollIndicator={false}

                    />
                    <TouchableOpacity onPress={closeDayModal}>
                        <Text style={styles.modalItem}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>


        </View>
    );
};

const styles = StyleSheet.create({
    container6: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
    },
    input2: {
        flex: 1,
        borderWidth: 2,
        backgroundImage: `url(../../assets/ProfileBackGTop.png)`,
        color: 'rgba(255,255,255,0.2)',
        borderColor: 'rgba(50, 220, 73, 0.4)',
        borderRadius: 8,
        padding: 7,
        marginRight: 8,
    },
    modalContainer: {

        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'rgba(124, 222, 222, 0.4)',
        width: '10.1%'
    },
    modalItem: {
        padding: 16,
        fontSize: 18,
        color: 'white',
    },
    yearInput: {
        backgroundColor: 'white',
        width: 200,
        padding: 16,
        fontSize: 18,
    },
});

export default DatePickerComponent;


