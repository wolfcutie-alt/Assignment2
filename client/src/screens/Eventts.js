import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const Home = () => {

    const events = [
        {id: 1, day: '24', month: 'JUN', title: 'Whitecliffe Fashion Week'},
        {id: 2, day: '24', month: 'JUN', title: 'Whitecliffe Fashion Week'},
        {id: 3, day: '24', month: 'JUN', title: 'Whitecliffe Fashion Week'},
        {id: 4, day: '24', month: 'JUN', title: 'Whitecliffe Fashion Week'},
    ];

    return (
        <View style={StyleSheet.container}>
            <View style={Styles.header}>
                <Text style={Styles.headerTitle}>Whitecliffe</Text>
                <TouchableOpacity style={Styles=searchButton}>
                    <Text>Search</Text>
                </TouchableOpacity>
            </View>


            <View style={styles.nav}>
                <TouchableOpacity style={styles.navItem}>
                    <Text>Forum</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Text>Announcements</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Text>Events</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Text>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Text>Message</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.eventsContainer}>
                {events.map((event) => (
                    <View key={event.id} style={styles.eventCard}>
                        <View style={styles.eventDate}>
                            <Text style={styles.eventDay}>{event.day}</Text>
                            <Text style={styles.eventMonth}>{event.month}</Text>
                        </View>
                        <Text style={styles.eventTitle}>{event.title}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>

    );
};

const styles =StyleSheet.create([
    container,{
        flex: 1,
        backgroundColor: 'fff',
    },
    header, {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle,{
        fontSize: 20,
        fontWeight: 'bold',
    },
    searchButton,{
        padding: 5,
    },
    nav,{
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        borderBottomWidth: 1,
        borderBlockColor: '#eee',
    },
    navItem,{
        padding: 5,
    },
    eventsContainer,{
        padding: 15,
    },
    eventCard, {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#f8f8f8',
    },
    eventDate, {
        alignItems: 'center',
        marginRight: 15,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#e1e1e1',
      },
      eventDay, {
        fontSize: 24,
        fontWeight: 'bold',
      },
      eventMonth, {
        fontSize: 12,
        textTransform: 'uppercase',
      },
      eventTitle, {
        fontSize: 16,
        flex: 1,
      },
]);

export default Home;