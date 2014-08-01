MT.extend("core.BasicTool").extend("core.Emitter")(
	MT.plugins.tools.Brush = function(tools){
		MT.core.BasicTool.call(this, tools);
		this.name = "brush";
	},{
		
		initUI: function(ui){
			MT.core.BasicTool.initUI.call(this, ui);
			var that = this;
			
			this.tools.on(MT.ASSET_SELECTED, function(asset){
				if(that.tools.activeTool != that){
					return;
				}
				that.init(asset);
			});
			
			this.tools.on(MT.ASSET_FRAME_CHANGED, function(asset, frame){
				if(that.tools.activeTool != that){
					return;
				}
				
				that.tools.initTmpObject(that.tools.activeAsset);
				that.tools.tmpObject.frame = that.tools.activeFrame;
			});
		},
		
		lastX: 0,
		lastY: 0,
		
		init: function(asset){
			
			this.tools.unselectObjects();
			asset = asset || this.tools.activeAsset;
			if(!asset){
				return;
			}
			if(asset.contents){
				return;
			}
			this.tools.initTmpObject(asset);
			this.tools.tmpObject.frame = this.tools.activeFrame;
			
			this.tools.setTool(this);
			
			var that = this;
			this.tools.map.handleMouseMove = function(e){
				that.mouseMove(e);
			}
		},
		
		
		mouseDown: function(e){
			
			if(!this.tools.tmpObject){
				if(!this.tools.map.activeObject){
					return;
				}
				if(!this.tools.lastAsset){
					this.tools.lastAsset = this.project.plugins.assetmanager.getById(this.tools.map.activeObject.MT_OBJECT.assetId);
				}
				this.init(this.tools.lastAsset);
				
				return;
			}
			
			this.insertObject();
		},
		
		mouseMove: function(e){
			
			if(e.target != this.tools.map.game.canvas){
				return;
			}
			
			var x = this.tools.tmpObject.x;
			var y = this.tools.tmpObject.y;
			
			this.tools.map._followMouse(e, true);
			
			if(this.ui.events.mouse.down){
				
				if(this.tools.tmpObject.x != this.lastX || this.tools.tmpObject.y != this.lastY){
					this.insertObject();
				}
			}
		},
		
		insertObject: function(){
			var om = this.project.plugins.objectmanager;
			this.tools.map.sync(this.tools.tmpObject, this.tools.tmpObject.MT_OBJECT);
			
			this.tools.tmpObject.MT_OBJECT.frame = this.tools.activeFrame;
			om.insertObject(this.tools.tmpObject.MT_OBJECT);
			
			this.lastX = this.tools.tmpObject.x;
			this.lastY = this.tools.tmpObject.y;
			this.tools.initTmpObject();
			
			this.tools.tmpObject.frame = this.tools.activeFrame;
			this.tools.tmpObject.x = this.lastX;
			this.tools.tmpObject.y = this.lastY;
			
		},
		
		mouseUp: function(e){
			//console.log("upp", e);
		},
		
		deactivate: function(){
			this.tools.removeTmpObject();
			
			this.tools.map.handleMouseMove = this.tools.map.emptyFn;
			this.project.plugins.objectmanager.update();
		},
		
		

	}
);