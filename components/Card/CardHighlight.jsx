import React, { useEffect, useState } from "react";
import { View, Platform, useWindowDimensions } from "react-native";

import axios from "../../api/axios";

import CardDisplay from "./CardDisplay";

const CardHighlight = ({ setCode }) => {
  const { width } = useWindowDimensions();
  const [ cards, setCards ] = useState([]);
  const [ cardNo, setCardNo ] = useState(0);

  useEffect(() => {
    const getTopCards = async () => {
      const response = await axios.get(`/sets/${setCode}/top-cards`);
      if (response.data.top_cards.length > 0) {
        setCards(response.data.top_cards);
      };
    };

    getTopCards();
  }, [setCode]);

  return (
    <>
      { cards.length > 0 && cardNo > 0 && (
        <View>

        </View>
      )}
    </>
  )

};

module.exports = CardHighlight;