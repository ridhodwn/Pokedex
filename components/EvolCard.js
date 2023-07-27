import { StyleSheet, Text, View, Image } from "react-native";

const MoveCard = ({ item }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardTitleCon}>
        <Image style={styles.cardImage} source={{ uri: item.img_uri }}></Image>
        <Text style={styles.pokeName}>{item.species_name}</Text>
      </View>
      <View style={styles.cardTextCon}>
        <Text style={styles.cardText}>Min Level: {item.min_level ? item.min_level : '-'}</Text>
        <Text style={styles.cardText}>Trigger: {item.trigger_name}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 170,
    height: "auto",
    borderRadius: 8,
    backgroundColor: "white",
    marginHorizontal: 5,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#dadcde",
  },
  cardTitleCon: {
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#dadcde",
    alignItems: "center",
    justifyContent: "center",
  },
  cardImage: {
    width: 100,
    height: 100,
  },
  pokeName: {
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
  cardTextCon: {
    padding: 5,
  },
  cardText: {
    fontWeight: "500",
    fontSize: 11,
    textAlign: "center",
  },
});

export default MoveCard;
