define(['dojo/_base/declare',
 'jimu/BaseWidget',
 'esri/geometry/Point',
 'esri/layers/graphics',
 'esri/layers/FeatureLayer',
 'esri/layers/GraphicsLayer',
 'esri/map',
// 'jimu/loaderplugins/jquery-loader!//code.jquery.com/jquery-1.11.2.min.js',
 
 // WARNING!! Mandatory to put this line: 'code.jquery.com/jquery-1.11.2.min.js' into resource array in init.js in stemapp folder and then upload it to server!!
 // jquery module colorbox needs JQuery already loaded while loading itself (colorbox is used when DETAILS_PANEL is set to true)
 // loading both here in define does not ensure loading order, so this workaround is the only thing that I found
 
 'dojo/on',									
 'dojo/DeferredList',						
 'esri/symbols/PictureMarkerSymbol',
 'esri/graphic',
 'dojo/topic',
 'dojo/_base/lang',
 'dijit/Menu',
 'dijit/RadioMenuItem',
 'dijit/MenuSeparator',
 'dijit/form/ComboButton',
 'dojo/dom',
 'jimu/MapManager', 
 'dijit/Tooltip',
 './colorbox',
 './OtherFunctions',
 './idangerousswiper',
 ],
function(declare, BaseWidget, Point, graphics, FeatureLayer, GraphicsLayer, map,on, 
	DeferredList,PictureMarkerSymbol,Graphic, topic, lang, 
	Menu, RadioMenuItem, MenuSeparator, ComboButton, dom, MapManager, Tooltip) {
  return declare([BaseWidget], {
	name: 'Photographs',
    baseClass: 'jimu-widget-Photographs',
    
    postCreate: function() {
      this.inherited(arguments);
      console.log('postCreate');
    },

    startup: function() {
      
      this.inherited(arguments);
      console.log('startup');

    },
    onOpen: function(){
      console.log('onOpen');
      
    /////////////////////////////////////////
/////////////////CAN BE EDITED START///////////////
    /////////////////////////////////////////
 
FIELDNAME_NUMBER = ["Number2"];//if Used, the ordering when widget starts is done according to Number
//FIELDNAME_TITLE = ["nazev"];
FIELDNAME_TITLE = ["Title"];
//FIELDNAME_SHORTDESC = ["popis"];
FIELDNAME_SHORTDESC = ["Short_desc"];
//FIELDNAME_IMAGEURL = ["url_foto"];
FIELDNAME_IMAGEURL = ["Image_URL"];
FIELDNAME_ADDRESS = ["Address"];
FIELDNAME_WEBSITE = ["url_foto"];
//FIELDNAME_DESC1 = ["popis"];
FIELDNAME_DESC1 = ["Desc1"];
//FIELDNAME_DESC2 = ["datace"];
FIELDNAME_DESC2 = ["Desc2"];
//FIELDNAME_DESC3 = ["zdroj"];
FIELDNAME_DESC3 = ["Desc3"];
FIELDNAME_DESC4 = ["Desc4"];
FIELDNAME_DESC5 = ["Desc5"];
//FIELDNAME_YEAR =["datace"]; 	//IS USED FOR ORDERING BY YEAR, NOT SHOWN IN PANELS - SHOULD BE A NUMBER ONLY
FIELDNAME_YEAR =["Desc1"]; 
//FIELDNAME_SOURCE =["zdroj"]; 	//IS USED FOR ORDERING BY SOURCE, NOT SHOWN IN PANELS
FIELDNAME_SOURCE =["Desc2"]; 	
FIELDNAME_TAB = ["Tab_Name"];
FIELDNAME_ID = ["Shortlist_ID"];  
DETAILS_PANEL = true;  
ORDERING = true;
ORDER_ENTRIES_BY = FIELDNAME_TITLE;
ASCENDING = true;
IMGSOURCE = ["http://pokusslatinany.jecool.net/resources/images/icons"];
TAB_ORDER = []; 
TAB_NAMES = []; 
POINT_LAYERS_NOT_TO_BE_SHOWN_AS_TABS = "";
COLOR_ORDER = "green,red,blue,purple,black";
SUPPORTING_LAYERS_THAT_ARE_CLICKABLE = "Trails|Tramway|Neighborhoods|Convention Center";
			// If there's more than one layer, use the "|" character as delimiter
			// If the tabs are defined using a single layer, you can optionally use parameters TAB_NAMES,TAB_ORDER 
			// to override the tab order and names defined in that layer without editing the layer.
			// If you specify TAB_NAMES: a) all tabs must be included in TAB_NAMES, whether or not
			// you want to rename them, b) TAB_ORDER must be specified too,
			// c) TAB_NAMES order must correspond with TAB_ORDER. For example:
			// var TAB_ORDER = ['Design', 'Fun', 'Food'];
			// var TAB_NAMES = [
				// {'Design': 'Design'},
				// {'Fun': 'Activities'},
				// {'Food': 'Snacks'}
			// ];
			
		     //  POINT_LAYERS_NOT_TO_BE_SHOWN_AS_TABS = "Light rail stations | Bus stops";
		     
		      
    /////////////////////////////////////////
/////////////////CAN BE EDITED END///////////////
    /////////////////////////////////////////
    
  COLOR_SCHEMES = [
	{name:"blue",iconDir:"blue",iconPrefix:"NumberIconb",color:"#177ff1"},
	{name:"red",iconDir:"red",iconPrefix:"NumberIconr",color:"#fd2d29"},
	{name:"green",iconDir:"green",iconPrefix:"NumberIcong",color:"#22880d"},
	{name:"purple",iconDir:"purple",iconPrefix:"NumberIconp",color:"#9c46fd"},
	{name:"black",iconDir:"black",iconPrefix:"NumberIconK",color:"#000000"}
];  

  
   
temporaryPointLayers=[]; 
_contentLayers = [];
_newLayersAdded = false;
_layerCurrent=[];
_selected =null;
_featureService = false;
_pointsInOneLayer = null;
_map = this.map;
_isMobile = isMobile();
_panel=[];
_iterator = 0;
_SupportLayerSignalMouseOver=[];
_SupportLayerSignalMouseOut=[];
_SupportLayerSignalClick=[];


//////////////////ordering //////////////////
if (ORDERING){
 MYmenu = new Menu({ style: "display: none;"});
   if (ORDER_ENTRIES_BY == FIELDNAME_TITLE){
   var menuItem1 = new RadioMenuItem({
        label: "název",
        checked:true,
        group:'g1',
        onChange: function(){ 
        	ORDER_ENTRIES_BY=FIELDNAME_TITLE;
        	_ActivateLayer(_layerCurrent);
        	  }
    });
   }
   else {
   var menuItem1 = new RadioMenuItem({
        label: "název",
        checked:false,
        group:'g1',
        onChange: function(){ 
        	ORDER_ENTRIES_BY=FIELDNAME_TITLE;
        	_ActivateLayer(_layerCurrent);
        	  }
    });
   } 
    MYmenu.addChild(menuItem1);

if (FIELDNAME_YEAR.length>0){
	if(ORDER_ENTRIES_BY == FIELDNAME_YEAR){
	  var menuItem2 = new RadioMenuItem({
        label: "rok pořízení",
        checked:true,
        group:'g1',
        onChange: function(){ 
        	 ORDER_ENTRIES_BY=FIELDNAME_YEAR;
        	 _ActivateLayer(_layerCurrent);
        	  }
    });
   }
   else {
   	var menuItem2 = new RadioMenuItem({
        label: "rok pořízení",
        checked:false,
        group:'g1',
        onChange: function(){ 
        	 ORDER_ENTRIES_BY=FIELDNAME_YEAR;
        	 _ActivateLayer(_layerCurrent);
        	  }
    });
   }
    MYmenu.addChild(menuItem2);
   }
   
   if (FIELDNAME_SOURCE.length>0){
   	if(ORDER_ENTRIES_BY == FIELDNAME_SOURCE){
   var  menuItem3 = new RadioMenuItem({
        label: "zdroj fotografie",
        checked:true,
        group:'g1',
        onChange: function(){ 
        	ORDER_ENTRIES_BY=FIELDNAME_SOURCE;
        	_ActivateLayer(_layerCurrent);
        	 }
    });
   }
   else {
   	var  menuItem3 = new RadioMenuItem({
        label: "zdroj fotografie",
        checked:false,
        group:'g1',
        onChange: function(){ 
        	ORDER_ENTRIES_BY=FIELDNAME_SOURCE;
        	_ActivateLayer(_layerCurrent);
        	 }
    });
   }
    MYmenu.addChild(menuItem3);
   }
    MYmenu.addChild(new MenuSeparator)
    if (ASCENDING){
    var   menuItem4 = new RadioMenuItem({
        label: "vzestupně",
        checked:true,
        group:'g2',
        onChange: function(){
			ASCENDING = true;
        	_ActivateLayer(_layerCurrent);
        	 }
    });
    }
    else 
    {
    var   menuItem4 = new RadioMenuItem({
        label: "vzestupně",
        checked:false,
        group:'g2',
        onChange: function(){
			ASCENDING = true;
        	_ActivateLayer(_layerCurrent);
        	 }
    });
    }
    MYmenu.addChild(menuItem4);
    if (!ASCENDING){
   var  menuItem5 = new RadioMenuItem({
        label: "sestupně",
        checked:true,
        group:'g2',
        onChange: function(){ 
        	ASCENDING = false;
        	_ActivateLayer(_layerCurrent);
        	 }
    });
    }
    else {
    	 var  menuItem5 = new RadioMenuItem({
        label: "sestupně",
        checked:false,
        group:'g2',
        onChange: function(){ 
        	ASCENDING = false;
        	_ActivateLayer(_layerCurrent);
        	 }
    });
    }
    MYmenu.addChild(menuItem5);
    
    MYmenu.startup();
    
     MYbutton = new ComboButton({
        label: "Řazení záznamů podle",
        dropDown: MYmenu
    });
    MYbutton.placeAt("Ordering");
    MYbutton.startup();
 }   
    
  
//////////////////ordering //////////////////


//checks in which theme it is (box and dart have other names for their panels than jimu-panel)
	if ($(".jimu-panel").length > 0) {
		_panel=".jimu-panel";
}
	else if ($(".box-controller-inner").length > 0) {
		_panel=".box-controller-inner"; 
}
	else if ($(".dart-panel").length > 0) {
		_panel=".dart-panel";
}
Array.prototype.mergeSort = mergeSort;
_map.setInfoWindowOnClick(false);
		var layers = [];
		$.each(_map.graphicsLayerIds, function(i, id){
			layers.push(_map.getLayer(id));

		});
		var newLayers = [];
		var featServUrl = [];
		var featServLayerIndex = [];
		var featServLayerID = null;
		var layerType;
		var _newAliasAssigned;
				$.each(layers, function(index, layer){
			if(layer.layerType){
				layerType = layer.layerType;
			}else{
				layerType = layer.type;
			}
			if (layer.url && (layerType === 'ArcGISFeatureLayer' || layerType === 'Feature Layer') && !layer.id.match(/^csv_/)) {
				_featureService = true;
				featServLayerID = layer;
				featServUrl.push(layer.url);
				featServLayerIndex.push(index);
			}

			if(layer.graphics && layer.geometryType === 'esriGeometryPoint'){
				if(layer.graphics.length < 1){
					on(layer, 'onUpdateEnd', function(){
						buildLayers(layer, featServLayerIndex);
					});
				}else{
					buildLayers(layer, featServLayerIndex); 
				}
			}
		});
function getValueCI(fields) {
	var found;
	var value;
	$.each(this,function(index,value){
		var attName = index;
		$.grep(fields, function(field, index){
			if(attName.toUpperCase() == field.toUpperCase())
				found = attName;
		});
	});
	value = this[found];
	if ($.trim(value).length == 0) value = null;
	return value;
}
function onWindowResize()
{
        if(MapManager.getInstance().isMobileInfoWindow){
          _map.setInfoWindow(MapManager.getInstance()._mapInfoWindow);
          this.popup = _map.infoWindow;
          MapManager.getInstance().isMobileInfoWindow = false;
        }
      }
function buildLayers(layer, featServLayerIndex){
			var atts = layer.graphics[0].attributes;
			atts.getValueCI = getValueCI;
			if(atts.getValueCI(FIELDNAME_TAB)){
				if(!_pointsInOneLayer)
					_pointsInOneLayer = layer;
				else
					return;
					
				var fields = layer.fields;
				var themes = [];
				$.each(layer.graphics, function(index, graphic){
					var featAtts = graphic.attributes;
					featAtts.getValueCI = getValueCI;
					if(themes.indexOf(featAtts.getValueCI(FIELDNAME_TAB)) < 0) {
						themes.push(featAtts.getValueCI(FIELDNAME_TAB));
						var newObject = {id: featAtts.getValueCI(FIELDNAME_TAB), features: []};
						_newThemes.push(newObject);
					}

					$.grep(_newThemes, function(theme, index){
						if(theme.id === featAtts.getValueCI(FIELDNAME_TAB)){
							theme.features.push(graphic);
						}
					});
				});
				if(!_newLayersAdded){
					$.each(_newThemes, function(index, theme){
						var featServiceFeatureSet = new tasks.FeatureSet();
						featServiceFeatureSet.features = theme.features;
						//create a feature collection
				        var featureCollection = {
				          "layers":[{
				          		"id": String(theme.id),
								"layerDefinition": null,
								"featureSet": featServiceFeatureSet
					       }]
				        };

			        	featServiceFeatureSet.geometryType = "esriGeometryPoint";
			        	featureCollection.layers[0].layerDefinition = createLayerDefinition(fields);

						var newLayer = new GraphicsLayer({id: String(theme.id)});
						newLayer.title = String(theme.id);
						newLayer.featureCollection = featureCollection;
						newLayers.push(newLayer);
					});
				}
				_newLayersAdded = true;
				var newTabsAlias = [];
				if(TAB_NAMES){
					$.each(TAB_NAMES, function(i, tab){
						for(var key in tab){
							newTabsAlias.push(tab[key]);
						}
					});
				};
				var tabOrder = [];
				if(TAB_ORDER.length){
					$.each(newLayers, function(i, layer){
						var layerIdLC = layer.id.toLowerCase();
						if(TAB_NAMES){
							layer.alias = newTabsAlias[TAB_ORDER.indexOf(layerIdLC)];
							if(TAB_ORDER.indexOf(layerIdLC) != -1){
								tabOrder[TAB_ORDER.indexOf(layerIdLC)] = layer;
							}else{
								console.log('Error in overriding existing order');
							}
						}else{
							if(TAB_ORDER.indexOf(layerIdLC) != -1){
								tabOrder[TAB_ORDER.indexOf(layerIdLC)] = layer;
							}else{
								console.log('Error in overriding existing order');
							}
						}
					});

					$.each(tabOrder, function(i, tab){
						layers.push(tab);
						_map.addLayer(tab);
					});
					_newAliasAssigned = true;

				}else{
					$.each(newLayers, function(i,layer){
						layers.push(layer);
						_map.addLayer(layer);
					});
				}
			}
		}


		var featServRequests = 0;
		if(_featureService){

			var fields = [];
			var features = [];
			var featServiceFeatureSet = new tasks.FeatureSet();
			var oldLayers = [];
			var requestIndex = -1;
			var requests = [];
	function qCallback(graphics){
				var atts = graphics.features[0].attributes;
					atts.getValueCI = getValueCI;
					var featureCollection;

					if(!atts.getValueCI(FIELDNAME_TAB)){
						$.each(graphics.features, function(i, feature){
							features.push(feature);
						});
						$.each(graphics.fields, function(i, field){
							fields.push(field);
						});
						featServiceFeatureSet.features = features;
						//create a feature collection
				        featureCollection = {
				          "layerDefinition": null,
				          "featureSet": featServiceFeatureSet
				        };
				        if(graphics.geometryType === "esriGeometryPoint"){
				        	featServiceFeatureSet.geometryType = "esriGeometryPoint";
					      	featureCollection.layerDefinition = createLayerDefinition(fields);

					    }
					    else if(graphics.geometryType === "esriGeometryPolyline"){
					    	featServiceFeatureSet.geometryType = "esriGeometryPolyline";
					        featureCollection.layerDefinition = {
					          "geometryType": "esriGeometryPolyLine",
					          "drawingInfo": {
					            "renderer": {
									"type": "esriSLS",
									"style": "esriSLSDot",
									"color": [115,76,0,255],
									"width": 1
					              }
					          },
					          "fields": fields
					        };
					    }
					}
					else{
						if(!_pointsInOneLayer){
							_pointsInOneLayer = true;
							var themes = [];
							$.each(graphics.features, function(i, feature){
								var featAtts = feature.attributes;
								featAtts.getValueCI = getValueCI;
								if(themes.indexOf(featAtts.getValueCI(FIELDNAME_TAB)) < 0) {
									themes.push(featAtts.getValueCI(FIELDNAME_TAB));
									var newObject = {id: featAtts.getValueCI(FIELDNAME_TAB), features: []};
									_newThemes.push(newObject);
								}

								$.grep(_newThemes, function(theme, i){
									if(theme.id === featAtts.getValueCI(FIELDNAME_TAB))
									theme.features.push(feature);
								});

							});
							$.each(graphics.features[0].attributes, function(i, field){
								fields.push(field);
							});

							$.each(_newThemes, function(i, theme){
								var featServiceFeatureSet = new tasks.FeatureSet();
								featServiceFeatureSet.features = theme.features;
								//create a feature collection
						        featureCollection = {
						          "layers":[{
						          		"id": String(theme.id),
										"layerDefinition": null,
										"featureSet": featServiceFeatureSet
							       }]
						        };

					        	featServiceFeatureSet.geometryType = "esriGeometryPoint";
					        	createLayerDefinition(fields);
					        	featureCollection.layers[0].layerDefinition = createLayerDefinition(fields);

								var newLayer = new GraphicsLayer({id: String(theme.id)});
								newLayer.title = String(theme.id);
								newLayer.featureCollection = featureCollection;
								newLayers.push(newLayer);
							});
						}
					}
					//Add feature collection to the appropriate layer
					if(!_pointsInOneLayer)
						layers[featServLayerIndex[requestIndex]].featureCollection = featureCollection;
			}
			function qErrback(error){
				console.log("feature layer query error: ", error);
			}

			$.each(layers, function(index, layer){
				if(layer.url && (layer.type == "Feature Layer" || layer.layerType == "ArcGISFeatureLayer") && layer.geometryType == 'esriGeometryPoint'){
					var query = new esri.tasks.Query();
					query.outFields = ['*'];
					query.where = "1=1";
					requestIndex++;
					requests.push(layer.queryFeatures(query, qCallback, qErrback));
				}
			});

			var list = new DeferredList(requests);
			list.then(function(results){
				if (_map.loaded ) {
					organizeLayers(results);
				}
			});

        };
function organizeLayers(results) {
        	if(_pointsInOneLayer){
				var newTabsAlias = [];
				if(TAB_NAMES){
					$.each(TAB_NAMES, function(i, tab){
						for(var key in tab){
							newTabsAlias.push(tab[key]);
						}
					});
				}
				var tabOrder = [];
				if(TAB_ORDER.length){
					$.each(newLayers, function(i, layer){
						var layerIdLC = layer.id.toLowerCase();
						if(TAB_NAMES){
							layer.alias = newTabsAlias[TAB_ORDER.indexOf(layerIdLC)];
							if(TAB_ORDER.indexOf(layerIdLC) != -1){
								tabOrder[TAB_ORDER.indexOf(layerIdLC)] = layer;
							}else{
								console.log('Error in overriding existing order');
							}
						}else{
							if(TAB_ORDER.indexOf(layerIdLC) != -1){
								tabOrder[TAB_ORDER.indexOf(layerIdLC)] = layer;
							}else{
								console.log('Error in overriding existing order');
							}
						}
					});
					$.each(tabOrder, function(i, tab){
						if(!_newAliasAssigned){
							layers.push(tab);
							_map.addLayer(tab);
						}
					});
				}else{
					if(!_newLayersAdded){
						$.each(newLayers, function(i,layer){
							layers.push(layer);
							_map.addLayer(layer);
						});
					}
					_newLayersAdded = true;
				}
				$.each(results, function(i, result){
					var index = layers.indexOf(result[1].features[0]._layer);
					if(index > -1 ){
						layers.splice(index, 1);
					}
					_map.removeLayer(_map.getLayer(result[1].features[0]._layer.id));
				});
			}
			initMap(layers);
		}

		if(_map.loaded && !_featureService){
			initMap(layers);
		} else if(!_featureService){
			on(_map,"onLoad",function(){
				initMap(layers);
			});
		}

function initMap(layers) {
	pointLayers = [];
	supportLayers = [];
	temporarySupportLayers = [];
	var arrExemptions = [];
	$.each(POINT_LAYERS_NOT_TO_BE_SHOWN_AS_TABS.split("|"), function(index, value) {
		arrExemptions.push($.trim(value).toLowerCase());
	});
	var supportingLayersThatAreClickable = [];
	$.each(SUPPORTING_LAYERS_THAT_ARE_CLICKABLE.split("|"), function(index, value) {
		supportingLayersThatAreClickable.push($.trim(value).toLowerCase());
	});

	var graphicTitle;

	$.each(layers, function(index,value){
		if(!value.visibleAtMapScale && value.type == "Feature Layer" && value.url) //pokud feature layer není viditelná v současném měřítku, nezobrazovat
			return;
		if(value.id === 'labels'){
			setTimeout(function(){
				if(value.featureLayers[0].graphics[0].attributes.getValueCI && value.featureLayers[0].graphics[0].attributes.getValueCI(FIELDNAME_TAB))
					_map.removeLayer(_map.getLayer(value.id));
				else
					return;
			}, 950);
		}
		var graphicAtts;
		var geomType;

		if(value.graphics.length > 0){
			graphicAtts = value.graphics[0].attributes;
			graphicTitle = value.name;
			geomType = value.geometryType;
		}else{
			if(value.visible && value.featureCollection){
				graphicAtts = getFeatureSet(value).features[0].attributes;
				graphicTitle = String(value.title);
				geomType = value.featureCollection.layers[0].featureSet.geometryType;
			}else{
				return;
			}
		}

		$.grep(_map.graphicsLayerIds, function(n,i){
			if(_map.getLayer(n) && _map.getLayer(n).id){
				if(_map.getLayer(n).id == getID(value)){
					var mapLayerId = null;
					if(_map.getLayer(n).id.split('_').length > 2){
						mapLayerId = _map.getLayer(n).id.split('_').slice(0,-1).join('_');
					}
					else if(_map.getLayer(n).id.split('_').length == 2 && _map.getLayer(n).id.indexOf('csv') == -1){
						mapLayerId = _map.getLayer(n).id.split('_').slice(0,-1)[0];
					} else {
						mapLayerId = _map.getLayer(n).id;
					}
				}
			}else{
				return;
			}
		});

		if(!graphicAtts)
			return;
		if (value.id.indexOf('mapNotes') == -1 && (value.url == null || value.type == "CSV" || value.type == "Feature Layer" || value.layerType == "ArcGISFeatureLayer")) {
			if(!value.graphics){
				_map.removeLayer(_map.getLayer(value.id));
				return;
			}
			else if (
				geomType == "esriGeometryPoint" &&
				$.inArray(graphicTitle.toLowerCase(), arrExemptions) == -1
			) { 	if($.inArray("Name", FIELDNAME_TITLE) == -1 && graphicAtts.NAME || graphicAtts.Name || graphicAtts.name)
						FIELDNAME_TITLE.push("Name");
					if($.inArray("PIC_URL", FIELDNAME_IMAGEURL) == -1 && graphicAtts.PIC_URL || graphicAtts.Pic_URL || graphicAtts.Pic_Url || graphicAtts.pic_url)
						FIELDNAME_IMAGEURL.push("PIC_URL");
					if($.inArray("THUMB_URL", FIELDNAME_IMAGEURL) == -1 && graphicAtts.THUMB_URL || graphicAtts.Thumb_URL ||graphicAtts.Thumb_Url || graphicAtts.thumb_url)
						FIELDNAME_IMAGEURL.push("THUMB_URL");
					if($.inArray("PICTURE", FIELDNAME_IMAGEURL) == -1 && graphicAtts.PICTURE || graphicAtts.Picture || graphicAtts.picture)
						FIELDNAME_IMAGEURL.push("PICTURE");
					if($.inArray("DESCRIPTION", FIELDNAME_DESC1) == -1 && graphicAtts.DESCRIPTION || graphicAtts.Description || graphicAtts.description)
						FIELDNAME_DESC1.push("Description");
					if($.inArray("Caption", FIELDNAME_DESC1) == -1 && graphicAtts.CAPTION || graphicAtts.Caption || graphicAtts.caption)
						FIELDNAME_DESC1.push("Caption");
					pointLayers.push(value);
			} else {
				if($.inArray("Name", FIELDNAME_TITLE) == -1 && graphicAtts.NAME || graphicAtts.Name || graphicAtts.name)
					FIELDNAME_TITLE.push("Name");
				if($.inArray("PIC_URL", FIELDNAME_IMAGEURL) == -1 && graphicAtts.PIC_URL || graphicAtts.Pic_URL ||graphicAtts.Pic_Url || graphicAtts.pic_url)
					FIELDNAME_IMAGEURL.push("PIC_URL");
				if($.inArray("THUMB_URL", FIELDNAME_IMAGEURL) == -1 && graphicAtts.THUMB_URL || graphicAtts.Thumb_URL || graphicAtts.Thumb_Url || graphicAtts.thumb_url)
					FIELDNAME_IMAGEURL.push("THUMB_URL");
				if($.inArray("PICTURE", FIELDNAME_IMAGEURL) == -1 && graphicAtts.PICTURE || graphicAtts.Picture || graphicAtts.picture)
					FIELDNAME_IMAGEURL.push("PICTURE");
				if($.inArray("DESCRIPTION", FIELDNAME_DESC1) == -1 && graphicAtts.DESCRIPTION || graphicAtts.Description || graphicAtts.description)
					FIELDNAME_DESC1.push("Description");
				if($.inArray("Caption", FIELDNAME_DESC1) == -1 && graphicAtts.CAPTION || graphicAtts.Caption || graphicAtts.caption)
					FIELDNAME_DESC1.push("Caption");
				supportLayers.push(value);
				temporarySupportLayers.push(value);
			}
		}
		else {
			// if the layer has an url property (meaning that it comes from a service), just
			// keep going...it will remain in the map, but won't be query-able.
		}
	});
var supportLayer;
	$.each(supportLayers,function(index,value) {
		supportLayer = _map.getLayer($.grep(_map.graphicsLayerIds, function(n,i){return _map.getLayer(n).id == getID(value);})[0]);
		if (supportLayer == null) return;
		$.each(supportLayer.graphics,function(index,value) {
			// assign extra method to handle case sensitivity
			value.attributes.getValueCI = getValueCI;
		});

		var supportLayerName = supportLayer.name;
		
		if ($.inArray(supportLayer.name.toLowerCase(), supportingLayersThatAreClickable) > -1) {
			_SupportLayerSignalMouseOver[_iterator]=on(supportLayer, "mouse-over", baselayer_onMouseOver);
			_SupportLayerSignalMouseOut[_iterator]=on(supportLayer, "mouse-out", baselayer_onMouseOut);
			_SupportLayerSignalClick[_iterator]=on(supportLayer, "click", baselayer_onClick);
			_iterator = _iterator +1;
		} 
	});



	var contentLayer;
	var colorScheme;
	var colorOrder = COLOR_ORDER.split(",");
	var colorIndex;
	var newLayers = [];

	$.each(pointLayers,function(index,value) {
		var title = value.alias || value.title || value.name;

		$.grep(_map.graphicsLayerIds, function(n,i){
			if(_map.getLayer(n) && _map.getLayer(n).id){
				if(_map.getLayer(n).id == getID(value)){
					_map.getLayer(n).setVisibility(false);	
					var mapLayerId = null;
					if(_map.getLayer(n).id.split('_').length > 2){
						mapLayerId = _map.getLayer(n).id.split('_').slice(0,-1).join('_');
					}
					else if(_map.getLayer(n).id.split('_').length == 2 && _map.getLayer(n).id.indexOf('csv') == -1){
						mapLayerId = _map.getLayer(n).id.split('_').slice(0,-1)[0];
					} else {
						mapLayerId = _map.getLayer(n).id;
					}
				}
			}else{
				return;
			}
		});
		var layerId;
		if(value.graphics.length > 0){
			layerId = value.name;
		}else{
			layerId = value.id;
		}
		if(_pointsInOneLayer){
				$.each(_newThemes, function(index, theme){
					if(layerId === String(theme.id)){
						newLayers.push(value);
						return false;
					}
				});
				var index = newLayers.indexOf(value);
				if(index < 0 )
					return true;
		}

		var features;
		if(value.graphics.length > 0){
			features = value.graphics;
		}else{
			features = getFeatureSet(value).features;
		}
		$.each(features, function(index,value) {
			value.attributes.getValueCI = getValueCI; });
		features=features.mergeSort(SortBySomething);
		$.each(features, function(index,value) {
			value.attributes[FIELDNAME_ID] = index + 1; // assign internal shortlist id which is then used if fieldname NUMBER is not present
			if(index === 0){
				if(!value.attributes[FIELDNAME_NUMBER] && !value.attributes.NUMBER && !value.attributes.number)
					FIELDNAME_NUMBER = FIELDNAME_ID;
			}
		});
		/* color index assignment is a weird bit of voodoo.  first thing to consider
		   is that layers names actually appear in tabs in reverse order (i.e. last layer in
		   is leftmost tab).  this means that we have to invert the color index for things to match
		   right.  also, using modulus to handle overflow -- when there are more layers
		   than colors.  so, we end up re-using colors but keeping the sequence. */
		if(_pointsInOneLayer)
			colorIndex = (index ) % colorOrder.length;
		else
			colorIndex = (pointLayers.length - index - 1) % colorOrder.length;

		colorScheme = $.grep(COLOR_SCHEMES, function(n,i){
			return n.name.toLowerCase() == $.trim(colorOrder[colorIndex].toLowerCase());
		})[0];
		
		contentLayer = buildLayer(
					features,
					colorScheme.iconDir,
					colorScheme.iconPrefix
					);
		contentLayer.color = colorScheme.color;
		contentLayer.title = title;
		
		_LayerOnMouseOverSignal=on(contentLayer, "mouse-over", layer_onMouseOver);
		_LayerOnMouseOutSignal=on(contentLayer, "mouse-out", layer_onMouseOut);
		_LayerOnClick=on(contentLayer, "click", layer_onClick);
		temporaryPointLayers.push(contentLayer);
		_map.addLayer(contentLayer);
		_contentLayers.push(contentLayer);
	});

	if(!_pointsInOneLayer)
		_contentLayers.reverse();

	if (_contentLayers.length > 1) {
		$.each(_contentLayers, function(index, value){
			$(".jimu-widget-Photographs #tabs").append('<div class="tab" tabindex="0" onclick="_map.infoWindow.hide(),_ActivateLayer(_contentLayers[' + index + '])">' + value.title + '</div>');

		});
	}
	else if(_contentLayers.length < 1) {
		console.log('NO VALID SHORTLIST POINT LAYERS'); 
		return false;
	}
	else {
		$(".jimu-widget-Photographs .tab").css("display", "none");
	}
	
	

	_ActivateLayer(_contentLayers[0]);

	_ExtentChangeSignal = on(_map, 'extent-change', function(){
		refreshList();
		});
	_WidgetMoveSignal = topic.subscribe('/dnd/move/stop', lang.hitch(this, function(){  
  		refreshList(); 
		})); 
	_WindowResizeSignal=on(window, 'resize', function(){ onWindowResize()
		});
	onWindowResize();
}

/////////////////////////////////event handlers
function tile_onClick(e) {
	if(e.which == 1 || e.which == 2 || e.which == 3){
		_tileClick = true;
	}else{
		_tileClick = false;
	}

	var id = parseInt($(this).attr("id").substring(4));
//	preSelection();
	_selected = $.grep(_layerCurrent.graphics,function(n,i)
	{return n.attributes.getValueCI(FIELDNAME_ID) == id;})[0];
	postSelection();
	
	
}

function layer_onClick(event)
{
	//preSelection();
	_selected = event.graphic;
	postSelection();
	Tooltip.hide(_node);
}

function layer_onMouseOver(event)
{
	_map.setMapCursor("pointer");
	var graphic = event.graphic;
			if(!graphic.attributes.getValueCI)
				graphic.attributes.getValueCI = getValueCI;
				var _Title = "<font size=2>"+ graphic.attributes.getValueCI(FIELDNAME_TITLE)+ "</font>";
				_node = graphic.getNode();
				 new Tooltip ({
					connectId:[_node],
					label:_Title,
					showDelay:50
				});
				Tooltip.show(_Title,_node);
}

function layer_onMouseOut(event)
{
	_map.setMapCursor("default");
	Tooltip.hide(_node);
}
function baselayer_onMouseOver(event)
{
	if (_isMobile) return;
	_map.setMapCursor("pointer");
	var graphic = event.graphic;
	if(!graphic.attributes.getValueCI)
		graphic.attributes.getValueCI = getValueCI;
	var _Title = "<font size=2>"+ graphic.attributes.getValueCI(FIELDNAME_TITLE)+ "</font>";
				_node = graphic.getNode();
				 new Tooltip ({
					connectId:[_node],
					label:_Title,
					showDelay:50
				});
				Tooltip.show(_Title,_node);
}

function baselayer_onMouseOut(event)
{
	if (_isMobile) return;
	_map.setMapCursor("default");
	Tooltip.hide(_node);
}

function baselayer_onClick(event) {
	buildPopup(event.graphic, event.mapPoint, "true");
	Tooltip.hide(_node);
}


function getFeatureSet(layer)
{
	return layer.url ? layer.featureCollection.featureSet : layer.featureCollection.layers[0].featureSet;
}


	

function createLayerDefinition(fields){
	return layerDefinition = {
      "objectIdField": "__OBJECTID",
      "geometryType": "esriGeometryPoint",
      "drawingInfo": {
        "renderer": {
          "type": "simple",
          "symbol": {
            "type": "esriPMS",
            "url": "http://static.arcgis.com/images/Symbols/Shapes/GreenDiamondLargeB.png",
            "width": 15,
            "height": 15
          }
        }
      },
      "fields": fields
    };
}


function _ActivateLayer(layer) {
//	preSelection();
	_selected = null;
	postSelection();
	_layerCurrent = layer;

	var tab = $.grep($(".jimu-widget-Photographs .tab"), function(n,i){return $(n).text() == _layerCurrent.title;})[0];
	$(".jimu-widget-Photographs .tab").removeClass("tab-selected");
	$(tab).addClass("tab-selected");
	var themeIndex = $('.jimu-widget-Photographs .tab-selected').index();

	
	$.each(_contentLayers,function(index,value){
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
	$.each(_layerCurrent.graphics,function(index,value){
		if (_map.extent.contains(value.geometry)) {
			var bodik =_map.toScreen(value.geometry);
			var GeometryCheck=_geometryCheckInsideWidget(bodik);
			if(!GeometryCheck){
			display = "visible";
			visibleFeatures = true;
			}
		 else {
			display = "none";
		}}
		else {
				display = "none";
			}
		tile = $('<li tabindex="0" id="item'+value.attributes.getValueCI(FIELDNAME_ID)+'" style="display:'+display+'">');
		img = $('<img src="'+value.attributes.getValueCI(FIELDNAME_IMAGEURL)+'"alt>');
		footer = $('<div class="footer"></div>');
		num = $('<div class="num" style="background-color:'+_layerCurrent.color+'">'+value.attributes.getValueCI(FIELDNAME_NUMBER)+'</div>');
		title = $('<div class="blurb">'+value.attributes.getValueCI(FIELDNAME_TITLE)+'</div>');
		$(footer).append(num);
		$(footer).append(title);
		$(tile).append(footer);
		$(tile).append(img);
		$(".jimu-widget-Photographs #myList").append(tile);
	});
	
	// event handlers have to be re-assigned every time you load the list...
	$(".jimu-widget-Photographs ul.tilelist li").click(tile_onClick);
	if(!visibleFeatures){
		$('.jimu-widget-Photographs .noFeature').css('display', 'block');
						}
	else{
		$('.jimu-widget-Photographs .noFeature').css('display', 'none');
		}

}


function _geometryCheckInsideWidget(bodik){ 		 
				var offsetleft = $(_panel).offset().left-$("#map").offset().left;
				var offsettop = $(_panel).offset().top-$("#map").offset().top; //offsets of the widget window with respect to map left upper corner
				if(bodik.x>offsetleft&&bodik.x <($(_panel).width()+offsetleft))
				{
				if(bodik.y>(offsettop)&&bodik.y <($(_panel).height()+offsettop ))
					{
					return true;
					}
				}
					else return false;
				}
			
function refreshList() {
	var tile;
	var visibleFeatures = false;
	setTimeout(function(){
		$.each(_layerCurrent.graphics,function(index,value){
			//find the corresponding tile
			tile = findTile(value.attributes.getValueCI(FIELDNAME_ID));
			if (_map.extent.contains(value.geometry)) {
				//checks if graphic point is covered by a widget window if not in border
				var bodik =_map.toScreen(value.geometry);
			var GeometryCheck = _geometryCheckInsideWidget(bodik);	
			if(!GeometryCheck){ 
			visibleFeatures = true;
				if ($(tile).css("display") == "none"){					 
					$(tile).stop().fadeIn(500);
				;}
			}
			 else {
				if ($(tile).css("display") != "none"){ $(tile).stop().fadeOut(500);
				}
			}}
			else  $(tile).stop().fadeOut(500);
		});

		if(!visibleFeatures){
			$('.jimu-widget-Photographs .noFeature').css('display', 'block');
		}
		else{
			$('.jimu-widget-Photographs .noFeature').css('display', 'none');
		}
	}, 100);
}

function buildLayer(arr,iconDir,root) {
	var layer = new GraphicsLayer();
	var pt;
	var sym;
	$.each(arr,function(index,value){
		pt = new Point(value.geometry.x,value.geometry.y,value.geometry.spatialReference);    
		sym = createPictureMarkerSymbol(IMGSOURCE+"/"+iconDir+"/"+root+value.attributes.getValueCI(FIELDNAME_NUMBER)+".png");
		layer.add(new Graphic(pt,sym,value.attributes));
	});
	return layer;
}
function createPictureMarkerSymbol(url)
{
	return new PictureMarkerSymbol(
			url,
			24,
			30
		).setOffset(
			3,
			8
		);
}			
  
 }, //on open end

    onClose: function(){
      console.log('onClose');

$.each(pointLayers,function(index,value) { 				   //sets original point layers to visible state
			$.grep(_map.graphicsLayerIds, function(n,i){
			if(_map.getLayer(n) && _map.getLayer(n).id){
				if(_map.getLayer(n).id == getID(value)){
					_map.getLayer(n).setVisibility(true);}
					}
			});
			});	
$.each(temporaryPointLayers,function(index,value) { 	     //removes added graphic layers from map
			$.grep(_map.graphicsLayerIds, function(n,i){
			if(_map.getLayer(n) && _map.getLayer(n).id){
				if(_map.getLayer(n).id == getID(value)){
					_map.removeLayer(_map.getLayer(n));}
					}
			});
			});		
		$(".jimu-widget-Photographs #tabs").empty();		//clears the tabs		 
      _map.infoWindow.hide();	//hides infowindow if one is open
      							
      _ExtentChangeSignal.remove();
      _LayerOnMouseOverSignal.remove(); //mozna zbytecne!!
	  _LayerOnMouseOutSignal.remove();
	  _LayerOnClick.remove();
      _WidgetMoveSignal.remove();
      _map.setInfoWindowOnClick(true);
   		if (_SupportLayerSignalMouseOver){
   			$(_SupportLayerSignalMouseOver).each(function(index) {
   				console.log(index)
 		 _SupportLayerSignalMouseOver[index].remove();
		});
		}
		if (_SupportLayerSignalMouseOut){
   			$(_SupportLayerSignalMouseOut).each(function(index) {
 		 _SupportLayerSignalMouseOut[index].remove();
		});
		}
   		if (_SupportLayerSignalClick){
   			$(_SupportLayerSignalClick).each(function(index) {
 		 _SupportLayerSignalClick[index].remove();
		});
		}
     if (ORDERING){
      MYmenu.destroy();
      MYbutton.destroy();
     }
    },

    onMinimize: function(){
      console.log('onMinimize');
    },

    onMaximize: function(){
      console.log('onMaximize');
    },

    onSignIn: function(credential){
      console.log('onSignIn');
    },

    onSignOut: function(){
      console.log('onSignOut');
    }
  });
});