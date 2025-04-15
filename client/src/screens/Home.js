import React from "react";
import {View, Text, StyleSheet, ScrollView, Image, TouchableOpacity} from 'react-native '

const HomePage = () => {

    const Profile = {
        name: "Jeon Wonwoo",
        bio: "Ako po si wonu, sobreng miss na miss na si mingya. Pero Kolangan ko gawin lepit na ako umuwi",
        age: 27,
        position: "Student",
        course: "Infromation Technology",
        app: "Fashion Understanding App",
    };

    const post = [
        {
            author: "Yoon Jeonghan",
            role: "Student",
            content: "Prearing for fashion week. Hows yours going???",
            likes: "Like! by Choi Seungcheel and others",
            Comments: "17 comments",
        },
        {
            title: "Secret Flies Feed",
            content: "Shifties\Made in the Middle East. Learn faster than go into the Internet. Help them open messages."
        },
        {
            title: "Short files",
            content: "Moderate Allows Light Learners from many apps to launch harder than ageing images"
        },
    ];

    const friends = [
        "Choi Seungcheel",
        "Choi Seungcheel",
        "Choi Seungcheel",
        "Choi Seungcheel",
        "Choi Seungcheel",
        "Choi Seungcheel",
    ];

    return(
        <ScrollView style={StyleSheet.container}>

            <View style={styles.header}>
                <Text style={styles}>Whitecliffe Fashion Week</Text>
            </View>

            {/*this is the profile*/}
            <View style={styles.ProfileSection}>
                <Text style={styles.sectionTitle}>About me</Text>
                <Text style={styles.sectionTitle}>Profile Name</Text>
                <Text style={styles.sectionTitle}>Profile Bio</Text>
            
            <View style={styles.profileDetails}>
            <Text style={styles.detailItem}><Text style={styles.detailLabel}>Age: </Text>{profile.age}</Text>
            <Text style={styles.detailItem}><Text style={styles.detailLabel}>Position: </Text>{profile.position}</Text>
            <Text style={styles.detailItem}><Text style={styles.detailLabel}>Course: </Text>{profile.course}</Text>
            </View>

            <Text style={styles.appTitle}>Profile</Text>
            <Text style={styles.appName}>(profile.app)</Text>
            </View>

            <View style={styles.divider}></View>

            {posts.map((post, index) => (
        <View key={index} style={styles.postContainer}>
          {post.author ? (
            <>
              <View style={styles.postHeader}>
                <Text style={styles.postAuthor}>{post.author}</Text>
                <Text style={styles.postRole}>{post.role}</Text>
              </View>
              <Text style={styles.postContent}>{post.content}</Text>
              <View style={styles.postFooter}>
                <Text style={styles.postLikes}>{post.likes}</Text>
                <Text style={styles.postComments}>{post.comments}</Text>
              </View>
            </>

          ) : (

            <>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={.styles.postContent}>{post.content}</Text>
            </>
            )}
            {index < post.length - && <View style={styles.postDivider} />}
            </View>
            ))}

            <View style={styles.divider}></View>
            
            <View style={styles.friendSection}>
                <Text style={styles.sectionTitle}>friends </Text>
            </View>
        </ScrollView>
    )
}