define([
  "javascript/gameInfo",
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/htmlUtils",
  "javascript/mixedNutsCardData",
  "dojo/dom-style",
  "dojo/domReady!",
], function (
  gameInfo,
  cards,
  debugLog,
  htmlUtils,
  mixedNutsCardData,
  domStyle
) {
  //-----------------------------------------
  //
  // Constants
  //
  //-----------------------------------------
  var minicardWidth = 30;
  var minicardBorderWidth = 4;
  var minicardHeight = minicardWidth * 1.4;
  var whiteOutlineClass = "white_outline";

  var minicardCollectionWidth = minicardWidth * 3;
  var minicardCollectionHeight = minicardHeight + 2 * minicardBorderWidth;

  //-----------------------------------------
  //
  // Functions
  //
  //-----------------------------------------
  function maybeAddSpacer(parent, opt_index, opt_separator) {
    var separator = opt_separator ? opt_separator : "&nbsp;";

    if (separator && opt_index && opt_index > 0) {
      htmlUtils.addDiv(
        parent,
        ["special_image_spacer"],
        "specialImageSpacer",
        separator
      );
    }
  }

  function makeMinicard(parent) {
    var minicard = htmlUtils.addDiv(parent, ["minicard"], "minicard");
    domStyle.set(minicard, {
      height: `${minicardHeight}px`,
      width: `${minicardWidth}px`,
      border: `${minicardBorderWidth}px solid #000`,
    });
    return minicard;
  }

  // We already have a parent wrapper.
  // add in a "= n" node and a coin image.
  // Returns nothing.
  function insertSomethingEqualsPointsNode(
    parentNode,
    points,
    opt_pointsPrefix
  ) {
    console.assert(Number.isInteger(points), "Points must be an integer");
    var pointsString;
    var pointsPrefix = opt_pointsPrefix ? opt_pointsPrefix : "";
    if (points < 0) {
      pointsString = ` :&nbsp;<div class="negative">${pointsPrefix}${points}</div>`;
    } else {
      pointsString = ` : ${pointsPrefix}${points}`;
    }

    htmlUtils.addDiv(
      parentNode,
      ["colon_and_points"],
      "colonAndPoints",
      pointsString
    );

    htmlUtils.addImage(parentNode, ["coin", "dark_shadowed"], "coin");
  }

  function addNthSpecialImage(
    imagesWrapper,
    specialImageClass,
    opt_index,
    opt_separator
  ) {
    maybeAddSpacer(imagesWrapper, opt_index, opt_separator);

    if (specialImageClass == "card") {
      makeMinicard(imagesWrapper);
    } else {
      htmlUtils.addImage(
        imagesWrapper,
        ["special_image", specialImageClass, "dark_shadowed"],
        "specialImage"
      );
    }
  }

  function addNthSpecialCustom(parent, specialCustoms, index, opt_separator) {
    var specialCustom = specialCustoms[index];

    var classes = ["special_custom", "unbroken_row"];
    if (specialCustom.small) {
      classes.push("small");
    }

    var customNode = htmlUtils.addDiv(parent, classes, "specialCustom");
    if (specialCustom.type == mixedNutsCardData.customTypes.Text) {
      customNode.innerHTML = specialCustom.text;
    } else if (specialCustom.type == mixedNutsCardData.customTypes.PtsText) {
      insertSomethingEqualsPointsNode(
        customNode,
        specialCustom.points,
        specialCustom.plusSign ? "+" : ""
      );
    } else if (specialCustom.type == mixedNutsCardData) {
      addNthSpecialImage(customNode, specialCustom.imageClass);
    }

    if (specialCustom.fontColor) {
      domStyle.set(customNode, "color", specialCustom.fontColor);
    }
  }

  function addSpecialImages(parent, cardConfig) {
    var imagesWrapper = htmlUtils.addDiv(
      parent,
      ["images_wrapper"],
      "imagesWrapper"
    );

    if (cardConfig.imagesWrapperScale) {
      domStyle.set(
        imagesWrapper,
        "transform",
        `scale(${cardConfig.imagesWrapperScale})`
      );
    }

    for (var i = 0; i < cardConfig.specialImageClasses.length; i++) {
      addNthSpecialImage(
        imagesWrapper,
        cardConfig.specialImageClasses[i],
        i,
        cardConfig.specialImagesSeparator
      );
    }
  }

  function addPlayerIndicator(parent, cardConfig, indexWithinConfig) {
    var countConfigs = cardConfig.countConfigs;
    debugLog.debugLog(
      "Cards",
      "Doug: addPlayerIndicator: indexWithinConfig = " + indexWithinConfig
    );

    // Count configs says, in order of players & increasing card count, for this
    // many players, use this many cards.
    // For 2 players we don't need a count indicator: they always go in.
    // For a 3 player game, we want the delta from 3 to 4 to player to be marked 3+.
    // Etc.
    for (var i = 1; i < countConfigs.length; i++) {
      var previousConfig = countConfigs[i - 1];
      var thisConfig = countConfigs[i];

      if (
        indexWithinConfig >= previousConfig.numCards &&
        indexWithinConfig < thisConfig.numCards
      ) {
        var playerIndicatorNode = htmlUtils.addDiv(
          parent,
          ["player_indicator"],
          "playerIndicator"
        );
        htmlUtils.addImage(playerIndicatorNode, ["player"], "player");

        var maybePlus = thisConfig.numPlayers == gameInfo.maxPlayers ? "" : "+";
        htmlUtils.addDiv(
          playerIndicatorNode,
          ["player_count"],
          "playerCount",
          thisConfig.numPlayers.toString() + maybePlus
        );
        return playerIndicatorNode;
      }
    }
    return null;
  }

  // A display if n fixed-sized cards in some fixed width.
  function addMiniCardCollection(parentNode, craftConfig) {
    var number = craftConfig.number;
    console.assert(number > 0, "Number must be defined");

    var cardCollectionNode = htmlUtils.addDiv(
      parentNode,
      ["card_collection"],
      "cardCollection"
    );

    domStyle.set(cardCollectionNode, {
      width: `${minicardCollectionWidth}px`,
      height: `${minicardCollectionHeight}px`,
    });

    var widthMinusPoofedCard =
      minicardCollectionWidth - minicardWidth - minicardBorderWidth * 2;
    var leftChunk = widthMinusPoofedCard / (number - 1);

    for (var i = 0; i < number; i++) {
      var minicardNode = makeMinicard(cardCollectionNode);
      var cardLeft = i * leftChunk;
      domStyle.set(minicardNode, {
        left: `${cardLeft}px`,
      });
    }

    return cardCollectionNode;
  }

  function addCardCorners(parent, cardClass) {
    if (cardClass == null || cardClass == undefined) {
      return;
    }

    var indexClass = "index0";
    htmlUtils.addImage(
      parent,
      [cardClass, whiteOutlineClass, "component_image", "index0"],
      "component_image"
    );
    htmlUtils.addImage(
      parent,
      [cardClass, whiteOutlineClass, "component_image", "index1"],
      "component_image"
    );
  }

  function addCannotBeCraftedNode(parent) {
    var cannotBeCraftedNode = htmlUtils.addDiv(
      parent,
      ["cannot_be_crafted"],
      "cannotBeCrafted"
    );
    var deskNode = htmlUtils.addImage(
      cannotBeCraftedNode,
      ["desk", "dark_shadowed"],
      "desk"
    );
    htmlUtils.addImage(deskNode, ["noSymbol"], "noSymbol");
    return cannotBeCraftedNode;
  }

  function maybeAddStandardCraftngInfo(parentNode, cardConfig) {
    var craftingNode = null;
    if (cardConfig.craft) {
      var craftConfig = cardConfig.craft;
      if (craftConfig.number > 0) {
        craftingNode = htmlUtils.addDiv(
          parentNode,
          ["craft_wrapper", "unbroken_row"],
          "craftWrapper"
        );
        addMiniCardCollection(craftingNode, craftConfig);
        insertSomethingEqualsPointsNode(craftingNode, craftConfig.points);
      } else {
        craftingNode = addCannotBeCraftedNode(parentNode);
      }
    }
    return craftingNode;
  }

  function maybeAddStandardFloorPenalty(parentNode, cardConfig) {
    if (cardConfig.floor) {
      var floorWrapperNode = htmlUtils.addDiv(
        parentNode,
        ["floor_wrapper", "unbroken_row"],
        "floorWrapper"
      );
      var floorImageNode = htmlUtils.addImage(
        floorWrapperNode,
        ["floor"],
        "floor"
      );
      insertSomethingEqualsPointsNode(floorWrapperNode, cardConfig.floor);
    }
  }

  function addFields(parent, cardConfig, indexWithinConfig) {
    // These are the icons in upper left and lower corner of card.
    addCardCorners(parent, cardConfig.class);

    addPlayerIndicator(parent, cardConfig, indexWithinConfig);

    var mainWrapper = htmlUtils.addDiv(parent, ["main_wrapper"], "mainWapper");
    if (cardConfig.title) {
      var imageNode = htmlUtils.addDiv(mainWrapper, ["title"], "title");
      imageNode.innerHTML = cardConfig.title;
    }

    maybeAddStandardCraftngInfo(mainWrapper, cardConfig);

    if (cardConfig.specialImageClasses) {
      addSpecialImages(mainWrapper, cardConfig);
    }

    if (cardConfig.specialCustoms) {
      var specialCustomsWrapper = htmlUtils.addDiv(
        mainWrapper,
        ["special_customs_wrapper", "unbroken_row"],
        "specialCustomsWrapper"
      );
      for (var i = 0; i < cardConfig.specialCustoms.length; i++) {
        addNthSpecialCustom(
          specialCustomsWrapper,
          cardConfig.specialCustoms,
          i
        );
      }
    }

    maybeAddStandardFloorPenalty(mainWrapper, cardConfig);
  }

  function addCardBack(parent, index) {
    var backNode = htmlUtils.addCard(
      parent,
      ["back", "mixed-nuts-back"],
      "back"
    );

    cards.setCardSize(backNode);

    var insetNode = htmlUtils.addDiv(backNode, ["inset"], "inset");
    var gradient = "radial-gradient(#ffffff 50%, #228b22)";
    domStyle.set(insetNode, "background", gradient);

    htmlUtils.addImage(insetNode, ["fixme"], "fixme");

    return backNode;
  }

  function calculatePlayerBasedInstanceCount(cardConfig) {
    switch (cardConfig.playType) {
      case "normal":
        {
          var scale = -1.5 * cardConfig.craft.points + 9;
          retVal = Math.ceil(scale * gameInfo.maxPlayers + 1);
        }
        break;
      case "challenge":
        {
          retVal = 4 * Math.ceil(gameInfo.maxPlayers / 2) + 2;
        }
        break;
      default:
        {
          retVal = Math.ceil(gameInfo.maxPlayers / 2);
        }
        break;
    }
    return retVal;
  }

  function addCardFront(parent, cardConfig, index, opt_indexWithinConfig) {
    var indexWithinConfig =
      opt_indexWithinConfig !== undefined ? opt_indexWithinConfig : 0;

    var idElements = ["mixed-nuts-component", index.toString()];
    var id = idElements.join(".");

    var classArray = [];
    classArray.push("mixed-nuts-component");
    classArray.push(cardConfig.class);
    var cardFrontNode = cards.addCardFront(parent, classArray, id);

    var gradient = `radial-gradient(#ffffff 65%, ${cardConfig.color})`;

    domStyle.set(cardFrontNode, {
      background: gradient,
      "border-color": cardConfig.borderColor,
    });

    addFields(cardFrontNode, cardConfig, indexWithinConfig);
    return cardFrontNode;
  }

  function addCardFrontAtIndex(parent, index) {
    console.assert(parent, "parent is null");
    var cardConfig = cards.getCardConfigAtIndex(
      mixedNutsCardData.cardConfigs,
      index
    );
    var indexWithinConfig = cards.getIndexWithinConfig(
      mixedNutsCardData.cardConfigs,
      index
    );

    debugLog.debugLog(
      "addCardFrontAtIndex",
      "Doug: addCardFrontAtIndex: index = " + index
    );
    debugLog.debugLog(
      "addCardFrontAtIndex",
      "Doug: addCardFrontAtIndex: cardConfigs = " +
        JSON.stringify(mixedNutsCardData.cardConfigs)
    );

    debugLog.debugLog(
      "addCardFrontAtIndex",
      "Doug addCardFrontAtIndex cardConfig = " + JSON.stringify(cardConfig)
    );

    addCardFront(parent, cardConfig, index, indexWithinConfig);
  }

  // Use code to figure out how many of each card we need.
  for (cardConfig of mixedNutsCardData.cardConfigs) {
    debugLog.debugLog(
      "addCardFrontAtIndex",
      "Doug: cardConfig = " + JSON.stringify(cardConfig)
    );
    cardConfig.count = calculatePlayerBasedInstanceCount(cardConfig);
  }

  var gNumCards = 0;
  function getNumCards() {
    // Wait until we're asked to calculate so system configs can be applied.
    if (gNumCards === 0) {
      gNumCards = cards.getNumCardsFromConfigs(mixedNutsCardData.cardConfigs);
    }
    return gNumCards;
  }

  function getCardConfigByTitle(title) {
    for (var i = 0; i < mixedNutsCardData.cardConfigs.length; i++) {
      var cardConfig = mixedNutsCardData.cardConfigs[i];
      if (cardConfig.title == title) {
        return cardConfig;
      }
    }
    return null;
  }

  // This returned object becomes the defined value of this module
  return {
    getNumCards: getNumCards,
    addCardFront: addCardFront,
    addCardFrontAtIndex: addCardFrontAtIndex,
    addCardBack: addCardBack,
    getConfigByTitle: getCardConfigByTitle,
  };
});
