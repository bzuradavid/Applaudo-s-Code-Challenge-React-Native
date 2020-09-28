import * as React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView } from 'react-native';
import { Container, Header, Content, Item, Input, Icon, Spinner } from 'native-base';
import axios from 'axios'


function DetailScreen({ route, navigation }) {
  const data = route.params
  const youtubeLink = data.youtubeVideoId

  const [genres, setGenres] = React.useState('')
  const [episodes, setEpisodes] = React.useState([])
  // React.useEffect(() => {
  //   console.log(episodes)
  // }, [episodes])

  const [characters, setCharacters] = React.useState([])
  // React.useEffect(() => {
  //   console.log(characters)
  // }, [characters])

  
  // React.useEffect(() => {
  //   console.log(genres)
  // }, [genres])

  const fetchExtraData = React.useCallback(() => {
    // axios.get(data.relationships.episodes.links.self).then(response => {
      // setEpisodes(response.data.data)
    // })
    // axios.get(data.relationships.characters.links.self).then(response => {
      // setCharacters(response.data.data)
    // })
    axios.get(route.params.relationships.genres.links.self).then(response => {
      getGenres(response.data.data)
    })
  }, [])

  React.useEffect(() => {
    // console.log(data)
    fetchExtraData()
  }, [])

  const getGenres = async (genresList) => {
    let formattedGenres = ''
    for (let i = 0; i < genresList.length; i++) {
      let gen = await axios.get(`https://kitsu.io/api/edge/genres/${genresList[i].id}`)
      formattedGenres += gen.data.data.attributes.name
      if (i < genresList.length - 1) formattedGenres += ', '
    }
    setGenres(formattedGenres)
  }

  

  return (
    <View style={{backgroundColor: '#000', flex: 1}}>
      <ScrollView>
        <View style={styles.mainContainer}>
          <View style={styles.headerContainer}>
            <Image style={{ height: 200, width: 150 }} source={{uri: data.attributes.posterImage.small}} />
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>Main Title</Text>
              <Text style={styles.text}>{ data.attributes.titles.en }</Text>
              <Text style={styles.title}>Canonical Title</Text>
              <Text style={styles.text}>{ data.attributes.titles.en }</Text>
              <Text style={styles.title}>Type</Text>
              <Text style={styles.text}>{ data.attributes.showType }, { data.attributes.episodeCount }</Text>
              <Text style={styles.title}>Year</Text>
              <Text style={styles.text}>{ data.attributes.startDate } till { data.attributes.endDate }</Text>
            </View>
          </View>
          <View style={styles.bodyContainer}>
            <Text style={styles.title}>Genres</Text>
            <Text style={styles.text}>{ genres }</Text>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.title}>Average Rating</Text>
                <Text style={styles.text}>{ data.attributes.averageRating }</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.title}>Age Rating</Text>
                <Text style={styles.text}>{ data.attributes.ageRating }</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.title}>Episode Duration</Text>
                <Text style={styles.text}>{ data.attributes.episodeLength } min</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.title}>Airing status</Text>
                <Text style={styles.text}>{ data.attributes.status }</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={{...styles.title, marginTop: 20}}>Synopsis</Text>
                <Text style={styles.text}>{ data.attributes.synopsis}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    padding: 10,
    flex: 1,
    justifyContent: 'flex-start'
  },
  headerContainer: {
    flexDirection:"row",
    marginBottom:20
  },
  headerTextContainer: {
    paddingLeft: 20,
    flex: 1,
    flexDirection: 'column',
  },
  bodyContainer: {
  },
  row: {
    flexDirection: 'row',
  },
  col: {
    flex: 1,
    flexDirection: 'column'
  },
  section: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
    color: '#fff'
  },
  text: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
    flex: 1,
    flexWrap: 'wrap'
  },
  movie: {
    marginVertical: 8,
    marginRight: 16,
    height: 132,
    width: 99,
  }
});


export default DetailScreen
