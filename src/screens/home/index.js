import * as React from 'react';
import { Button, View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Header, Content, Item, Input, Icon } from 'native-base';
import axios from 'axios';

const SECTIONS = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Section 1',
    movies: [
      {
        id: '283765',
        name: "Movie 1",
        description: "VERY COOL MOVIE"
      },
      {
        id: '28376852',
        name: "Movie 2",
        description: "VERY COOL MOVIE"
      },
      {
        id: '238764827635',
        name: "Movie 3",
        description: "VERY COOL MOVIE"
      },
      {
        id: '24685774765',
        name: "Movie 4",
        description: "VERY COOL MOVIE"
      },
    ]
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Section 2',
    movies: [
      {
        id: '6573548',
        name: "Movie 1",
        description: "VERY COOL MOVIE"
      },
      {
        id: '3846856',
        name: "Movie 2",
        description: "VERY COOL MOVIE"
      },
      {
        id: '364865',
        name: "Movie 3",
        description: "VERY COOL MOVIE"
      },
      {
        id: '37486856',
        name: "Movie 4",
        description: "VERY COOL MOVIE"
      },
    ]
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Section 3',
    movies: [
      {
        id: '3974865',
        name: "Movie 1",
        description: "VERY COOL MOVIE"
      },
      {
        id: '384687',
        name: "Movie 2",
        description: "VERY COOL MOVIE"
      },
      {
        id: '2985736',
        name: "Movie 3",
        description: "VERY COOL MOVIE"
      },
      {
        id: '374865',
        name: "Movie 4",
        description: "VERY COOL MOVIE"
      },
    ]
  },
  {
    id: '58694a0f-3da1-471f-bd96-145ejhbf571e29d72',
    title: 'Section 4',
    movies: [
      {
        id: '397484355665',
        name: "Movie 1",
        description: "VERY COOL MOVIE"
      },
      {
        id: '38454336687',
        name: "Movie 2",
        description: "VERY COOL MOVIE"
      },
      {
        id: '298537564736',
        name: "Movie 3",
        description: "VERY COOL MOVIE"
      },
      {
        id: '3748664275',
        name: "Mo7vie 4",
        description: "VERY COOL MOVIE"
      },
    ]
  },
];

const Movie = ({ navigation, data, name }) => (
  <TouchableOpacity style={styles.movie} onPress={() => navigation.navigate('Detail', data)}>
    <Text style={styles.title}>{name}</Text>
  </TouchableOpacity>
);

function Section ({ navigation, title, movies }) { 

  const renderMovie = ({ item }) => (
    <Movie data={item} name={item.name} navigation={navigation} />
  );

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        horizontal
        data={movies}
        renderItem={renderMovie}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

function HomeScreen({ navigation }) {

  const renderSection = ({ item }) => (
    <Section title={item.title} movies={item.movies} navigation={navigation} />
  );

  return (
    <Container style={{ backgroundColor: '#000', padding: 20}}>
      <View style={{ marginHorizontal: 10 }}>
        <Item>
          <Icon active name='md-search' style={{ color: '#fff'}} />
          <Input placeholder='Search' style={{ color: '#fff'}} />
          <Icon active name='md-close' style={{ color: '#fff'}} />
        </Item>
      </View>
      <FlatList
        style={{ marginTop: 30 }}
        data={SECTIONS}
        renderItem={renderSection}
        keyExtractor={item => item.id}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 16,
    color: '#fff'
  },
  movie: {
    marginVertical: 8,
    marginRight: 16,
    height: 120,
    width: 90,
    backgroundColor: '#FFF'
  }
});

export default HomeScreen