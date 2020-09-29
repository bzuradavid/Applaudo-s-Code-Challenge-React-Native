import * as React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, FlatList, Linking } from 'react-native';
import { Container, Header, Content, Item, Input, Icon, Spinner, Toast } from 'native-base';
import axios from 'axios'
import moment from 'moment'



function DetailScreen({ route, navigation }) {
  const data = route.params
  const startDate = moment(data.attributes.startDate).format('DD/MM/YYYY')
  const endDate = data.attributes.endDate ? moment(data.attributes.endDate).format('DD/MM/YYYY') : null

  const [error, setError] = React.useState(false)
  React.useEffect(() => {
    
  },[error])
  const [genres, setGenres] = React.useState([])
  const [characters, setCharacters] = React.useState([])
  const [charactersLoaded, setCharactersLoaded] = React.useState(false)
  const [episodes, setEpisodes] = React.useState([])
  const [episodesLoaded, setEpisodesLoaded] = React.useState(false)

  const fetchExtraData = () => {
    axios.get(data.relationships.genres.links.self).then(async (response) => {
      const genresArray = await getResourceDetails(response.data.data, 'https://kitsu.io/api/edge/genres/')
      const formattedGenres = genresArray.map(genre => genre.name)
      setGenres(formattedGenres)
    })
    axios.get(data.relationships.characters.links.self).then(async (response) => {
      setCharacters(await getResourceDetails(response.data.data, 'https://kitsu.io/api/edge/characters/'))
      setCharactersLoaded(true)
    })
    axios.get(data.relationships.episodes.links.self).then(async (response) => {
      setEpisodes(await getResourceDetails(response.data.data, 'https://kitsu.io/api/edge/episodes/'))
      setEpisodesLoaded(true)
    })
  }

  React.useEffect(() => {
    console.log(data.attributes)
    fetchExtraData()
  }, [])

  const getResourceDetails = async (resourceList, URL) => {
    let formattedResources = []
    for (let i = 0; i < resourceList.length; i++) {
      try {
        let item = await axios.get(URL + resourceList[i].id)
        formattedResources.push(item.data.data.attributes)
      } catch(err) {
        Toast.show({
          text: "Some data was not found",
          duration: 3000,
          type: "danger"
        })
        console.log(URL + resourceList[i].id, err.message)
      }
    }
    return formattedResources
  }

  

  return (
    <View style={{backgroundColor: '#000', flex: 1}}>
      <ScrollView>
        <View style={styles.mainContainer}>
          <View style={styles.headerContainer}>
            <Image style={{ height: 200, width: 150 }} source={{uri: data.attributes.posterImage.small}} />
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>Main Title</Text>
              <Text style={styles.text}>{ data.attributes.titles.en || 'Unavailable' }</Text>
              <Text style={styles.title}>Canonical Title</Text>
              <Text style={styles.text}>{ data.attributes.canonicalTitle || 'Unavailable' }</Text>
              <Text style={styles.title}>Type</Text>
              <Text style={styles.text}>{ data.attributes.showType } { data.attributes.episodeCount > 1 && `, ${data.attributes.episodeCount} episodes` }</Text>
              <Text style={styles.title}>Year</Text>
              <Text style={styles.text}>{ startDate } { endDate && endDate != startDate && `- ${endDate}`}</Text>
            </View>
          </View>
          <View style={styles.bodyContainer}>
            <Text style={styles.title}>Genres</Text>
            <Text style={styles.text}>{ genres.length > 0 ? genres.toString().replace(/,/g,',  ') : 'Loading...' }</Text>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.title}>Average Rating</Text>
                <Text style={styles.text}>{ data.attributes.averageRating }</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.title}>Age Rating</Text>
                <Text style={styles.text}>{ `${data.attributes.ageRating} (${data.attributes.ageRatingGuide})` }</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.title}>Episode Duration</Text>
                <Text style={styles.text}>{ data.attributes.episodeLength ? `${data.attributes.episodeLength} min` : 'Unavailable' }</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.title}>Airing status</Text>
                <Text style={styles.text}>{ data.attributes.status }</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={{...styles.title, marginVertical: 20}}>Synopsis</Text>
                <Text style={styles.text}>{ data.attributes.synopsis}</Text>
              </View>
            </View>

            { data.attributes.youtubeVideoId &&
              <View style={{...styles.row, flex: 1, alignItems: 'center' }}>
                <Icon active name='play-circle-outline' style={{ color: '#fff', marginRight: 10}} />
                <Text style={styles.youtubeLink}
                      onPress={() => Linking.openURL(`http://www.youtube.com/watch?v=${data.attributes.youtubeVideoId}`)}>
                  Watch trailer on YouTube
                </Text>
              </View>
            }

            { charactersLoaded ?
              <View>
                {characters.length > 0 &&
                <Text style={{...styles.title, marginVertical: 20}}>Characters</Text>
                }
                { characters.map(char => {
                    return <Text style={styles.text} key={char.slug}>{char.name}</Text>
                })}
              </View>
            :
              <Spinner color='white' />
            }

            { episodesLoaded ?
              <View>
                { episodes.length > 1 &&
                <Text style={{...styles.title, marginVertical: 20}}>Episodes</Text>
                }
                { episodes.length > 1 && episodes.map((episode, i) => {
                  return (
                    <View key={`${episode}-${i}`} style={{marginBottom: 16}}>
                      <Text style={{...styles.text, fontWeight: 'bold'}}>Episode {episode.number} {episode.airdate && `(${moment(episode.airdate).format('DD/MM/YYYY')})`}</Text>
                      { episode.titles.en_us ?
                        <Text style={styles.text}>{`${episode.titles.en_us} (${episode.titles.en_jp})`}</Text>
                      :
                        <Text style={styles.text}>Episode info unavailable</Text>
                      }
                    </View>
                  )
                })}
              </View>
            : 
              <Spinner color='white' />
            }

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
  youtubeLink: {
    color: '#FFF',
    fontSize: 24,
    marginVertical: 10,
    textDecorationStyle: 'solid',
    textDecorationColor: 'white',
    textDecorationLine: 'underline'
  },
  movie: {
    marginVertical: 8,
    marginRight: 16,
    height: 132,
    width: 99,
  }
});


export default DetailScreen
