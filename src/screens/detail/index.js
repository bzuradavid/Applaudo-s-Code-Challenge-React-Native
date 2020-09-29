import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Linking } from "react-native";
import { Icon, Spinner, Toast } from "native-base";
import axios from "axios"
import moment from "moment"
import env from "react-native-config"



function DetailScreen({ route }) {
  const data = route.params
  const youtubeVideoId = data.attributes.youtubeVideoId || null
  const startDate = moment(data.attributes.startDate).format("DD/MM/YYYY")
  const endDate = data.attributes.endDate ? moment(data.attributes.endDate).format("DD/MM/YYYY") : null

  const [genres, setGenres] = useState([])
  const [genresLoaded, setGenresLoaded] = useState(false)
  const [charactersLoaded, setCharactersLoaded] = useState(false)
  const [characters, setCharacters] = useState([])
  const [episodesLoaded, setEpisodesLoaded] = useState(false)
  const [episodes, setEpisodes] = useState([])

  const fetchGenres = async () => {
    let formattedGenres
    await axios.get(data.relationships.genres.links.self).then(async (response) => {
      const genresArray = await getResourceDetails(response.data.data, `${env.BASE_URL}/genres/`)
      formattedGenres = genresArray.map(genre => genre.name)
    })
    return formattedGenres
  }

  const fetchCharacters = async () => {
    let formattedCharacters
    await axios.get(data.relationships.characters.links.self).then(async (response) => {
      formattedCharacters = await getResourceDetails(response.data.data, `${env.BASE_URL}/characters/`)
    })
    return formattedCharacters
  }

  const fetchEpisodes = async () => {
    let formattedEpisodes
    await axios.get(data.relationships.episodes.links.self).then(async (response) => {
      formattedEpisodes = await getResourceDetails(response.data.data, `${env.BASE_URL}/episodes/`)
    })
    return formattedEpisodes
  }

  const getResourceDetails = async (resourceList, URL) => {
    let formattedResources = []
    for (let i = 0; i < resourceList.length; i++) {
      try{
        let item = await axios.get(URL + resourceList[i].id)
        formattedResources.push(item.data.data.attributes)
      }catch(err){
        Toast.show({
          text: "Some data was not found",
          duration: 3000,
          buttonText: "CLOSE",
          type: "warning",
          useNativeDriver: true
        })
      }
    }
    return formattedResources
  }

  useEffect(() => {
    let mounted = true
    fetchGenres().then((formattedGenres) => {
      if (mounted) {
        setGenres(formattedGenres)
        setGenresLoaded(true)
      }
    })
    fetchCharacters().then((formattedCharacters) => {
      if (mounted) {
        setCharacters(formattedCharacters)
        setCharactersLoaded(true)
      }
    })
    fetchEpisodes().then((formattedEpisodes) => {
      if (mounted) {
        setEpisodes(formattedEpisodes)
        setEpisodesLoaded(true)
      }
    })
    return function cleanup() {
      mounted = false
    }
  }, [])

  return (
    <View style={{backgroundColor: "#000", flex: 1}}>
      <ScrollView>
        <View style={styles.mainContainer}>
          <View style={styles.headerContainer}>
            <Image style={{ height: 200, width: 150 }} source={{uri: data.attributes.posterImage.small}} />
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>Main Title</Text>
              <Text style={styles.text}>{ data.attributes.titles.en || "Unavailable" }</Text>
              <Text style={styles.title}>Canonical Title</Text>
              <Text style={styles.text}>{ data.attributes.canonicalTitle || "Unavailable" }</Text>
              <Text style={styles.title}>Type</Text>
              <Text style={styles.text}>{ data.attributes.showType || "Unavailable" } { data.attributes.episodeCount > 1 && ", " + data.attributes.episodeCount + " episodes" }</Text>
              <Text style={styles.title}>Year</Text>
              <Text style={styles.text}>{ startDate } { endDate && endDate != startDate && `- ${endDate}`}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.title}>Genres</Text>
            <Text style={styles.text}>{ genresLoaded ? genres.toString().replace(/,/g,",  ") : "Loading..." }</Text>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.title}>Average Rating</Text>
                <Text style={styles.text}>{ data.attributes.averageRating || "Unavailable" }</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.title}>Age Rating</Text>
                <Text style={styles.text}>{ data.attributes.ageRating || "Unavailable" + " (" + data.attributes.ageRatingGuide + ")" }</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.title}>Episode Duration</Text>
                <Text style={styles.text}>{ data.attributes.episodeLength ? data.attributes.episodeLength + " min" : "Unavailable" }</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.title}>Airing status</Text>
                <Text style={styles.text}>{ data.attributes.status || "Unavailable" }</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={{...styles.title, marginVertical: 20}}>Synopsis</Text>
                <Text style={styles.text}>{ data.attributes.synopsis || "Unavailable"}</Text>
              </View>
            </View>

            { youtubeVideoId &&
              <View style={{...styles.row, flex: 1, alignItems: "center" }}>
                <Icon active name="play-circle-outline" style={{ color: "#fff", marginRight: 10}} />
                <Text style={styles.youtubeLink}
                      onPress={() => Linking.openURL("http://www.youtube.com/watch?v=" + data.attributes.youtubeVideoId)}>
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
              <Spinner color="white" />
            }

            { episodesLoaded ?
              <View>
                { episodes.length > 1 &&
                <Text style={{...styles.title, marginVertical: 20}}>Episodes</Text>
                }
                { episodes.length > 1 && episodes.map((episode, i) => {
                  return (
                    <View key={`${episode}-${i}`} style={{marginBottom: 16}}>
                      <Text style={{...styles.text, fontWeight: "bold"}}>Episode { episode.number } { episode.airdate && "(" + moment(episode.airdate).format("DD/MM/YYYY") + ")" }</Text>
                      { episode.titles.en_us ?
                        <Text style={styles.text}>{ episode.titles.en_us + "(" + episode.titles.en_jp + ")" }</Text>
                      :
                        <Text style={styles.text}>Episode info unavailable</Text>
                      }
                    </View>
                  )
                })}
              </View>
            : 
              <Spinner color="white" />
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
    justifyContent: "flex-start"
  },
  headerContainer: {
    flexDirection:"row",
    marginBottom:20
  },
  headerTextContainer: {
    paddingLeft: 20,
    flex: 1,
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
  },
  col: {
    flex: 1,
    flexDirection: "column"
  },
  section: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
    color: "#fff"
  },
  text: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 8,
    flex: 1,
    flexWrap: "wrap"
  },
  youtubeLink: {
    color: "#FFF",
    fontSize: 24,
    marginVertical: 10,
    textDecorationStyle: "solid",
    textDecorationColor: "white",
    textDecorationLine: "underline"
  },
  movie: {
    marginVertical: 8,
    marginRight: 16,
    height: 132,
    width: 99,
  }
});


export default DetailScreen
