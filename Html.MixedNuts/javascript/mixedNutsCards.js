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
  debugLogModule,
  htmlUtils,
  mixedNutsCardData,
  domStyle
) {
  var debugLog = debugLogModule.debugLog;

  //-----------------------------------------
  //
  // Constants
  //
  //-----------------------------------------
  const minicardWidth = 30;
  const minicardBorderWidth = 4;
  const minicardHeight = minicardWidth * 1.4;
  const dropShadowClass = "drop_shadow";

  const minicardCollectionWidth = minicardWidth * 3;
  const minicardCollectionHeight = minicardHeight + 2 * minicardBorderWidth;

  const defaultFontSizePx = 36;

  //-----------------------------------------
  //
  // Functions
  //
  //-----------------------------------------
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

    htmlUtils.addImage(parentNode, ["coin", "dark-shadowed"], "coin");
  }

  function renderMixedNutsCustom(parentNode, customRendering) {
    // Parent is a flex row.
    domStyle.set(parentNode, {
      display: "flex",
      "flex-direction": "row",
      "align-items": "center",
      "justify-content": "center",
    });

    // Left of row: all 4 nuts in a box, 2 and 2.
    var nutRowsNode = htmlUtils.addDiv(parentNode, ["nut-rows"], "nutRows");
    // First row: peanut plus almond plus.
    var firstRowNode = htmlUtils.addDiv(nutRowsNode, ["nut-row"], "firstRow");
    htmlUtils.addImage(
      firstRowNode,
      ["peanut", "dark-shadowed", "nut-image"],
      "peanut"
    );
    htmlUtils.addDiv(firstRowNode, ["plus"], "plus", "+");
    htmlUtils.addImage(
      firstRowNode,
      ["almond", "dark-shadowed", "nut-image"],
      "almond"
    );
    htmlUtils.addDiv(firstRowNode, ["plus"], "plus", "+");

    // Second row: cashew and macadamia.
    var secondRowNode = htmlUtils.addDiv(nutRowsNode, ["nut-row"], "secondRow");
    htmlUtils.addImage(
      secondRowNode,
      ["cashew", "dark-shadowed", "nut-image"],
      "cashew"
    );
    htmlUtils.addDiv(secondRowNode, ["plus"], "plus", "+");
    htmlUtils.addImage(
      secondRowNode,
      ["macadamia", "dark-shadowed", "nut-image"],
      "macadamia"
    );

    // Right of row: n points node.
    insertSomethingEqualsPointsNode(parentNode, customRendering.points);
  }

  function renderHotSpiceCustom(parentNode, customRendering) {
    // +1 per peanut.
    htmlUtils.addDiv(parentNode, ["plus"], "plus", "+");
    htmlUtils.addImage(parentNode, ["coin", "dark-shadowed"], "coin");
    htmlUtils.addDiv(parentNode, ["per"], "per", "/");
    htmlUtils.addImage(parentNode, ["peanut", "dark-shadowed"], "peanut");
  }

  function renderHoneyRoastedCustom(parentNode, customRendering) {
    // Table maps card type to bonus.
    var nutToBonusMap = customRendering.nutToBonusMap;
    // Parent is a column of rows.
    domStyle.set(parentNode, {
      display: "flex",
      "flex-direction": "column",
      "align-items": "center",
      "justify-content": "center",
    });

    // Child is nut rows.
    var nutRowsNode = htmlUtils.addDiv(parentNode, ["nut-rows"], "nut-rows");

    for (var nut in nutToBonusMap) {
      // Each row is a row of cells.
      var rowNode = htmlUtils.addDiv(nutRowsNode, ["nut-row"], "nut-row");
      // Add a plus
      htmlUtils.addDiv(rowNode, ["plus"], "plus", "+");
      // Add the nut image.
      htmlUtils.addImage(
        rowNode,
        [nut, "dark-shadowed", "nut-image"],
        nut + "Image"
      );
      // Add an equals and the points.
      insertSomethingEqualsPointsNode(rowNode, nutToBonusMap[nut]);
    }
  }

  const gCustomRenderersByClass = {
    "mixed-nuts": renderMixedNutsCustom,
    "hot-spice": renderHotSpiceCustom,
    "honey-roasted": renderHoneyRoastedCustom,
  };

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
        ["special_image", specialImageClass, "dark-shadowed"],
        "specialImage"
      );
    }
  }

  function addCustomRendering(parentNode, cardConfig) {
    debugLog("addCustomRendering", "cardConfig = ", JSON.stringify(cardConfig));
    var customRendering = cardConfig.customRendering;
    console.assert(customRendering, "customRendering is null");

    var customRenderingWrapperNode = htmlUtils.addDiv(
      parentNode,
      ["custom-rendering-wrapper", cardConfig.class],
      "custom-rendering-wrapper"
    );

    if (customRendering.useClassToIndexFunction) {
      var customRenderer = gCustomRenderersByClass[cardConfig.class];
      console.assert(
        customRenderer,
        "No custom renderer for " + cardConfig.class
      );
      customRenderer(customRenderingWrapperNode, customRendering);
    } else {
      if (customRendering.customRenderingImageClasses) {
        for (
          var i = 0;
          i < customRendering.customRenderingImageClasses.length;
          i++
        ) {
          addNthSpecialImage(
            customRenderingWrapperNode,
            customRendering.customRenderingImageClasses[i],
            i,
            customRendering.specialImagesSeparator
          );
        }
      }
    }
    debugLog(
      "addCustomRendering",
      "customRendering = ",
      JSON.stringify(customRendering)
    );
    debugLog(
      "addCustomRendering",
      "customRendering.wrapperScale = ",
      JSON.stringify(customRendering.wrapperScale)
    );
    if (customRendering.wrapperScale) {
      var scale = customRendering.wrapperScale;
      var marginAsPercent = Math.floor((1 - scale) * 50);
      debugLog("addCustomRendering", "scale = ", JSON.stringify(scale));
      domStyle.set(customRenderingWrapperNode, {
        zoom: `${scale}`,
      });
    }

    return customRenderingWrapperNode;
  }

  function addPlayerIndicator(parent, cardConfig, indexWithinConfig) {
    var countConfigs = cardConfig.countConfigs;
    debugLog(
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
      ["card-collection"],
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

  function addCardCorners(parent, cardConfig) {
    var cardClass = cardConfig.class;

    htmlUtils.addImage(
      parent,
      [cardClass, dropShadowClass, "component_image", "index0"],
      "component_image"
    );
    htmlUtils.addImage(
      parent,
      [cardClass, dropShadowClass, "component_image", "index1"],
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
      ["desk", "dark-shadowed"],
      "desk"
    );
    htmlUtils.addImage(deskNode, ["noSymbol"], "noSymbol");
    return cannotBeCraftedNode;
  }

  function maybeAddStandardCraftingInfo(parentNode, cardConfig) {
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
    addCardCorners(parent, cardConfig);
    addPlayerIndicator(parent, cardConfig, indexWithinConfig);

    var mainWrapper = htmlUtils.addDiv(parent, ["main_wrapper"], "mainWapper");
    if (cardConfig.title) {
      var imageNode = htmlUtils.addDiv(
        mainWrapper,
        ["title"],
        "title",
        cardConfig.title
      );
      var fontSize = defaultFontSizePx;
      if (cardConfig.fontAdjustment) {
        fontSize = Math.floor(fontSize * cardConfig.fontAdjustment);
      }
      domStyle.set(imageNode, "font-size", `${fontSize}px`);
    }

    maybeAddStandardCraftingInfo(mainWrapper, cardConfig);

    if (cardConfig.customRendering) {
      addCustomRendering(mainWrapper, cardConfig);
    }

    maybeAddStandardFloorPenalty(mainWrapper, cardConfig);
  }

  function addCardBack(parent, index) {
    var backNode = htmlUtils.addCard(parent, ["back", "mixed-nuts"], "back");

    cards.setCardSize(backNode);

    var insetNode = htmlUtils.addDiv(backNode, ["inset"], "inset");

    var imageNode = htmlUtils.addImage(
      insetNode,
      ["mixed-nuts"],
      "mixed-nuts-back-image"
    );
    htmlUtils.addDiv(insetNode, ["title"], "title", "Mixed Nuts");

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

    var gradient = `linear-gradient(
      to bottom,
      ${cardConfig.color} 0%,
      white 15%,
      white 85%,
      ${cardConfig.color} 100%
    )`;

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

    debugLog(
      "addCardFrontAtIndex",
      "Doug: addCardFrontAtIndex: index = " + index
    );
    debugLog(
      "addCardFrontAtIndex",
      "Doug: addCardFrontAtIndex: cardConfigs = " +
        JSON.stringify(mixedNutsCardData.cardConfigs)
    );

    debugLog(
      "addCardFrontAtIndex",
      "Doug addCardFrontAtIndex cardConfig = " + JSON.stringify(cardConfig)
    );

    addCardFront(parent, cardConfig, index, indexWithinConfig);
  }

  // Use code to figure out how many of each card we need.
  for (cardConfig of mixedNutsCardData.cardConfigs) {
    debugLog(
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
