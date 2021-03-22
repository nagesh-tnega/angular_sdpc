import { Component, OnInit } from '@angular/core';
import { MapDataService } from 'src/app/map-data.service';
import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import {OSM, Vector as VectorSource} from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';

declare var jQuery: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
	
	state: any;
	district: any; 
	//block
	block:any;
	map: Map;
	vectorLayer2: any; 
	vectorLayer3:any;
  constructor(private mapdataService: MapDataService) { }

  ngOnInit(): void {
  	this.retrieveData();
  	//Jquery
  	(function ($) {
      $(".accordion").click(function() {
      	if (this.className == 'accordion active_a') {
	    		if ($(this).val() == 'region_based') {
	      			$('#region_based_div').hide();
	    		} 
	    	}else{
	    		if ($(this).val() == 'region_based') {
	      			$('#region_based_div').show();
	    		} 
	    	}
    		this.classList.toggle("active_a");
      });
    })(jQuery);
  }

  retrieveData(): void {
    this.mapdataService.getAll()
      .subscribe(
        data => {
          this.state = data;
          console.log(data);
        },
        error => {
          console.log(error);
        },
        () =>{
        	(function ($) {
        		$('.ajax-loader').hide();
        	})(jQuery);
        	this.mapData();
        }
        );
  }

  districtData(): void {
  	this.mapdataService.getDistrict()
      	.subscribe(
	        data => {
	          this.district = data;
	          console.log(data);
	        },
	        error => {
	          console.log(error);
	        },
	        () =>{
	        	this.mapDistrictData();
	        }
        );
  }
  //Block 

  BlockData(): void {
	this.mapdataService.getBlock()
		.subscribe(
		  data => {
			this.block = data;
			console.log(data);
		  },
		  error => {
			console.log(error);
		  },
		  () =>{
			  this.mapBlockData();
		  }
	  );
}


  	mapData(): void{
	  	var geojsonFeature = this.state.tn_state;
	    //Map
	    var vectorSource = new VectorSource({
	  		features: (new GeoJSON()).readFeatures(geojsonFeature, {featureProjection: 'EPSG:3857'})
		});
		var vectorLayer = new VectorLayer({
				title:"Tamil nadu Map",
				visible: true,
	            baseLayer: true,
	  			source: vectorSource,
		});
		// Map Define
		 this.map = new Map({
		    target: 'map',
		    layers: [
		           	vectorLayer
		    ],
		    view: new View({
		        center:[8781480.570496075, 1224732.6162325153],
		        zoom:7
		    })
	    });	
  	}
  	mapDistrictData(): void {
  		var geojsonDistrictFeature = this.district.tn_district;
  		//console.log(geojsonDistrictFeature);
	    //Map
	    var vectorDistrictSource = new VectorSource({
	  		features: (new GeoJSON()).readFeatures(geojsonDistrictFeature, {featureProjection: 'EPSG:3857'})
		});
		 var vectorLayer2 = new VectorLayer({
			title:"Tamil nadu District block Map",
			visible: true,
            baseLayer: false,
  			source: vectorDistrictSource,
		});
		this.map.addLayer(vectorLayer2);
  	}
	//Block
	  mapBlockData(): void {
		var geojsonBlockFeature = this.block.tn_blocks;
		//console.log(geojsonDistrictFeature);
	  //Map
	  var vectorBlockSource = new VectorSource({
			features: (new GeoJSON()).readFeatures(geojsonBlockFeature, {featureProjection: 'EPSG:3857'})
	  });
	   var vectorLayer3 = new VectorLayer({
		  title:"Tamil nadu District block Map",
		  visible: true,
		  baseLayer: false,
			source: vectorBlockSource,
	  });
	  this.map.addLayer(vectorLayer3);
	} 

  	onCheckboxChange(e) {
	    if(e.target.value == 'district'){
	    	if(e.target.checked){
	    		this.districtData();
	    	}else{
	    		//this.map.removeLayer(this.vectorLayer2);
	    	}
	    }
		else if(e.target.value == 'block'){
	    	if(e.target.checked){
	    		this.BlockData();
	    	}else{
	    		//this.map.removeLayer(this.vectorLayer3);
	    	}
	    }
  	}

	  //Block

	  
	


}
