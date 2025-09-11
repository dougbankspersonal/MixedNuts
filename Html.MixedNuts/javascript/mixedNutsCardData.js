define(["javascript/gameInfo", "dojo/domReady!"], function () {
  //-----------------------------------------
  //
  // Constants
  //
  //-----------------------------------------
  const basicBorderColor = "#5c4033";
  const macadamiaBorderColor = "#2c1810";
  const badNutBorderColor = "#aa3002";
  const specialBorderColor = "#ffee00";

  const peanutBackgroundColor = "#f5deb3";
  const almondBackgroundColor = "#deb887";
  const cashewBackgroundColor = "#d2a679";
  const macadamiaBackgroundColor = "#a9745d";
  const badNutBackgroundColor = "#e6b3a1";

  const wrappingPaperBackgroundColor = "#FF8844";
  const elfMagicBackgroundColor = "#FF8888";
  const broomBackgroundColor = "#FFFF88";
  const glovesBackgroundColor = "#FF4488";
  const cyborgBackgroundColor = "#FF88FF";
  const coffeeBreakBackgroundColor = "#884444";
  const satinBackgroundColor = "#FFCC44";

  const CustomTypeText = "Text";
  const CustomTypePtsText = "PtsText";
  const CustomTypeImage = "Image";

  const gCustomTypes = {
    Text: CustomTypeText,
    PtsText: CustomTypePtsText,
    Image: CustomTypeImage,
  };

  const gCustomTypesArray = Object.keys(gCustomTypes);

  const specialCounts = [
    {
      numPlayers: 2,
      numCards: 1,
    },
    {
      numPlayers: 3,
      numCards: 2,
    },
    {
      numPlayers: 4,
      numCards: 3,
    },
    {
      numPlayers: 5,
      numCards: 3,
    },
  ];

  const gCardConfigs = [
    {
      title: "Peanut",
      class: "peanut",
      craft: {
        number: 3,
        points: 2,
      },
      floor: -2,
      playType: "normal",
      color: peanutBackgroundColor,
      borderColor: basicBorderColor,
      countConfigs: [
        {
          numCards: 19,
          numPlayers: 2,
        },
        {
          numCards: 25,
          numPlayers: 3,
        },
        {
          numCards: 31,
          numPlayers: 4,
        },
        {
          numCards: 37,
          numPlayers: 5,
        },
      ],
    },
    {
      title: "Almond",
      class: "almond",
      color: almondBackgroundColor,
      borderColor: basicBorderColor,
      craft: {
        number: 3,
        points: 3,
      },
      floor: -3,
      playType: "normal",

      countConfigs: [
        {
          numCards: 15,
          numPlayers: 2,
        },
        {
          numCards: 19,
          numPlayers: 3,
        },
        {
          numCards: 24,
          numPlayers: 4,
        },
        {
          numCards: 29,
          numPlayers: 5,
        },
      ],
    },
    {
      title: "Cashew",
      class: "cashew",
      color: cashewBackgroundColor,
      borderColor: basicBorderColor,

      craft: {
        number: 3,
        points: 4,
      },
      floor: -4,
      playType: "normal",
      countConfigs: [
        {
          numCards: 10,
          numPlayers: 2,
        },
        {
          numCards: 13,
          numPlayers: 3,
        },
        {
          numCards: 16,
          numPlayers: 4,
        },
        {
          numCards: 19,
          numPlayers: 5,
        },
      ],
    },
    {
      title: "Macadamia",
      class: "macadamia",
      color: macadamiaBackgroundColor,
      borderColor: macadamiaBorderColor,
      craft: {
        number: 4,
        points: 7,
      },
      floor: -5,
      playType: "challenge",
      fontAdjustment: 0.8,
      countConfigs: [
        {
          numCards: 9,
          numPlayers: 2,
        },
        {
          numCards: 13,
          numPlayers: 3,
        },
        {
          numCards: 13,
          numPlayers: 4,
        },
        {
          numCards: 17,
          numPlayers: 5,
        },
      ],
    },
    {
      title: "Bad Nut",
      class: "bad-nut",
      craft: {
        number: 0,
        points: 0,
      },
      floor: -5,
      playType: "special",
      color: badNutBackgroundColor,
      borderColor: badNutBorderColor,
      countConfigs: specialCounts,
    },
    {
      title: "Honey Roasted",
      class: "honey-roasted",
      customRendering: {
        useClassToIndexFunction: true,
        nutToBonusMap: {
          peanut: 1,
          almond: 2,
          cashew: 3,
          macadamia: 4,
        },
        wrapperScale: 0.6,
      },
      playType: "special",
      color: wrappingPaperBackgroundColor,
      borderColor: specialBorderColor,
      countConfigs: specialCounts,
    },
    {
      title: "Raisin",
      class: "raisin",
      customRendering: {
        customRenderingImageClasses: ["peanut", "almond", "cashew"],
        specialImagesSeparator: "/",
      },
      playType: "special",
      color: elfMagicBackgroundColor,
      borderColor: specialBorderColor,
      countConfigs: specialCounts,
    },
    {
      title: "Broom",
      class: "broom",
      customRendering: {
        customRenderingImageClasses: ["floor", "rightArrow", "noSymbol"],
      },
      playType: "special",
      color: broomBackgroundColor,
      borderColor: specialBorderColor,
      countConfigs: specialCounts,
    },
    {
      title: "Gloves",
      class: "gloves",
      playType: "special",
      customRendering: {
        customRenderingImageClasses: ["floor", "rightArrow", "desk"],
      },
      color: glovesBackgroundColor,
      borderColor: specialBorderColor,
      countConfigs: specialCounts,
    },
    {
      title: "Mixed Nuts",
      class: "mixed-nuts",
      customRendering: {
        points: 5,
        useClassToIndexFunction: true,
        wrapperScale: 0.8,
      },
      playType: "special",
      color: cyborgBackgroundColor,
      borderColor: specialBorderColor,
      countConfigs: specialCounts,
    },
    {
      title: "Coffee Break",
      class: "coffee-break",
      customRendering: {
        customRenderingImageClasses: ["desk", "doubleArrow", "desk"],
      },
      playType: "special",
      color: coffeeBreakBackgroundColor,
      borderColor: specialBorderColor,
      countConfigs: specialCounts,
    },
    {
      title: "Hot Spice",
      class: "hot-spice",
      customRendering: {
        points: 1,
        useClassToIndexFunction: true,
      },
      playType: "special",
      color: satinBackgroundColor,
      borderColor: specialBorderColor,
      countConfigs: specialCounts,
    },
  ];

  // This returned object becomes the defined value of this module
  return {
    cardConfigs: gCardConfigs,
    customTypes: gCustomTypes,
    customTypesArray: gCustomTypesArray,
  };
});
