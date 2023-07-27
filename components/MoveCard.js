import { StyleSheet, Text, View } from "react-native";

const MoveCard = ({ item }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardTitleCon}>
        <Text style={styles.moveName}>{item.name}</Text>
      </View>
      <View style={styles.cardTextCon}>
        <Text style={styles.cardText}>PP: {item.pp}</Text>
        <Text style={styles.cardText}>Type: {item.type.name}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 110,
    height: "auto",
    borderRadius: 8,
    backgroundColor: "white",
    marginHorizontal: 5,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#dadcde",
  },
  cardTitleCon: {
    flex: 1,
    flexDirection: "row",
    height: 50,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#dadcde",
    alignItems: "center",
    justifyContent: "center",
  },
  moveName: {
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
  cardTextCon: {
    padding: 5,
  },
  cardText: {
    fontWeight: "500",
    fontSize: 12,
    textAlign: "center",
  },
});

export default MoveCard;
