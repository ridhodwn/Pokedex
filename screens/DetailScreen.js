import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import MoveCard from "../components/MoveCard";
import EvolCard from "../components/EvolCard";
import pokeBall from "../assets/pokeball-white.png";

export default function DetailScreen({ route, navigation }) {
  const { itemId } = route.params;
  const [pokemon, setPokemon] = useState([]);
  const [evolution, setEvolution] = useState([]);
  const [moves, setMoves] = useState([]);
  const [headers, setHeaders] = useState("About");
  const [species, setSpecies] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const backgrounds = {
    Grass: "#63bc5a",
    Fire: "#ff9d55",
    Water: "#5090d6",
    Normal: "#929da3",
    Fighting: "#ce416b",
    Flying: "#8fa9de",
    Poison: "#aa6bc8",
    Ground: "#d97845",
    Rock: "#c5b78c",
    Bug: "#91c12f",
    Ghost: "#5269ad",
    Steel: "#5a8ea2",
    Electric: "#f4d23c",
    Psychic: "#fa7179",
    Ice: "#73cec0",
    Dragon: "#0b6dc3",
    Dark: "#5a5465",
    Fairy: "#ec8fe6",
  };
  const defaultBackground = "white";

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${itemId}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Something wrong!");
        }
        return response.json();
      })
      .then((data) => {
        data.name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
        data.typeA =
          data.types[0].type.name.charAt(0).toUpperCase() +
          data.types[0].type.name.slice(1);
        if (data.types.length > 1) {
          data.typeB =
            data.types[1].type.name.charAt(0).toUpperCase() +
            data.types[1].type.name.slice(1);
        }
        data.numStr = data.id.toString().padStart(3, "0");
        data.imgUri = data.sprites.other["official-artwork"].front_default;
        data.height = data.height * 10;
        data.weight = data.weight / 10;
        data.abilities = data.abilities
          .map((el) => {
            return (
              el.ability.name.charAt(0).toUpperCase() + el.ability.name.slice(1)
            )
              .split("-")
              .join(" ");
          })
          .join(", ");
        setPokemon(data);
        return fetch(data.species.url).then((response) => response.json());
      })
      .then((data) => {
        const filtered = data.genera.filter((el) => el.language.name === "en");
        const genus = filtered[0].genus.split(" ")[0];
        setSpecies(genus);
      })
      .catch((error) => {
        console.log(error);
        setError(error);
      })
      .finally(function () {
        setLoading(false);
      });
  }, []);

  if (error) {
    return (
      <Text>
        It seems we ran into some troubles. Please try again in a few minutes.
      </Text>
    );
  }

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={{ marginTop: 15 }}
      />
    );
  }

  const getSpecies = () => {
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${itemId}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Something wrong!");
        }
        return response.json();
      })
      .then((data) => {
        const filtered = data.genera.filter((el) => el.language.name === "en");
        const genus = filtered[0].genus.split(" ")[0];
        setSpecies(genus);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(function () {
        setLoading(false);
      });
  };

  const getEvolution = () => {
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${itemId}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Something wrong!");
        }
        return response.json();
      })
      .then((data) => {
        return fetch(data.evolution_chain.url).then((response) =>
          response.json()
        );
      })
      .then((data) => {
        let evoChain = [];
        let evoData = data.chain;
        let _id = 1;
        do {
          let evoDetails = evoData["evolution_details"][0];
          let numberOfEvolutions = evoData["evolves_to"].length;
          const id = evoData.species.url.split("/")[6];
          evoChain.push({
            _id: id,
            species_name:
              evoData.species.name.charAt(0).toUpperCase() +
              evoData.species.name.slice(1),
            min_level: !evoDetails ? 1 : evoDetails.min_level,
            trigger_name: !evoDetails
              ? "-"
              : (
                  evoDetails.trigger.name.charAt(0).toUpperCase() +
                  evoDetails.trigger.name.slice(1)
                )
                  .split("-")
                  .join(" "),
            item: !evoDetails ? "-" : evoDetails.item,
            img_uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
          });

          if (numberOfEvolutions > 1) {
            for (let i = 1; i < numberOfEvolutions; i++) {
              _id++;
              const id2 = evoData.evolves_to[i].species.url.split("/")[6];
              evoChain.push({
                _id: id,
                species_name:
                  evoData.evolves_to[i].species.name.charAt(0).toUpperCase() +
                  evoData.evolves_to[i].species.name.slice(1),
                min_level: !evoData.evolves_to[i]
                  ? "-"
                  : evoData.evolves_to[i]["evolution_details"][0].min_level,
                trigger_name: !evoData.evolves_to[i]
                  ? "-"
                  : (
                      evoData.evolves_to[i]["evolution_details"][0].trigger.name
                        .charAt(0)
                        .toUpperCase() +
                      evoData.evolves_to[i][
                        "evolution_details"
                      ][0].trigger.name.slice(1)
                    )
                      .split("-")
                      .join(" "),
                item: !evoData.evolves_to[i]
                  ? "-"
                  : evoData.evolves_to[i]["evolution_details"][0].item,
                img_uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id2}.png`,
              });
            }
          }
          _id++;
          evoData = evoData["evolves_to"][0];
        } while (!!evoData && evoData.hasOwnProperty("evolves_to"));
        setEvolution(evoChain);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(function () {
        setLoading(false);
      });
  };

  const getMoves = () => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${itemId}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Something wrong!");
        }
        return response.json();
      })
      .then((data) => {
        let promisesArray = data.moves.map((result) => {
          return fetch(result.move.url).then((response) => response.json());
        });
        return Promise.all(promisesArray);
      })
      .then((data) => {
        const allowed = ["id", "name", "pp", "type"];
        let filtered = data.map((el) => {
          let elFilter = Object.keys(el)
            .filter((key) => allowed.includes(key))
            .reduce((obj, key) => {
              obj[key] = el[key];
              return obj;
            }, {});
          return elFilter;
        });
        filtered
          .sort((a, b) => a.id - b.id)
          .forEach((el) => {
            el.name = el.name
              .split("-")
              .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
              .join(" ");
            el.type.name =
              el.type.name.charAt(0).toUpperCase() + el.type.name.slice(1);
          });
        setMoves(filtered);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(function () {
        setLoading(false);
      });
  };

  const abPress = () => {
    setHeaders("About");
    getSpecies();
  };
  const bsPress = () => {
    setHeaders("BaseStats");
  };
  const evPress = () => {
    setHeaders("Evolution");
    getEvolution();
  };
  const mvPress = () => {
    setHeaders("Moves");
    getMoves();
  };

  const renderItemE = ({ item }) => <EvolCard item={item} />;
  const renderItemM = ({ item }) => <MoveCard item={item} />;

  return (
    <View
      style={{
        backgroundColor: backgrounds[pokemon.typeA] || defaultBackground,
        flex: 1,
        paddingTop: 25,
      }}
      nestedScrollEnabled={true}
    >
      <View style={styles.containerTop}>
        <View style={styles.titleContainer}>
          <View>
            <Text style={styles.titleText}>{pokemon.name}</Text>
            <View style={styles.typeContainer}>
              <View style={styles.pill}>
                <Text style={styles.pillText}>{pokemon.typeA}</Text>
              </View>
              {pokemon.typeB && (
                <View style={styles.pill}>
                  <Text style={styles.pillText}>{pokemon.typeB}</Text>
                </View>
              )}
            </View>
          </View>
          <View>
            <Text style={styles.numberText}>#{pokemon.numStr}</Text>
          </View>
        </View>
      </View>
      <View style={styles.containerMid}>
        <Image
          source={{ uri: pokemon.imgUri }}
          style={styles.imagePkmn}
        ></Image>
        <Image source={pokeBall} style={styles.imageBg}></Image>
      </View>
      <View style={styles.containerBtm}>
        {headers === "About" && (
          <View>
            <View style={styles.aboutTitleCont}>
              <TouchableOpacity style={styles.highlighted} onPress={abPress}>
                <Text style={styles.aboutTitle}>About</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={bsPress}>
                <Text style={styles.aboutTitleO}>Base Stats</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={evPress}>
                <Text style={styles.aboutTitleO}>Evolution</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={mvPress}>
                <Text style={styles.aboutTitleO}>Moves</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.aboutCont}>
              <View style={styles.aboutItem}>
                <Text style={styles.itemKey}>Species</Text>
                <Text style={styles.itemVal}>{species}</Text>
              </View>
              <View style={styles.aboutItem}>
                <Text style={styles.itemKey}>Height</Text>
                <Text style={styles.itemVal}>{pokemon.height} cm</Text>
              </View>
              <View style={styles.aboutItem}>
                <Text style={styles.itemKey}>Weight</Text>
                <Text style={styles.itemVal}>{pokemon.weight} kg</Text>
              </View>
              <View style={styles.aboutItem}>
                <Text style={styles.itemKey}>Abilities</Text>
                <Text style={styles.itemVal}>{pokemon.abilities}</Text>
              </View>
            </View>
          </View>
        )}
        {headers === "BaseStats" && (
          <View>
            <View style={styles.aboutTitleCont}>
              <TouchableOpacity onPress={abPress}>
                <Text style={styles.aboutTitleO}>About</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.highlighted} onPress={bsPress}>
                <Text style={styles.aboutTitle}>Base Stats</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={evPress}>
                <Text style={styles.aboutTitleO}>Evolution</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={mvPress}>
                <Text style={styles.aboutTitleO}>Moves</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.aboutCont}>
              <View style={styles.aboutItem}>
                <Text style={styles.itemKey}>HP</Text>
                <View style={styles.itemBar}>
                  <View
                    style={{
                      backgroundColor:
                        pokemon.stats[0].base_stat >= 100
                          ? "#79c397"
                          : "#e29d9c",
                      width: (pokemon.stats[0].base_stat / 187.5) * 255,
                      borderRadius: 5,
                    }}
                  ></View>
                </View>
              </View>
              <View style={styles.aboutItem}>
                <Text style={styles.itemKey}>Attack</Text>
                <View style={styles.itemBar}>
                  <View
                    style={{
                      backgroundColor:
                        pokemon.stats[1].base_stat >= 100
                          ? "#79c397"
                          : "#e29d9c",
                      width: (pokemon.stats[1].base_stat / 187.5) * 255,
                      borderRadius: 5,
                    }}
                  ></View>
                </View>
              </View>
              <View style={styles.aboutItem}>
                <Text style={styles.itemKey}>Defense</Text>
                <View style={styles.itemBar}>
                  <View
                    style={{
                      backgroundColor:
                        pokemon.stats[2].base_stat >= 100
                          ? "#79c397"
                          : "#e29d9c",
                      width: (pokemon.stats[2].base_stat / 187.5) * 255,
                      borderRadius: 5,
                    }}
                  ></View>
                </View>
              </View>
              <View style={styles.aboutItem}>
                <Text style={styles.itemKey}>Sp. Atk</Text>
                <View style={styles.itemBar}>
                  <View
                    style={{
                      backgroundColor:
                        pokemon.stats[3].base_stat >= 100
                          ? "#79c397"
                          : "#e29d9c",
                      width: (pokemon.stats[3].base_stat / 187.5) * 255,
                      borderRadius: 5,
                    }}
                  ></View>
                </View>
              </View>
              <View style={styles.aboutItem}>
                <Text style={styles.itemKey}>Sp. Def</Text>
                <View style={styles.itemBar}>
                  <View
                    style={{
                      backgroundColor:
                        pokemon.stats[4].base_stat >= 100
                          ? "#79c397"
                          : "#e29d9c",
                      width: (pokemon.stats[4].base_stat / 187.5) * 255,
                      borderRadius: 5,
                    }}
                  ></View>
                </View>
              </View>
              <View style={styles.aboutItem}>
                <Text style={styles.itemKey}>Speed</Text>
                <View style={styles.itemBar}>
                  <View
                    style={{
                      backgroundColor:
                        pokemon.stats[5].base_stat >= 100
                          ? "#79c397"
                          : "#e29d9c",
                      width: (pokemon.stats[5].base_stat / 187.5) * 255,
                      borderRadius: 5,
                    }}
                  ></View>
                </View>
              </View>
            </View>
          </View>
        )}
        {headers === "Evolution" && (
          <View>
            <View style={styles.aboutTitleCont}>
              <TouchableOpacity onPress={abPress}>
                <Text style={styles.aboutTitleO}>About</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={bsPress}>
                <Text style={styles.aboutTitleO}>Base Stats</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.highlighted} onPress={evPress}>
                <Text style={styles.aboutTitle}>Evolution</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={mvPress}>
                <Text style={styles.aboutTitleO}>Moves</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.aboutContF}>
              <FlatList
                data={evolution}
                renderItem={renderItemE}
                keyExtractor={(item) => item._id}
                horizontal={false}
                numColumns={2}
              />
            </View>
          </View>
        )}
        {headers === "Moves" && (
          <View>
            <View style={styles.aboutTitleCont}>
              <TouchableOpacity onPress={abPress}>
                <Text style={styles.aboutTitleO}>About</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={bsPress}>
                <Text style={styles.aboutTitleO}>Base Stats</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={evPress}>
                <Text style={styles.aboutTitleO}>Evolution</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.highlighted} onPress={mvPress}>
                <Text style={styles.aboutTitle}>Moves</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.aboutContF}>
              <FlatList
                data={moves}
                renderItem={renderItemM}
                keyExtractor={(item) => item.id}
                horizontal={false}
                numColumns={3}
              />
            </View>
          </View>
        )}
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  containerTop: {
    paddingHorizontal: 25,
    height: "10%",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleText: {
    fontWeight: "800",
    fontSize: 30,
    color: "#FFFFFF",
  },
  typeContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  pill: {
    paddingHorizontal: 15,
    backgroundColor: "rgba(255,255,255, 0.4)",
    borderRadius: 15,
    paddingVertical: 3,
    marginEnd: 5,
  },
  pillText: {
    color: "white",
    fontWeight: "800",
  },
  numberText: {
    color: "white",
    fontWeight: "800",
    fontSize: 17,
  },
  containerMid: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    height: 250,
    marginTop: 50,
    marginEnd: -50,
  },
  imagePkmn: {
    width: 270,
    height: 270,
    zIndex: 1,
    left: 130,
  },
  imageBg: {
    opacity: 0.3,
    width: 250,
    height: 250,
  },
  containerBtm: {
    backgroundColor: "#FFFFFF",
    height: "53%",
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    paddingHorizontal: 25,
  },
  aboutTitleCont: {
    flexDirection: "row",
    marginTop: 55,
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#dadcde",
  },
  aboutTitle: {
    fontWeight: "800",
    fontSize: 14,
    color: "#36454F",
  },
  aboutTitleO: {
    fontWeight: "800",
    fontSize: 14,
    color: "#D0D0D0",
  },
  highlighted: {
    borderBottomWidth: 1,
    borderBottomColor: "#36454F",
    paddingBottom: 20,
  },
  aboutCont: {
    marginTop: 20,
  },
  aboutContF: {
    marginTop: 20,
    marginBottom: 200,
  },
  aboutItem: {
    flexDirection: "row",
    paddingVertical: 8,
    width: "100%",
    alignItems: "center",
  },
  itemKey: {
    fontWeight: "700",
    fontSize: 14,
    color: "#A9A9A9",
    width: "30%",
  },
  itemVal: {
    fontWeight: "700",
    fontSize: 14,
    color: "#36454F",
  },
  itemBar: {
    height: 5,
    flexDirection: "row",
    width: "70%",
    backgroundColor: "#EEEBEB",
    borderRadius: 5,
  },
});
