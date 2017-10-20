import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {Message} from '../interfaces';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
 declare var google: any;

@Component({
    selector: 'app-search',
    templateUrl: './maps.component.html',
    styleUrls: [],
    providers: [],
})

export class MapsComponent implements OnInit {
    options: any;
    overlays: any[];

    dialogVisible: boolean;

    markerTitle: string;

    selectedPosition: any;

    infoWindow: any;

    draggable: boolean;

    msgs: Message[] = [];

    ngOnInit() {
        this.options = {
            center: {lat: 36.890257, lng: 30.707417},
            zoom: 12
        };
        this.initOverlays();
        this.infoWindow = new google.maps.InfoWindow();
    }

    handleMapClick(event) {
        this.dialogVisible = true;
        this.selectedPosition = event.latLng;
    }
    handleOverlayClick(event) {
        this.msgs = [];
        let isMarker = event.overlay.getTitle != undefined;

        if (isMarker) {
            let title = event.overlay.getTitle();
            this.infoWindow.setContent('' + title + '');
            this.infoWindow.open(event.map, event.overlay);
            event.map.setCenter(event.overlay.getPosition());
            this.msgs.push({severity: 'info', summary: 'Marker Selected', detail: title});
        }
        else {
            this.msgs.push({severity: 'info', summary: 'Shape Selected', detail: ''});
        }
    }

    addMarker() {
        this.overlays.push(new google.maps.Marker({
          position: {
            lat: this.selectedPosition.lat(),
            lng: this.selectedPosition.lng()
          }, title: this.markerTitle, draggable: this.draggable}));
        this.markerTitle = null;
        this.dialogVisible = false;
    }
    handleDragEnd(event) {
        this.msgs = [];
        this.msgs.push({severity: 'info', summary: 'Marker Dragged', detail: event.overlay.getTitle()});
    }

    initOverlays() {
        if (!this.overlays || !this.overlays.length) {
            this.overlays = [
                new google.maps.Marker({position: {lat: 36.879466, lng: 30.667648}, title: "Konyaalti"}),
                new google.maps.Marker({position: {lat: 36.883707, lng: 30.689216}, title: "Ataturk Park"}),
                new google.maps.Marker({position: {lat: 36.885233, lng: 30.702323}, title: "Oldtown"}),
                new google.maps.Polygon({paths: [
                    {lat: 36.9177, lng: 30.7854}, {lat: 36.8851, lng: 30.7802},{lat: 36.8829, lng: 30.8111}, {lat: 36.9177, lng: 30.8159}
                ], strokeOpacity: 0.5, strokeWeight: 1, fillColor: '#1976D2', fillOpacity: 0.35
                }),
                new google.maps.Circle({
                  center: {
                    lat: 36.90707,
                    lng: 30.56533
                  },
                  fillColor: '#1976D2',
                  fillOpacity: 0.35,
                  strokeWeight: 1,
                  radius: 1500}),
                new google.maps.Polyline({
                  path: [{lat: 36.86149, lng: 30.63743}, {lat: 36.86341, lng: 30.72463}],
                   geodesic: true, strokeColor: '#FF0000', strokeOpacity: 0.5, strokeWeight: 2})
            ];
        }
    }

    zoomIn(map) {
        map.setZoom(map.getZoom() + 1);
    }

    zoomOut(map) {
        map.setZoom(map.getZoom() - 1);
    }

    clear() {
        this.overlays = [];
    }
}
