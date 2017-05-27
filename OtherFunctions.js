function SortBySomething(a,b){	
  var aNumber = a.attributes.getValueCI(ORDER_ENTRIES_BY);
  var bNumber = b.attributes.getValueCI(ORDER_ENTRIES_BY);
     if (aNumber === null){
      return 1;  
    }
    else if(bNumber === null){
      return -1;
    }
    else if(aNumber === bNumber){
      return 0;
 	}
    else if(ASCENDING) {
      return ((aNumber < bNumber) ? -1 :  1 );
    }
    else if(!ASCENDING) {
      return ((aNumber < bNumber) ? 1 :-1);
    }
}

function isMobile() {
	var android = navigator.userAgent.match(/Android/i) ? true : false;
	var blackberry = navigator.userAgent.match(/BlackBerry/i) ? true : false;
	var ios = navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
	var windows = navigator.userAgent.match(/IEMobile/i) ? true : false;
	return (android || blackberry || ios || windows);
}
function mergeSort(compare) {
    var length = this.length,
        middle = Math.floor(length / 2);
    if (!compare) {
      compare = function(left, right) {
        if (left < right)
          return -1;
        if (left == right)
          return 0;
        else
          return 1;
      };
    }
    if (length < 2)
      return this;
   	var result = merge(
      this.slice(0, middle).mergeSort(compare),
      this.slice(middle, length).mergeSort(compare),
      compare
    )
   	return result;
  }
function merge(left, right, compare) {
    var result = [];
    while (left.length > 0 || right.length > 0) {
      if (left.length > 0 && right.length > 0) {
        if (compare(left[0], right[0]) <= 0) {
          result.push(left[0]);
          left = left.slice(1);
        }
        else {
          result.push(right[0]);
          right = right.slice(1);
        }
      }
      else if (left.length > 0) {
        result.push(left[0]);
        left = left.slice(1);
      }
      else if (right.length > 0) {
        result.push(right[0]);
        right = right.slice(1);
      }
    }
    return result;
}

function getID(layer)
{
	return layer.url ? layer.id : layer.id;
}

function _ActivateLayer(layer) {
    _layerCurrent = layer;
    var tab = $.grep($(".jimu-widget-Photographs .tab"), function(n, i) {
        return $(n).text() == _layerCurrent.title;
    })[0];
    $(".jimu-widget-Photographs .tab").removeClass("tab-selected");
    $(tab).addClass("tab-selected");
    var themeIndex = $('.jimu-widget-Photographs .tab-selected').index();
    $.each(_contentLayers, function(index, value) {
        value.setVisibility(value == _layerCurrent);
    });
    $(".jimu-widget-Photographs #myList").empty();
    var display;
    var tile;
    var img;
    var footer;
    var num;
    var title;
    var visibleFeatures = false;
    _layerCurrent.graphics=_layerCurrent.graphics.mergeSort(SortBySomething);
    $.each(_layerCurrent.graphics, function(index, value) {
        if (_map.extent.contains(value.geometry)) {
          var  bodik = _map.toScreen(value.geometry);
           
            function _geometryCheckInsideWidget(bodik) {
                //internal coordinate system starts at left upper corner of the map
                var offsetleft = $(_panel).offset().left - $(
                    "#map").offset().left;
                var offsettop = $(_panel).offset().top - $(
                    "#map").offset().top; //offset of the widget window with respect to map left upper corner
                if (bodik.x > offsetleft && bodik.x < ($(_panel)
                    .width() + offsetleft)) {
                    if (bodik.y > (offsettop) && bodik.y < ($(
                        _panel).height() + offsettop)) {
                        return true;
                    }
                } else return false;
            }
            
            var GeometryCheck = _geometryCheckInsideWidget(bodik)
            if (!GeometryCheck) {
                display = "visible";
                visibleFeatures = true;
            } else {
                display = "none";
            }
        } else {
            display = "none";
        }
        tile = $('<li tabindex="0" id="item' + value.attributes.getValueCI(
                FIELDNAME_ID) + '" style="display:' + display +
            '">');
		var imgSource = value.attributes.getValueCI(FIELDNAME_IMAGEURL)
		if(imgSource.indexOf("http") !== -1){
			img = $('<img src="'+imgSource+'"alt>');
		}
		else {
			img = $('<img src="http://'+imgSource+'"alt>');
		}
        footer = $('<div class="footer"></div>');
        num = $('<div class="num" style="background-color:' +
            _layerCurrent.color + '">' + value.attributes.getValueCI(
                FIELDNAME_NUMBER) + '</div>');
        title = $('<div class="blurb">' + value.attributes.getValueCI(
            FIELDNAME_TITLE) + '</div>');
        $(footer).append(num);
        $(footer).append(title);
        $(tile).append(footer);
        $(tile).append(img);
        $(".jimu-widget-Photographs #myList").append(tile);
    });
   
        // event handlers have to be re-assigned every time you load the list...
    $(".jimu-widget-Photographs ul.tilelist li").click(tile_onClick);

    if (!visibleFeatures) {
        $('.jimu-widget-Photographs .noFeature').css('display', 'block');
    } else {
        $('.jimu-widget-Photographs .noFeature').css('display', 'none');
    }
}

function preSelection() {
    if (_selected) {
        var tile = findTile(_selected.attributes.getValueCI(FIELDNAME_ID));
    }
}

function postSelection(skipPopup) {
    if (_selected == null) {
        _map.infoWindow.hide();
    } else {
        setTimeout(function() {
            try {
                _selected.getDojoShape().moveToFront();
            } catch (err) {
                console.log("problem with 'moveToFront()'...");
            }
        }, 10);
        buildPopup(_selected, _selected.geometry);
    }
}

function tile_onClick(e) {
    if (e.which == 1 || e.which == 2 || e.which == 3) {
        _tileClick = true;
    } else {
        _tileClick = false;
    }
    var id = parseInt($(this).attr("id").substring(4));
 //   preSelection();
    _selected = $.grep(_layerCurrent.graphics, function(n, i) {
        return n.attributes.getValueCI(FIELDNAME_ID) == id;
    })[0];
    postSelection();
}

function buildPopup(feature, geometry, baseLayerClick) {
    var atts = feature.attributes;
    if (!atts.getValueCI) atts.getValueCI = getValueCI;
    var title = atts.getValueCI(FIELDNAME_TITLE);
    var shortDesc = atts.getValueCI(FIELDNAME_SHORTDESC);
    var picture = atts.getValueCI(FIELDNAME_IMAGEURL);
	if(picture.indexOf("http") == -1){
		picture = "http://"+picture;
	}
    var website = prependURLHTTP(atts.getValueCI(FIELDNAME_WEBSITE));
     contentDiv = $("<div></div>");
    if (shortDesc) {
        $(contentDiv).append($(
            "<div class='description' tabindex='0'></div>").html(
            shortDesc));
    }
    if (picture) {
        var pDiv = $("<div></div>").addClass("infoWindowPictureDiv");
        if (DETAILS_PANEL) {
            $(pDiv).append($(new Image()).attr("src", picture));
            $(pDiv).css("cursor", "pointer");
        } else { // no details panel
            if (website) {
                var a = $("<a tabindex='-1'></a>").attr("href", website).attr(
                    "target", "_blank");
                var newImage = $(new Image()).attr("src", picture);
                $(newImage).attr('alt', '');
                $(a).append($(newImage));
                $(pDiv).append(a);
            } else {
                $(pDiv).append($(new Image()).attr("src", picture));
            }
        }
        $(contentDiv).append(pDiv);
    }
    if (!picture) {
        $(contentDiv).append("<br>");
    }
    if (!DETAILS_PANEL) {
        if (!shortDesc) var desc1 = atts.getValueCI(FIELDNAME_DESC1);
        if (desc1) {
            $(contentDiv).append($(
                "<div class='description' tabindex='0'></div>").html(
                desc1));
        }
        if (website) {
            $(contentDiv).append($('<div class="address"><a href="' +
                website + '" target="_blank">Website</a></div>').css(
                "padding-top", 10));
        }
		$(contentDiv).append($("<div></div>").addClass("zoomTo").attr(
            "tabindex", "0").html("Zoom >>"));
    } else {
        $(contentDiv).append($("<div></div>").addClass("infoWindowLink").attr(
            "tabindex", "0").html("Details "));
		$(contentDiv).append($("<div></div>").addClass("zoomTo").attr(
            "tabindex", "0").html("Zoom >>"));
    }
    _map.infoWindow.setContent("<div>" + contentDiv.html() + "</div>");
    $('.infoWindowLink').last().append($(
        "<span aria-hidden='true' ></span>").html(">>"));
    _map.infoWindow.setTitle(title);
    _map.infoWindow.show(geometry);
    $(".esriPopup .contentPane").scrollTop(0);
    $(".infoWindowLink").click(function(e) {
        showDetails(feature, e);
    });
	
    if (DETAILS_PANEL) {
        $(".infoWindowPictureDiv").click(function(e) {
            showDetails(feature, e);
        });
    }
}


function showDetails(graphic, e) {
    if (!graphic.attributes.getValueCI) graphic.attributes.getValueCI =
        getValueCI;
    var mainDiv = $('<div class="details"></div>');
    var titleDiv = $('<div class="detailsTitle">' + graphic.attributes.getValueCI(
        FIELDNAME_TITLE) + '</div>');
    var leftDiv = $('<div class="leftDiv"></div>');
    var rightDiv = $('<div class="rightDiv"></div>');
	var imageDetail=graphic.attributes.getValueCI(FIELDNAME_IMAGEURL);
	if(imageDetail.indexOf("http") == -1){
		imageDetail = "http://"+imageDetail;
	}
    var imageDiv = $('<img alt="" tabindex="-1" src="' + imageDetail + '">');
    var pictureFrame = $('<div class="pictureFrame" tabindex="-1"></div>');
    $(pictureFrame).append(imageDiv);
    $(leftDiv).append(pictureFrame);
    var address = graphic.attributes.getValueCI(FIELDNAME_ADDRESS);
    if (address) {
        $(leftDiv).append($('<div class="address" tabindex="0">' + address +
            '</div>'));
    }
    var website = prependURLHTTP(graphic.attributes.getValueCI(
        FIELDNAME_WEBSITE));
    if (website) {
        $(leftDiv).append('<div class="address" tabindex="-1"><a href="' +
            website + '" target="_blank">Website</a></div>');
        $(pictureFrame).wrapInner('<a tabindex="-1" href="' + website +
            '" target="_blank"></a>');
    }
    var descFields = [FIELDNAME_DESC1, FIELDNAME_DESC2, FIELDNAME_DESC3,
        FIELDNAME_DESC4, FIELDNAME_DESC5
    ];
    var value;
    $.each(descFields, function(index, field) {
        value = graphic.attributes.getValueCI(field);
        if (value) {
            $(rightDiv).append('<div class="desc" tabindex="0">' +
                value + '</div>');
            if ($(rightDiv).children().length > 0 && index <=
                descFields.length - 1) {
                $(rightDiv).append('<p>');
            }
        }
    });
    $(mainDiv).append(titleDiv);
    $(mainDiv).append("<hr>");
    $(mainDiv).append(leftDiv);
    $(mainDiv).append(rightDiv);
    var activeElement = $(document.activeElement);
    _showingDetails = true;
    $.colorbox({
        html: mainDiv,
        open: true,
        maxHeight: $(document).height() - 100,
        maxWidth: "700px",
        scrolling: false,
        onComplete: function() {},
        onClosed: function() {
            _showingDetails = false;
            activeElement.focus();
        }
    });
    $('.rightDiv').find('p').last().css('display', 'none');
}

function findTile(id) {
    return $.grep($(".jimu-widget-Photographs ul.tilelist li"), function(n,
        i) {
        return n.id == "item" + id;
    })[0];
}

function moveGraphicToFront(graphic) {
    var dojoShape = graphic.getDojoShape();
    if (dojoShape) dojoShape.moveToFront();
}

function prependURLHTTP(url) {
    if (!url || url === "" || url.match(/^mailto:/)) return url;
    if (!/^(https?:\/\/)|^(\/\/)/i.test(url)) return 'http://' + url;
    return url;
}



