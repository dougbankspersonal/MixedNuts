define(["javascript/gameInfo", "dojo/domReady!"], function () {
  //-----------------------------------------
  //
  // Constants
  //
  //-----------------------------------------
  const specialBorderColor = "#FFD700";
  const basicBorderColor = "#000066";
  const radioBorderColor = "#006600";
  const pooBorderColor = "#593002";

  const dollBackgroundColor = "#C7CEFF";
  const kiteBackgroundColor = "#6495ED";
  const robotBackgroundColor = "#000080";
  const radioBackgroundColor = "#00aa00";
  const pooBackgroundColor = "#886633";

  const wrappingPaperBackgroundColor = "#FF8844";
  const elfMagicBackgroundColor = "#FF8888";
  const broomBackgroundColor = "#FFFF88";
  const glovesBackgroundColor = "#FF4488";
  const cyborgBackgroundColor = "#FF88FF";
  const fruitcakeBackgroundColor = "#884444";
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
      color: dollBackgroundColor,
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
      title: "Kite",
      class: "kite",
      craft: {
        number: 3,
        points: 3,
      },
      floor: -3,
      playType: "normal",
      color: kiteBackgroundColor,
      borderColor: basicBorderColor,
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
      title: "Robot",
      class: "robot",
      craft: {
        number: 3,
        points: 4,
      },
      floor: -4,
      playType: "normal",
      color: robotBackgroundColor,
      borderColor: basicBorderColor,
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
      title: "Radio",
      class: "radio",
      craft: {
        number: 4,
        points: 7,
      },
      floor: -5,
      playType: "challenge",
      color: radioBackgroundColor,
      borderColor: radioBorderColor,
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
      title: "Reindeer Poo",
      class: "poo",
      craft: {
        number: 0,
        points: 0,
      },
      floor: -5,
      playType: "special",
      color: pooBackgroundColor,
      borderColor: pooBorderColor,
      countConfigs: specialCounts,
    },
    {
      title: "Wrapping Paper",
      class: "wrappingPaper",
      specialCustoms: [
        {
          type: gCustomTypes.Text,
          text: "+",
        },
        {
          type: gCustomTypes.Image,
          imageClass: "package",
        },
        {
          type: gCustomTypes.PtsText,
          points: 3,
        },
      ],
      playType: "special",
      color: wrappingPaperBackgroundColor,
      borderColor: specialBorderColor,
      countConfigs: specialCounts,
    },
    {
      title: "Elf Magic",
      class: "elfMagic",
      specialImageClasses: ["peanut", "kite", "robot"],
      specialImagesSeparator: "/",
      playType: "special",
      color: elfMagicBackgroundColor,
      borderColor: specialBorderColor,
      countConfigs: specialCounts,
    },
    {
      title: "Broom",
      class: "broom",
      specialCustoms: [
        {
          type: CustomTypeImage,
          imageClass: "floor",
        },
        {
          type: CustomTypeImage,
          imageClass: "rightArrow",
        },
        {
          type: CustomTypeImage,
          imageClass: "noSymbol",
        },
      ],
      playType: "special",
      color: broomBackgroundColor,
      borderColor: specialBorderColor,
      countConfigs: specialCounts,
    },
    {
      title: "Gloves",
      class: "gloves",
      specialImageClasses: ["floor", "rightArrow", "desk"],
      playType: "special",
      color: glovesBackgroundColor,
      borderColor: specialBorderColor,
      countConfigs: specialCounts,
    },
    {
      title: "RC<br>Drone-Borg",
      class: "cyborg",
      imagesWrapperScale: 0.6,
      specialImageClasses: ["peanut", "kite", "robot", "radio"],
      specialImagesSeparator: "+",
      specialCustoms: [
        {
          type: gCustomTypes.PtsText,
          points: 5,
        },
      ],
      playType: "special",
      color: cyborgBackgroundColor,
      borderColor: specialBorderColor,
      countConfigs: specialCounts,
    },
    {
      title: "Fruitcake",
      class: "fruitcake",
      specialImageClasses: ["desk", "doubleArrow", "desk"],
      playType: "special",
      color: fruitcakeBackgroundColor,
      borderColor: specialBorderColor,
      countConfigs: specialCounts,
    },
    {
      title: "Satin",
      class: "satin",
      specialCustoms: [
        {
          type: CustomTypeImage,
          imageClass: "peanut",
        },
        {
          type: gCustomTypes.PtsText,
          points: 1,
          plusSign: true,
        },
      ],
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
